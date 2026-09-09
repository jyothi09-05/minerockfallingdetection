# MineMind AI - Test Suite Runner
Write-Host "=== Running Complete MineMind AI Verification Suite ===" -ForegroundColor Cyan

# 1. Run Python AI, RAG, and Integration Tests
Write-Host "`n[1/2] Running Python Pytest Suite..." -ForegroundColor Yellow
cd python-ai
python -m pytest
if ($LASTEXITCODE -ne 0) {
    Write-Host "Python tests failed!" -ForegroundColor Red
    exit 1
}
cd ..
Write-Host "Python test suite PASSED!" -ForegroundColor Green

# 2. Run Frontend Vitest Suite
Write-Host "`n[2/2] Running Frontend Vitest Suite..." -ForegroundColor Yellow
cd frontend
npm test -- --run
if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend tests failed!" -ForegroundColor Red
    exit 1
}
cd ..
Write-Host "Frontend test suite PASSED!" -ForegroundColor Green

Write-Host "`n=== 100% OF TESTS PASSED ACROSS ALL SUBSYSTEMS ===" -ForegroundColor Green
