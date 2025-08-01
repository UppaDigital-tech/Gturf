from django.contrib import admin
from .models import SubscriptionTier, Transaction

admin.site.register(SubscriptionTier)
admin.site.register(Transaction)