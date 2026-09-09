import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_anomaly_evaluation_normal():
    payload = {
        "sensor_code": "SNS-GAS-CH4-01",
        "sensor_type": "METHANE_GAS",
        "current_value": 42.5,
        "historical_window": [41.0, 42.0, 43.0, 42.2, 41.8],
        "unit": "PPM"
    }
    response = client.post("/api/v1/anomalies/evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["is_anomaly"] is False
    assert data["data"]["severity"] == "NORMAL"

def test_anomaly_evaluation_critical_spike():
    payload = {
        "sensor_code": "SNS-GAS-CH4-01",
        "sensor_type": "METHANE_GAS",
        "current_value": 650.0, # Above 500 PPM critical limit
        "historical_window": [40.0, 42.0, 41.0],
        "unit": "PPM"
    }
    response = client.post("/api/v1/anomalies/evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["is_anomaly"] is True
    assert data["data"]["severity"] == "CRITICAL"

def test_process_telemetry_batch():
    payload = {
        "sensor_readings": [
            {
                "sensor_code": "SNS-SLOPE-RAD-01",
                "sensor_type": "SLOPE_RADAR_DISPLACEMENT",
                "value": 1.85,
                "unit": "MM"
            }
        ],
        "vehicle_telemetry": [
            {
                "vehicle_id": "veh-01",
                "equipment_tag": "EQ-TRK-101",
                "latitude": -21.4540,
                "longitude": 119.8220,
                "speed_kmh": 35.0,
                "heading_degrees": 120.0,
                "fuel_percent": 88.0,
                "payload_tonnes": 340.0
            }
        ]
    }
    response = client.post("/api/v1/telemetry/process-batch", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["processed_sensor_count"] == 1
    assert data["data"]["processed_vehicle_count"] == 1
