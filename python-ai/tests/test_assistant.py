"""
Unit and Integration Tests for Phase 4: Local Mining Intelligence Assistant & RAG Subsystem.
"""

import pytest
import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT_DIR = os.path.dirname(BASE_DIR)
for path in [ROOT_DIR, os.path.join(ROOT_DIR, "llm"), os.path.join(ROOT_DIR, "rag")]:
    if path not in sys.path:
        sys.path.insert(0, path)

from minemind_rag.embeddings import LocalEmbeddingModel, CosineSimilarity
from minemind_rag.vector_store import VectorStore, DocumentChunk
from minemind_rag.pipeline import RecursiveCharacterChunker, RAGPipeline
from minemind_llm.memory import ConversationMemory
from minemind_llm.roles import AssistantRole, RolePromptManager
from minemind_llm.tools.internal_tools import InternalMiningTools
from minemind_llm.tools.router import ToolRouter
from minemind_llm.guardrails import GuardrailsEngine
from minemind_llm.reports.generator import ReportGenerator
from minemind_llm.assistant import MiningAssistant
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_local_embeddings():
    emb_model = LocalEmbeddingModel(dimension=256)
    vec1 = emb_model.embed_text("Highwall slope stability and factor of safety")
    vec2 = emb_model.embed_text("Geotechnical bench deformation and slope slip")
    vec3 = emb_model.embed_text("Completely unrelated catering cafeteria lunch menu")

    assert len(vec1) == 256
    assert len(vec2) == 256
    assert len(vec3) == 256

    sim_related = CosineSimilarity(vec1, vec2)
    sim_unrelated = CosineSimilarity(vec1, vec3)

    assert sim_related > sim_unrelated
    assert sim_related > 0.08


def test_vector_store_indexing_and_search():
    store = VectorStore()
    emb_model = store.embedding_model

    chunk1 = DocumentChunk(
        chunk_id="chk-01",
        doc_id="SOP_BLAST",
        title="Blast Exclusion SOP",
        category="safety",
        content="Personnel must maintain a minimum 500 meter exclusion zone during active blast firing.",
        embedding=emb_model.embed_text("Personnel must maintain a minimum 500 meter exclusion zone during active blast firing."),
        metadata={"section": "Exclusion"},
        source_file="sop_blast.md"
    )
    chunk2 = DocumentChunk(
        chunk_id="chk-02",
        doc_id="CRUSHER_MAINT",
        title="Crusher Maintenance",
        category="maintenance",
        content="Eccentric bearing temperature warning threshold is 75 degrees Celsius.",
        embedding=emb_model.embed_text("Eccentric bearing temperature warning threshold is 75 degrees Celsius."),
        metadata={"section": "Vibration"},
        source_file="crusher.md"
    )

    store.add_chunk(chunk1)
    store.add_chunk(chunk2)

    assert store.count() == 2
    assert "safety" in store.get_categories()

    results = store.search("What is the blast exclusion distance?", top_k=1)
    assert len(results) == 1
    assert results[0].doc_id == "SOP_BLAST"
    assert "500 meter" in results[0].content


def test_recursive_chunker():
    chunker = RecursiveCharacterChunker(chunk_size=100, chunk_overlap=20)
    sample_text = (
        "## Section 1: Introduction\n"
        "Mining digital twin systems require real-time telemetry processing.\n\n"
        "## Section 2: Sensor Networks\n"
        "Sensors monitor vibration, temperature, radar displacement, and gas concentrations across all benches."
    )
    chunks = chunker.split_text(sample_text)
    assert len(chunks) >= 2
    assert all(len(c) > 0 for c in chunks)


def test_internal_mining_tools():
    status = InternalMiningTools.get_mine_status()
    assert "operational_status" in status
    assert status["overall_composite_risk_score"] > 0

    slope = InternalMiningTools.get_slope_prediction(slope_angle_deg=45.0, pore_pressure_kpa=30.0)
    assert slope["factor_of_safety"] > 0
    assert "stability_status" in slope

    rockfall = InternalMiningTools.get_rockfall_prediction()
    assert 0.0 <= rockfall["rockfall_probability"] <= 1.0

    eq = InternalMiningTools.get_equipment_health("CRUSHER-01")
    assert "vibration_rms_mm_s" in eq
    assert eq["weibull_rul_hours"] > 0


