from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    path('register/', views.UserRegistrationView.as_view(), name='register'),
    path('login/', views.UserLoginView.as_view(), name='login'),
    path('profile/', views.UserProfileView.as_view(), name='profile'),
    path('update/', views.UserUpdateView.as_view(), name='update'),
    path('dashboard/', views.user_dashboard, name='dashboard'),
]