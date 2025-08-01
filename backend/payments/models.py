from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator


class Transaction(models.Model):
    """Model to log all payment transactions via Paystack."""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('success', 'Success'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]
    
    TRANSACTION_TYPES = [
        ('subscription', 'Subscription Purchase'),
        ('booking', 'Game Booking'),
        ('refund', 'Refund'),
    ]
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='transactions',
        help_text="User who made the transaction"
    )
    transaction_type = models.CharField(
        max_length=20,
        choices=TRANSACTION_TYPES,
        help_text="Type of transaction"
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text="Transaction amount in local currency"
    )
    coins_involved = models.PositiveIntegerField(
        default=0,
        help_text="Number of coins involved in the transaction"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        help_text="Status of the transaction"
    )
    reference_id = models.CharField(
        max_length=100,
        unique=True,
        help_text="Paystack reference ID"
    )
    paystack_transaction_id = models.CharField(
        max_length=100,
        blank=True,
        help_text="Paystack transaction ID"
    )
    description = models.TextField(
        blank=True,
        help_text="Description of the transaction"
    )
    metadata = models.JSONField(
        default=dict,
        blank=True,
        help_text="Additional metadata from Paystack"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Transaction"
        verbose_name_plural = "Transactions"
    
    def __str__(self):
        return f"{self.user.username} - {self.transaction_type} - {self.reference_id}"
    
    @property
    def is_successful(self):
        """Check if the transaction was successful."""
        return self.status == 'success'
    
    @property
    def is_pending(self):
        """Check if the transaction is pending."""
        return self.status == 'pending'
    
    @property
    def is_failed(self):
        """Check if the transaction failed."""
        return self.status == 'failed'
    
    def mark_successful(self, paystack_transaction_id=None, metadata=None):
        """Mark transaction as successful."""
        self.status = 'success'
        if paystack_transaction_id:
            self.paystack_transaction_id = paystack_transaction_id
        if metadata:
            self.metadata.update(metadata)
        self.save()
    
    def mark_failed(self, metadata=None):
        """Mark transaction as failed."""
        self.status = 'failed'
        if metadata:
            self.metadata.update(metadata)
        self.save()
    
    def mark_cancelled(self, metadata=None):
        """Mark transaction as cancelled."""
        self.status = 'cancelled'
        if metadata:
            self.metadata.update(metadata)
        self.save()
