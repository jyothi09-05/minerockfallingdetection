"""
FastAPI Router for Report Generation & Multi-Format Exports.
"""

from fastapi import APIRouter, Response, Query, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from app.services.reporting_service import reporting_service

router = APIRouter(prefix="/api/v1/reports", tags=["Reporting Engine"])


class ExportReportRequest(BaseModel):
    report_type: str = Field(..., description="DAILY_MINE, SHIFT_REPORT, WEEKLY_SAFETY, EQUIPMENT_HEALTH, ROCKFALL_RISK, ENVIRONMENTAL, INCIDENT_AUDIT, AI_PREDICTION")
    format: str = Field("json", description="json, html, csv, text")
    mine_name: Optional[str] = Field("MineMind Pit #1", description="Mine name identifier")


@router.get("/catalog")
async def get_report_catalog():
    """Lists available report types."""
    return {"reports": reporting_service.list_report_types()}


@router.post("/export")
async def export_report(req: ExportReportRequest):
    """Generates and exports report in requested format (JSON, HTML, CSV, Text)."""
    data = reporting_service.generate_report_data(req.report_type, mine_name=req.mine_name or "MineMind Pit #1")
    fmt = req.format.lower()

    if fmt == "html":
        html_content = reporting_service.export_html(data)
        return Response(content=html_content, media_type="text/html")
    elif fmt == "csv":
        csv_content = reporting_service.export_csv(data)
        return Response(content=csv_content, media_type="text/csv", headers={"Content-Disposition": f"attachment; filename={req.report_type.lower()}.csv"})
    elif fmt == "text":
        txt = f"=== {data['title']} ===\nReport ID: {data['report_id']}\nGenerated: {data['generated_at']}\nTARP Level: {data['tarp_level']}\n\n"
        for sec in data.get("sections", []):
            txt += f"[{sec['heading']}]\n"
            for k, v in sec.get("metrics", {}).items():
                txt += f"  - {k}: {v}\n"
            txt += "\n"
        return Response(content=txt, media_type="text/plain")
    else:
        return data
