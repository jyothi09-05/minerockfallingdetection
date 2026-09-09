from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.middleware import SecurityAndObservabilityMiddleware
from app.routers import (
    health, telemetry, anomalies, ai, rockfall, collision,
    predictive_maintenance, cv, alerts, assistant,
    incidents, emergency, analytics, reports, search,
    websocket, metrics, cctv
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    version="5.0.0-PHASE5-FINAL"
)

# Custom Security & Observability Middleware
app.add_middleware(SecurityAndObservabilityMiddleware, rate_limit_per_minute=1000)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix=settings.API_V1_STR)
app.include_router(telemetry.router, prefix=settings.API_V1_STR)
app.include_router(anomalies.router, prefix=settings.API_V1_STR)
app.include_router(ai.router)
app.include_router(rockfall.router)
app.include_router(collision.router)
app.include_router(predictive_maintenance.router)
app.include_router(cv.router)
app.include_router(alerts.router)
app.include_router(assistant.router)
app.include_router(incidents.router)
app.include_router(emergency.router)
app.include_router(analytics.router)
app.include_router(reports.router)
app.include_router(search.router)
app.include_router(websocket.router)
app.include_router(metrics.router)
app.include_router(cctv.router)

@app.get("/")
async def root():
    return {
        "service": "MineMind AI Intelligence Engine",
        "version": "5.0.0-PHASE5-FINAL",
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health",
        "metrics": "/metrics"
    }
