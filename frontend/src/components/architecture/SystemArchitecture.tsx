import React from 'react';
import {
  Layers, Database, Cpu, Network, Server, LayoutDashboard,
  ShieldCheck, ArrowDown, Bot, Sparkles, Code, AlertTriangle
} from 'lucide-react';

export const SystemArchitecture: React.FC = () => {
  const layers = [
    {
      step: '01',
      title: 'SIMULATED FACTORY TELEMETRY',
      tech: 'Python asyncio • Random-walk stochastic simulation • In-memory state',
      description: 'A background Python simulation loop generates stochastic sensor values for 12 demo machines (CNC Mills, Stamping Presses, Robotic Assembly, CMM Inspection) across 12 parameters: Temperature, Vibration, Pressure, RPM, Torque, Speed, Humidity, Cycle Time, Hardness, Production Rate, Calibration Drift, Inspection Tolerance. No real sensors, OPC-UA, or MQTT brokers.',
      badge: 'Simulated Telemetry',
      badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-500/10'
    },
    {
      step: '02',
      title: 'RULE-BASED ANOMALY DETECTION',
      tech: 'Python • Hard-threshold evaluation • Configurable control limits',
      description: 'The Process Monitoring Agent evaluates each machine\'s telemetry against configurable warning/critical thresholds. Anomalies are flagged when vibration, temperature, or pressure exceeds defined control limits. Not machine learning — pure rule-based threshold detection.',
      badge: 'Rule-Based',
      badgeColor: 'border-blue-500/40 text-blue-400 bg-blue-500/10'
    },
    {
      step: '03',
      title: 'MATHEMATICAL SURROGATE DEFECT PREDICTOR',
      tech: 'Python • Multi-factor sigmoid formula • Fixed heuristic coefficients',
      description: 'The Defect Prediction Agent computes risk probability using a weighted linear combination of normalized sensor deviations, squashed through a sigmoid function. Outputs defect probability [0–1] and multiclass label (Dimensional Inaccuracy, Surface Imperfection, Structural Weakness, Material Variation, Assembly Defect). Not a trained ML classifier — no RandomForest, no IsolationForest, no scikit-learn fit().',
      badge: 'Surrogate Model',
      badgeColor: 'border-purple-500/40 text-purple-400 bg-purple-500/10'
    },
    {
      step: '04',
      title: 'KEYWORD / TOKEN KNOWLEDGE RETRIEVAL',
      tech: 'Python • Token intersection scoring • Keyword boost • Demo document corpus',
      description: 'The RAG Knowledge Center retrieves relevant chunks from 5 demo-authored documents using token/keyword overlap scoring. Query terms are matched against chunk tokens; relevance is computed via intersection ratio + keyword boost. Not semantic vector search — no dense embeddings, no vector database, no TF-IDF vectorizer, no cosine similarity over embeddings.',
      badge: 'Keyword RAG',
      badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
    },
    {
      step: '05',
      title: 'MULTI-AGENT ORCHESTRATION PIPELINE',
      tech: 'Python classes • Sequential pipeline • Custom orchestrator',
      description: 'Four Python agent classes execute in a sequential pipeline: Process Monitoring Agent → Quality Analysis Agent → Defect Prediction Agent → Process Optimization Agent. The orchestrator collects outputs, computes a project-defined consensus score, and stores recommendations for human review. Custom Python implementation — not IBM Langflow, IBM Orchestrate, or IBM watsonx.',
      badge: 'Custom Python',
      badgeColor: 'border-forge-violet/40 text-forge-violet bg-violet-500/10'
    },
    {
      step: '06',
      title: 'FASTAPI REST BACKEND',
      tech: 'Python 3.12 • FastAPI • Uvicorn • Pydantic v2 • python-dotenv',
      description: 'Modular FastAPI REST API exposing 30 endpoints under /api/*. Serves machine state, sensor history, anomalies, defect predictions, recommendations, agent status, knowledge search, what-if simulation, copilot chat, maintenance data, and incident replay. Includes /health endpoint and configurable CORS. Optionally calls Groq LLaMA-3.3-70B for Copilot responses.',
      badge: 'API Gateway',
      badgeColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10'
    },
    {
      step: '07',
      title: 'REACT MISSION CONTROL FRONTEND',
      tech: 'React 18 • TypeScript • Tailwind CSS • Lucide Icons • Recharts • Vite',
      description: 'Industrial mission-control interface with 16+ views: Executive Dashboard, Digital Factory Twin, Live Monitoring, Anomaly Center, Defect Intelligence, Root Cause Graph, Process Optimization, What-If Simulator, Agent Command Center, Forge Copilot, Knowledge Center, Incident Replay, Analytics, Reports, Data Simulator, and Maintenance Tracker.',
      badge: 'Demo UI',
      badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-500/10'
    },
    {
      step: '08',
      title: 'HUMAN-IN-THE-LOOP APPROVAL WORKFLOW',
      tech: 'Operator approval queue • Approve / Reject / Modify workflow',
      description: 'All AI-generated process recommendations are held in a pending approval queue. A human operator must explicitly Approve, Reject, or Modify each recommendation before simulated machine parameters update. Enforces the principle that AI is a decision-support tool, not an autonomous controller. Note: In this demo, "applying" a recommendation updates in-memory simulation state only.',
      badge: 'Human Approval',
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
                FULL-STACK AI DEMO
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Architectural breakdown of the ForgeIQ demo stack: simulated telemetry, rule-based anomaly detection, mathematical surrogate prediction, keyword-based knowledge retrieval, custom multi-agent pipeline, FastAPI backend, and React frontend.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/30">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 font-bold">DEMO ENVIRONMENT</span>
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
