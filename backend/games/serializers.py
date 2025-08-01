from rest_framework import serializers
from .models import Game, Booking


class GameSerializer(serializers.ModelSerializer):
    available_slots = serializers.IntegerField(read_only=True)

    class Meta:
        model = Game
        fields = ('id', 'name', 'location', 'date_time', 'coin_price', 'total_slots', 'booked_slots', 'available_slots')


class BookingSerializer(serializers.ModelSerializer):
    game = GameSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = ('id', 'game', 'timestamp', 'status')