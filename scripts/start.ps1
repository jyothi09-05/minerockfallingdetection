# MineMind AI - Service Launcher
Write-Host "=== Starting MineMind AI Platform (Local Offline Mode) ===" -ForegroundColor Cyan

Write-Host "`n[1] Starting Python AI & Event Engine on http://localhost:8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd python-ai; uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

Write-Host "`n[2] Starting React 18 Frontend on http://localhost:3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "`n=== Services Launched! Open http://localhost:3000 in your browser ===" -ForegroundColor Green
