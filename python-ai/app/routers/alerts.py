"""
MineMind AI - Smart Alert Management Router
"""
from typing import List
from fastapi import APIRouter, HTTPException
from app.services.alert_engine import alert_engine
from app.schemas.ai import SmartAlert

router = APIRouter(prefix="/api/v1/ai/alerts", tags=["Smart Alert Engine"])


@router.get("", response_model=List[SmartAlert])
def get_all_alerts():
    """Retrieves all active and historical smart alerts."""
    return alert_engine.get_all_alerts()


@router.post("/{alert_id}/acknowledge", response_model=SmartAlert)
def acknowledge_alert(alert_id: str):
    """Marks an alert as acknowledged by control room operator."""
    alert = alert_engine.acknowledge_alert(alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert


@router.post("/{alert_id}/resolve", response_model=SmartAlert)
def resolve_alert(alert_id: str):
    """Marks an alert as resolved after corrective action."""
    alert = alert_engine.resolve_alert(alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert


@router.post("", response_model=SmartAlert)
def create_custom_alert(alert: SmartAlert):
    """Creates or injects a custom alarm event."""
    return alert_engine.create_alert(alert)
