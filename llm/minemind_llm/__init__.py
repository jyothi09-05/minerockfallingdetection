"""
MineMind LLM - Local AI Intelligence Assistant Subsystem.
Zero external APIs. Local inference, internal agent tools, domain roles, and automated reporting.
"""

from .provider import BaseLLMProvider, DeterministicMiningLLMProvider, LocalOllamaProvider, LlamaCppProvider
from .memory import ConversationMemory, ConversationMessage
from .roles import AssistantRole, RolePromptManager
from .assistant import MiningAssistant

__all__ = [
    "BaseLLMProvider",
    "DeterministicMiningLLMProvider",
    "LocalOllamaProvider",
    "LlamaCppProvider",
    "ConversationMemory",
    "ConversationMessage",
    "AssistantRole",
    "RolePromptManager",
    "MiningAssistant",
]
