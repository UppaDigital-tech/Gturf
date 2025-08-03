import api from '../config/api';
import {
  LoginData,
  RegisterData,
  AuthResponse,
  UserProfile,
  ProfileUpdateData,
  SubscriptionTier,
  Game,
  GameFilters,
  Booking,
  BookingListItem,
  CreateBookingData,
  Transaction,
  PaymentInitializationData,
  PaymentInitializationResponse,
  PaymentVerificationData,
  PaymentVerificationResponse,
  DashboardData,
} from '../types';

// Authentication API
export const authAPI = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login/', data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register/', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout/');
  },
};

// User Profile API
export const userAPI = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get('/user/profile/');
    return response.data;
  },

  updateProfile: async (data: ProfileUpdateData): Promise<UserProfile> => {
    const response = await api.patch('/user/profile/', data);
    return response.data;
  },

  getBookings: async (): Promise<BookingListItem[]> => {
    const response = await api.get('/user/bookings/');
    return response.data.results || response.data;
  },

  getTransactions: async (): Promise<Transaction[]> => {
    const response = await api.get('/user/transactions/');
    return response.data.results || response.data;
  },

  getDashboard: async (): Promise<DashboardData> => {
    const response = await api.get('/user/dashboard/');
    return response.data;
  },
};

// Subscription API
export const subscriptionAPI = {
  getTiers: async (): Promise<SubscriptionTier[]> => {
    const response = await api.get('/subscriptions/tiers/');
    return response.data.results || response.data;
  },
};

// Games API
export const gamesAPI = {
  getGames: async (filters?: GameFilters): Promise<Game[]> => {
    const params = new URLSearchParams();
    if (filters?.location) params.append('location', filters.location);
    if (filters?.date_from) params.append('date_from', filters.date_from);
    if (filters?.date_to) params.append('date_to', filters.date_to);

    const response = await api.get(`/games/?${params.toString()}`);
    return response.data.results || response.data;
  },

  getGame: async (id: number): Promise<Game> => {
    const response = await api.get(`/games/${id}/`);
    return response.data;
  },
};

// Booking API
export const bookingAPI = {
  createBooking: async (data: CreateBookingData): Promise<Booking> => {
    const response = await api.post('/booking/create/', data);
    return response.data;
  },

  getBooking: async (id: number): Promise<Booking> => {
    const response = await api.get(`/booking/${id}/`);
    return response.data;
  },
};

// Payment API
export const paymentAPI = {
  initializePayment: async (data: PaymentInitializationData): Promise<PaymentInitializationResponse> => {
    const response = await api.post('/payment/initialize/', data);
    return response.data;
  },

  verifyPayment: async (data: PaymentVerificationData): Promise<PaymentVerificationResponse> => {
    const response = await api.post('/payment/verify/', data);
    return response.data;
  },
};

// Utility API
export const utilityAPI = {
  healthCheck: async (): Promise<{ status: string; message: string }> => {
    const response = await api.get('/health/');
    return response.data;
  },

  getApiInfo: async (): Promise<any> => {
    const response = await api.get('/info/');
    return response.data;
  },
};

const apiServices = {
  auth: authAPI,
  user: userAPI,
  subscription: subscriptionAPI,
  games: gamesAPI,
  booking: bookingAPI,
  payment: paymentAPI,
  utility: utilityAPI,
};

export default apiServices;