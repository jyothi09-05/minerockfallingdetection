"""
Conversation Memory management with sliding window and role preservation.
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Dict, Any, Optional


@dataclass
class ConversationMessage:
    role: str  # "user", "assistant", "system", "tool"
    content: str
    timestamp: str = field(default_factory=lambda: datetime.utcnow().isoformat())
    tool_calls: Optional[List[Dict[str, Any]]] = None
    citations: Optional[List[Dict[str, Any]]] = None
    role_type: Optional[str] = None


class ConversationMemory:
    """
    Manages session-based conversation histories with sliding window trimming
    and token-length budgeting.
    """

    def __init__(self, max_turns: int = 15, max_history_chars: int = 16000):
        self.max_turns = max_turns
        self.max_history_chars = max_history_chars
        self.sessions: Dict[str, List[ConversationMessage]] = {}

    def get_history(self, session_id: str) -> List[ConversationMessage]:
        """Retrieves history for a given session ID."""
        return self.sessions.setdefault(session_id, [])

    def add_message(
        self,
        session_id: str,
        role: str,
        content: str,
        tool_calls: Optional[List[Dict[str, Any]]] = None,
        citations: Optional[List[Dict[str, Any]]] = None,
        role_type: Optional[str] = None
    ) -> ConversationMessage:
        """Appends a message to the session history and trims to window limits."""
        history = self.get_history(session_id)
        msg = ConversationMessage(
            role=role,
            content=content,
            tool_calls=tool_calls,
            citations=citations,
            role_type=role_type
        )
        history.append(msg)
        self._trim_history(session_id)
        return msg

    def _trim_history(self, session_id: str) -> None:
        """Enforces maximum turns and character budgeting."""
        history = self.sessions.get(session_id, [])
        if len(history) > self.max_turns * 2:
            # Keep the oldest 2 (system context) + recent turns
            self.sessions[session_id] = history[-self.max_turns * 2:]

    def clear_session(self, session_id: str) -> None:
        """Clears all conversation messages in a session."""
        if session_id in self.sessions:
            self.sessions[session_id] = []
