import React from 'react';
import { Sun, Coffee, ShieldAlert, Sparkles, Play } from 'lucide-react';
import { DemoScenario } from '../../../shared/types.js';

interface ScenarioPlayerProps {
  onRunScenario: (prompt: string) => void;
  disabled: boolean;
}

export const ScenarioPlayer: React.FC<ScenarioPlayerProps> = ({ onRunScenario, disabled }) => {
  const scenarios: DemoScenario[] = [
    {
      id: 'sc-1',
      title: 'Good Morning Launch',
      subtitle: 'Adjusts climate, brightens living room, gives proactive schedule briefing',
      voicePrompt: 'Alexa, good morning! Start my morning launch routine.',
      expectedTools: ['trigger_ops_routine', 'get_daily_briefing'],
      category: 'routine'
    },
    {
      id: 'sc-2',
      title: 'Deep Focus Mode',
      subtitle: 'Tunes office lights to cyan focus tone, dims living room, silences alerts',
      voicePrompt: 'Alexa, focus mode for my afternoon coding sprint.',
      expectedTools: ['trigger_ops_routine', 'control_smart_device'],
      category: 'routine'
    },
    {
      id: 'sc-3',
      title: 'Away Lockdown',
      subtitle: 'Turns off all lights, locks deadbolts, sets eco climate, arms Alexa Guard',
      voicePrompt: 'Alexa, I am leaving the house. Lock down everything.',
      expectedTools: ['trigger_ops_routine', 'control_smart_device'],
      category: 'security'
    },
    {
      id: 'sc-4',
      title: 'Proactive Briefing',
      subtitle: 'Synthesizes weather, schedule, and home energy consumption into voice speech',
      voicePrompt: 'Alexa, what does my day look like and are my devices efficient?',
      expectedTools: ['get_daily_briefing', 'query_knowledge_base'],
      category: 'briefing'
    }
  ];

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-slate-100">1-Click Live Demo Scenarios</h2>
        </div>
        <span className="text-xs text-slate-400">Click any card to simulate live Alexa+ voice execution</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {scenarios.map((sc) => (
          <button
            key={sc.id}
            onClick={() => onRunScenario(sc.voicePrompt)}
            disabled={disabled}
            className="p-3.5 rounded-xl text-left bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 hover:shadow-md hover:shadow-cyan-500/10 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-cyan-500/20 group-hover:text-cyan-400 text-slate-400 transition-colors">
                  {sc.category === 'routine' && <Sun className="w-4 h-4" />}
                  {sc.category === 'security' && <ShieldAlert className="w-4 h-4 text-rose-400" />}
                  {sc.category === 'briefing' && <Coffee className="w-4 h-4 text-amber-400" />}
                </div>

                <span className="p-1 rounded-full bg-slate-800 group-hover:bg-cyan-500 group-hover:text-slate-950 text-slate-400 transition-colors">
                  <Play className="w-3 h-3 fill-current" />
                </span>
              </div>

              <h3 className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">
                {sc.title}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {sc.subtitle}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>{sc.expectedTools.length} MCP Tools</span>
              <span className="text-cyan-400 group-hover:underline">Simulate ➔</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
