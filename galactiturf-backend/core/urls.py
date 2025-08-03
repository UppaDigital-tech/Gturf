from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', views.UserRegistrationView.as_view(), name='register'),
    path('auth/login/', views.UserLoginView.as_view(), name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    
    # User profile endpoints
    path('user/profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('user/bookings/', views.UserBookingsView.as_view(), name='user-bookings'),
    path('user/transactions/', views.UserTransactionsView.as_view(), name='user-transactions'),
    path('user/dashboard/', views.DashboardStatsView.as_view(), name='user-dashboard'),
    
    # Subscription endpoints
    path('subscriptions/tiers/', views.SubscriptionTierListView.as_view(), name='subscription-tiers'),
    
    # Game endpoints
    path('games/', views.GameListView.as_view(), name='game-list'),
    path('games/<int:pk>/', views.GameDetailView.as_view(), name='game-detail'),
    
    # Booking endpoints
    path('booking/create/', views.BookingCreateView.as_view(), name='booking-create'),
    path('booking/<int:pk>/', views.BookingDetailView.as_view(), name='booking-detail'),
    
    # Payment endpoints
    path('payment/initialize/', views.PaymentInitializeView.as_view(), name='payment-initialize'),
    path('payment/verify/', views.PaymentVerifyView.as_view(), name='payment-verify'),
    path('payment/webhook/', views.PaystackWebhookView.as_view(), name='payment-webhook'),
    
    # Utility endpoints
    path('health/', views.health_check, name='health-check'),
    path('info/', views.api_info, name='api-info'),
]