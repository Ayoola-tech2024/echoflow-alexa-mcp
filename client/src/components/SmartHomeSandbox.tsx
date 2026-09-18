import React from 'react';
import { Lightbulb, Lock, Unlock, Thermometer, ShieldAlert, ShieldCheck, Power, Zap } from 'lucide-react';
import { EnvironmentState } from '../../../shared/types.js';

interface SmartHomeSandboxProps {
  environment: EnvironmentState;
  onToggleDevice: (deviceId: string, action: string, value?: string) => Promise<void>;
}

export const SmartHomeSandbox: React.FC<SmartHomeSandboxProps> = ({
  environment,
  onToggleDevice
}) => {
  const devices = Object.values(environment.devices);

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-bold text-slate-100">Smart Home IoT Sandbox</h2>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
            {devices.length} Devices Active
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Thermometer className="w-4 h-4 text-cyan-400" />
            <span>Ambient: <strong className="text-white">{environment.ambientTemperature}°C</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Security: <strong className="text-emerald-400 uppercase">{environment.securityStatus}</strong></span>
          </div>
        </div>
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {devices.map((device) => {
          const isLight = device.type === 'light';
          const isLock = device.type === 'lock';
          const isThermostat = device.type === 'thermostat';
          const isSecurity = device.type === 'security';

          return (
            <div
              key={device.id}
              className={`p-4 rounded-xl border transition-all duration-200 ${
                device.isOn || (isLock && device.isLocked) || (isSecurity && device.armedState !== 'disarmed')
                  ? 'bg-slate-900/90 border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                  : 'bg-slate-950/60 border-slate-800/80 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2 rounded-lg ${
                      device.isOn || (isLock && device.isLocked)
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isLight && <Lightbulb className="w-4 h-4" />}
                    {isLock && (device.isLocked ? <Lock className="w-4 h-4 text-emerald-400" /> : <Unlock className="w-4 h-4 text-amber-400" />)}
                    {isThermostat && <Thermometer className="w-4 h-4 text-cyan-400" />}
                    {isSecurity && (device.armedState !== 'disarmed' ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <ShieldAlert className="w-4 h-4 text-rose-400" />)}
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-100">{device.name}</h3>
                    <p className="text-[11px] text-slate-400">{device.room}</p>
                  </div>
                </div>

                {/* Quick Toggle Button */}
                {isLight && (
                  <button
                    onClick={() => onToggleDevice(device.id, device.isOn ? 'turn_off' : 'turn_on')}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      device.isOn
                        ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                    title="Toggle Light"
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>
                )}

                {isLock && (
                  <button
                    onClick={() => onToggleDevice(device.id, device.isLocked ? 'unlock' : 'lock')}
                    className={`px-2 py-1 rounded text-xs font-semibold border transition-colors ${
                      device.isLocked
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    }`}
                  >
                    {device.isLocked ? 'LOCKED' : 'UNLOCKED'}
                  </button>
                )}
              </div>

              {/* Specific Control Sliders / Details */}
              {isLight && (
                <div className="space-y-1.5 mt-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Brightness</span>
                    <span className="font-mono text-cyan-300">{device.brightness || 0}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={device.brightness || 0}
                    onChange={(e) => onToggleDevice(device.id, 'set_brightness', e.target.value)}
                    className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              )}

              {isThermostat && (
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800 text-xs">
                  <span className="text-slate-400">Target Temp:</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onToggleDevice(device.id, 'set_temperature', String((device.targetTemperature || 21) - 0.5))}
                      className="w-6 h-6 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 flex items-center justify-center font-bold"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-cyan-300 px-1">{device.targetTemperature || 21.5}°C</span>
                    <button
                      onClick={() => onToggleDevice(device.id, 'set_temperature', String((device.targetTemperature || 21) + 0.5))}
                      className="w-6 h-6 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 flex items-center justify-center font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {isSecurity && (
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800 text-xs">
                  <span className="text-slate-400">Guard Mode:</span>
                  <span className="font-mono text-emerald-400 font-semibold uppercase">{device.armedState || 'DISARMED'}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
