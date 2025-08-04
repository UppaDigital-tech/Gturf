"""
Custom middleware for handling SSL settings dynamically
"""
from django.conf import settings


class SSLMiddleware:
    """
    Middleware to handle SSL settings dynamically based on request headers.
    This ensures proper SSL configuration when deployed behind a proxy like Render.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Check if request is coming through HTTPS
        is_secure = (
            request.is_secure() or 
            request.META.get('HTTP_X_FORWARDED_PROTO') == 'https' or
            request.META.get('HTTP_X_FORWARDED_SSL') == 'on'
        )
        
        # Set request attributes for SSL detection
        request.is_secure_connection = is_secure
        
        # Dynamically set SSL-related settings
        if is_secure:
            # Only set secure cookies if we're actually using HTTPS
            settings.SESSION_COOKIE_SECURE = True
            settings.CSRF_COOKIE_SECURE = True
        else:
            # Allow non-secure cookies for HTTP (useful for development/testing)
            settings.SESSION_COOKIE_SECURE = False
            settings.CSRF_COOKIE_SECURE = False
        
        response = self.get_response(request)
        return response