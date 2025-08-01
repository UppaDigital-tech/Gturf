# Galactiturf - Football Game Booking Platform

A complete web application for booking football games, managing subscriptions, and earning coins. Built with Django REST API backend and React TypeScript frontend.

## 🏗️ Architecture

- **Backend**: Django REST Framework with PostgreSQL
- **Frontend**: React with TypeScript and Chakra UI
- **Payments**: Paystack integration
- **Deployment**: Backend on Render, Frontend on Vercel

## 🚀 Features

### Core Features
- **User Authentication**: Secure login and registration system
- **Subscription System**: Multiple subscription tiers with coin rewards
- **Game Booking**: Browse and book football games using coins
- **Payment Integration**: Paystack payment gateway for subscriptions
- **Dashboard**: User dashboard with statistics and recent activity

### User Management
- User profiles with coin balance tracking
- Subscription tier management
- Booking history and transaction logs
- Admin panel for game and user management

### Game Management
- Browse available games by location and date
- Real-time slot availability
- Booking confirmation system
- Game details with venue information

## 🛠️ Technology Stack

### Backend
- **Django 5.1.5**: Web framework
- **Django REST Framework**: API development
- **PostgreSQL**: Database
- **Paystack API**: Payment processing
- **Gunicorn**: Production WSGI server

### Frontend
- **React 18**: Frontend framework
- **TypeScript**: Type safety
- **Chakra UI**: Component library
- **React Router**: Navigation
- **Axios**: HTTP client
- **React Hook Form**: Form handling

## 📁 Project Structure

```
galactiturf/
├── galactiturf-backend/          # Django backend
│   ├── galactiturf_project/      # Django project settings
│   ├── core/                     # Main Django app
│   │   ├── models.py            # Database models
│   │   ├── views.py             # API views
│   │   ├── serializers.py       # DRF serializers
│   │   ├── services.py          # Paystack integration
│   │   └── admin.py             # Django admin
│   ├── requirements.txt         # Python dependencies
│   ├── render.yaml             # Render deployment config
│   └── .env.example            # Environment variables example
├── galactiturf-frontend/        # React frontend
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── pages/              # Page components
│   │   ├── contexts/           # React contexts
│   │   ├── services/           # API services
│   │   ├── types/              # TypeScript types
│   │   └── config/             # Configuration files
│   ├── package.json            # Node dependencies
│   ├── vercel.json            # Vercel deployment config
│   └── .env.example           # Environment variables example
└── README.md                   # This file
```

## 🔧 Local Development Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 13+
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd galactiturf/galactiturf-backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Database setup**
   ```bash
   # Create PostgreSQL database
   createdb galactiturf_db
   
   # Run migrations
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Load sample data**
   ```bash
   python manage.py populate_sample_data
   ```

8. **Run development server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../galactiturf-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your API URL
   ```

4. **Run development server**
   ```bash
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Django Admin: http://localhost:8000/admin

## 🌍 Deployment

### Backend Deployment (Render)

1. **Prepare repository**
   - Push your code to GitHub
   - Ensure `render.yaml` is configured

2. **Deploy on Render**
   - Connect your GitHub repository
   - Render will automatically create PostgreSQL database
   - Set environment variables:
     - `SECRET_KEY`
     - `PAYSTACK_SECRET_KEY`
     - `PAYSTACK_PUBLIC_KEY`

3. **Post-deployment**
   ```bash
   # Access Render shell and run:
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py populate_sample_data
   ```

### Frontend Deployment (Vercel)

1. **Prepare for deployment**
   ```bash
   npm run build  # Test build locally
   ```

2. **Deploy on Vercel**
   - Connect your GitHub repository
   - Vercel will auto-detect React app
   - Set environment variables:
     - `REACT_APP_API_URL`: Your Render backend URL
     - `REACT_APP_PAYSTACK_PUBLIC_KEY`: Paystack public key

3. **Update CORS settings**
   - Add your Vercel domain to Django CORS_ALLOWED_ORIGINS

## 🔐 Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=your-domain.onrender.com,localhost,127.0.0.1

DB_NAME=galactiturf_db
DB_USER=postgres
DB_PASSWORD=your-db-password
DB_HOST=localhost
DB_PORT=5432

PAYSTACK_SECRET_KEY=sk_test_your_secret_key
PAYSTACK_PUBLIC_KEY=pk_test_your_public_key
PAYSTACK_WEBHOOK_URL=https://your-backend.onrender.com/api/payment/webhook/
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend.onrender.com/api
REACT_APP_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key
```

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout

### User Endpoints
- `GET /api/user/profile/` - Get user profile
- `PATCH /api/user/profile/` - Update user profile
- `GET /api/user/bookings/` - Get user bookings
- `GET /api/user/transactions/` - Get user transactions
- `GET /api/user/dashboard/` - Get dashboard data

### Game Endpoints
- `GET /api/games/` - List games (with filters)
- `GET /api/games/{id}/` - Get game details

### Booking Endpoints
- `POST /api/booking/create/` - Create booking
- `GET /api/booking/{id}/` - Get booking details

### Payment Endpoints
- `POST /api/payment/initialize/` - Initialize payment
- `POST /api/payment/verify/` - Verify payment
- `POST /api/payment/webhook/` - Paystack webhook (URL: `/api/payment/webhook/`)

