import React, { useState } from 'react';
import {
  Bot, Sparkles, ArrowDown, CheckCircle2, AlertTriangle,
  Clock, ShieldAlert, Cpu, Activity, Play, Zap, ArrowRight, CornerDownRight, FileText
} from 'lucide-react';
import { useFactory } from '../../context/FactoryContext';

export const AgentCommandCenter: React.FC = () => {
  const { agents, consensusScore, triggerAgentRun, machines, selectedMachine, setSelectedMachine, setCurrentView } = useFactory();
  const [runningSync, setRunningSync] = useState(false);

  const handleSync = async () => {
    setRunningSync(true);
    try {
      await triggerAgentRun(selectedMachine?.id || 'M-206');
    } finally {
      setRunningSync(false);
    }
  };

  // Agent icons and colors
  const agentMeta: Record<string, { icon: any; color: string; border: string; glow: string; badge: string }> = {
    'Process Monitoring Agent': {
      icon: Activity,
      color: 'text-forge-cyan',
      border: 'border-cyan-500/40',
      glow: 'shadow-[0_0_20px_rgba(0,229,255,0.15)]',
      badge: 'bg-cyan-500/20 text-cyan-300'
    },
    'Quality Analysis Agent': {
      icon: Cpu,
      color: 'text-forge-emerald',
      border: 'border-emerald-500/40',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]',
      badge: 'bg-emerald-500/20 text-emerald-300'
    },
    'Defect Prediction Agent': {
      icon: AlertTriangle,
      color: 'text-forge-amber',
      border: 'border-amber-500/40',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]',
      badge: 'bg-amber-500/20 text-amber-300'
    },
    'Process Optimization Agent': {
      icon: Sparkles,
      color: 'text-forge-violet',
      border: 'border-violet-500/40',
      glow: 'shadow-[0_0_20px_rgba(139,92,246,0.15)]',
      badge: 'bg-violet-500/20 text-violet-300'
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Consensus Score Banner */}
      <div className="bg-graphite-900 border border-graphite-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-forge-cyan/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white font-mono tracking-wide">AGENT COMMAND CENTER</h2>
              <span className="text-[10px] font-mono uppercase bg-forge-violet/20 text-forge-violet px-2 py-0.5 rounded border border-forge-violet/40">
                ORCHESTRATED MULTI-AGENT SWARM
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Four specialized AI agents collaborate across sensor surveillance, statistical quality analysis, multiclass defect classification, and physics-informed recipe optimization.
            </p>
          </div>

          {/* Right Consensus Card & Action */}
          <div className="flex items-center gap-4">
            {/* Project-Defined Consensus Metric */}
            <div className="p-3.5 bg-graphite-850 rounded-xl border border-forge-violet/40 flex items-center gap-4 shadow-md">
              <div className="w-12 h-12 rounded-full bg-forge-violet/15 border border-forge-violet/40 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-forge-violet animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono font-bold text-slate-200">AGENT CONSENSUS</span>
                  <span className="text-[9px] font-mono text-slate-400 uppercase">(Project-Defined)</span>
                </div>
                <div className="text-2xl font-extrabold font-mono text-forge-violet">
                  {consensusScore}%
                </div>
                <p className="text-[9px] font-mono text-slate-400">Harmonic confidence across all 4 agents</p>
              </div>
            </div>

            {/* Trigger Sync Button */}
            <button
              onClick={handleSync}
              disabled={runningSync}
              className="px-4 py-3 rounded-xl bg-gradient-to-r from-forge-cyan/20 to-forge-blue/30 border border-forge-cyan/50 hover:border-forge-cyan text-forge-cyan font-mono text-xs font-bold flex items-center gap-2 transition shadow-[0_0_15px_rgba(0,229,255,0.2)] disabled:opacity-50"
            >
              <Zap className={`w-4 h-4 ${runningSync ? 'animate-spin' : ''}`} />
              <span>{runningSync ? 'ORCHESTRATING...' : 'TRIGGER AGENT SYNC'}</span>
            </button>
          </div>
        </div>

        {/* Target Machine Selector */}
        <div className="mt-4 pt-4 border-t border-graphite-800 flex items-center gap-3 text-xs font-mono">
          <span className="text-slate-400">ACTIVE TARGET MACHINE:</span>
          <select
            value={selectedMachine?.id || 'M-206'}
            onChange={(e) => {
              const m = machines.find((item) => item.id === e.target.value);
              if (m) setSelectedMachine(m);
            }}
            className="bg-graphite-850 border border-graphite-700 text-white rounded px-2.5 py-1 focus:outline-none focus:border-forge-cyan text-xs font-mono"
          >
            {machines.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.type}) — {m.status.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Inter-Agent Collaboration Communication Timeline */}
      <div className="bg-graphite-900 border border-graphite-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-graphite-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-forge-cyan animate-ping" />
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wide">
              LIVE INTER-AGENT MESSAGE STREAM
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">SEQUENTIAL INFERENCE BUS</span>
        </div>

        {/* Chain Flow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {[
            { step: '01', from: 'PROCESS MONITORING', to: 'QUALITY ANALYSIS', msg: '"Vibration increased 42% on spindle nose (8.4 mm/s)."' },
            { step: '02', from: 'QUALITY ANALYSIS', to: 'DEFECT PREDICTION', msg: '"Pattern deviates +3.82 sigma from ISO 9001 baseline."' },
            { step: '03', from: 'DEFECT PREDICTION', to: 'PROCESS OPTIMIZATION', msg: '"Dimensional inaccuracy probability: 82%."' },
            { step: '04', from: 'OPTIMIZATION', to: 'HUMAN INTERLOCK', msg: '"Recommend reducing RPM by 360 (-20%). Human approval required."' }
          ].map((flow, i) => (
            <div key={flow.step} className="p-3 bg-graphite-850 rounded-xl border border-graphite-750 relative">
              <div className="flex items-center justify-between text-[10px] font-mono text-forge-cyan mb-1.5">
                <span className="font-bold">STEP {flow.step}</span>
                <span className="text-slate-400">{flow.from}</span>
              </div>
              <p className="text-xs text-slate-200 font-mono italic leading-snug">{flow.msg}</p>
              <div className="mt-2 text-[9px] font-mono text-slate-400 flex items-center gap-1">
                <ArrowRight className="w-3 h-3 text-forge-cyan" />
                <span>Dispatched to {flow.to}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Cards for all 4 Agents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {agents.map((agent) => {
          const meta = agentMeta[agent.agent] || {
            icon: Bot,
            color: 'text-slate-200',
            border: 'border-graphite-700',
            glow: '',
            badge: 'bg-graphite-800 text-slate-300'
          };
          const Icon = meta.icon;

          return (
            <div
              key={agent.agent}
              className={`bg-graphite-900 border rounded-2xl p-5 shadow-xl transition-all ${meta.border} ${meta.glow} flex flex-col justify-between`}
            >
              <div>
                {/* Agent Header */}
                <div className="flex items-start justify-between pb-3 mb-3 border-b border-graphite-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-graphite-850 border border-graphite-750 flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${meta.color}`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white font-mono tracking-wide">{agent.agent}</h3>
                      <p className="text-[11px] text-slate-400 font-mono">{agent.agent_role}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border border-current ${meta.badge}`}>
                    {agent.status}
                  </span>
                </div>

                {/* Agent Metric Tickers */}
                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono bg-graphite-950/70 p-2.5 rounded-lg border border-graphite-800 mb-3">
                  <div>
                    <span className="text-slate-400 block">CONFIDENCE:</span>
                    <span className={`text-xs font-bold ${meta.color}`}>
                      {Math.round(agent.confidence * 100)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">LATENCY:</span>
                    <span className="text-xs font-bold text-slate-200">{agent.processing_time}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">STATUS:</span>
                    <span className="text-xs font-bold text-slate-200 uppercase">{agent.status}</span>
                  </div>
                </div>

                {/* Current Task */}
                <div className="text-xs mb-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">CURRENT TASK</span>
                  <p className="text-slate-300 bg-graphite-850 p-2 rounded border border-graphite-800 text-[11px]">
                    {agent.task}
                  </p>
                </div>

                {/* Input & Output */}
                <div className="space-y-2 mb-3 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">INPUT PAYLOAD:</span>
                    <div className="text-slate-300 text-[11px] bg-graphite-950/40 p-2 rounded border border-graphite-800/80 truncate">
                      {agent.input}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-forge-cyan uppercase">AGENT OUTPUT:</span>
                    <div className="text-white text-[11px] bg-graphite-850 p-2 rounded border border-graphite-750 font-sans leading-relaxed">
                      {agent.output}
                    </div>
                  </div>
                </div>

                {/* Reasoning Summary */}
                <div className="text-xs mb-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">REASONING SUMMARY</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed italic bg-graphite-950/50 p-2.5 rounded border border-graphite-800/60">
                    "{agent.reasoning_summary}"
                  </p>
                </div>
              </div>

              {/* Last Action Footer */}
              <div className="pt-2 border-t border-graphite-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>LAST ACTION:</span>
                <span className="text-slate-200 truncate max-w-xs">{agent.last_action}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
