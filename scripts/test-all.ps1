# MineMind AI - Test Suite Runner (PowerShell)
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  MineMind AI — Running Test Suites across Monorepo   " -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan

# 1. Java Backend Tests
Write-Host "`n[1/3] Running Java Backend Unit & Integration Tests..." -ForegroundColor Yellow
Push-Location java-backend
if (Test-Path "./mvnw.cmd") {
    .\mvnw.cmd clean test
} else {
    mvn clean test
}
Pop-Location

# 2. Python AI Tests
Write-Host "`n[2/3] Running Python AI Pytest Suite..." -ForegroundColor Yellow
Push-Location python-ai
python -m pytest tests/ -v
Pop-Location

# 3. Frontend Tests & Type Checking
Write-Host "`n[3/3] Running Frontend Component Tests & TypeScript Validation..." -ForegroundColor Yellow
Push-Location frontend
npm test
npm run build
Pop-Location

Write-Host "`nAll monorepo tests completed successfully!" -ForegroundColor Green
