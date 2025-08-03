from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Game, Booking
from .serializers import (
    GameSerializer, GameCreateSerializer,
    BookingSerializer, BookingCreateSerializer
)


class GameListView(generics.ListAPIView):
    """View for listing all games."""
    
    queryset = Game.objects.filter(status='upcoming').order_by('date_time')
    serializer_class = GameSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        """Filter games based on query parameters."""
        queryset = super().get_queryset()
        
        # Filter by location
        location = self.request.query_params.get('location', None)
        if location:
            queryset = queryset.filter(location__icontains=location)
        
        # Filter by date range
        date_from = self.request.query_params.get('date_from', None)
        if date_from:
            queryset = queryset.filter(date_time__date__gte=date_from)
        
        date_to = self.request.query_params.get('date_to', None)
        if date_to:
            queryset = queryset.filter(date_time__date__lte=date_to)
        
        return queryset


class GameDetailView(generics.RetrieveAPIView):
    """View for game details."""
    
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = [permissions.AllowAny]


class GameCreateView(generics.CreateAPIView):
    """View for creating games (admin only)."""
    
    queryset = Game.objects.all()
    serializer_class = GameCreateSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def perform_create(self, serializer):
        """Set the creator of the game."""
        serializer.save(created_by=self.request.user)


class BookingListView(generics.ListAPIView):
    """View for listing user's bookings."""
    
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Return bookings for the current user."""
        return Booking.objects.filter(user=self.request.user).order_by('-created_at')


class BookingCreateView(generics.CreateAPIView):
    """View for creating bookings."""
    
    serializer_class = BookingCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        """Create a booking and return response."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()
        
        return Response({
            'message': 'Game booked successfully!',
            'booking': BookingSerializer(booking).data
        }, status=status.HTTP_201_CREATED)


class BookingDetailView(generics.RetrieveAPIView):
    """View for booking details."""
    
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Return bookings for the current user."""
        return Booking.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def cancel_booking(request, booking_id):
    """Cancel a booking."""
    booking = get_object_or_404(Booking, id=booking_id, user=request.user)
    
    if booking.status != 'confirmed':
        return Response({
            'error': 'Only confirmed bookings can be cancelled.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if booking.cancel_booking():
        return Response({
            'message': 'Booking cancelled successfully. Coins have been refunded.',
            'booking': BookingSerializer(booking).data
        })
    else:
        return Response({
            'error': 'Failed to cancel booking.'
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_bookings_summary(request):
    """Get user's booking summary."""
    user = request.user
    
    total_bookings = user.bookings.count()
    confirmed_bookings = user.bookings.filter(status='confirmed').count()
    cancelled_bookings = user.bookings.filter(status='cancelled').count()
    completed_bookings = user.bookings.filter(status='completed').count()
    
    total_coins_spent = sum(booking.coins_paid for booking in user.bookings.filter(status='confirmed'))
    
    return Response({
        'total_bookings': total_bookings,
        'confirmed_bookings': confirmed_bookings,
        'cancelled_bookings': cancelled_bookings,
        'completed_bookings': completed_bookings,
        'total_coins_spent': total_coins_spent,
        'current_balance': user.coin_balance
    })
