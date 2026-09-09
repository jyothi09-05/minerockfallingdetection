# MineMind AI - Environment Setup Script (Windows PowerShell)
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  MineMind AI — Initializing Workspace & Environment  " -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan

# 1. Ensure .env exists
if (-not (Test-Path -Path ".env")) {
    Write-Host "[1/4] Copying .env.example -> .env..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
} else {
    Write-Host "[1/4] .env already exists." -ForegroundColor Green
}

# 2. Create local storage directories
Write-Host "[2/4] Creating local storage directories..." -ForegroundColor Yellow
$dirs = @(
    "data/storage",
    "data/telemetry",
    "data/models",
    "data/backups"
)
foreach ($dir in $dirs) {
    if (-not (Test-Path -Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "  Created $dir" -ForegroundColor Gray
    }
}

# 3. Frontend dependency installation check
Write-Host "[3/4] Installing Frontend dependencies (npm install)..." -ForegroundColor Yellow
if (Test-Path "frontend/package.json") {
    Push-Location frontend
    npm install --silent
    Pop-Location
    Write-Host "  Frontend dependencies installed." -ForegroundColor Green
}

# 4. Python AI dependency setup
Write-Host "[4/4] Setting up Python AI virtual environment..." -ForegroundColor Yellow
if (Test-Path "python-ai/requirements.txt") {
    if (-not (Test-Path "python-ai/venv")) {
        python -m venv python-ai/venv
    }
    Write-Host "  Python venv prepared." -ForegroundColor Green
}

Write-Host "`nSetup complete! You can now start MineMind AI using 'docker-compose up -d' or run services locally." -ForegroundColor Green
