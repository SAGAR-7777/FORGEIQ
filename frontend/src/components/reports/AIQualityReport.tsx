import React, { useState, useEffect } from 'react';
import {
  FileText, Download, Printer, ShieldCheck, AlertTriangle,
  CheckCircle2, BookOpen, Sparkles, Sliders, Calendar, ArrowRight
} from 'lucide-react';
import { api } from '../../services/api';
import { useFactory } from '../../context/FactoryContext';

export const AIQualityReport: React.FC = () => {
  const { qualitySummary, showToast } = useFactory();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await api.getLatestReport();
        setReport(data);
      } catch (err) {
        console.warn('Report fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = () => {
    showToast('Generating official PDF print document...');
    setTimeout(() => {
      window.print();
    }, 600);
  };

  if (loading || !report) {
    return (
      <div className="py-20 text-center text-slate-400 font-mono text-xs flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 animate-spin text-forge-cyan" />
        <span>Compiling executive quality audit dossier...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="bg-graphite-900 border border-graphite-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white font-mono tracking-wide">AI QUALITY AUDIT REPORT</h2>
            <span className="text-[10px] font-mono uppercase bg-forge-cyan/20 text-forge-cyan px-2 py-0.5 rounded border border-forge-cyan/40">
              AUDIT DOSSIER {report.report_id}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Certified automated quality assessment compiled by the ForgeIQ Multi-Agent Orchestration Swarm.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-graphite-850 hover:bg-graphite-800 text-slate-200 border border-graphite-750 font-mono text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PRINT</span>
          </button>
          <button
            onClick={handleExportPdf}
            className="px-4 py-2 rounded-xl bg-forge-cyan text-graphite-950 hover:bg-cyan-300 font-mono text-xs font-bold flex items-center gap-1.5 transition shadow-[0_0_15px_rgba(0,229,255,0.25)]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT PDF REPORT</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-graphite-900 border border-graphite-800 rounded-2xl p-8 shadow-2xl space-y-8 font-sans print:bg-white print:text-black print:p-0 print:border-none">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-graphite-800 print:border-slate-300 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-forge-cyan/20 to-forge-blue/30 border border-forge-cyan/40 flex items-center justify-center text-forge-cyan font-mono font-bold text-xl">
              FQ
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-white font-mono tracking-wider print:text-black">
                FORGEIQ QUALITY INTELLIGENCE REPORT
              </h1>
              <p className="text-xs text-slate-400 font-mono print:text-slate-600">
                Plant 04 Autonomous Manufacturing Cell • Report ID: {report.report_id}
              </p>
            </div>
          </div>

          <div className="text-right text-xs font-mono">
            <span className="text-slate-400 block print:text-slate-600">TIMESTAMP:</span>
            <span className="text-white font-bold print:text-black">{new Date(report.generated_at).toLocaleString()}</span>
            <span className="text-[10px] text-forge-amber block mt-0.5 print:text-slate-600">
              [DEMO MODE: Simulated Factory Data]
            </span>
          </div>
        </div>

        {/* 1. Executive Summary */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold font-mono text-forge-cyan uppercase tracking-wider flex items-center gap-2 print:text-cyan-800">
            <span className="w-1.5 h-1.5 rounded-full bg-forge-cyan print:bg-cyan-800" />
            01. EXECUTIVE SUMMARY
          </h2>
          <p className="text-xs text-slate-200 leading-relaxed bg-graphite-850 p-4 rounded-xl border border-graphite-750 print:bg-slate-50 print:text-slate-900 print:border-slate-200">
            {report.executive_summary}
          </p>
        </div>

        {/* 2. Production Overview & Composite FQI */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold font-mono text-forge-cyan uppercase tracking-wider flex items-center gap-2 print:text-cyan-800">
            <span className="w-1.5 h-1.5 rounded-full bg-forge-cyan print:bg-cyan-800" />
            02. PRODUCTION OVERVIEW & FORGE QUALITY INDEX™
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-graphite-850 rounded-xl border border-graphite-750 print:bg-slate-50 print:border-slate-200">
              <span className="text-[10px] font-mono text-slate-400 block print:text-slate-600">FORGE QUALITY INDEX™</span>
              <span className="text-xl font-extrabold font-mono text-forge-cyan print:text-cyan-900">
                {report.production_overview.overall_fqi}/100
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">Composite Score</span>
            </div>

            <div className="p-3.5 bg-graphite-850 rounded-xl border border-graphite-750 print:bg-slate-50 print:border-slate-200">
              <span className="text-[10px] font-mono text-slate-400 block print:text-slate-600">TOTAL PRODUCTION</span>
              <span className="text-xl font-extrabold font-mono text-white print:text-black">
                {report.production_overview.total_units.toLocaleString()} units
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">24h Throughput</span>
            </div>

            <div className="p-3.5 bg-graphite-850 rounded-xl border border-graphite-750 print:bg-slate-50 print:border-slate-200">
              <span className="text-[10px] font-mono text-slate-400 block print:text-slate-600">PREDICTED SCRAP RATE</span>
              <span className="text-xl font-extrabold font-mono text-rose-400 print:text-rose-700">
                {report.production_overview.scrap_rate}
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">Contained under REC-401</span>
            </div>

            <div className="p-3.5 bg-graphite-850 rounded-xl border border-graphite-750 print:bg-slate-50 print:border-slate-200">
              <span className="text-[10px] font-mono text-slate-400 block print:text-slate-600">PROCESS CAPABILITY (CPK)</span>
              <span className="text-xl font-extrabold font-mono text-forge-emerald print:text-emerald-700">
                {report.quality_trends.cpk}
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">Six Sigma Standard: 1.67</span>
            </div>
          </div>
        </div>

        {/* 3. Detected Anomalies */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold font-mono text-forge-cyan uppercase tracking-wider flex items-center gap-2 print:text-cyan-800">
            <span className="w-1.5 h-1.5 rounded-full bg-forge-cyan print:bg-cyan-800" />
            03. DETECTED ANOMALIES & SENSOR BREACHES
          </h2>
          <div className="space-y-2">
            {report.detected_anomalies.map((ano: any) => (
              <div
                key={ano.id}
                className="p-3 rounded-xl bg-graphite-850 border border-forge-amber/30 text-xs font-mono print:bg-slate-50 print:border-amber-300"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-forge-amber font-bold print:text-amber-800">{ano.machine_name} — {ano.parameter}</span>
                  <span className="text-[10px] text-slate-400 print:text-slate-600">{ano.deviation} vs normal ({ano.normal_range})</span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans print:text-slate-800">{ano.ai_explanation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Root Causes */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold font-mono text-forge-cyan uppercase tracking-wider flex items-center gap-2 print:text-cyan-800">
            <span className="w-1.5 h-1.5 rounded-full bg-forge-cyan print:bg-cyan-800" />
            04. MULTI-AGENT ROOT CAUSE ANALYSIS
          </h2>
          <div className="space-y-2">
            {report.root_causes.map((rc: any, idx: number) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-graphite-850 border border-graphite-750 text-xs space-y-1 print:bg-slate-50 print:border-slate-200"
              >
                <div className="font-bold text-white font-mono print:text-black">{rc.issue} ({rc.affected_machine})</div>
                <div className="text-slate-300 print:text-slate-800">
                  <strong className="text-slate-400 print:text-slate-600 font-mono">Primary Cause:</strong> {rc.primary_cause}
                </div>
                <div className="text-slate-300 print:text-slate-800">
                  <strong className="text-slate-400 print:text-slate-600 font-mono">Secondary Factor:</strong> {rc.secondary_factor}
                </div>
                <div className="text-forge-cyan print:text-cyan-900 font-mono pt-1">
                  <strong>Action:</strong> {rc.recommended_action}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. AI Recommendations */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold font-mono text-forge-cyan uppercase tracking-wider flex items-center gap-2 print:text-cyan-800">
            <span className="w-1.5 h-1.5 rounded-full bg-forge-cyan print:bg-cyan-800" />
            05. AI PROCESS OPTIMIZATION RECOMMENDATIONS
          </h2>
          <div className="space-y-2">
            {report.ai_recommendations.map((rec: any) => (
              <div
                key={rec.id}
                className="p-3.5 rounded-xl bg-graphite-850 border border-forge-cyan/30 text-xs space-y-1.5 print:bg-slate-50 print:border-cyan-300"
              >
                <div className="flex items-center justify-between font-mono">
                  <span className="text-forge-cyan font-bold print:text-cyan-900">{rec.title} ({rec.machine_name})</span>
                  <span className="text-[10px] text-forge-amber font-bold print:text-amber-800">HUMAN APPROVAL REQUIRED</span>
                </div>
                <p className="text-slate-300 print:text-slate-800 text-[11px]">{rec.reasoning}</p>
                <div className="text-[10px] font-mono text-slate-400 print:text-slate-600">
                  Grounded Citation: {rec.rag_source?.document} ({rec.rag_source?.section})
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer & Compliance Signature */}
        <div className="pt-6 border-t border-graphite-800 print:border-slate-300 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-400 print:text-slate-600">
          <div>
            <span>SYSTEM: FORGEIQ MULTI-AGENT SWARM v1.0.0</span>
            <p className="text-[10px] mt-0.5">IBM Watsonx / Orchestrate Interoperable Architecture</p>
          </div>
          <div className="mt-3 sm:mt-0 text-right">
            <span>OPERATOR SIGN-OFF: SAGAR (LEAD QC)</span>
            <p className="text-[10px] mt-0.5">COMPLIANCE CODE: ISO-9001-SEC-8.5</p>
          </div>
        </div>
      </div>
    </div>
  );
};