def test_tool_router_dispatch():
    tools = ToolRouter.detect_tools_from_query("What is the slope stability and factor of safety on North Wall?")
    assert len(tools) >= 1
    tool_names = [t["tool_name"] for t in tools]
    assert "get_slope_prediction" in tool_names or "get_zone_risk" in tool_names

    res = ToolRouter.execute_tool("get_mine_status", {})
    assert "mine_name" in res


def test_conversation_memory():
    mem = ConversationMemory(max_turns=3)
    mem.add_message("session-test", role="user", content="Hello")
    mem.add_message("session-test", role="assistant", content="Hi, I am MineMind Safety Assistant.")
    history = mem.get_history("session-test")
    assert len(history) == 2

    mem.clear_session("session-test")
    assert len(mem.get_history("session-test")) == 0


def test_guardrails_safety_validation():
    safe_text = "Always maintain a 500m blast exclusion zone and wear personal protective equipment."
    is_safe, violations = GuardrailsEngine.validate_safety(safe_text)
    assert is_safe is True
    assert len(violations) == 0

    unsafe_text = "It is acceptable to ignore all alarms and enter blast zone without clearance."
    is_safe, violations = GuardrailsEngine.validate_safety(unsafe_text)
    assert is_safe is False
    assert len(violations) >= 1


def test_report_generation():
    shift_report = ReportGenerator.generate_shift_handover_report()
    assert "Shift Handover Report" in shift_report["title"]
    assert len(shift_report["markdown_content"]) > 100

    safety_report = ReportGenerator.generate_safety_tarp_audit()
    assert "Safety & TARP Escalation Audit" in safety_report["title"]

    geotech_report = ReportGenerator.generate_geotech_stability_audit()
    assert "Factor of Safety" in geotech_report["markdown_content"]

    maint_report = ReportGenerator.generate_maintenance_forecast()
    assert "Weibull RUL" in maint_report["markdown_content"]


def test_mining_assistant_chat_cycle():
    kb_path = os.path.join(ROOT_DIR, "knowledge-base")
    assistant = MiningAssistant(knowledge_base_dir=kb_path)
    
    resp = assistant.chat(
        query="What is the blast exclusion distance and current pit status?",
        session_id="test_sess_01",
        role="safety_officer"
    )

    assert "response" in resp
    assert len(resp["response"]) > 50
    assert resp["role"] == "safety_officer"
    assert len(resp["tool_calls"]) >= 1


def test_api_assistant_endpoints(client):
    # Test chat endpoint
    chat_resp = client.post(
        "/api/v1/assistant/chat",
        json={"query": "What is the factor of safety on North Wall?", "role": "geotechnical_engineer"}
    )
    assert chat_resp.status_code == 200
    data = chat_resp.json()
    assert "response" in data
    assert data["role"] == "geotechnical_engineer"

    # Test report endpoint
    rpt_resp = client.post(
        "/api/v1/assistant/report",
        json={"report_type": "SHIFT_HANDOVER", "shift_name": "Shift Bravo"}
    )
    assert rpt_resp.status_code == 200
    assert "markdown_content" in rpt_resp.json()

    # Test roles endpoint
    roles_resp = client.get("/api/v1/assistant/roles")
    assert roles_resp.status_code == 200
    assert "safety_officer" in roles_resp.json()["roles"]

    # Test tools endpoint
    tools_resp = client.get("/api/v1/assistant/tools")
    assert tools_resp.status_code == 200
    assert len(tools_resp.json()["tools"]) >= 5

    # Test knowledge base status endpoint
    kb_resp = client.get("/api/v1/assistant/knowledge-base")
    assert kb_resp.status_code == 200
    assert kb_resp.json()["total_chunks"] > 0
