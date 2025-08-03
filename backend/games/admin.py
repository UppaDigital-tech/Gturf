from django.contrib import admin
from .models import Game, Booking


@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    """Admin configuration for Game model."""
    
    list_display = ['name', 'location', 'date_time', 'coin_price', 'total_slots', 'booked_slots', 'available_slots', 'status', 'created_by']
    list_filter = ['status', 'date_time', 'created_by']
    search_fields = ['name', 'location', 'description']
    ordering = ['date_time']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'location', 'description')
        }),
        ('Game Details', {
            'fields': ('date_time', 'coin_price', 'total_slots', 'booked_slots', 'status')
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def available_slots(self, obj):
        """Display available slots."""
        return obj.available_slots
    available_slots.short_description = 'Available Slots'


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    """Admin configuration for Booking model."""
    
    list_display = ['booking_reference', 'user', 'game', 'status', 'coins_paid', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['booking_reference', 'user__username', 'game__name']
    ordering = ['-created_at']
    readonly_fields = ['booking_reference', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Booking Information', {
            'fields': ('booking_reference', 'user', 'game', 'status', 'coins_paid')
        }),
        ('Additional Information', {
            'fields': ('notes',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
