"""
MineMind AI - Local Computer Vision Router
"""
import sys
import os
from fastapi import APIRouter
from pydantic import BaseModel

# Link computer-vision package
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "..", "computer-vision"))
from minemind_cv.pipeline import cv_pipeline, CameraFrameAnalysis

router = APIRouter(prefix="/api/v1/ai/cv", tags=["Computer Vision AI"])


class FrameAnalyzeRequest(BaseModel):
    camera_id: str = "CAM-PIT-01"
    camera_name: str = "Pit Floor Shovel CAM #01"
    inject_violation: bool = False
    inject_smoke: bool = False


@router.post("/analyze-frame", response_model=CameraFrameAnalysis)
def analyze_camera_frame(body: FrameAnalyzeRequest):
    """Processes camera frame locally for personnel, trucks, PPE, and smoke hazards."""
    return cv_pipeline.process_frame(
        camera_id=body.camera_id,
        camera_name=body.camera_name,
        inject_violation=body.inject_violation,
        inject_smoke=body.inject_smoke,
    )
