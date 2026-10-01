import React, { useState } from 'react';
import {
  Settings, ShieldCheck, Key, Sliders, Database,
  Cpu, RotateCcw, CheckCircle2, Save, Terminal
} from 'lucide-react';
import { useFactory } from '../context/FactoryContext';

export const SettingsPage: React.FC = () => {
  const { resetSimulation, showToast } = useFactory();
  const [groqKeySaved, setGroqKeySaved] = useState(true);
  const [spindleThreshold, setSpindleThreshold] = useState(230);
  const [vibrationThreshold, setVibrationThreshold] = useState(5.0);
  const [pressureThreshold, setPressureThreshold] = useState(8.5);

  const handleSave = () => {
    showToast('Configuration parameters saved successfully.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-graphite-900 border border-graphite-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white font-mono tracking-wide">SYSTEM SETTINGS &amp; CONFIGURATION</h2>
            <span className="text-[10px] font-mono uppercase bg-forge-cyan/20 text-forge-cyan px-2 py-0.5 rounded border border-forge-cyan/40">
              SAFETY &amp; CONTROL LIMITS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Configure telemetry safety envelopes, multi-agent LLM inference providers, and Human-in-the-Loop governance protocols.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2.5 rounded-xl bg-forge-cyan text-graphite-950 font-mono text-xs font-bold hover:bg-cyan-300 transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,229,255,0.25)]"
        >
          <Save className="w-4 h-4" />
          <span>SAVE CONFIGURATION</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Safety Threshold Envelopes */}
        <div className="bg-graphite-900 border border-graphite-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-graphite-800">
            <h3 className="text-xs font-bold text-white font-mono uppercase flex items-center gap-2">
              <Sliders className="w-4 h-4 text-forge-cyan" />
              STATISTICAL QUALITY THRESHOLDS (SPC)
            </h3>
            <span className="text-[10px] font-mono text-slate-400">ISO 9001 COMPLIANT</span>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Spindle Temperature Upper Control Limit (UCL):</span>
                <span className="text-forge-cyan font-bold">{spindleThreshold}°C</span>
              </div>
              <input
                type="range"
                min="200"
                max="260"
                value={spindleThreshold}
                onChange={(e) => setSpindleThreshold(parseInt(e.target.value))}
                className="w-full accent-forge-cyan bg-graphite-800 h-1.5 rounded cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">Critical trigger: &gt;245°C</span>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Spindle Vibration Velocity (ISO 10816 Zone C):</span>
                <span className="text-forge-cyan font-bold">{vibrationThreshold} mm/s</span>
              </div>
              <input
                type="range"
                min="3.0"
                max="8.0"
                step="0.5"
                value={vibrationThreshold}
                onChange={(e) => setVibrationThreshold(parseFloat(e.target.value))}
                className="w-full accent-forge-cyan bg-graphite-800 h-1.5 rounded cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">Critical trigger: &gt;7.1 mm/s</span>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Hydraulic Pressure Warning Threshold:</span>
                <span className="text-forge-cyan font-bold">{pressureThreshold} bar</span>
              </div>
              <input
                type="range"
                min="7.0"
                max="10.0"
                step="0.1"
                value={pressureThreshold}
                onChange={(e) => setPressureThreshold(parseFloat(e.target.value))}
                className="w-full accent-forge-cyan bg-graphite-800 h-1.5 rounded cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">Normal: 6.5–8.5 bar</span>
            </div>
          </div>
        </div>

        {/* AI Model & Security Architecture */}
        <div className="bg-graphite-900 border border-graphite-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-graphite-800">
            <h3 className="text-xs font-bold text-white font-mono uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-forge-emerald" />
              AI MODEL &amp; SECURITY ARCHITECTURE
            </h3>
            <span className="text-[10px] font-mono text-emerald-400">ACTIVE &amp; ENCRYPTED</span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 bg-graphite-850 rounded-xl border border-graphite-750">
              <span className="text-[10px] text-slate-400 block mb-1">COPILOT &amp; AGENT LLM INFERENCE:</span>
              <div className="text-white font-bold flex items-center justify-between">
                <span>Groq LLaMA-3.3-70B-Versatile + Fallback Engine</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">CONNECTED</span>
              </div>
            </div>

            <div className="p-3 bg-graphite-850 rounded-xl border border-graphite-750">
              <span className="text-[10px] text-slate-400 block mb-1">MULTI-AGENT ORCHESTRATION:</span>
              <div className="text-white font-bold flex items-center justify-between">
                <span>Custom Python Pipeline (4 Agent Classes)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-forge-cyan/20 text-forge-cyan">ACTIVE</span>
              </div>
            </div>

            <div className="p-3 bg-graphite-850 rounded-xl border border-graphite-750">
              <span className="text-[10px] text-slate-400 block mb-1">HUMAN-IN-THE-LOOP SAFETY POLICY:</span>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                Operator authorization required before any recommendation is applied. In this demo, approval updates in-memory simulation state only — no real machine connections.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => resetSimulation()}
                className="w-full py-2.5 rounded-xl bg-graphite-850 hover:bg-graphite-800 border border-graphite-700 text-slate-300 hover:text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESTORE FACTORY GOLDEN STATE</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
