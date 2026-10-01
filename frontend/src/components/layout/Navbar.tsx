import React, { useState } from 'react';
import {
  Search, Bell, Play, Pause, RotateCcw, ShieldCheck,
  Cpu, Sparkles, CheckCircle2, ChevronRight, X, AlertCircle
} from 'lucide-react';
import { useFactory } from '../../context/FactoryContext';

export const Navbar: React.FC = () => {
  const {
    qualitySummary, consensusScore, isStreaming, setIsStreaming,
    resetSimulation, anomalies, recommendations, demoActive, setDemoActive,
    demoStep, runDemoStep, setCurrentView
  } = useFactory();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);

  const activeAnomalies = anomalies.filter(a => a.status === 'active');
  const pendingRecs = recommendations.filter(r => r.approval_status === 'pending');

  const demoStepsList = [
    { num: 1, label: 'Start Factory' },
    { num: 2, label: 'Detect Anomaly' },
    { num: 3, label: 'Analyze Quality' },
    { num: 4, label: 'Predict Defect' },
    { num: 5, label: 'Root Cause' },
    { num: 6, label: 'What-If Sim' },
    { num: 7, label: 'Approve Recipe' },
    { num: 8, label: 'Restore Quality' },
  ];

  return (
    <>
      <header className="h-16 bg-graphite-900/90 border-b border-graphite-800 backdrop-blur-md px-6 flex items-center justify-between z-20 shrink-0">
        {/* Left: Global Search trigger */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-graphite-850 border border-graphite-700/80 hover:border-forge-cyan/50 text-slate-400 hover:text-slate-200 text-xs font-mono transition w-64 text-left shadow-inner"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="flex-1 truncate">Search machines, defects, RAG...</span>
            <kbd className="text-[10px] bg-graphite-800 px-1.5 py-0.5 rounded border border-graphite-700 text-slate-400">Ctrl K</kbd>
          </button>

          {/* Plant Telemetry Status */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-md bg-graphite-850/60 border border-graphite-800 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-forge-emerald animate-pulse" />
            <span className="text-slate-300">STREAMING:</span>
            <span className="text-forge-cyan font-bold">12 MACHINES ONLINE</span>
          </div>
        </div>

        {/* Right: Forge Quality Index, Agent Consensus, Controls */}
        <div className="flex items-center gap-3">
          {/* Forge Quality Index Badge */}
          <div className="group relative">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-graphite-850 border border-forge-cyan/30 text-xs font-mono cursor-pointer hover:border-forge-cyan transition shadow-[0_0_10px_rgba(0,229,255,0.08)]">
              <ShieldCheck className="w-4 h-4 text-forge-cyan" />
              <div className="flex flex-col text-right">
                <span className="text-[9px] text-slate-400 uppercase tracking-tighter">FORGE QUALITY INDEX™</span>
                <span className="text-sm font-extrabold text-forge-cyan leading-none">
                  {qualitySummary ? qualitySummary.forge_quality_index : '94.7'}
                  <span className="text-[10px] font-normal text-slate-400">/100</span>
                </span>
              </div>
            </div>

            {/* Tooltip */}
            <div className="absolute right-0 top-12 w-64 p-3 bg-graphite-900 border border-graphite-700 rounded-lg shadow-xl text-left hidden group-hover:block z-50">
              <div className="flex items-center gap-1.5 text-xs font-bold text-forge-cyan mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Forge Quality Index™ (FQI)</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed mb-2">
                Project-defined composite indicator aggregating process stability (25%), defect probability (20%), sensor health (15%), historical quality (15%), machine condition (15%), and material consistency (10%).
              </p>
              <div className="text-[9px] text-forge-amber font-mono border-t border-graphite-800 pt-1.5">
                Note: Project-defined metric, not an industry-standard certification.
              </div>
            </div>
          </div>

          {/* Agent Consensus Score Badge */}
          <div className="group relative hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-graphite-850 border border-forge-violet/40 text-xs font-mono cursor-pointer">
            <Sparkles className="w-4 h-4 text-forge-violet animate-pulse" />
            <div className="flex flex-col text-right">
              <span className="text-[9px] text-slate-400 uppercase tracking-tighter">AGENT CONSENSUS</span>
              <span className="text-sm font-extrabold text-forge-violet leading-none">
                {consensusScore}%
              </span>
            </div>

            {/* Tooltip */}
            <div className="absolute right-0 top-12 w-60 p-3 bg-graphite-900 border border-graphite-700 rounded-lg shadow-xl text-left hidden group-hover:block z-50">
              <div className="text-xs font-bold text-forge-violet mb-1">Multi-Agent Consensus</div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Represents harmonic agreement across Process Monitoring, Quality Analysis, Defect Prediction, and Process Optimization agents.
              </p>
              <div className="text-[9px] text-forge-amber font-mono border-t border-graphite-800 pt-1 mt-1">
                Project-defined composite consensus metric.
              </div>
            </div>
          </div>

          {/* Stream Play/Pause & Reset */}
          <div className="flex items-center bg-graphite-850 rounded-lg border border-graphite-700 p-0.5">
            <button
              onClick={() => setIsStreaming(!isStreaming)}
              title={isStreaming ? 'Pause Telemetry Stream' : 'Resume Telemetry Stream'}
              className={`p-1.5 rounded-md text-xs font-mono flex items-center gap-1 transition ${
                isStreaming ? 'text-forge-emerald hover:bg-graphite-800' : 'text-forge-amber hover:bg-graphite-800'
              }`}
            >
              {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => resetSimulation()}
              title="Reset Factory to Golden State"
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-graphite-800 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-2 rounded-lg bg-graphite-850 border border-graphite-700 text-slate-300 hover:text-white hover:border-forge-cyan/40 transition relative"
            >
              <Bell className="w-4 h-4" />
              {(activeAnomalies.length > 0 || pendingRecs.length > 0) && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-forge-rose text-[9px] font-bold text-white flex items-center justify-center animate-bounce">
                  {activeAnomalies.length + pendingRecs.length}
                </span>
              )}
            </button>

            {/* Notification Dropdown Drawer */}
            {notifOpen && (
              <div className="absolute right-0 top-12 w-80 bg-graphite-900 border border-graphite-700 rounded-xl shadow-2xl p-4 z-50">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-graphite-800">
                  <span className="text-xs font-bold font-mono text-slate-200">ACTIVE INDUSTRIAL ALERTS</span>
                  <button onClick={() => setNotifOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                  {activeAnomalies.length === 0 && pendingRecs.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs font-mono">
                      No active alerts. All machines within normal bounds.
                    </div>
                  ) : (
                    <>
                      {activeAnomalies.map((a) => (
                        <div
                          key={a.id}
                          onClick={() => {
                            setCurrentView('anomalies');
                            setNotifOpen(false);
                          }}
                          className="p-2.5 rounded-lg bg-graphite-850 border border-forge-amber/30 hover:border-forge-amber transition cursor-pointer text-xs"
                        >
                          <div className="flex items-center justify-between font-mono mb-1">
                            <span className="text-forge-amber font-bold">{a.machine_name}</span>
                            <span className="text-[10px] text-slate-400">{a.time_str}</span>
                          </div>
                          <p className="text-slate-300 text-[11px] leading-tight">{a.parameter} deviation: {a.deviation}</p>
                          <div className="text-[10px] text-forge-amber/80 font-mono mt-1">Severity: {a.severity.toUpperCase()}</div>
                        </div>
                      ))}

                      {pendingRecs.map((r) => (
                        <div
                          key={r.id}
                          onClick={() => {
                            setCurrentView('optimization');
                            setNotifOpen(false);
                          }}
                          className="p-2.5 rounded-lg bg-graphite-850 border border-forge-cyan/40 hover:border-forge-cyan transition cursor-pointer text-xs"
                        >
                          <div className="flex items-center justify-between font-mono mb-1">
                            <span className="text-forge-cyan font-bold">{r.id}</span>
                            <span className="text-[10px] text-forge-emerald">APPROVAL REQUIRED</span>
                          </div>
                          <p className="text-slate-300 text-[11px] leading-tight">{r.title}</p>
                          <div className="text-[10px] text-slate-400 font-mono mt-1">{r.machine_name}</div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Guided Demo Flow Floating Progress Bar */}
      {demoActive && (
        <div className="bg-graphite-900 border-b border-forge-cyan/40 px-6 py-2.5 flex items-center justify-between text-xs font-mono bg-gradient-to-r from-forge-cyan/10 via-graphite-900 to-forge-cyan/10">
          <div className="flex items-center gap-3">
            <span className="text-forge-cyan font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              GUIDED TOUR: STEP {demoStep} OF 8
            </span>
            <span className="text-slate-300 hidden md:inline">
              {demoStepsList.find((s) => s.num === demoStep)?.label}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {demoStepsList.map((step) => (
              <button
                key={step.num}
                onClick={() => runDemoStep(step.num)}
                className={`w-7 h-7 rounded-full text-xs font-bold transition flex items-center justify-center border ${
                  step.num === demoStep
                    ? 'bg-forge-cyan text-graphite-950 border-forge-cyan shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                    : step.num < demoStep
                    ? 'bg-forge-emerald/20 text-forge-emerald border-forge-emerald/40'
                    : 'bg-graphite-850 text-slate-400 border-graphite-750 hover:text-slate-200'
                }`}
                title={step.label}
              >
                {step.num < demoStep ? '✓' : step.num}
              </button>
            ))}

            {demoStep < 8 ? (
              <button
                onClick={() => runDemoStep(demoStep + 1)}
                className="ml-3 px-3 py-1 rounded bg-forge-cyan text-graphite-950 font-bold hover:bg-cyan-300 transition flex items-center gap-1 text-xs"
              >
                <span>NEXT STEP</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setDemoActive(false)}
                className="ml-3 px-3 py-1 rounded bg-forge-emerald text-graphite-950 font-bold hover:bg-emerald-300 transition text-xs"
              >
                FINISH TOUR
              </button>
            )}

            <button
              onClick={() => setDemoActive(false)}
              className="ml-1 p-1 text-slate-400 hover:text-white"
              title="Close Tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 bg-graphite-950/80 backdrop-blur-sm z-50 flex items-start justify-center pt-24">
          <div className="w-full max-w-xl bg-graphite-900 border border-graphite-700 rounded-xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-graphite-800 flex items-center gap-3">
              <Search className="w-5 h-5 text-forge-cyan" />
              <input
                type="text"
                autoFocus
                placeholder="Search machines, anomalies, defects, RAG manuals, ISO standards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none font-mono"
              />
              <button onClick={() => setSearchOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 max-h-80 overflow-y-auto space-y-1">
              <div className="px-3 py-1 text-[10px] font-mono text-slate-400 uppercase">Quick Jump Pages</div>
              {[
                { label: 'Executive Dashboard', view: 'dashboard' },
                { label: 'Digital Factory Twin', view: 'factory_twin' },
                { label: 'What-If Production Simulator', view: 'what_if' },
                { label: 'AI Root-Cause Graph', view: 'root_cause' },
                { label: 'Knowledge Center (RAG)', view: 'knowledge' },
                { label: 'Incident Replay (10:31 - 10:41)', view: 'replay' },
                { label: 'System Architecture (IBM / watsonx)', view: 'architecture' },
              ].map((item) => (
                <button
                  key={item.view}
                  onClick={() => {
                    setCurrentView(item.view);
                    setSearchOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-graphite-800 text-xs text-slate-200 flex items-center justify-between transition"
                >
                  <span>{item.label}</span>
                  <span className="text-[10px] font-mono text-forge-cyan">Navigate →</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
