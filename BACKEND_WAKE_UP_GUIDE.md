# Backend Wake-Up System Guide

## Overview

The Galactiturf platform includes an intelligent backend wake-up system to handle Render's free tier sleep behavior. Render free tier services automatically go to sleep after 15 minutes of inactivity, which can cause delays when users try to access the application.

## How It Works

### 1. Automatic Wake-Up Detection
- The system tracks when the backend was last woken up
- If more than 15 minutes have passed, it automatically wakes up the backend before making API calls
- Uses multiple lightweight endpoints to ensure the backend is fully awake

### 2. Wake-Up Endpoints
The system tries these endpoints in order:
- `/ping/` - Simple ping endpoint (fastest)
- `/health/` - Health check endpoint
- `/api/games/` - Games API endpoint
- `/api/subscriptions/tiers/` - Subscriptions API endpoint

### 3. Retry Logic
- Attempts up to 3 times with 2-second delays between attempts
- Uses a 10-second timeout for each request
- Only considers the backend "awake" if at least one endpoint responds successfully

## Implementation

### Frontend Integration

#### 1. Wake-Up Utility (`frontend/src/utils/wakeUpBackend.ts`)
```typescript
import { withWakeUp } from '../utils/wakeUpBackend';

// Wrap API calls with wake-up functionality
const apiCall = withWakeUp(async (data) => {
  return await api.post('/endpoint/', data);
});
```

#### 2. React Hook
```typescript
import { useBackendWakeUp } from '../utils/wakeUpBackend';

const MyComponent = () => {
  const { wakeUp, forceWakeUp, getStatus } = useBackendWakeUp();
  
  const handleAction = async () => {
    await wakeUp(); // Ensure backend is awake
    // Make API call...
  };
};
```

#### 3. API Service Integration
All API calls in `frontend/src/services/api.ts` are automatically wrapped with wake-up functionality:

```typescript
export const authAPI = {
  login: withWakeUp((data: any) => api.post('/auth/login/', data)),
  register: withWakeUp((data: any) => api.post('/auth/register/', data)),
  // ... other endpoints
};
```

### Backend Health Check Endpoints

#### 1. Ping Endpoint (`/ping/`)
```json
{
  "pong": "2024-08-03T10:30:00.000Z"
}
```

#### 2. Health Check Endpoint (`/health/`)
```json
{
  "status": "healthy",
  "timestamp": "2024-08-03T10:30:00.000Z",
  "service": "galactiturf-backend",
  "version": "1.0.0"
}
```

## User Interface

### Backend Status Component
A floating status indicator shows:
- Current backend status (Active/Sleeping/Waking Up)
- Time since last wake-up
- Manual wake-up buttons
- Real-time status updates

### Features:
- **Automatic Detection**: Shows when backend needs wake-up
- **Manual Wake-Up**: Users can manually wake up the backend
- **Force Wake-Up**: Bypass cache and force wake-up
- **Visual Feedback**: Loading states and status indicators

## Configuration

### Environment Variables
```bash
# Backend URL (used by wake-up system)
REACT_APP_API_URL=https://your-backend-app.onrender.com
```

### Wake-Up Options
```typescript
interface WakeUpOptions {
  timeout?: number;      // Request timeout (default: 10000ms)
  retries?: number;      // Number of retry attempts (default: 3)
  retryDelay?: number;   // Delay between retries (default: 2000ms)
}
```

## Performance Optimization

### 1. Caching
- Tracks last wake-up time to avoid unnecessary requests
- Only wakes up backend if more than 15 minutes have passed
- Prevents multiple simultaneous wake-up attempts

### 2. Lightweight Requests
- Uses minimal endpoints for wake-up detection
- Avoids heavy database queries during wake-up
- Fast response times for better user experience

### 3. Graceful Degradation
- Continues with API calls even if wake-up fails
- Provides user feedback for wake-up status
- Fallback to original API behavior

## Monitoring and Debugging

### Console Logging
The system provides detailed console logs:
```
[BackendWakeUp] Attempting to wake up backend (attempt 1/3)
[BackendWakeUp] Backend successfully woken up
[BackendWakeUp] Attempt 1 failed, retrying in 2000ms...
[BackendWakeUp] Failed to wake up backend after all attempts
```

### Status Information
```typescript
const status = backendWakeUp.getStatus();
console.log(status);
// {
//   isWakingUp: false,
//   lastWakeUp: 1691064000000,
//   needsWakeUp: true,
//   timeSinceLastWakeUp: 900000
// }
```

## Best Practices

### 1. User Experience
- Wake up backend before user actions that require API calls
- Show loading states during wake-up process
- Provide clear feedback about backend status

### 2. Performance
- Use lightweight endpoints for wake-up detection
- Implement proper caching to avoid unnecessary wake-ups
- Handle wake-up failures gracefully

### 3. Monitoring
- Log wake-up attempts and success rates
- Monitor backend response times
- Track user experience metrics

## Troubleshooting

### Common Issues

#### 1. Backend Not Waking Up
- Check if Render service is running
- Verify environment variables are correct
- Check network connectivity
- Review console logs for error details

#### 2. Slow Wake-Up Times
- Render free tier has cold start delays
- Consider upgrading to paid tier for better performance
- Implement user-friendly loading states

#### 3. Frequent Wake-Ups
- Check if wake-up interval is too short
- Verify caching logic is working correctly
- Monitor for unnecessary API calls

### Debug Commands
```typescript
// Force wake up backend
await backendWakeUp.forceWakeUp();

// Check current status
const status = backendWakeUp.getStatus();
console.log('Backend status:', status);

// Test wake-up with custom options
await backendWakeUp.ensureBackendAwake({
  timeout: 15000,
  retries: 5,
  retryDelay: 3000
});
```

## Production Considerations

### 1. Render Free Tier Limitations
- 15-minute sleep timeout
- Cold start delays (30-60 seconds)
- Limited bandwidth and compute resources

### 2. Upgrade Options
- **Paid Render Plans**: No sleep timeout, faster cold starts
- **Alternative Hosting**: Consider other platforms for better performance
- **CDN Integration**: Use CDN for static assets

### 3. Monitoring
- Set up alerts for backend downtime
- Monitor wake-up success rates
- Track user experience metrics

## Conclusion

The backend wake-up system ensures a smooth user experience on Render's free tier by:
- Automatically detecting when the backend needs to be woken up
- Providing transparent wake-up functionality
- Offering manual controls for users
- Maintaining performance through intelligent caching
- Providing comprehensive monitoring and debugging tools

This system makes the Galactiturf platform production-ready even on Render's free tier, ensuring users can always access the application with minimal delays.