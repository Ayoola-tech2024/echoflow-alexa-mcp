import React, { useState } from 'react';
import { Terminal, ArrowDownLeft, ArrowUpRight, Radio, Layers, Check, Copy } from 'lucide-react';
import { McpLogEntry } from '../../../shared/types.js';

interface McpInspectorProps {
  logs: McpLogEntry[];
  onClearLogs: () => void;
}

export const McpInspector: React.FC<McpInspectorProps> = ({ logs, onClearLogs }) => {
  const [selectedLog, setSelectedLog] = useState<McpLogEntry | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyPayload = (obj: any) => {
    navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel rounded-2xl flex flex-col h-[580px] overflow-hidden border border-slate-800">
      {/* Inspector Header */}
      <div className="px-5 py-3.5 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-sm text-slate-200">Live MCP Protocol Inspector</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
            Streamable HTTP (SSE)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClearLogs}
            className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Log Feed */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 font-mono text-xs">
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 p-6 text-center space-y-2">
            <Radio className="w-8 h-8 text-slate-600 animate-pulse" />
            <p>Listening on SSE stream (`/sse`)...</p>
            <p className="text-[11px] text-slate-600">
              Trigger an Alexa voice command or scenario to inspect MCP JSON-RPC packets in real time.
            </p>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              onClick={() => setSelectedLog(log)}
              className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                selectedLog?.id === log.id
                  ? 'bg-slate-800/90 border-cyan-500/50 shadow-sm shadow-cyan-500/10'
                  : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5">
                  {log.direction === 'inbound' && (
                    <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                      <ArrowDownLeft className="w-3.5 h-3.5" /> REQ
                    </span>
                  )}
                  {log.direction === 'outbound' && (
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <ArrowUpRight className="w-3.5 h-3.5" /> RES
                    </span>
                  )}
                  {log.direction === 'sse-event' && (
                    <span className="flex items-center gap-1 text-purple-400 font-semibold">
                      <Radio className="w-3.5 h-3.5" /> SSE
                    </span>
                  )}

                  <span className="text-slate-200 font-medium">{log.method}</span>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  {log.latencyMs !== undefined && (
                    <span className="text-cyan-300 font-semibold">{log.latencyMs}ms</span>
                  )}
                  <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                </div>
              </div>

              {/* Snippet Preview */}
              <div className="text-[11px] text-slate-400 truncate">
                {log.params && `Params: ${JSON.stringify(log.params)}`}
                {log.result && `Result: ${JSON.stringify(log.result)}`}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Inspector Drawer */}
      {selectedLog && (
        <div className="border-t border-slate-800 bg-slate-950/95 p-3 max-h-48 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1 font-mono">
              <Layers className="w-3.5 h-3.5" /> Packet Details ({selectedLog.method})
            </span>
            <button
              onClick={() => handleCopyPayload(selectedLog)}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy JSON'}
            </button>
          </div>
          <pre className="text-[11px] font-mono text-slate-300 bg-slate-900 p-2 rounded-md overflow-x-auto border border-slate-800">
            {JSON.stringify(selectedLog, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
