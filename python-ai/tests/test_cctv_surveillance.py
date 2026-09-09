"""
Unit and integration tests for CCTV Intelligence & Mine Surveillance subsystem.
Verifies camera registry, local computer vision inference, object tracking,
virtual safety zones, CCTV event logging, and FastAPI endpoints.
100% Offline.
"""
import pytest
from fastapi.testclient import TestClient

from app.main import app
from minemind_cv.camera_registry import camera_registry
from minemind_cv.zones import zone_manager, VirtualSafetyZone
from minemind_cv.tracking import ObjectTracker
from minemind_cv.pipeline import cv_pipeline
from app.services.cctv_service import cctv_service

client = TestClient(app)


def test_camera_registry_listing():
    cams = camera_registry.list_cameras()
    assert len(cams) >= 6
    cam_ids = [c.camera_id for c in cams]
    assert "CAM-PIT-01" in cam_ids
    assert "CAM-NW-02" in cam_ids
    assert "CAM-RAMP-03" in cam_ids
    assert "CAM-CRU-04" in cam_ids
    assert "CAM-SUMP-05" in cam_ids
    assert "CAM-STOCK-06" in cam_ids


def test_ptz_update():
    cam = camera_registry.update_ptz("CAM-PIT-01", pan_deg=45.0, tilt_deg=-30.0, zoom_level=2.5)
    assert cam is not None
    assert cam.ptz.pan_deg == 45.0
    assert cam.ptz.tilt_deg == -30.0
    assert cam.ptz.zoom_level == 2.5


def test_virtual_safety_zones():
    zones = zone_manager.get_zones_for_camera("CAM-PIT-01")
    assert len(zones) >= 1
    zone = zones[0]
    # Center of zone [0.20, 0.20] to [0.85, 0.80] should contain (0.5, 0.5)
    assert zone.contains_point(0.5, 0.5) is True
    # Outside point (0.05, 0.05) should be false
    assert zone.contains_point(0.05, 0.05) is False


def test_object_tracker():
    tracker = ObjectTracker()
    detections = [
        {"class_name": "PERSON", "box_2d": [0.4, 0.4, 0.6, 0.5]},
        {"class_name": "HAUL_TRUCK", "box_2d": [0.2, 0.2, 0.8, 0.7]}
    ]
    tracks1 = tracker.update(detections, timestamp_sec=100.0)
    assert len(tracks1) == 2
    track_ids = [t.track_id for t in tracks1]

    # Next frame with slightly moved objects
    detections2 = [
        {"class_name": "PERSON", "box_2d": [0.41, 0.41, 0.61, 0.51]},
        {"class_name": "HAUL_TRUCK", "box_2d": [0.21, 0.21, 0.81, 0.71]}
    ]
    tracks2 = tracker.update(detections2, timestamp_sec=100.1)
    assert len(tracks2) == 2
    assert [t.track_id for t in tracks2] == track_ids


def test_cv_pipeline_frame_inference():
    analysis = cv_pipeline.process_frame(
        camera_id="CAM-PIT-01",
        inject_violation=True,
        inject_smoke=True,
        inject_incursion=True
    )
    assert analysis.camera_id == "CAM-PIT-01"
    assert len(analysis.detections) > 0
    assert analysis.hazard_detected is True
    assert analysis.ppe_compliance_rate_pct < 100.0


def test_cctv_service_events():
    initial_count = len(cctv_service.get_events())
    evt = cctv_service.record_event(
        camera_id="CAM-RAMP-03",
        event_type="PROXIMITY_WARNING",
        severity="HIGH",
        description="Test proximity event",
        confidence=0.92
    )
    assert evt.event_id.startswith("EVT-")
    assert len(cctv_service.get_events()) == initial_count + 1


def test_cctv_health_summary():
    health = cctv_service.get_health_summary()
    assert health.total_cameras >= 6
    assert health.active_cameras >= 1
    assert health.average_health_score_pct > 0.0


def test_fastapi_cctv_endpoints():
    # 1. List cameras
    res = client.get("/api/v1/cctv/cameras")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 6

    # 2. Get specific camera
    res = client.get("/api/v1/cctv/cameras/CAM-PIT-01")
    assert res.status_code == 200
    assert res.json()["camera_id"] == "CAM-PIT-01"

    # 3. PTZ update
    res = client.post("/api/v1/cctv/cameras/CAM-PIT-01/ptz", json={"pan_deg": 15.0, "tilt_deg": -25.0, "zoom_level": 1.5})
    assert res.status_code == 200
    assert res.json()["ptz"]["pan_deg"] == 15.0

    # 4. Run frame inference
    res = client.get("/api/v1/cctv/cameras/CAM-PIT-01/frame?inject_violation=true")
    assert res.status_code == 200
    analysis = res.json()
    assert analysis["camera_id"] == "CAM-PIT-01"
    assert len(analysis["detections"]) > 0

    # 5. List events
    res = client.get("/api/v1/cctv/events")
    assert res.status_code == 200
    assert isinstance(res.json(), list)

    # 6. Camera health
    res = client.get("/api/v1/cctv/health")
    assert res.status_code == 200
    assert res.json()["total_cameras"] >= 6

    # 7. Virtual zones
    res = client.get("/api/v1/cctv/zones")
    assert res.status_code == 200
    assert len(res.json()) >= 1

    # 8. Incident replay
    res = client.get("/api/v1/cctv/replays/INC-2026-001")
    assert res.status_code == 200
    assert "replay_frames" in res.json()
