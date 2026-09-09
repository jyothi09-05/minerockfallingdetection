"""
MineMind AI - Internal Asynchronous Event Broker.
Supports local in-memory event distribution and pub/sub for digital twin telemetry,
anomalies, ML predictions, smart alerts, and incident transitions.
"""

import asyncio
import json
from datetime import datetime
from typing import Dict, List, Set, Any, Optional, Callable
from collections import defaultdict


class EventType:
    TELEMETRY_UPDATE = "telemetry.update"
    PREDICTION_GENERATED = "prediction.generated"
    RISK_EVALUATED = "risk.evaluated"
    ALERT_CREATED = "alert.created"
    ALERT_ACKNOWLEDGED = "alert.acknowledged"
    INCIDENT_CREATED = "incident.created"
    INCIDENT_UPDATED = "incident.updated"
    EMERGENCY_TRIGGERED = "emergency.triggered"
    SIMULATION_TICK = "simulation.tick"
    SYSTEM_LOG = "system.log"


class EventBroker:
    """
    High-performance in-memory pub/sub event broker with subscription topics,
    historical buffer, and WebSocket client dispatch.
    """

    def __init__(self, history_limit: int = 100):
        self.subscribers: Dict[str, Set[Callable[[Dict[str, Any]], None]]] = defaultdict(set)
        self.async_subscribers: Dict[str, Set[Any]] = defaultdict(set)
        self.history_limit = history_limit
        self.event_history: List[Dict[str, Any]] = []
        try:
            self._lock = asyncio.Lock() if asyncio.get_running_loop() else None
        except RuntimeError:
            self._lock = None

    def subscribe(self, topic: str, callback: Callable[[Dict[str, Any]], None]) -> None:
        """Registers a synchronous listener for a topic or wildcard '*'."""
        self.subscribers[topic].add(callback)

    def unsubscribe(self, topic: str, callback: Callable[[Dict[str, Any]], None]) -> None:
        """Removes a registered listener."""
        if callback in self.subscribers[topic]:
            self.subscribers[topic].remove(callback)

    def register_async_queue(self, topic: str, queue: asyncio.Queue) -> None:
        """Registers an asyncio Queue for WebSocket client streaming."""
        self.async_subscribers[topic].add(queue)

    def unregister_async_queue(self, topic: str, queue: asyncio.Queue) -> None:
        """Unregisters an asyncio Queue."""
        if queue in self.async_subscribers[topic]:
            self.async_subscribers[topic].remove(queue)

    async def publish(self, topic: str, payload: Dict[str, Any], source: str = "core_engine") -> Dict[str, Any]:
        """Publishes an event to all matching topic subscribers and active WebSockets."""
        event = {
            "id": f"evt-{int(datetime.now().timestamp() * 1000)}",
            "topic": topic,
            "timestamp": datetime.now().isoformat(),
            "source": source,
            "data": payload
        }

        # Store in event history ring buffer
        self.event_history.append(event)
        if len(self.event_history) > self.history_limit:
            self.event_history.pop(0)

        # Dispatch to synchronous listeners
        listeners = set(self.subscribers.get(topic, set())) | set(self.subscribers.get("*", set()))
        for listener in listeners:
            try:
                listener(event)
            except Exception as e:
                print(f"[EventBroker Error] Sync callback error on '{topic}': {e}")

        # Dispatch to async queues (WebSockets)
        matching_queues = set(self.async_subscribers.get(topic, set())) | set(self.async_subscribers.get("*", set()))
        for q in matching_queues:
            try:
                await q.put(event)
            except Exception as e:
                print(f"[EventBroker Error] Async queue put error on '{topic}': {e}")

        return event

    def get_recent_events(self, topic: Optional[str] = None, limit: int = 50) -> List[Dict[str, Any]]:
        """Retrieves recently published events filtered by topic."""
        if not topic or topic == "*":
            return self.event_history[-limit:]
        return [e for e in self.event_history if e["topic"] == topic][-limit:]


# Global Event Broker Singleton
event_broker = EventBroker()
