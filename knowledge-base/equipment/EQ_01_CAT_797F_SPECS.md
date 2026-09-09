# Heavy Mobile Equipment Specifications: Ultra-Class Haul Truck (CAT 797F / Equivalent)

**Document ID**: EQ-MM-FLT-001  
**Version**: 3.2  
**Category**: Mobile Fleet Engineering  
**Applies To**: Fleet Dispatchers, Haul Truck Operators, Reliability Engineers  

---

## 1. Technical Specifications
- **Gross Machine Operating Weight (GMW)**: 623,690 kg (1,375,000 lb)
- **Nominal Payload Capacity**: 363 to 400 metric tonnes (400 US tons)
- **Engine**: Cat C175-20 ACERT 20-cylinder quad-turbo diesel
- **Gross Power**: 2,983 kW (4,000 hp) at 1,750 rpm
- **Top Loaded Speed (Level)**: 67.6 km/h (42.0 mph)
- **Maximum Dynamic Retarding Speed (10% Down-Grade)**: 19.3 km/h (12.0 mph)

## 2. Brake & Retarder Thermal Limits
- Maximum continuous oil-cooled disc brake temperature: **$115^\circ\text{C}$**.
- Thermal overload alarm threshold: **$125^\circ\text{C}$** (Operator must engage auxiliary manual retarding and gear down to 1st range).
- Cool-down mandatory period: If brake temp exceeds $130^\circ\text{C}$, vehicle must be parked on flat bench run-off pad for 20 minutes before returning to circuit.

## 3. Tire Management & TKPH (Ton-Kilometer Per Hour) Rating
- **Tire Dimension**: 59/80R63
- **Cold Inflation Pressure**: 102 psi (700 kPa)
- **Maximum TKPH Limit**: 650 TKPH (Site operational threshold). Exceeding 600 TKPH triggers dispatch automated speed throttling to prevent tire delamination and belt separation.

## 4. Telemetry Channels
- CAN bus CAN0/CAN1 high-speed broadcast:
  - Fuel consumption rate ($L/h$)
  - Brake cooling oil temperature ($^\circ C$)
  - Engine boost pressure ($kPa$)
  - Strut suspension pressure (Tonnes per quadrant)
  - Inertial Measurement Unit (Pitch, Roll, Yaw, G-force)
