from django.contrib import admin
from .models import Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    """Admin configuration for Transaction model."""
    
    list_display = ['reference_id', 'user', 'transaction_type', 'amount', 'coins_amount', 'status', 'created_at']
    list_filter = ['transaction_type', 'status', 'created_at']
    search_fields = ['reference_id', 'user__username', 'description']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Transaction Information', {
            'fields': ('reference_id', 'user', 'transaction_type', 'status')
        }),
        ('Amount Details', {
            'fields': ('amount', 'coins_amount')
        }),
        ('Additional Information', {
            'fields': ('description', 'paystack_response')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
