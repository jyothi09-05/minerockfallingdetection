"""
MineMind AI - Central Explainable Risk Aggregation Engine
Synthesizes predictions from geotechnical, collision, predictive maintenance,
worker safety, and environmental anomaly models into an unified mine risk score.
"""
from typing import Dict, Any, List
from app.ml.registry import model_registry
from app.schemas.ai import (
    GlobalMineRiskResponse,
    ZoneRiskSummary,
    RockfallPredictRequest,
    SlopeStabilityRequest,
    EquipmentRulRequest,
    CollisionCheckRequest,
    EnvironmentalAnomalyRequest,
    WorkerSafetyRequest,
)
from app.ml.base import FeatureImportance


class CentralRiskEngine:
    """
    Evaluates global and localized multi-domain risk indices for the mine digital twin.
    """

    def evaluate_global_risk(
        self,
        rockfall_input: Dict[str, Any],
        slope_input: Dict[str, Any],
        collision_input: Dict[str, Any],
        equipment_input: Dict[str, Any],
        worker_input: Dict[str, Any],
        env_input: Dict[str, Any],
    ) -> GlobalMineRiskResponse:
        # Retrieve active models
        rf_model = model_registry.get_model("rockfall")
        slope_model = model_registry.get_model("slope_stability")
        collision_model = model_registry.get_model("collision")
        eq_model = model_registry.get_model("equipment_failure")
        worker_model = model_registry.get_model("worker_safety")
        env_model = model_registry.get_model("environmental")

        # Run model inferences
        rf_res = rf_model.predict(rockfall_input)
        slope_res = slope_model.predict(slope_input)
        collision_res = collision_model.predict(collision_input)
        eq_res = eq_model.predict(equipment_input)
        worker_res = worker_model.predict(worker_input)
        env_res = env_model.predict(env_input)

        # Weighted global composite risk score
        weights = {
            "rockfall": 0.25,
            "slope": 0.20,
            "collision": 0.20,
            "worker": 0.15,
            "env": 0.10,
            "equipment": 0.10,
        }

        global_score = (
            weights["rockfall"] * rf_res.probability +
            weights["slope"] * slope_res.probability +
            weights["collision"] * collision_res.probability +
            weights["worker"] * worker_res.probability +
            weights["env"] * env_res.probability +
            weights["equipment"] * eq_res.probability
        )
        global_score = round(max(0.01, min(0.99, global_score)), 3)

        if global_score < 0.20:
            risk_level = "SAFE"
        elif global_score < 0.45:
            risk_level = "LOW"
        elif global_score < 0.70:
            risk_level = "MEDIUM"
        elif global_score < 0.85:
            risk_level = "HIGH"
        else:
            risk_level = "CRITICAL"

        # Aggregate top contributing factors across models
        all_factors: List[FeatureImportance] = (
            rf_res.contributing_factors +
            slope_res.contributing_factors +
            collision_res.contributing_factors +
            eq_res.contributing_factors +
            worker_res.contributing_factors +
            env_res.contributing_factors
        )
        # Filter positive risk drivers and sort by weight
        top_factors = sorted(
            [f for f in all_factors if f.impact_direction == "POSITIVE"],
            key=lambda x: x.importance_weight,
            reverse=True
        )[:5]

        # Zone-by-Zone Breakdown
        zones = [
            ZoneRiskSummary(
                zone_id="ZONE-EAST-WALL",
                zone_name="East Highwall Crest",
                risk_score=round(rf_res.probability * 100, 1),
                risk_level=rf_res.risk_level,
                primary_hazard="Geotechnical Rockfall / Crest Dilation",
                active_alarms_count=1 if rf_res.probability > 0.6 else 0,
            ),
            ZoneRiskSummary(
                zone_id="ZONE-HAUL-01",
                zone_name="Main Pit Spiral Ramp",
                risk_score=round(collision_res.probability * 100, 1),
                risk_level=collision_res.risk_level,
                primary_hazard="Heavy Hauler Kinematic Proximity",
                active_alarms_count=1 if collision_res.probability > 0.6 else 0,
            ),
            ZoneRiskSummary(
                zone_id="ZONE-PIT-FLOOR",
                zone_name="Pit Bottom Sump & Face",
                risk_score=round(env_res.probability * 100, 1),
                risk_level=env_res.risk_level,
                primary_hazard="Methane Seepage / Hydrostatic Surcharge",
                active_alarms_count=1 if env_res.probability > 0.6 else 0,
            ),
            ZoneRiskSummary(
                zone_id="ZONE-CRUSHER",
                zone_name="Primary Gyratory Crusher Yard",
                risk_score=round(eq_res.probability * 100, 1),
                risk_level=eq_res.risk_level,
                primary_hazard="Mechanical Vibration / Bearing Thermals",
                active_alarms_count=1 if eq_res.probability > 0.6 else 0,
            ),
            ZoneRiskSummary(
                zone_id="ZONE-BENCH-3-BLAST",
                zone_name="Bench 3 Active Shovel Face",
                risk_score=round(worker_res.probability * 100, 1),
                risk_level=worker_res.risk_level,
                primary_hazard="Pedestrian / Heavy Shovel Interaction",
                active_alarms_count=1 if worker_res.probability > 0.6 else 0,
            ),
        ]

        return GlobalMineRiskResponse(
            overall_mine_risk_score=global_score,
            overall_risk_level=risk_level,
            mine_safety_health_index=round((1.0 - global_score) * 100.0, 1),
            rockfall_risk=rf_res,
            slope_stability_risk=slope_res,
            collision_risk=collision_res,
            equipment_risk=eq_res,
            worker_safety_risk=worker_res,
            environmental_risk=env_res,
            top_contributing_factors=top_factors,
            zone_breakdown=zones,
        )


# Global risk engine instance
central_risk_engine = CentralRiskEngine()
