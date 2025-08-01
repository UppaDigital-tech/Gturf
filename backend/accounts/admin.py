from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """Admin configuration for the custom User model."""
    
    list_display = ('username', 'email', 'first_name', 'last_name', 'coin_balance', 'subscription_tier', 'is_active')
    list_filter = ('is_active', 'is_staff', 'subscription_tier', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    
    fieldsets = UserAdmin.fieldsets + (
        ('Galactiturf Info', {
            'fields': ('coin_balance', 'subscription_tier', 'phone_number', 'date_of_birth')
        }),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Galactiturf Info', {
            'fields': ('coin_balance', 'subscription_tier', 'phone_number', 'date_of_birth')
        }),
    )
    
    readonly_fields = ('coin_balance',)
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('subscription_tier')
