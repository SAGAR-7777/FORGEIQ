import React from 'react';
import {
  LayoutDashboard, Network, Cpu, Activity, AlertTriangle,
  Target, GitFork, Sliders, Sparkles, Bot, MessageSquareText,
  BookOpen, BarChart3, History, FileText, Flame, Layers, Settings, PlayCircle
} from 'lucide-react';
import { useFactory } from '../../context/FactoryContext';

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, anomalies, recommendations, setDemoActive, setDemoStep } = useFactory();

  const activeAnomaliesCount = anomalies.filter(a => a.status === 'active').length;
  const pendingRecsCount = recommendations.filter(r => r.approval_status === 'pending').length;

  const navGroups = [
    {
      title: 'OPERATIONS',
      items: [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: 'factory_twin', label: 'Factory Twin', icon: Network, badge: 'Live 3D' },
        { id: 'machines', label: 'Machines', icon: Cpu },
        { id: 'live_monitoring', label: 'Live Monitoring', icon: Activity },
        { id: 'anomalies', label: 'Anomaly Center', icon: AlertTriangle, count: activeAnomaliesCount, countColor: 'text-forge-amber bg-amber-500/10 border-amber-500/30' },
      ]
    },
    {
      title: 'AI INTELLIGENCE',
      items: [
        { id: 'defects', label: 'Defect Intelligence', icon: Target },
        { id: 'root_cause', label: 'Root Cause Graph', icon: GitFork },
        { id: 'optimization', label: 'Optimization Copilot', icon: Sliders, count: pendingRecsCount, countColor: 'text-forge-cyan bg-cyan-500/10 border-cyan-500/30' },
        { id: 'what_if', label: 'What-If Simulator', icon: Sparkles },
      ]
    },
    {
      title: 'MULTI-AGENT & RAG',
      items: [
        { id: 'agents', label: 'AI Agents', icon: Bot, badge: '4 Active' },
        { id: 'copilot', label: 'Forge Copilot', icon: MessageSquareText },
        { id: 'knowledge', label: 'Knowledge Center', icon: BookOpen },
      ]
    },
    {
      title: 'ANALYTICS & REPLAY',
      items: [
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'replay', label: 'Incident Replay', icon: History },
        { id: 'reports', label: 'Quality Reports', icon: FileText },
      ]
    },
    {
      title: 'CONTROL & SYSTEM',
      items: [
        { id: 'simulator', label: 'Data Simulator', icon: Flame, badge: 'Injector' },
        { id: 'architecture', label: 'System Architecture', icon: Layers },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-graphite-900 border-r border-graphite-800 flex flex-col h-screen select-none shrink-0 overflow-y-auto">
      {/* Brand Header */}
      <div 
        onClick={() => setCurrentView('landing')}
        className="p-5 border-b border-graphite-800/80 flex items-center justify-between cursor-pointer hover:bg-graphite-850/60 transition group"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-forge-cyan/20 to-forge-blue/30 border border-forge-cyan/40 flex items-center justify-center text-forge-cyan font-mono font-bold text-lg shadow-[0_0_15px_rgba(0,229,255,0.25)]">
            FQ
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-wider text-white">FORGE<span className="text-forge-cyan">IQ</span></span>
              <span className="text-[10px] font-mono uppercase bg-forge-cyan/15 text-forge-cyan px-1.5 py-0.5 rounded border border-forge-cyan/30">AI</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-tight">Quality Intelligence OS</p>
          </div>
        </div>
      </div>

      {/* Guided Tour Banner */}
      <div className="p-3 border-b border-graphite-800/60">
        <button
          onClick={() => {
            setDemoActive(true);
            setDemoStep(1);
            setCurrentView('dashboard');
          }}
          className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-forge-cyan/20 via-forge-blue/20 to-forge-cyan/10 border border-forge-cyan/40 hover:border-forge-cyan text-forge-cyan font-mono text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm hover:shadow-[0_0_15px_rgba(0,229,255,0.2)]"
        >
          <PlayCircle className="w-4 h-4 animate-pulse" />
          <span>START GUIDED DEMO</span>
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.title}>
            <div className="px-3 mb-2 text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">
              {group.title}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition group ${
                      isActive
                        ? 'bg-forge-cyan/15 text-forge-cyan border border-forge-cyan/30 shadow-[0_0_10px_rgba(0,229,255,0.1)]'
                        : 'text-slate-300 hover:text-white hover:bg-graphite-850/80 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 transition ${isActive ? 'text-forge-cyan' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-graphite-800 text-slate-400 border border-graphite-700">
                          {item.badge}
                        </span>
                      )}
                      {item.count !== undefined && item.count > 0 && (
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full border ${item.countColor}`}>
                          {item.count}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Profile & Machine Health */}
      <div className="p-3 border-t border-graphite-800/80 bg-graphite-950/40 text-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-forge-emerald animate-ping" />
            <span className="text-[11px] font-mono text-slate-300 font-medium">PLANT 04 • ACTIVE</span>
          </div>
          <span className="text-[10px] font-mono text-forge-cyan font-bold">CPK 1.68</span>
        </div>
        <div className="text-[10px] text-slate-400 flex items-center justify-between font-mono">
          <span>OPERATOR: SAGAR</span>
          <span className="text-slate-400">SHIFT A</span>
        </div>
      </div>
    </aside>
  );
};
