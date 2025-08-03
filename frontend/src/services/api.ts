import axios from 'axios';
import { withWakeUp } from '../utils/wakeUpBackend';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
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
        const response = await axios.post(`${API_URL}/api/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: withWakeUp((data: any) => api.post('/auth/register/', data)),
  login: withWakeUp((data: any) => api.post('/auth/login/', data)),
  getProfile: withWakeUp(() => api.get('/auth/profile/')),
  updateProfile: withWakeUp((data: any) => api.patch('/auth/update/', data)),
  getDashboard: withWakeUp(() => api.get('/auth/dashboard/')),
};

// Games API
export const gamesAPI = {
  getGames: withWakeUp((params?: any) => api.get('/games/', { params })),
  getGame: withWakeUp((id: number) => api.get(`/games/${id}/`)),
  createGame: withWakeUp((data: any) => api.post('/games/create/', data)),
  getBookings: withWakeUp(() => api.get('/games/bookings/')),
  createBooking: withWakeUp((data: any) => api.post('/games/bookings/create/', data)),
  getBooking: withWakeUp((id: number) => api.get(`/games/bookings/${id}/`)),
  cancelBooking: withWakeUp((id: number) => api.post(`/games/bookings/${id}/cancel/`)),
  getBookingsSummary: withWakeUp(() => api.get('/games/bookings/summary/')),
};

// Subscriptions API
export const subscriptionsAPI = {
  getTiers: withWakeUp(() => api.get('/subscriptions/tiers/')),
  getTier: withWakeUp((id: number) => api.get(`/subscriptions/tiers/${id}/`)),
  purchaseSubscription: withWakeUp((data: any) => api.post('/subscriptions/purchase/', data)),
  getHistory: withWakeUp(() => api.get('/subscriptions/history/')),
};

export default api;