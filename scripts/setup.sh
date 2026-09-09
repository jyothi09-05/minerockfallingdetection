#!/usr/bin/env bash
set -e

echo "======================================================"
echo "  MineMind AI — Initializing Workspace & Environment  "
echo "======================================================"

if [ ! -f .env ]; then
    echo "[1/4] Copying .env.example -> .env..."
    cp .env.example .env
fi

echo "[2/4] Creating local storage directories..."
mkdir -p data/storage data/telemetry data/models data/backups

echo "[3/4] Installing Frontend dependencies..."
if [ -f frontend/package.json ]; then
    (cd frontend && npm install)
fi

echo "[4/4] Setting up Python AI virtual environment..."
if [ -f python-ai/requirements.txt ]; then
    python3 -m venv python-ai/venv || true
fi

echo "Setup complete! Start MineMind AI using 'docker-compose up -d'."
