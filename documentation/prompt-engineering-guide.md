# MineMind AI — Prompt Engineering & Domain Roles Guide

## 1. System Prompt Architecture
Every interaction with the MineMind Local Assistant is framed with role-specific system prompts designed to emphasize **zero-harm mining operations, TARP compliance, and telemetry grounding**.

### Role Personas Summary

```
                  ┌────────────────────────────────────────────────────┐
                  │             Role Prompt Architecture               │
                  └─────────────────────────┬──────────────────────────┘
                                            │
        ┌───────────────────┬───────────────┴───────────────┬───────────────────┐
        ▼                   ▼                               ▼                   ▼
┌───────────────┐   ┌───────────────┐               ┌───────────────┐   ┌───────────────┐
│ Safety Officer│   │  Geotechnical │               │  Maintenance  │   │ Pit Dispatch  │
│ Zero-Harm,    │   │  Highwalls,   │               │  Weibull RUL, │   │ Haul Cycles,  │
│ Blast Zones   │   │  LEM, Radar   │               │  Vibrations   │   │ TKPH Limits   │
└───────────────┘   └───────────────┘               └───────────────┘   └───────────────┘
```

## 2. Role Definitions

### 2.1 Senior Safety Officer (`safety_officer`)
- **Key Focus**: Incident prevention, blast clearance radii, atmospheric gas limits (CO, NOx, CH4), worker biometrics, and SOP enforcement.
- **Example Starter Inquiries**:
  - *"What is the current safety TARP level across all pit sectors?"*
  - *"What are the mandatory exclusion zones during active blasting?"*

### 2.2 Principal Geotechnical Engineer (`geotechnical_engineer`)
- **Key Focus**: Bishop Limit Equilibrium FoS calculations, radar slope velocity (mm/day), pore pressure, rockfall kinetic energy (kJ), and berm containment.
- **Example Starter Inquiries**:
  - *"What is the stability Factor of Safety (FoS) for the North Wall?"*
  - *"Has radar detected deformation velocity exceeding 5 mm/day on any bench?"*

### 2.3 Reliability & Maintenance Specialist (`maintenance_specialist`)
- **Key Focus**: CAT 797F brake cooling temperatures, primary gyratory crusher eccentric bearing heat, vibration RMS spectrum, and Weibull Remaining Useful Life (RUL).
- **Example Starter Inquiries**:
  - *"What is the Remaining Useful Life (RUL) of the primary crusher mantle liner?"*
  - *"Are any haul truck disc brake temperatures exceeding 115°C?"*

### 2.4 Pit Dispatcher (`pit_dispatcher`)
- **Key Focus**: Haul cycle dispatching, truck-shovel allocation, ramp speed enforcement, right-of-way rules, and tire TKPH thermal ceilings.
- **Example Starter Inquiries**:
  - *"What are the current speed limits on Main Ramp R-01?"*
  - *"Are any haul trucks exceeding the 650 TKPH tire threshold?"*

### 2.5 Mine Operations General Manager (`mine_operations_manager`)
- **Key Focus**: Holistic shift production vs target tonnage, fleet availability, incident count, and automated shift handover reporting.
- **Example Starter Inquiries**:
  - *"Generate a comprehensive shift handover summary for Shift Alpha."*
  - *"What is the overall mine composite risk score today?"*
