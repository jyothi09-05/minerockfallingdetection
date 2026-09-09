"""
Analytics Service for MineMind AI.
Aggregates enterprise operational, safety, equipment reliability, environmental, and AI accuracy metrics.
"""

from datetime import datetime, timedelta
from typing import Dict, List, Any
import random


class AnalyticsService:
    """
    Computes cross-domain analytics for Safety, Production, Equipment, Environment, and AI.
    """

    @staticmethod
    def get_safety_analytics() -> Dict[str, Any]:
        """Safety trends, near misses, incidents, and TARP distribution."""
        days = 14
        history = []
        now = datetime.now()
        for i in range(days, -1, -1):
            date_str = (now - timedelta(days=i)).strftime("%b %d")
            history.append({
                "date": date_str,
                "incident_count": 0 if i > 3 else (1 if i == 2 else 0),
                "near_misses": random.randint(1, 4),
                "tarp_yellow_events": random.randint(0, 2),
                "risk_composite_index": round(0.25 + random.uniform(-0.08, 0.12), 2),
                "ppe_compliance_pct": round(96.5 + random.uniform(0, 3.5), 1)
            })

        return {
            "period": "Last 14 Days",
            "total_incidents": 2,
            "lost_time_injuries": 0,
            "near_misses_reported": 28,
            "current_tarp_level": "LEVEL_1_NORMAL",
            "safety_health_score_pct": 98.2,
            "trends": history
        }

    @staticmethod
    def get_production_analytics() -> Dict[str, Any]:
        """Tonnage hauled, truck-shovel cycle times, and crusher utilization."""
        return {
            "shift_id": "Shift Alpha",
            "ore_tonnage_hauled_tons": 18450,
            "waste_tonnage_hauled_tons": 24200,
            "target_tonnage_tons": 45000,
            "progress_pct": 94.8,
            "average_truck_cycle_time_min": 24.2,
            "shovel_utilization_pct": 89.4,
            "crusher_throughput_tph": 3850,
            "hourly_throughput_history": [
                {"hour": "06:00", "tonnage": 3600},
                {"hour": "07:00", "tonnage": 3950},
                {"hour": "08:00", "tonnage": 4100},
                {"hour": "09:00", "tonnage": 3800},
                {"hour": "10:00", "tonnage": 3900},
                {"hour": "11:00", "tonnage": 4200},
                {"hour": "12:00", "tonnage": 3750}
            ]
        }

    @staticmethod
    def get_equipment_analytics() -> Dict[str, Any]:
        """Fleet availability, MTBF, MTTR, and Weibull Remaining Useful Life distribution."""
        return {
            "fleet_availability_pct": 92.5,
            "mean_time_between_failures_hrs": 418.0,
            "mean_time_to_repair_hrs": 3.4,
            "active_haul_trucks": 8,
            "standby_trucks": 1,
            "maintenance_due_trucks": 1,
            "active_shovels": 3,
            "weibull_rul_forecast": [
                {"unit_id": "CRUSHER-01", "subsystem": "Mantle Liner", "rul_hours": 310.0, "failure_prob_pct": 12.0},
                {"unit_id": "HT-101", "subsystem": "Engine Turbo", "rul_hours": 1250.0, "failure_prob_pct": 4.5},
                {"unit_id": "HT-104", "subsystem": "Brake Retarder", "rul_hours": 85.0, "failure_prob_pct": 38.0},
                {"unit_id": "EXCAVATOR-03", "subsystem": "Hydraulic Pump", "rul_hours": 740.0, "failure_prob_pct": 8.0}
            ]
        }

    @staticmethod
    def get_environmental_analytics() -> Dict[str, Any]:
        """Dust PM2.5/PM10, sump water levels, and rainfall trends."""
        return {
            "air_quality_index": "GOOD",
            "dust_pm10_avg_ug_m3": 38.4,
            "dust_pm25_avg_ug_m3": 14.2,
            "rainfall_cumulative_24h_mm": 4.8,
            "pit_sump_water_level_m": 4.2,
            "dewatering_discharge_m3_h": 850,
            "ambient_temp_c": 22.4,
            "wind_speed_kmh": 14.2
        }

    @staticmethod
    def get_ai_model_analytics() -> Dict[str, Any]:
        """Inference latency, accuracy metrics, and prediction confidence distributions."""
        return {
            "models_deployed": 6,
            "total_inferences_24h": 148200,
            "average_latency_ms": 1.45,
            "overall_accuracy_pct": 95.8,
            "model_performance": [
                {"model": "Rockfall-GradientEnsemble", "accuracy_pct": 96.2, "latency_ms": 1.2, "status": "ACTIVE"},
                {"model": "Slope-Stability-LEM", "accuracy_pct": 98.4, "latency_ms": 0.8, "status": "ACTIVE"},
                {"model": "Equipment-RUL-Weibull", "accuracy_pct": 94.1, "latency_ms": 1.5, "status": "ACTIVE"},
                {"model": "Fleet-Collision-Proximity", "accuracy_pct": 99.1, "latency_ms": 0.6, "status": "ACTIVE"},
                {"model": "Env-Multivariate-IsolationTree", "accuracy_pct": 93.8, "latency_ms": 2.1, "status": "ACTIVE"},
                {"model": "Worker-Safety-BiometricRisk", "accuracy_pct": 93.4, "latency_ms": 1.8, "status": "ACTIVE"}
            ]
        }


analytics_service = AnalyticsService()
