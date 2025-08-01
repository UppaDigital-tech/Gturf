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
- `POST /api/payment/webhook/` - Paystack webhook

### Subscription Endpoints
- `GET /api/subscriptions/tiers/` - List subscription tiers

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