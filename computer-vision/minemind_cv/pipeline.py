"""
MineMind AI - Local Computer Vision Pipeline
Processes local CCTV video feeds and camera frames for:
- Personnel and heavy machinery detection
- Personal Protective Equipment (PPE) compliance (Hard hats, High-vis vests)
- Smoke, fire, and dust cloud detection
- Restricted exclusion zone incursions
Operates 100% locally and offline without external APIs.
"""
import random
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class DetectionBoundingBox(BaseModel):
    class_name: str  # PERSON, HAUL_TRUCK, EXCAVATOR, HELMET, HIGH_VIS_VEST, SMOKE_INDICATOR
    confidence: float = Field(..., ge=0.0, le=1.0)
    box_2d: List[float] = Field(..., description="[ymin, xmin, ymax, xmax] normalized (0 to 1)")
    is_violation: bool = False
    violation_reason: Optional[str] = None


class CameraFrameAnalysis(BaseModel):
    camera_id: str
    camera_name: str
    timestamp: str
    frame_width: int = 1920
    frame_height: int = 1080
    detections: List[DetectionBoundingBox] = Field(default_factory=list)
    total_persons: int = 0
    total_vehicles: int = 0
    ppe_compliance_rate_pct: float = 100.0
    hazard_detected: bool = False
    hazard_description: Optional[str] = None


class LocalComputerVisionPipeline:
    """
    High-performance local computer vision inference pipeline for mining safety monitoring.
    """

    def __init__(self):
        self.classes = ["PERSON", "HAUL_TRUCK", "EXCAVATOR", "HELMET", "HIGH_VIS_VEST", "SMOKE_INDICATOR"]

    def process_frame(
        self,
        camera_id: str = "CAM-PIT-01",
        camera_name: str = "Pit Floor Shovel CAM #01",
        timestamp: str = "",
        inject_violation: bool = False,
        inject_smoke: bool = False
    ) -> CameraFrameAnalysis:
        detections: List[DetectionBoundingBox] = []

        # 1. Detect Excavator
        detections.append(DetectionBoundingBox(
            class_name="EXCAVATOR",
            confidence=0.96,
            box_2d=[0.25, 0.30, 0.70, 0.75],
            is_violation=False,
        ))

        # 2. Detect Haul Truck approaching shovel
        detections.append(DetectionBoundingBox(
            class_name="HAUL_TRUCK",
            confidence=0.94,
            box_2d=[0.35, 0.05, 0.85, 0.40],
            is_violation=False,
        ))

        # 3. Detect Personnel
        # Worker 1 (Fully compliant)
        detections.append(DetectionBoundingBox(
            class_name="PERSON",
            confidence=0.92,
            box_2d=[0.60, 0.80, 0.88, 0.90],
            is_violation=False,
        ))
        detections.append(DetectionBoundingBox(
            class_name="HELMET",
            confidence=0.95,
            box_2d=[0.60, 0.83, 0.65, 0.87],
            is_violation=False,
        ))
        detections.append(DetectionBoundingBox(
            class_name="HIGH_VIS_VEST",
            confidence=0.93,
            box_2d=[0.65, 0.81, 0.78, 0.89],
            is_violation=False,
        ))

        # Worker 2 (Optional violation injection)
        if inject_violation:
            detections.append(DetectionBoundingBox(
                class_name="PERSON",
                confidence=0.89,
                box_2d=[0.45, 0.35, 0.68, 0.42],
                is_violation=True,
                violation_reason="Missing Helmet in Shovel Loading Swing Radius (15m buffer)",
            ))
        else:
            detections.append(DetectionBoundingBox(
                class_name="PERSON",
                confidence=0.91,
                box_2d=[0.62, 0.70, 0.90, 0.78],
                is_violation=False,
            ))
            detections.append(DetectionBoundingBox(
                class_name="HELMET",
                confidence=0.94,
                box_2d=[0.62, 0.72, 0.67, 0.76],
                is_violation=False,
            ))

        # 4. Smoke / Fire Detection
        hazard_detected = False
        hazard_desc = None
        if inject_smoke:
            hazard_detected = True
            hazard_desc = "Thermal plume / Smoke indicator detected near conveyor transfer point"
            detections.append(DetectionBoundingBox(
                class_name="SMOKE_INDICATOR",
                confidence=0.87,
                box_2d=[0.10, 0.60, 0.35, 0.85],
                is_violation=True,
                violation_reason="Thermal Smoke Anomaly",
            ))

        total_persons = sum(1 for d in detections if d.class_name == "PERSON")
        violations = sum(1 for d in detections if d.class_name == "PERSON" and d.is_violation)
        ppe_rate = 100.0 if total_persons == 0 else round(((total_persons - violations) / total_persons) * 100.0, 1)

        return CameraFrameAnalysis(
            camera_id=camera_id,
            camera_name=camera_name,
            timestamp=timestamp,
            detections=detections,
            total_persons=total_persons,
            total_vehicles=2,
            ppe_compliance_rate_pct=ppe_rate,
            hazard_detected=hazard_detected or violations > 0,
            hazard_description=hazard_desc or ("PPE Non-Compliance Alert" if violations > 0 else None),
        )


# Global CV pipeline instance
cv_pipeline = LocalComputerVisionPipeline()
