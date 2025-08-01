from django.urls import path
from . import views

app_name = 'api'

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', views.UserRegistrationView.as_view(), name='register'),
    path('auth/login/', views.UserLoginView.as_view(), name='login'),
    path('auth/profile/', views.UserProfileView.as_view(), name='profile'),
    
    # Subscription endpoints
    path('subscriptions/', views.SubscriptionTierListView.as_view(), name='subscription-tiers'),
    
    # Game endpoints
    path('games/', views.GameListView.as_view(), name='games'),
    path('games/<int:pk>/', views.GameDetailView.as_view(), name='game-detail'),
    
    # Booking endpoints
    path('bookings/', views.BookingListView.as_view(), name='bookings'),
    path('bookings/<int:pk>/', views.BookingDetailView.as_view(), name='booking-detail'),
    
    # Payment endpoints
    path('payments/initialize/', views.PaystackInitializeView.as_view(), name='payment-initialize'),
    path('payments/verify/', views.paystack_verify_view, name='payment-verify'),
    path('payments/webhook/', views.paystack_webhook_view, name='payment-webhook'),
]