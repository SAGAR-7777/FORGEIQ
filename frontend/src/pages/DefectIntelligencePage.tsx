import React from 'react';
import {
  Target, ShieldAlert, Sparkles, TrendingUp, AlertTriangle,
  ArrowRight, Activity, GitFork, Sliders, CheckCircle2, History
} from 'lucide-react';
import { useFactory } from '../context/FactoryContext';

export const DefectIntelligencePage: React.FC = () => {
  const { defects, selectedMachine, setCurrentView } = useFactory();

  const primaryDefect = defects[0] || {
    id: 'DEF-701',
    machine_id: 'M-206',
    machine_name: 'CNC-MILL #06',
    defect_type: 'Dimensional Inaccuracy',
    probability: 0.82,
    probability_pct: '82%',
    risk_level: 'CRITICAL',
    confidence: 0.91,
    confidence_pct: '91%',
    top_contributors: [
      { name: 'Temperature deviation', impact: '+31%', value: '256.1°C vs 210°C baseline' },
      { name: 'Pressure instability', impact: '+24%', value: '9.3 bar fluctuating' },
      { name: 'Vibration harmonic', impact: '+18%', value: '8.4 mm/s RMS' },
      { name: 'Material variation', impact: '+12%', value: 'Batch alloy hardness +4 HRC' }
    ],
    predicted_scrap_rate: '18.4%',
    affected_batch: 'BATCH-2026-09A',
    similar_incidents: ['INC-882 (Jan 14)', 'INC-791 (Dec 03)', 'INC-612 (Nov 19)'],
    timestamp: new Date().toISOString()
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-graphite-900 border border-graphite-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white font-mono tracking-wide">DEFECT INTELLIGENCE &amp; PREDICTION</h2>
              <span className="text-[10px] font-mono uppercase bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded border border-rose-500/40">
                PROACTIVE FAILURE PREVENTION
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Multi-factor surrogate model (sigmoid-weighted linear formula) estimating defect risk from sensor deviations. Not a trained ML classifier — outputs are demo approximations.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-300 bg-graphite-850 px-3 py-1.5 rounded-lg border border-graphite-750">
            TARGET: <strong className="text-white">{primaryDefect.machine_name}</strong>
          </div>
        </div>
      </div>

      {/* 4 Core Intelligence Cards (Section 10) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-graphite-900 border border-rose-500/50 rounded-2xl shadow-xl">
          <span className="text-[10px] font-mono text-slate-400 block mb-1">DEFECT PROBABILITY</span>
          <div className="text-3xl font-extrabold font-mono text-rose-400">
            {primaryDefect.probability_pct}
          </div>
          <span className="text-[10px] text-rose-400/80 font-mono mt-1 block">
            High risk of part rejection
          </span>
        </div>

        <div className="p-4 bg-graphite-900 border border-graphite-800 rounded-2xl shadow-xl">
          <span className="text-[10px] font-mono text-slate-400 block mb-1">RISK LEVEL</span>
          <div className="text-2xl font-extrabold font-mono text-rose-400 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span>{primaryDefect.risk_level}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">
            Severity priority 01
          </span>
        </div>

        <div className="p-4 bg-graphite-900 border border-graphite-800 rounded-2xl shadow-xl">
          <span className="text-[10px] font-mono text-slate-400 block mb-1">PREDICTED DEFECT</span>
          <div className="text-sm font-bold font-mono text-white truncate">
            {primaryDefect.defect_type}
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">
            Tolerance +0.14 mm drift
          </span>
        </div>

        <div className="p-4 bg-graphite-900 border border-graphite-800 rounded-2xl shadow-xl">
          <span className="text-[10px] font-mono text-slate-400 block mb-1">HEURISTIC CONFIDENCE</span>
          <div className="text-3xl font-extrabold font-mono text-forge-cyan">
            {primaryDefect.confidence_pct}
          </div>
          <span className="text-[10px] text-amber-400/80 font-mono mt-1 block">
            Fixed heuristic — not validated
          </span>
        </div>
      </div>

      {/* Explainable AI: Feature Importance Contributors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Top Contributors Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-graphite-900 border border-graphite-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-graphite-800">
            <div>
              <span className="text-[10px] font-mono text-forge-cyan uppercase font-bold tracking-tight">EXPLAINABLE AI (XAI)</span>
              <h3 className="text-sm font-bold text-white font-mono">TOP CONTRIBUTING PARAMETER FACTORS</h3>
            </div>
            <span className="text-[10px] font-mono text-amber-400">SURROGATE CONTRIBUTION WEIGHTS</span>
          </div>

          <div className="space-y-4">
            {primaryDefect.top_contributors.map((c, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-graphite-850 border border-graphite-750 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white font-bold">{c.name}</span>
                  <span className="text-rose-400 font-extrabold">{c.impact} IMPACT</span>
                </div>

                {/* Impact progress bar */}
                <div className="w-full h-1.5 bg-graphite-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-forge-amber to-rose-500 rounded-full"
                    style={{ width: c.impact.replace('+', '') }}
                  />
                </div>

                <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
                  <span>Measured: {c.value}</span>
                  <span className="text-slate-300">Dominant Factor</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Historical Comparison & Actions (5 cols) */}
        <div className="lg:col-span-5 bg-graphite-900 border border-graphite-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-graphite-800">
            <span className="text-xs font-bold font-mono text-white uppercase flex items-center gap-2">
              <History className="w-4 h-4 text-forge-cyan" />
              SIMILAR HISTORICAL INCIDENTS
            </span>
          </div>

          <div className="space-y-2.5">
            {primaryDefect.similar_incidents.map((inc, i) => (
              <div key={i} className="p-3 rounded-xl bg-graphite-850 border border-graphite-750 text-xs font-mono flex items-center justify-between">
                <div>
                  <span className="text-forge-cyan font-bold block">{inc}</span>
                  <span className="text-[10px] text-slate-400">Bore diameter out-of-tolerance</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-graphite-950 text-slate-300 border border-graphite-800">
                  RCA Available
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-graphite-950 border border-graphite-800 space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">PROJECTED BATCH SCRAP IMPACT</span>
            <div className="text-xl font-extrabold font-mono text-rose-400">{primaryDefect.predicted_scrap_rate}</div>
            <p className="text-xs text-slate-300 leading-snug">
              Unmitigated operation across Batch #09A would scrap ~38 workpieces ($4,200 scrap cost).
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => setCurrentView('root_cause')}
              className="w-full py-2.5 rounded-xl bg-graphite-850 hover:bg-graphite-800 border border-graphite-750 text-slate-200 font-mono text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <GitFork className="w-3.5 h-3.5 text-forge-cyan" />
              <span>INSPECT ROOT CAUSE GRAPH</span>
            </button>
            <button
              onClick={() => setCurrentView('what_if')}
              className="w-full py-2.5 rounded-xl bg-forge-cyan text-graphite-950 hover:bg-cyan-300 font-mono text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>SIMULATE RECIPE MITIGATION</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
