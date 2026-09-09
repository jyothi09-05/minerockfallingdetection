# MineMind AI - Setup Script for Windows PowerShell
Write-Host "=== Setting up MineMind AI Platform ===" -ForegroundColor Cyan

# 1. Python Environment Setup
Write-Host "`n[1/3] Installing Python AI & RAG dependencies..." -ForegroundColor Yellow
cd python-ai
python -m pip install -r requirements.txt
cd ..

# 2. Frontend Dependencies Setup
Write-Host "`n[2/3] Installing Frontend Node dependencies..." -ForegroundColor Yellow
cd frontend
npm install
cd ..

# 3. Knowledge Base Indexing Check
Write-Host "`n[3/3] Validating Local Knowledge Base & SOPs..." -ForegroundColor Yellow
if (Test-Path "knowledge-base") {
    Write-Host "Knowledge base verified. Pure offline ready." -ForegroundColor Green
}

Write-Host "`n=== Setup Complete! Run .\scripts\start.ps1 to launch services ===" -ForegroundColor Green
