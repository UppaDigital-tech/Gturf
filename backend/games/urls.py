from django.urls import path
from .views import GameListView, BookGameView, UserBookingsView

urlpatterns = [
    path('', GameListView.as_view(), name='games_list'),
    path('book/', BookGameView.as_view(), name='book_game'),
    path('my-bookings/', UserBookingsView.as_view(), name='user_bookings'),
]