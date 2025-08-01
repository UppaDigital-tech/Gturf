from django.urls import path
from .views import SubscriptionTierListView, InitializePaymentView, VerifyPaymentView

urlpatterns = [
    path('tiers/', SubscriptionTierListView.as_view(), name='subscription_tiers'),
    path('init/', InitializePaymentView.as_view(), name='initialize_payment'),
    path('verify/', VerifyPaymentView.as_view(), name='verify_payment'),
]