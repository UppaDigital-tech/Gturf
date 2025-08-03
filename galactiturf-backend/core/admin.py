from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from .models import SubscriptionTier, UserProfile, Game, Booking, Transaction


class UserProfileInline(admin.StackedInline):
    """Inline admin for UserProfile"""
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profile'
    fields = ('coin_balance', 'subscription_tier', 'phone_number', 'date_of_birth')


class CustomUserAdmin(UserAdmin):
    """Extended User admin with profile inline"""
    inlines = (UserProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'get_coin_balance', 'is_staff')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'date_joined', 'profile__subscription_tier')
    search_fields = ('username', 'first_name', 'last_name', 'email')
    
    def get_coin_balance(self, obj):
        return obj.profile.coin_balance if hasattr(obj, 'profile') else 0
    get_coin_balance.short_description = 'Coin Balance'


@admin.register(SubscriptionTier)
class SubscriptionTierAdmin(admin.ModelAdmin):
    """Admin configuration for SubscriptionTier"""
    list_display = ('name', 'price', 'coins_awarded', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'description')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('name', 'price', 'coins_awarded', 'description', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """Admin configuration for UserProfile"""
    list_display = ('user', 'coin_balance', 'subscription_tier', 'phone_number', 'created_at')
    list_filter = ('subscription_tier', 'created_at')
    search_fields = ('user__username', 'user__email', 'phone_number')
    readonly_fields = ('created_at', 'updated_at')
    raw_id_fields = ('user',)
    
    fieldsets = (
        (None, {
            'fields': ('user', 'coin_balance', 'subscription_tier')
        }),
        ('Personal Info', {
            'fields': ('phone_number', 'date_of_birth'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    """Admin configuration for Game"""
    list_display = ('name', 'location', 'date_time', 'coin_price', 'available_slots_display', 'is_active')
    list_filter = ('is_active', 'date_time', 'location', 'created_at')
    search_fields = ('name', 'location', 'description')
    readonly_fields = ('created_at', 'updated_at', 'available_slots')
    date_hierarchy = 'date_time'
    
    fieldsets = (
        (None, {
            'fields': ('name', 'location', 'date_time', 'description', 'image', 'is_active')
        }),
        ('Booking Details', {
            'fields': ('coin_price', 'total_slots', 'booked_slots', 'available_slots'),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def available_slots_display(self, obj):
        return f"{obj.available_slots}/{obj.total_slots}"
    available_slots_display.short_description = 'Available/Total Slots'
    
    def available_slots(self, obj):
        return obj.available_slots
    available_slots.short_description = 'Available Slots'


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    """Admin configuration for Booking"""
    list_display = ('booking_reference', 'user', 'game', 'status', 'coins_spent', 'created_at')
    list_filter = ('status', 'created_at', 'game__location')
    search_fields = ('booking_reference', 'user__username', 'game__name', 'user__email')
    readonly_fields = ('booking_reference', 'created_at', 'updated_at')
    raw_id_fields = ('user', 'game')
    date_hierarchy = 'created_at'
    
    fieldsets = (
        (None, {
            'fields': ('booking_reference', 'user', 'game', 'status', 'coins_spent')
        }),
        ('Additional Info', {
            'fields': ('notes',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_as_completed', 'mark_as_cancelled']
    
    def mark_as_completed(self, request, queryset):
        updated = queryset.update(status='completed')
        self.message_user(request, f'{updated} bookings marked as completed.')
    mark_as_completed.short_description = 'Mark selected bookings as completed'
    
    def mark_as_cancelled(self, request, queryset):
        updated = queryset.update(status='cancelled')
        self.message_user(request, f'{updated} bookings marked as cancelled.')
    mark_as_cancelled.short_description = 'Mark selected bookings as cancelled'


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    """Admin configuration for Transaction"""
    list_display = ('reference_id', 'user', 'amount', 'coins_awarded', 'status', 'transaction_type', 'created_at')
    list_filter = ('status', 'transaction_type', 'created_at', 'subscription_tier')
    search_fields = ('reference_id', 'paystack_reference', 'user__username', 'user__email')
    readonly_fields = ('reference_id', 'created_at', 'updated_at', 'gateway_response')
    raw_id_fields = ('user',)
    date_hierarchy = 'created_at'
    
    fieldsets = (
        (None, {
            'fields': ('reference_id', 'user', 'amount', 'coins_awarded', 'status', 'transaction_type')
        }),
        ('Subscription Details', {
            'fields': ('subscription_tier',),
            'classes': ('collapse',)
        }),
        ('Payment Gateway', {
            'fields': ('paystack_reference', 'gateway_response'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_as_success', 'mark_as_failed']
    
    def mark_as_success(self, request, queryset):
        updated = queryset.update(status='success')
        self.message_user(request, f'{updated} transactions marked as successful.')
    mark_as_success.short_description = 'Mark selected transactions as successful'
    
    def mark_as_failed(self, request, queryset):
        updated = queryset.update(status='failed')
        self.message_user(request, f'{updated} transactions marked as failed.')
    mark_as_failed.short_description = 'Mark selected transactions as failed'


# Unregister default User admin and register custom one
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)

# Customize admin site headers
admin.site.site_header = 'Galactiturf Admin'
admin.site.site_title = 'Galactiturf Admin Portal'
admin.site.index_title = 'Welcome to Galactiturf Administration'
