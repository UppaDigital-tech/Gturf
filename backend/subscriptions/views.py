from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import SubscriptionTier
from .serializers import SubscriptionTierSerializer, SubscriptionPurchaseSerializer
from payments.models import Transaction


class SubscriptionTierListView(generics.ListAPIView):
    """View for listing subscription tiers."""
    
    queryset = SubscriptionTier.get_active_tiers()
    serializer_class = SubscriptionTierSerializer
    permission_classes = [permissions.AllowAny]


class SubscriptionTierDetailView(generics.RetrieveAPIView):
    """View for subscription tier details."""
    
    queryset = SubscriptionTier.objects.all()
    serializer_class = SubscriptionTierSerializer
    permission_classes = [permissions.AllowAny]


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def purchase_subscription(request):
    """Purchase a subscription."""
    serializer = SubscriptionPurchaseSerializer(data=request.data, context={'request': request})
    serializer.is_valid(raise_exception=True)
    
    tier = serializer.context['tier']
    payment_reference = serializer.validated_data['payment_reference']
    
    # Verify payment with Paystack (simplified for demo)
    # In production, you would verify the payment with Paystack API
    payment_verified = True  # Placeholder for payment verification
    
    if not payment_verified:
        return Response({
            'error': 'Payment verification failed.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Create transaction record
    transaction = Transaction.create_transaction(
        user=request.user,
        transaction_type='subscription',
        amount=tier.price,
        coins_amount=tier.coins_awarded,
        reference_id=payment_reference,
        description=f"Subscription purchase: {tier.get_name_display()}"
    )
    
    # Mark transaction as successful
    transaction.mark_successful({'status': 'success'})
    
    # Add coins to user
    request.user.add_coins(tier.coins_awarded)
    
    # Update user's subscription tier
    request.user.subscription_tier = tier.name
    request.user.save()
    
    return Response({
        'message': f'Subscription purchased successfully! {tier.coins_awarded} coins added to your account.',
        'transaction': {
            'id': transaction.id,
            'reference': transaction.reference_id,
            'amount': str(transaction.amount),
            'coins_awarded': transaction.coins_amount,
            'status': transaction.status
        },
        'user_balance': request.user.coin_balance
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_subscription_history(request):
    """Get user's subscription history."""
    user = request.user
    
    subscription_transactions = user.transactions.filter(
        transaction_type='subscription',
        status='success'
    ).order_by('-created_at')
    
    return Response({
        'current_tier': user.subscription_tier,
        'current_balance': user.coin_balance,
        'subscription_history': [
            {
                'id': transaction.id,
                'amount': str(transaction.amount),
                'coins_awarded': transaction.coins_amount,
                'date': transaction.created_at,
                'reference': transaction.reference_id
            }
            for transaction in subscription_transactions
        ]
    })
