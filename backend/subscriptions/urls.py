from django.urls import path
from . import views

app_name = 'subscriptions'

urlpatterns = [
    path('tiers/', views.SubscriptionTierListView.as_view(), name='tier-list'),
    path('tiers/<int:pk>/', views.SubscriptionTierDetailView.as_view(), name='tier-detail'),
    path('purchase/', views.purchase_subscription, name='purchase'),
    path('history/', views.user_subscription_history, name='history'),
]