# Galactiturf Setup Guide

This guide will help you set up and deploy the Galactiturf football game booking platform.

## Prerequisites

- Python 3.9+ (for backend)
- Node.js 16+ (for frontend)
- PostgreSQL (for production)
- Paystack account (for payments)

## Backend Setup

### 1. Environment Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Settings
DATABASE_URL=sqlite:///db.sqlite3

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://galactiturf.vercel.app

# Paystack Settings
PAYSTACK_SECRET_KEY=your-paystack-secret-key
PAYSTACK_PUBLIC_KEY=your-paystack-public-key

# JWT Settings
JWT_SECRET_KEY=your-jwt-secret-key
JWT_ACCESS_TOKEN_LIFETIME=5
JWT_REFRESH_TOKEN_LIFETIME=1
```

### 3. Database Setup

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py populate_sample_data
```

### 4. Create Superuser

```bash
python manage.py createsuperuser
```

### 5. Run Development Server

```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_PAYSTACK_PUBLIC_KEY=your-paystack-public-key
REACT_APP_APP_NAME=Galactiturf
REACT_APP_APP_VERSION=1.0.0
```

### 3. Run Development Server

```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `GET /api/auth/profile/` - Get user profile
- `PUT /api/auth/profile/` - Update user profile

### Subscriptions
- `GET /api/subscriptions/` - List subscription tiers

### Games
- `GET /api/games/` - List games
- `GET /api/games/{id}/` - Get game details

### Bookings
- `GET /api/bookings/` - List user bookings
- `POST /api/bookings/` - Create booking
- `DELETE /api/bookings/{id}/` - Cancel booking

### Payments
- `POST /api/payments/initialize/` - Initialize Paystack payment
- `GET /api/payments/verify/` - Verify payment
- `POST /api/payments/webhook/` - Paystack webhook

## Deployment

### Backend (Render)

1. Connect your repository to Render
2. Create a new Web Service
3. Configure environment variables in Render dashboard
4. Deploy using the provided `render.yaml`

### Frontend (Vercel)

1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy using the provided `vercel.json`

## Paystack Integration

1. Create a Paystack account at https://paystack.com
2. Get your API keys from the dashboard
3. Configure webhook URL: `https://your-backend-url.com/api/payments/webhook/`
4. Update environment variables with your keys

## Features

### User Management
- User registration and authentication
- Profile management
- Coin balance tracking

### Subscription System
- Multiple subscription tiers (Bronze, Silver, Gold, Platinum)
- Coin rewards for subscriptions
- Automatic coin crediting

### Game Booking
- Browse available games
- Book games using coins
- View booking history
- Cancel bookings

### Payment Processing
- Paystack integration
- Secure payment processing
- Webhook handling
- Transaction logging

## Database Models

### User
- Extended Django User model
- Coin balance
- Subscription tier
- Profile information

### SubscriptionTier
- Tier name and type
- Price and coin rewards
- Active status

### Game
- Game details (name, location, date/time)
- Pricing in coins
- Slot management
- Status tracking

### Booking
- User-game relationship
- Payment tracking
- Status management

### Transaction
- Payment logging
- Paystack integration
- Status tracking

## Admin Interface

Access the Django admin at `http://localhost:8000/admin/` to:
- Manage users and their coin balances
- Create and manage games
- View booking history
- Monitor transactions
- Manage subscription tiers

## Sample Data

The platform comes with realistic sample data:
- 4 subscription tiers with different pricing
- 8 sample games across different locations
- Various game types and skill levels

## Security Features

- JWT authentication
- CORS configuration
- Input validation
- Secure payment processing
- Webhook signature verification

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure PostgreSQL is running and credentials are correct
2. **CORS Errors**: Check CORS_ALLOWED_ORIGINS configuration
3. **Payment Issues**: Verify Paystack API keys and webhook configuration
4. **Build Errors**: Check Node.js and Python versions

### Logs

- Backend logs: Check Django development server output
- Frontend logs: Check browser console and React development server
- Payment logs: Check Transaction model in Django admin

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review Django and React documentation
3. Check Paystack documentation for payment issues
4. Create an issue in the repository

## License

This project is licensed under the MIT License.