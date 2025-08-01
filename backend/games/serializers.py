from rest_framework import serializers
from .models import Game, Booking


class GameSerializer(serializers.ModelSerializer):
    """Serializer for Game model."""
    
    available_slots = serializers.ReadOnlyField()
    is_full = serializers.ReadOnlyField()
    is_upcoming = serializers.ReadOnlyField()
    created_by = serializers.ReadOnlyField(source='created_by.username')
    
    class Meta:
        model = Game
        fields = [
            'id', 'name', 'location', 'date_time', 'coin_price',
            'total_slots', 'booked_slots', 'available_slots',
            'status', 'description', 'created_by', 'is_full',
            'is_upcoming', 'created_at'
        ]
        read_only_fields = ['created_by', 'created_at']


class GameCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating games (admin only)."""
    
    class Meta:
        model = Game
        fields = [
            'name', 'location', 'date_time', 'coin_price',
            'total_slots', 'description'
        ]


class BookingSerializer(serializers.ModelSerializer):
    """Serializer for Booking model."""
    
    user = serializers.ReadOnlyField(source='user.username')
    game_name = serializers.ReadOnlyField(source='game.name')
    game_location = serializers.ReadOnlyField(source='game.location')
    game_date_time = serializers.ReadOnlyField(source='game.date_time')
    
    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'game', 'game_name', 'game_location',
            'game_date_time', 'status', 'coins_paid',
            'booking_reference', 'notes', 'created_at'
        ]
        read_only_fields = ['user', 'booking_reference', 'created_at']


class BookingCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating bookings."""
    
    class Meta:
        model = Booking
        fields = ['game', 'notes']
    
    def validate_game(self, value):
        """Validate that the game can be booked."""
        if value.is_full:
            raise serializers.ValidationError("This game is fully booked.")
        
        if not value.is_upcoming:
            raise serializers.ValidationError("This game is not available for booking.")
        
        # Check if user already has a booking for this game
        user = self.context['request'].user
        if Booking.objects.filter(user=user, game=value, status='confirmed').exists():
            raise serializers.ValidationError("You already have a booking for this game.")
        
        return value
    
    def create(self, validated_data):
        """Create a booking and deduct coins."""
        user = self.context['request'].user
        game = validated_data['game']
        
        # Check if user has sufficient coins
        if not user.has_sufficient_coins(game.coin_price):
            raise serializers.ValidationError("Insufficient coins to book this game.")
        
        # Deduct coins from user
        if not user.deduct_coins(game.coin_price):
            raise serializers.ValidationError("Failed to deduct coins.")
        
        # Book slot in game
        if not game.book_slot():
            # Refund coins if booking fails
            user.add_coins(game.coin_price)
            raise serializers.ValidationError("Failed to book slot.")
        
        # Create booking
        booking = Booking.objects.create(
            user=user,
            game=game,
            coins_paid=game.coin_price,
            notes=validated_data.get('notes', '')
        )
        
        return booking