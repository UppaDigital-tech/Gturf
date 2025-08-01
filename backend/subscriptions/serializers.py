from rest_framework import serializers
from .models import SubscriptionTier, Transaction

class SubscriptionTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionTier
        fields = ('id', 'name', 'price', 'coins_awarded')


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ('id', 'user', 'amount', 'status', 'reference_id', 'timestamp')
        read_only_fields = ('user', 'status', 'reference_id', 'timestamp')