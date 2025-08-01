from django.contrib import admin
from .models import SubscriptionTier


@admin.register(SubscriptionTier)
class SubscriptionTierAdmin(admin.ModelAdmin):
    """Admin configuration for the SubscriptionTier model."""
    
    list_display = ('name', 'tier_type', 'price', 'coins_awarded', 'price_per_coin', 'is_active')
    list_filter = ('tier_type', 'is_active', 'created_at')
    search_fields = ('name', 'description')
    ordering = ('price',)
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'tier_type', 'description')
        }),
        ('Pricing', {
            'fields': ('price', 'coins_awarded')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at', 'price_per_coin')
    
    def price_per_coin(self, obj):
        """Display price per coin."""
        return f"${obj.price_per_coin:.2f}"
    price_per_coin.short_description = "Price per Coin"
