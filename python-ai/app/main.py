from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import health, telemetry, anomalies, ai, rockfall, collision, predictive_maintenance, cv, alerts, assistant

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    version="4.0.0-PHASE4"
)

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

@app.get("/")
async def root():
    return {
        "service": "MineMind AI Intelligence Engine",
        "phase": "PHASE 1 FOUNDATION",
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health"
    }
