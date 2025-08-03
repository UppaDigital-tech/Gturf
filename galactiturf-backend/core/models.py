from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from django.utils import timezone


class SubscriptionTier(models.Model):
    """Model for different subscription tiers with coin rewards"""
    name = models.CharField(max_length=50, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    coins_awarded = models.PositiveIntegerField()
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['price']

    def __str__(self):
        return f"{self.name} - ₦{self.price} ({self.coins_awarded} coins)"


class UserProfile(models.Model):
    """Extended user profile with coin balance and subscription info"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    coin_balance = models.PositiveIntegerField(default=0)
    subscription_tier = models.ForeignKey(
        SubscriptionTier, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='users'
    )
    phone_number = models.CharField(max_length=15, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.coin_balance} coins"

    def has_sufficient_coins(self, amount):
        """Check if user has enough coins for a transaction"""
        return self.coin_balance >= amount

    def deduct_coins(self, amount):
        """Deduct coins from user balance"""
        if self.has_sufficient_coins(amount):
            self.coin_balance -= amount
            self.save()
            return True
        return False

    def add_coins(self, amount):
        """Add coins to user balance"""
        self.coin_balance += amount
        self.save()


class Game(models.Model):
    """Model for football games available for booking"""
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    date_time = models.DateTimeField()
    coin_price = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    total_slots = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    booked_slots = models.PositiveIntegerField(default=0)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='games/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['date_time']

    def __str__(self):
        return f"{self.name} - {self.location} ({self.date_time.strftime('%Y-%m-%d %H:%M')})"

    @property
    def available_slots(self):
        """Calculate available slots"""
        return self.total_slots - self.booked_slots

    @property
    def is_fully_booked(self):
        """Check if game is fully booked"""
        return self.booked_slots >= self.total_slots

    @property
    def is_past_date(self):
        """Check if game date has passed"""
        return self.date_time < timezone.now()

    def can_be_booked(self):
        """Check if game can be booked"""
        return (
            self.is_active and 
            not self.is_fully_booked and 
            not self.is_past_date
        )


class Booking(models.Model):
    """Model for game bookings by users"""
    BOOKING_STATUS_CHOICES = [
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='bookings')
    status = models.CharField(max_length=20, choices=BOOKING_STATUS_CHOICES, default='confirmed')
    coins_spent = models.PositiveIntegerField()
    booking_reference = models.CharField(max_length=100, unique=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['user', 'game']  # Prevent duplicate bookings

    def __str__(self):
        return f"{self.user.username} - {self.game.name} ({self.status})"

    def save(self, *args, **kwargs):
        # Generate booking reference if not provided
        if not self.booking_reference:
            import uuid
            self.booking_reference = f"BK{str(uuid.uuid4())[:8].upper()}"
        super().save(*args, **kwargs)


class Transaction(models.Model):
    """Model to log payment transactions via Paystack"""
    TRANSACTION_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('success', 'Success'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]

    TRANSACTION_TYPE_CHOICES = [
        ('subscription', 'Subscription'),
        ('coin_purchase', 'Coin Purchase'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    subscription_tier = models.ForeignKey(
        SubscriptionTier, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='transactions'
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    coins_awarded = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=TRANSACTION_STATUS_CHOICES, default='pending')
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPE_CHOICES, default='subscription')
    reference_id = models.CharField(max_length=200, unique=True)
    paystack_reference = models.CharField(max_length=200, blank=True)
    gateway_response = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - ₦{self.amount} ({self.status})"

    def save(self, *args, **kwargs):
        # Generate reference ID if not provided
        if not self.reference_id:
            import uuid
            self.reference_id = f"TXN{str(uuid.uuid4())[:12].upper()}"
        super().save(*args, **kwargs)


# Signal handlers to create user profile automatically
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Create user profile when a new user is created"""
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """Save user profile when user is saved"""
    if hasattr(instance, 'profile'):
        instance.profile.save()
