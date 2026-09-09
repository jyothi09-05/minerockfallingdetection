"""
MineMind AI - Smart Alert & Incident Triage Engine
Manages alarm generation, deduplication, escalation, and resolution lifecycle.
"""
from typing import List, Dict, Optional
from datetime import datetime, timezone
from app.schemas.ai import SmartAlert


class AlertEngine:
    """
    Intelligent alert management service.
    """

    def __init__(self):
        self._alerts: Dict[str, SmartAlert] = {}
        self._initialize_default_alerts()

    def _initialize_default_alerts(self):
        default_alerts = [
            SmartAlert(
                id="ALT-GEO-8801",
                timestamp=datetime.now(timezone.utc),
                source_model="Rockfall-GradientEnsemble",
                category="GEOTECHNICAL",
                severity="HIGH",
                title="East Highwall Crest Displacement Alert",
                description="Radar displacement velocity accelerated to 4.80 mm/day exceeding 2.50 mm/day threshold.",
                affected_entity_id="BENCH-130",
                affected_zone_id="ZONE-EAST-WALL",
                risk_probability=0.88,
                is_acknowledged=False,
                is_resolved=False,
                recommended_action="Suspend haul traffic on Ramp Level 2; dispatch geotechnical survey drone.",
            ),
            SmartAlert(
                id="ALT-COL-9204",
                timestamp=datetime.now(timezone.utc),
                source_model="Fleet-Collision-Proximity",
                category="COLLISION",
                severity="MEDIUM",
                title="Haul Truck Proximity Warning HT-101 vs HT-102",
                description="Time-To-Collision projected at 6.8s on In-Pit Spiral Ramp 1 approach.",
                affected_entity_id="VEH-HT-101",
                affected_zone_id="ZONE-HAUL-01",
                risk_probability=0.72,
                is_acknowledged=True,
                is_resolved=False,
                recommended_action="Autonomous in-cab speed advisory issued to HT-101 to maintain 50m separation buffer.",
            ),
            SmartAlert(
                id="ALT-ENV-4109",
                timestamp=datetime.now(timezone.utc),
                source_model="Env-Multivariate-IsolationTree",
                category="ENVIRONMENTAL",
                severity="LOW",
                title="Haul Road Dust Concentration Elevated",
                description="PM10 optical particle counter reached 142 µg/m³ near Surface Admin Gate.",
                affected_entity_id="SNS-ENV-DUST-01",
                affected_zone_id="ZONE-HAUL-01",
                risk_probability=0.42,
                is_acknowledged=True,
                is_resolved=True,
                recommended_action="Dispatch CAT 777G Water Truck to spray dust suppressant.",
            ),
        ]
        for a in default_alerts:
            self._alerts[a.id] = a

    def get_all_alerts(self) -> List[SmartAlert]:
        return sorted(list(self._alerts.values()), key=lambda x: x.timestamp, reverse=True)

    def acknowledge_alert(self, alert_id: str) -> Optional[SmartAlert]:
        if alert_id in self._alerts:
            self._alerts[alert_id].is_acknowledged = True
            return self._alerts[alert_id]
        return None

    def resolve_alert(self, alert_id: str) -> Optional[SmartAlert]:
        if alert_id in self._alerts:
            self._alerts[alert_id].is_resolved = True
            return self._alerts[alert_id]
        return None

    def create_alert(self, alert: SmartAlert) -> SmartAlert:
        self._alerts[alert.id] = alert
        return alert


# Global alert engine instance
alert_engine = AlertEngine()
