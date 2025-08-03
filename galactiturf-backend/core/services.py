import requests
import json
from django.conf import settings
from django.contrib.auth.models import User
from .models import Transaction, SubscriptionTier


class PaystackService:
    """Service class for Paystack payment integration"""
    
    def __init__(self):
        self.secret_key = settings.PAYSTACK_SECRET_KEY
        self.public_key = settings.PAYSTACK_PUBLIC_KEY
        self.base_url = "https://api.paystack.co"
        
    def _get_headers(self):
        """Get headers for Paystack API requests"""
        return {
            'Authorization': f'Bearer {self.secret_key}',
            'Content-Type': 'application/json',
        }
    
    def initialize_payment(self, user, subscription_tier, callback_url=None):
        """
        Initialize payment with Paystack
        
        Args:
            user: Django User instance
            subscription_tier: SubscriptionTier instance
            callback_url: Optional callback URL
            
        Returns:
            dict: Response from Paystack API
        """
        # Create transaction record
        transaction = Transaction.objects.create(
            user=user,
            subscription_tier=subscription_tier,
            amount=subscription_tier.price,
            coins_awarded=subscription_tier.coins_awarded,
            transaction_type='subscription'
        )
        
        # Prepare payment data
        payment_data = {
            'email': user.email,
            'amount': int(float(subscription_tier.price) * 100),  # Paystack expects amount in kobo
            'reference': transaction.reference_id,
            'callback_url': callback_url or '',
            'metadata': {
                'user_id': user.id,
                'subscription_tier_id': subscription_tier.id,
                'transaction_id': transaction.id,
                'coins_awarded': subscription_tier.coins_awarded,
            }
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/transaction/initialize",
                headers=self._get_headers(),
                data=json.dumps(payment_data)
            )
            
            response_data = response.json()
            
            if response.status_code == 200 and response_data.get('status'):
                # Update transaction with Paystack reference
                if 'data' in response_data and 'reference' in response_data['data']:
                    transaction.paystack_reference = response_data['data']['reference']
                    transaction.gateway_response = response_data
                    transaction.save()
                
                return {
                    'success': True,
                    'data': response_data['data'],
                    'transaction': transaction
                }
            else:
                transaction.status = 'failed'
                transaction.gateway_response = response_data
                transaction.save()
                
                return {
                    'success': False,
                    'message': response_data.get('message', 'Payment initialization failed'),
                    'transaction': transaction
                }
                
        except requests.RequestException as e:
            transaction.status = 'failed'
            transaction.gateway_response = {'error': str(e)}
            transaction.save()
            
            return {
                'success': False,
                'message': f'Network error: {str(e)}',
                'transaction': transaction
            }
    
    def verify_payment(self, reference):
        """
        Verify payment with Paystack
        
        Args:
            reference: Payment reference to verify
            
        Returns:
            dict: Verification result
        """
        try:
            response = requests.get(
                f"{self.base_url}/transaction/verify/{reference}",
                headers=self._get_headers()
            )
            
            response_data = response.json()
            
            if response.status_code == 200 and response_data.get('status'):
                data = response_data.get('data', {})
                
                # Find the transaction by reference
                try:
                    transaction = Transaction.objects.get(
                        reference_id=reference
                    )
                except Transaction.DoesNotExist:
                    return {
                        'success': False,
                        'message': 'Transaction not found'
                    }
                
                # Update transaction status based on payment status
                payment_status = data.get('status')
                
                if payment_status == 'success':
                    transaction.status = 'success'
                    transaction.gateway_response = response_data
                    transaction.save()
                    
                    # Credit user's coin balance
                    user_profile = transaction.user.profile
                    user_profile.add_coins(transaction.coins_awarded)
                    user_profile.subscription_tier = transaction.subscription_tier
                    user_profile.save()
                    
                    return {
                        'success': True,
                        'message': 'Payment verified successfully',
                        'transaction': transaction,
                        'coins_awarded': transaction.coins_awarded
                    }
                else:
                    transaction.status = 'failed'
                    transaction.gateway_response = response_data
                    transaction.save()
                    
                    return {
                        'success': False,
                        'message': f'Payment failed: {payment_status}',
                        'transaction': transaction
                    }
            else:
                return {
                    'success': False,
                    'message': response_data.get('message', 'Payment verification failed')
                }
                
        except requests.RequestException as e:
            return {
                'success': False,
                'message': f'Network error: {str(e)}'
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Verification error: {str(e)}'
            }
    
    def handle_webhook(self, payload, signature):
        """
        Handle Paystack webhook events
        
        Args:
            payload: Webhook payload
            signature: Webhook signature for verification
            
        Returns:
            dict: Processing result
        """
        import hmac
        import hashlib
        
        # Verify webhook signature
        computed_signature = hmac.new(
            self.secret_key.encode('utf-8'),
            payload.encode('utf-8'),
            hashlib.sha512
        ).hexdigest()
        
        if not hmac.compare_digest(signature, computed_signature):
            return {
                'success': False,
                'message': 'Invalid webhook signature'
            }
        
        try:
            event_data = json.loads(payload)
            event_type = event_data.get('event')
            data = event_data.get('data', {})
            
            if event_type == 'charge.success':
                reference = data.get('reference')
                
                if reference:
                    # Verify and process the payment
                    verification_result = self.verify_payment(reference)
                    return verification_result
                else:
                    return {
                        'success': False,
                        'message': 'No reference found in webhook data'
                    }
            else:
                return {
                    'success': True,
                    'message': f'Webhook event {event_type} received but not processed'
                }
                
        except json.JSONDecodeError:
            return {
                'success': False,
                'message': 'Invalid JSON payload'
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Webhook processing error: {str(e)}'
            }
    
    def get_banks(self):
        """
        Get list of banks from Paystack
        
        Returns:
            dict: List of banks or error message
        """
        try:
            response = requests.get(
                f"{self.base_url}/bank",
                headers=self._get_headers()
            )
            
            response_data = response.json()
            
            if response.status_code == 200 and response_data.get('status'):
                return {
                    'success': True,
                    'banks': response_data.get('data', [])
                }
            else:
                return {
                    'success': False,
                    'message': response_data.get('message', 'Failed to fetch banks')
                }
                
        except requests.RequestException as e:
            return {
                'success': False,
                'message': f'Network error: {str(e)}'
            }