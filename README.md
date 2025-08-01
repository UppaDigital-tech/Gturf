# Galactiturf - Football Game Booking Platform

A complete web application for booking football games using a coin-based subscription system.

## Features

- **User Authentication**: Secure login and registration system
- **Subscription Management**: Multiple tiers with coin rewards
- **Game Booking**: Book football games using earned coins
- **Payment Integration**: Paystack payment gateway with webhook processing
- **Admin Interface**: Manage games and subscriptions
- **Marketing Pages**: About and Contact pages with community links
- **Community Integration**: YouTube channel and WhatsApp community links
- **Responsive Design**: Modern UI with Chakra UI

## Tech Stack

- **Backend**: Django 4.2+ with Django REST Framework
- **Frontend**: React 18+ with functional components and hooks
- **Styling**: Chakra UI for modern, accessible components
- **Database**: PostgreSQL
- **Payment**: Paystack API
- **Deployment**: Vercel (Frontend) + Render (Backend)

## Project Structure

```
galactiturf/
├── backend/                 # Django backend
│   ├── galactiturf/        # Main Django project
│   ├── api/                # Django REST API
│   ├── accounts/           # User management
│   ├── games/              # Game and booking models
│   ├── subscriptions/      # Subscription management
│   └── payments/           # Paystack integration
└── frontend/               # React frontend
    ├── src/
    │   ├── components/     # Reusable components
    │   ├── pages/          # Page components
    │   ├── services/       # API services
    │   └── utils/          # Utility functions
    └── public/
```

## Quick Start

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. Run migrations:
   ```bash
   python manage.py migrate
   ```

6. Create superuser:
   ```bash
   python manage.py createsuperuser
   ```

7. Run development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your backend URL
   ```

4. Run development server:
   ```bash
   npm start
   ```

## Deployment

### Backend (Render)

1. Connect your repository to Render
2. Configure environment variables in Render dashboard
3. Deploy using the provided `render.yaml`

### Frontend (Vercel)

1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy using the provided `vercel.json`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `GET /api/auth/profile/` - User profile
- `GET /api/auth/dashboard/` - User dashboard

### Games & Bookings
- `GET /api/games/` - List all games
- `GET /api/games/{id}/` - Game details
- `POST /api/games/bookings/create/` - Book a game
- `GET /api/games/bookings/` - User's bookings
- `POST /api/games/bookings/{id}/cancel/` - Cancel booking

### Subscriptions
- `GET /api/subscriptions/tiers/` - List subscription tiers
- `POST /api/subscriptions/purchase/` - Purchase subscription
- `GET /api/subscriptions/history/` - Subscription history

### Payments
- `POST /api/payments/initialize/` - Initialize payment with Paystack
- `GET /api/payments/verify/{reference}/` - Verify payment status
- `POST /api/payments/webhook/` - Paystack webhook endpoint

## Environment Variables

### Backend (.env)
```
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=postgresql://user:password@host:port/dbname
PAYSTACK_SECRET_KEY=your-paystack-secret-key
PAYSTACK_PUBLIC_KEY=your-paystack-public-key
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend-domain.vercel.app
```

### Frontend (.env.local)
```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_PAYSTACK_PUBLIC_KEY=your-paystack-public-key
```

## Community Links

- **YouTube Channel**: [@galactiturf](https://youtube.com/@galactiturf) - Game highlights, tutorials, and updates
- **WhatsApp Community**: [Join our community](https://wa.me/234XXXXXXXXX) - Instant updates and player connections

## Documentation

- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Complete deployment instructions
- [Paystack Integration Guide](PAYSTACK_INTEGRATION.md) - Detailed payment setup guide

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License