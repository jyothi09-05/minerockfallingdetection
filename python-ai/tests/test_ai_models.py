"""
Comprehensive Unit Tests for MineMind AI Models & Feature Extraction
"""
import pytest
from app.ml.registry import model_registry
from app.ml.rockfall import RockfallPredictionModel
from app.ml.slope_stability import SlopeStabilityModel
from app.ml.equipment_failure import EquipmentFailureModel
from app.ml.collision import CollisionPredictionModel
from app.ml.environmental import EnvironmentalAnomalyModel
from app.ml.worker_safety import WorkerSafetyModel
from app.ml.features import FeatureExtractor
from app.services.risk_engine import central_risk_engine
from app.services.alert_engine import alert_engine


def test_feature_extractor_kinematic_ttc():
    pos_a = (0.0, 0.0, 0.0)
    vel_a = (10.0, 0.0, 0.0)
    pos_b = (50.0, 0.0, 0.0)
    vel_b = (-10.0, 0.0, 0.0)

    dist, closing_vel, ttc = FeatureExtractor.calculate_kinematic_ttc(pos_a, vel_a, pos_b, vel_b)
    assert dist == 50.0
    assert closing_vel == 20.0
    assert ttc == 2.5


def test_rockfall_model_prediction():
    model = model_registry.get_model("rockfall")
    assert model is not None

    # Safe baseline
    safe_res = model.predict({
        "slope_angle_deg": 55.0,
        "displacement_mm_day": 0.25,
        "rainfall_mm_24h": 0.0,
        "crack_dilation_mm": 1.5,
        "rock_mass_rating": 80.0,
    })
    assert safe_res.risk_level in ["SAFE", "LOW"]
    assert safe_res.probability < 0.35

    # Critical trigger
    crit_res = model.predict({
        "slope_angle_deg": 75.0,
        "displacement_mm_day": 6.80,
        "rainfall_mm_24h": 45.0,
        "crack_dilation_mm": 12.0,
        "rock_mass_rating": 40.0,
    })
    assert crit_res.risk_level in ["HIGH", "CRITICAL"]
    assert crit_res.probability > 0.80
    assert len(crit_res.contributing_factors) > 0


def test_slope_stability_model():
    model = model_registry.get_model("slope_stability")
    assert model is not None

    res = model.predict({
        "wall_height_m": 50.0,
        "slope_angle_deg": 48.0,
        "water_table_height_m": 5.0,
        "displacement_velocity_mm_day": 0.4,
    })
    assert "factor_of_safety" in res.metadata
    assert res.metadata["factor_of_safety"] >= 1.0


def test_equipment_rul_prediction():
    model = model_registry.get_model("equipment_failure")
    assert model is not None

    res = model.predict({
        "operating_hours": 7200.0,
        "bearing_temp_c": 88.0,
        "vibration_amplitude_mms": 7.5,
        "power_draw_kw": 620.0,
    })
    assert res.risk_level in ["HIGH", "CRITICAL"]
    assert res.metadata["remaining_useful_life_hours"] < 500.0


def test_collision_avoidance_prediction():
    model = model_registry.get_model("collision")
    assert model is not None

    res = model.predict({
        "pos_a": [0.0, 500.0, 100.0],
        "vel_a": [10.0, 0.0, 0.0],
        "pos_b": [25.0, 500.0, 100.0],
        "vel_b": [-8.0, 0.0, 0.0],
    })
    assert res.risk_level == "CRITICAL"
    assert res.probability > 0.80


def test_central_risk_engine_global_score():
    response = central_risk_engine.evaluate_global_risk(
        rockfall_input={"displacement_mm_day": 0.3},
        slope_input={},
        collision_input={},
        equipment_input={},
        worker_input={},
        env_input={"gas_methane_lel_pct": 0.1},
    )
    assert response.overall_mine_risk_score >= 0.0
    assert response.overall_mine_risk_score <= 1.0
    assert len(response.zone_breakdown) == 5
    assert response.mine_safety_health_index > 0.0


def test_alert_engine_lifecycle():
    alerts = alert_engine.get_all_alerts()
    assert len(alerts) >= 3

    first_id = alerts[0].id
    acked = alert_engine.acknowledge_alert(first_id)
    assert acked is not None
    assert acked.is_acknowledged is True

    resolved = alert_engine.resolve_alert(first_id)
    assert resolved is not None
    assert resolved.is_resolved is True
