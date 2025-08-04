# SSL Troubleshooting Guide for Galactiturf Backend

## Overview

This guide addresses common SSL issues when deploying the Galactiturf backend on Render, particularly with the free tier which has specific SSL handling requirements.

## Common SSL Issues

### 1. SSL Redirect Loops
**Problem**: `SECURE_SSL_REDIRECT = True` causes infinite redirects on Render
**Solution**: Disabled SSL redirect in production settings

### 2. Missing Proxy SSL Headers
**Problem**: Django doesn't recognize HTTPS when behind Render's proxy
**Solution**: Added `SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')`

### 3. Secure Cookie Issues
**Problem**: Cookies set as secure when not actually using HTTPS
**Solution**: Dynamic SSL middleware that sets secure cookies only when needed

## Current SSL Configuration

### Production Settings (`settings_production.py`)
```python
# SSL Settings for Render deployment
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = False  # Disabled to prevent redirect loops
SESSION_COOKIE_SECURE = False  # Set dynamically by middleware
CSRF_COOKIE_SECURE = False     # Set dynamically by middleware
```

### Custom SSL Middleware (`middleware.py`)
```python
class SSLMiddleware:
    def __call__(self, request):
        is_secure = (
            request.is_secure() or 
            request.META.get('HTTP_X_FORWARDED_PROTO') == 'https' or
            request.META.get('HTTP_X_FORWARDED_SSL') == 'on'
        )
        
        if is_secure:
            settings.SESSION_COOKIE_SECURE = True
            settings.CSRF_COOKIE_SECURE = True
        else:
            settings.SESSION_COOKIE_SECURE = False
            settings.CSRF_COOKIE_SECURE = False
```

## Environment Variables

### Required for SSL
```bash
SECURE_SSL_REDIRECT=false
SECURE_PROXY_SSL_HEADER=HTTP_X_FORWARDED_PROTO,https
```

### Render Configuration
```yaml
envVars:
  - key: SECURE_SSL_REDIRECT
    value: false
  - key: SECURE_PROXY_SSL_HEADER
    value: HTTP_X_FORWARDED_PROTO,https
```

## Testing SSL Configuration

### Health Check Endpoint
Visit `/health/` to get SSL diagnostic information:
```json
{
  "status": "healthy",
  "ssl_info": {
    "is_secure": true,
    "x_forwarded_proto": "https",
    "scheme": "https"
  },
  "settings": {
    "secure_ssl_redirect": false,
    "secure_proxy_ssl_header": ["HTTP_X_FORWARDED_PROTO", "https"]
  }
}
```

### Manual Testing
1. **Check HTTPS Detection**: Visit `https://your-app.onrender.com/health/`
2. **Check HTTP Handling**: Visit `http://your-app.onrender.com/health/`
3. **Verify No Redirect Loops**: Both should work without redirects

## Troubleshooting Steps

### 1. Check SSL Headers
```bash
curl -I https://your-app.onrender.com/health/
```
Look for:
- `X-Forwarded-Proto: https`
- No redirect loops

### 2. Test Cookie Security
```bash
curl -c cookies.txt https://your-app.onrender.com/health/
```
Check if cookies are marked as secure only when using HTTPS.

### 3. Verify Middleware
Check if the SSL middleware is working:
```bash
curl https://your-app.onrender.com/health/ | jq '.ssl_info'
```

## Common Error Messages

### "SSL Connection Error"
- Check if `SECURE_SSL_REDIRECT` is disabled
- Verify proxy SSL headers are configured

### "Cookie Not Secure"
- Ensure `SESSION_COOKIE_SECURE` and `CSRF_COOKIE_SECURE` are set dynamically
- Check if middleware is properly configured

### "Redirect Loop"
- Disable `SECURE_SSL_REDIRECT`
- Check for conflicting SSL settings

## Render-Specific Considerations

### Free Tier Limitations
- SSL termination handled by Render
- No custom SSL certificates
- Proxy headers must be trusted

### Recommended Settings
```python
# For Render free tier
SECURE_SSL_REDIRECT = False
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_HSTS_SECONDS = 31536000
```

## Monitoring and Debugging

### Logs to Check
1. **Application Logs**: Check for SSL-related errors
2. **Access Logs**: Monitor for redirect patterns
3. **Health Check**: Use `/health/` endpoint for SSL diagnostics

### Debug Mode
For debugging, temporarily enable debug mode:
```python
DEBUG = True  # Only for debugging
```

## Security Best Practices

### Production Checklist
- [ ] SSL redirect disabled to prevent loops
- [ ] Proxy SSL headers configured
- [ ] Dynamic cookie security enabled
- [ ] HSTS headers configured
- [ ] XSS protection enabled
- [ ] Content type sniffing disabled

### Testing Checklist
- [ ] HTTPS requests work without redirects
- [ ] HTTP requests work (no forced redirects)
- [ ] Cookies are secure only on HTTPS
- [ ] Health check endpoint accessible
- [ ] No SSL errors in logs

## Support

If SSL issues persist:
1. Check the health check endpoint for diagnostics
2. Review Render's SSL documentation
3. Test with different SSL configurations
4. Contact Render support if needed

## References

- [Django SSL Documentation](https://docs.djangoproject.com/en/4.2/topics/security/#ssl-https)
- [Render SSL Guide](https://render.com/docs/ssl)
- [Django Security Settings](https://docs.djangoproject.com/en/4.2/ref/settings/#security)