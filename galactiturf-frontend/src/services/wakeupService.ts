// Wake-up service for handling Render backend sleep issues

interface WakeUpResponse {
  status: 'awake' | 'waking' | 'error';
  message: string;
  responseTime?: number;
}

class WakeUpService {
  private isWakingUp = false;
  private lastWakeUpTime = 0;
  private readonly WAKE_UP_COOLDOWN = 30000; // 30 seconds
  private readonly WAKE_UP_TIMEOUT = 45000; // 45 seconds
  private readonly MAX_RETRIES = 3;

  /**
   * Wake up the backend server if it's sleeping
   * @param force - Force wake up even if recently attempted
   * @returns Promise<WakeUpResponse>
   */
  async wakeUpBackend(force = false): Promise<WakeUpResponse> {
    const now = Date.now();
    
    // Check if we're already waking up
    if (this.isWakingUp && !force) {
      return {
        status: 'waking',
        message: 'Backend is already waking up...'
      };
    }

    // Check cooldown period
    if (!force && (now - this.lastWakeUpTime) < this.WAKE_UP_COOLDOWN) {
      return {
        status: 'awake',
        message: 'Backend was recently awakened'
      };
    }

    this.isWakingUp = true;
    this.lastWakeUpTime = now;

    try {
      const startTime = Date.now();
      
      // Try to ping the health endpoint with timeout
      const response = await Promise.race([
        this.pingHealthEndpoint(),
        this.timeoutPromise(this.WAKE_UP_TIMEOUT)
      ]);

      const responseTime = Date.now() - startTime;

      if (response.ok) {
        this.isWakingUp = false;
        return {
          status: 'awake',
          message: 'Backend is awake and ready',
          responseTime
        };
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      this.isWakingUp = false;
      console.error('Backend wake-up failed:', error);
      
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to wake up backend'
      };
    }
  }

  /**
   * Wake up backend with retries
   */
  async wakeUpWithRetries(): Promise<WakeUpResponse> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        console.log(`Wake-up attempt ${attempt}/${this.MAX_RETRIES}`);
        
        const result = await this.wakeUpBackend(attempt > 1);
        
        if (result.status === 'awake') {
          return result;
        }
        
        if (result.status === 'error') {
          lastError = new Error(result.message);
        }

        // Wait before retry (exponential backoff)
        if (attempt < this.MAX_RETRIES) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        console.error(`Wake-up attempt ${attempt} failed:`, error);
      }
    }

    return {
      status: 'error',
      message: `Failed to wake up backend after ${this.MAX_RETRIES} attempts: ${lastError?.message || 'Unknown error'}`
    };
  }

  /**
   * Check if backend is likely sleeping based on response time
   */
  async isBackendSleeping(): Promise<boolean> {
    try {
      const startTime = Date.now();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/health/`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      
      const responseTime = Date.now() - startTime;
      
      // If it takes more than 3 seconds or fails, it's likely sleeping
      return !response.ok || responseTime > 3000;
    } catch (error) {
      // Network error or timeout indicates sleeping
      return true;
    }
  }

  /**
   * Intelligent wake-up that checks if backend is sleeping first
   */
  async smartWakeUp(): Promise<WakeUpResponse> {
    try {
      const isSleeping = await this.isBackendSleeping();
      
      if (!isSleeping) {
        return {
          status: 'awake',
          message: 'Backend is already awake'
        };
      }

      console.log('Backend appears to be sleeping, initiating wake-up...');
      return await this.wakeUpWithRetries();
    } catch (error) {
      console.error('Smart wake-up failed:', error);
      return {
        status: 'error',
        message: 'Failed to determine backend status'
      };
    }
  }

  /**
   * Ping the health endpoint
   */
  private async pingHealthEndpoint(): Promise<Response> {
    return fetch(`${process.env.REACT_APP_API_URL}/health/`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
  }

  /**
   * Create a timeout promise
   */
  private timeoutPromise(ms: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Wake-up timeout')), ms);
    });
  }

  /**
   * Get current wake-up status
   */
  getStatus() {
    return {
      isWakingUp: this.isWakingUp,
      lastWakeUpTime: this.lastWakeUpTime,
      timeSinceLastWakeUp: Date.now() - this.lastWakeUpTime
    };
  }

  /**
   * Reset the service state
   */
  reset() {
    this.isWakingUp = false;
    this.lastWakeUpTime = 0;
  }
}

// Create and export singleton instance
export const wakeUpService = new WakeUpService();

// Export types
export type { WakeUpResponse };

// Utility function for easy access
export const wakeUpBackend = () => wakeUpService.smartWakeUp();