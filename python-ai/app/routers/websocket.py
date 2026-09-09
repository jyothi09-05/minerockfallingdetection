"""
FastAPI WebSocket Router for Real-Time Event & Telemetry Streaming.
"""

import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from app.core.events import event_broker

router = APIRouter(tags=["Real-Time WebSockets"])


@router.websocket("/ws/events")
async def websocket_events_endpoint(websocket: WebSocket, topic: str = Query("*")):
    """
    Subscribes to live system event stream (telemetry, predictions, alerts, incidents).
    """
    await websocket.accept()
    queue = asyncio.Queue()
    event_broker.register_async_queue(topic, queue)

    try:
        # Send initial connection acknowledgment
        await websocket.send_json({
            "type": "CONNECTION_ESTABLISHED",
            "topic": topic,
            "status": "ONLINE"
        })

        # Send recent events backlog
        recent = event_broker.get_recent_events(topic=topic, limit=10)
        for evt in recent:
            await websocket.send_json(evt)

        while True:
            # Wait for event from broker or client keepalive ping
            try:
                # Poll queue with 1s timeout to check websocket connection health
                event = await asyncio.wait_for(queue.get(), timeout=1.0)
                await websocket.send_json(event)
            except asyncio.TimeoutError:
                # Timeout is normal, keeps the event loop alive
                pass

    except WebSocketDisconnect:
        pass
    finally:
        event_broker.unregister_async_queue(topic, queue)


@router.websocket("/ws/telemetry")
async def websocket_telemetry_endpoint(websocket: WebSocket):
    """
    Subscribes specifically to high-frequency telemetry updates.
    """
    await websocket.accept()
    queue = asyncio.Queue()
    event_broker.register_async_queue("telemetry.update", queue)

    try:
        await websocket.send_json({
            "type": "TELEMETRY_STREAM_CONNECTED",
            "status": "STREAMING"
        })

        while True:
            try:
                event = await asyncio.wait_for(queue.get(), timeout=1.0)
                await websocket.send_json(event)
            except asyncio.TimeoutError:
                pass
    except WebSocketDisconnect:
        pass
    finally:
        event_broker.unregister_async_queue("telemetry.update", queue)
