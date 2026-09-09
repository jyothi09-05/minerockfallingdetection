# MineMind AI — Simulation Architecture Specification

## 1. Overview & System Objectives

The MineMind Simulation Engine is a deterministic, offline-first multi-agent physics and environmental simulation platform designed for open-pit mining operations. It powers the MineMind Digital Twin with synchronized kinematic vehicle motion, heavy fixed machinery wear dynamics, workforce shift rosters with biometric strain modeling, multi-parameter environmental sensor streams, and microclimate weather modeling.

```
                      ┌──────────────────────────────────────────────┐
                      │          Simulation Master Runtime           │
                      │  - Tick Loop Coordinator (dt: 0.016s - 1.0s) │
                      │  - Speed Multiplier (1x to 50x)              │
                      │  - Deterministic Seed Controller             │
                      └──────────────────────┬───────────────────────┘
                                             │
             ┌───────────────────────────────┼───────────────────────────────┐
             │                               │                               │
             ▼                               ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│  Vehicle Kinematics     │     │  Fixed Plant Machinery  │     │   Workforce Biometrics  │
│ - Grade Resistance      │     │ - Gyratory Crushers     │     │ - Fatigue Accumulation  │
│ - Turning Radius & Drag │     │ - Overland Conveyors    │     │ - Heat Strain Index     │
│ - Payload Acceleration  │     │ - Dewatering Pumps      │     │ - Geofence Compliance   │
│ - Thermal & Fuel Burn   │     │ - Rotary Blast Drills   │     │ - Shift Roster Cycles   │
└─────────────────────────┘     └─────────────────────────┘     └─────────────────────────┘
             │                               │                               │
             ▼                               ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│  Sensors & Telemetry    │     │  Atmospheric Weather    │     │  Scenario Injection     │
│ - Methane & CO Gas      │     │ - Rain & Flash Floods   │     │ - Slope Instability     │
│ - Radar Displacement    │     │ - Road Friction Multi   │     │ - Methane Gas Surge     │
│ - Seismograph PPV       │     │ - Dust Dispersion PM10  │     │ - Emergency Evacuation  │
└─────────────────────────┘     └─────────────────────────┘     └─────────────────────────┘
```

---

## 2. Vehicle Physics & Kinematic Subsystem

### 2.1 Physics Equations
- **Grade Resistance Force ($F_g$)**:
  $$F_g = m \cdot g \cdot \sin(\theta)$$
  where $m$ is the total vehicle mass (tare mass + payload in kg), $g = 9.81 \text{ m/s}^2$, and $\theta = \arctan(\text{grade \%} / 100)$.
- **Rolling Resistance Force ($F_r$)**:
  $$F_r = m \cdot g \cdot C_{rr} \cdot \cos(\theta)$$
  where $C_{rr}$ is the rolling resistance coefficient (typically $0.02$ for dry hard-packed haul road, up to $0.06$ for wet muddy ramps).
- **Effective Acceleration ($\Delta v$)**:
  $$\Delta v = \frac{P_{\text{engine}} \cdot \eta_{\text{drivetrain}}}{v \cdot m} \cdot \Delta t - \left( \frac{F_g + F_r}{m} \right) \cdot \Delta t$$
- **Fuel Consumption Rate**:
  $$Q_{\text{fuel}} = Q_{\text{base}} \times \left(1.0 + 1.2 \cdot \frac{\text{Payload}}{\text{Capacity}} + 0.8 \cdot \max(0, \sin\theta)\right)$$

### 2.2 Production Haul Cycle State Machine
Each haul truck executes a 5-phase closed cycle:
1. `HAULING_EMPTY`: Descending into pit via spiral ramps at up to 45 km/h.
2. `LOADING`: Positioning under hydraulic shovel (e.g. CAT 6060), payload ramping up to 360 tonnes.
3. `HAULING_LOADED`: Climbing out of the pit on 10% grade ramps with uphill speed governed between 14–22 km/h.
4. `DUMPING`: Discharging payload into primary gyratory crusher pocket or waste dump.
5. `IDLE` / `MAINTENANCE`: Queueing or scheduled servicing.

---

## 3. Fixed Machinery & Thermal Dynamics

Fixed plant units (crushers, conveyors, dewatering pumps) model:
- **Bearing Temperature Equilibrium**:
  $$\frac{dT_{\text{bearing}}}{dt} = k_{\text{heat}} \cdot \text{Load} - k_{\text{dissipate}} \cdot (T_{\text{bearing}} - T_{\text{ambient}})$$
- **Vibration Amplitude & Frequency**: Triaxial velocity RMS ($mm/s$) oscillating with rock fragmentation hardness variations.

---

## 4. Workforce Telemetry & Safety Physics

Personnel tracking incorporates biometric strain:
- **Fatigue Index ($0.0 \to 1.0$)**:
  $$\text{Fatigue}(t) = \text{Fatigue}_0 + \int_0^t \alpha \cdot \max\left(1.0, \frac{T_{\text{ambient}} - 25}{10}\right) \cdot S_{\text{stress}} \, dt$$
- **Heart Rate ($BPM$)**: Baseline $72–80 \text{ bpm} \pm 6 \text{ bpm}$ variability, spiking above $115 \text{ bpm}$ in emergency evacuation scenarios.

---

## 5. Microclimate & Geotechnical Impact

The weather engine simulates:
- Rainfall rate ($mm/h$) degrading the haul road friction coefficient $\mu$ from $0.88$ down to $0.42$.
- Pit floor water accumulation triggering automatic 100% duty cycle on dewatering pumps.
- Pore water pressure escalation in piezometers increasing slope slip risk.
