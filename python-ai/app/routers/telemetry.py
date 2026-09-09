from fastapi import APIRouter, HTTPException, status
from app.schemas.telemetry import TelemetryBatchRequest
from app.schemas.common import StandardResponse
from app.services.telemetry_service import telemetry_service
from typing import Dict, Any

router = APIRouter(prefix="/telemetry", tags=["Telemetry Processing"])

@router.post("/process-batch", response_model=StandardResponse[Dict[str, Any]])
async def process_telemetry_batch(batch: TelemetryBatchRequest):
    try:
        result = await telemetry_service.process_batch(batch)
        return StandardResponse(
            success=True,
            message="Telemetry batch processed successfully.",
            data=result
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Telemetry batch processing error: {str(e)}"
        )
