from django.contrib import admin
from .models import SubscriptionTier


@admin.register(SubscriptionTier)
class SubscriptionTierAdmin(admin.ModelAdmin):
    """Admin configuration for SubscriptionTier model."""
    
    list_display = ['name', 'price', 'coins_awarded', 'duration_days', 'is_active']
    list_filter = ['is_active', 'name']
    search_fields = ['name', 'description']
    ordering = ['price']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Tier Information', {
            'fields': ('name', 'description')
        }),
        ('Pricing & Rewards', {
            'fields': ('price', 'coins_awarded', 'duration_days')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
