import React from 'react';
import { Radio, Sparkles, Activity, Cpu } from 'lucide-react';

interface HeaderProps {
  serverConnected: boolean;
  activeModel: string;
  latency: number | null;
  energyWatts: number;
}

export const Header: React.FC<HeaderProps> = ({
  serverConnected,
  activeModel,
  latency,
  energyWatts
}) => {
  return (
    <header className="glass-panel border-b border-slate-800/80 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 text-white font-bold">
            <Radio className="w-6 h-6 animate-pulse" />
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                EchoFlow
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Alexa+ MCP
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                AWS Bedrock
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Autonomous Streamable HTTP Protocol (Spec 2025-11-25+)
            </p>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Server SSE Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800">
            <div className={`w-2 h-2 rounded-full ${serverConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
            <span className="text-slate-400">MCP Stream:</span>
            <span className={serverConnected ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
              {serverConnected ? 'Connected (SSE)' : 'Reconnecting...'}
            </span>
          </div>

          {/* AI Intelligence Model */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Model:</span>
            <span className="font-mono text-cyan-300">{activeModel.split(' ')[0] || 'Claude 3.5'}</span>
          </div>

          {/* Power / Energy Monitor */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Home Power:</span>
            <span className="font-mono text-amber-400 font-semibold">{energyWatts}W</span>
          </div>

          {/* Latency */}
          {latency !== null && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-slate-400">Latency:</span>
              <span className="font-mono text-purple-300 font-semibold">{latency}ms</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
