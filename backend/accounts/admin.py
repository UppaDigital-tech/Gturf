from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Galactiturf Info', {'fields': ('coin_balance', 'subscription_tier')}),
    )
    list_display = BaseUserAdmin.list_display + ('coin_balance', 'subscription_tier')