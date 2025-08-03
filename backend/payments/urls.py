from django.urls import path
from . import views

app_name = 'payments'

urlpatterns = [
    path('webhook/', views.paystack_webhook, name='webhook'),
    path('initialize/', views.initialize_payment, name='initialize'),
    path('verify/<str:reference>/', views.verify_payment, name='verify'),
]