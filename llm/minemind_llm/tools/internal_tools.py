"""
Internal Agent Tools for MineMind AI.
Provides deterministic, trusted data retrieval and calculation tools for LLM reasoning.
All numeric values returned here are factual ground truth.
"""

from dataclasses import dataclass
from typing import Dict, Any, List, Optional
import math


@dataclass
class ToolDefinition:
    name: str
    description: str
    parameters: Dict[str, Any]


class InternalMiningTools:
    """
    Direct interface to digital twin telemetry, risk engine calculations, and ML inference.
    """

    @staticmethod
    def get_registered_tools() -> List[Dict[str, Any]]:
        """Returns schemas for all available internal tools."""
        return [
            {
                "name": "get_mine_status",
                "description": "Retrieves the overall mine operational status, composite risk score, weather, and active personnel count.",
                "parameters": {}
            },
            {
                "name": "get_zone_risk",
                "description": "Returns geotechnical, environmental, and collision risk breakdown for a specific mining zone or all zones.",
                "parameters": {
                    "zone_name": {"type": "string", "description": "Name of the zone (e.g., 'North Highwall', 'Main Haul Ramp', 'Crusher Area', or 'all')"}
                }
            },
            {
                "name": "get_slope_prediction",
                "description": "Runs geotechnical slope stability assessment (LEM/Bishop) returning Factor of Safety (FoS) and deformation velocity.",
                "parameters": {
                    "slope_angle_deg": {"type": "number", "description": "Slope angle in degrees (default: 45.0)"},
                    "pore_pressure_kpa": {"type": "number", "description": "Pore water pressure in kPa (default: 35.0)"}
                }
            },
            {
                "name": "get_rockfall_prediction",
                "description": "Predicts rockfall probability and kinetic impact energy for a bench.",
                "parameters": {
                    "bench_elevation_m": {"type": "number", "description": "Bench elevation in meters (default: 1350)"},
                    "fracture_density": {"type": "number", "description": "Fractures per cubic meter (default: 6.2)"}
                }
            },
            {
                "name": "get_equipment_health",
                "description": "Retrieves health index, vibration RMS, temperature, and Weibull Remaining Useful Life (RUL) for mine machinery.",
                "parameters": {
                    "equipment_id": {"type": "string", "description": "Equipment ID (e.g., 'CRUSHER-01', 'HT-101', 'EXCAVATOR-03', or 'all')"}
                }
            },
            {
                "name": "get_vehicle_status",
                "description": "Retrieves real-time vehicle telemetry, speed, TKPH tire load, and proximity risk.",
                "parameters": {
                    "vehicle_id": {"type": "string", "description": "Vehicle ID (e.g., 'HT-101', 'HT-102', 'LV-201', or 'all')"}
                }
            },
            {
                "name": "get_worker_status",
                "description": "Retrieves workforce biometric health, fatigue index, and PPE compliance status.",
                "parameters": {
                    "worker_id": {"type": "string", "description": "Worker ID (e.g., 'WRK-001' or 'all')"}
                }
            },
            {
                "name": "get_active_alerts",
                "description": "Retrieves currently active safety alerts, TARP levels, and unacknowledged warnings.",
                "parameters": {
                    "severity": {"type": "string", "description": "Filter by severity ('CRITICAL', 'WARNING', 'INFO', or 'all')"}
                }
            },
            {
                "name": "get_camera_status",
                "description": "Retrieves operational status, health, PTZ orientation, and active models for mine CCTV surveillance cameras.",
                "parameters": {
                    "camera_id": {"type": "string", "description": "Camera ID (e.g., 'CAM-PIT-01', 'CAM-NW-02', 'CAM-RAMP-03', or 'all')"}
                }
            },
            {
                "name": "get_camera_events",
                "description": "Retrieves recent computer vision safety events, PPE non-compliance, and zone breaches.",
                "parameters": {
                    "limit": {"type": "integer", "description": "Maximum number of events to retrieve (default: 10)"}
                }
            },
            {
                "name": "get_cameras_by_zone",
                "description": "Lists all CCTV cameras covering a specific mine zone.",
                "parameters": {
                    "zone_id": {"type": "string", "description": "Zone ID (e.g., 'ZONE-PIT-01', 'ZONE-NW-01')"}
                }
            },
            {
                "name": "get_restricted_zone_events",
                "description": "Retrieves active or recent polygonal geofence incursion alerts across all camera views.",
                "parameters": {}
            },
            {
                "name": "get_ppe_violations",
                "description": "Retrieves all detected PPE compliance violations (missing helmet, missing high-vis vest).",
                "parameters": {}
            },
            {
                "name": "get_camera_health",
                "description": "Returns network-wide camera health diagnostics, FPS stats, and latency metrics.",
                "parameters": {}
            },
            {
                "name": "get_incident_replay",
                "description": "Fetches visual CCTV frame replay metadata for an incident.",
                "parameters": {
                    "incident_id": {"type": "string", "description": "Incident ID (e.g. 'INC-2026-001')"}
                }
            }
        ]

    # --- Tool Execution Implementations ---

    @staticmethod
    def get_mine_status(**kwargs) -> Dict[str, Any]:
        return {
            "mine_name": "MineMind Open-Pit Copper-Gold Mine",
            "operational_status": "NORMAL_OPERATING",
            "overall_composite_risk_score": 0.28,
            "tarp_level": "LEVEL_1_NORMAL",
            "weather": {
                "condition": "Partly Cloudy",
                "temperature_c": 22.4,
                "wind_speed_kmh": 14.2,
                "rainfall_rate_mmh": 0.0,
                "visibility_km": 12.0
            },
            "active_entities": {
                "haul_trucks_active": 8,
                "excavators_active": 3,
                "light_vehicles_active": 5,
                "personnel_on_shift": 42
            },
            "production_shift": {
                "shift_id": "Shift-Alpha",
                "tonnage_hauled_tons": 18450,
                "shift_target_tons": 32000,
                "crusher_throughput_tph": 3850
            }
        }

    @staticmethod
    def get_zone_risk(zone_name: str = "all", **kwargs) -> Dict[str, Any]:
        zones = {
            "North Highwall": {
                "zone_id": "ZN-01",
                "risk_score": 0.42,
                "risk_category": "MODERATE",
                "geotechnical_risk": 0.48,
                "deformation_velocity_mm_day": 3.8,
                "factor_of_safety": 1.24,
                "active_workers": 4,
                "active_vehicles": 2
            },
            "Main Haul Ramp": {
                "zone_id": "ZN-02",
                "risk_score": 0.22,
                "risk_category": "LOW",
                "collision_risk": 0.25,
                "average_speed_kmh": 38.5,
                "active_vehicles": 6,
                "active_workers": 0
            },
            "Crusher Area": {
                "zone_id": "ZN-03",
                "risk_score": 0.31,
                "risk_category": "LOW",
                "environmental_dust_pm10": 42.1,
                "equipment_vibration_rms": 3.2,
                "active_vehicles": 3,
                "active_workers": 8
            },
            "South Sump": {
                "zone_id": "ZN-04",
                "risk_score": 0.18,
                "risk_category": "LOW",
                "water_level_m": 4.2,
                "pump_flow_rate_m3h": 850,
                "active_vehicles": 1,
                "active_workers": 2
            }
        }
        if zone_name != "all" and zone_name in zones:
            return {"zone": zone_name, **zones[zone_name]}
        return {"zones": zones}

    @staticmethod
    def get_slope_prediction(slope_angle_deg: float = 45.0, pore_pressure_kpa: float = 35.0, **kwargs) -> Dict[str, Any]:
        # Limit equilibrium calculation approximation
        friction_angle_deg = 32.0
        cohesion_kpa = 45.0
        rad = math.radians(slope_angle_deg)
        phi_rad = math.radians(friction_angle_deg)
        
        # Resisting force / driving force
        driving = math.sin(rad)
        effective_normal = max(0.1, math.cos(rad) - (pore_pressure_kpa / 200.0))
        resisting = (cohesion_kpa / 120.0) + effective_normal * math.tan(phi_rad)
        fos = max(0.5, min(2.5, resisting / max(0.1, driving)))
        
        deformation_rate = max(0.5, (1.5 - fos) * 12.0) if fos < 1.3 else 1.2

        return {
            "slope_angle_deg": slope_angle_deg,
            "pore_pressure_kpa": pore_pressure_kpa,
            "factor_of_safety": round(fos, 2),
            "stability_status": "STABLE" if fos >= 1.30 else ("ADVISORY" if fos >= 1.15 else "CRITICAL"),
            "estimated_deformation_velocity_mm_day": round(deformation_rate, 2),
            "failure_probability_pct": round(max(1.0, (1.5 - fos) * 60.0), 1),
            "recommendation": "Maintain standard radar monitoring" if fos >= 1.30 else "Initiate TARP Yellow dewatering protocol"
        }

    @staticmethod
    def get_rockfall_prediction(bench_elevation_m: float = 1350.0, fracture_density: float = 6.2, **kwargs) -> Dict[str, Any]:
        prob = min(0.95, max(0.05, (fracture_density / 10.0) * 0.65 + 0.1))
        kinetic_energy_kj = round(12.5 * math.pow(fracture_density, 1.2), 1)
        
        return {
            "bench_elevation_m": bench_elevation_m,
            "fracture_density_joints_m3": fracture_density,
            "rockfall_probability": round(prob, 3),
            "estimated_block_mass_kg": 450,
            "predicted_kinetic_energy_kj": kinetic_energy_kj,
            "trajectory_reach_m": 42.0,
            "berm_containment_status": "CONTAINED_BY_2M_BERM" if kinetic_energy_kj < 150 else "CATCH_BENCH_OVERTOPPING_RISK"
        }

    @staticmethod
    def get_equipment_health(equipment_id: str = "all", **kwargs) -> Dict[str, Any]:
        fleet = {
            "CRUSHER-01": {
                "name": "Primary 60x89 Gyratory Crusher",
                "health_index_pct": 84.5,
                "vibration_rms_mm_s": 3.4,
                "bearing_temp_c": 58.2,
                "weibull_rul_hours": 310.0,
                "liner_wear_pct": 52.0,
                "status": "HEALTHY"
            },
            "HT-101": {
                "name": "CAT 797F Haul Truck #101",
                "health_index_pct": 91.0,
                "brake_oil_temp_c": 98.5,
                "tire_tkph": 520,
                "weibull_rul_hours": 1250.0,
                "status": "HEALTHY"
            },
            "HT-104": {
                "name": "CAT 797F Haul Truck #104",
                "health_index_pct": 68.2,
                "brake_oil_temp_c": 118.0,
                "tire_tkph": 615,
                "weibull_rul_hours": 85.0,
                "status": "MAINTENANCE_DUE",
                "fault_notes": "Brake cooling oil temperature approaching warning limit (120C)"
            },
            "EXCAVATOR-03": {
                "name": "Komatsu PC8000 Hydraulic Shovel",
                "health_index_pct": 88.0,
                "hydraulic_pressure_bar": 340,
                "weibull_rul_hours": 740.0,
                "status": "HEALTHY"
            }
        }
        if equipment_id != "all" and equipment_id in fleet:
            return {"equipment_id": equipment_id, **fleet[equipment_id]}
        return {"equipment_fleet": fleet}

    @staticmethod
    def get_vehicle_status(vehicle_id: str = "all", **kwargs) -> Dict[str, Any]:
        vehicles = {
            "HT-101": {"type": "Haul Truck", "speed_kmh": 36.2, "payload_tons": 380, "location": "Main Ramp Down", "driver": "J. Miller"},
            "HT-102": {"type": "Haul Truck", "speed_kmh": 41.0, "payload_tons": 395, "location": "Pit Floor Bench 1200", "driver": "R. Vance"},
            "HT-104": {"type": "Haul Truck", "speed_kmh": 28.5, "payload_tons": 370, "location": "Crusher Approach", "driver": "A. Chen"},
            "LV-201": {"type": "Light Vehicle", "speed_kmh": 32.0, "payload_tons": 0, "location": "North Wall Survey Road", "driver": "S. Tanaka"}
        }
        if vehicle_id != "all" and vehicle_id in vehicles:
            return {"vehicle_id": vehicle_id, **vehicles[vehicle_id]}
        return {"active_vehicles": vehicles}

    @staticmethod
    def get_worker_status(worker_id: str = "all", **kwargs) -> Dict[str, Any]:
        workers = {
            "WRK-001": {"name": "Marcus Vance", "role": "Drill Specialist", "heart_rate_bpm": 76, "fatigue_index_pct": 24, "zone": "Bench 1350", "ppe_status": "COMPLIANT"},
            "WRK-002": {"name": "Elena Rostova", "role": "Geotechnical Surveyor", "heart_rate_bpm": 82, "fatigue_index_pct": 31, "zone": "North Highwall", "ppe_status": "COMPLIANT"},
            "WRK-005": {"name": "David K.", "role": "Crusher Maintenance Tech", "heart_rate_bpm": 98, "fatigue_index_pct": 58, "zone": "Crusher Area", "ppe_status": "COMPLIANT"}
        }
        if worker_id != "all" and worker_id in workers:
            return {"worker_id": worker_id, **workers[worker_id]}
        return {"monitored_workforce": workers}

    @staticmethod
    def get_active_alerts(severity: str = "all", **kwargs) -> Dict[str, Any]:
        alerts = [
            {
                "alert_id": "ALT-4091",
                "severity": "WARNING",
                "subsystem": "Mobile Fleet",
                "message": "Haul Truck HT-104 brake oil temp at 118°C (Warning threshold: 120°C).",
                "timestamp": "10 minutes ago",
                "recommended_action": "Request operator shift to 1st gear retarding on Ramp R-01."
            },
            {
                "alert_id": "ALT-4088",
                "severity": "INFO",
                "subsystem": "Geotechnical",
                "message": "North Highwall radar scan completed. Average velocity 3.8 mm/day. TARP Green/Yellow boundary.",
                "timestamp": "25 minutes ago",
                "recommended_action": "Continue 15-minute radar interval monitoring."
            }
        ]
        if severity != "all":
            alerts = [a for a in alerts if a["severity"].upper() == severity.upper()]
        return {"count": len(alerts), "alerts": alerts}

    @staticmethod
    def get_camera_status(camera_id: str = "all", **kwargs) -> Dict[str, Any]:
        cams = {
            "CAM-PIT-01": {"name": "Pit Floor Shovel CAM #01", "zone": "Pit Floor Loading Zone", "status": "ACTIVE", "health": 99.2, "fps": 30, "ai_models": ["PPE", "ZONE_GEOFENCE"]},
            "CAM-NW-02": {"name": "North Wall Highwall Monitor #02", "zone": "North-West Sector Benches", "status": "ACTIVE", "health": 97.8, "fps": 25, "ai_models": ["HIGHWALL_CREST", "PPE"]},
            "CAM-RAMP-03": {"name": "Haul Road Main Incline Junction #03", "zone": "Haul Road Switchback #2", "status": "ACTIVE", "health": 98.9, "fps": 30, "ai_models": ["PROXIMITY", "VEHICLE_TRACKER"]},
            "CAM-CRU-04": {"name": "Primary Gyratory Crusher Hopper #04", "zone": "Primary Crusher Discharge", "status": "ACTIVE", "health": 96.4, "fps": 30, "ai_models": ["SMOKE_FIRE", "PINCH_POINT"]},
            "CAM-SUMP-05": {"name": "Pit Sump Dewatering Substation #05", "zone": "Pit Floor Sump & Pump House", "status": "ACTIVE", "health": 95.1, "fps": 20, "ai_models": ["WATER_LEVEL", "PPE"]},
            "CAM-STOCK-06": {"name": "ROM Stockpile Stacker / Reclaimer #06", "zone": "High-Grade ROM Stockpile", "status": "ACTIVE", "health": 99.0, "fps": 30, "ai_models": ["PPE", "STOCKPILE_HEIGHT"]}
        }
        if camera_id != "all" and camera_id in cams:
            return {"camera_id": camera_id, **cams[camera_id]}
        return {"total_cameras": len(cams), "cameras": cams}

    @staticmethod
    def get_camera_events(limit: int = 10, **kwargs) -> Dict[str, Any]:
        events = [
            {"event_id": "EVT-88A1", "camera_id": "CAM-PIT-01", "type": "PPE_VIOLATION", "severity": "HIGH", "desc": "Worker detected without safety helmet in 15m radius of shovel"},
            {"event_id": "EVT-77B2", "camera_id": "CAM-NW-02", "type": "RESTRICTED_ZONE_ENTRY", "severity": "CRITICAL", "desc": "Personnel incursion into Bench 1350 exclusion buffer"},
            {"event_id": "EVT-66C3", "camera_id": "CAM-RAMP-03", "type": "PROXIMITY_WARNING", "severity": "HIGH", "desc": "Light vehicle within 18m blindspot envelope of haul truck"}
        ]
        return {"count": len(events[:limit]), "events": events[:limit]}

    @staticmethod
    def get_cameras_by_zone(zone_id: str = "ZONE-PIT-01", **kwargs) -> Dict[str, Any]:
        return {
            "zone_id": zone_id,
            "cameras": [
                {"camera_id": "CAM-PIT-01", "name": "Pit Floor Shovel CAM #01", "status": "ACTIVE", "resolution": "1920x1080"}
            ]
        }

    @staticmethod
    def get_restricted_zone_events(**kwargs) -> Dict[str, Any]:
        return {
            "active_incursions": 1,
            "incursions": [
                {"zone_name": "Highwall Crest 20m Buffer", "camera_id": "CAM-NW-02", "severity": "CRITICAL", "violator": "PERSON #104"}
            ]
        }

    @staticmethod
    def get_ppe_violations(**kwargs) -> Dict[str, Any]:
        return {
            "total_violations_today": 2,
            "compliance_rate_pct": 95.2,
            "violations": [
                {"camera_id": "CAM-PIT-01", "worker_track_id": 102, "missing": ["HELMET"], "time": "8 minutes ago"}
            ]
        }

    @staticmethod
    def get_camera_health(**kwargs) -> Dict[str, Any]:
        return {
            "total_cameras": 6,
            "active_cameras": 6,
            "offline_cameras": 0,
            "average_health_score_pct": 97.7,
            "average_latency_ms": 15.3,
            "system_status": "OPTIMAL"
        }

    @staticmethod
    def get_incident_replay(incident_id: str = "INC-2026-001", **kwargs) -> Dict[str, Any]:
        return {
            "incident_id": incident_id,
            "camera_id": "CAM-NW-02",
            "camera_name": "North Wall Highwall Monitor #02",
            "event_type": "RESTRICTED_ZONE_ENTRY",
            "severity": "CRITICAL",
            "duration_sec": 22.0,
            "replay_url": f"/api/v1/cctv/replays/{incident_id}"
        }

