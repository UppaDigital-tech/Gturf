from django.contrib import admin
from .models import Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    """Admin configuration for the Transaction model."""
    
    list_display = ('user', 'transaction_type', 'amount', 'coins_involved', 'status', 'reference_id', 'created_at')
    list_filter = ('status', 'transaction_type', 'created_at')
    search_fields = ('user__username', 'user__email', 'reference_id', 'paystack_transaction_id')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Transaction Information', {
            'fields': ('user', 'transaction_type', 'amount', 'coins_involved', 'status')
        }),
        ('Paystack Details', {
            'fields': ('reference_id', 'paystack_transaction_id')
        }),
        ('Additional Information', {
            'fields': ('description', 'metadata')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at', 'reference_id')
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')
