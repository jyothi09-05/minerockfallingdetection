"""
Phase 5 Comprehensive Integration Tests for Incident Lifecycle, Emergency Simulator,
Analytics, Reporting Exporter, Global Search, Event Broker, and Observability.
"""

import pytest
import asyncio
from fastapi.testclient import TestClient
from app.main import app
from app.core.events import event_broker, EventType
from app.services.incident_service import incident_service, IncidentStage, IncidentSeverity
from app.services.emergency_service import emergency_service, EmergencyType
from app.services.analytics_service import analytics_service
from app.services.reporting_service import reporting_service
from app.services.search_service import search_service


@pytest.fixture
def client():
    return TestClient(app)


def test_event_broker_pub_sub():
    received_events = []

    def handle_event(evt):
        received_events.append(evt)

    event_broker.subscribe(EventType.TELEMETRY_UPDATE, handle_event)
    
    # Run async publish synchronously in test
    asyncio.run(event_broker.publish(
        topic=EventType.TELEMETRY_UPDATE,
        payload={"vehicle_id": "HT-101", "speed": 34.2}
    ))

    assert len(received_events) >= 1
    assert received_events[-1]["data"]["vehicle_id"] == "HT-101"

    # Verify history ring buffer
    history = event_broker.get_recent_events(limit=5)
    assert len(history) >= 1


def test_incident_lifecycle_flow():
    # 1. Create incident at DETECTED stage
    inc = incident_service.create_incident(
        title="Bench 1400 Tension Crack Detection",
        category="SLOPE_FAILURE",
        severity=IncidentSeverity.HIGH.value,
        zone_name="North Highwall",
        reported_by="InSAR Radar Scan",
        affected_entities={"vehicles": ["HT-102"], "workers": ["WRK-001"], "equipment": []}
    )
    inc_id = inc["id"]
    assert inc["stage"] == IncidentStage.DETECTED.value

    # 2. Advance to CLASSIFIED
    inc = incident_service.advance_stage(inc_id, IncidentStage.CLASSIFIED.value, actor="Dispatcher", notes="Tension crack confirmed.")
    assert inc["stage"] == IncidentStage.CLASSIFIED.value

    # 3. Advance to INVESTIGATING
    inc = incident_service.advance_stage(inc_id, IncidentStage.INVESTIGATING.value, actor="Geotech Lead")
    assert inc["stage"] == IncidentStage.INVESTIGATING.value

    # 4. Attach evidence
    inc = incident_service.add_evidence(inc_id, "RADAR_IMAGE", "InSAR image showing 4.2mm tension gap", "radar://img01")
    assert len(inc["evidence"]) == 1

    # 5. Advance to RESPONDING -> RESOLVED -> CLOSED
    incident_service.advance_stage(inc_id, IncidentStage.RESPONDING.value)
    incident_service.advance_stage(inc_id, IncidentStage.RESOLVED.value)
    inc = incident_service.advance_stage(inc_id, IncidentStage.CLOSED.value, notes="Berm reinforced. Crack stabilized.")
    assert inc["stage"] == IncidentStage.CLOSED.value
    assert "closed_at" in inc


def test_emergency_simulation_scenarios():
    # Trigger rockfall emergency
    em = emergency_service.trigger_emergency("ROCKFALL")
    em_id = em["emergency_id"]
    assert em["status"] == "ACTIVE"
    assert em["siren_active"] is True
    assert "evacuation_corridor" in em
    assert len(em["action_plan"]) >= 3

    # Check active list
    actives = emergency_service.list_active_emergencies()
    assert any(e["emergency_id"] == em_id for e in actives)

    # Resolve emergency
    resolved = emergency_service.resolve_emergency(em_id, "All personnel safe at Assembly Point Beta.")
    assert resolved["status"] == "RESOLVED"
    assert resolved["siren_active"] is False


def test_analytics_service_aggregation():
    safety = analytics_service.get_safety_analytics()
    assert "safety_health_score_pct" in safety
    assert len(safety["trends"]) > 5

    prod = analytics_service.get_production_analytics()
    assert prod["ore_tonnage_hauled_tons"] > 0

    equip = analytics_service.get_equipment_analytics()
    assert equip["fleet_availability_pct"] > 80.0

    env = analytics_service.get_environmental_analytics()
    assert "dust_pm10_avg_ug_m3" in env

    ai = analytics_service.get_ai_model_analytics()
    assert ai["models_deployed"] == 6


def test_reporting_service_multi_formats():
    data = reporting_service.generate_report_data("DAILY_MINE")
    assert data["report_type"] == "DAILY_MINE"
    assert len(data["sections"]) >= 2

    html = reporting_service.export_html(data)
    assert "<!DOCTYPE html>" in html
    assert "Daily Mine Operations" in html

    csv_str = reporting_service.export_csv(data)
    assert "Report ID" in csv_str


def test_global_search_engine():
    # Search for truck HT-101
    results = search_service.search("HT-101")
    assert len(results) >= 1
    assert results[0]["id"] == "HT-101"

    # Search by category
    doc_results = search_service.search("blast exclusion", entity_type="DOCUMENT")
    assert len(doc_results) >= 1
    assert "SOP" in doc_results[0]["title"]


def test_api_endpoints_integration(client):
    # Incidents API
    res = client.get("/api/v1/incidents")
    assert res.status_code == 200
    assert "incidents" in res.json()

    # Emergency API
    em_res = client.post("/api/v1/emergency/trigger", json={"emergency_type": "FIRE"})
    assert em_res.status_code == 200
    em_data = em_res.json()
    assert em_data["emergency_type"] == "FIRE"

    # Analytics API
    an_res = client.get("/api/v1/analytics/overview")
    assert an_res.status_code == 200
    assert "safety" in an_res.json()

    # Reports API (HTML export)
    rep_res = client.post("/api/v1/reports/export", json={"report_type": "DAILY_MINE", "format": "html"})
    assert rep_res.status_code == 200
    assert "text/html" in rep_res.headers["content-type"]

    # Search API
    search_res = client.get("/api/v1/search?q=crusher")
    assert search_res.status_code == 200
    assert search_res.json()["count"] >= 1

    # Metrics endpoint
    metrics_res = client.get("/metrics")
    assert metrics_res.status_code == 200
    assert "minemind_composite_risk" in metrics_res.text

    # Security Headers verification
    assert "x-request-id" in metrics_res.headers
    assert "x-content-type-options" in metrics_res.headers
