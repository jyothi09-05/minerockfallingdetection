import { describe, it, expect } from 'vitest';
import { aiService } from '../services/aiService';

describe('MineMind AI Intelligence Platform Frontend Services', () => {
  it('fetches global mine risk composite and validated zone breakdowns', async () => {
    const risk = await aiService.getGlobalRisk();

    expect(risk).toBeDefined();
    expect(risk.overall_mine_risk_score).toBeGreaterThanOrEqual(0.0);
    expect(risk.overall_mine_risk_score).toBeLessThanOrEqual(1.0);
    expect(risk.rockfall_risk).toBeDefined();
    expect(risk.collision_risk).toBeDefined();
    expect(risk.equipment_risk).toBeDefined();
    expect(risk.worker_safety_risk).toBeDefined();
    expect(risk.environmental_risk).toBeDefined();
    expect(risk.zone_breakdown.length).toBeGreaterThanOrEqual(4);
  });

  it('retrieves and transitions smart alerts', async () => {
    const alerts = await aiService.getSmartAlerts();

    expect(alerts.length).toBeGreaterThan(0);
    const firstAlert = alerts[0];
    expect(firstAlert.id).toBeDefined();
    expect(firstAlert.severity).toBeDefined();

    // Acknowledge & resolve without throwing
    await expect(aiService.acknowledgeAlert(firstAlert.id)).resolves.not.toThrow();
    await expect(aiService.resolveAlert(firstAlert.id)).resolves.not.toThrow();
  });

  it('processes local computer vision frames with bounding boxes', async () => {
    const frame = await aiService.analyzeCameraFrame('CAM-PIT-01', true, false);

    expect(frame).toBeDefined();
    expect(frame.camera_id).toBe('CAM-PIT-01');
    expect(frame.detections.length).toBeGreaterThan(0);
    expect(frame.hazard_detected).toBe(true);
    expect(frame.ppe_compliance_rate_pct).toBeLessThan(100.0);
  });

  it('lists registered AI models and accuracy metrics', async () => {
    const models = await aiService.getModelRegistry();

    expect(models.length).toBe(6);
    const rockfall = models.find((m) => m.category === 'rockfall');
    expect(rockfall).toBeDefined();
    expect(rockfall?.metrics.accuracy).toBeGreaterThan(0.9);
    expect(rockfall?.is_trained).toBe(true);
  });
});
