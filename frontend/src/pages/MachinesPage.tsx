import React, { useState } from 'react';
import {
  Cpu, Thermometer, Wind, Gauge, Activity, RotateCw,
  Sliders, ArrowRight, Search, Filter, ShieldCheck, AlertTriangle
} from 'lucide-react';
import { useFactory } from '../context/FactoryContext';
import { Machine } from '../types';

export const MachinesPage: React.FC = () => {
  const { machines, selectedMachine, setSelectedMachine, setCurrentView } = useFactory();
  const [filterCell, setFilterCell] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filtered = machines.filter((m) => {
    if (filterCell !== 'all' && !m.cell.toLowerCase().includes(filterCell.toLowerCase())) return false;
    if (filterStatus !== 'all' && m.status !== filterStatus) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.type.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-graphite-900 border border-graphite-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white font-mono tracking-wide">CONNECTED MACHINES FLEET</h2>
              <span className="text-[10px] font-mono uppercase bg-forge-cyan/20 text-forge-cyan px-2 py-0.5 rounded border border-forge-cyan/40">
                12 TELEMETRY CHANNELS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Real-time monitoring across 12 automated machining, stamping, assembly, and inspection units. Inspect live telemetry, thermal gradients, and health indicators.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">TOTAL MONITORED:</span>
            <span className="text-forge-cyan font-bold bg-graphite-850 px-2.5 py-1 rounded border border-graphite-750">
              12 UNITS
            </span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-graphite-800 text-xs font-mono">
          <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-graphite-850 px-3 py-1.5 rounded-lg border border-graphite-750">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search machine name or type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-white placeholder-slate-400 focus:outline-none w-full text-xs font-mono"
            />
          </div>

          <select
            value={filterCell}
            onChange={(e) => setFilterCell(e.target.value)}
            className="bg-graphite-850 border border-graphite-750 text-slate-200 px-3 py-1.5 rounded-lg focus:outline-none focus:border-forge-cyan text-xs font-mono"
          >
            <option value="all">All Manufacturing Cells</option>
            <option value="Stamping">Stamping Cell</option>
            <option value="Machining">CNC Machining Cell</option>
            <option value="Assembly">Assembly Cell</option>
            <option value="Inspection">Inspection Cell</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-graphite-850 border border-graphite-750 text-slate-200 px-3 py-1.5 rounded-lg focus:outline-none focus:border-forge-cyan text-xs font-mono"
          >
            <option value="all">All Statuses</option>
            <option value="normal">Normal (Green)</option>
            <option value="warning">Warning (Yellow)</option>
            <option value="critical">Critical (Red)</option>
            <option value="maintenance">Maintenance (Blue)</option>
          </select>
        </div>
      </div>

      {/* Machine Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((machine) => {
          const isSelected = selectedMachine?.id === machine.id;
          return (
            <div
              key={machine.id}
              onClick={() => setSelectedMachine(machine)}
              className={`p-4 rounded-xl border transition-all cursor-pointer select-none bg-graphite-900 flex flex-col justify-between ${
                isSelected
                  ? 'border-forge-cyan ring-1 ring-forge-cyan/50 shadow-[0_0_20px_rgba(0,229,255,0.2)] bg-graphite-850'
                  : 'border-graphite-800 hover:border-slate-600'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-1.5 font-mono">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      machine.status === 'critical' ? 'bg-rose-400 animate-ping' :
                      machine.status === 'warning' ? 'bg-amber-400' :
                      machine.status === 'maintenance' ? 'bg-blue-400' : 'bg-emerald-400'
                    }`} />
                    <span className="text-xs font-bold text-white tracking-wide">{machine.name}</span>
                  </div>
                  <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                    machine.status === 'critical' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' :
                    machine.status === 'warning' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                    machine.status === 'maintenance' ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' :
                    'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  }`}>
                    {machine.status}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 truncate mb-3">{machine.type}</div>

                {/* Telemetry Numbers */}
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-graphite-950/70 p-2.5 rounded-lg border border-graphite-800 mb-3">
                  <div>
                    <span className="text-slate-400 block">TEMP:</span>
                    <span className={`text-xs font-bold ${machine.temp > 230 ? 'text-rose-400' : 'text-slate-100'}`}>
                      {machine.temp}°C
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">VIBRATION:</span>
                    <span className={`text-xs font-bold ${machine.vibration > 6.0 ? 'text-rose-400' : 'text-slate-100'}`}>
                      {machine.vibration} mm/s
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">PRESSURE:</span>
                    <span className="text-xs font-bold text-slate-100">{machine.pressure} bar</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">SPEED:</span>
                    <span className="text-xs font-bold text-slate-100">{machine.rpm} RPM</span>
                  </div>
                </div>

                {/* Quality & Defect Risk */}
                <div className="space-y-1.5 text-[10px] font-mono mb-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">QUALITY SCORE:</span>
                    <span className={machine.quality_score < 85 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {machine.quality_score}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">DEFECT RISK:</span>
                    <span className={machine.defect_prob > 0.4 ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                      {Math.round(machine.defect_prob * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-1 bg-graphite-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${machine.defect_prob > 0.5 ? 'bg-rose-500' : 'bg-emerald-400'}`}
                      style={{ width: `${Math.min(100, machine.defect_prob * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-2 border-t border-graphite-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>{machine.cell}</span>
                <span className="text-forge-cyan font-bold flex items-center gap-1">
                  Inspect →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
