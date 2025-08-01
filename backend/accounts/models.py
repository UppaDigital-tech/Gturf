from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom User model with coin balance and subscription tier."""
    
    SUBSCRIPTION_CHOICES = [
        ('none', 'None'),
        ('bronze', 'Bronze'),
        ('silver', 'Silver'),
        ('gold', 'Gold'),
    ]
    
    coin_balance = models.IntegerField(default=0, help_text="User's coin balance")
    subscription_tier = models.CharField(
        max_length=10,
        choices=SUBSCRIPTION_CHOICES,
        default='none',
        help_text="User's current subscription tier"
    )
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    
    def __str__(self):
        return self.username
    
    def add_coins(self, amount):
        """Add coins to user's balance."""
        self.coin_balance += amount
        self.save()
    
    def deduct_coins(self, amount):
        """Deduct coins from user's balance."""
        if self.coin_balance >= amount:
            self.coin_balance -= amount
            self.save()
            return True
        return False
    
    def has_sufficient_coins(self, amount):
        """Check if user has sufficient coins for a transaction."""
        return self.coin_balance >= amount
