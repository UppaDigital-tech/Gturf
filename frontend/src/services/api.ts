import axios from 'axios';

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
  register: (data: any) => api.post('/auth/register/', data),
  login: (data: any) => api.post('/auth/login/', data),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data: any) => api.patch('/auth/update/', data),
  getDashboard: () => api.get('/auth/dashboard/'),
};

// Games API
export const gamesAPI = {
  getGames: (params?: any) => api.get('/games/', { params }),
  getGame: (id: number) => api.get(`/games/${id}/`),
  createGame: (data: any) => api.post('/games/create/', data),
  getBookings: () => api.get('/games/bookings/'),
  createBooking: (data: any) => api.post('/games/bookings/create/', data),
  getBooking: (id: number) => api.get(`/games/bookings/${id}/`),
  cancelBooking: (id: number) => api.post(`/games/bookings/${id}/cancel/`),
  getBookingsSummary: () => api.get('/games/bookings/summary/'),
};

// Subscriptions API
export const subscriptionsAPI = {
  getTiers: () => api.get('/subscriptions/tiers/'),
  getTier: (id: number) => api.get(`/subscriptions/tiers/${id}/`),
  purchaseSubscription: (data: any) => api.post('/subscriptions/purchase/', data),
  getHistory: () => api.get('/subscriptions/history/'),
};

export default api;