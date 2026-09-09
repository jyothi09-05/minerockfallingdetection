import logging
import math
from typing import List, Tuple
from app.schemas.anomaly import AnomalyDetectionRequest, AnomalyDetectionResult

logger = logging.getLogger("minemind.anomaly_detector")

class LocalStatisticalAnomalyDetector:
    """
    Offline statistical anomaly detection engine using rolling window Z-Score,
    exponential moving standard deviation, and domain-specific mining hazard thresholds.
    """

    CRITICAL_THRESHOLDS = {
        "METHANE_GAS": 500.0, # PPM
        "CARBON_MONOXIDE": 50.0, # PPM
        "SLOPE_RADAR_DISPLACEMENT": 15.0, # mm
        "SEISMIC_VIBRATION": 15.0 # mm/s
    }

    def evaluate(self, req: AnomalyDetectionRequest) -> AnomalyDetectionResult:
        hist = req.historical_window
        current = req.current_value
        sensor_type = req.sensor_type.upper()

        # Check absolute critical safety limit
        if sensor_type in self.CRITICAL_THRESHOLDS:
            crit_val = self.CRITICAL_THRESHOLDS[sensor_type]
            if current >= crit_val:
                return AnomalyDetectionResult(
                    sensor_code=req.sensor_code,
                    is_anomaly=True,
                    confidence_score=0.99,
                    severity="CRITICAL",
                    z_score=9.99,
                    recommended_action=f"CRITICAL HAZARD BREACH: Immediate personnel evacuation required for {sensor_type}!"
                )

        if not hist or len(hist) < 3:
            # Baseline evaluation when window is small
            return AnomalyDetectionResult(
                sensor_code=req.sensor_code,
                is_anomaly=False,
                confidence_score=0.5,
                severity="NORMAL",
                z_score=0.0,
                recommended_action="Insufficient baseline samples. Monitoring active."
            )

        mean = sum(hist) / len(hist)
        variance = sum((x - mean) ** 2 for x in hist) / len(hist)
        std_dev = math.sqrt(variance) if variance > 0 else 0.001

        z_score = abs(current - mean) / std_dev

        if z_score >= 3.5:
            severity = "CRITICAL"
            action = f"Rapid rate of change detected ({z_score:.2f} sigma deviation). Dispatch safety inspector."
            is_anomaly = True
            confidence = min(0.98, 0.7 + (z_score * 0.05))
        elif z_score >= 2.2:
            severity = "WARNING"
            action = f"Unusual drift observed ({z_score:.2f} sigma deviation). Monitor telemetry trend."
            is_anomaly = True
            confidence = 0.82
        else:
            severity = "NORMAL"
            action = "Reading within normal operating tolerance."
            is_anomaly = False
            confidence = 0.95

        return AnomalyDetectionResult(
            sensor_code=req.sensor_code,
            is_anomaly=is_anomaly,
            confidence_score=round(confidence, 2),
            severity=severity,
            z_score=round(z_score, 2),
            recommended_action=action
        )

anomaly_detector_service = LocalStatisticalAnomalyDetector()
