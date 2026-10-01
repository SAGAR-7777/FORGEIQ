import React, { useState } from 'react';
import {
  GitFork, AlertOctagon, TrendingDown, Activity, Thermometer,
  Wrench, ShieldCheck, CheckCircle2, ArrowDown, ChevronRight, X, ExternalLink, BookOpen
} from 'lucide-react';
import { useFactory } from '../../context/FactoryContext';

interface NodeData {
  id: string;
  stage: string;
  title: string;
  badge: string;
  badgeColor: string;
  summary: string;
  evidence: string;
  sensorReadings: Record<string, string>;
  historicalComparison: string;
  confidence: string;
  relatedEvents: string[];
  ragSources: { title: string; section: string; relevance: string }[];
}

export const RootCauseGraph: React.FC = () => {
  const { selectedMachine, setCurrentView } = useFactory();

  const nodes: NodeData[] = [
    {
      id: 'node-defect',
      stage: '01. PREDICTED DEFECT',
      title: 'Dimensional Inaccuracy (Bore Tolerance Drift)',
      badge: 'PROBABILITY: 82%',
      badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
      summary: 'High risk of bore diameter exceeding aircraft turbine component drawing specification (+0.12 mm tolerance breach).',
      evidence: 'Surrogate defect model (multi-factor sigmoid) estimates 82% failure likelihood for Batch #09A (demo approximation).',
      sensorReadings: {
        'Predicted Deviation': '+0.14 mm',
        'Drawing Tolerance': '+/- 0.02 mm',
        'Scrap Risk': '18.4% projected'
      },
      historicalComparison: 'Matches Incident IR-2026-088 where 42 parts were scrapped due to thermal expansion.',
      confidence: '91% (fixed heuristic — not empirically validated)',
      relatedEvents: ['Anomaly ANO-2026-901', 'Anomaly ANO-2026-902', 'Scrap Risk Warning'],
      ragSources: [
        { title: 'Haas_CNC_Machining_Center_SOP_704.pdf', section: 'Section 4.3', relevance: '96%' }
      ]
    },
    {
      id: 'node-deviation',
      stage: '02. QUALITY DEVIATION',
      title: 'Statistical Pattern Deviation & Cpk Decay',
      badge: '+3.82 SIGMA DEVIATION',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      summary: 'Process capability index Cpk dropped from 1.67 (Six Sigma standard) to 1.08.',
      evidence: 'Continuous statistical quality surveillance detected non-random clustering outside 3-sigma control limits.',
      sensorReadings: {
        'Cpk Baseline': '1.67 (Optimal)',
        'Current Cpk': '1.08 (Degraded)',
        'Standard Deviation': '3.82 sigma shift'
      },
      historicalComparison: 'Process was in control for 180 consecutive operating hours prior to shift change.',
      confidence: '95% (Continuous SPC monitoring)',
      relatedEvents: ['Quality Analysis Agent Alert QA-401'],
      ragSources: [
        { title: 'ISO_9001_2015_Machining_Quality_Control.pdf', section: 'Section 8.5.1', relevance: '94%' }
      ]
    },
    {
      id: 'node-sensors',
      stage: '03. SENSOR ANOMALIES',
      title: 'Spindle Nose Thermal Runaway + High-Frequency Vibration',
      badge: 'ZONE D HARMONIC',
      badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
      summary: 'Spindle nose temperature reached 256.1°C with 8.4 mm/s RMS vibration at 1450 Hz.',
      evidence: 'Dual telemetry breach on CNC-MILL #06 registered by Process Monitoring Agent.',
      sensorReadings: {
        'Spindle Temp': '256.1°C (Max safe: 230°C)',
        'Vibration RMS': '8.4 mm/s (Normal: 1.5–5.0)',
        'Hydraulic Pressure': '9.3 bar (Normal: 7.5)'
      },
      historicalComparison: 'Exceeds ISO 10816 Zone D critical threshold (immediate corrective intervention required).',
      confidence: '98% (High-speed telemetry bus)',
      relatedEvents: ['ANO-2026-901 (Vib)', 'ANO-2026-902 (Temp)'],
      ragSources: [
        { title: 'ISO_10816_3_Vibration_Evaluation.pdf', section: 'Section 3.2', relevance: '95%' }
      ]
    },
    {
      id: 'node-causes',
      stage: '04. ROOT CAUSES',
      title: 'Spindle Bearing Lubrication Starvation & Material Hardness Variation',
      badge: 'DUAL CONTRIBUTOR',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      summary: 'Oil-mist lubrication delivery decay + raw alloy batch hardness variation (+4 HRC) generated excessive friction.',
      evidence: 'Acoustic frequency spectrum matches outer raceway micro-wear; metallurgy report confirms 56 HRC vs 52 HRC nominal.',
      sensorReadings: {
        'Alloy Hardness': '56 HRC (+4 deviation)',
        'Lubricant Delivery': '-28% flow volume',
        'Friction Coefficient': '+34% estimated'
      },
      historicalComparison: 'Matches failure signature documented in maintenance log MAINT-101.',
      confidence: '93% (Cross-agent causal synthesis)',
      relatedEvents: ['Batch Alloy Inspection CERT-09A'],
      ragSources: [
        { title: 'DIN_EN_10083_Steel_Machining_Properties.pdf', section: 'Section 5.4', relevance: '92%' },
        { title: 'Incident_Report_IR_2026_088.pdf', section: 'Section 3', relevance: '97%' }
      ]
    },
    {
      id: 'node-action',
      stage: '05. RECOMMENDED INTERVENTION',
      title: 'Throttle RPM (-20%) + High-Pressure Chiller Flush',
      badge: 'APPROVAL PENDING',
      badgeColor: 'bg-forge-cyan/20 text-forge-cyan border-forge-cyan/40',
      summary: 'Formulated recommendation REC-401 to reduce cutting friction by 36% and restore thermal balance.',
      evidence: 'Simulated thermal surrogate predicts temperature stabilization to 218°C within 4.5 minutes.',
      sensorReadings: {
        'Target RPM': '1420 (from 1780)',
        'Target Coolant': '100% Flood (from 82%)',
        'Projected Defect Risk': '82% → 22%'
      },
      historicalComparison: 'Restored golden operating state in 6 minutes during prior test on Line B.',
      confidence: '94% (Grounded in Haas SOP Section 4.3)',
      relatedEvents: ['REC-401 Staged in Human-in-the-Loop Queue'],
      ragSources: [
        { title: 'Haas_CNC_Machining_Center_SOP_704.pdf', section: 'Section 4.3', relevance: '96%' }
      ]
    }
  ];

  const [activeNode, setActiveNode] = useState<NodeData>(nodes[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-graphite-900 border border-graphite-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white font-mono tracking-wide">AI ROOT-CAUSE GRAPH</h2>
              <span className="text-[10px] font-mono uppercase bg-forge-cyan/20 text-forge-cyan px-2 py-0.5 rounded border border-forge-cyan/40">
                EXPLAINABLE CAUSAL DAG
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Deterministic causal trace mapping predicted defects back through quality deviations, sensor anomalies, and physical failure modes to grounded engineering interventions.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-300 bg-graphite-850 px-3 py-1.5 rounded-lg border border-graphite-750">
            MACHINE: <strong className="text-forge-cyan">{selectedMachine?.name || 'CNC-MILL #06'}</strong>
          </div>
        </div>
      </div>

      {/* Main Causal Chain Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive DAG Nodes (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {nodes.map((node, idx) => {
            const isSelected = activeNode.id === node.id;
            return (
              <div key={node.id} className="relative">
                <div
                  onClick={() => setActiveNode(node)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer select-none bg-graphite-900 relative ${
                    isSelected
                      ? 'border-forge-cyan ring-1 ring-forge-cyan/50 shadow-[0_0_20px_rgba(0,229,255,0.2)] bg-graphite-850'
                      : 'border-graphite-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono text-forge-cyan uppercase font-bold tracking-wider">
                      {node.stage}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${node.badgeColor}`}>
                      {node.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white font-mono mb-1">{node.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{node.summary}</p>

                  <div className="mt-2 pt-2 border-t border-graphite-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>CONFIDENCE: {node.confidence}</span>
                    <span className="text-forge-cyan flex items-center gap-1">
                      Inspect Evidence <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {/* Arrow connector */}
                {idx < nodes.length - 1 && (
                  <div className="flex justify-center my-1.5">
                    <div className="w-6 h-6 rounded-full bg-graphite-850 border border-graphite-750 flex items-center justify-center text-forge-cyan shadow-sm">
                      <ArrowDown className="w-3.5 h-3.5" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Detailed Evidence & RAG Drawer (5 cols) */}
        <div className="lg:col-span-5 bg-graphite-900 border border-graphite-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-graphite-800">
            <div>
              <span className="text-[10px] font-mono text-forge-cyan uppercase font-bold tracking-tight">EVIDENCE INSPECTOR</span>
              <h3 className="text-sm font-bold text-white font-mono">{activeNode.title}</h3>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${activeNode.badgeColor}`}>
              {activeNode.badge}
            </span>
          </div>

          {/* Evidence Narrative */}
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">AI DETECTED EVIDENCE</span>
            <div className="p-3 rounded-lg bg-graphite-850 border border-graphite-750 text-xs text-slate-200 leading-relaxed">
              {activeNode.evidence}
            </div>
          </div>

          {/* Sensor Readings Grid */}
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">TELEMETRY & TOLERANCES</span>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(activeNode.sensorReadings).map(([key, val]) => (
                <div key={key} className="flex justify-between items-center p-2 rounded bg-graphite-950/60 border border-graphite-800 text-xs font-mono">
                  <span className="text-slate-400">{key}:</span>
                  <span className="text-white font-bold">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Historical Comparison */}
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">HISTORICAL BENCHMARK</span>
            <p className="text-xs text-slate-300 bg-graphite-850 p-2.5 rounded border border-graphite-800 leading-snug">
              {activeNode.historicalComparison}
            </p>
          </div>

          {/* RAG Sources Citations */}
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">GROUNDED RAG CITATIONS</span>
            <div className="space-y-2">
              {activeNode.ragSources.map((src, i) => (
                <div
                  key={i}
                  onClick={() => setCurrentView('knowledge')}
                  className="p-2.5 rounded-lg bg-graphite-850 border border-forge-cyan/30 hover:border-forge-cyan text-xs font-mono cursor-pointer transition"
                >
                  <div className="flex items-center justify-between text-forge-cyan mb-1">
                    <span className="font-bold truncate flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      {src.title}
                    </span>
                    <span className="text-[10px] bg-forge-cyan/20 px-1.5 py-0.5 rounded text-forge-cyan">
                      {src.relevance} MATCH
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300">{src.section}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={() => setCurrentView('optimization')}
              className="w-full py-2.5 rounded-xl bg-forge-cyan/20 border border-forge-cyan text-forge-cyan font-mono text-xs font-bold hover:bg-forge-cyan hover:text-graphite-950 transition flex items-center justify-center gap-2"
            >
              <span>REVIEW ACTION IN OPTIMIZATION COPILOT</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
