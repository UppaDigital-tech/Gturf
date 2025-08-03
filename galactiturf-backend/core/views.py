from django.shortcuts import render
from django.db import models

# Create your views here.
from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from django.contrib.auth import login
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views.decorators.http import require_http_methods
from django.utils import timezone
import json

from .models import SubscriptionTier, UserProfile, Game, Booking, Transaction
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer, SubscriptionTierSerializer,
    UserProfileSerializer, UserProfileUpdateSerializer, GameSerializer,
    BookingSerializer, BookingListSerializer, TransactionSerializer,
    PaymentInitializationSerializer, PaymentVerificationSerializer
)
from .services import PaystackService


class UserRegistrationView(generics.CreateAPIView):
    """API endpoint for user registration"""
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Create token for immediate login
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'message': 'User registered successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
            'token': token.key
        }, status=status.HTTP_201_CREATED)


class UserLoginView(APIView):
    """API endpoint for user login"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        login(request, user)
        
        # Get or create token
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
            'token': token.key
        })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    """API endpoint for user logout"""
    try:
        # Delete the user's token
        request.user.auth_token.delete()
        return Response({'message': 'Logout successful'})
    except:
        return Response({'message': 'Logout successful'})


class UserProfileView(generics.RetrieveUpdateAPIView):
    """API endpoint for user profile"""
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user.profile
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return UserProfileUpdateSerializer
        return UserProfileSerializer


class SubscriptionTierListView(generics.ListAPIView):
    """API endpoint for listing subscription tiers"""
    queryset = SubscriptionTier.objects.filter(is_active=True)
    serializer_class = SubscriptionTierSerializer
    permission_classes = [permissions.AllowAny]


class GameListView(generics.ListAPIView):
    """API endpoint for listing games"""
    queryset = Game.objects.filter(is_active=True).order_by('date_time')
    serializer_class = GameSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        location = self.request.query_params.get('location')
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        
        if location:
            queryset = queryset.filter(location__icontains=location)
        if date_from:
            queryset = queryset.filter(date_time__gte=date_from)
        if date_to:
            queryset = queryset.filter(date_time__lte=date_to)
            
        return queryset


class GameDetailView(generics.RetrieveAPIView):
    """API endpoint for game details"""
    queryset = Game.objects.filter(is_active=True)
    serializer_class = GameSerializer
    permission_classes = [permissions.AllowAny]


class BookingCreateView(generics.CreateAPIView):
    """API endpoint for creating bookings"""
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UserBookingsView(generics.ListAPIView):
    """API endpoint for user's bookings"""
    serializer_class = BookingListSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user).order_by('-created_at')


class BookingDetailView(generics.RetrieveAPIView):
    """API endpoint for booking details"""
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)


class UserTransactionsView(generics.ListAPIView):
    """API endpoint for user's transactions"""
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).order_by('-created_at')


class PaymentInitializeView(APIView):
    """API endpoint to initialize payment"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = PaymentInitializationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        subscription_tier_id = serializer.validated_data['subscription_tier_id']
        
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
        
        # Initialize payment with Paystack
        paystack_service = PaystackService()
        callback_url = request.build_absolute_uri('/api/payment/verify/')
        
        result = paystack_service.initialize_payment(
            user=request.user,
            subscription_tier=subscription_tier,
            callback_url=callback_url
        )
        
        if result['success']:
            return Response({
                'message': 'Payment initialized successfully',
                'payment_url': result['data']['authorization_url'],
                'reference': result['data']['reference'],
                'transaction_id': result['transaction'].id
            })
        else:
            return Response(
                {'error': result['message']}, 
                status=status.HTTP_400_BAD_REQUEST
            )


class PaymentVerifyView(APIView):
    """API endpoint to verify payment"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = PaymentVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        reference = serializer.validated_data['reference']
        
        # Verify payment with Paystack
        paystack_service = PaystackService()
        result = paystack_service.verify_payment(reference)
        
        if result['success']:
            return Response({
                'message': result['message'],
                'coins_awarded': result.get('coins_awarded', 0),
                'transaction': TransactionSerializer(result['transaction']).data
            })
        else:
            return Response(
                {'error': result['message']}, 
                status=status.HTTP_400_BAD_REQUEST
            )


