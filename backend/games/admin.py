from django.contrib import admin
from .models import Game, Booking


@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    """Admin configuration for the Game model."""
    
    list_display = ('name', 'location', 'date_time', 'coin_price', 'available_slots', 'status', 'is_upcoming')
    list_filter = ('status', 'date_time', 'created_at')
    search_fields = ('name', 'location', 'description')
    ordering = ('date_time',)
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'location', 'description', 'rules')
        }),
        ('Scheduling', {
            'fields': ('date_time', 'status')
        }),
        ('Pricing & Capacity', {
            'fields': ('coin_price', 'total_slots', 'booked_slots')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at', 'booked_slots')
    
    def available_slots(self, obj):
        """Display available slots."""
        return obj.available_slots
    available_slots.short_description = "Available Slots"
    
    def is_upcoming(self, obj):
        """Display if game is upcoming."""
        return obj.is_upcoming
    is_upcoming.boolean = True
    is_upcoming.short_description = "Upcoming"


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    """Admin configuration for the Booking model."""
    
    list_display = ('user', 'game', 'coins_paid', 'status', 'booking_date')
    list_filter = ('status', 'booking_date', 'game__status')
    search_fields = ('user__username', 'user__email', 'game__name')
    ordering = ('-booking_date',)
    
    fieldsets = (
        ('Booking Information', {
            'fields': ('user', 'game', 'coins_paid', 'status')
        }),
        ('Details', {
            'fields': ('booking_date', 'notes')
        }),
    )
    
    readonly_fields = ('booking_date', 'coins_paid')
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'game')
