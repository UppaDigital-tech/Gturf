# Galactiturf - Football Game Booking Platform

A modern web application for booking football games using a coin-based subscription system.

## Features

- **User Authentication**: Secure login and registration system
- **Subscription Management**: Multiple tiers with coin rewards
- **Game Booking**: Book football games using earned coins
- **Payment Integration**: Paystack payment gateway
- **Admin Panel**: Manage games and subscriptions
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
│   ├── api/                # REST API app
│   ├── accounts/           # User management app
│   ├── games/              # Game management app
│   ├── subscriptions/      # Subscription management app
│   └── payments/           # Payment integration app
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   └── public/
└── docs/                   # Documentation
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
   # Edit .env.local with your backend API URL
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
2. Configure environment variables in Vercel dashboard
3. Deploy using the provided `vercel.json`

## API Documentation

The backend provides RESTful APIs for:

- User authentication and management
- Subscription tiers and purchases
- Game listings and bookings
- Payment processing via Paystack

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License