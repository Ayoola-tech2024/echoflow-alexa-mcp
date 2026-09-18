import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.js';
import { VoiceSimulator } from './components/VoiceSimulator.js';
import { McpInspector } from './components/McpInspector.js';
import { SmartHomeSandbox } from './components/SmartHomeSandbox.js';
import { ScenarioPlayer } from './components/ScenarioPlayer.js';
import {
  fetchEnvironmentState,
  sendVoiceQuery,
  executeMcpDirectTool,
  subscribeToMcpStream,
  fetchHealth
} from './services/api.js';
import { EnvironmentState, McpLogEntry, ChatMessage } from '../../shared/types.js';

export const App: React.FC = () => {
  const [serverConnected, setServerConnected] = useState(false);
  const [activeModel, setActiveModel] = useState('AWS Bedrock (Claude 3.5 Sonnet)');
  const [lastLatency, setLastLatency] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [environment, setEnvironment] = useState<EnvironmentState>({
    devices: {},
    ambientTemperature: 21.5,
    energyUsageWatts: 340,
    securityStatus: 'secure',
    activeRoutine: null,
    lastSync: new Date().toISOString()
  });

  const [logs, setLogs] = useState<McpLogEntry[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'alexa',
      text: 'Hello Ayoola! EchoFlow Alexa+ MCP Server is active with Streamable HTTP transport and AWS Bedrock intelligence. How can I assist you with your day or smart home environment?',
      timestamp: new Date().toISOString()
    }
  ]);

  // Initial Data Load & SSE Subscription
  useEffect(() => {
    let unsubscribeStream: (() => void) | null = null;

    const pollState = async () => {
      try {
        const health = await fetchHealth();
        if (health.status === 'healthy') {
          setServerConnected(true);
        }
        const stateData = await fetchEnvironmentState();
        setEnvironment(stateData.environment);
      } catch (err) {
        setServerConnected(false);
      }
    };

    pollState();

    // Subscribe to real-time SSE stream once on mount
    unsubscribeStream = subscribeToMcpStream((newLog) => {
      setLogs((prev) => [newLog, ...prev.slice(0, 99)]);
    });

    const interval = setInterval(pollState, 10000);

    return () => {
      clearInterval(interval);
      if (unsubscribeStream) unsubscribeStream();
    };
  }, []);

  // Handle Voice / Text Query Execution
  const handleSendQuery = async (queryText: string) => {
    setIsProcessing(true);

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const response = await sendVoiceQuery(queryText);
      setLastLatency(response.latencyMs);
      setActiveModel(response.modelUsed);

      if (response.updatedEnvironment) {
        setEnvironment(response.updatedEnvironment);
      }

      const alexaMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'alexa',
        text: response.voiceResponse,
        timestamp: new Date().toISOString(),
        toolCalls: response.toolCallsExecuted
      };

      setMessages((prev) => [...prev, alexaMsg]);
    } catch (err: any) {
      console.error('Error executing voice query:', err);
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'alexa',
        text: 'Sorry, I encountered an issue communicating with the MCP server. Please check that the server is online.',
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle direct device toggle from Smart Home Sandbox
  const handleToggleDevice = async (deviceId: string, action: string, value?: string) => {
    try {
      await executeMcpDirectTool('control_smart_device', { deviceId, action, value });
      const stateData = await fetchEnvironmentState();
      setEnvironment(stateData.environment);
    } catch (err) {
      console.error('Failed to toggle device:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <Header
        serverConnected={serverConnected}
        activeModel={activeModel}
        latency={lastLatency}
        energyWatts={environment.energyUsageWatts}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Row 1: 1-Click Live Demo Scenarios */}
        <ScenarioPlayer
          onRunScenario={handleSendQuery}
          disabled={isProcessing}
        />

        {/* Row 2: Two Column Split - Voice Assistant & MCP Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <VoiceSimulator
              onSendQuery={handleSendQuery}
              messages={messages}
              isProcessing={isProcessing}
              activeModel={activeModel}
            />
          </div>

          <div className="lg:col-span-5">
            <McpInspector
              logs={logs}
              onClearLogs={() => setLogs([])}
            />
          </div>
        </div>

        {/* Row 3: Smart Home IoT Sandbox */}
        <SmartHomeSandbox
          environment={environment}
          onToggleDevice={handleToggleDevice}
        />
      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500">
        <p>
          EchoFlow — Built for Amazon Developer Hackathon 2026 • Alexa+ Track & AWS Bedrock • Open Source MIT License
        </p>
      </footer>
    </div>
  );
};
