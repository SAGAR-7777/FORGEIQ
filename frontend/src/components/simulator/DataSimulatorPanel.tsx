import React, { useState } from 'react';
import {
  Flame, Play, Pause, RotateCcw, AlertTriangle,
  Thermometer, Gauge, Zap, Wrench, ShieldAlert, Cpu, ArrowRight, CheckCircle2, Activity
} from 'lucide-react';
import { useFactory } from '../../context/FactoryContext';

export const DataSimulatorPanel: React.FC = () => {
  const {
    machines, selectedMachine, setSelectedMachine, isStreaming,
    setIsStreaming, resetSimulation, injectFault, setCurrentView
  } = useFactory();

  const [injecting, setInjecting] = useState<string | null>(null);
  const [lastInjectionResult, setLastInjectionResult] = useState<any>(null);

  const faultTypes = [
    {
      id: 'vibration_anomaly',
      name: 'Vibration Spike (8.6 mm/s)',
      icon: Activity,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/30 hover:border-rose-500',
      description: 'Injects severe spindle harmonic vibration breaching ISO 10816 Zone D (critical bearing failure risk).'
    },
    {
      id: 'temperature_spike',
      name: 'Thermal Runaway (258°C)',
      icon: Thermometer,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30 hover:border-amber-500',
      description: 'Simulates coolant starvation triggering rapid thermal expansion of spindle housing.'
    },
    {
      id: 'pressure_spike',
      name: 'Pressure Surge (10.4 bar)',
      icon: Gauge,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30 hover:border-purple-500',
      description: 'Triggers hydraulic line pressure surge destabilizing automated clamping torque.'
    },
    {
      id: 'tool_wear',
      name: 'Carbide Tool Flank Wear',
      icon: Wrench,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30 hover:border-cyan-500',
      description: 'Accelerates progressive tool degradation to 78% life consumed, inducing surface chatter.'
    },
    {
      id: 'material_variation',
      name: 'Raw Alloy Hardness Drift (+4 HRC)',
      icon: Zap,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500',
      description: 'Injects metallurgical alloy hardness variation causing abrasive wear and cutting resistance.'
    },
    {
      id: 'machine_degradation',
      name: 'Mechanical System Degradation',
      icon: ShieldAlert,
      color: 'text-red-400 bg-red-500/10 border-red-500/30 hover:border-red-500',
      description: 'Drops machine overall mechanical health to 54%, cascading multi-variate anomalies.'
    }
  ];

  const handleInject = async (faultId: string) => {
    const targetId = selectedMachine?.id || 'M-206';
    setInjecting(faultId);
    try {
      const res = await injectFault(targetId, faultId);
      setLastInjectionResult(res);
    } finally {
      setInjecting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-graphite-900 border border-graphite-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white font-mono tracking-wide">MANUFACTURING DATA SIMULATOR</h2>
              <span className="text-[10px] font-mono uppercase bg-forge-cyan/20 text-forge-cyan px-2 py-0.5 rounded border border-forge-cyan/40">
                ACTIVE FAULT INJECTOR
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Inject controlled mechanical, thermal, and material faults into the factory stream. Observe the 4-agent cascade react instantaneously: Monitoring detects → Quality analyzes → Defect predicts → Optimization recommends.
            </p>
          </div>

          {/* Stream Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 border transition ${
                isStreaming
                  ? 'bg-forge-emerald/20 text-forge-emerald border-forge-emerald/40 hover:bg-forge-emerald hover:text-graphite-950'
                  : 'bg-forge-amber/20 text-forge-amber border-forge-amber/40 hover:bg-forge-amber hover:text-graphite-950'
              }`}
            >
              {isStreaming ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isStreaming ? 'STREAMING ACTIVE' : 'STREAM PAUSED'}</span>
            </button>

            <button
              onClick={() => resetSimulation()}
              className="px-4 py-2.5 rounded-xl bg-graphite-850 hover:bg-graphite-800 text-slate-200 border border-graphite-750 font-mono text-xs font-bold flex items-center gap-2 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>RESET FACTORY</span>
            </button>
          </div>
        </div>

        {/* Target Machine Selector */}
        <div className="mt-5 pt-4 border-t border-graphite-800 flex items-center gap-3 text-xs font-mono">
          <span className="text-slate-400">INJECTION TARGET MACHINE:</span>
          <select
            value={selectedMachine?.id || 'M-206'}
            onChange={(e) => {
              const m = machines.find((item) => item.id === e.target.value);
              if (m) setSelectedMachine(m);
            }}
            className="bg-graphite-850 border border-graphite-700 text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-forge-cyan text-xs font-mono"
          >
            {machines.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.type}) — STATUS: {m.status.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 6 Fault Injection Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {faultTypes.map((fault) => {
          const Icon = fault.icon;
          const isCurrent = injecting === fault.id;

          return (
            <div
              key={fault.id}
              className={`p-5 rounded-2xl border transition-all bg-graphite-900 flex flex-col justify-between ${fault.color}`}
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-graphite-850 border border-graphite-750 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xs font-bold text-white font-mono uppercase">{fault.name}</h3>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">{fault.description}</p>
              </div>

              <button
                onClick={() => handleInject(fault.id)}
                disabled={injecting !== null}
                className="w-full py-2.5 rounded-xl bg-graphite-850 hover:bg-graphite-800 border border-current font-mono text-xs font-bold flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <Flame className={`w-3.5 h-3.5 ${isCurrent ? 'animate-bounce' : ''}`} />
                <span>{isCurrent ? 'INJECTING FAULT...' : 'TRIGGER ANOMALY'}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Reactive Multi-Agent Response Banner */}
      {lastInjectionResult && (
        <div className="bg-graphite-900 border border-forge-cyan/40 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-graphite-800">
            <span className="text-xs font-mono font-bold text-forge-cyan uppercase flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-forge-emerald" />
              MULTI-AGENT PIPELINE CONVERGED
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Consensus Score: {lastInjectionResult.pipeline_result?.consensus_score}%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 bg-graphite-850 rounded-xl border border-graphite-750">
              <span className="text-[10px] text-forge-cyan block mb-1">1. MONITORING</span>
              <p className="text-slate-300 text-[11px] leading-tight">
                {lastInjectionResult.pipeline_result?.agents?.process_monitoring?.output}
              </p>
            </div>

            <div className="p-3 bg-graphite-850 rounded-xl border border-graphite-750">
              <span className="text-[10px] text-forge-emerald block mb-1">2. QUALITY ANALYSIS</span>
              <p className="text-slate-300 text-[11px] leading-tight">
                {lastInjectionResult.pipeline_result?.agents?.quality_analysis?.output}
              </p>
            </div>

            <div className="p-3 bg-graphite-850 rounded-xl border border-graphite-750">
              <span className="text-[10px] text-forge-amber block mb-1">3. DEFECT PREDICTION</span>
              <p className="text-slate-300 text-[11px] leading-tight">
                {lastInjectionResult.pipeline_result?.agents?.defect_prediction?.output}
              </p>
            </div>

            <div className="p-3 bg-graphite-850 rounded-xl border border-graphite-750">
              <span className="text-[10px] text-forge-violet block mb-1">4. OPTIMIZATION</span>
              <p className="text-slate-300 text-[11px] leading-tight">
                {lastInjectionResult.pipeline_result?.agents?.process_optimization?.output}
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              onClick={() => setCurrentView('root_cause')}
              className="px-4 py-2 rounded-lg bg-graphite-800 hover:bg-graphite-750 text-slate-200 text-xs font-mono"
            >
              Inspect Root Cause Graph →
            </button>
            <button
              onClick={() => setCurrentView('optimization')}
              className="px-4 py-2 rounded-lg bg-forge-cyan text-graphite-950 font-bold hover:bg-cyan-300 text-xs font-mono"
            >
              View Staged Recommendation →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
