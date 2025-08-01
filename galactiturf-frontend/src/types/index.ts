// User and Authentication Types
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  coin_balance: number;
  subscription_tier: SubscriptionTier | null;
  phone_number: string;
  date_of_birth: string | null;
  created_at: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

// Subscription Types
export interface SubscriptionTier {
  id: number;
  name: string;
  price: string;
  coins_awarded: number;
  description: string;
  is_active: boolean;
}

// Game Types
export interface Game {
  id: number;
  name: string;
  location: string;
  date_time: string;
  coin_price: number;
  total_slots: number;
  booked_slots: number;
  available_slots: number;
  description: string;
  image: string | null;
  is_active: boolean;
  is_fully_booked: boolean;
  is_past_date: boolean;
  can_be_booked: boolean;
  created_at: string;
}

// Booking Types
export interface Booking {
  id: number;
  user: string;
  game: Game;
  status: 'confirmed' | 'cancelled' | 'completed';
  coins_spent: number;
  booking_reference: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface BookingListItem {
  id: number;
  game_name: string;
  game_location: string;
  game_date_time: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  coins_spent: number;
  booking_reference: string;
  created_at: string;
}

export interface CreateBookingData {
  game_id: number;
  notes?: string;
}

// Transaction Types
export interface Transaction {
  id: number;
  user: string;
  subscription_tier: SubscriptionTier | null;
  amount: string;
  coins_awarded: number;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  transaction_type: 'subscription' | 'coin_purchase';
  reference_id: string;
  paystack_reference: string;
  created_at: string;
  updated_at: string;
}

// Payment Types
export interface PaymentInitializationData {
  subscription_tier_id: number;
}

export interface PaymentInitializationResponse {
  message: string;
  payment_url: string;
  reference: string;
  transaction_id: number;
}

export interface PaymentVerificationData {
  reference: string;
}

export interface PaymentVerificationResponse {
  message: string;
  coins_awarded: number;
  transaction: Transaction;
}

// Dashboard Types
export interface UserStats {
  coin_balance: number;
  subscription_tier: SubscriptionTier | null;
  total_bookings: number;
  confirmed_bookings: number;
  completed_bookings: number;
  total_coins_spent: number;
}

export interface DashboardData {
  user_stats: UserStats;
  recent_transactions: Transaction[];
  upcoming_bookings: BookingListItem[];
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  details?: Record<string, string[]>;
}

// Form Types
export interface GameFilters {
  location?: string;
  date_from?: string;
  date_to?: string;
}

export interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  date_of_birth?: string;
}