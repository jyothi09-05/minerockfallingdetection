# Testing & Quality Assurance Suite

## Structure
- `testing/unit/`: Unit tests across microservices
- `testing/integration/`: Cross-service API and database contract tests
- `testing/e2e/`: End-to-end command-center workflows
- `testing/performance/`: High-frequency sensor ingestion benchmarks

## Running Tests
- Java Backend: `cd java-backend && ./mvnw test`
- Python AI Service: `cd python-ai && pytest`
- Frontend UI: `cd frontend && npm test`
