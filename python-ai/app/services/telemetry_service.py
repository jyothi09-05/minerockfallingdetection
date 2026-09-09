import logging
from typing import Dict, Any
from app.schemas.telemetry import TelemetryBatchRequest
from app.services.anomaly_detector import anomaly_detector_service
from app.schemas.anomaly import AnomalyDetectionRequest

logger = logging.getLogger("minemind.telemetry_service")

class TelemetryProcessingService:
    """Processes incoming batches of IoT sensor and vehicle GPS streams offline."""

    async def process_batch(self, batch: TelemetryBatchRequest) -> Dict[str, Any]:
        processed_sensors = 0
        detected_anomalies = []

        for sensor in batch.sensor_readings:
            processed_sensors += 1
            # Evaluate using local statistical detector
            req = AnomalyDetectionRequest(
                sensor_code=sensor.sensor_code,
                sensor_type=sensor.sensor_type,
                current_value=sensor.value,
                historical_window=[],
                unit=sensor.unit
            )
            res = anomaly_detector_service.evaluate(req)
            if res.is_anomaly:
                detected_anomalies.append(res.dict())

        return {
            "processed_sensor_count": processed_sensors,
            "processed_vehicle_count": len(batch.vehicle_telemetry),
            "anomalies_detected": detected_anomalies,
            "status": "PROCESSED"
        }

telemetry_service = TelemetryProcessingService()
