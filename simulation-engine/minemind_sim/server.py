"""
MineMind Simulation HTTP & WebSocket Real-Time Server
Exposes Digital Twin REST APIs and WebSocket stream for simulation control and live telemetry.
"""
import asyncio
from typing import Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from minemind_sim.core.simulation import MineMindSimulationMaster
from minemind_sim.models import (
    SimulationStateSnapshot,
    SimulationScenario,
    TerrainMetadata
)

app = FastAPI(
    title="MineMind Digital Twin & Simulation API",
    version="1.0.0",
    description="High-frequency local physics, vehicle kinematics, and environmental simulation engine."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global simulation instance
sim_engine = MineMindSimulationMaster(seed=42)


class SimulationControlBody(BaseModel):
    action: Optional[str] = None  # PLAY, PAUSE, STEP, RESET
    speed_multiplier: Optional[float] = None
    scenario: Optional[SimulationScenario] = None
    seed: Optional[int] = None


@app.get("/health")
def health():
    return {"status": "UP", "service": "simulation-engine", "seed": sim_engine.seed}


@app.get("/api/v1/simulation/terrain", response_model=TerrainMetadata)
def get_terrain():
    return sim_engine.terrain_metadata


@app.get("/api/v1/simulation/state", response_model=SimulationStateSnapshot)
def get_state():
    return sim_engine.get_snapshot()


@app.post("/api/v1/simulation/control", response_model=SimulationStateSnapshot)
def control_simulation(body: SimulationControlBody):
    if body.action == "PLAY":
        sim_engine.is_running = True
    elif body.action == "PAUSE":
        sim_engine.is_running = False
    elif body.action == "STEP":
        sim_engine.tick(base_dt_sec=0.5)
    elif body.action == "RESET":
        sim_engine.reset(new_seed=body.seed)

    if body.speed_multiplier is not None:
        sim_engine.set_speed_multiplier(body.speed_multiplier)

    if body.scenario is not None:
        sim_engine.set_scenario(body.scenario)

    return sim_engine.get_snapshot()


@app.websocket("/ws/simulation")
async def websocket_simulation_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            snapshot = sim_engine.tick(base_dt_sec=0.5)
            await websocket.send_text(snapshot.model_dump_json())
            # 2 Hz broadcast loop
            await asyncio.sleep(0.5 / sim_engine.speed_multiplier)
    except WebSocketDisconnect:
        pass
    except Exception:
        await websocket.close()
