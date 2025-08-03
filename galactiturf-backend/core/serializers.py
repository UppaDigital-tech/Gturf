from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import SubscriptionTier, UserProfile, Game, Booking, Transaction


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'password', 'password_confirm')
        
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
        
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value
        
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value
        
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login"""
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
            return attrs
        else:
            raise serializers.ValidationError('Must provide username and password')


class SubscriptionTierSerializer(serializers.ModelSerializer):
    """Serializer for subscription tiers"""
    
    class Meta:
        model = SubscriptionTier
        fields = ('id', 'name', 'price', 'coins_awarded', 'description', 'is_active')
        read_only_fields = ('id',)


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile"""
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    subscription_tier = SubscriptionTierSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name',
            'coin_balance', 'subscription_tier', 'phone_number', 
            'date_of_birth', 'created_at'
        )
        read_only_fields = ('id', 'coin_balance', 'created_at')


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile"""
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    
    class Meta:
        model = UserProfile
        fields = ('first_name', 'last_name', 'phone_number', 'date_of_birth')
        
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        
        # Update user fields
        for attr, value in user_data.items():
            setattr(instance.user, attr, value)
        instance.user.save()
        
        # Update profile fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        return instance


class GameSerializer(serializers.ModelSerializer):
    """Serializer for games"""
    available_slots = serializers.ReadOnlyField()
    is_fully_booked = serializers.ReadOnlyField()
    is_past_date = serializers.ReadOnlyField()
    can_be_booked = serializers.ReadOnlyField()
    
    class Meta:
        model = Game
        fields = (
            'id', 'name', 'location', 'date_time', 'coin_price',
            'total_slots', 'booked_slots', 'available_slots',
            'description', 'image', 'is_active', 'is_fully_booked',
            'is_past_date', 'can_be_booked', 'created_at'
        )
        read_only_fields = ('id', 'booked_slots', 'created_at')


class BookingSerializer(serializers.ModelSerializer):
    """Serializer for bookings"""
    user = serializers.StringRelatedField(read_only=True)
    game = GameSerializer(read_only=True)
    game_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Booking
        fields = (
            'id', 'user', 'game', 'game_id', 'status', 'coins_spent',
            'booking_reference', 'notes', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'user', 'booking_reference', 'created_at', 'updated_at')
        
    def validate_game_id(self, value):
        try:
            game = Game.objects.get(id=value)
            if not game.can_be_booked():
                raise serializers.ValidationError("This game cannot be booked")
            return value
        except Game.DoesNotExist:
            raise serializers.ValidationError("Game does not exist")
            
    def validate(self, attrs):
        user = self.context['request'].user
        game_id = attrs['game_id']
        
        # Check if user already booked this game
        if Booking.objects.filter(user=user, game_id=game_id).exists():
            raise serializers.ValidationError("You have already booked this game")
            
        # Check if user has sufficient coins
        game = Game.objects.get(id=game_id)
        if not user.profile.has_sufficient_coins(game.coin_price):
            raise serializers.ValidationError(
                f"Insufficient coins. You need {game.coin_price} coins but have {user.profile.coin_balance}"
            )
            
        return attrs
        
    def create(self, validated_data):
        user = self.context['request'].user
        game_id = validated_data.pop('game_id')
        game = Game.objects.get(id=game_id)
        
        # Create booking
        booking = Booking.objects.create(
            user=user,
            game=game,
            coins_spent=game.coin_price,
            **validated_data
        )
        
        # Deduct coins from user
        user.profile.deduct_coins(game.coin_price)
        
        # Update game booked slots
        game.booked_slots += 1
        game.save()
        
        return booking


class BookingListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing bookings"""
    game_name = serializers.CharField(source='game.name', read_only=True)
    game_location = serializers.CharField(source='game.location', read_only=True)
    game_date_time = serializers.DateTimeField(source='game.date_time', read_only=True)
    
    class Meta:
        model = Booking
        fields = (
            'id', 'game_name', 'game_location', 'game_date_time',
            'status', 'coins_spent', 'booking_reference', 'created_at'
        )


class TransactionSerializer(serializers.ModelSerializer):
    """Serializer for transactions"""
    user = serializers.StringRelatedField(read_only=True)
    subscription_tier = SubscriptionTierSerializer(read_only=True)
    
    class Meta:
        model = Transaction
        fields = (
            'id', 'user', 'subscription_tier', 'amount', 'coins_awarded',
            'status', 'transaction_type', 'reference_id', 'paystack_reference',
            'created_at', 'updated_at'
        )
        read_only_fields = (
            'id', 'user', 'reference_id', 'paystack_reference', 
            'created_at', 'updated_at'
        )


class PaymentInitializationSerializer(serializers.Serializer):
    """Serializer for payment initialization"""
    subscription_tier_id = serializers.IntegerField()
    
    def validate_subscription_tier_id(self, value):
        try:
            tier = SubscriptionTier.objects.get(id=value, is_active=True)
            return value
        except SubscriptionTier.DoesNotExist:
            raise serializers.ValidationError("Invalid or inactive subscription tier")


class PaymentVerificationSerializer(serializers.Serializer):
    """Serializer for payment verification"""
    reference = serializers.CharField(max_length=200)
    
    def validate_reference(self, value):
        # Basic validation - can be enhanced based on Paystack reference format
        if not value:
            raise serializers.ValidationError("Payment reference is required")
        return value