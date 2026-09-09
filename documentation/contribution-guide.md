# MineMind AI — Contribution & Development Workflow Guide

## 1. Branching & Commit Workflow
- Target **100+ meaningful commits** and **80+ structured pull requests** across full multi-phase roadmap.
- Branch convention:
  - `feature/MM-<number>-<description>`
  - `fix/MM-<number>-<description>`
  - `refactor/MM-<number>-<description>`
- Commit message standard:
  - `feat(auth): implement refresh token rotation and session revocation`
  - `feat(mine): add pit bench elevation and stability factor tracking`
  - `fix(sensors): correct atmospheric methane PPM calculation bounds`

---

## 2. Local Development Cycle
1. Run `./scripts/setup.ps1` (or `./scripts/setup.sh`) to initialize local storage paths and dependencies.
2. Start PostgreSQL and Redis via `docker-compose up -d postgres redis`.
3. Launch Java Backend: `cd java-backend && ./mvnw spring-boot:run`.
4. Launch Python AI Service: `cd python-ai && uvicorn app.main:app --port 8000 --reload`.
5. Launch Frontend UI: `cd frontend && npm run dev`.

---

## 3. Pre-Commit Verification Checklist
- [ ] `./scripts/test-all.ps1` passes with zero failures.
- [ ] All database DDL changes have matching Flyway migrations.
- [ ] API endpoints are documented with OpenAPI annotations.
- [ ] Zero unhandled typescript errors in frontend build.
