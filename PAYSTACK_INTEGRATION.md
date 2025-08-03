# Paystack Integration Guide

## Overview
This guide explains how to set up and test the Paystack payment integration for the Galactiturf platform.

## Setup Instructions

### 1. Paystack Account Setup
1. **Create Account**: Sign up at [Paystack](https://paystack.com/)
2. **Verify Account**: Complete KYC verification
3. **Get API Keys**: Navigate to **Settings** → **API Keys & Webhooks**

### 2. Environment Variables
Add these to your `.env` file:

```bash
# Paystack Configuration
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FRONTEND_URL=http://localhost:3000
```

### 3. Webhook Configuration

#### Production Setup
1. Go to **Settings** → **Webhooks** in your Paystack dashboard
2. Click **Add Webhook**
3. Configure the webhook:
   - **URL**: `https://your-backend-app.onrender.com/api/payments/webhook/`
   - **Events**: Select all events
     - `charge.success`
     - `charge.failed`
     - `transfer.success`
     - `transfer.failed`
4. Copy the webhook secret (if provided)

#### Local Development
For local testing, use ngrok:
```bash
# Install ngrok
npm install -g ngrok

# Start your Django server
python manage.py runserver

# In another terminal, expose your local server
ngrok http 8000

# Use the ngrok URL in Paystack webhook
# Example: https://abc123.ngrok.io/api/payments/webhook/
```

### 4. Payment Flow

#### Frontend Implementation
```javascript
// Initialize payment
const initializePayment = async (subscriptionData) => {
  try {
    const response = await fetch('/api/payments/initialize/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        transaction_type: 'subscription',
        amount: subscriptionData.price,
        email: user.email,
        reference: `PS_${Date.now()}`,
        description: `Subscription: ${subscriptionData.name}`
      })
    });

    const data = await response.json();
    
    // Redirect to Paystack
    window.location.href = data.authorization_url;
  } catch (error) {
    console.error('Payment initialization failed:', error);
  }
};
```

#### Backend Processing
The webhook automatically:
1. Verifies the payment signature
2. Processes successful payments
3. Awards coins to users
4. Updates subscription status

### 5. Testing

#### Test Cards
Use these test cards for development:

**Successful Payment:**
- Card Number: `4084 0840 8408 4081`
- Expiry: Any future date
- CVV: Any 3 digits
- PIN: Any 4 digits

**Failed Payment:**
- Card Number: `4084 0840 8408 4082`
- Expiry: Any future date
- CVV: Any 3 digits
- PIN: Any 4 digits

#### Test Scenarios
1. **Successful Subscription Purchase**
   - Select Bronze tier (₦5,000)
   - Use successful test card
   - Verify 1000 coins are awarded

2. **Failed Payment**
   - Use failed test card
   - Verify error handling

3. **Webhook Testing**
   - Check webhook logs in Paystack dashboard
   - Verify transaction status in Django admin

### 6. Monitoring

#### Paystack Dashboard
- **Transactions**: Monitor all payment attempts
- **Webhooks**: Check webhook delivery status
- **Logs**: Review detailed transaction logs

#### Django Admin
- **Transactions**: View all payment records
- **Users**: Check coin balances and subscription status
- **Logs**: Monitor webhook processing

### 7. Security Considerations

#### Webhook Security
- Always verify webhook signatures
- Use HTTPS in production
- Implement idempotency to prevent duplicate processing

#### API Security
- Keep secret keys secure
- Use environment variables
- Implement rate limiting
- Monitor for suspicious activity

### 8. Error Handling

#### Common Issues
1. **Webhook Not Received**
   - Check webhook URL is correct
   - Verify server is accessible
   - Check firewall settings

2. **Payment Not Processed**
   - Verify webhook signature
   - Check transaction status in Paystack
   - Review Django logs

3. **Coins Not Awarded**
   - Check user account exists
   - Verify subscription tier configuration
   - Review transaction processing logic

### 9. Production Checklist

- [ ] Paystack account verified
- [ ] API keys configured
- [ ] Webhook URL set correctly
- [ ] HTTPS enabled
- [ ] Error handling implemented
- [ ] Monitoring set up
- [ ] Test payments completed
- [ ] Documentation updated

### 10. Support

#### Paystack Support
- **Documentation**: [Paystack Docs](https://paystack.com/docs)
- **Support**: support@paystack.com
- **Community**: [Paystack Community](https://community.paystack.com)

#### Galactiturf Support
- Check Django admin for transaction logs
- Review webhook processing in `/api/payments/webhook/`
- Monitor user coin balances and subscription status

## Example Webhook Payload

```json
{
  "event": "charge.success",
  "data": {
    "id": 123456789,
    "domain": "test",
    "amount": 500000,
    "currency": "NGN",
    "source": "card",
    "reason": null,
    "recipient": null,
    "status": "success",
    "reference": "PS_1234567890",
    "paid_at": "2024-01-01T12:00:00.000Z",
    "paidAt": "2024-01-01T12:00:00.000Z",
    "channel": "card",
    "customer": {
      "id": 123456,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "customer_code": "CUS_123456",
      "phone": null,
      "metadata": null,
      "risk_action": "default"
    },
    "plan": null,
    "split": {},
    "order_id": null,
    "metadata": {
      "transaction_id": "123",
      "user_id": "456",
      "transaction_type": "subscription"
    },
    "fees_breakdown": null,
    "log": null,
    "fees": 1250,
    "fees_split": null,
    "authorization": {
      "authorization_code": "AUTH_123456",
      "bin": "408408",
      "last4": "4081",
      "exp_month": "12",
      "exp_year": "2025",
      "channel": "card",
      "card_type": "visa",
      "bank": "TEST BANK",
      "country_code": "NG",
      "brand": "visa",
      "reusable": true,
      "signature": "SIG_123456"
    },
    "gateway_response": "Approved",
    "channel": "card",
    "ip_address": "127.0.0.1",
    "created_at": "2024-01-01T12:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z"
  }
}
```

This webhook payload will be automatically processed by the Django backend to award coins to the user and update their subscription status.