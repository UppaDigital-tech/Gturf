from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils import timezone
from django.conf import settings
import json

@csrf_exempt
@require_http_methods(["GET"])
def health_check(request):
    """
    Health check endpoint for backend wake-up detection.
    Returns basic system status information and SSL diagnostics.
    """
    # SSL diagnostics
    ssl_info = {
        'is_secure': request.is_secure(),
        'x_forwarded_proto': request.META.get('HTTP_X_FORWARDED_PROTO'),
        'x_forwarded_ssl': request.META.get('HTTP_X_FORWARDED_SSL'),
        'x_forwarded_for': request.META.get('HTTP_X_FORWARDED_FOR'),
        'host': request.META.get('HTTP_HOST'),
        'scheme': request.scheme,
    }
    
    # Check if we have the custom SSL attribute
    if hasattr(request, 'is_secure_connection'):
        ssl_info['custom_ssl_detection'] = request.is_secure_connection
    
    return JsonResponse({
        'status': 'healthy',
        'timestamp': timezone.now().isoformat(),
        'service': 'galactiturf-backend',
        'version': '1.0.0',
        'ssl_info': ssl_info,
        'settings': {
            'debug': settings.DEBUG,
            'allowed_hosts': settings.ALLOWED_HOSTS,
            'secure_ssl_redirect': getattr(settings, 'SECURE_SSL_REDIRECT', False),
            'secure_proxy_ssl_header': getattr(settings, 'SECURE_PROXY_SSL_HEADER', None),
        }
    })

@csrf_exempt
@require_http_methods(["GET"])
def ping(request):
    """
    Simple ping endpoint for quick health checks.
    """
    return JsonResponse({
        'pong': timezone.now().isoformat(),
    })