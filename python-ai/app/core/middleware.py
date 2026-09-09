"""
Security Hardening and Tracing Middleware for MineMind AI.
Includes Rate Limiting, Security Headers, Request ID Tracing, and Secure Error Handling.
"""

import time
import uuid
from collections import defaultdict
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response, JSONResponse


class SecurityAndObservabilityMiddleware(BaseHTTPMiddleware):
    """
    Applies security response headers, tracks request latency, injects X-Request-ID,
    and performs basic in-memory rate limiting.
    """

    def __init__(self, app, rate_limit_per_minute: int = 600):
        super().__init__(app)
        self.rate_limit_per_minute = rate_limit_per_minute
        self.request_counts = defaultdict(list)

    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        client_ip = request.client.host if request.client else "127.0.0.1"
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))

        # Rate Limiting Check (per client IP)
        now = time.time()
        window = [t for t in self.request_counts[client_ip] if now - t < 60]
        if len(window) >= self.rate_limit_per_minute:
            return JSONResponse(
                status_code=429,
                content={"error": "Too Many Requests", "message": "Rate limit exceeded. Please retry shortly."},
                headers={"Retry-After": "60"}
            )
        window.append(now)
        self.request_counts[client_ip] = window

        # Process Request
        try:
            response: Response = await call_next(request)
        except Exception as exc:
            # Secure error handling - sanitize internal stack traces
            print(f"[Unhandled Exception] Request ID {request_id}: {exc}")
            response = JSONResponse(
                status_code=500,
                content={
                    "error": "Internal Server Error",
                    "request_id": request_id,
                    "message": "An unexpected error occurred. This event has been logged for security audit."
                }
            )

        duration_ms = round((time.time() - start_time) * 1000, 2)

        # Injected Security and Observability Headers
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Response-Time-MS"] = str(duration_ms)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Content-Security-Policy"] = "default-src 'self'; frame-ancestors 'none';"

        return response
