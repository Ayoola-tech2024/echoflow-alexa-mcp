import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool
} from '@modelcontextprotocol/sdk/types.js';

import { controlSmartDeviceTool, handleControlSmartDevice } from './tools/smart-home.js';
import { getDailyBriefingTool, handleGetDailyBriefing } from './tools/briefing.js';
import { triggerOpsRoutineTool, handleTriggerOpsRoutine } from './tools/routines.js';
import { queryKnowledgeBaseTool, handleQueryKnowledgeBase } from './tools/knowledge-base.js';

export function createMcpServer(): Server {
  const server = new Server(
    {
      name: 'echoflow-alexa-mcp-server',
      version: '1.0.0'
    },
    {
      capabilities: {
        tools: {}
      }
    }
  );

  // Register ListTools handler
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        controlSmartDeviceTool as Tool,
        getDailyBriefingTool as Tool,
        triggerOpsRoutineTool as Tool,
        queryKnowledgeBaseTool as Tool
      ]
    };
  });

  // Register CallTool handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    switch (name) {
      case 'control_smart_device':
        return handleControlSmartDevice(args as any);

      case 'get_daily_briefing':
        return handleGetDailyBriefing(args as any);

      case 'trigger_ops_routine':
        return handleTriggerOpsRoutine(args as any);

      case 'query_knowledge_base':
        return handleQueryKnowledgeBase(args as any);

      default:
        throw new Error(`Unknown MCP tool '${name}' requested.`);
    }
  });

  return server;
}
