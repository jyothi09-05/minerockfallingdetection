# MineMind AI — System Architecture Overview

## 1. System Mission & Operational Goals
**MineMind AI** is an industrial-grade, production-style, AI-powered Mining Digital Twin, Safety Intelligence & Mine Operations Platform. It provides:
- Real-time geospatial telemetry aggregation for surface and underground extraction sites.
- Geotechnical hazard monitoring and sub-millimeter slope radar strain prediction.
- High-frequency haul truck and heavy machinery fleet dispatch and health scoring.
- 100% offline, local-first air-gapped execution capability on mine site edge gateways.

---

## 2. Monorepo Structural Blueprint

```
d:/Minemind/
├── .github/                      # CI/CD Workflows (GitHub Actions)
├── frontend/                     # React 18 + TypeScript + Vite + Tailwind CSS Industrial UI
├── java-backend/                 # Spring Boot 3.3+ (Java 21) Core Operations Backend
├── python-ai/                    # FastAPI AI Service (Python 3.12+)
├── simulation-engine/            # Haulage, slope kinematics & ventilation physics engine
├── digital-twin/                 # 3D spatial models & real-time telemetry mesh
├── llm/                          # Local offline LLM inference & agent framework
├── rag/                          # FAISS vector store & mining safety knowledge
├── computer-vision/              # Edge camera safety analytics (PPE/Geofence)
├── analytics/                    # Production KPI & predictive maintenance
├── database/                     # PostgreSQL schemas, migrations & seeders
├── testing/                      # Monorepo test harness & integration suites
├── deployment/                   # Docker, Compose & on-premise orchestration
├── documentation/                # Full architecture, DB & security specs
├── scripts/                      # Developer build, test & database scripts
└── tools/                        # Diagnostic and code generation utilities
```

---

## 3. Communication & Data Flow

```
+-------------------------------------------------------------+
|               Industrial Command Center UI                 |
|             (React + TypeScript + Tailwind)                 |
+-------------------------------------------------------------+
                               |
                               | REST (Bearer JWT)
                               v
+-------------------------------------------------------------+
|              Java Core Backend (Spring Boot 3)              |
|   - Multi-tenant Domain Services (Mines, Zones, Assets)     |
|   - RBAC & PBAC Security Filter Chain                       |
|   - Telemetry Ingestion & Audit Logging                     |
+-------------------------------------------------------------+
             |                                    |
             | Internal JSON / HTTP               | SQL / JPA
             v                                    v
+--------------------------+          +-----------------------+
|  Python AI Service       |          |  PostgreSQL 16 DB     |
|  (FastAPI + Statistical  |          |  - Normalized Schema  |
|   Anomaly Detection)     |          |  - JSONB Metadata     |
+--------------------------+          +-----------------------+
             |                                    |
             +----------------+-------------------+
                              |
                              v
                   +---------------------+
                   |   Redis 7 Cache     |
                   |   - Fast Telemetry  |
                   |   - Session Revoke  |
                   +---------------------+
```

---

## 4. Modularity & Zero External Vendor Dependencies
- All models, databases, and dependencies run locally within containerized environments.
- Zero reliance on external SaaS or third-party cloud APIs.
- Clean architectural interfaces allow Phase 2+ modules (Simulation, 3D Digital Twin, Edge Vision, Local LLM) to seamlessly plug in.
