import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Base URL - will be different for development and production
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // Increased to 60 seconds for wake-up scenarios
  headers: {
    'Content-Type': 'application/json',
  },
});

// Wake-up detection and handling
const isLikelyServerSleeping = (error: AxiosError): boolean => {
  // Check for common "server sleeping" indicators
  return (
    error.code === 'ECONNABORTED' || // Timeout
    error.code === 'NETWORK_ERROR' ||
    error.response?.status === 503 || // Service Unavailable
    error.response?.status === 502 || // Bad Gateway
    error.response?.status === 504 || // Gateway Timeout
    (error.response?.status === 500 && !error.response?.data) // Empty 500 error
  );
};

// Request interceptor to add auth token and handle wake-up
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    // Add wake-up indicator to detect if this is a wake-up request
    if (config.url?.includes('/health/')) {
      (config as any).metadata = { isWakeUpRequest: true };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors and wake-up logic
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { 
      _retry?: boolean; 
      metadata?: { isWakeUpRequest?: boolean } 
    };

    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Check if this looks like a sleeping server and we haven't already retried
    if (
      !originalRequest._retry && 
      !(originalRequest as any).metadata?.isWakeUpRequest &&
      isLikelyServerSleeping(error)
    ) {
      console.log('Server appears to be sleeping, attempting wake-up...');
      
      try {
        // Dynamically import to avoid circular dependency
        const { wakeUpService } = await import('../services/wakeupService');
        
        // Mark as retry to prevent infinite loops
        originalRequest._retry = true;
        
        // Attempt to wake up the server
        const wakeUpResult = await wakeUpService.smartWakeUp();
        
        if (wakeUpResult.status === 'awake') {
          console.log('Server awakened successfully, retrying original request...');
          
          // Retry the original request
          return api.request(originalRequest);
        } else {
          console.error('Failed to wake up server:', wakeUpResult.message);
        }
      } catch (wakeUpError) {
        console.error('Wake-up process failed:', wakeUpError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;