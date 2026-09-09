from fastapi import APIRouter
from app.core.config import settings
from app.schemas.common import HealthCheckResponse, StandardResponse

router = APIRouter(prefix="/health", tags=["Health & Diagnostics"])

@router.get("", response_model=StandardResponse[HealthCheckResponse])
async def check_health():
    health_data = HealthCheckResponse(
        status="UP",
        version="1.0.0-PHASE1",
        environment=settings.APP_ENV,
        services={
            "python_ai_engine": "HEALTHY",
            "anomaly_detector": "ONLINE",
            "local_storage": "MOUNTED"
        }
    )
    return StandardResponse(
        success=True,
        message="MineMind AI Python Service is operational and healthy.",
        data=health_data
    )
