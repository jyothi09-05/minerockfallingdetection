from fastapi import APIRouter, HTTPException, status
from app.schemas.anomaly import AnomalyDetectionRequest, AnomalyDetectionResult
from app.schemas.common import StandardResponse
from app.services.anomaly_detector import anomaly_detector_service

router = APIRouter(prefix="/anomalies", tags=["Anomaly Intelligence"])

@router.post("/evaluate", response_model=StandardResponse[AnomalyDetectionResult])
async def evaluate_sensor_reading(request: AnomalyDetectionRequest):
    try:
        result = anomaly_detector_service.evaluate(request)
        return StandardResponse(
            success=True,
            message="Sensor reading evaluated successfully.",
            data=result
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Anomaly evaluation error: {str(e)}"
        )
