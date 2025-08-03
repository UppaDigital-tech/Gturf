/**
 * Standalone Backend Wake-up Script for Galactiturf
 * 
 * This script can be used independently to wake up the Render backend
 * before it goes to sleep due to inactivity.
 * 
 * Usage:
 * 1. Run this script periodically (every 10-14 minutes) to keep backend awake
 * 2. Use with cron jobs, GitHub Actions, or monitoring services
 * 3. Can be called directly from frontend before critical operations
 */

const BACKEND_URL = process.env.REACT_APP_API_URL || 'https://galactiturf-backend.onrender.com/api';
const HEALTH_ENDPOINT = `${BACKEND_URL}/health/`;
const WAKE_UP_TIMEOUT = 45000; // 45 seconds
const MAX_RETRIES = 3;

/**
 * Sleep utility function
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Ping the backend health endpoint
 */
async function pingBackend(timeout = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const startTime = Date.now();
    const response = await fetch(HEALTH_ENDPOINT, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;

    return {
      success: response.ok,
      status: response.status,
      responseTime,
      data: response.ok ? await response.json() : null,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    return {
      success: false,
      error: error.message,
      responseTime: Date.now() - Date.now(),
    };
  }
}

/**
 * Check if backend appears to be sleeping
 */
async function isBackendSleeping() {
  try {
    const result = await pingBackend(5000); // 5 second timeout for sleep check
    
    // Consider sleeping if:
    // - Request failed
    // - Response time > 3 seconds
    // - Status indicates server issues
    return (
      !result.success ||
      result.responseTime > 3000 ||
      [502, 503, 504].includes(result.status)
    );
  } catch (error) {
    console.error('Sleep check failed:', error);
    return true; // Assume sleeping if check fails
  }
}

/**
 * Wake up the backend with retries
 */
async function wakeUpBackend() {
  console.log('🔄 Starting backend wake-up process...');
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    console.log(`⏱️  Wake-up attempt ${attempt}/${MAX_RETRIES}`);
    
    try {
      const startTime = Date.now();
      const result = await pingBackend(WAKE_UP_TIMEOUT);
      
      if (result.success) {
        const totalTime = Date.now() - startTime;
        console.log(`✅ Backend awakened successfully!`);
        console.log(`📊 Response time: ${result.responseTime}ms`);
        console.log(`⏱️  Total wake-up time: ${totalTime}ms`);
        
        if (result.data) {
          console.log(`🏥 Health status:`, JSON.stringify(result.data, null, 2));
        }
        
        return {
          success: true,
          attempt,
          responseTime: result.responseTime,
          totalTime,
          data: result.data,
        };
      } else {
        console.log(`❌ Attempt ${attempt} failed:`, result.error || `HTTP ${result.status}`);
      }
    } catch (error) {
      console.error(`❌ Attempt ${attempt} error:`, error.message);
    }
    
    // Wait before retry (exponential backoff)
    if (attempt < MAX_RETRIES) {
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
      console.log(`⏳ Waiting ${delay}ms before retry...`);
      await sleep(delay);
    }
  }
  
  console.error('❌ Failed to wake up backend after all attempts');
  return {
    success: false,
    attempts: MAX_RETRIES,
    error: 'All wake-up attempts failed',
  };
}

/**
 * Smart wake-up: Check if sleeping first, then wake up if needed
 */
async function smartWakeUp() {
  console.log('🧠 Smart wake-up: Checking backend status...');
  
  const isSleeping = await isBackendSleeping();
  
  if (!isSleeping) {
    console.log('✅ Backend is already awake and responsive');
    return {
      success: true,
      message: 'Backend already awake',
      wasAwake: true,
    };
  }
  
  console.log('😴 Backend appears to be sleeping, initiating wake-up...');
  const result = await wakeUpBackend();
  
  return {
    ...result,
    wasAwake: false,
  };
}

/**
 * Keep-alive function that can be called periodically
 */
async function keepAlive() {
  const timestamp = new Date().toISOString();
  console.log(`🏁 [${timestamp}] Starting keep-alive check...`);
  
  try {
    const result = await smartWakeUp();
    
    if (result.success) {
      console.log(`✅ [${timestamp}] Keep-alive successful`);
      if (!result.wasAwake) {
        console.log(`⚡ Backend was sleeping but is now awake`);
      }
    } else {
      console.error(`❌ [${timestamp}] Keep-alive failed:`, result.error);
    }
    
    return result;
  } catch (error) {
    console.error(`💥 [${timestamp}] Keep-alive error:`, error);
    return {
      success: false,
      error: error.message,
      timestamp,
    };
  }
}

/**
 * Schedule keep-alive to run every 14 minutes (before Render's 15-minute sleep)
 */
function scheduleKeepAlive() {
  const INTERVAL = 14 * 60 * 1000; // 14 minutes
  
  console.log('📅 Scheduling keep-alive every 14 minutes...');
  
  // Run immediately
  keepAlive();
  
  // Then run every 14 minutes
  setInterval(keepAlive, INTERVAL);
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    pingBackend,
    isBackendSleeping,
    wakeUpBackend,
    smartWakeUp,
    keepAlive,
    scheduleKeepAlive,
  };
}

// If running directly (Node.js)
if (typeof require !== 'undefined' && require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--keep-alive')) {
    scheduleKeepAlive();
  } else if (args.includes('--once')) {
    keepAlive().then(result => {
      process.exit(result.success ? 0 : 1);
    });
  } else {
    console.log('Galactiturf Backend Wake-up Script');
    console.log('');
    console.log('Usage:');
    console.log('  node standalone-wakeup.js --once      # Run once and exit');
    console.log('  node standalone-wakeup.js --keep-alive # Keep running and wake up every 14 minutes');
    console.log('');
    console.log('Environment Variables:');
    console.log('  REACT_APP_API_URL - Backend API URL');
    console.log('');
    process.exit(1);
  }
}

// Export for frontend use
if (typeof window !== 'undefined') {
  window.GalactiturfWakeUp = {
    pingBackend,
    isBackendSleeping,
    wakeUpBackend,
    smartWakeUp,
    keepAlive,
  };
}