from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
import requests
import json
from .models import Transaction
from subscriptions.models import SubscriptionTier
from accounts.models import User


@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def paystack_webhook(request):
    """
    Handle Paystack webhook for payment verification.
    """
    # Verify the webhook signature
    signature = request.headers.get('X-Paystack-Signature')
    if not verify_paystack_signature(request.body, signature):
        return Response({'error': 'Invalid signature'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        payload = json.loads(request.body)
        event = payload.get('event')
        data = payload.get('data', {})
        
        if event == 'charge.success':
            return handle_successful_payment(data)
        elif event == 'charge.failed':
            return handle_failed_payment(data)
        elif event == 'transfer.success':
            return handle_successful_transfer(data)
        elif event == 'transfer.failed':
            return handle_failed_transfer(data)
        else:
            return Response({'message': 'Event not handled'}, status=status.HTTP_200_OK)
            
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


def verify_paystack_signature(payload, signature):
    """
    Verify Paystack webhook signature.
    """
    import hmac
    import hashlib
    
    if not signature or not settings.PAYSTACK_SECRET_KEY:
        return False
    
    # Create HMAC SHA512 hash
    hash = hmac.new(
        settings.PAYSTACK_SECRET_KEY.encode('utf-8'),
        payload,
        hashlib.sha512
    ).hexdigest()
    
    return hmac.compare_digest(hash, signature)


def handle_successful_payment(data):
    """
    Handle successful payment from Paystack.
    """
    reference = data.get('reference')
    amount = data.get('amount') / 100  # Convert from kobo to naira
    customer_email = data.get('customer', {}).get('email')
    
    try:
        # Find the transaction
        transaction = Transaction.objects.get(reference_id=reference)
        
        if transaction.status == 'pending':
            # Mark transaction as successful
            transaction.mark_successful(data)
            
            # Process based on transaction type
            if transaction.transaction_type == 'subscription':
                process_subscription_payment(transaction)
            elif transaction.transaction_type == 'booking':
                process_booking_payment(transaction)
            
            return Response({'message': 'Payment processed successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Transaction already processed'}, status=status.HTTP_200_OK)
            
    except Transaction.DoesNotExist:
        return Response({'error': 'Transaction not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


def handle_failed_payment(data):
    """
    Handle failed payment from Paystack.
    """
    reference = data.get('reference')
    
    try:
        transaction = Transaction.objects.get(reference_id=reference)
        transaction.mark_failed(data)
        return Response({'message': 'Payment failure recorded'}, status=status.HTTP_200_OK)
    except Transaction.DoesNotExist:
        return Response({'error': 'Transaction not found'}, status=status.HTTP_404_NOT_FOUND)


def process_subscription_payment(transaction):
    """
    Process subscription payment and award coins to user.
    """
    user = transaction.user
    
    # Find the subscription tier based on the transaction amount
    try:
        tier = SubscriptionTier.objects.get(price=transaction.amount, is_active=True)
        
        # Add coins to user
        user.add_coins(tier.coins_awarded)
        
        # Update user's subscription tier
        user.subscription_tier = tier.name
        user.save()
        
    except SubscriptionTier.DoesNotExist:
        # If tier not found, award coins based on amount (fallback)
        coins_awarded = int(transaction.amount / 5)  # 5 NGN = 1 coin
        user.add_coins(coins_awarded)


def process_booking_payment(transaction):
    """
    Process booking payment.
    """
    # Booking payments are handled in the booking creation process
    # This is mainly for logging purposes
    pass


def handle_successful_transfer(data):
    """
    Handle successful transfer from Paystack.
    """
    # Handle transfers if needed
    return Response({'message': 'Transfer successful'}, status=status.HTTP_200_OK)


def handle_failed_transfer(data):
    """
    Handle failed transfer from Paystack.
    """
    # Handle failed transfers if needed
    return Response({'message': 'Transfer failed'}, status=status.HTTP_200_OK)


@api_view(['POST'])
def initialize_payment(request):
    """
    Initialize payment with Paystack.
    """
    from .models import Transaction
    
    try:
        data = request.data
        transaction_type = data.get('transaction_type')
        amount = data.get('amount')
        email = data.get('email')
        reference = data.get('reference')
        
        # Create transaction record
        transaction = Transaction.create_transaction(
            user=request.user,
            transaction_type=transaction_type,
            amount=amount,
            coins_amount=data.get('coins_amount', 0),
            reference_id=reference,
            description=data.get('description', '')
        )
        
        # Initialize Paystack payment
        paystack_data = {
            'email': email,
            'amount': int(amount * 100),  # Convert to kobo
            'reference': reference,
            'callback_url': f"{settings.FRONTEND_URL}/payment/callback",
            'metadata': {
                'transaction_id': transaction.id,
                'user_id': request.user.id,
                'transaction_type': transaction_type
            }
        }
        
        # Make request to Paystack
        headers = {
            'Authorization': f'Bearer {settings.PAYSTACK_SECRET_KEY}',
            'Content-Type': 'application/json'
        }
        
        response = requests.post(
            'https://api.paystack.co/transaction/initialize',
            json=paystack_data,
            headers=headers
        )
        
        if response.status_code == 200:
            paystack_response = response.json()
            return Response({
                'authorization_url': paystack_response['data']['authorization_url'],
                'reference': reference,
                'transaction_id': transaction.id
            })
        else:
            transaction.mark_failed(response.json())
            return Response({'error': 'Payment initialization failed'}, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def verify_payment(request, reference):
    """
    Verify payment status with Paystack.
    """
    try:
        # Make request to Paystack to verify payment
        headers = {
            'Authorization': f'Bearer {settings.PAYSTACK_SECRET_KEY}',
            'Content-Type': 'application/json'
        }
        
        response = requests.get(
            f'https://api.paystack.co/transaction/verify/{reference}',
            headers=headers
        )
        
        if response.status_code == 200:
            paystack_data = response.json()
            
            if paystack_data['data']['status'] == 'success':
                # Process the payment
                return handle_successful_payment(paystack_data['data'])
            else:
                return Response({'status': 'failed'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Verification failed'}, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
