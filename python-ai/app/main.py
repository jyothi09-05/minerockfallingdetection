from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import health, telemetry, anomalies

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    version="1.0.0-PHASE1"
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

@app.get("/")
async def root():
    return {
        "service": "MineMind AI Intelligence Engine",
        "phase": "PHASE 1 FOUNDATION",
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health"
    }
