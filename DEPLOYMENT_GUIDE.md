# Galactiturf Deployment Guide

## Overview
Galactiturf is a complete football game booking platform built with Django (backend) and React (frontend). This guide will help you deploy the application to free hosting platforms.

## Architecture
- **Backend**: Django REST API with PostgreSQL database
- **Frontend**: React with Chakra UI
- **Payment**: Paystack integration
- **Deployment**: Render (Backend) + Vercel (Frontend)

## Backend Deployment (Render)

### 1. Prepare Your Repository
1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Ensure your repository contains the `render.yaml` file

### 2. Deploy on Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Blueprint"
3. Connect your Git repository
4. Render will automatically detect the `render.yaml` configuration
5. Click "Apply" to deploy

### 3. Environment Variables
Set these environment variables in your Render dashboard:

```
SECRET_KEY=your-secret-key-here
DEBUG=false
ALLOWED_HOSTS=your-app-name.onrender.com
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
PAYSTACK_SECRET_KEY=your-paystack-secret-key
PAYSTACK_PUBLIC_KEY=your-paystack-public-key
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### 4. Database Setup
- Render will automatically create a PostgreSQL database
- The `DATABASE_URL` will be automatically set
- Run migrations: `python manage.py migrate`
- Create superuser: `python manage.py createsuperuser`

## Frontend Deployment (Vercel)

### 1. Prepare Your Repository
1. Ensure your frontend code is in the repository
2. Update the API URL in your environment variables

### 2. Deploy on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Configure the project:
   - Framework Preset: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`

### 3. Environment Variables
Set these environment variables in your Vercel dashboard:

```
REACT_APP_API_URL=https://your-backend-app.onrender.com
REACT_APP_PAYSTACK_PUBLIC_KEY=your-paystack-public-key
```

## Paystack Integration

### 1. Get Paystack Keys
1. Sign up at [Paystack](https://paystack.com/)
2. Go to your dashboard
3. Get your public and secret keys

### 2. Configure Keys
- Add the keys to your environment variables
- Test the integration in sandbox mode first

### 3. Webhook Configuration
1. In your Paystack dashboard, go to **Settings** → **Webhooks**
2. Add a new webhook with the following details:
   - **URL**: `https://your-backend-app.onrender.com/api/payments/webhook/`
   - **Events to send**: Select all events (charge.success, charge.failed, transfer.success, transfer.failed)
3. Copy the webhook secret and add it to your environment variables
4. The webhook will automatically process payments and award coins to users

### 4. Payment Flow
1. **Initialize Payment**: User selects subscription tier
2. **Paystack Redirect**: User is redirected to Paystack payment page
3. **Payment Processing**: User completes payment on Paystack
4. **Webhook Notification**: Paystack sends webhook to your backend
5. **Coin Award**: Backend processes payment and awards coins to user
6. **Success Redirect**: User is redirected back to your frontend

### 5. Testing Payments
- Use Paystack's test cards for development
- Test webhook locally using ngrok or similar service
- Verify payment processing in Django admin

## Local Development Setup

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configuration
python manage.py migrate
python manage.py createsuperuser
python manage.py populate_sample_data
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your backend URL
npm start
```

## Testing the Application

### 1. Backend API
- Admin interface: `http://localhost:8000/admin/`
- API endpoints: `http://localhost:8000/api/`
- Test with sample data created by the management command

### 2. Frontend
- Homepage: `http://localhost:3000/`
- Register/Login functionality
- Browse games and subscriptions

## Sample Data
The application comes with sample data:
- **Subscription Tiers**: Bronze (1000 coins), Silver (5000 coins), Gold (10000 coins)
- **Games**: 8 sample football games with different locations and prices
- **Users**: 4 sample users with different coin balances

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `GET /api/auth/profile/` - User profile
- `GET /api/auth/dashboard/` - User dashboard

### Games
- `GET /api/games/` - List all games
- `GET /api/games/{id}/` - Game details
- `POST /api/games/bookings/create/` - Book a game
- `GET /api/games/bookings/` - User's bookings

### Subscriptions
- `GET /api/subscriptions/tiers/` - List subscription tiers
- `POST /api/subscriptions/purchase/` - Purchase subscription

### Payments
- `POST /api/payments/initialize/` - Initialize payment with Paystack
- `GET /api/payments/verify/{reference}/` - Verify payment status
- `POST /api/payments/webhook/` - Paystack webhook endpoint (for payment processing)

## Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure CORS_ALLOWED_ORIGINS includes your frontend domain
2. **Database Connection**: Check DATABASE_URL in environment variables
3. **Static Files**: Ensure whitenoise is properly configured
4. **Paystack Integration**: Verify your Paystack keys are correct

### Logs
- Check Render logs for backend issues
- Check Vercel logs for frontend issues
- Use Django's DEBUG mode for local development

## Security Considerations
1. Keep your SECRET_KEY secure
2. Use HTTPS in production
3. Set DEBUG=false in production
4. Regularly update dependencies
5. Monitor your application logs

## Performance Optimization
1. Enable database connection pooling
2. Use CDN for static files
3. Implement caching strategies
4. Optimize database queries
5. Use production-ready web server (Gunicorn)

## Support
For issues and questions:
1. Check the application logs
2. Review the Django and React documentation
3. Test locally before deploying
4. Use the sample data for testing

## Next Steps
1. Customize the UI/UX
2. Add more features (notifications, reviews, etc.)
3. Implement advanced payment features
4. Add analytics and monitoring
5. Scale the application as needed