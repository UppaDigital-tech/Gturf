from django.db import models
from django.core.validators import MinValueValidator
from django.utils import timezone
from django.conf import settings


class Game(models.Model):
    """Model for football games available for booking."""
    
    STATUS_CHOICES = [
        ('upcoming', 'Upcoming'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    name = models.CharField(
        max_length=200,
        help_text="Name of the football game"
    )
    location = models.CharField(
        max_length=500,
        help_text="Location/venue of the game"
    )
    date_time = models.DateTimeField(
        help_text="Date and time of the game"
    )
    coin_price = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
        help_text="Price in coins to book this game"
    )
    total_slots = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
        help_text="Total number of available slots"
    )
    booked_slots = models.PositiveIntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Number of slots already booked"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='upcoming',
        help_text="Current status of the game"
    )
    description = models.TextField(
        blank=True,
        help_text="Description of the game"
    )
    rules = models.TextField(
        blank=True,
        help_text="Rules and guidelines for the game"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['date_time']
        verbose_name = "Game"
        verbose_name_plural = "Games"
    
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
        """Check if the game is in the future."""
        return self.date_time > timezone.now()
    
    def can_book(self):
        """Check if the game can be booked."""
        return (
            self.status == 'upcoming' and
            not self.is_full and
            self.is_upcoming
        )
    
    def book_slot(self):
        """Book a slot for this game."""
        if self.can_book():
            self.booked_slots += 1
            self.save()
            return True
        return False
    
    def cancel_slot(self):
        """Cancel a booked slot."""
        if self.booked_slots > 0:
            self.booked_slots -= 1
            self.save()
            return True
        return False


class Booking(models.Model):
    """Model to link a User to a Game with booking details."""
    
    STATUS_CHOICES = [
        ('confirmed', 'Confirmed'),
        ('pending', 'Pending'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='bookings',
        help_text="User who made the booking"
    )
    game = models.ForeignKey(
        Game,
        on_delete=models.CASCADE,
        related_name='bookings',
        help_text="Game that was booked"
    )
    coins_paid = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
        help_text="Number of coins paid for this booking"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='confirmed',
        help_text="Status of the booking"
    )
    booking_date = models.DateTimeField(
        auto_now_add=True,
        help_text="Date and time when the booking was made"
    )
    notes = models.TextField(
        blank=True,
        help_text="Additional notes for the booking"
    )
    
    class Meta:
        ordering = ['-booking_date']
        verbose_name = "Booking"
        verbose_name_plural = "Bookings"
        unique_together = ['user', 'game']  # One booking per user per game
    
    def __str__(self):
        return f"{self.user.username} - {self.game.name} - {self.booking_date.strftime('%Y-%m-%d %H:%M')}"
    
    def save(self, *args, **kwargs):
        """Override save to ensure coins_paid matches game price."""
        if not self.coins_paid:
            self.coins_paid = self.game.coin_price
        super().save(*args, **kwargs)
    
    def cancel_booking(self):
        """Cancel the booking and refund coins."""
        if self.status == 'confirmed':
            self.status = 'cancelled'
            self.save()
            # Refund coins to user
            self.user.add_coins(self.coins_paid)
            # Update game booked slots
            self.game.cancel_slot()
            return True
        return False
