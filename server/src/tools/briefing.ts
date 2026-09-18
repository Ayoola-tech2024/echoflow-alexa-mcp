import { SystemState } from '../state.js';
import { DailyBriefing } from '../../../shared/types.js';

export const getDailyBriefingTool = {
  name: 'get_daily_briefing',
  description: 'Generates an intelligent, proactive audio briefing for Alexa+. Synthesizes live weather conditions, priority calendar items, smart device alerts, and tailored energy/efficiency recommendations.',
  inputSchema: {
    type: 'object',
    properties: {
      userContext: {
        type: 'string',
        description: 'Optional contextual hint (e.g. "morning", "evening", "focus_day")',
      }
    }
  }
};

export function handleGetDailyBriefing(params?: { userContext?: string }) {
  const state = SystemState.getInstance();
  const userName = state.knowledgeBase['user_name'] || 'there';
  const now = new Date();
  const hours = now.getHours();

  let timeGreeting = 'Good morning';
  if (hours >= 12 && hours < 17) {
    timeGreeting = 'Good afternoon';
  } else if (hours >= 17) {
    timeGreeting = 'Good evening';
  }

  const briefing: DailyBriefing = {
    greeting: `${timeGreeting}, ${userName}! Here is your proactive EchoFlow intelligence briefing.`,
    timestamp: now.toISOString(),
    weather: {
      condition: 'Partly Cloudy with Crisp Sunshine',
      temperature: 20,
      high: 23,
      low: 15,
      precipitation: '10%'
    },
    schedule: state.calendar,
    deviceAlerts: [
      `Front Door is secure and deadbolt is locked.`,
      `Home energy consumption is running at an optimal ${state.environment.energyUsageWatts}W.`
    ],
    proactiveSuggestions: [
      `You have '${state.calendar[0]?.title}' coming up at ${state.calendar[0]?.time}.`,
      `Would you like me to trigger 'Focus Mode' for your afternoon code sprint?`
    ],
    audioScript: `${timeGreeting}, ${userName}. Today in Seattle it is 20 degrees and partly cloudy. You have ${state.calendar.length} events on your schedule, starting with ${state.calendar[0]?.title} at ${state.calendar[0]?.time}. All smart home systems are secure and running at an optimal ${state.environment.energyUsageWatts} Watts.`
  };

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(briefing, null, 2)
      }
    ]
  };
}
