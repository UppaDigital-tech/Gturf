import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { gamesAPI } from '../services/api';

interface Game {
  id: number;
  name: string;
  location: string;
  date_time: string;
  coin_price: number;
  total_slots: number;
  booked_slots: number;
  available_slots: number;
  status: string;
  description: string;
  created_by: string;
  is_full: boolean;
  is_upcoming: boolean;
  created_at: string;
}

interface Booking {
  id: number;
  user: string;
  game: number;
  game_name: string;
  game_location: string;
  game_date_time: string;
  status: string;
  coins_paid: number;
  booking_reference: string;
  notes: string;
  created_at: string;
}

interface GameContextType {
  games: Game[];
  bookings: Booking[];
  loading: boolean;
  fetchGames: (params?: any) => Promise<void>;
  fetchBookings: () => Promise<void>;
  createBooking: (gameId: number, notes?: string) => Promise<void>;
  cancelBooking: (bookingId: number) => Promise<void>;
  getGame: (id: number) => Promise<Game>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGames = async (params?: any) => {
    setLoading(true);
    try {
      const response = await gamesAPI.getGames(params);
      setGames(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await gamesAPI.getBookings();
      setBookings(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (gameId: number, notes?: string) => {
    try {
      const response = await gamesAPI.createBooking({ game: gameId, notes });
      await fetchBookings(); // Refresh bookings
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create booking');
    }
  };

  const cancelBooking = async (bookingId: number) => {
    try {
      const response = await gamesAPI.cancelBooking(bookingId);
      await fetchBookings(); // Refresh bookings
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const getGame = async (id: number): Promise<Game> => {
    try {
      const response = await gamesAPI.getGame(id);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch game');
    }
  };

  const value = {
    games,
    bookings,
    loading,
    fetchGames,
    fetchBookings,
    createBooking,
    cancelBooking,
    getGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};