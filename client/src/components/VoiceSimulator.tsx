import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Volume2, VolumeX, Sparkles, Terminal, CheckCircle2 } from 'lucide-react';
import { ChatMessage } from '../../../shared/types.js';

interface VoiceSimulatorProps {
  onSendQuery: (query: string) => Promise<void>;
  messages: ChatMessage[];
  isProcessing: boolean;
  activeModel: string;
}

export const VoiceSimulator: React.FC<VoiceSimulatorProps> = ({
  onSendQuery,
  messages,
  isProcessing,
  activeModel
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [waveformHeights, setWaveformHeights] = useState<number[]>([20, 45, 75, 30, 90, 60, 40, 80, 50, 30, 60, 25]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  // Speech Recognition support
  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported on this browser. You can type queries in the box below.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      handleFormSubmit(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Animate voice waveforms when speaking or processing
  useEffect(() => {
    if (!isProcessing && !isListening) return;
    const interval = setInterval(() => {
      setWaveformHeights(prev =>
        prev.map(() => Math.floor(Math.random() * 80) + 15)
      );
    }, 120);
    return () => clearInterval(interval);
  }, [isProcessing, isListening]);

  // Text-To-Speech for Alexa voice responses
  const speakAlexaResponse = (text: string) => {
    if (!ttsEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    
    // Pick female voice if available
    const voices = window.speechSynthesis.getVoices();
    const alexaVoice = voices.find(v => v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('Google US English') || v.lang === 'en-US');
    if (alexaVoice) utterance.voice = alexaVoice;

    window.speechSynthesis.speak(utterance);
  };

  const handleFormSubmit = async (queryText?: string) => {
    const text = (queryText || inputText).trim();
    if (!text || isProcessing) return;
    setInputText('');
    await onSendQuery(text);
  };

  // Speak latest response when it arrives
  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.sender === 'alexa' && ttsEnabled) {
        speakAlexaResponse(lastMsg.text);
      }
    }
  }, [messages, ttsEnabled]);

  return (
    <div className="glass-panel rounded-2xl flex flex-col h-[580px] overflow-hidden border border-slate-800">
      {/* Voice Assistant Header */}
      <div className="px-5 py-3.5 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
          <span className="font-semibold text-sm text-slate-200">Alexa+ Voice Interface</span>
          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
            {activeModel.split(' ')[0]}
          </span>
        </div>

        {/* Audio Output Toggle */}
        <button
          onClick={() => setTtsEnabled(!ttsEnabled)}
          title={ttsEnabled ? 'Mute Alexa Voice' : 'Enable Alexa Voice'}
          className={`p-1.5 rounded-lg border transition-colors ${
            ttsEnabled
              ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
              : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}
        >
          {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Voice Wave Visualizer Banner */}
      <div className="py-4 px-6 bg-gradient-to-b from-slate-900/80 to-transparent flex flex-col items-center justify-center border-b border-slate-800/40">
        <div className="flex items-center gap-1.5 h-12">
          {waveformHeights.map((h, i) => (
            <div
              key={i}
              style={{ height: `${isProcessing || isListening ? h : 8}px` }}
              className={`w-1.5 rounded-full transition-all duration-100 ${
                isListening
                  ? 'bg-rose-500 shadow-sm shadow-rose-500/50'
                  : isProcessing
                  ? 'bg-cyan-400 shadow-sm shadow-cyan-400/50'
                  : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <span className="text-xs font-medium text-slate-400 mt-2">
          {isListening
            ? 'Listening to speech...'
            : isProcessing
            ? 'Reasoning with AWS Bedrock & executing MCP tools...'
            : 'Say "Alexa, good morning" or enter a command below'}
        </span>
      </div>

      {/* Interactive Chat Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 text-sm ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none shadow-md shadow-cyan-500/10'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
              }`}
            >
              {/* Message Header */}
              <div className="flex items-center gap-2 mb-1 text-[11px] opacity-75 font-medium">
                {msg.sender === 'user' ? (
                  <span>You (Voice Input)</span>
                ) : (
                  <span className="flex items-center gap-1 text-cyan-300">
                    <Sparkles className="w-3 h-3" /> Alexa+ (MCP Agent)
                  </span>
                )}
                <span>• {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>

              {/* Message Content */}
              <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

              {/* Tool Execution Badges */}
              {msg.toolCalls && msg.toolCalls.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1.5">
                  <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-1">
                    <Terminal className="w-3 h-3" /> Executed MCP Tools:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.toolCalls.map((tc, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-950 border border-cyan-500/30 text-cyan-300"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {tc.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center gap-2 text-xs text-cyan-400 animate-pulse p-2">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Alexa+ is coordinating MCP tools across smart devices...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box & Mic Trigger */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2">
        <button
          onClick={startSpeechRecognition}
          disabled={isProcessing}
          className={`p-2.5 rounded-xl border transition-all ${
            isListening
              ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
          title="Voice Speech Input"
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleFormSubmit()}
          placeholder="Ask Alexa+ (e.g. 'Alexa, good morning' or 'Turn off office light')..."
          disabled={isProcessing}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        />

        <button
          onClick={() => handleFormSubmit()}
          disabled={!inputText.trim() || isProcessing}
          className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
          title="Send query"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
