"""
MineMind Computer Vision Package
"""
from minemind_cv.pipeline import LocalComputerVisionPipeline, cv_pipeline, CameraFrameAnalysis, DetectionBoundingBox, ZoneIncursion
from minemind_cv.camera_registry import camera_registry, CameraConfig, PTZStatus, MINE_CAMERAS
from minemind_cv.zones import zone_manager, VirtualSafetyZone, DEFAULT_VIRTUAL_ZONES
from minemind_cv.tracking import ObjectTracker, TrackedObject, ProximityEvent

__all__ = [
    "LocalComputerVisionPipeline", "cv_pipeline", "CameraFrameAnalysis", "DetectionBoundingBox", "ZoneIncursion",
    "camera_registry", "CameraConfig", "PTZStatus", "MINE_CAMERAS",
    "zone_manager", "VirtualSafetyZone", "DEFAULT_VIRTUAL_ZONES",
    "ObjectTracker", "TrackedObject", "ProximityEvent"
]
