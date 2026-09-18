import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createMcpServer } from './mcp-server.js';
import { SystemState } from './state.js';
import { BedrockAgentEngine } from './bedrock/bedrock-client.js';
import { McpLogEntry } from '../../shared/types.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json());

const mcpServer = createMcpServer();
const bedrockEngine = new BedrockAgentEngine();
const systemState = SystemState.getInstance();

// Active SSE client connections
const sseClients: Response[] = [];

// Helper to broadcast MCP logs to connected web simulators
export function broadcastMcpLog(entry: McpLogEntry) {
  const data = `data: ${JSON.stringify(entry)}\n\n`;
  for (const client of sseClients) {
    client.write(data);
  }
}

// 1. Health & Spec Conformance Check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'EchoFlow Alexa+ MCP Server',
    specVersion: '2025-11-25+',
    transport: 'Streamable HTTP (SSE)',
    awsBedrockIntegration: 'active',
    timestamp: new Date().toISOString()
  });
});

// 2. Streamable HTTP / SSE Endpoint (Specification 2025-11-25+)
app.get('/sse', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();

  sseClients.push(res);

  // Initial welcome event
  res.write(`data: ${JSON.stringify({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    direction: 'sse-event',
    method: 'system/connect',
    result: { message: 'EchoFlow Alexa+ Streamable HTTP connection established.' },
    status: 'success'
  })}\n\n`);

  req.on('close', () => {
    const idx = sseClients.indexOf(res);
    if (idx !== -1) sseClients.splice(idx, 1);
  });
});

// 3. MCP Protocol Message Endpoint (POST /messages)
app.post('/messages', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const requestBody = req.body;
  const requestId = requestBody.id || `req-${Date.now()}`;
  const method = requestBody.method || 'unknown';

  broadcastMcpLog({
    id: `in-${Date.now()}`,
    timestamp: new Date().toISOString(),
    direction: 'inbound',
    method,
    params: requestBody.params,
    status: 'streaming'
  });

  try {
    let responsePayload: any = null;

    if (method === 'tools/list') {
      const toolList = [
        {
          name: 'control_smart_device',
          description: 'Inspect or control smart home IoT devices'
        },
        {
          name: 'get_daily_briefing',
          description: 'Generates an intelligent proactive audio briefing for Alexa+'
        },
        {
          name: 'trigger_ops_routine',
          description: 'Executes autonomous multi-step smart routines'
        },
        {
          name: 'query_knowledge_base',
          description: 'Searches user context and saved preferences'
        }
      ];
      responsePayload = { jsonrpc: '2.0', id: requestId, result: { tools: toolList } };
    } else if (method === 'tools/call') {
      const toolName = requestBody.params?.name;
      const toolArgs = requestBody.params?.arguments || {};

      const callResult = await bedrockEngine.processVoiceQuery(`Execute tool ${toolName} with ${JSON.stringify(toolArgs)}`);
      responsePayload = {
        jsonrpc: '2.0',
        id: requestId,
        result: {
          content: [{ type: 'text', text: callResult.voiceResponse }],
          toolCalls: callResult.toolCallsExecuted
        }
      };
    } else {
      responsePayload = {
        jsonrpc: '2.0',
        id: requestId,
        result: { status: 'acknowledged', method }
      };
    }

    const latencyMs = Date.now() - startTime;

    broadcastMcpLog({
      id: `out-${Date.now()}`,
      timestamp: new Date().toISOString(),
      direction: 'outbound',
      method,
      result: responsePayload.result,
      latencyMs,
      status: 'success'
    });

    res.json(responsePayload);
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    broadcastMcpLog({
      id: `err-${Date.now()}`,
      timestamp: new Date().toISOString(),
      direction: 'outbound',
      method,
      result: { error: err.message },
      latencyMs,
      status: 'error'
    });

    res.status(500).json({
      jsonrpc: '2.0',
      id: requestId,
      error: { code: -32603, message: err.message }
    });
  }
});

// 4. List Active Tools Endpoint
app.get('/tools', (_req: Request, res: Response) => {
  res.json({
    specVersion: '2025-11-25+',
    tools: [
      {
        name: 'control_smart_device',
        description: 'Control smart IoT lights, thermostat, locks, and security sensors',
        parameters: ['deviceId', 'action', 'value']
      },
      {
        name: 'get_daily_briefing',
        description: 'Synthesize proactive morning/evening briefing with weather & schedule',
        parameters: ['userContext']
      },
      {
        name: 'trigger_ops_routine',
        description: 'Trigger autonomous multi-step operations (Morning Launch, Focus Mode, Away)',
        parameters: ['routineId']
      },
      {
        name: 'query_knowledge_base',
        description: 'Access connected user knowledge, contacts, and home settings',
        parameters: ['query']
      }
    ]
  });
});

// 5. Get Current Environment State
app.get('/api/state', (_req: Request, res: Response) => {
  res.json({
    environment: systemState.environment,
    calendar: systemState.calendar,
    routines: systemState.routines
  });
});

// 6. Voice Agent Interaction Endpoint
app.post('/api/agent/query', async (req: Request, res: Response) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter required.' });
  }

  const startTime = Date.now();

  broadcastMcpLog({
    id: `voice-${Date.now()}`,
    timestamp: new Date().toISOString(),
    direction: 'inbound',
    method: 'alexa/voice_query',
    params: { query },
    status: 'streaming'
  });

  const agentResponse = await bedrockEngine.processVoiceQuery(query);
  const latencyMs = Date.now() - startTime;

  broadcastMcpLog({
    id: `agent-${Date.now()}`,
    timestamp: new Date().toISOString(),
    direction: 'outbound',
    method: 'alexa/voice_response',
    result: {
      voiceResponse: agentResponse.voiceResponse,
      tools: agentResponse.toolCallsExecuted.map(t => t.name),
      model: agentResponse.modelUsed
    },
    latencyMs,
    status: 'success'
  });

  res.json({
    ...agentResponse,
    updatedEnvironment: systemState.environment
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`⚡ EchoFlow Alexa+ MCP Server running on http://localhost:${PORT}`);
    console.log(`📡 Streamable HTTP / SSE endpoint: http://localhost:${PORT}/sse`);
    console.log(`🛠️ MCP Tools Endpoint: http://localhost:${PORT}/tools`);
  });
}

export default app;
