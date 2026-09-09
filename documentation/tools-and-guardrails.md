# MineMind AI — Internal Tools & Safety Guardrails

## 1. Internal Agent Tools (`llm/minemind_llm/tools/`)
The MineMind assistant never fabricates telemetry, Factor of Safety (FoS) calculations, or equipment wear metrics. Real numerical metrics are produced exclusively by deterministic internal Python tool invocations.

| Tool Name | Scope & Purpose | Return Payload Ground Truth |
| :--- | :--- | :--- |
| `get_mine_status` | Holistic mine overview | `operational_status`, `overall_composite_risk_score`, `tarp_level`, active fleet & workforce counts |
| `get_zone_risk` | Zone-specific risk ratings | Geotechnical FoS, radar deformation velocity (mm/day), particulate levels, active machines |
| `get_slope_prediction` | Geotechnical LEM analysis | Bishop Factor of Safety, failure probability (%), deformation velocity, TARP recommendation |
| `get_rockfall_prediction` | Kinetic impact & berm containment | Fracture joint density, rockfall probability, block mass (kg), kinetic energy (kJ) |
| `get_equipment_health` | Fixed/Mobile machinery diagnostics | Health index (%), vibration RMS (mm/s), bearing temperature (°C), Weibull RUL (hours) |
| `get_vehicle_status` | Fleet telemetry | Instantaneous speed (km/h), payload tons, location, operator, TKPH rating |
| `get_worker_status` | Personnel biometrics & PPE | Heart rate (bpm), fatigue index (%), active zone, camera PPE compliance status |
| `get_active_alerts` | Trigger Action Response Plan (TARP) | Severity, alarm subsystem, recommended emergency actions |

## 2. Safety Guardrails Engine (`llm/minemind_llm/guardrails.py`)
Safety guardrails inspect all generated responses prior to user rendering.

### 2.1 Forbidden Action Filtering
The engine blocks unsafe operational suggestions such as:
- Ignoring active TARP alerts or gas warnings
- Entering active blast exclusion zones (500m radius) without authorized clearance
- Disabling truck dynamic retarding or braking systems on haul ramps
- Overriding automated crusher or dewatering safety interlocks

### 2.2 Factual Telemetry Grounding
Numerical values delivered to control room operators are cross-checked against internal telemetry tool states, preventing AI hallucination during safety-critical incidents.
