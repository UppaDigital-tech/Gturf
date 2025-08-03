from django.db import models
from django.conf import settings


class Transaction(models.Model):
    """Model to log all payment transactions via Paystack."""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('success', 'Success'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]
    
    TRANSACTION_TYPES = [
        ('subscription', 'Subscription'),
        ('booking', 'Game Booking'),
        ('refund', 'Refund'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2, help_text="Amount in NGN")
    coins_amount = models.IntegerField(help_text="Amount in coins")
    reference_id = models.CharField(max_length=100, unique=True, help_text="Paystack reference ID")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    paystack_response = models.JSONField(default=dict, help_text="Full Paystack response")
    description = models.TextField(blank=True, help_text="Transaction description")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.transaction_type} - {self.reference_id}"
    
    @classmethod
    def create_transaction(cls, user, transaction_type, amount, coins_amount, reference_id, description=""):
        """Create a new transaction."""
        return cls.objects.create(
            user=user,
            transaction_type=transaction_type,
            amount=amount,
            coins_amount=coins_amount,
            reference_id=reference_id,
            description=description
        )
    
    def mark_successful(self, paystack_response):
        """Mark transaction as successful."""
        self.status = 'success'
        self.paystack_response = paystack_response
        self.save()
    
    def mark_failed(self, paystack_response):
        """Mark transaction as failed."""
        self.status = 'failed'
        self.paystack_response = paystack_response
        self.save()
    
    def mark_cancelled(self):
        """Mark transaction as cancelled."""
        self.status = 'cancelled'
        self.save()
