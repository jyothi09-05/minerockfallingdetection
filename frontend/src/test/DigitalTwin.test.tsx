import { describe, it, expect } from 'vitest';
import { ClientSimulationEngine } from '../services/simulationEngine';

describe('MineMind Digital Twin & Client Simulation Engine', () => {
  it('generates deterministic terrain from a seed with benches and waypoints', () => {
    const engine1 = new ClientSimulationEngine(1337);
    const engine2 = new ClientSimulationEngine(1337);

    expect(engine1.terrain.seed).toBe(1337);
    expect(engine1.terrain.benchCount).toBe(6);
    expect(engine1.terrain.benches.length).toBe(6);
    expect(engine1.terrain.benches).toEqual(engine2.terrain.benches);
    expect(engine1.terrain.waypoints.length).toBeGreaterThan(0);
    expect(engine1.terrain.roads.length).toBeGreaterThan(0);
  });

  it('advances vehicle kinematics and updates simulation ticks', () => {
    const engine = new ClientSimulationEngine(42);
    const initialSnap = engine.getSnapshot();

    expect(initialSnap.tickIndex).toBe(0);
    expect(initialSnap.simulationTimeSec).toBe(0);
    expect(initialSnap.vehicles.length).toBeGreaterThan(0);

    const vehicle = initialSnap.vehicles[0];
    const initialFuel = vehicle.fuelLevelPercent;

    // Tick forward
    for (let i = 0; i < 10; i++) {
      engine.tick(0.5);
    }

    const nextSnap = engine.getSnapshot();
    expect(nextSnap.tickIndex).toBe(10);
    expect(nextSnap.simulationTimeSec).toBe(5.0);
    expect(nextSnap.vehicles[0].fuelLevelPercent).toBeLessThanOrEqual(initialFuel);
  });

  it('handles scenario transitions and updates sensor anomaly alerts', () => {
    const engine = new ClientSimulationEngine(42);
    
    // Normal state
    const normalSnap = engine.getSnapshot();
    expect(normalSnap.scenario).toBe('NORMAL_OPERATIONS');
    expect(normalSnap.overallMineSafetyScore).toBe(1.0);

    // Trigger methane gas breach
    engine.setScenario('METHANE_GAS_BREACH');
    for (let i = 0; i < 15; i++) {
      engine.tick(1.0);
    }

    const breachSnap = engine.getSnapshot();
    const methaneSensor = breachSnap.sensors.find((s) => s.type === 'GAS_METHANE');
    expect(methaneSensor).toBeDefined();
    expect(methaneSensor?.status).toBe('CRITICAL');
    expect(breachSnap.overallMineSafetyScore).toBeLessThan(1.0);
  });

  it('resets state correctly with new seeds', () => {
    const engine = new ClientSimulationEngine(42);
    engine.tick(5.0);
    expect(engine.getSnapshot().tickIndex).toBe(1);

    engine.reset(999);
    const resetSnap = engine.getSnapshot();
    expect(resetSnap.tickIndex).toBe(0);
    expect(resetSnap.simulationTimeSec).toBe(0);
    expect(resetSnap.terrainSeed).toBe(999);
  });
});
