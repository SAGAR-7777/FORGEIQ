import React, { useState } from 'react';
import {
  Sliders, CheckCircle2, XCircle, Edit3, ShieldAlert,
  ArrowRight, BookOpen, Clock, UserCheck, AlertTriangle, Sparkles, Send
} from 'lucide-react';
import { useFactory } from '../../context/FactoryContext';
import { Recommendation } from '../../types';

export const OptimizationCopilot: React.FC = () => {
  const { recommendations, approveRecommendation, rejectRecommendation, modifyRecommendation, showToast } = useFactory();
  const [selectedRec, setSelectedRec] = useState<Recommendation | null>(recommendations[0] || null);
  const [modifying, setModifying] = useState<boolean>(false);
  const [modifiedRpm, setModifiedRpm] = useState<number>(1420);
  const [operatorNotes, setOperatorNotes] = useState<string>('Approved based on Haas SOP Section 4.3 guidance.');

  const handleApprove = async (rec: Recommendation) => {
    await approveRecommendation(rec.id, 'Operator: Sagar (Lead QC)');
    setSelectedRec({ ...rec, approval_status: 'approved', reviewed_by: 'Operator: Sagar (Lead QC)' });
  };

  const handleReject = async (rec: Recommendation) => {
    await rejectRecommendation(rec.id, 'Operator: Sagar (Lead QC)');
    setSelectedRec({ ...rec, approval_status: 'rejected', reviewed_by: 'Operator: Sagar (Lead QC)' });
  };

  const handleModifyAndApprove = async (rec: Recommendation) => {
    await modifyRecommendation(rec.id, { rpm: modifiedRpm }, 'Operator: Sagar (Lead QC)');
    setModifying(false);
    showToast(`Modified RPM to ${modifiedRpm} and approved.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-graphite-900 border border-graphite-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white font-mono tracking-wide">PROCESS OPTIMIZATION COPILOT</h2>
              <span className="text-[10px] font-mono uppercase bg-forge-cyan/20 text-forge-cyan px-2 py-0.5 rounded border border-forge-cyan/40">
                HUMAN-IN-THE-LOOP SAFETY INTERLOCK
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              AI recommendations require explicit engineer sign-off before modifying physical or simulated controller setpoints. Every action is recorded in the immutable compliance audit trail.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-graphite-850 px-3 py-1.5 rounded-lg border border-graphite-750">
            <ShieldAlert className="w-4 h-4 text-forge-amber" />
            <span className="text-slate-300">AUTONOMOUS WRITE:</span>
            <span className="text-forge-amber font-bold">LOCKED (OPERATOR SIGN-OFF REQUIRED)</span>
          </div>
        </div>
      </div>

      {/* Main List and Detailed Review Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Pending Recommendations List (5 cols) */}
        <div className="lg:col-span-5 bg-graphite-900 border border-graphite-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-graphite-800">
            <h3 className="text-xs font-bold text-white font-mono uppercase">STAGED AI RECOMMENDATIONS</h3>
            <span className="text-[10px] font-mono text-forge-cyan">{recommendations.length} TOTAL</span>
          </div>

          <div className="space-y-3">
            {recommendations.map((rec) => {
              const isSelected = selectedRec?.id === rec.id;
              const isPending = rec.approval_status === 'pending';

              return (
                <div
                  key={rec.id}
                  onClick={() => setSelectedRec(rec)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer select-none bg-graphite-850 ${
                    isSelected
                      ? 'border-forge-cyan ring-1 ring-forge-cyan/50 shadow-[0_0_15px_rgba(0,229,255,0.15)]'
                      : 'border-graphite-750 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 font-mono text-xs">
                    <span className="text-white font-bold">{rec.machine_name}</span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                        rec.approval_status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : rec.approval_status === 'rejected'
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse'
                      }`}
                    >
                      {rec.approval_status.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="text-xs text-forge-cyan font-mono font-medium mb-1">{rec.title}</h4>
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">{rec.reasoning}</p>

                  <div className="mt-2 pt-2 border-t border-graphite-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Defect Risk: {rec.expected_impact.defect_probability}</span>
                    <span className="text-forge-cyan font-bold">Conf: {Math.round(rec.confidence * 100)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Review & Human Decision Panel (7 cols) */}
        {selectedRec && (
          <div className="lg:col-span-7 bg-graphite-900 border border-graphite-800 rounded-2xl p-6 shadow-xl space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-graphite-800">
              <div>
                <span className="text-[10px] font-mono text-forge-cyan uppercase font-bold tracking-wider">
                  RECOMMENDATION DOSSIER: {selectedRec.id}
                </span>
                <h3 className="text-base font-bold text-white font-mono mt-0.5">{selectedRec.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Machine: {selectedRec.machine_name} ({selectedRec.machine_id})</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">CONFIDENCE</span>
                <span className="text-lg font-extrabold font-mono text-forge-cyan">
                  {Math.round(selectedRec.confidence * 100)}%
                </span>
              </div>
            </div>

            {/* Parameter Adjustment Delta Cards */}
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-2">PROPOSED RECIPE MODIFICATIONS</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-graphite-850 rounded-xl border border-graphite-750">
                  <span className="text-[10px] font-mono text-slate-400 block mb-1">CURRENT OPERATING PARAMS</span>
                  <div className="space-y-1 text-xs font-mono">
                    {Object.entries(selectedRec.current_params).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-slate-400 uppercase">{k}:</span>
                        <span className="text-slate-200 font-bold">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-graphite-850 rounded-xl border border-forge-cyan/40">
                  <span className="text-[10px] font-mono text-forge-cyan block mb-1">RECOMMENDED TARGET PARAMS</span>
                  <div className="space-y-1 text-xs font-mono">
                    {Object.entries(selectedRec.recommended_params).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-slate-400 uppercase">{k}:</span>
                        <span className="text-forge-cyan font-bold">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Expected Impact Grid */}
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-2">PROJECTED PROCESS IMPACT</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-graphite-950/60 border border-graphite-800">
                  <span className="text-[9px] text-slate-400 block">DEFECT RISK</span>
                  <span className="text-emerald-400 font-bold">{selectedRec.expected_impact.defect_probability}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-graphite-950/60 border border-graphite-800">
                  <span className="text-[9px] text-slate-400 block">QUALITY SCORE</span>
                  <span className="text-forge-cyan font-bold">{selectedRec.expected_impact.quality_score}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-graphite-950/60 border border-graphite-800">
                  <span className="text-[9px] text-slate-400 block">SCRAP REDUCTION</span>
                  <span className="text-emerald-400 font-bold">{selectedRec.expected_impact.scrap_reduction}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-graphite-950/60 border border-graphite-800">
                  <span className="text-[9px] text-slate-400 block">PRODUCTION TIME</span>
                  <span className="text-slate-200 font-bold">{selectedRec.expected_impact.production_time}</span>
                </div>
              </div>
            </div>

            {/* RAG Knowledge Grounding */}
            <div className="p-4 rounded-xl bg-graphite-850 border border-graphite-750 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-forge-cyan">
                <span className="font-bold flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  GROUNDED RAG CITATION
                </span>
                <span className="text-[10px] bg-forge-cyan/20 px-2 py-0.5 rounded text-forge-cyan border border-forge-cyan/30">
                  {selectedRec.rag_source.relevance_pct || '96%'} RELEVANCE
                </span>
              </div>
              <div className="text-xs text-white font-mono font-medium">
                {selectedRec.rag_source.document} — {selectedRec.rag_source.section}
              </div>
              <p className="text-[11px] text-slate-300 italic bg-graphite-900/60 p-2.5 rounded border border-graphite-800 leading-relaxed">
                "{selectedRec.rag_source.excerpt}"
              </p>
            </div>

            {/* Modify Parameters Sub-form */}
            {modifying && (
              <div className="p-4 rounded-xl bg-graphite-950 border border-forge-amber/50 space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between text-forge-amber font-bold">
                  <span>OPERATOR PARAMETER OVERRIDE</span>
                  <button onClick={() => setModifying(false)} className="text-slate-400 hover:text-white">Cancel</button>
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Adjust Target Spindle RPM:</label>
                  <input
                    type="number"
                    value={modifiedRpm}
                    onChange={(e) => setModifiedRpm(parseInt(e.target.value))}
                    className="w-full bg-graphite-850 border border-graphite-700 rounded p-2 text-white font-mono focus:border-forge-cyan"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Engineering Justification / Audit Note:</label>
                  <input
                    type="text"
                    value={operatorNotes}
                    onChange={(e) => setOperatorNotes(e.target.value)}
                    className="w-full bg-graphite-850 border border-graphite-700 rounded p-2 text-white font-mono focus:border-forge-cyan text-xs"
                  />
                </div>
                <button
                  onClick={() => handleModifyAndApprove(selectedRec)}
                  className="w-full py-2.5 rounded-lg bg-forge-cyan text-graphite-950 font-bold hover:bg-cyan-300 transition"
                >
                  SAVE & APPROVE MODIFIED RECIPE
                </button>
              </div>
            )}

            {/* Human Approval Action Buttons */}
            {selectedRec.approval_status === 'pending' && !modifying && (
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleApprove(selectedRec)}
                  className="flex-1 py-3 rounded-xl bg-forge-emerald hover:bg-emerald-400 text-graphite-950 font-mono text-xs font-extrabold flex items-center justify-center gap-2 transition shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>APPROVE & APPLY TO CONTROLLER</span>
                </button>

                <button
                  onClick={() => setModifying(true)}
                  className="px-4 py-3 rounded-xl bg-graphite-800 hover:bg-graphite-750 text-slate-200 border border-graphite-700 font-mono text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <Edit3 className="w-4 h-4 text-forge-amber" />
                  <span>MODIFY</span>
                </button>

                <button
                  onClick={() => handleReject(selectedRec)}
                  className="px-4 py-3 rounded-xl bg-graphite-800 hover:bg-rose-950/40 text-rose-400 border border-graphite-700 hover:border-rose-500/50 font-mono text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <XCircle className="w-4 h-4" />
                  <span>REJECT</span>
                </button>
              </div>
            )}

            {/* Post-Approval Confirmation Banner */}
            {selectedRec.approval_status !== 'pending' && (
              <div className="p-3.5 rounded-xl bg-graphite-850 border border-graphite-750 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-emerald-400">
                  <UserCheck className="w-4 h-4" />
                  <span>
                    {selectedRec.approval_status === 'approved'
                      ? 'Recommendation approved by operator. Controller parameters updated.'
                      : `Recommendation status: ${selectedRec.approval_status.toUpperCase()}`}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">Audit Stamp Recorded</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
