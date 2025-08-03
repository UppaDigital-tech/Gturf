from rest_framework import serializers
from .models import SubscriptionTier


class SubscriptionTierSerializer(serializers.ModelSerializer):
    """Serializer for SubscriptionTier model."""
    
    class Meta:
        model = SubscriptionTier
        fields = [
            'id', 'name', 'price', 'coins_awarded', 'description',
            'duration_days', 'is_active'
        ]
        read_only_fields = ['id']


class SubscriptionPurchaseSerializer(serializers.Serializer):
    """Serializer for subscription purchase."""
    
    tier_id = serializers.IntegerField()
    payment_reference = serializers.CharField(max_length=100)
    
    def validate_tier_id(self, value):
        """Validate that the tier exists and is active."""
        try:
            tier = SubscriptionTier.objects.get(id=value, is_active=True)
            self.context['tier'] = tier
        except SubscriptionTier.DoesNotExist:
            raise serializers.ValidationError("Invalid or inactive subscription tier.")
        return value
    
    def validate_payment_reference(self, value):
        """Validate payment reference format."""
        if not value.startswith('PS_'):
            raise serializers.ValidationError("Invalid payment reference format.")
        return value