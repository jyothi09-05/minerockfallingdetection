"""
Prometheus Metrics Exporter for MineMind AI Observability.
"""

from fastapi import APIRouter, Response
from datetime import datetime

router = APIRouter(tags=["Observability & Metrics"])


@router.get("/metrics")
async def get_prometheus_metrics():
    """
    Exposes Prometheus-formatted metrics for local monitoring scrapers.
    """
    now_ts = int(datetime.now().timestamp())
    metrics_text = f"""# HELP minemind_composite_risk Overall composite risk index (0.0 - 1.0)
# TYPE minemind_composite_risk gauge
minemind_composite_risk 0.28

# HELP minemind_active_vehicles Count of operational mobile equipment
# TYPE minemind_active_vehicles gauge
minemind_active_vehicles 8

# HELP minemind_workers_on_shift Count of tracked personnel
# TYPE minemind_workers_on_shift gauge
minemind_workers_on_shift 42

# HELP minemind_rockfall_probability Rockfall prediction probability
# TYPE minemind_rockfall_probability gauge
minemind_rockfall_probability{{zone="north_wall"}} 0.22

# HELP minemind_slope_factor_of_safety Factor of Safety for slope stability
# TYPE minemind_slope_factor_of_safety gauge
minemind_slope_factor_of_safety{{zone="north_wall"}} 1.24

# HELP minemind_ai_inferences_total Total ML inferences served
# TYPE minemind_ai_inferences_total counter
minemind_ai_inferences_total 148200

# HELP minemind_active_alerts Active warning and critical alerts
# TYPE minemind_active_alerts gauge
minemind_active_alerts{{severity="warning"}} 1
minemind_active_alerts{{severity="critical"}} 0

# HELP minemind_http_requests_total Total HTTP requests handled
# TYPE minemind_http_requests_total counter
minemind_http_requests_total{{status="200"}} 85420
minemind_http_requests_total{{status="400"}} 120
minemind_http_requests_total{{status="500"}} 4
"""
    return Response(content=metrics_text, media_type="text/plain; version=0.0.4")
