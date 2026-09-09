"""
FastAPI Router for Sub-Millisecond Global Search.
"""

from fastapi import APIRouter, Query
from typing import Optional
from app.services.search_service import search_service

router = APIRouter(prefix="/api/v1/search", tags=["Global Search"])


@router.get("")
async def search_mine_entities(
    q: str = Query(..., description="Search keyword or entity ID"),
    type: Optional[str] = Query(None, description="MINE, ZONE, VEHICLE, EQUIPMENT, WORKER, SENSOR, CAMERA, ALERT, INCIDENT, DOCUMENT"),
    limit: Optional[int] = Query(20, description="Max results")
):
    """
    Executes fast unified search across all digital twin entities, incidents, alerts, and SOP documents.
    """
    results = search_service.search(query=q, entity_type=type, limit=limit or 20)
    return {
        "query": q,
        "type_filter": type,
        "count": len(results),
        "results": results
    }
