import React from 'react';
import {
  ShieldCheck, AlertTriangle, Cpu, Activity, TrendingUp,
  TrendingDown, CheckCircle2, Sliders, ArrowRight, Zap, Play, Sparkles, Bot, BarChart3
} from 'lucide-react';
import { useFactory } from '../context/FactoryContext';
import { FactoryTwinMap } from '../components/digital_twin/FactoryTwinMap';

export const ExecutiveDashboard: React.FC = () => {
  const {
    qualitySummary, machines, anomalies, defects, recommendations,
    agents, consensusScore, setCurrentView, setSelectedMachine
  } = useFactory();

  const activeAnomalies = anomalies.filter(a => a.status === 'active');
  const pendingRecs = recommendations.filter(r => r.approval_status === 'pending');

  return (
    <div className="space-y-6">
      {/* Top Key Performance Indicator Cards (Section 17) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Quality Score */}
        <div className="p-4 bg-graphite-900 border border-graphite-800 rounded-xl shadow-md">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
            <span>QUALITY SCORE</span>
            <span className="w-2 h-2 rounded-full bg-forge-cyan animate-pulse" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-forge-cyan">
            {qualitySummary ? qualitySummary.factory_quality_score : '96.4'}%
          </div>
          <div className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +1.2% this shift
          </div>
        </div>

        {/* Defect Risk */}
        <div className="p-4 bg-graphite-900 border border-graphite-800 rounded-xl shadow-md">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
            <span>DEFECT RISK</span>
            <span className="w-2 h-2 rounded-full bg-rose-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-rose-400">
            {qualitySummary ? qualitySummary.factory_defect_risk : '8.2'}%
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">
            Scrap estimate: 2.1%
          </div>
        </div>

        {/* Active Anomalies */}
        <div className="p-4 bg-graphite-900 border border-graphite-800 rounded-xl shadow-md">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
            <span>ACTIVE ANOMALIES</span>
            <span className="w-2 h-2 rounded-full bg-forge-amber animate-ping" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-forge-amber">
            {activeAnomalies.length < 10 ? `0${activeAnomalies.length}` : activeAnomalies.length}
          </div>
          <div className="text-[10px] text-amber-400 font-mono mt-1">
            CNC-MILL #06 critical
          </div>
        </div>

        {/* Machines Online */}
        <div className="p-4 bg-graphite-900 border border-graphite-800 rounded-xl shadow-md">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
            <span>MACHINES ONLINE</span>
            <span className="w-2 h-2 rounded-full bg-forge-emerald" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-white">
            {qualitySummary ? qualitySummary.machines_online : '11/12'}
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">
            1 in scheduled maint.
          </div>
        </div>

        {/* Machine Health */}
        <div className="p-4 bg-graphite-900 border border-graphite-800 rounded-xl shadow-md">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
            <span>MACHINE HEALTH</span>
            <span className="w-2 h-2 rounded-full bg-forge-emerald" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-forge-emerald">
            {qualitySummary ? `${qualitySummary.average_machine_health}%` : '91%'}
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">
            Predictive index
          </div>
        </div>

        {/* Production Units */}
        <div className="p-4 bg-graphite-900 border border-graphite-800 rounded-xl shadow-md">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
            <span>TOTAL PRODUCTION</span>
            <span className="w-2 h-2 rounded-full bg-forge-cyan" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-white">
            {qualitySummary ? qualitySummary.total_production.toLocaleString() : '12,480'}
          </div>
          <div className="text-[10px] text-emerald-400 font-mono mt-1">
            Batch 2026-09A on track
          </div>
        </div>
      </div>

      {/* Main Digital Factory Twin Overview Section */}
      <FactoryTwinMap />

      {/* Two Column Layout: Active Alerts & Staged Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Anomalies & Alerts */}
        <div className="bg-graphite-900 border border-graphite-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-graphite-800">
            <h3 className="text-xs font-bold text-white font-mono uppercase flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-forge-amber" />
              ACTIVE ANOMALIES ({activeAnomalies.length})
            </h3>
            <button
              onClick={() => setCurrentView('anomalies')}
              className="text-[11px] font-mono text-forge-cyan hover:underline flex items-center gap-1"
            >
              View Anomaly Center <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {activeAnomalies.map((ano) => (
              <div
                key={ano.id}
                onClick={() => {
                  const m = machines.find((item) => item.id === ano.machine_id);
                  if (m) setSelectedMachine(m);
                  setCurrentView('root_cause');
                }}
                className="p-3 rounded-xl bg-graphite-850 border border-forge-amber/30 hover:border-forge-amber transition cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-white font-bold">{ano.machine_name} — {ano.parameter}</span>
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                    ano.severity === 'critical'
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  }`}>
                    {ano.severity} ({ano.deviation})
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-tight">{ano.ai_explanation}</p>
                <div className="mt-2 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                  <span>{ano.trend}</span>
                  <span className="text-forge-cyan">Trace Root Cause →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations Queue (Human in the loop) */}
        <div className="bg-graphite-900 border border-graphite-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-graphite-800">
            <h3 className="text-xs font-bold text-white font-mono uppercase flex items-center gap-2">
              <Sliders className="w-4 h-4 text-forge-cyan" />
              STAGED AI RECOMMENDATIONS ({pendingRecs.length})
            </h3>
            <button
              onClick={() => setCurrentView('optimization')}
              className="text-[11px] font-mono text-forge-cyan hover:underline flex items-center gap-1"
            >
              Open Copilot <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {pendingRecs.map((rec) => (
              <div
                key={rec.id}
                onClick={() => setCurrentView('optimization')}
                className="p-3 rounded-xl bg-graphite-850 border border-forge-cyan/30 hover:border-forge-cyan transition cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-white font-bold">{rec.machine_name}</span>
                  <span className="text-[10px] text-forge-amber font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    SIGN-OFF PENDING
                  </span>
                </div>
                <h4 className="text-xs text-forge-cyan font-mono font-medium mb-1">{rec.title}</h4>
                <p className="text-xs text-slate-300 leading-tight line-clamp-2">{rec.reasoning}</p>
                <div className="mt-2 pt-2 border-t border-graphite-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Expected Defect Drop: {rec.expected_impact.defect_probability}</span>
                  <span className="text-forge-cyan font-bold">Review &amp; Authorize →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
