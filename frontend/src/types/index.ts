export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  coin_balance: number;
  subscription_tier?: SubscriptionTier;
  phone_number?: string;
  date_of_birth?: string;
}

export interface SubscriptionTier {
  id: number;
  name: string;
  tier_type: 'bronze' | 'silver' | 'gold' | 'platinum';
  price: number;
  coins_awarded: number;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Game {
  id: number;
  name: string;
  location: string;
  date_time: string;
  coin_price: number;
  total_slots: number;
  booked_slots: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  description: string;
  rules: string;
  available_slots: number;
  is_full: boolean;
  is_upcoming: boolean;
  can_book: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: number;
  user: User;
  game: Game;
  coins_paid: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  booking_date: string;
  notes?: string;
}

export interface Transaction {
  id: number;
  user: User;
  transaction_type: 'subscription' | 'booking' | 'refund';
  amount: number;
  coins_involved: number;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  reference_id: string;
  paystack_transaction_id?: string;
  description: string;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  tokens: {
    refresh: string;
    access: string;
  };
}

export interface PaymentResponse {
  authorization_url: string;
  reference: string;
  transaction_id: number;
}