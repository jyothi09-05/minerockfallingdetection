import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cctvService } from '../services/cctvService';

describe('MineMind CCTV Intelligence & Surveillance Subsystem', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('retrieves registered mine cameras and health metadata', async () => {
    const cameras = await cctvService.getCameras();
    expect(cameras.length).toBeGreaterThanOrEqual(6);
    const pitCam = cameras.find((c) => c.camera_id === 'CAM-PIT-01');
    expect(pitCam).toBeDefined();
    expect(pitCam?.operational_status).toBe('ACTIVE');
  });

  it('updates PTZ coordinates', async () => {
    const updated = await cctvService.updatePTZ('CAM-PIT-01', 30.0, -20.0, 2.0);
    expect(updated.ptz.pan_deg).toBe(30.0);
    expect(updated.ptz.tilt_deg).toBe(-20.0);
    expect(updated.ptz.zoom_level).toBe(2.0);
  });

  it('runs local computer vision frame analysis with detections & PPE stats', async () => {
    const frame = await cctvService.getCameraFrame('CAM-PIT-01', { injectViolation: true });
    expect(frame.camera_id).toBe('CAM-PIT-01');
    expect(frame.total_persons).toBeGreaterThanOrEqual(1);
    expect(frame.hazard_detected).toBe(true);
  });

  it('fetches camera network health summary and incident replay', async () => {
    const health = await cctvService.getHealthSummary();
    expect(health.total_cameras).toBe(6);
    expect(health.average_health_score_pct).toBeGreaterThan(90);

    const replay = await cctvService.getIncidentReplay('INC-2026-001');
    expect(replay.incident_id).toBe('INC-2026-001');
    expect(replay.replay_frames.length).toBeGreaterThan(0);
  });
});
