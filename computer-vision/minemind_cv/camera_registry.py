"""
MineMind AI - Camera Registry & Configuration
Defines camera metadata, coordinates, FOV, PTZ parameters, health stats, and zones across the mine.
100% Offline and local.
"""
from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field
import datetime


class PTZStatus(BaseModel):
    pan_deg: float = 0.0
    tilt_deg: float = -15.0
    zoom_level: float = 1.0
    is_patrolling: bool = False


class CameraConfig(BaseModel):
    camera_id: str
    camera_name: str
    zone_id: str
    zone_name: str
    mine_id: str = "MINE-ALPHA-01"
    coordinates: List[float] = Field(..., description="[x, y, z] in mine digital twin coordinates")
    orientation_deg: float = Field(..., description="Azimuth angle in degrees (0 = North, 90 = East)")
    fov_degrees: float = Field(60.0, description="Horizontal Field of View in degrees")
    resolution: str = "1920x1080"
    fps: int = 30
    operational_status: str = "ACTIVE"  # ACTIVE, OFFLINE, MAINTENANCE, DEGRADED
    ai_monitoring_status: str = "ENABLED"  # ENABLED, PAUSED, CALIBRATING
    recording_status: str = "RECORDING"  # RECORDING, IDLE, ERROR
    health_score_pct: float = 98.5
    latency_ms: float = 14.2
    dropped_frames_pct: float = 0.05
    last_heartbeat: str = ""
    ptz: PTZStatus = Field(default_factory=PTZStatus)
    supported_models: List[str] = Field(default_factory=lambda: [
        "PPE_COMPLIANCE", "RESTRICTED_ZONE_GEOFENCE", "VEHICLE_TRACKER", "SMOKE_FIRE_ANOMALY"
    ])
    stream_type: str = "SYNTHETIC_SIMULATOR"  # SYNTHETIC_SIMULATOR, LOCAL_WEBCAM, LOCAL_MP4


