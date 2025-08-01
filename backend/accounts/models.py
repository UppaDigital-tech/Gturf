from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    coin_balance = models.PositiveIntegerField(default=0)
    subscription_tier = models.ForeignKey(
        'subscriptions.SubscriptionTier',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='users'
    )

    def __str__(self):
        return self.username