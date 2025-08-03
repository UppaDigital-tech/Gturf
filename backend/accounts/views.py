from django.shortcuts import render
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer,
    UserProfileSerializer, UserUpdateSerializer
)
from .models import User


class UserRegistrationView(generics.CreateAPIView):
    """View for user registration."""
    
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        """Create a new user and return tokens."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'User registered successfully',
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class UserLoginView(generics.GenericAPIView):
    """View for user login."""
    
    serializer_class = UserLoginSerializer
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        """Authenticate user and return tokens."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Login successful',
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })


class UserProfileView(generics.RetrieveUpdateAPIView):
    """View for user profile."""
    
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        """Return the current user."""
        return self.request.user


class UserUpdateView(generics.UpdateAPIView):
    """View for updating user profile."""
    
    serializer_class = UserUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        """Return the current user."""
        return self.request.user


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_dashboard(request):
    """Get user dashboard data."""
    user = request.user
    
    # Get user's recent bookings
    recent_bookings = user.bookings.filter(status='confirmed').order_by('-created_at')[:5]
    
    # Get user's recent transactions
    recent_transactions = user.transactions.filter(status='success').order_by('-created_at')[:5]
    
    return Response({
        'user': UserProfileSerializer(user).data,
        'recent_bookings': [
            {
                'id': booking.id,
                'game_name': booking.game.name,
                'game_date': booking.game.date_time,
                'status': booking.status,
                'booking_reference': booking.booking_reference
            }
            for booking in recent_bookings
        ],
        'recent_transactions': [
            {
                'id': transaction.id,
                'type': transaction.transaction_type,
                'amount': str(transaction.amount),
                'coins_amount': transaction.coins_amount,
                'status': transaction.status,
                'date': transaction.created_at
            }
            for transaction in recent_transactions
        ]
    })
