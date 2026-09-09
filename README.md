# MineMind AI — Mining Digital Twin & Operations Platform

> **Industrial-grade, AI-Powered Mining Digital Twin, Safety Intelligence & Operations Command Center.**

[![Architecture: Monorepo](https://img.shields.io/badge/Architecture-Modular%20Monorepo-0B0F17?style=flat-square)](#monorepo-architecture)
[![Backend: Spring Boot 3](https://img.shields.io/badge/Backend-Spring%20Boot%203.3%20%7C%20Java%2021-6DB33F?style=flat-square&logo=springboot)](java-backend/)
[![AI Service: FastAPI](https://img.shields.io/badge/AI%20Engine-FastAPI%20%7C%20Python%203.12%2B-009688?style=flat-square&logo=fastapi)](python-ai/)
[![Frontend: React + TS](https://img.shields.io/badge/Frontend-React%2018%20%7C%20TypeScript%20%7C%20Vite-61DAFB?style=flat-square&logo=react)](frontend/)
[![Database: PostgreSQL 16](https://img.shields.io/badge/Database-PostgreSQL%2016%20%7C%20Flyway-336791?style=flat-square&logo=postgresql)](database/)
[![Cache: Redis 7](https://img.shields.io/badge/Cache-Redis%207-DC382D?style=flat-square&logo=redis)](deployment/)
[![Offline First](https://img.shields.io/badge/Design-100%25%20Offline%20Local-10B981?style=flat-square)](#offline-guarantee)

---

## Overview

**MineMind AI** provides real-time situational awareness, predictive safety intelligence, autonomous fleet tracking, sensor telemetry aggregation, and digital twin simulation for surface and underground mining operations.

### Key Architectural Principles
1. **100% Local & Offline**: Operates completely within on-premise air-gapped mine site servers. Zero dependencies on external SaaS or third-party cloud APIs.
2. **Industrial Command-Center UX**: High-density operational visibility with real-time status telemetry, multi-zone spatial awareness, and sub-second safety alert dispatch.
3. **Modular Monorepo Architecture**: Clean isolation between Core Operations, AI Intelligence, Physics Simulation, Edge Vision, and Telemetry Ingestion.
4. **Enterprise Security & Compliance**: Strict Role-Based (RBAC) and Permission-Based (PBAC) access control, cryptographic session management, and immutable audit logs.

---

## Monorepo Architecture

```
d:/Minemind/
├── frontend/                     # React 18 + Vite + TypeScript Industrial UI
├── java-backend/                 # Spring Boot 3.3+ / Java 21 Enterprise Core
├── python-ai/                    # FastAPI AI Service (Python 3.12+)
├── simulation-engine/            # Haulage, ventilation & slope physics engine
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

## Quick Start Guide

### Prerequisites
- Java 21 (JDK)
- Node.js 18+ (Node 20+ recommended)
- Python 3.12+
- Docker & Docker Compose (optional for containerized deployment)

### 1. Running with Docker Compose (Recommended)
```bash
# Start all microservices, database, and cache
docker-compose up --build -d

# Check service logs
docker-compose logs -f
```

Services will be available at:
- **Frontend Command Center**: [http://localhost:5173](http://localhost:5173)
- **Java Core Backend API**: [http://localhost:8080/api/v1](http://localhost:8080/api/v1)
- **Swagger / OpenAPI Documentation**: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- **Python AI Service**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Default Credentials (Phase 1 Baseline)

| Role | Username | Password |
| :--- | :--- | :--- |
| **Super Admin** | `superadmin@minemind.io` | `MineMind@Admin2026!` |
| **Mine Admin** | `mineadmin@minemind.io` | `MineMind@Admin2026!` |
| **Safety Officer** | `safety@minemind.io` | `MineMind@Safety2026!` |
| **Viewer** | `viewer@minemind.io` | `MineMind@Viewer2026!` |

---

## Documentation

- [Architecture Overview](documentation/architecture-overview.md)
- [Database Schema & ERD](documentation/database-documentation.md)
- [Security & RBAC Specifications](documentation/security-documentation.md)
- [API Contract & Endpoints](documentation/api-documentation.md)
- [Coding Standards & Guidelines](documentation/coding-standards.md)
- [Contribution & Development Workflow](documentation/contribution-guide.md)
