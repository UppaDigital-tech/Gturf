from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import transaction as db_transaction

from .models import Game, Booking
from .serializers import GameSerializer, BookingSerializer


class GameListView(generics.ListAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = (permissions.AllowAny,)


class BookGameView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    @db_transaction.atomic
    def post(self, request, *args, **kwargs):
        game_id = request.data.get('game_id')
        try:
            game = Game.objects.select_for_update().get(id=game_id)
        except Game.DoesNotExist:
            return Response({'detail': 'Game not found'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user

        if game.available_slots <= 0:
            return Response({'detail': 'No slots available'}, status=status.HTTP_400_BAD_REQUEST)

        if user.coin_balance < game.coin_price:
            return Response({'detail': 'Insufficient coins'}, status=status.HTTP_400_BAD_REQUEST)

        # Deduct coins and create booking
        user.coin_balance -= game.coin_price
        user.save()

        game.booked_slots += 1
        game.save()

        booking = Booking.objects.create(user=user, game=game)
        serializer = BookingSerializer(booking)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UserBookingsView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)