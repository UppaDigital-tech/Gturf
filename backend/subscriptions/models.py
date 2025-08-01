from django.db import models
from django.core.validators import MinValueValidator


class SubscriptionTier(models.Model):
    """Model to define different subscription tiers."""
    
    TIER_CHOICES = [
        ('bronze', 'Bronze'),
        ('silver', 'Silver'),
        ('gold', 'Gold'),
        ('platinum', 'Platinum'),
    ]
    
    name = models.CharField(
        max_length=50,
        unique=True,
        help_text="Name of the subscription tier"
    )
    tier_type = models.CharField(
        max_length=20,
        choices=TIER_CHOICES,
        unique=True,
        help_text="Type of subscription tier"
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text="Price in local currency"
    )
    coins_awarded = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
        help_text="Number of coins awarded with this subscription"
    )
    description = models.TextField(
        blank=True,
        help_text="Description of the subscription tier"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this tier is available for purchase"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['price']
        verbose_name = "Subscription Tier"
        verbose_name_plural = "Subscription Tiers"
    
    def __str__(self):
        return f"{self.name} - {self.coins_awarded} coins"
    
    @property
    def price_per_coin(self):
        """Calculate price per coin for this tier."""
        if self.coins_awarded > 0:
            return self.price / self.coins_awarded
        return 0
