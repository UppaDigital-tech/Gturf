import uuid
import requests
from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import SubscriptionTier, Transaction
from .serializers import SubscriptionTierSerializer, TransactionSerializer
from accounts.models import User

PAYSTACK_BASE_URL = 'https://api.paystack.co'


class SubscriptionTierListView(generics.ListAPIView):
    queryset = SubscriptionTier.objects.all()
    serializer_class = SubscriptionTierSerializer
    permission_classes = (permissions.AllowAny,)


class InitializePaymentView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        tier_id = request.data.get('tier_id')
        try:
            tier = SubscriptionTier.objects.get(id=tier_id)
        except SubscriptionTier.DoesNotExist:
            return Response({'detail': 'Subscription tier not found.'}, status=status.HTTP_404_NOT_FOUND)

        reference = str(uuid.uuid4())
        headers = {
            'Authorization': f'Bearer {settings.PAYSTACK_SECRET_KEY}',
            'Content-Type': 'application/json',
        }
        data = {
            'email': request.user.email,
            'amount': int(tier.price * 100),  # convert to kobo
            'reference': reference,
            'callback_url': settings.BASE_DIR.as_posix() + '/api/subscriptions/verify/',
        }

        response = requests.post(f'{PAYSTACK_BASE_URL}/transaction/initialize', json=data, headers=headers)
        resp_json = response.json()
        if not resp_json.get('status'):
            return Response({'detail': 'Unable to initialize payment'}, status=status.HTTP_400_BAD_REQUEST)

        # Create transaction record
        Transaction.objects.create(
            user=request.user,
            amount=tier.price,
            reference_id=reference,
            status='pending'
        )

        return Response({'authorization_url': resp_json['data']['authorization_url'], 'reference': reference})


class VerifyPaymentView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, *args, **kwargs):
        reference = request.query_params.get('reference')
        if not reference:
            return Response({'detail': 'Reference not provided'}, status=status.HTTP_400_BAD_REQUEST)
        headers = {
            'Authorization': f'Bearer {settings.PAYSTACK_SECRET_KEY}',
        }
        response = requests.get(f'{PAYSTACK_BASE_URL}/transaction/verify/{reference}', headers=headers)
        resp_json = response.json()
        try:
            transaction = Transaction.objects.get(reference_id=reference)
        except Transaction.DoesNotExist:
            return Response({'detail': 'Transaction not found'}, status=status.HTTP_404_NOT_FOUND)

        if resp_json.get('status') and resp_json['data']['status'] == 'success':
            transaction.status = 'success'
            transaction.save()
            # credit coins
            tier = SubscriptionTier.objects.get(price=transaction.amount)
            user = transaction.user
            user.coin_balance += tier.coins_awarded
            user.subscription_tier = tier
            user.save()
            return Response({'detail': 'Payment verified successfully'})
        else:
            transaction.status = 'failed'
            transaction.save()
            return Response({'detail': 'Payment verification failed'}, status=status.HTTP_400_BAD_REQUEST)