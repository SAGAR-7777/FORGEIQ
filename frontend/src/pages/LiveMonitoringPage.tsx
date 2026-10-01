import React, { useState, useEffect } from 'react';
import {
  Activity, Thermometer, Gauge, RotateCw, Play, Pause,
  Sliders, ArrowUpRight, TrendingUp, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { useFactory } from '../context/FactoryContext';
import { api } from '../services/api';

export const LiveMonitoringPage: React.FC = () => {
  const { machines, selectedMachine, setSelectedMachine, isStreaming } = useFactory();
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!selectedMachine) return;
      try {
        const res = await api.getSensorHistory(selectedMachine.id);
        setHistory(res.history || []);
      } catch (err) {
        console.warn('History fetch failed:', err);
      }
    };
    fetchHistory();
    const interval = setInterval(fetchHistory, 3000);
    return () => clearInterval(interval);
  }, [selectedMachine]);

  const targetMachine = selectedMachine || machines[0];

  return (
    <div className="space-y-6">
      {/* Header & Machine Selector */}
      <div className="bg-graphite-900 border border-graphite-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white font-mono tracking-wide">LIVE SENSOR TELEMETRY</h2>
            <span className="text-[10px] font-mono uppercase bg-forge-cyan/20 text-forge-cyan px-2 py-0.5 rounded border border-forge-cyan/40">
              12 SENSOR CHANNELS ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Continuous streaming surveillance over spindle kinematics, pneumatic regulators, thermal gradients, and surface metrology.
          </p>
        </div>

        {/* Machine Selector */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-slate-400">CHANNEL TARGET:</span>
          <select
            value={targetMachine?.id || 'M-206'}
            onChange={(e) => {
              const m = machines.find((item) => item.id === e.target.value);
              if (m) setSelectedMachine(m);
            }}
            className="bg-graphite-850 border border-graphite-700 text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-forge-cyan text-xs font-mono"
          >
            {machines.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.type})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 12 Monitored Parameters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[
          { label: 'SPINDLE TEMPERATURE', value: `${targetMachine?.temp || 210}°C`, normal: '180–230°C', alert: targetMachine?.temp > 230, unit: '°C' },
          { label: 'VIBRATION RMS', value: `${targetMachine?.vibration || 3.2} mm/s`, normal: '1.5–5.0 mm/s', alert: targetMachine?.vibration > 6.0, unit: 'mm/s' },
          { label: 'HYDRAULIC PRESSURE', value: `${targetMachine?.pressure || 7.4} bar`, normal: '6.5–8.5 bar', alert: targetMachine?.pressure > 9.0, unit: 'bar' },
          { label: 'SPINDLE SPEED', value: `${targetMachine?.rpm || 1450} RPM`, normal: '1200–1600 RPM', alert: targetMachine?.rpm > 1700, unit: 'RPM' },
          { label: 'AXIS FEED RATE', value: `${targetMachine?.speed || 60} m/min`, normal: '45–75 m/min', alert: false, unit: 'm/min' },
          { label: 'DRIVE TORQUE', value: `${targetMachine?.torque || 165} Nm`, normal: '120–210 Nm', alert: targetMachine?.torque > 230, unit: 'Nm' },
          { label: 'CELL HUMIDITY', value: `${targetMachine?.humidity || 42}% RH`, normal: '35–55% RH', alert: false, unit: '%RH' },
          { label: 'CYCLE TIME', value: '28.4 s', normal: '24–38 s', alert: false, unit: 's' },
          { label: 'MATERIAL HARDNESS', value: '52 HRC', normal: '48–54 HRC', alert: false, unit: 'HRC' },
          { label: 'PRODUCTION RATE', value: '112 pcs/hr', normal: '85–130 pcs/hr', alert: false, unit: 'pcs/hr' },
          { label: 'MACHINE CALIBRATION', value: '1.2 µm drift', normal: '0.0–4.0 µm', alert: false, unit: 'µm' },
          { label: 'INSPECTION TOLERANCE', value: '+0.012 mm', normal: '+/-0.05 mm', alert: false, unit: 'mm' },
        ].map((item, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border bg-graphite-900 transition flex flex-col justify-between ${
              item.alert
                ? 'border-rose-500/50 bg-rose-500/5 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                : 'border-graphite-800 hover:border-slate-600'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span className="truncate">{item.label}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${item.alert ? 'bg-rose-400 animate-ping' : 'bg-emerald-400'}`} />
              </div>

              <div className={`text-xl font-extrabold font-mono ${item.alert ? 'text-rose-400' : 'text-slate-100'}`}>
                {item.value}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-graphite-800 text-[9px] font-mono text-slate-400 flex items-center justify-between">
              <span>Norm: {item.normal}</span>
              <span className={item.alert ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                {item.alert ? 'EXCEEDED' : 'OPTIMAL'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Real-time Rolling Data Table */}
      <div className="bg-graphite-900 border border-graphite-800 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-graphite-800">
          <h3 className="text-xs font-bold text-white font-mono uppercase flex items-center gap-2">
            <Activity className="w-4 h-4 text-forge-cyan" />
            HIGH-FREQUENCY TELEMETRY FEED (LAST 15 SAMPLES)
          </h3>
          <span className="text-[10px] font-mono text-slate-400">REFRESH RATE: 2.5s</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-graphite-800 text-[10px] text-slate-400 uppercase">
                <th className="pb-2">TIME</th>
                <th className="pb-2">TEMP (°C)</th>
                <th className="pb-2">VIBRATION (mm/s)</th>
                <th className="pb-2">PRESSURE (bar)</th>
                <th className="pb-2">SPINDLE RPM</th>
                <th className="pb-2">QUALITY SCORE</th>
                <th className="pb-2">DEFECT RISK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-graphite-850">
              {history.slice(-10).reverse().map((pt, idx) => (
                <tr key={idx} className="hover:bg-graphite-850/50 transition">
                  <td className="py-2.5 text-slate-400">{pt.time_str}</td>
                  <td className={`py-2.5 font-bold ${pt.temperature > 230 ? 'text-rose-400' : 'text-slate-200'}`}>
                    {pt.temperature}°C
                  </td>
                  <td className={`py-2.5 font-bold ${pt.vibration > 6.0 ? 'text-rose-400' : 'text-slate-200'}`}>
                    {pt.vibration} mm/s
                  </td>
                  <td className="py-2.5 text-slate-200">{pt.pressure} bar</td>
                  <td className="py-2.5 text-slate-200">{pt.rpm} RPM</td>
                  <td className={`py-2.5 font-bold ${pt.quality_score < 85 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {pt.quality_score}%
                  </td>
                  <td className={`py-2.5 font-bold ${pt.defect_prob > 0.4 ? 'text-rose-400' : 'text-slate-300'}`}>
                    {Math.round(pt.defect_prob * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
