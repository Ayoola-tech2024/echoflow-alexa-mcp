/**
 * Shared Type Definitions for EchoFlow
 * Alexa+ MCP Server & Web Companion Simulator
 */

export type DeviceType = 'light' | 'lock' | 'thermostat' | 'security' | 'media';

export interface SmartDevice {
  id: string;
  name: string;
  room: string;
  type: DeviceType;
  isOn: boolean;
  brightness?: number; // 0 - 100
  color?: string; // hex color
  temperature?: number; // degrees Celsius / Fahrenheit
  targetTemperature?: number;
  isLocked?: boolean;
  armedState?: 'disarmed' | 'armed_home' | 'armed_away';
  lastUpdated: string;
}

export interface EnvironmentState {
  devices: Record<string, SmartDevice>;
  ambientTemperature: number;
  energyUsageWatts: number;
  securityStatus: 'secure' | 'warning' | 'alert';
  activeRoutine: string | null;
  lastSync: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  location?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface DailyBriefing {
  greeting: string;
  timestamp: string;
  weather: {
    condition: string;
    temperature: number;
    high: number;
    low: number;
    precipitation: string;
  };
  schedule: CalendarEvent[];
  deviceAlerts: string[];
  proactiveSuggestions: string[];
  audioScript: string;
}

export interface RoutineStep {
  targetDeviceId: string;
  action: string;
  params: Record<string, any>;
  description: string;
}

export interface RoutineDefinition {
  id: string;
  name: string;
  triggerPhrase: string;
  description: string;
  steps: RoutineStep[];
}

export interface RoutineExecutionResult {
  routineId: string;
  routineName: string;
  status: 'success' | 'partial' | 'failed';
  executedSteps: number;
  totalSteps: number;
  details: string[];
  voiceResponse: string;
  latencyMs: number;
}

export interface McpLogEntry {
  id: string;
  timestamp: string;
  direction: 'inbound' | 'outbound' | 'sse-event';
  method: string;
  params?: any;
  result?: any;
  latencyMs?: number;
  status: 'success' | 'error' | 'streaming';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'alexa' | 'system';
  text: string;
  timestamp: string;
  toolCalls?: Array<{
    name: string;
    arguments: Record<string, any>;
    result?: any;
  }>;
  isStreaming?: boolean;
}

export interface DemoScenario {
  id: string;
  title: string;
  subtitle: string;
  voicePrompt: string;
  expectedTools: string[];
  category: 'routine' | 'iot' | 'briefing' | 'security';
}
