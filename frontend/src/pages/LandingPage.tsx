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
      desc: 'Traditional manufacturing discovers defects too late—at the end-of-line CMM or worse, after customer delivery. ForgeIQ demonstrates an AI-driven architecture for proactive defect prevention — catching quality risks during production, not after.'
    },
    {
      num: '02',
      title: 'AI QUALITY INTELLIGENCE (DEMO)',
      desc: 'ForgeIQ simulates proactive quality surveillance across 12 demo machines × 12 sensor channels using a stochastic Python simulation engine. All telemetry is simulated demo data — not connected to real industrial hardware.'
    },
    {
      num: '03',
      title: 'FOUR-AGENT PIPELINE',
      desc: 'Orchestrates four Python agent classes in a sequential pipeline: Process Monitoring Agent (threshold anomaly detection), Quality Analysis Agent (heuristic Cpk), Defect Prediction Agent (surrogate math model), and Process Optimization Agent (keyword-RAG grounded recommendations).'
    },
    {
      num: '04',
      title: 'DIGITAL FACTORY TWIN (SIMULATED)',
      desc: 'An interactive demo visualization of a simulated factory floor. Displays 12 demo machines across 4 production lines with real-time telemetry charts driven by in-process Python simulation.'
    },
    {
      num: '05',
      title: 'SURROGATE DEFECT PREDICTION',
      desc: 'A multi-factor sigmoid surrogate model estimates defect probability from normalized sensor deviations (temperature, vibration, pressure, RPM). Not a trained ML classifier — outputs are demo approximations based on fixed heuristic coefficients.'
    },
    {
      num: '06',
      title: 'ROOT CAUSE VISUALIZATION',
      desc: 'Predicted failures are mapped through a 5-node causal workflow, linking sensor anomalies to failure modes and recommended interventions. Static causal chain for demo visualization purposes.'
    },
    {
      num: '07',
      title: 'WHAT-IF PARAMETER SIMULATOR',
      desc: 'Allows engineers to virtually test spindle speed cutbacks, feed rate throttling, and coolant adjustments. Outputs are parametric math estimates — not a physics simulation or trained surrogate model.'
    },
    {
      num: '08',
      title: 'KEYWORD-BASED KNOWLEDGE RETRIEVAL',
      desc: 'Token/keyword overlap matching against 5 demo-authored knowledge documents representing ISO 9001, ISO 10816-3, Haas SOP-704, DIN EN 10083, and a fictional incident report. Not semantic vector search.'
    },
    {
      num: '09',
      title: 'HUMAN-IN-THE-LOOP GOVERNANCE',
      desc: 'AI-generated process recommendations are staged in an approval queue. The operator must Approve, Reject, or Modify each recommendation. In this demo, approval updates in-memory simulation state only.'
    },
    {
      num: '10',
      title: 'TECHNOLOGY STACK',
      desc: 'Python 3.12 + FastAPI backend, React 18 + TypeScript frontend, Groq LLaMA-3.3-70B for Copilot (optional, with deterministic fallback). Custom Python agent pipeline — not IBM Langflow or IBM Orchestrate.'
    },
    {
      num: '11',
      title: 'EXTENSIBLE ARCHITECTURE',
      desc: 'Designed to demonstrate a path toward real OPC-UA / MQTT edge integration, trained ML classifiers (RandomForest, IsolationForest), semantic vector RAG, and persistent time-series databases in future iterations.'
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
