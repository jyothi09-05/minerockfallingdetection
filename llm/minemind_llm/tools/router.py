"""
Tool Router for MineMind AI.
Dispatches tool invocations based on LLM function calls or deterministic keyword/intent mapping.
"""

from typing import Dict, Any, List, Optional
from .internal_tools import InternalMiningTools


class ToolRouter:
    """
    Executes internal tools and maps intent strings to tool calls.
    """

    TOOL_DISPATCH_TABLE = {
        "get_mine_status": InternalMiningTools.get_mine_status,
        "get_zone_risk": InternalMiningTools.get_zone_risk,
        "get_slope_prediction": InternalMiningTools.get_slope_prediction,
        "get_rockfall_prediction": InternalMiningTools.get_rockfall_prediction,
        "get_equipment_health": InternalMiningTools.get_equipment_health,
        "get_vehicle_status": InternalMiningTools.get_vehicle_status,
        "get_worker_status": InternalMiningTools.get_worker_status,
        "get_active_alerts": InternalMiningTools.get_active_alerts,
    }

    @classmethod
    def execute_tool(cls, tool_name: str, arguments: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Executes a single tool by name with provided arguments."""
        handler = cls.TOOL_DISPATCH_TABLE.get(tool_name)
        if not handler:
            return {"error": f"Tool '{tool_name}' not found."}
        args = arguments or {}
        try:
            return handler(**args)
        except Exception as e:
            return {"error": f"Execution error in '{tool_name}': {str(e)}"}

    @classmethod
    def detect_tools_from_query(cls, query: str) -> List[Dict[str, Any]]:
        """
        Determines relevant tools to invoke based on user natural language keywords.
        """
        q = query.lower()
        tools_to_run: List[Dict[str, Any]] = []

        if any(w in q for w in ["status", "overview", "composite risk", "tonnage", "shift", "weather", "production"]):
            tools_to_run.append({"tool_name": "get_mine_status", "args": {}})

        if any(w in q for w in ["zone", "north highwall", "ramp", "crusher area", "sump"]):
            zone = "North Highwall" if "north" in q else ("Crusher Area" if "crusher" in q else "all")
            tools_to_run.append({"tool_name": "get_zone_risk", "args": {"zone_name": zone}})

        if any(w in q for w in ["slope", "stability", "fos", "factor of safety", "deformation", "geotech"]):
            tools_to_run.append({"tool_name": "get_slope_prediction", "args": {"slope_angle_deg": 48.0, "pore_pressure_kpa": 40.0}})

        if any(w in q for w in ["rockfall", "kinetic", "berm", "joint"]):
            tools_to_run.append({"tool_name": "get_rockfall_prediction", "args": {"bench_elevation_m": 1350.0, "fracture_density": 6.8}})

        if any(w in q for w in ["crusher", "ht-10", "ht-104", "truck", "equipment", "vibration", "rul", "bearing", "mantle", "excavator", "health"]):
            eq_id = "CRUSHER-01" if "crusher" in q else ("HT-104" if "104" in q else "all")
            tools_to_run.append({"tool_name": "get_equipment_health", "args": {"equipment_id": eq_id}})

        if any(w in q for w in ["vehicle", "speed", "tkph", "traffic", "haulage"]):
            tools_to_run.append({"tool_name": "get_vehicle_status", "args": {"vehicle_id": "all"}})

        if any(w in q for w in ["worker", "personnel", "biometric", "fatigue", "heart rate", "ppe"]):
            tools_to_run.append({"tool_name": "get_worker_status", "args": {"worker_id": "all"}})

        if any(w in q for w in ["alert", "warning", "tarp", "alarm", "incident"]):
            tools_to_run.append({"tool_name": "get_active_alerts", "args": {"severity": "all"}})

        # Fallback if no specific keyword matched but it's an inquiry
        if not tools_to_run:
            tools_to_run.append({"tool_name": "get_mine_status", "args": {}})

        return tools_to_run
