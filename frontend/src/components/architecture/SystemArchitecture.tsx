import React from 'react';
import {
  Layers, Database, Cpu, Network, Server, LayoutDashboard,
  ShieldCheck, ArrowDown, Bot, Sparkles, ExternalLink, Code
} from 'lucide-react';

export const SystemArchitecture: React.FC = () => {
  const layers = [
    {
      step: '01',
      title: 'DATA SOURCES & INDUSTRIAL TELEMETRY',
      tech: 'OPC-UA • MQTT • Modbus TCP • Siemens S7 • High-Speed Accelerometers',
      description: 'Collects edge telemetry from CNC milling spindles, hydraulic stamping presses, robotic assembly cells, and coordinate measuring machines (12 channels: Temp, Vibration, Pressure, RPM, Torque, Speed, Humidity, Cycle Time, Hardness, Yield, Drift, Tolerances).',
      badge: 'Edge Ingestion',
      badgeColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10'
    },
    {
      step: '02',
      title: 'DATA PIPELINE & VALIDATION',
      tech: 'Data Validation • Statistical Profiling • Rolling Normalization • Noise Filtering',
      description: 'Cleans, validates, and normalizes high-frequency time-series streams against nominal machine baselines. Flags sensor dropouts and establishes rolling standard deviations.',
      badge: 'Streaming ETL',
      badgeColor: 'border-blue-500/40 text-blue-400 bg-blue-500/10'
    },
    {
      step: '03',
      title: 'ML / ANOMALY DETECTION & SURROGATE SIMULATION',
      tech: 'Python • scikit-learn • IsolationForest • RandomForest • Physics-Informed Surrogates',
      description: 'Executes multivariate anomaly detection, multiclass defect classification (Dimensional Inaccuracy, Surface Imperfection, Structural Weakness, Material Variation, Assembly Defect), and What-If surrogate impact estimation.',
      badge: 'Predictive ML',
      badgeColor: 'border-purple-500/40 text-purple-400 bg-purple-500/10'
    },
    {
      step: '04',
      title: 'RAG KNOWLEDGE RETRIEVAL LAYER',
      tech: 'Vector Database • TF-IDF Embeddings • Cosine Similarity • ISO/DIN Corpus Indexer',
      description: 'Indexes machine manuals (Haas SOP-704, Trumpf), international standards (ISO 9001, ISO 10816-3, DIN EN 10083), and historical incident failure analysis reports (IR-2026-088) with verifiable semantic citations.',
      badge: 'Grounded RAG',
      badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
    },
    {
      step: '05',
      title: 'MULTI-AGENT ORCHESTRATION',
      tech: 'IBM Orchestrate • IBM Langflow • IBM watsonx.ai Foundation Models',
      description: 'Coordinates the 4 mandatory autonomous agents: Process Monitoring Agent → Quality Analysis Agent → Defect Prediction Agent → Process Optimization Agent. Computes project-defined Agent Consensus Score.',
      badge: 'Multi-Agent Swarm',
      badgeColor: 'border-forge-violet/40 text-forge-violet bg-violet-500/10'
    },
    {
      step: '06',
      title: 'HIGH-PERFORMANCE API SERVICES',
      tech: 'Python • FastAPI • Uvicorn • Pydantic v2 • Asyncio Simulator Loop',
      description: 'Modular microservice REST APIs exposing /api/machines, /api/sensors, /api/anomalies, /api/quality, /api/defects, /api/recommendations, /api/agents, /api/rag, /api/simulation, /api/copilot.',
      badge: 'API Gateway',
      badgeColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10'
    },
    {
      step: '07',
      title: 'MISSION CONTROL FRONTEND',
      tech: 'React 18 • TypeScript • Tailwind CSS • Lucide Icons • Recharts • Vite',
      description: 'Industrial mission-control interface featuring interactive Digital Factory Twin, What-If simulator sliders, interactive Root-Cause DAG, and Incident Replay player.',
      badge: 'Enterprise UI',
      badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-500/10'
    },
    {
      step: '08',
      title: 'HUMAN-IN-THE-LOOP SAFETY INTERLOCK',
      tech: 'Operator Sign-off • PLC Write Guard • Compliance Audit Trail',
      description: 'Strict safety governance: AI suggestions are held in staging until verified and authorized by certified manufacturing engineers. Prevents silent unauthorized setpoint writes to live factory hardware.',
      badge: 'Safety Interlock',
      badgeColor: 'border-rose-500/40 text-rose-400 bg-rose-500/10'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-graphite-900 border border-graphite-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white font-mono tracking-wide">SYSTEM ARCHITECTURE</h2>
              <span className="text-[10px] font-mono uppercase bg-forge-cyan/20 text-forge-cyan px-2 py-0.5 rounded border border-forge-cyan/40">
                FULL-STACK INDUSTRIAL AI STACK
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Architectural blueprint showcasing edge data collection, surrogate ML modeling, vector RAG retrieval, IBM Orchestrate / Langflow multi-agent orchestration, and human-in-the-loop decision boundaries.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-graphite-850 px-3 py-1.5 rounded-lg border border-graphite-750">
            <Code className="w-4 h-4 text-forge-cyan" />
            <span className="text-slate-300">ARCHITECTURE:</span>
            <span className="text-forge-cyan font-bold">IBM watsonx &amp; Langflow Ready</span>
          </div>
        </div>
      </div>

      {/* Layer Stack Visualization */}
      <div className="space-y-3 relative">
        {layers.map((layer, idx) => (
          <div key={layer.step} className="relative">
            <div className="bg-graphite-900 border border-graphite-800 hover:border-graphite-700 rounded-2xl p-5 shadow-xl transition-all relative">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2 mb-2 border-b border-graphite-800/80">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-extrabold font-mono text-forge-cyan">{layer.step}</span>
                  <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wide">{layer.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400 bg-graphite-950 px-2.5 py-1 rounded border border-graphite-800">
                    {layer.tech}
                  </span>
                  <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${layer.badgeColor}`}>
                    {layer.badge}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">{layer.description}</p>
            </div>

            {/* Connecting Arrow */}
            {idx < layers.length - 1 && (
              <div className="flex justify-center my-1">
                <div className="w-5 h-5 rounded-full bg-graphite-850 border border-graphite-750 flex items-center justify-center text-slate-400">
                  <ArrowDown className="w-3 h-3 text-forge-cyan" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
