import { EnvironmentState, McpLogEntry, CalendarEvent, RoutineDefinition } from '../../../shared/types.js';

const API_BASE = 'http://localhost:3001';

export async function fetchHealth(): Promise<{ status: string; specVersion: string; transport: string; awsBedrockIntegration: string }> {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function fetchEnvironmentState(): Promise<{
  environment: EnvironmentState;
  calendar: CalendarEvent[];
  routines: RoutineDefinition[];
}> {
  const res = await fetch(`${API_BASE}/api/state`);
  return res.json();
}

export async function sendVoiceQuery(query: string): Promise<{
  voiceResponse: string;
  toolCallsExecuted: Array<{ name: string; arguments: Record<string, any>; result: any }>;
  modelUsed: string;
  latencyMs: number;
  updatedEnvironment: EnvironmentState;
}> {
  const res = await fetch(`${API_BASE}/api/agent/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  return res.json();
}

export async function executeMcpDirectTool(toolName: string, args: Record<string, any>): Promise<any> {
  const res = await fetch(`${API_BASE}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: `call-${Date.now()}`,
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: args
      }
    })
  });
  return res.json();
}

export function subscribeToMcpStream(onLog: (entry: McpLogEntry) => void): () => void {
  const eventSource = new EventSource(`${API_BASE}/sse`);

  eventSource.onmessage = (event) => {
    try {
      const data: McpLogEntry = JSON.parse(event.data);
      onLog(data);
    } catch (err) {
      console.error('Failed to parse SSE event data:', err);
    }
  };

  eventSource.onerror = (err) => {
    console.warn('SSE stream reconnecting...', err);
  };

  return () => {
    eventSource.close();
  };
}
