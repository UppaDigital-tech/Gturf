from django.db import models

# Create your models here.


class SubscriptionTier(models.Model):
    """Model to define different subscription tiers."""
    
    TIER_CHOICES = [
        ('bronze', 'Bronze'),
        ('silver', 'Silver'),
        ('gold', 'Gold'),
    ]
    
    name = models.CharField(max_length=10, choices=TIER_CHOICES, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Price in NGN")
    coins_awarded = models.IntegerField(help_text="Number of coins awarded for this subscription")
    description = models.TextField(blank=True)
    duration_days = models.IntegerField(default=30, help_text="Duration of subscription in days")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['price']
    
    def __str__(self):
        return f"{self.get_name_display()} - {self.coins_awarded} coins"
    
    @classmethod
    def get_active_tiers(cls):
        """Get all active subscription tiers."""
        return cls.objects.filter(is_active=True)
