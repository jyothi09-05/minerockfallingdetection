"""
Emergency Response Simulation & Evacuation Engine for MineMind AI.
Simulates 8 critical mining disaster scenarios with real-time affected entity isolation,
evacuation routing, and automated TARP action plans.
"""

from datetime import datetime
from typing import Dict, List, Any, Optional
from enum import Enum


class EmergencyType(str, Enum):
    ROCKFALL = "ROCKFALL"
    SLOPE_INSTABILITY = "SLOPE_INSTABILITY"
    FIRE = "FIRE"
    FLOOD = "FLOOD"
    VEHICLE_COLLISION = "VEHICLE_COLLISION"
    EQUIPMENT_FAILURE = "EQUIPMENT_FAILURE"
    WORKER_EMERGENCY = "WORKER_EMERGENCY"
    GAS_DUST_INCIDENT = "GAS_DUST_INCIDENT"


EMERGENCY_SCENARIO_TEMPLATES: Dict[EmergencyType, Dict[str, Any]] = {
    EmergencyType.ROCKFALL: {
        "title": "Severe Highwall Crest Rockfall on Bench 1350",
        "affected_zone": "North Highwall",
        "zone_id": "ZN-01",
        "severity": "CRITICAL",
        "tarp_level": "LEVEL_3_RED",
        "primary_hazard": "Loose boulder detachment (est. 1,200 kg) with kinetic energy exceeding 180 kJ.",
        "affected_workers": ["WRK-001 (Marcus V.)", "WRK-002 (Elena R.)"],
        "affected_vehicles": ["HT-101", "LV-201"],
        "affected_equipment": ["EXCAVATOR-03"],
        "evacuation_corridor": {
            "primary_ramp": "R-02 (West Flank Egress)",
            "safe_assembly_point": "Assembly Point Beta (Bench 1450 Rim)",
            "forbidden_zones": ["North Highwall Bench 1350 Crest", "Haul Ramp R-01 North Intersection"]
        },
        "action_plan": [
            "Sound continuous emergency siren across North Sector PA speakers.",
            "Dispatch automated stop commands to all vehicles on Ramp R-01.",
            "Evacuate geotechnical surveyors via West Flank secondary egress R-02.",
            "Deploy emergency radar prism tracking to assess post-detachment highwall FoS."
        ]
    },
    EmergencyType.SLOPE_INSTABILITY: {
        "title": "Catastrophic Multi-Bench Highwall Slip Warning",
        "affected_zone": "North Highwall",
        "zone_id": "ZN-01",
        "severity": "CATASTROPHIC",
        "tarp_level": "LEVEL_4_EMERGENCY",
        "primary_hazard": "InSAR radar deformation velocity exceeded 18.2 mm/day; Factor of Safety dropped to 0.88.",
        "affected_workers": ["WRK-001", "WRK-002", "WRK-004", "WRK-007"],
        "affected_vehicles": ["HT-101", "HT-102", "LV-201"],
        "affected_equipment": ["EXCAVATOR-03", "DRILL-01"],
        "evacuation_corridor": {
            "primary_ramp": "Main Ramp Egress R-01 to Surface",
            "safe_assembly_point": "Surface Gate Alpha",
            "forbidden_zones": ["All benches below 1400m elevation in North Sector"]
        },
        "action_plan": [
            "Initiate immediate Code RED Total Pit Evacuation for all lower benches.",
            "Broadcast emergency evacuation order over VHF Channels 1 through 8.",
            "Verify muster headcount via wearable RFID beacons within 10 minutes.",
            "Activate sub-bench dewatering boreholes to relieve pore pressure."
        ]
    },
    EmergencyType.FIRE: {
        "title": "Ultra-Class Haul Truck Engine & Hydraulic Bay Fire",
        "affected_zone": "Main Haul Ramp",
        "zone_id": "ZN-02",
        "severity": "CRITICAL",
        "tarp_level": "LEVEL_3_RED",
        "primary_hazard": "CAN bus reports engine compartment thermal breach (>450°C) with hydraulic fluid ignition.",
        "affected_workers": ["WRK-005 (David K.)"],
        "affected_vehicles": ["HT-104"],
        "affected_equipment": [],
        "evacuation_corridor": {
            "primary_ramp": "Ramp R-01 Downhill Runoff Pad",
            "safe_assembly_point": "Bench 1200 Safety Island",
            "forbidden_zones": ["Ramp R-01 Section 4 (200m buffer)"]
        },
        "action_plan": [
            "Trigger vehicle automatic Ansul fire suppression system remotely.",
            "Instruct operator to steer into safety berm, drop payload, and egress upwind.",
            "Dispatch Site Emergency Response Fire Tender FT-01.",
            "Halt all trailing haul trucks at minimum 150m spacing."
        ]
    },
    EmergencyType.FLOOD: {
        "title": "Severe Pit Inundation & South Sump Rapid Inflow",
        "affected_zone": "South Sump",
        "zone_id": "ZN-04",
        "severity": "HIGH",
        "tarp_level": "LEVEL_3_RED",
        "primary_hazard": "Flash rainfall rate of 34 mm/hr with sump water level rising at 0.8m/hr.",
        "affected_workers": ["WRK-008", "WRK-009"],
        "affected_vehicles": ["HT-102", "WT-01"],
        "affected_equipment": ["PUMP-SKID-01", "PUMP-SKID-02"],
        "evacuation_corridor": {
            "primary_ramp": "Ramp R-03 South to Bench 1300",
            "safe_assembly_point": "Bench 1350 Intermediate Staging",
            "forbidden_zones": ["Pit Floor below Bench 1150"]
        },
        "action_plan": [
            "Activate auxiliary diesel dewatering booster pumps P-03 and P-04.",
            "Evacuate all light vehicles and personnel from pit floor sump zone.",
            "Re-route ore haulage strictly to upper waste dumps."
        ]
    },
    EmergencyType.VEHICLE_COLLISION: {
        "title": "Ramp Intersection Imminent Collision Breach",
        "affected_zone": "Main Haul Ramp",
        "zone_id": "ZN-02",
        "severity": "CRITICAL",
        "tarp_level": "LEVEL_3_RED",
        "primary_hazard": "Radar proximity detected Light Vehicle LV-201 inside Haul Truck HT-101 blind spot envelope (<18m distance).",
        "affected_workers": ["WRK-003", "WRK-006"],
        "affected_vehicles": ["HT-101", "LV-201"],
        "affected_equipment": [],
        "evacuation_corridor": {
            "primary_ramp": "Ramp R-01 East Shoulder",
            "safe_assembly_point": "Bench 1300 Pullout",
            "forbidden_zones": ["Ramp R-01 Switchback B"]
        },
        "action_plan": [
            "Send override emergency audio alert to both vehicle cabin telemetry units.",
            "Enforce immediate positive radio stop protocol on VHF Channel 4.",
            "Review camera CCTV-02 intersection recording for driver fatigue indicators."
        ]
    },
    EmergencyType.EQUIPMENT_FAILURE: {
        "title": "Primary Gyratory Crusher Main Shaft Eccentric Seizure",
        "affected_zone": "Crusher Area",
        "zone_id": "ZN-03",
        "severity": "HIGH",
        "tarp_level": "LEVEL_2_YELLOW",
        "primary_hazard": "Eccentric bearing temperature hit 92°C with catastrophic vibration spike (>9.4 mm/s).",
        "affected_workers": ["WRK-005"],
        "affected_vehicles": ["HT-104", "HT-106"],
        "affected_equipment": ["CRUSHER-01"],
        "evacuation_corridor": {
            "primary_ramp": "Crusher Apron Access Road",
            "safe_assembly_point": "Fixed Plant Workshop Alpha",
            "forbidden_zones": ["Crusher Feed Pocket & Discharge Chute"]
        },
        "action_plan": [
            "Engage automatic PLC emergency shutdown interlock on feed conveyors.",
            "Halt incoming haul trucks at crusher approach holding zone.",
            "Initiate emergency lube chiller flush and lock-out tag-out (LOTO) procedures."
        ]
    },
    EmergencyType.WORKER_EMERGENCY: {
        "title": "Worker Heat Stroke / Man-Down Biometric Alert",
        "affected_zone": "North Highwall",
        "zone_id": "ZN-01",
        "severity": "CRITICAL",
        "tarp_level": "LEVEL_3_RED",
        "primary_hazard": "Wearable sensor detected rapid deceleration (fall) followed by heart rate spike to 168 bpm and zero motion.",
        "affected_workers": ["WRK-002 (Elena Rostova)"],
        "affected_vehicles": ["LV-201"],
        "affected_equipment": [],
        "evacuation_corridor": {
            "primary_ramp": "Survey Access Ramp 1",
            "safe_assembly_point": "Medical Bay / ERT Ambulance 1",
            "forbidden_zones": []
        },
        "action_plan": [
            "Dispatch site paramedic unit MED-01 to North Wall Bench 1350 coordinates (x=420, y=180).",
            "Alert closest co-worker (WRK-001) to provide visual assessment.",
            "Stand by medevac helicopter protocol if extraction is delayed."
        ]
    },
    EmergencyType.GAS_DUST_INCIDENT: {
        "title": "Toxic Gas Outburst & Extreme Particulate Threshold Exceeded",
        "affected_zone": "Crusher Area",
        "zone_id": "ZN-03",
        "severity": "HIGH",
        "tarp_level": "LEVEL_3_RED",
        "primary_hazard": "Methane sensor SN-04 registered 1.8% concentration with dust PM10 at 240 ug/m³.",
        "affected_workers": ["WRK-005", "WRK-008"],
        "affected_vehicles": ["HT-104"],
        "affected_equipment": ["CRUSHER-01", "CONVEYOR-01"],
        "evacuation_corridor": {
            "primary_ramp": "Upwind Perimeter Road",
            "safe_assembly_point": "Surface Control Building",
            "forbidden_zones": ["Crusher Pocket and Downwind Plume Sector"]
        },
        "action_plan": [
            "Turn on all water mist suppression canons and auxiliary dust scrubbers.",
            "Mandate immediate self-rescuer respirator donning for all personnel in sector.",
            "Evacuate personnel upwind towards Surface Main Gate."
        ]
    }
}


