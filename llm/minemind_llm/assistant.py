"""
Master Mining Intelligence Assistant for MineMind AI.
Orchestrates RAG retrieval, internal tool calling, local LLM generation, and safety guardrails.
"""

import os
from typing import Dict, Any, List, Optional
from .provider import BaseLLMProvider, DeterministicMiningLLMProvider, LocalOllamaProvider
from .memory import ConversationMemory, ConversationMessage
from .roles import AssistantRole, RolePromptManager
from .tools.router import ToolRouter
from .guardrails import GuardrailsEngine
from .reports.generator import ReportGenerator

# Import RAG subsystem
import sys
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

try:
    from rag.minemind_rag.pipeline import RAGPipeline
except ImportError:
    from minemind_rag.pipeline import RAGPipeline


class MiningAssistant:
    """
    Central Mining Intelligence Assistant.
    Provides offline multi-role conversational AI, tool execution, citations, and reporting.
    """

    def __init__(
        self,
        knowledge_base_dir: Optional[str] = None,
        provider: Optional[BaseLLMProvider] = None
    ):
        self.memory = ConversationMemory(max_turns=15)
        
        # Knowledge Base directory setup
        if knowledge_base_dir is None:
            self.kb_dir = os.path.join(BASE_DIR, "knowledge-base")
        else:
            self.kb_dir = knowledge_base_dir

        self.rag = RAGPipeline()
        if os.path.exists(self.kb_dir):
            self.rag.index_directory(self.kb_dir)

        # Provider initialization
        if provider:
            self.provider = provider
        else:
            # Auto-probe Ollama, default to Deterministic
            ollama = LocalOllamaProvider()
            if ollama.is_available():
                self.provider = ollama
            else:
                self.provider = DeterministicMiningLLMProvider()

    def chat(
        self,
        query: str,
        session_id: str = "default_session",
        role: str = "safety_officer",
        category_filter: Optional[str] = None,
        include_tools: bool = True
    ) -> Dict[str, Any]:
        """
        Executes a complete reasoning cycle:
        1. Parse role & system prompt
        2. Detect & execute internal tools for real telemetry
        3. Retrieve semantic RAG knowledge chunks with citations
        4. Generate response via local LLM
        5. Pass output through safety guardrails
        6. Store in conversation memory
        """
        try:
            assistant_role = AssistantRole(role)
        except ValueError:
            assistant_role = AssistantRole.SAFETY_OFFICER

        role_cfg = RolePromptManager.get_role_config(assistant_role)
        system_prompt = role_cfg["system_prompt"]

        # Step 1: Execute relevant internal tools
        executed_tool_calls: List[Dict[str, Any]] = []
        tool_results_data: List[Dict[str, Any]] = []

        if include_tools:
            detected_tools = ToolRouter.detect_tools_from_query(query)
            for tool_req in detected_tools:
                tool_name = tool_req["tool_name"]
                args = tool_req["args"]
                res = ToolRouter.execute_tool(tool_name, args)
                executed_tool_calls.append({
                    "name": tool_name,
                    "arguments": args,
                    "result": res
                })
                tool_results_data.append(res)

        # Step 2: Retrieve relevant RAG chunks
        search_results = self.rag.retrieve(
            query=query,
            top_k=3,
            category=category_filter,
            min_score=0.04
        )
        context_docs = self.rag.format_context_for_prompt(search_results)

        citations = [
            {
                "citation_id": f"CIT-{i+1}",
                "doc_id": r.doc_id,
                "title": r.title,
                "category": r.category,
                "relevance_score": r.score,
                "snippet": r.content[:160] + "..." if len(r.content) > 160 else r.content
            }
            for i, r in enumerate(search_results)
        ]

        # Step 3: Generate LLM response
        raw_response = self.provider.generate_response(
            prompt=query,
            system_prompt=system_prompt,
            context_docs=context_docs,
            tool_results=tool_results_data if tool_results_data else None,
            role=assistant_role.value
        )

        # Step 4: Validate with Guardrails
        grounded_response = GuardrailsEngine.ground_telemetry(raw_response, tool_results_data)

        # Step 5: Save turn in memory
        self.memory.add_message(session_id, role="user", content=query, role_type=assistant_role.value)
        self.memory.add_message(
            session_id,
            role="assistant",
            content=grounded_response,
            tool_calls=executed_tool_calls,
            citations=citations,
            role_type=assistant_role.value
        )

        return {
            "session_id": session_id,
            "role": assistant_role.value,
            "role_title": role_cfg["title"],
            "response": grounded_response,
            "tool_calls": executed_tool_calls,
            "citations": citations,
            "provider": self.provider.__class__.__name__
        }

    def generate_report(self, report_type: str, shift_name: str = "Shift Alpha (Day)") -> Dict[str, Any]:
        """Generates automated operational reports."""
        rpt_type = report_type.upper()
        if rpt_type == "SHIFT_HANDOVER":
            return ReportGenerator.generate_shift_handover_report(shift_name=shift_name)
        elif rpt_type == "SAFETY_AUDIT":
            return ReportGenerator.generate_safety_tarp_audit()
        elif rpt_type == "GEOTECH_AUDIT":
            return ReportGenerator.generate_geotech_stability_audit()
        elif rpt_type == "MAINTENANCE_FORECAST":
            return ReportGenerator.generate_maintenance_forecast()
        else:
            return ReportGenerator.generate_shift_handover_report(shift_name=shift_name)
