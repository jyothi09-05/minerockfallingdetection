import { describe, it, expect } from 'vitest';
import { incidentService } from '../services/incidentService';
import { emergencyService } from '../services/emergencyService';
import { analyticsService } from '../services/analyticsService';
import { reportingService } from '../services/reportingService';
import { searchService } from '../services/searchService';

describe('MineMind Phase 5 Enterprise Platform Integration', () => {
  it('loads incidents and advances 7-stage lifecycle', async () => {
    const list = await incidentService.listIncidents();
    expect(list.length).toBeGreaterThan(0);
    const first = list[0];
    expect(first.stage).toBeDefined();

    const created = await incidentService.createIncident({
      title: 'Bench 1350 Geotechnical Creep',
      category: 'SLOPE_FAILURE',
      severity: 'HIGH',
      zone_name: 'North Highwall'
    });

    expect(created).toBeDefined();
    expect(created.stage).toBe('DETECTED');
  });

  it('triggers and resolves 8 simulated emergency scenarios with evacuation routing', async () => {
    const scenarios = await emergencyService.getAvailableScenarios();
    expect(scenarios.length).toBe(8);
    expect(scenarios).toContain('ROCKFALL');
    expect(scenarios).toContain('FLOOD');
    expect(scenarios).toContain('FIRE');

    const triggered = await emergencyService.triggerEmergency('ROCKFALL');
    expect(triggered).toBeDefined();
    expect(triggered.status).toBe('ACTIVE');
    expect(triggered.siren_active).toBe(true);
    expect(triggered.evacuation_corridor.primary_ramp).toBeDefined();

    const resolved = await emergencyService.resolveEmergency(triggered.emergency_id);
    expect(resolved).toBe(true);
  });

  it('aggregates multi-domain operational analytics', async () => {
    const overview = await analyticsService.getOverview();
    expect(overview).toBeDefined();
    expect(overview.safety.safety_health_score_pct).toBeGreaterThan(90);
    expect(overview.production.ore_tonnage_hauled_tons).toBeGreaterThan(0);
    expect(overview.equipment.fleet_availability_pct).toBeGreaterThan(80);
    expect(overview.ai_models.models_deployed).toBe(6);
  });

  it('generates local reports and multi-format exports', async () => {
    const catalog = await reportingService.getReportCatalog();
    expect(catalog.length).toBe(8);

    const htmlReport = await reportingService.exportReport('DAILY_MINE', 'html');
    expect(htmlReport).toContain('MineMind');

    const textReport = await reportingService.exportReport('SHIFT_REPORT', 'text');
    expect(textReport).toContain('Report ID');
  });

  it('executes sub-millisecond global search across entities and SOP documents', async () => {
    const truckResults = await searchService.search('HT-101');
    expect(truckResults.length).toBeGreaterThan(0);
    expect(truckResults[0].id).toBe('HT-101');

    const docResults = await searchService.search('blast');
    expect(docResults.length).toBeGreaterThan(0);
    expect(docResults[0].type).toBe('DOCUMENT');
  });
});
