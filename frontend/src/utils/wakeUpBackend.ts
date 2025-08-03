/**
 * Utility to wake up the Render backend before making API calls
 * Render free tier services go to sleep after 15 minutes of inactivity
 */

const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const WAKE_UP_ENDPOINTS = [
  '/ping/',
  '/health/',
  '/api/games/',
  '/api/subscriptions/tiers/',
];

interface WakeUpOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

class BackendWakeUp {
  private static instance: BackendWakeUp;
  private isWakingUp = false;
  private lastWakeUp = 0;
  private wakeUpInterval = 15 * 60 * 1000; // 15 minutes in milliseconds

  private constructor() {}

  static getInstance(): BackendWakeUp {
    if (!BackendWakeUp.instance) {
      BackendWakeUp.instance = new BackendWakeUp();
    }
    return BackendWakeUp.instance;
  }

  /**
   * Check if backend needs to be woken up
   */
  private needsWakeUp(): boolean {
    const now = Date.now();
    return now - this.lastWakeUp > this.wakeUpInterval;
  }

  /**
   * Wake up the backend by making a request to a lightweight endpoint
   */
  private async wakeUpBackend(options: WakeUpOptions = {}): Promise<boolean> {
    const { timeout = 10000, retries = 3, retryDelay = 2000 } = options;

    if (this.isWakingUp) {
      // If already waking up, wait for it to complete
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (!this.isWakingUp) {
            clearInterval(checkInterval);
            resolve(true);
          }
        }, 100);
      });
    }

    this.isWakingUp = true;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`[BackendWakeUp] Attempting to wake up backend (attempt ${attempt}/${retries})`);
        
        // Try multiple endpoints to ensure backend is fully awake
        const promises = WAKE_UP_ENDPOINTS.map(endpoint => 
          fetch(`${BACKEND_URL}${endpoint}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            signal: AbortSignal.timeout(timeout),
          })
        );

        const responses = await Promise.allSettled(promises);
        
        // Check if at least one endpoint responded successfully
        const successfulResponses = responses.filter(
          response => response.status === 'fulfilled' && 
          response.value.status < 500
        );

        if (successfulResponses.length > 0) {
          this.lastWakeUp = Date.now();
          this.isWakingUp = false;
          console.log('[BackendWakeUp] Backend successfully woken up');
          return true;
        }

        if (attempt < retries) {
          console.log(`[BackendWakeUp] Attempt ${attempt} failed, retrying in ${retryDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }

      } catch (error) {
        console.warn(`[BackendWakeUp] Attempt ${attempt} failed:`, error);
        
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }

    this.isWakingUp = false;
    console.error('[BackendWakeUp] Failed to wake up backend after all attempts');
    return false;
  }

  /**
   * Ensure backend is awake before making API calls
   */
  async ensureBackendAwake(options?: WakeUpOptions): Promise<boolean> {
    // Only wake up if it's been more than 15 minutes since last wake up
    if (this.needsWakeUp()) {
      return await this.wakeUpBackend(options);
    }
    
    return true;
  }

  /**
   * Force wake up the backend (useful for manual testing)
   */
  async forceWakeUp(options?: WakeUpOptions): Promise<boolean> {
    this.lastWakeUp = 0; // Reset last wake up time
    return await this.wakeUpBackend(options);
  }

  /**
   * Get the current wake up status
   */
  getStatus() {
    return {
      isWakingUp: this.isWakingUp,
      lastWakeUp: this.lastWakeUp,
      needsWakeUp: this.needsWakeUp(),
      timeSinceLastWakeUp: Date.now() - this.lastWakeUp,
    };
  }
}

// Export singleton instance
export const backendWakeUp = BackendWakeUp.getInstance();

/**
 * Higher-order function to wrap API calls with wake-up functionality
 */
export function withWakeUp<T extends any[], R>(
  apiFunction: (...args: T) => Promise<R>,
  options?: WakeUpOptions
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    try {
      // Ensure backend is awake before making the API call
      await backendWakeUp.ensureBackendAwake(options);
      
      // Make the actual API call
      return await apiFunction(...args);
    } catch (error) {
      console.error('[withWakeUp] Error in wrapped API call:', error);
      throw error;
    }
  };
}

/**
 * Hook for React components to ensure backend is awake
 */
export function useBackendWakeUp() {
  const wakeUp = async (options?: WakeUpOptions) => {
    return await backendWakeUp.ensureBackendAwake(options);
  };

  const forceWakeUp = async (options?: WakeUpOptions) => {
    return await backendWakeUp.forceWakeUp(options);
  };

  const getStatus = () => {
    return backendWakeUp.getStatus();
  };

  return {
    wakeUp,
    forceWakeUp,
    getStatus,
  };
}

export default backendWakeUp;