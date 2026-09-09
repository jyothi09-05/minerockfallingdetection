from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class AnomalyDetectionRequest(BaseModel):
    sensor_code: str
    sensor_type: str
    current_value: float
    historical_window: List[float] = []
    unit: str

class AnomalyDetectionResult(BaseModel):
    sensor_code: str
    is_anomaly: bool
    confidence_score: float
    severity: str # NORMAL, WARNING, CRITICAL
    z_score: float
    recommended_action: str
    evaluated_at: datetime = Field(default_factory=datetime.utcnow)
