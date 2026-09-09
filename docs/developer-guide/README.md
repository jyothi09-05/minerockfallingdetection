# MineMind AI — Developer & Contributor Guide

## 1. Local Development Setup

### Prerequisites
- Python 3.10+
- Node.js 18+ (Node 20+ recommended)
- PostgreSQL 16 & Redis 7 (optional for local mock mode)

### Quick Start
```powershell
# Windows PowerShell
.\scripts\setup.ps1
.\scripts\start.ps1
```

## 2. Running Test Suites
```powershell
# Run full verification suite
.\scripts\test.ps1

# Run Python pytest directly
cd python-ai
python -m pytest

# Run Frontend vitest directly
cd frontend
npm test -- --run
```

## 3. Project Structure
- `python-ai/`: FastAPI intelligence engine, ML models, central risk engine, event broker, incident service, and emergency response simulator.
- `rag/`: Pure local offline vector store, subword embedding engine, and recursive text chunker.
- `llm/`: Pluggable local LLM providers, internal agent tools, domain roles, and automated reporting.
- `frontend/`: React 18, TypeScript, Tailwind CSS, Three.js 3D engine, and 2D Canvas digital twin.
- `database/`: PostgreSQL normalized schema (`schema.sql`) and seed data (`seed.sql`).
- `deployment/`: Docker Compose, Prometheus scraping configs, and Grafana dashboard templates.
