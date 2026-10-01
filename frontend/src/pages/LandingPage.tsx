import React from 'react';
import {
  ShieldCheck, Sparkles, ArrowRight, PlayCircle, Cpu,
  Activity, AlertTriangle, GitFork, Sliders, BookOpen,
  CheckCircle2, Bot, Layers, BarChart3, Database, ChevronRight, Zap
} from 'lucide-react';
import { useFactory } from '../context/FactoryContext';

export const LandingPage: React.FC = () => {
  const { setCurrentView, setDemoActive, setDemoStep } = useFactory();

  const sections = [
    {
      num: '01',
      title: 'THE MANUFACTURING PROBLEM',
      desc: 'Traditional manufacturing discovers defects too late—at the end-of-line CMM or worse, after customer delivery. Reactive scrap costs American and European manufacturers over $420B annually in rework, downtime, and warranty recalls.'
    },
    {
      num: '02',
      title: 'AI QUALITY INTELLIGENCE',
      desc: 'ForgeIQ replaces post-mortem inspection with proactive cyber-physical surveillance. By streaming 12 real-time parameters per machine, the system anticipates quality drift before metal begins to deform.'
    },
    {
      num: '03',
      title: 'FOUR-AGENT AUTONOMOUS SWARM',
      desc: 'Orchestrates four specialized autonomous agents: Process Monitoring Agent (sensory perception), Quality Analysis Agent (SPC capability), Defect Prediction Agent (failure probability), and Process Optimization Agent (recipe synthesis).'
    },
    {
      num: '04',
      title: 'DIGITAL FACTORY TWIN',
      desc: 'A live interactive topological twin of the entire plant floor. Visualizes raw material flow through stamping presses, 5-axis CNC machining centers, robotic welding, and coordinate metrology cells.'
    },
    {
      num: '05',
      title: 'PREDICTIVE QUALITY & SCRAP CONTAINMENT',
      desc: 'Ensemble ML classification algorithms calculate defect probabilities (e.g. 82% Dimensional Inaccuracy) up to 40 minutes ahead of part completion, providing ample time for corrective intervention.'
    },
    {
      num: '06',
      title: 'ROOT CAUSE INTELLIGENCE (CAUSAL DAG)',
      desc: 'Every predicted failure is back-propagated through a deterministic causal graph, linking dimensional tolerances to spindle thermal expansion, bearing harmonic frequencies, and batch metallurgy hardness variations.'
    },
    {
      num: '07',
      title: 'WHAT-IF PRODUCTION SIMULATOR',
      desc: 'Allows engineers to virtually test spindle speed cutbacks, feed rate throttling, and coolant boosts against a physics-informed surrogate model to view projected quality gains before touching a machine PLC.'
    },
    {
      num: '08',
      title: 'GROUNDED RAG KNOWLEDGE CORPUS',
      desc: 'Semantic vector retrieval over Haas CNC SOPs, Trumpf Laser standards, ISO 9001:2015, ISO 10816-3 vibration severity charts, and historical failure analysis incident reports.'
    },
    {
      num: '09',
      title: 'HUMAN-IN-THE-LOOP GOVERNANCE',
      desc: 'Strict industrial safety protocol: AI recipes are staged in an approval queue. Certified engineers inspect expected impacts, modify setpoints if necessary, and authorize writes with an immutable audit stamp.'
    },
    {
      num: '10',
      title: 'TECHNOLOGY ARCHITECTURE',
      desc: 'Built on a modular, enterprise-grade architecture: FastAPI Python backend, scikit-learn ML engine, vector embeddings index, IBM Langflow & Orchestrate interoperability, and React TypeScript frontend.'
    },
    {
      num: '11',
      title: 'ENTERPRISE PRODUCTION DEPLOYMENT',
      desc: 'Ready for OPC-UA and MQTT edge deployment in aerospace, automotive, precision robotics, and heavy industrial stamping operations.'
    }
  ];

  return (
    <div className="space-y-16 py-8 px-4 max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-10 pb-6 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forge-cyan/10 border border-forge-cyan/30 text-forge-cyan font-mono text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>NEXT-GENERATION INDUSTRIAL AI</span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold font-mono tracking-tight text-white leading-tight">
          FORGE<span className="text-forge-cyan">IQ</span>
        </h1>

        <div className="text-xl sm:text-2xl font-mono text-slate-300 font-semibold tracking-wide">
          AI MANUFACTURING QUALITY INTELLIGENCE
        </div>

        <p className="text-lg sm:text-xl font-sans text-forge-cyan/90 max-w-2xl mx-auto italic font-medium">
          "Predict defects. Understand causes. Optimize production."
        </p>

        <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Predict defects before they become products. Continuous real-time sensor surveillance, multi-agent root cause analysis, grounded RAG standards, and human-in-the-loop recipe optimization for modern manufacturing.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-forge-cyan to-forge-blue hover:from-cyan-400 hover:to-blue-500 text-graphite-950 font-mono text-sm font-extrabold flex items-center justify-center gap-2.5 transition shadow-[0_0_25px_rgba(0,229,255,0.35)]"
          >
            <span>LAUNCH CONTROL CENTER</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setDemoActive(true);
              setDemoStep(1);
              setCurrentView('dashboard');
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-graphite-850 hover:bg-graphite-800 text-slate-200 border border-graphite-700 hover:border-forge-cyan/50 font-mono text-sm font-bold flex items-center justify-center gap-2.5 transition"
          >
            <PlayCircle className="w-4 h-4 text-forge-cyan animate-pulse" />
            <span>START 8-STEP GUIDED TOUR</span>
          </button>
        </div>

        {/* Hero Visual Mockup Preview */}
        <div className="mt-12 p-1 rounded-2xl bg-gradient-to-b from-graphite-750 via-graphite-850 to-graphite-900 shadow-2xl">
          <div className="bg-graphite-950 rounded-xl p-6 border border-graphite-800 space-y-4 text-left font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-graphite-850 text-xs">
              <div className="flex items-center gap-2 text-forge-cyan font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-forge-cyan animate-ping" />
                <span>FORGEIQ LIVE TELEMETRY MATRIX</span>
              </div>
              <span className="text-slate-400">12 MACHINES MONITORED • CPK 1.68</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-graphite-900 rounded-lg border border-graphite-800">
                <span className="text-[10px] text-slate-400 block">FORGE QUALITY INDEX™</span>
                <span className="text-lg font-bold text-forge-cyan">94.7 / 100</span>
              </div>
              <div className="p-3 bg-graphite-900 rounded-lg border border-graphite-800">
                <span className="text-[10px] text-slate-400 block">MULTI-AGENT CONSENSUS</span>
                <span className="text-lg font-bold text-forge-violet">92.4%</span>
              </div>
              <div className="p-3 bg-graphite-900 rounded-lg border border-graphite-800">
                <span className="text-[10px] text-slate-400 block">DEFECT RISK LEVEL</span>
                <span className="text-lg font-bold text-rose-400">8.2% Contained</span>
              </div>
              <div className="p-3 bg-graphite-900 rounded-lg border border-graphite-800">
                <span className="text-[10px] text-slate-400 block">SAFETY INTERLOCK</span>
                <span className="text-lg font-bold text-emerald-400">ENGAGED</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11 Comprehensive Architectural Sections (Section 23) */}
      <section className="space-y-6">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-bold font-mono text-white uppercase tracking-wider">
            PRODUCT CAPABILITY DEEP DIVE
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            11 Core Pillars of the ForgeIQ Industrial Quality Platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((sec) => (
            <div
              key={sec.num}
              className="bg-graphite-900 border border-graphite-800 hover:border-forge-cyan/40 rounded-2xl p-6 shadow-xl transition-all space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-forge-cyan font-extrabold">{sec.num}</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-tighter">FORGEIQ ARCHITECTURE</span>
                </div>
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide mb-2">{sec.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{sec.desc}</p>
              </div>

              <div className="pt-3 border-t border-graphite-850 flex justify-end">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="text-xs font-mono text-forge-cyan hover:underline flex items-center gap-1 font-bold"
                >
                  Explore in Control Center →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="bg-gradient-to-r from-forge-cyan/20 via-graphite-900 to-forge-blue/20 border border-forge-cyan/40 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-2xl">
        <h2 className="text-3xl font-extrabold font-mono text-white">
          READY TO EXPERIENCE ZERO-DEFECT QUALITY INTELLIGENCE?
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Launch the full mission-control experience now. Inspect real-time 12-channel telemetry, trigger fault injections, test What-If simulations, and authorize AI recommendations.
        </p>
        <div className="pt-2">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="px-8 py-3.5 rounded-xl bg-forge-cyan text-graphite-950 font-mono text-sm font-extrabold hover:bg-cyan-300 transition shadow-[0_0_25px_rgba(0,229,255,0.4)]"
          >
            ENTER MISSION CONTROL NOW →
          </button>
        </div>
      </section>
    </div>
  );
};
