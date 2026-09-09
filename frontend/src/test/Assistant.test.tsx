import { describe, it, expect } from 'vitest';
import { assistantService } from '../services/assistantService';

describe('MineMind Local AI Assistant & RAG Services', () => {
  it('retrieves specialist assistant roles and system configs', async () => {
    const roles = await assistantService.getRoles();

    expect(roles).toBeDefined();
    expect(roles.safety_officer).toBeDefined();
    expect(roles.geotechnical_engineer).toBeDefined();
    expect(roles.maintenance_specialist).toBeDefined();
    expect(roles.pit_dispatcher).toBeDefined();
    expect(roles.mine_operations_manager).toBeDefined();

    expect(roles.safety_officer.title).toContain('Safety');
    expect(roles.safety_officer.suggested_questions.length).toBeGreaterThan(0);
  });

  it('queries knowledge base status for local RAG', async () => {
    const kb = await assistantService.getKnowledgeBaseStatus();

    expect(kb).toBeDefined();
    expect(kb.total_chunks).toBeGreaterThan(0);
    expect(kb.categories).toContain('safety');
    expect(kb.embedding_dimensions).toBe(256);
  });

  it('lists registered internal telemetry tools', async () => {
    const tools = await assistantService.getTools();

    expect(tools.length).toBeGreaterThan(0);
    const toolNames = tools.map((t) => t.name);
    expect(toolNames).toContain('get_mine_status');
  });

  it('sends offline grounded chat query and receives tool calls & citations', async () => {
    const resp = await assistantService.sendChatMessage(
      'What is the blast exclusion distance and current pit status?',
      'safety_officer'
    );

    expect(resp).toBeDefined();
    expect(resp.response).toBeDefined();
    expect(resp.response.length).toBeGreaterThan(20);
    expect(resp.role).toBe('safety_officer');
    expect(resp.tool_calls.length).toBeGreaterThanOrEqual(1);
    expect(resp.citations.length).toBeGreaterThanOrEqual(1);
  });

  it('generates grounded operational shift handover and safety reports', async () => {
    const shiftReport = await assistantService.generateReport('SHIFT_HANDOVER', 'Shift Charlie');
    expect(shiftReport).toBeDefined();
    expect(shiftReport.markdown_content).toContain('Shift Handover');

    const safetyReport = await assistantService.generateReport('SAFETY_AUDIT');
    expect(safetyReport).toBeDefined();
    expect(safetyReport.markdown_content.length).toBeGreaterThan(50);
  });
});