MINE_CAMERAS: List[CameraConfig] = [
    CameraConfig(
        camera_id="CAM-PIT-01",
        camera_name="Pit Floor Shovel CAM #01",
        zone_id="ZONE-PIT-01",
        zone_name="Pit Floor Loading Zone",
        coordinates=[150.0, -120.0, 35.0],
        orientation_deg=45.0,
        fov_degrees=75.0,
        resolution="1920x1080",
        fps=30,
        operational_status="ACTIVE",
        ai_monitoring_status="ENABLED",
        recording_status="RECORDING",
        health_score_pct=99.2,
        latency_ms=12.5,
        dropped_frames_pct=0.02,
        last_heartbeat=datetime.datetime.now(datetime.timezone.utc).isoformat(),
        ptz=PTZStatus(pan_deg=10.0, tilt_deg=-20.0, zoom_level=1.2, is_patrolling=True)
    ),
    CameraConfig(
        camera_id="CAM-NW-02",
        camera_name="North Wall Highwall Monitor #02",
        zone_id="ZONE-NW-01",
        zone_name="North-West Sector Benches",
        coordinates=[85.0, 180.0, 95.0],
        orientation_deg=135.0,
        fov_degrees=80.0,
        resolution="2560x1440",
        fps=25,
        operational_status="ACTIVE",
        ai_monitoring_status="ENABLED",
        recording_status="RECORDING",
        health_score_pct=97.8,
        latency_ms=18.0,
        dropped_frames_pct=0.08,
        last_heartbeat=datetime.datetime.now(datetime.timezone.utc).isoformat(),
        ptz=PTZStatus(pan_deg=0.0, tilt_deg=-30.0, zoom_level=1.5, is_patrolling=False)
    ),
    CameraConfig(
        camera_id="CAM-RAMP-03",
        camera_name="Haul Road Main Incline Junction #03",
        zone_id="ZONE-RAMP-01",
        zone_name="Haul Road Switchback #2",
        coordinates=[-60.0, -40.0, 60.0],
        orientation_deg=210.0,
        fov_degrees=65.0,
        resolution="1920x1080",
        fps=30,
        operational_status="ACTIVE",
        ai_monitoring_status="ENABLED",
        recording_status="RECORDING",
        health_score_pct=98.9,
        latency_ms=14.0,
        dropped_frames_pct=0.03,
        last_heartbeat=datetime.datetime.now(datetime.timezone.utc).isoformat(),
        ptz=PTZStatus(pan_deg=-15.0, tilt_deg=-10.0, zoom_level=1.0, is_patrolling=True)
    ),
    CameraConfig(
        camera_id="CAM-CRU-04",
        camera_name="Primary Gyratory Crusher Hopper #04",
        zone_id="ZONE-CRU-01",
        zone_name="Primary Crusher Discharge",
        coordinates=[280.0, 210.0, 110.0],
        orientation_deg=315.0,
        fov_degrees=70.0,
        resolution="1920x1080",
        fps=30,
        operational_status="ACTIVE",
        ai_monitoring_status="ENABLED",
        recording_status="RECORDING",
        health_score_pct=96.4,
        latency_ms=16.8,
        dropped_frames_pct=0.12,
        last_heartbeat=datetime.datetime.now(datetime.timezone.utc).isoformat(),
        ptz=PTZStatus(pan_deg=5.0, tilt_deg=-45.0, zoom_level=1.8, is_patrolling=False)
    ),
    CameraConfig(
        camera_id="CAM-SUMP-05",
        camera_name="Pit Sump Dewatering Substation #05",
        zone_id="ZONE-SUMP-01",
        zone_name="Pit Floor Sump & Pump House",
        coordinates=[-110.0, -190.0, 15.0],
        orientation_deg=60.0,
        fov_degrees=60.0,
        resolution="1920x1080",
        fps=20,
        operational_status="ACTIVE",
        ai_monitoring_status="ENABLED",
        recording_status="RECORDING",
        health_score_pct=95.1,
        latency_ms=22.4,
        dropped_frames_pct=0.15,
        last_heartbeat=datetime.datetime.now(datetime.timezone.utc).isoformat(),
        ptz=PTZStatus(pan_deg=0.0, tilt_deg=-15.0, zoom_level=1.0, is_patrolling=False)
    ),
    CameraConfig(
        camera_id="CAM-STOCK-06",
        camera_name="ROM Stockpile Stacker / Reclaimer #06",
        zone_id="ZONE-STOCK-01",
        zone_name="High-Grade ROM Stockpile",
        coordinates=[220.0, -80.0, 85.0],
        orientation_deg=170.0,
        fov_degrees=85.0,
        resolution="1920x1080",
        fps=30,
        operational_status="ACTIVE",
        ai_monitoring_status="ENABLED",
        recording_status="RECORDING",
        health_score_pct=99.0,
        latency_ms=11.9,
        dropped_frames_pct=0.01,
        last_heartbeat=datetime.datetime.now(datetime.timezone.utc).isoformat(),
        ptz=PTZStatus(pan_deg=30.0, tilt_deg=-25.0, zoom_level=1.1, is_patrolling=True)
    )
]


class CameraRegistry:
    def __init__(self):
        self._cameras: Dict[str, CameraConfig] = {c.camera_id: c.model_copy(deep=True) for c in MINE_CAMERAS}

    def list_cameras(self, zone_id: Optional[str] = None, operational_status: Optional[str] = None) -> List[CameraConfig]:
        cams = list(self._cameras.values())
        if zone_id:
            cams = [c for c in cams if c.zone_id.lower() == zone_id.lower()]
        if operational_status:
            cams = [c for c in cams if c.operational_status.lower() == operational_status.lower()]
        return cams

    def get_camera(self, camera_id: str) -> Optional[CameraConfig]:
        return self._cameras.get(camera_id)

    def update_ptz(self, camera_id: str, pan_deg: float, tilt_deg: float, zoom_level: float) -> Optional[CameraConfig]:
        cam = self._cameras.get(camera_id)
        if cam:
            cam.ptz.pan_deg = max(-180.0, min(180.0, pan_deg))
            cam.ptz.tilt_deg = max(-90.0, min(90.0, tilt_deg))
            cam.ptz.zoom_level = max(1.0, min(10.0, zoom_level))
            cam.last_heartbeat = datetime.datetime.now(datetime.timezone.utc).isoformat()
        return cam

    def update_status(self, camera_id: str, operational_status: str, ai_monitoring: Optional[str] = None) -> Optional[CameraConfig]:
        cam = self._cameras.get(camera_id)
        if cam:
            cam.operational_status = operational_status
            if ai_monitoring:
                cam.ai_monitoring_status = ai_monitoring
            cam.last_heartbeat = datetime.datetime.now(datetime.timezone.utc).isoformat()
        return cam


camera_registry = CameraRegistry()