### Subscription Endpoints
- `GET /api/subscriptions/tiers/` - List subscription tiers

## 💳 Payment Implementation Guide

### Paystack Integration Setup

#### 1. Backend Configuration
```python
# settings.py
PAYSTACK_SECRET_KEY = 'sk_test_...'  # Your Paystack secret key
PAYSTACK_PUBLIC_KEY = 'pk_test_...'  # Your Paystack public key
PAYSTACK_WEBHOOK_URL = 'https://your-backend.onrender.com/api/payment/webhook/'
```

#### 2. Payment Flow

**Step 1: Initialize Payment**
```javascript
// Frontend: Initialize payment
const response = await api.post('/payment/initialize/', {
  subscription_tier_id: 1  // Selected subscription tier
});

// Response includes:
// - payment_url: Redirect user here
// - reference: Payment reference
// - transaction_id: Internal transaction ID
```

**Step 2: Redirect to Paystack**
```javascript
// Redirect user to Paystack payment page
window.location.href = response.data.payment_url;
```

**Step 3: Payment Verification**
```javascript
// After payment, verify on your callback page
const verifyResponse = await api.post('/payment/verify/', {
  reference: paymentReference  // From URL parameters
});

// On success, user's coins are automatically credited
```

#### 3. Webhook Configuration

**Webhook URL:** `https://your-backend.onrender.com/api/payment/webhook/`

**Webhook Events Handled:**
- `charge.success` - Successful payment processing
- Automatic coin crediting and subscription updates

**Webhook Security:**
- HMAC SHA512 signature verification
- Paystack secret key validation
- Duplicate event protection

#### 4. Frontend Payment Integration

```typescript
// Payment service example
export const processSubscriptionPayment = async (tierId: number) => {
  try {
    // Initialize payment
    const initResponse = await paymentAPI.initializePayment({
      subscription_tier_id: tierId
    });
    
    // Redirect to Paystack
    window.location.href = initResponse.payment_url;
    
  } catch (error) {
    console.error('Payment initialization failed:', error);
    throw error;
  }
};

// Verification after payment
export const verifyPayment = async (reference: string) => {
  try {
    const response = await paymentAPI.verifyPayment({ reference });
    return response;
  } catch (error) {
    console.error('Payment verification failed:', error);
    throw error;
  }
};
```

#### 5. Paystack Dashboard Configuration

1. **Set Webhook URL:** 
   - Go to Paystack Dashboard → Settings → Webhooks
   - Add: `https://your-backend.onrender.com/api/payment/webhook/`

2. **Test Mode:**
   - Use test keys during development
   - Test cards: 4084084084084081 (successful)

3. **Live Mode:**
   - Switch to live keys for production
   - Ensure PCI compliance
   - Monitor transactions regularly

#### 6. Error Handling

```python
# Backend: Comprehensive error handling
class PaystackService:
    def verify_payment(self, reference):
        try:
            # API call to Paystack
            response = requests.get(f"{self.base_url}/transaction/verify/{reference}")
            
            if response.status_code == 200:
                # Process successful payment
                self.credit_user_coins(transaction)
            else:
                # Handle payment failure
                self.mark_transaction_failed(transaction)
                
        except requests.RequestException as e:
            # Handle network errors
            logger.error(f"Paystack API error: {e}")
            raise PaymentProcessingError("Payment verification failed")
```

### Security Considerations

1. **Never expose secret keys** in frontend code
2. **Always verify payments** on the backend
3. **Validate webhook signatures** to prevent tampering
4. **Log all transactions** for audit purposes
5. **Implement rate limiting** on payment endpoints
6. **Use HTTPS** for all payment-related communications

## 🧪 Testing

### Backend Testing
```bash
cd galactiturf-backend
python manage.py test
```

### Frontend Testing
```bash
cd galactiturf-frontend
npm test
```

## 🎯 Usage Guide

### For Users
1. **Registration**: Create account with email and password
2. **Subscription**: Choose a subscription tier to earn coins
3. **Browse Games**: View available football games
4. **Book Games**: Use coins to book games
5. **Dashboard**: Track bookings and coin balance

### For Administrators
1. **Admin Panel**: Access Django admin at `/admin/`
2. **Game Management**: Add/edit football games
3. **User Management**: View user profiles and transactions
4. **Subscription Management**: Configure subscription tiers

## 🐛 Common Issues

### Backend Issues
- **Database connection**: Check PostgreSQL is running
- **Migrations**: Run `python manage.py migrate`
- **CORS errors**: Check CORS_ALLOWED_ORIGINS setting

### Frontend Issues
- **API connection**: Verify REACT_APP_API_URL
- **Build errors**: Check all imports and dependencies
- **Payment issues**: Verify Paystack configuration

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- Backend Development: Django REST Framework
- Frontend Development: React with TypeScript
- Payment Integration: Paystack API
- Deployment: Render + Vercel

## 🙏 Acknowledgments

- Django and React communities
- Chakra UI for beautiful components
- Paystack for payment processing
- Render and Vercel for hosting

---

**Built with ❤️ for football lovers in Lagos and beyond! ⚽**