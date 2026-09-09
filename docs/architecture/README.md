# MineMind AI — System Architecture Overview

## 1. High-Level Enterprise Architecture
MineMind AI operates as an integrated, multi-tier, 100% offline mining intelligence platform.

```
                      ┌──────────────────────────────────────────────┐
                      │          React 18 Control Room UI            │
                      │  (UnifiedCommandCenter, Digital Twin 2D/3D,  │
                      │   Incidents, Emergencies, Analytics, Reports)│
                      └──────────────────────┬───────────────────────┘
                                             │ WebSocket & HTTP REST
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │          Python AI & Event Broker            │
                      │  (Risk Engine, ML Suite, RAG, Local LLM,     │
                      │   Emergency Simulator, Reporting Exporter)   │
                      └──────────────────────┬───────────────────────┘
                                             │
                      ┌──────────────────────┴───────────────────────┐
                      │ PostgreSQL 16 Normalized Data & Redis Cache  │
                      └──────────────────────────────────────────────┘
```

## 2. Core Tenets
- **100% Air-Gapped & Offline**: Zero reliance on cloud APIs (OpenAI, Gemini, Claude, AWS).
- **Factual Telemetry Grounding**: All numerical decisions and Factor of Safety metrics originate from deterministic sensor/physics calculation models.
- **Human Decision Support**: Prototype safety intelligence designed for human oversight and TARP escalation.
