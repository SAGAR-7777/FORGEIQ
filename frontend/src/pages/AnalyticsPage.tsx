import React, { useState, useEffect } from 'react';
import {
  BarChart3, TrendingUp, Calendar, Filter, PieChart,
  Activity, ShieldCheck, Cpu, ArrowUpRight, Zap
} from 'lucide-react';
import { api } from '../services/api';

export const AnalyticsPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'24 Hours' | '7 Days' | '30 Days'>('24 Hours');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.getAnalytics(timeframe);
        setData(res);
      } catch (err) {
        console.warn('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [timeframe]);

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="bg-graphite-900 border border-graphite-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white font-mono tracking-wide">HISTORICAL QUALITY ANALYTICS</h2>
            <span className="text-[10px] font-mono uppercase bg-forge-cyan/20 text-forge-cyan px-2 py-0.5 rounded border border-forge-cyan/40">
              SIX SIGMA METRICS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Correlate production parameters with defect distributions, Cpk process capabilities, and machine-by-machine yield.
          </p>
        </div>

        {/* Timeframe Filter Buttons */}
        <div className="flex items-center bg-graphite-850 p-1 rounded-xl border border-graphite-750 text-xs font-mono">
          {['24 Hours', '7 Days', '30 Days'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf as any)}
              className={`px-3 py-1.5 rounded-lg transition ${
                timeframe === tf
                  ? 'bg-forge-cyan text-graphite-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quality Score & Defect Rate Trend */}
        <div className="bg-graphite-900 border border-graphite-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-graphite-800">
            <h3 className="text-xs font-bold text-white font-mono uppercase flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-forge-cyan" />
              QUALITY SCORE OVER TIME vs DEFECT RATE
            </h3>
            <span className="text-[10px] font-mono text-slate-400">{timeframe}</span>
          </div>

          <div className="space-y-3">
            {data?.quality_trend?.map((item: any, idx: number) => (
              <div key={idx} className="space-y-1 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>{item.time}</span>
                  <span>
                    Quality: <strong className="text-forge-cyan">{item.quality}%</strong> | Defect Rate: <strong className="text-rose-400">{item.defect_rate}%</strong>
                  </span>
                </div>
                <div className="w-full h-2 bg-graphite-950 rounded-full flex overflow-hidden">
                  <div className="h-full bg-forge-cyan rounded-l-full" style={{ width: `${item.quality}%` }} />
                  <div className="h-full bg-rose-500 rounded-r-full" style={{ width: `${item.defect_rate * 5}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Defect Distribution Breakdown */}
        <div className="bg-graphite-900 border border-graphite-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-graphite-800">
            <h3 className="text-xs font-bold text-white font-mono uppercase flex items-center gap-2">
              <PieChart className="w-4 h-4 text-forge-amber" />
              DEFECT TYPE DISTRIBUTION
            </h3>
            <span className="text-[10px] font-mono text-slate-400">PARETO CLUSTER</span>
          </div>

          <div className="space-y-3">
            {data?.defect_distribution?.map((d: any, idx: number) => (
              <div key={idx} className="p-3 rounded-xl bg-graphite-850 border border-graphite-750 text-xs font-mono space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-white font-bold">{d.type}</span>
                  <span className="text-rose-400 font-bold">{d.pct}% ({d.count} occurrences)</span>
                </div>
                <div className="w-full h-1.5 bg-graphite-950 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-rose-500 rounded-full" style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Machine Comparison */}
        <div className="bg-graphite-900 border border-graphite-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-graphite-800">
            <h3 className="text-xs font-bold text-white font-mono uppercase flex items-center gap-2">
              <Cpu className="w-4 h-4 text-forge-emerald" />
              CROSS-MACHINE PERFORMANCE COMPARISON
            </h3>
            <span className="text-[10px] font-mono text-slate-400">QUALITY INDEX</span>
          </div>

          <div className="space-y-2.5">
            {data?.machine_comparison?.map((m: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-graphite-850 text-xs font-mono">
                <span className="text-white font-bold w-32 truncate">{m.name}</span>
                <div className="flex-1 mx-3 h-1.5 bg-graphite-950 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${m.quality < 85 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                    style={{ width: `${m.quality}%` }}
                  />
                </div>
                <span className="text-slate-200 font-bold w-12 text-right">{m.quality}%</span>
                <span className="text-slate-400 text-[10px] w-20 text-right">Health: {m.health}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Parameter Correlation */}
        <div className="bg-graphite-900 border border-graphite-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-graphite-800">
            <h3 className="text-xs font-bold text-white font-mono uppercase flex items-center gap-2">
              <Activity className="w-4 h-4 text-forge-violet" />
              PARAMETER &amp; DEFECT CORRELATION MATRIX
            </h3>
            <span className="text-[10px] font-mono text-slate-400">PEARSON COEFFICIENT</span>
          </div>

          <div className="space-y-2.5">
            {data?.parameter_correlation?.map((corr: any, idx: number) => (
              <div key={idx} className="p-3 rounded-xl bg-graphite-850 border border-graphite-750 text-xs font-mono flex items-center justify-between">
                <div>
                  <span className="text-white font-bold block">{corr.parameter}</span>
                  <span className="text-[10px] text-slate-400">Statistical Pearson r = {corr.correlation}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  corr.impact === 'Critical'
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                }`}>
                  {corr.impact} Impact
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
