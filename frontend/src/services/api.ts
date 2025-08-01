import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('access_token', access);

          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData: any) => api.post('/auth/register/', userData),
  login: (credentials: any) => api.post('/auth/login/', credentials),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (userData: any) => api.put('/auth/profile/', userData),
};

// Subscription API
export const subscriptionAPI = {
  getTiers: () => api.get('/subscriptions/'),
};

// Games API
export const gamesAPI = {
  getGames: (params?: any) => api.get('/games/', { params }),
  getGame: (id: number) => api.get(`/games/${id}/`),
};

// Bookings API
export const bookingsAPI = {
  getBookings: () => api.get('/bookings/'),
  createBooking: (bookingData: any) => api.post('/bookings/', bookingData),
  cancelBooking: (id: number) => api.delete(`/bookings/${id}/`),
};

// Payments API
export const paymentsAPI = {
  initializePayment: (paymentData: any) => api.post('/payments/initialize/', paymentData),
};

export default api;