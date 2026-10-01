import React from 'react';
import {
  AlertTriangle, ShieldAlert, CheckCircle2, Clock,
  ArrowRight, Filter, Flame, GitFork
} from 'lucide-react';
import { useFactory } from '../context/FactoryContext';
import { api } from '../services/api';

export const AnomalyCenterPage: React.FC = () => {
  const { anomalies, refreshData, showToast, setCurrentView, setSelectedMachine, machines } = useFactory();

  const handleResolve = async (anoId: string) => {
    try {
      await api.resolveAnomaly(anoId);
      await refreshData();
      showToast(`Anomaly ${anoId} marked resolved.`);
    } catch (err) {
      showToast('Action failed.');
    }
  };

  const activeAnomalies = anomalies.filter(a => a.status === 'active');
  const resolvedAnomalies = anomalies.filter(a => a.status === 'resolved');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-graphite-900 border border-graphite-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white font-mono tracking-wide">ANOMALY DETECTION CENTER</h2>
            <span className="text-[10px] font-mono uppercase bg-forge-amber/20 text-forge-amber px-2 py-0.5 rounded border border-forge-amber/40">
              MULTIVARIATE SPC &amp; Z-SCORE SURVEILLANCE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Detects sensor spikes, continuous statistical drift, harmonic resonance, and hydraulic instabilities before they manifest as part defects.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="p-3 bg-graphite-850 rounded-xl border border-forge-amber/30 text-center">
            <span className="text-[10px] text-slate-400 block">ACTIVE BREACHES</span>
            <span className="text-xl font-bold font-mono text-forge-amber">{activeAnomalies.length}</span>
          </div>
        </div>
      </div>

      {/* Active Anomalies Detailed Cards */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-white font-mono uppercase flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-forge-amber" />
          ACTIVE SENSOR ANOMALIES ({activeAnomalies.length})
        </h3>

        {activeAnomalies.length === 0 ? (
          <div className="p-12 text-center bg-graphite-900 border border-graphite-800 rounded-2xl text-xs font-mono text-slate-400">
            ✓ All 12 machines operating inside standard ISO/DIN statistical envelopes. Zero active anomalies.
          </div>
        ) : (
          <div className="space-y-3">
            {activeAnomalies.map((ano) => (
              <div
                key={ano.id}
                className="bg-graphite-900 border border-forge-amber/40 rounded-2xl p-5 shadow-xl space-y-4 hover:border-forge-amber transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-graphite-800">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white font-mono">{ano.machine_name}</span>
                    <span className="text-xs font-mono text-forge-cyan bg-graphite-850 px-2 py-0.5 rounded border border-graphite-750">
                      PARAMETER: {ano.parameter.toUpperCase()}
                    </span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                      ano.severity === 'critical'
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    }`}>
                      {ano.severity} SEVERITY
                    </span>
                  </div>

                  <div className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>DETECTED: {ano.time_str}</span>
                  </div>
                </div>

                {/* Numbers Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono bg-graphite-950/70 p-3 rounded-xl border border-graphite-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block">CURRENT VALUE:</span>
                    <span className="text-sm font-extrabold text-rose-400">
                      {ano.current_value} {ano.unit}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">NORMAL ENVELOPE:</span>
                    <span className="text-sm font-bold text-slate-200">{ano.normal_range}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">DEVIATION DELTA:</span>
                    <span className="text-sm font-extrabold text-forge-amber">{ano.deviation}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">DYNAMIC TREND:</span>
                    <span className="text-xs font-bold text-slate-200">{ano.trend}</span>
                  </div>
                </div>

                {/* AI Explanation & Recommendations */}
                <div className="p-3.5 rounded-xl bg-graphite-850 border border-graphite-750 space-y-1">
                  <span className="text-[10px] font-mono text-forge-cyan uppercase font-bold block">
                    AI EXPLANATION &amp; CAUSAL INFERENCE
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">{ano.ai_explanation}</p>
                </div>

                {/* Action Footer */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const m = machines.find((item) => item.id === ano.machine_id);
                        if (m) setSelectedMachine(m);
                        setCurrentView('root_cause');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-graphite-800 hover:bg-graphite-750 text-slate-200 border border-graphite-700 flex items-center gap-1.5 transition"
                    >
                      <GitFork className="w-3.5 h-3.5 text-forge-cyan" />
                      <span>Trace Root Cause</span>
                    </button>
                    <button
                      onClick={() => setCurrentView('what_if')}
                      className="px-3 py-1.5 rounded-lg bg-graphite-800 hover:bg-graphite-750 text-slate-200 border border-graphite-700 transition"
                    >
                      Simulate Fix
                    </button>
                  </div>

                  <button
                    onClick={() => handleResolve(ano.id)}
                    className="px-4 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-graphite-950 border border-emerald-500/40 font-bold transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>MARK MITIGATED / RESOLVED</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
