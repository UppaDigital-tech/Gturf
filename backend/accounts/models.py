from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinValueValidator


class User(AbstractUser):
    """Custom User model with coin balance and subscription tier."""
    
    coin_balance = models.PositiveIntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text="User's current coin balance"
    )
    subscription_tier = models.ForeignKey(
        'subscriptions.SubscriptionTier',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='users',
        help_text="User's current subscription tier"
    )
    phone_number = models.CharField(
        max_length=15,
        blank=True,
        help_text="User's phone number"
    )
    date_of_birth = models.DateField(
        null=True,
        blank=True,
        help_text="User's date of birth"
    )
    
    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
    
    def __str__(self):
        return self.username
    
    def add_coins(self, amount):
        """Add coins to user's balance."""
        if amount > 0:
            self.coin_balance += amount
            self.save()
            return True
        return False
    
    def deduct_coins(self, amount):
        """Deduct coins from user's balance."""
        if amount > 0 and self.coin_balance >= amount:
            self.coin_balance -= amount
            self.save()
            return True
        return False
    
    def has_sufficient_coins(self, amount):
        """Check if user has sufficient coins for a transaction."""
        return self.coin_balance >= amount
