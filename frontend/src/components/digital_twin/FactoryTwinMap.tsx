import React, { useState } from 'react';
import {
  Activity, AlertTriangle, CheckCircle2, Wrench, ShieldAlert,
  Zap, ArrowRight, Gauge, Thermometer, Wind, RotateCw, X, ChevronRight, Sliders
} from 'lucide-react';
import { useFactory } from '../../context/FactoryContext';
import { Machine } from '../../types';

export const FactoryTwinMap: React.FC = () => {
  const { machines, selectedMachine, setSelectedMachine, anomalies, recommendations, setCurrentView } = useFactory();
  const [activeTab, setActiveTab] = useState<'all' | 'stamping' | 'machining' | 'assembly' | 'inspection'>('all');

  const getStatusColor = (status: Machine['status']) => {
    switch (status) {
      case 'normal':
        return {
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/40',
          text: 'text-emerald-400',
          badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
          glow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]',
          dot: 'bg-emerald-400'
        };
      case 'warning':
        return {
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/40',
          text: 'text-amber-400',
          badge: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
          glow: 'shadow-[0_0_15px_rgba(245,158,11,0.25)]',
          dot: 'bg-amber-400'
        };
      case 'critical':
        return {
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/50',
          text: 'text-rose-400',
          badge: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
          glow: 'shadow-[0_0_20px_rgba(239,68,68,0.35)]',
          dot: 'bg-rose-400 animate-ping'
        };
      case 'maintenance':
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/40',
          text: 'text-blue-400',
          badge: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
          glow: 'shadow-[0_0_15px_rgba(59,130,246,0.2)]',
          dot: 'bg-blue-400'
        };
      default:
        return {
          bg: 'bg-graphite-800',
          border: 'border-graphite-700',
          text: 'text-slate-400',
          badge: 'bg-graphite-700 text-slate-300',
          glow: '',
          dot: 'bg-slate-400'
        };
    }
  };

  // Group machines by cell
  const cells = [
    {
      id: 'stamping',
      name: 'CELL 01: STAMPING & FORMING',
      line: 'Line A',
      machines: machines.filter(m => m.id.startsWith('M-1'))
    },
    {
      id: 'machining',
      name: 'CELL 02: 5-AXIS CNC MACHINING',
      line: 'Line B',
      machines: machines.filter(m => m.id.startsWith('M-2'))
    },
    {
      id: 'assembly',
      name: 'CELL 03: ROBOTIC WELDING & ASSEMBLY',
      line: 'Line C',
      machines: machines.filter(m => m.id.startsWith('M-3'))
    },
    {
      id: 'inspection',
      name: 'CELL 04: QUALITY INSPECTION & METROLOGY',
      line: 'Line D',
      machines: machines.filter(m => m.id.startsWith('M-4'))
    }
  ];

  // Active anomalies & recommendations for selected machine
  const selAnomalies = selectedMachine ? anomalies.filter(a => a.machine_id === selectedMachine.id && a.status === 'active') : [];
  const selRecs = selectedMachine ? recommendations.filter(r => r.machine_id === selectedMachine.id) : [];

  return (
    <div className="space-y-6">
      {/* Top Banner & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-graphite-900/80 border border-graphite-800 p-4 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white font-mono tracking-wide">DIGITAL FACTORY TWIN</h2>
            <span className="text-[10px] font-mono uppercase bg-forge-cyan/20 text-forge-cyan px-2 py-0.5 rounded border border-forge-cyan/40">
              REAL-TIME SYNCHRONIZED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive cyber-physical manufacturing map with continuous sensor telemetry streams and anomaly propagation.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-mono bg-graphite-850 px-3 py-1.5 rounded-lg border border-graphite-750">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-slate-300">Normal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-slate-300">Warning</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse" />
            <span className="text-slate-300">Critical</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
            <span className="text-slate-300">Maintenance</span>
          </div>
        </div>
      </div>

      {/* Main Factory Map Canvas */}
      <div className="relative bg-graphite-950 border border-graphite-800/90 rounded-2xl p-6 overflow-hidden shadow-2xl">
        {/* Subtle grid and radar scanline */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
        <div className="absolute inset-0 bg-mesh-glow pointer-events-none" />

        {/* Flow Line Architecture (Raw Material -> Stamping -> CNC -> Assembly -> Inspection -> Finished Goods) */}
        <div className="mb-8 flex items-center justify-between px-4 py-3 bg-graphite-900/90 border border-graphite-800 rounded-xl font-mono text-xs text-slate-300">
          <div className="flex items-center gap-2 text-forge-cyan font-bold">
            <span className="w-2 h-2 rounded-full bg-forge-cyan animate-ping" />
            <span>RAW MATERIAL INGESTION</span>
          </div>
          <div className="flex-1 mx-4 h-0.5 bg-gradient-to-r from-forge-cyan via-forge-blue to-forge-emerald relative overflow-hidden">
            <div className="absolute inset-0 bg-white/40 animate-flow-dash" />
          </div>
          <div className="flex items-center gap-2 text-forge-emerald font-bold">
            <CheckCircle2 className="w-4 h-4 text-forge-emerald" />
            <span>FINISHED GOODS SHIPMENT</span>
          </div>
        </div>

        {/* Cells Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {cells.map((cell, idx) => (
            <div
              key={cell.id}
              className="bg-graphite-900/90 border border-graphite-800 rounded-xl p-4 flex flex-col justify-between relative group hover:border-graphite-700 transition"
            >
              {/* Cell Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-graphite-800/80">
                <div>
                  <span className="text-[10px] font-mono text-forge-cyan uppercase font-bold tracking-tight">{cell.line}</span>
                  <h3 className="text-xs font-bold text-white font-mono">{cell.name}</h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">STAGE 0{idx + 1}</span>
              </div>

              {/* Machine Cards within Cell */}
              <div className="space-y-3">
                {cell.machines.map((machine) => {
                  const style = getStatusColor(machine.status);
                  const isSelected = selectedMachine?.id === machine.id;

                  return (
                    <div
                      key={machine.id}
                      onClick={() => setSelectedMachine(machine)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer select-none relative ${style.bg} ${
                        isSelected
                          ? 'border-forge-cyan ring-1 ring-forge-cyan/50 shadow-[0_0_15px_rgba(0,229,255,0.25)]'
                          : `${style.border} hover:border-slate-500`
                      } ${style.glow}`}
                    >
                      {/* Top Row: Name, Status */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                          <span className="font-mono font-bold text-xs text-white tracking-wide">{machine.name}</span>
                        </div>
                        <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border ${style.badge}`}>
                          {machine.status}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400 mb-2 truncate">{machine.type}</div>

                      {/* Live Telemetry Pills */}
                      <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono bg-graphite-950/60 p-2 rounded border border-graphite-800/80">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">TEMP:</span>
                          <span className={machine.temp > 230 ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                            {machine.temp}°C
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">VIB:</span>
                          <span className={machine.vibration > 6.0 ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                            {machine.vibration} mm/s
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">PRESS:</span>
                          <span className="text-slate-200">{machine.pressure} bar</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">QUALITY:</span>
                          <span className={machine.quality_score < 85 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                            {machine.quality_score}%
                          </span>
                        </div>
                      </div>

                      {/* Defect Probability Bar */}
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                          <span className="text-slate-400">DEFECT RISK:</span>
                          <span className={`font-bold ${machine.defect_prob > 0.4 ? 'text-rose-400' : 'text-slate-300'}`}>
                            {Math.round(machine.defect_prob * 100)}%
                          </span>
                        </div>
                        <div className="w-full h-1 bg-graphite-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              machine.defect_prob > 0.6 ? 'bg-rose-500' : machine.defect_prob > 0.25 ? 'bg-amber-400' : 'bg-emerald-400'
                            }`}
                            style={{ width: `${Math.min(100, machine.defect_prob * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Connecting arrow to next cell */}
              {idx < cells.length - 1 && (
                <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-graphite-800 border border-graphite-700 items-center justify-center text-slate-400 z-20 shadow-md">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Machine Telemetry & Control Drawer */}
      {selectedMachine && (
        <div className="bg-graphite-900 border border-graphite-750 rounded-xl p-5 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-graphite-800 gap-3">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-base font-extrabold text-white font-mono">{selectedMachine.name}</span>
                <span className={`text-xs font-mono uppercase px-2 py-0.5 rounded border ${getStatusColor(selectedMachine.status).badge}`}>
                  STATUS: {selectedMachine.status.toUpperCase()}
                </span>
                <span className="text-xs font-mono text-slate-400 bg-graphite-800 px-2 py-0.5 rounded">
                  {selectedMachine.cell} • {selectedMachine.line}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{selectedMachine.type} — Autonomous Telemetry Monitoring Channel</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('what_if')}
                className="px-3 py-1.5 rounded-lg bg-forge-cyan/20 border border-forge-cyan/40 hover:border-forge-cyan text-forge-cyan text-xs font-mono font-bold flex items-center gap-1.5 transition"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>WHAT-IF SIMULATION</span>
              </button>
              <button
                onClick={() => setCurrentView('root_cause')}
                className="px-3 py-1.5 rounded-lg bg-graphite-800 border border-graphite-700 hover:text-white text-slate-300 text-xs font-mono transition"
              >
                ROOT-CAUSE TRACE →
              </button>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-4">
            <div className="p-3 bg-graphite-850 rounded-lg border border-graphite-800">
              <span className="text-[10px] font-mono text-slate-400 block mb-1">TEMPERATURE</span>
              <span className={`text-base font-bold font-mono ${selectedMachine.temp > 230 ? 'text-rose-400' : 'text-slate-100'}`}>
                {selectedMachine.temp}°C
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">Norm: 180-230°C</span>
            </div>

            <div className="p-3 bg-graphite-850 rounded-lg border border-graphite-800">
              <span className="text-[10px] font-mono text-slate-400 block mb-1">VIBRATION RMS</span>
              <span className={`text-base font-bold font-mono ${selectedMachine.vibration > 6.0 ? 'text-rose-400' : 'text-slate-100'}`}>
                {selectedMachine.vibration} mm/s
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">ISO 10816 Zone D: &gt;7.1</span>
            </div>

            <div className="p-3 bg-graphite-850 rounded-lg border border-graphite-800">
              <span className="text-[10px] font-mono text-slate-400 block mb-1">PRESSURE</span>
              <span className="text-base font-bold font-mono text-slate-100">{selectedMachine.pressure} bar</span>
              <span className="text-[9px] text-slate-400 block mt-0.5">Hydraulic Loop</span>
            </div>

            <div className="p-3 bg-graphite-850 rounded-lg border border-graphite-800">
              <span className="text-[10px] font-mono text-slate-400 block mb-1">SPINDLE RPM</span>
              <span className="text-base font-bold font-mono text-slate-100">{selectedMachine.rpm}</span>
              <span className="text-[9px] text-slate-400 block mt-0.5">Torque: {selectedMachine.torque} Nm</span>
            </div>

            <div className="p-3 bg-graphite-850 rounded-lg border border-graphite-800">
              <span className="text-[10px] font-mono text-slate-400 block mb-1">MACHINE HEALTH</span>
              <span className={`text-base font-bold font-mono ${selectedMachine.health < 75 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {selectedMachine.health}%
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">Predictive Index</span>
            </div>

            <div className="p-3 bg-graphite-850 rounded-lg border border-graphite-800">
              <span className="text-[10px] font-mono text-slate-400 block mb-1">DEFECT RISK</span>
              <span className={`text-base font-bold font-mono ${selectedMachine.defect_prob > 0.4 ? 'text-rose-400' : 'text-slate-100'}`}>
                {Math.round(selectedMachine.defect_prob * 100)}%
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">Scrap: ~{Math.round(selectedMachine.defect_prob * 22)}%</span>
            </div>
          </div>

          {/* Active Anomalies & Staged Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            {/* Anomalies Card */}
            <div className="p-3.5 bg-graphite-850/80 rounded-lg border border-graphite-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold font-mono text-slate-200 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-forge-amber" />
                  ACTIVE ANOMALIES ({selAnomalies.length})
                </span>
              </div>

              {selAnomalies.length === 0 ? (
                <div className="py-4 text-center text-xs font-mono text-slate-400">
                  ✓ No active anomalies detected. Machine operating stably.
                </div>
              ) : (
                <div className="space-y-2">
                  {selAnomalies.map((ano) => (
                    <div key={ano.id} className="p-2.5 rounded bg-graphite-900 border border-forge-amber/30 text-xs">
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-forge-amber font-bold">{ano.parameter} ({ano.current_value} {ano.unit})</span>
                        <span className="text-[10px] text-slate-400">{ano.deviation}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1 leading-tight">{ano.ai_explanation}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommendations Card */}
            <div className="p-3.5 bg-graphite-850/80 rounded-lg border border-graphite-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold font-mono text-slate-200 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-forge-cyan" />
                  AI STAGED RECOMMENDATIONS ({selRecs.length})
                </span>
                <span className="text-[10px] font-mono text-forge-cyan">HUMAN APPROVAL REQUIRED</span>
              </div>

              {selRecs.length === 0 ? (
                <div className="py-4 text-center text-xs font-mono text-slate-400">
                  No adjustments pending. Standard recipe active.
                </div>
              ) : (
                <div className="space-y-2">
                  {selRecs.map((rec) => (
                    <div key={rec.id} className="p-2.5 rounded bg-graphite-900 border border-forge-cyan/30 text-xs">
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-forge-cyan font-bold">{rec.title}</span>
                        <span className={`text-[10px] uppercase font-bold ${
                          rec.approval_status === 'approved' ? 'text-forge-emerald' : 'text-forge-amber'
                        }`}>
                          {rec.approval_status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1">{rec.reasoning}</p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-graphite-800 text-[10px] font-mono">
                        <span className="text-slate-400">Impact: {rec.expected_impact.defect_probability}</span>
                        <span className="text-forge-cyan font-bold">Confidence: {Math.round(rec.confidence * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
