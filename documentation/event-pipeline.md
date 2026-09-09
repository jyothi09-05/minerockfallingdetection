# MineMind AI — Real-Time Event & WebSocket Pipeline

## 1. Overview

MineMind AI employs a high-throughput event and messaging architecture capable of streaming synchronized simulation frames, sensor telemetry, and incident notifications to control room workstations.

```
┌────────────────────────┐         WebSocket (/ws/simulation)         ┌────────────────────────┐
│ Simulation Engine Core │ ─────────────────────────────────────────► │ React Digital Twin UI  │
│ (Python/Java Master)   │ ◄───────────────────────────────────────── │ (Canvas 2D / Three.js) │
└────────────────────────┘          REST (/api/v1/simulation)         └────────────────────────┘
```

---

## 2. WebSocket Protocol (`/ws/simulation`)

### 2.1 State Frame Envelope
Each tick broadcast sends a JSON envelope containing:
- `timestamp`: UTC ISO-8601 string.
- `tickIndex`: Monotonic tick counter.
- `simulationTimeSec`: Elapsed simulation duration.
- `scenario`: Active operational or emergency scenario.
- `weather`: Ambient conditions, rainfall, road friction coefficient.
- `vehicles`: List of active vehicle kinematic positions, headings, payloads, and fuel levels.
- `workers`: Personnel biometrics, heart rate, fatigue index, and zone allocation.
- `equipment`: Plant machinery status, power draw kW, and vibration amplitudes.
- `sensors`: Multi-parameter gas, radar displacement, and seismic readings with threshold statuses.
- `overallMineSafetyScore`: Normalized safety score ($0.0 \to 1.0$).

---

## 3. Client Offline Fallback Mode
When running air-gapped without active backend network sockets, the frontend seamlessly transitions to the local `ClientSimulationEngine` in `src/services/simulationEngine.ts`, maintaining full interactive 2D/3D visualization and simulation controls.