class EmergencyService:
    """
    Simulates, coordinates, and resolves active mine disaster scenarios.
    """

    def __init__(self):
        self.active_emergencies: Dict[str, Dict[str, Any]] = {}

    def trigger_emergency(self, emergency_type: str, custom_zone: Optional[str] = None) -> Dict[str, Any]:
        """Triggers an active simulated emergency scenario."""
        try:
            em_type = EmergencyType(emergency_type.upper())
        except ValueError:
            em_type = EmergencyType.ROCKFALL

        template = EMERGENCY_SCENARIO_TEMPLATES[em_type]
        em_id = f"EMERG-{int(datetime.now().timestamp())}"
        now_str = datetime.now().isoformat()

        emergency = {
            "emergency_id": em_id,
            "emergency_type": em_type.value,
            "title": template["title"],
            "affected_zone": custom_zone or template["affected_zone"],
            "zone_id": template["zone_id"],
            "severity": template["severity"],
            "tarp_level": template["tarp_level"],
            "primary_hazard": template["primary_hazard"],
            "affected_entities": {
                "workers": template["affected_workers"],
                "vehicles": template["affected_vehicles"],
                "equipment": template["affected_equipment"]
            },
            "evacuation_corridor": template["evacuation_corridor"],
            "action_plan": template["action_plan"],
            "triggered_at": now_str,
            "status": "ACTIVE",
            "siren_active": True
        }

        self.active_emergencies[em_id] = emergency
        return emergency

    def list_active_emergencies(self) -> List[Dict[str, Any]]:
        """Returns all currently active emergency scenarios."""
        return [e for e in self.active_emergencies.values() if e["status"] == "ACTIVE"]

    def resolve_emergency(self, emergency_id: str, resolution_notes: str = "Situation contained and all-clear declared.") -> Optional[Dict[str, Any]]:
        """Deactivates and resolves an emergency scenario."""
        em = self.active_emergencies.get(emergency_id)
        if not em:
            return None
        em["status"] = "RESOLVED"
        em["siren_active"] = False
        em["resolved_at"] = datetime.now().isoformat()
        em["resolution_notes"] = resolution_notes
        return em


emergency_service = EmergencyService()
