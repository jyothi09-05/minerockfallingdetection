from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class SensorReadingInput(BaseModel):
    sensor_code: str
    sensor_type: str
    value: float
    unit: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    raw_metadata: Optional[Dict[str, Any]] = None

class VehicleTelemetryInput(BaseModel):
    vehicle_id: str
    equipment_tag: str
    latitude: float
    longitude: float
    speed_kmh: float
    heading_degrees: float
    fuel_percent: float
    payload_tonnes: Optional[float] = 0.0
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class TelemetryBatchRequest(BaseModel):
    sensor_readings: List[SensorReadingInput] = []
    vehicle_telemetry: List[VehicleTelemetryInput] = []
