from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from django.utils import timezone
import uuid
import requests

from .serializers import (
    UserSerializer, UserRegistrationSerializer, UserLoginSerializer,
    SubscriptionTierSerializer, GameSerializer, BookingSerializer,
    TransactionSerializer, PaystackWebhookSerializer
)
from accounts.models import User
from subscriptions.models import SubscriptionTier
from games.models import Game, Booking
from payments.models import Transaction


class UserRegistrationView(APIView):
    """View for user registration."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'User registered successfully',
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    """View for user login."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Login successful',
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    """View for user profile."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SubscriptionTierListView(generics.ListAPIView):
    """View for listing subscription tiers."""
    
    permission_classes = [permissions.AllowAny]
    queryset = SubscriptionTier.objects.filter(is_active=True)
    serializer_class = SubscriptionTierSerializer


class GameListView(generics.ListAPIView):
    """View for listing games."""
    
    permission_classes = [permissions.AllowAny]
    queryset = Game.objects.filter(status='upcoming')
    serializer_class = GameSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # Filter by date if provided
        date_filter = self.request.query_params.get('date', None)
        if date_filter:
            queryset = queryset.filter(date_time__date=date_filter)
        return queryset


class GameDetailView(generics.RetrieveAPIView):
    """View for game details."""
    
    permission_classes = [permissions.AllowAny]
    queryset = Game.objects.all()
    serializer_class = GameSerializer


class BookingListView(generics.ListCreateAPIView):
    """View for listing and creating bookings."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BookingSerializer
    
    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BookingDetailView(generics.RetrieveDestroyAPIView):
    """View for booking details and cancellation."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BookingSerializer
    
    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)
    
    def destroy(self, request, *args, **kwargs):
        booking = self.get_object()
        if booking.cancel_booking():
            return Response({'message': 'Booking cancelled successfully'})
        return Response(
            {'error': 'Cannot cancel this booking'}, 
            status=status.HTTP_400_BAD_REQUEST
        )


class PaystackInitializeView(APIView):
    """View for initializing Paystack payment."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        from django.conf import settings
        
        subscription_tier_id = request.data.get('subscription_tier_id')
        try:
            subscription_tier = SubscriptionTier.objects.get(
                id=subscription_tier_id, 
                is_active=True
            )
        except SubscriptionTier.DoesNotExist:
            return Response(
                {'error': 'Invalid subscription tier'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Generate unique reference
        reference = f"GT_{uuid.uuid4().hex[:16].upper()}"
        
        # Create transaction record
        transaction = Transaction.objects.create(
            user=request.user,
            transaction_type='subscription',
            amount=subscription_tier.price,
            coins_involved=subscription_tier.coins_awarded,
            reference_id=reference,
            description=f"Subscription purchase: {subscription_tier.name}"
        )
        
        # Initialize Paystack payment
        paystack_data = {
            'email': request.user.email,
            'amount': int(subscription_tier.price * 100),  # Convert to kobo
            'reference': reference,
            'callback_url': f"{request.build_absolute_uri('/api/payments/verify/')}",
            'metadata': {
                'transaction_id': transaction.id,
                'subscription_tier_id': subscription_tier.id,
                'user_id': request.user.id
            }
        }
        
        headers = {
            'Authorization': f'Bearer {settings.PAYSTACK_SECRET_KEY}',
            'Content-Type': 'application/json'
        }
        
        try:
            response = requests.post(
                'https://api.paystack.co/transaction/initialize',
                json=paystack_data,
                headers=headers
            )
            response.raise_for_status()
            
            paystack_response = response.json()
            
            return Response({
                'authorization_url': paystack_response['data']['authorization_url'],
                'reference': reference,
                'transaction_id': transaction.id
            })
            
        except requests.RequestException as e:
            transaction.mark_failed({'error': str(e)})
            return Response(
                {'error': 'Payment initialization failed'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def paystack_verify_view(request):
    """View for verifying Paystack payment."""
    from django.conf import settings
    
    reference = request.GET.get('reference')
    if not reference:
        return Response(
            {'error': 'Reference is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        transaction = Transaction.objects.get(reference_id=reference)
    except Transaction.DoesNotExist:
        return Response(
            {'error': 'Transaction not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Verify with Paystack
    headers = {
        'Authorization': f'Bearer {settings.PAYSTACK_SECRET_KEY}'
    }
    
    try:
        response = requests.get(
            f'https://api.paystack.co/transaction/verify/{reference}',
            headers=headers
        )
        response.raise_for_status()
        
        paystack_response = response.json()
        
        if paystack_response['status'] and paystack_response['data']['status'] == 'success':
            # Payment successful
            transaction.mark_successful(
                paystack_transaction_id=paystack_response['data']['id'],
                metadata=paystack_response['data']
            )
            
            # Add coins to user
            user = transaction.user
            user.add_coins(transaction.coins_involved)
            
            # Update subscription tier if it's a subscription purchase
            if transaction.transaction_type == 'subscription':
                subscription_tier_id = transaction.metadata.get('subscription_tier_id')
                if subscription_tier_id:
                    try:
                        subscription_tier = SubscriptionTier.objects.get(id=subscription_tier_id)
                        user.subscription_tier = subscription_tier
                        user.save()
                    except SubscriptionTier.DoesNotExist:
                        pass
            
            return Response({
                'message': 'Payment verified successfully',
                'transaction': TransactionSerializer(transaction).data
            })
        else:
            # Payment failed
            transaction.mark_failed(metadata=paystack_response['data'])
            return Response(
                {'error': 'Payment verification failed'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
    except requests.RequestException as e:
        return Response(
            {'error': 'Payment verification failed'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def paystack_webhook_view(request):
    """View for handling Paystack webhooks."""
    from django.conf import settings
    import hashlib
    import hmac
    
    # Verify webhook signature
    signature = request.headers.get('X-Paystack-Signature')
    if not signature:
        return Response(
            {'error': 'Missing signature'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Verify signature
    expected_signature = hmac.new(
        settings.PAYSTACK_SECRET_KEY.encode(),
        request.body,
        hashlib.sha512
    ).hexdigest()
    
    if not hmac.compare_digest(signature, expected_signature):
        return Response(
            {'error': 'Invalid signature'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    serializer = PaystackWebhookSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(
            serializer.errors, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    event = serializer.validated_data['event']
    data = serializer.validated_data['data']
    
    if event == 'charge.success':
        reference = data['reference']
        try:
            transaction = Transaction.objects.get(reference_id=reference)
            
            if data['status'] == 'success':
                transaction.mark_successful(
                    paystack_transaction_id=data['id'],
                    metadata=data
                )
                
                # Add coins to user
                user = transaction.user
                user.add_coins(transaction.coins_involved)
                
                # Update subscription tier if it's a subscription purchase
                if transaction.transaction_type == 'subscription':
                    subscription_tier_id = transaction.metadata.get('subscription_tier_id')
                    if subscription_tier_id:
                        try:
                            subscription_tier = SubscriptionTier.objects.get(id=subscription_tier_id)
                            user.subscription_tier = subscription_tier
                            user.save()
                        except SubscriptionTier.DoesNotExist:
                            pass
            else:
                transaction.mark_failed(metadata=data)
                
        except Transaction.DoesNotExist:
            pass
    
    return Response({'status': 'success'})
