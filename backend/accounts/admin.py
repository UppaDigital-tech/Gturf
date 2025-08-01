from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """Admin configuration for custom User model."""
    
    list_display = ['username', 'email', 'first_name', 'last_name', 'coin_balance', 'subscription_tier', 'is_active']
    list_filter = ['subscription_tier', 'is_active', 'date_joined']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering = ['-date_joined']
    
    fieldsets = UserAdmin.fieldsets + (
        ('Galactiturf Info', {
            'fields': ('coin_balance', 'subscription_tier', 'phone_number', 'date_of_birth', 'profile_picture')
        }),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Galactiturf Info', {
            'fields': ('coin_balance', 'subscription_tier', 'phone_number', 'date_of_birth')
        }),
    )
