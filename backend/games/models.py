from django.db import models
from django.conf import settings

class Game(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    date_time = models.DateTimeField()
    coin_price = models.PositiveIntegerField()
    total_slots = models.PositiveIntegerField()
    booked_slots = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.name} - {self.location} - {self.date_time.strftime('%Y-%m-%d %H:%M')}"

    @property
    def available_slots(self):
        return self.total_slots - self.booked_slots


class Booking(models.Model):
    STATUS_CHOICES = (
        ('booked', 'Booked'),
        ('cancelled', 'Cancelled'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='bookings')
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='booked')

    def __str__(self):
        return f"{self.user.username} - {self.game.name} - {self.status}"