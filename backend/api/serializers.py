from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from accounts.models import User
from subscriptions.models import SubscriptionTier
from games.models import Game, Booking
from payments.models import Transaction


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 
                 'coin_balance', 'subscription_tier', 'phone_number', 'date_of_birth')
        read_only_fields = ('id', 'coin_balance')


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password_confirm', 
                 'first_name', 'last_name', 'phone_number', 'date_of_birth')
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include username and password')
        
        return attrs


class SubscriptionTierSerializer(serializers.ModelSerializer):
    """Serializer for SubscriptionTier model."""
    
    class Meta:
        model = SubscriptionTier
        fields = '__all__'


class GameSerializer(serializers.ModelSerializer):
    """Serializer for Game model."""
    
    available_slots = serializers.ReadOnlyField()
    is_full = serializers.ReadOnlyField()
    is_upcoming = serializers.ReadOnlyField()
    can_book = serializers.ReadOnlyField()
    
    class Meta:
        model = Game
        fields = '__all__'


class BookingSerializer(serializers.ModelSerializer):
    """Serializer for Booking model."""
    
    user = UserSerializer(read_only=True)
    game = GameSerializer(read_only=True)
    game_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Booking
        fields = ('id', 'user', 'game', 'game_id', 'coins_paid', 'status', 
                 'booking_date', 'notes')
        read_only_fields = ('id', 'user', 'coins_paid', 'status', 'booking_date')
    
    def validate_game_id(self, value):
        try:
            game = Game.objects.get(id=value)
            if not game.can_book():
                raise serializers.ValidationError("This game cannot be booked")
            return value
        except Game.DoesNotExist:
            raise serializers.ValidationError("Game not found")
    
    def create(self, validated_data):
        user = self.context['request'].user
        game = Game.objects.get(id=validated_data['game_id'])
        
        # Check if user has sufficient coins
        if not user.has_sufficient_coins(game.coin_price):
            raise serializers.ValidationError("Insufficient coins")
        
        # Check if user already has a booking for this game
        if Booking.objects.filter(user=user, game=game).exists():
            raise serializers.ValidationError("You already have a booking for this game")
        
        # Create booking
        booking = Booking.objects.create(
            user=user,
            game=game,
            coins_paid=game.coin_price,
            notes=validated_data.get('notes', '')
        )
        
        # Deduct coins from user
        user.deduct_coins(game.coin_price)
        
        # Book slot in game
        game.book_slot()
        
        return booking


class TransactionSerializer(serializers.ModelSerializer):
    """Serializer for Transaction model."""
    
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ('id', 'user', 'status', 'created_at', 'updated_at')


class PaystackWebhookSerializer(serializers.Serializer):
    """Serializer for Paystack webhook data."""
    
    event = serializers.CharField()
    data = serializers.DictField()
    
    def validate_data(self, value):
        required_fields = ['reference', 'status', 'amount']
        for field in required_fields:
            if field not in value:
                raise serializers.ValidationError(f"Missing required field: {field}")
        return value