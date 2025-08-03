from django.urls import path
from . import views

app_name = 'games'

urlpatterns = [
    path('', views.GameListView.as_view(), name='game-list'),
    path('create/', views.GameCreateView.as_view(), name='game-create'),
    path('<int:pk>/', views.GameDetailView.as_view(), name='game-detail'),
    path('bookings/', views.BookingListView.as_view(), name='booking-list'),
    path('bookings/create/', views.BookingCreateView.as_view(), name='booking-create'),
    path('bookings/<int:pk>/', views.BookingDetailView.as_view(), name='booking-detail'),
    path('bookings/<int:booking_id>/cancel/', views.cancel_booking, name='cancel-booking'),
    path('bookings/summary/', views.user_bookings_summary, name='bookings-summary'),
]