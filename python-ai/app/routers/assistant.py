"""
FastAPI Router for MineMind Local AI Assistant & RAG Services.
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
import os
import sys

# Ensure minemind_llm and minemind_rag are discoverable
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ROOT_DIR = os.path.dirname(BASE_DIR)
for path in [ROOT_DIR, os.path.join(ROOT_DIR, "llm"), os.path.join(ROOT_DIR, "rag")]:
    if path not in sys.path:
        sys.path.insert(0, path)

from minemind_llm.assistant import MiningAssistant
from minemind_llm.roles import RolePromptManager, AssistantRole
from minemind_llm.tools.internal_tools import InternalMiningTools

router = APIRouter(prefix="/api/v1/assistant", tags=["Mining Intelligence Assistant & RAG"])

# Global assistant singleton instance
kb_dir = os.path.join(ROOT_DIR, "knowledge-base")
assistant_instance = MiningAssistant(knowledge_base_dir=kb_dir)


class ChatRequest(BaseModel):
    query: str = Field(..., description="User query / prompt")
    session_id: Optional[str] = Field("default_session", description="Conversation session ID")
    role: Optional[str] = Field("safety_officer", description="Assistant role persona")
    category_filter: Optional[str] = Field(None, description="Optional RAG category filter")
    include_tools: Optional[bool] = Field(True, description="Whether to execute internal telemetry tools")


class ReportRequest(BaseModel):
    report_type: str = Field("SHIFT_HANDOVER", description="SHIFT_HANDOVER, SAFETY_AUDIT, GEOTECH_AUDIT, MAINTENANCE_FORECAST")
    shift_name: Optional[str] = Field("Shift Alpha (Day)", description="Shift identifier")


@router.post("/chat")
async def chat_with_assistant(req: ChatRequest):
    """
    Sends a query to the Local Mining Intelligence Assistant with tool execution and RAG retrieval.
    """
    try:
        res = assistant_instance.chat(
            query=req.query,
            session_id=req.session_id or "default_session",
            role=req.role or "safety_officer",
            category_filter=req.category_filter,
            include_tools=req.include_tools if req.include_tools is not None else True
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Assistant chat failure: {str(e)}")


@router.post("/report")
async def generate_mining_report(req: ReportRequest):
    """
    Generates an automated operational or safety report grounded in live telemetry.
    """
    try:
        report = assistant_instance.generate_report(
            report_type=req.report_type,
            shift_name=req.shift_name or "Shift Alpha (Day)"
        )
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Report generation error: {str(e)}")


@router.get("/roles")
async def get_assistant_roles():
    """Returns available assistant roles and suggested starter questions."""
    return {
        "roles": RolePromptManager.get_all_roles()
    }


@router.get("/tools")
async def get_registered_tools():
    """Returns schemas of all internal telemetry and calculation tools."""
    return {
        "tools": InternalMiningTools.get_registered_tools()
    }


@router.get("/knowledge-base")
async def get_knowledge_base_status():
    """Returns indexing summary and document count for local RAG."""
    return {
        "is_indexed": assistant_instance.rag.is_indexed,
        "total_chunks": assistant_instance.rag.vector_store.count(),
        "categories": assistant_instance.rag.vector_store.get_categories(),
        "storage_mode": "Pure Local In-Memory Vector Store",
        "embedding_dimensions": assistant_instance.rag.embedding_model.dimension
    }


@router.get("/history/{session_id}")
async def get_conversation_history(session_id: str):
    """Retrieves conversation turns for a given session."""
    history = assistant_instance.memory.get_history(session_id)
    return {
        "session_id": session_id,
        "turn_count": len(history),
        "messages": [
            {
                "role": m.role,
                "content": m.content,
                "timestamp": m.timestamp,
                "tool_calls": m.tool_calls,
                "citations": m.citations,
                "role_type": m.role_type
            }
            for m in history
        ]
    }


@router.delete("/history/{session_id}")
async def clear_session_history(session_id: str):
    """Clears history for a session."""
    assistant_instance.memory.clear_session(session_id)
    return {"message": f"Session '{session_id}' history cleared successfully."}
