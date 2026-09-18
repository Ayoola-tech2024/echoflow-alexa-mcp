import { SystemState } from '../state.js';

export const queryKnowledgeBaseTool = {
  name: 'query_knowledge_base',
  description: 'Searches user context, saved preferences, emergency contacts, schedule entries, and technical specifications for Alexa+ and Bedrock integrations.',
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Keyword or question to query in knowledge base',
      }
    },
    required: ['query']
  }
};

export function handleQueryKnowledgeBase(params: { query: string }) {
  const state = SystemState.getInstance();
  const q = params.query.toLowerCase();

  const matchedEntries: Record<string, any> = {};

  for (const [k, v] of Object.entries(state.knowledgeBase)) {
    if (k.toLowerCase().includes(q) || v.toLowerCase().includes(q)) {
      matchedEntries[k] = v;
    }
  }

  // Also search calendar
  const matchedEvents = state.calendar.filter(e => 
    e.title.toLowerCase().includes(q) || 
    (e.location && e.location.toLowerCase().includes(q))
  );

  if (matchedEvents.length > 0) {
    matchedEntries['matching_calendar_events'] = matchedEvents;
  }

  // Also search devices
  const matchedDevices = Object.values(state.environment.devices).filter(d => 
    d.name.toLowerCase().includes(q) || 
    d.room.toLowerCase().includes(q) ||
    d.type.toLowerCase().includes(q)
  );

  if (matchedDevices.length > 0) {
    matchedEntries['matching_devices'] = matchedDevices;
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(matchedEntries, null, 2)
      }
    ]
  };
}
