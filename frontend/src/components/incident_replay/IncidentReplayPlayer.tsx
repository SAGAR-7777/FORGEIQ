import React, { useState, useEffect } from 'react';
import {
  Play, Pause, RotateCcw, FastForward, Activity,
  AlertTriangle, ShieldCheck, Thermometer, Wind, CheckCircle2, ChevronRight, UserCheck
} from 'lucide-react';
import { api } from '../../services/api';
import { IncidentReplayStep } from '../../types';

export const IncidentReplayPlayer: React.FC = () => {
  const [steps, setSteps] = useState<IncidentReplayStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 0.5, 1, 2
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReplay = async () => {
      try {
        const data = await api.getIncidentReplay();
        setSteps(data.steps || []);
      } catch (err) {
        console.warn('Replay fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReplay();
  }, []);

  // Timer loop for auto play
  useEffect(() => {
    if (!isPlaying || steps.length === 0) return;
    const intervalTime = 3000 / playbackSpeed;
    const timer = setInterval(() => {
      setCurrentStepIdx((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, intervalTime);
    return () => clearInterval(timer);
  }, [isPlaying, steps.length, playbackSpeed]);

  const currentStep = steps[currentStepIdx] || null;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-graphite-900 border border-graphite-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white font-mono tracking-wide">INCIDENT REPLAY CENTER</h2>
              <span className="text-[10px] font-mono uppercase bg-forge-cyan/20 text-forge-cyan px-2 py-0.5 rounded border border-forge-cyan/40">
                TIME-SERIES SIMULATION PLAYBACK
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Step-by-step forensic replay of Incident INC-2026-088 on CNC-MILL #06. Observe multi-agent anomaly detection, defect risk prediction, and operator intervention.
            </p>
          </div>

          {/* VCR Style Playback Controls */}
          <div className="flex items-center gap-3">
            {/* Speed Selector */}
            <div className="flex items-center bg-graphite-850 rounded-lg border border-graphite-750 p-1 text-xs font-mono">
              {[0.5, 1, 2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-1 rounded transition ${
                    playbackSpeed === spd
                      ? 'bg-forge-cyan text-graphite-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Play/Pause/Reset */}
            <div className="flex items-center gap-1.5 bg-graphite-850 rounded-lg border border-graphite-750 p-1">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3 py-1.5 rounded bg-forge-cyan/20 text-forge-cyan hover:bg-forge-cyan hover:text-graphite-950 font-mono text-xs font-bold flex items-center gap-1.5 transition"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStepIdx(0);
                }}
                className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-graphite-800 transition"
                title="Restart Replay"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Step Scrubber / Timeline Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
            <span>TIMELINE PROGRESS: STEP {currentStepIdx + 1} OF {steps.length}</span>
            <span className="text-forge-cyan font-bold">{currentStep?.time}</span>
          </div>

          <div className="grid grid-cols-8 gap-1.5">
            {steps.map((st, idx) => (
              <button
                key={st.step}
                onClick={() => setCurrentStepIdx(idx)}
                className={`py-2 px-1 rounded text-center transition font-mono text-[10px] border flex flex-col items-center justify-center ${
                  idx === currentStepIdx
                    ? 'bg-forge-cyan text-graphite-950 border-forge-cyan font-bold shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                    : idx < currentStepIdx
                    ? 'bg-graphite-850 text-slate-300 border-graphite-700'
                    : 'bg-graphite-950 text-slate-400 border-graphite-800'
                }`}
              >
                <span className="truncate w-full">{st.time.substring(0, 5)}</span>
                <span className={`w-1.5 h-1.5 rounded-full mt-1 ${
                  st.status === 'critical' ? 'bg-rose-400' : st.status === 'warning' ? 'bg-amber-400' : 'bg-emerald-400'
                }`} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Playback Viewport */}
      {currentStep && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Step Overview & Animated Telemetry (7 cols) */}
          <div className="lg:col-span-7 bg-graphite-900 border border-graphite-800 rounded-2xl p-6 shadow-xl space-y-5">
            {/* Event Header */}
            <div className="flex items-start justify-between pb-3 border-b border-graphite-800">
              <div>
                <span className="text-[10px] font-mono text-forge-cyan uppercase font-bold tracking-wider">
                  TIME: {currentStep.time} • STEP {currentStep.step}
                </span>
                <h3 className="text-lg font-bold text-white font-mono mt-0.5">{currentStep.event}</h3>
              </div>

              <span
                className={`text-xs font-mono uppercase px-2.5 py-1 rounded-full border ${
                  currentStep.status === 'critical'
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                    : currentStep.status === 'warning'
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                }`}
              >
                STATUS: {currentStep.status.toUpperCase()}
              </span>
            </div>

            {/* Narrative Description */}
            <p className="text-sm text-slate-200 leading-relaxed font-sans bg-graphite-850 p-4 rounded-xl border border-graphite-750">
              {currentStep.description}
            </p>

            {/* Real-time Replay Gauges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-graphite-950 rounded-xl border border-graphite-800">
                <span className="text-[10px] font-mono text-slate-400 block mb-1">TEMPERATURE</span>
                <span className={`text-lg font-extrabold font-mono ${currentStep.temp > 240 ? 'text-rose-400' : 'text-slate-100'}`}>
                  {currentStep.temp}°C
                </span>
                <div className="w-full h-1 bg-graphite-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full ${currentStep.temp > 240 ? 'bg-rose-500' : 'bg-forge-cyan'}`}
                    style={{ width: `${Math.min(100, (currentStep.temp / 260) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="p-3 bg-graphite-950 rounded-xl border border-graphite-800">
                <span className="text-[10px] font-mono text-slate-400 block mb-1">VIBRATION RMS</span>
                <span className={`text-lg font-extrabold font-mono ${currentStep.vibration > 6.0 ? 'text-rose-400' : 'text-slate-100'}`}>
                  {currentStep.vibration} mm/s
                </span>
                <div className="w-full h-1 bg-graphite-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full ${currentStep.vibration > 6.0 ? 'bg-rose-500' : 'bg-forge-cyan'}`}
                    style={{ width: `${Math.min(100, (currentStep.vibration / 9.0) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="p-3 bg-graphite-950 rounded-xl border border-graphite-800">
                <span className="text-[10px] font-mono text-slate-400 block mb-1">SPINDLE RPM</span>
                <span className="text-lg font-extrabold font-mono text-slate-100">{currentStep.rpm}</span>
                <div className="w-full h-1 bg-graphite-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-forge-cyan"
                    style={{ width: `${Math.min(100, (currentStep.rpm / 2000) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="p-3 bg-graphite-950 rounded-xl border border-graphite-800">
                <span className="text-[10px] font-mono text-slate-400 block mb-1">DEFECT RISK</span>
                <span className={`text-lg font-extrabold font-mono ${currentStep.defect_prob > 0.4 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {Math.round(currentStep.defect_prob * 100)}%
                </span>
                <div className="w-full h-1 bg-graphite-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full ${currentStep.defect_prob > 0.5 ? 'bg-rose-500' : 'bg-emerald-400'}`}
                    style={{ width: `${Math.min(100, currentStep.defect_prob * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Active Agent Response at this Moment (5 cols) */}
          <div className="lg:col-span-5 bg-graphite-900 border border-graphite-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-graphite-800">
              <span className="text-xs font-mono font-bold text-forge-cyan uppercase">AGENT REACTION STATE</span>
              <span className="text-[10px] font-mono text-slate-400">{currentStep.time}</span>
            </div>

            {/* Active Agent Name */}
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">ACTIVE SYSTEM ACTOR</span>
              <div className="text-sm font-bold text-white font-mono flex items-center gap-2 p-2.5 rounded-lg bg-graphite-850 border border-graphite-750">
                <span className="w-2 h-2 rounded-full bg-forge-cyan animate-ping" />
                <span>{currentStep.active_agent}</span>
              </div>
            </div>

            {/* Agent Thought / CoT */}
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">INTERNAL AGENT REASONING</span>
              <div className="p-3.5 rounded-xl bg-graphite-950 border border-graphite-800 text-xs text-slate-300 font-mono italic leading-relaxed">
                "{currentStep.agent_thought}"
              </div>
            </div>

            {/* Step navigation buttons */}
            <div className="pt-4 flex items-center justify-between">
              <button
                disabled={currentStepIdx === 0}
                onClick={() => setCurrentStepIdx((p) => Math.max(0, p - 1))}
                className="px-4 py-2 rounded-lg bg-graphite-850 border border-graphite-750 text-xs font-mono text-slate-300 hover:text-white disabled:opacity-40"
              >
                ← PREVIOUS STEP
              </button>

              <button
                disabled={currentStepIdx === steps.length - 1}
                onClick={() => setCurrentStepIdx((p) => Math.min(steps.length - 1, p + 1))}
                className="px-4 py-2 rounded-lg bg-forge-cyan/20 border border-forge-cyan text-xs font-mono text-forge-cyan font-bold hover:bg-forge-cyan hover:text-graphite-950 disabled:opacity-40 transition"
              >
                NEXT STEP →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
