import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { subscriptionsAPI } from '../services/api';

interface SubscriptionTier {
  id: number;
  name: string;
  price: number;
  coins_awarded: number;
  description: string;
  duration_days: number;
  is_active: boolean;
}

interface SubscriptionHistory {
  id: number;
  amount: string;
  coins_awarded: number;
  date: string;
  reference: string;
}

interface SubscriptionContextType {
  tiers: SubscriptionTier[];
  history: SubscriptionHistory[];
  loading: boolean;
  fetchTiers: () => Promise<void>;
  fetchHistory: () => Promise<void>;
  purchaseSubscription: (tierId: number, paymentReference: string) => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [history, setHistory] = useState<SubscriptionHistory[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTiers = async () => {
    setLoading(true);
    try {
      const response = await subscriptionsAPI.getTiers();
      setTiers(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching subscription tiers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await subscriptionsAPI.getHistory();
      setHistory(response.data.subscription_history || []);
    } catch (error) {
      console.error('Error fetching subscription history:', error);
    } finally {
      setLoading(false);
    }
  };

  const purchaseSubscription = async (tierId: number, paymentReference: string) => {
    try {
      const response = await subscriptionsAPI.purchaseSubscription({
        tier_id: tierId,
        payment_reference: paymentReference,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to purchase subscription');
    }
  };

  const value = {
    tiers,
    history,
    loading,
    fetchTiers,
    fetchHistory,
    purchaseSubscription,
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
};