@method_decorator(csrf_exempt, name='dispatch')
class PaystackWebhookView(APIView):
    """API endpoint for Paystack webhooks"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        # Get the payload and signature
        payload = request.body.decode('utf-8')
        signature = request.META.get('HTTP_X_PAYSTACK_SIGNATURE', '')
        
        # Process webhook
        paystack_service = PaystackService()
        result = paystack_service.handle_webhook(payload, signature)
        
        if result['success']:
            return Response({'message': result['message']})
        else:
            return Response(
                {'error': result['message']}, 
                status=status.HTTP_400_BAD_REQUEST
            )


class DashboardStatsView(APIView):
    """API endpoint for dashboard statistics"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        profile = user.profile
        
        # Get user statistics
        total_bookings = Booking.objects.filter(user=user).count()
        confirmed_bookings = Booking.objects.filter(user=user, status='confirmed').count()
        completed_bookings = Booking.objects.filter(user=user, status='completed').count()
        total_coins_spent = Booking.objects.filter(user=user).aggregate(
            total=models.Sum('coins_spent')
        )['total'] or 0
        
        # Get recent transactions
        recent_transactions = Transaction.objects.filter(
            user=user, status='success'
        ).order_by('-created_at')[:5]
        
        # Get upcoming bookings
        from django.utils import timezone
        upcoming_bookings = Booking.objects.filter(
            user=user,
            status='confirmed',
            game__date_time__gt=timezone.now()
        ).order_by('game__date_time')[:5]
        
        return Response({
            'user_stats': {
                'coin_balance': profile.coin_balance,
                'subscription_tier': SubscriptionTierSerializer(profile.subscription_tier).data if profile.subscription_tier else None,
                'total_bookings': total_bookings,
                'confirmed_bookings': confirmed_bookings,
                'completed_bookings': completed_bookings,
                'total_coins_spent': total_coins_spent,
            },
            'recent_transactions': TransactionSerializer(recent_transactions, many=True).data,
            'upcoming_bookings': BookingListSerializer(upcoming_bookings, many=True).data,
        })


# Additional utility views
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def health_check(request):
    """Comprehensive health check endpoint"""
    from django.db import connection
    from django.conf import settings
    import sys
    
    health_status = {
        'status': 'healthy',
        'message': 'Galactiturf API is running',
        'timestamp': timezone.now().isoformat(),
        'version': '1.0.0',
        'environment': 'production' if not settings.DEBUG else 'development',
        'python_version': sys.version.split()[0],
        'django_version': settings.VERSION if hasattr(settings, 'VERSION') else 'Unknown'
    }
    
    # Database connectivity check
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        health_status['database'] = 'connected'
    except Exception as e:
        health_status['database'] = f'error: {str(e)}'
        health_status['status'] = 'unhealthy'
    
    # Check critical models
    try:
        from .models import SubscriptionTier, Game
        health_status['models'] = {
            'subscription_tiers': SubscriptionTier.objects.count(),
            'active_games': Game.objects.filter(is_active=True).count()
        }
    except Exception as e:
        health_status['models'] = f'error: {str(e)}'
        health_status['status'] = 'unhealthy'
    
    status_code = 200 if health_status['status'] == 'healthy' else 503
    return Response(health_status, status=status_code)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def api_info(request):
    """API information endpoint"""
    return Response({
        'name': 'Galactiturf API',
        'version': '1.0.0',
        'description': 'Football game booking platform API',
        'endpoints': {
            'auth': {
                'register': '/api/auth/register/',
                'login': '/api/auth/login/',
                'logout': '/api/auth/logout/',
            },
            'user': {
                'profile': '/api/user/profile/',
                'bookings': '/api/user/bookings/',
                'transactions': '/api/user/transactions/',
                'dashboard': '/api/user/dashboard/',
            },
            'games': {
                'list': '/api/games/',
                'detail': '/api/games/{id}/',
            },
            'subscriptions': {
                'tiers': '/api/subscriptions/tiers/',
            },
            'payments': {
                'initialize': '/api/payment/initialize/',
                'verify': '/api/payment/verify/',
                'webhook': '/api/payment/webhook/',
            },
            'booking': {
                'create': '/api/booking/create/',
                'detail': '/api/booking/{id}/',
            }
        }
    })
