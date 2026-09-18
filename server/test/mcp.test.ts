import request from 'supertest';
import app from '../src/index.js';
import { handleControlSmartDevice } from '../src/tools/smart-home.js';
import { handleGetDailyBriefing } from '../src/tools/briefing.js';
import { handleTriggerOpsRoutine } from '../src/tools/routines.js';
import { handleQueryKnowledgeBase } from '../src/tools/knowledge-base.js';

describe('EchoFlow Alexa+ MCP Server Tests', () => {
  describe('Health & Spec Conformance', () => {
    it('should return healthy status and MCP spec 2025-11-25+ info', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.specVersion).toBe('2025-11-25+');
      expect(res.body.transport).toContain('Streamable HTTP');
    });

    it('should list all registered MCP tools on /tools', async () => {
      const res = await request(app).get('/tools');
      expect(res.status).toBe(200);
      expect(res.body.tools.length).toBeGreaterThanOrEqual(4);
      const toolNames = res.body.tools.map((t: any) => t.name);
      expect(toolNames).toContain('control_smart_device');
      expect(toolNames).toContain('get_daily_briefing');
      expect(toolNames).toContain('trigger_ops_routine');
      expect(toolNames).toContain('query_knowledge_base');
    });
  });

  describe('MCP Direct Tool Handlers', () => {
    it('control_smart_device should toggle light status', () => {
      const result = handleControlSmartDevice({
        deviceId: 'light-living-room',
        action: 'turn_on',
        value: '100'
      });
      expect(result.content).toBeDefined();
      expect(result.content[0].text).toContain('successfully updated');
    });

    it('get_daily_briefing should return structured weather and schedule', () => {
      const result = handleGetDailyBriefing();
      expect(result.content).toBeDefined();
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.greeting).toBeDefined();
      expect(parsed.weather).toBeDefined();
      expect(parsed.schedule.length).toBeGreaterThan(0);
    });

    it('trigger_ops_routine should execute multi-step morning routine', () => {
      const result = handleTriggerOpsRoutine({ routineId: 'morning_launch' });
      expect(result.content).toBeDefined();
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.status).toBe('success');
      expect(parsed.executedSteps).toBeGreaterThanOrEqual(3);
    });

    it('query_knowledge_base should search home info', () => {
      const result = handleQueryKnowledgeBase({ query: 'temperature' });
      expect(result.content).toBeDefined();
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed).toBeDefined();
    });
  });

  describe('Agent Query Endpoint', () => {
    it('should process natural language query and return tool calls', async () => {
      const res = await request(app)
        .post('/api/agent/query')
        .send({ query: 'Alexa, good morning' });

      expect(res.status).toBe(200);
      expect(res.body.voiceResponse).toBeDefined();
      expect(res.body.toolCallsExecuted.length).toBeGreaterThan(0);
      expect(res.body.updatedEnvironment).toBeDefined();
    });
  });
});
