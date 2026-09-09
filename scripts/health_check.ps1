# MineMind AI - Health Check Script
Write-Host "=== MineMind AI Subsystem Health Diagnostic ===" -ForegroundColor Cyan

$services = @(
    @{ Name = "Python AI Engine"; Url = "http://localhost:8000/api/v1/health" },
    @{ Name = "Prometheus Metrics"; Url = "http://localhost:8000/metrics" },
    @{ Name = "Knowledge Base Status"; Url = "http://localhost:8000/api/v1/assistant/knowledge-base" },
    @{ Name = "Analytics Overview"; Url = "http://localhost:8000/api/v1/analytics/overview" },
    @{ Name = "Incidents API"; Url = "http://localhost:8000/api/v1/incidents" }
)

foreach ($srv in $services) {
    try {
        $resp = Invoke-RestMethod -Uri $srv.Url -Method Get -TimeoutSec 2 -ErrorAction Stop
        Write-Host "[$($srv.Name)]: HEALTHY (200 OK)" -ForegroundColor Green
    } catch {
        Write-Host "[$($srv.Name)]: OFFLINE or UNREACHABLE" -ForegroundColor Yellow
    }
}
