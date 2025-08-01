from django.db import models
from django.conf import settings


class Game(models.Model):
    """Model for football games."""
    
    STATUS_CHOICES = [
        ('upcoming', 'Upcoming'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    name = models.CharField(max_length=200, help_text="Name of the game/event")
    location = models.CharField(max_length=200, help_text="Location of the game")
    date_time = models.DateTimeField(help_text="Date and time of the game")
    coin_price = models.IntegerField(help_text="Price in coins to book this game")
    total_slots = models.IntegerField(help_text="Total number of available slots")
    booked_slots = models.IntegerField(default=0, help_text="Number of booked slots")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='upcoming')
    description = models.TextField(blank=True, help_text="Description of the game")
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_games')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['date_time']
    
    def __str__(self):
        return f"{self.name} - {self.location} - {self.date_time.strftime('%Y-%m-%d %H:%M')}"
    
    @property
    def available_slots(self):
        """Calculate available slots."""
        return self.total_slots - self.booked_slots
    
    @property
    def is_full(self):
        """Check if the game is fully booked."""
        return self.booked_slots >= self.total_slots
    
    @property
    def is_upcoming(self):
        """Check if the game is upcoming."""
        from django.utils import timezone
        return self.date_time > timezone.now() and self.status == 'upcoming'
    
    def book_slot(self):
        """Book a slot for this game."""
        if self.available_slots > 0:
            self.booked_slots += 1
            self.save()
            return True
        return False
    
    def cancel_slot(self):
        """Cancel a slot for this game."""
        if self.booked_slots > 0:
            self.booked_slots -= 1
            self.save()
            return True
        return False


class Booking(models.Model):
    """Model to link a User to a Game."""
    
    STATUS_CHOICES = [
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='bookings')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='confirmed')
    coins_paid = models.IntegerField(help_text="Number of coins paid for this booking")
    booking_reference = models.CharField(max_length=50, unique=True, help_text="Unique booking reference")
    notes = models.TextField(blank=True, help_text="Additional notes for the booking")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['user', 'game']
    
    def __str__(self):
        return f"{self.user.username} - {self.game.name} - {self.status}"
    
    def save(self, *args, **kwargs):
        """Generate booking reference if not provided."""
        if not self.booking_reference:
            import uuid
            self.booking_reference = f"BK-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)
    
    def cancel_booking(self):
        """Cancel the booking and refund coins."""
        if self.status == 'confirmed':
            self.status = 'cancelled'
            self.save()
            # Refund coins to user
            self.user.add_coins(self.coins_paid)
            # Cancel slot in game
            self.game.cancel_slot()
            return True
        return False
