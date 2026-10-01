import React, { useState } from 'react';
import {
  MessageSquareText, Send, Sparkles, Bot, User,
  BookOpen, ArrowRight, ShieldCheck, Cpu, RefreshCw
} from 'lucide-react';
import { api } from '../../services/api';
import { useFactory } from '../../context/FactoryContext';
import { RAGChunk } from '../../types';

interface Message {
  sender: 'user' | 'copilot';
  text: string;
  sources?: RAGChunk[];
  model?: string;
  timestamp: string;
}

export const ForgeCopilot: React.FC = () => {
  const { selectedMachine, machines, setCurrentView } = useFactory();
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'copilot',
      text: "Hello, I am **Forge Copilot**, your real-time AI industrial assistant. I correlate live sensor telemetry from all 12 machines with multi-agent inference and ISO/DIN engineering manuals. How can I assist you with process quality, defect mitigation, or recipe optimization today?",
      timestamp: '10:30'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestedPrompts = [
    `Why is ${selectedMachine?.name || 'CNC-MILL #06'} showing high defect risk?`,
    "What caused today's active anomalies?",
    "Which machine requires immediate engineering attention?",
    "How can I reduce defect risk on Line B?",
    "Explain the latest quality report and FQI score."
  ];

  const handleSend = async (queryToSend?: string) => {
    const query = queryToSend || inputQuery;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryToSend) setInputQuery('');
    setLoading(true);

    try {
      const res = await api.chatWithCopilot(query, selectedMachine?.id);
      const copilotMsg: Message = {
        sender: 'copilot',
        text: res.answer,
        sources: res.rag_sources,
        model: res.model,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, copilotMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'copilot',
          text: "I encountered an error retrieving live telemetry context. Please check your connection to the ForgeIQ backend.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-graphite-900 border border-graphite-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white font-mono tracking-wide">FORGE COPILOT</h2>
              <span className="text-[10px] font-mono uppercase bg-forge-cyan/20 text-forge-cyan px-2 py-0.5 rounded border border-forge-cyan/40">
                INDUSTRIAL DECISION COPILOT
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Grounded conversational AI answering complex engineering queries using live sensor feeds, ISO standards, and multi-agent consensus chains.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-graphite-850 px-3 py-1.5 rounded-lg border border-graphite-750">
            <Bot className="w-4 h-4 text-forge-cyan" />
            <span className="text-slate-300">CONTEXT:</span>
            <span className="text-forge-cyan font-bold">{selectedMachine?.name || 'PLANT-WIDE'}</span>
          </div>
        </div>

        {/* Suggested Prompt Chips */}
        <div className="mt-4 pt-4 border-t border-graphite-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase block mb-2">SUGGESTED ENGINEERING QUERIES</span>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="px-3 py-1.5 rounded-lg bg-graphite-850 hover:bg-graphite-800 border border-graphite-750 hover:border-forge-cyan/50 text-slate-300 hover:text-white text-xs font-mono transition text-left"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-graphite-900 border border-graphite-800 rounded-2xl p-5 shadow-xl flex flex-col h-[520px]">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'copilot' && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-forge-cyan/20 to-forge-blue/30 border border-forge-cyan/40 flex items-center justify-center text-forge-cyan shrink-0 font-mono font-bold text-xs">
                  FQ
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-forge-cyan/15 border border-forge-cyan/40 text-slate-100 font-mono'
                    : 'bg-graphite-850 border border-graphite-750 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1.5">
                  <span className="font-bold uppercase text-slate-300">
                    {msg.sender === 'user' ? 'QUALITY ENGINEER' : 'FORGE COPILOT'}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="space-y-2 whitespace-pre-line font-sans text-xs">
                  {msg.text}
                </div>

                {/* Supporting RAG Citations */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-graphite-750/70 space-y-1.5">
                    <span className="text-[10px] font-mono text-forge-cyan uppercase font-bold flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      SUPPORTING RAG REFERENCES ({msg.sources.length})
                    </span>
                    <div className="grid grid-cols-1 gap-1.5">
                      {msg.sources.map((src, sIdx) => (
                        <div
                          key={sIdx}
                          onClick={() => setCurrentView('knowledge')}
                          className="p-2 rounded bg-graphite-900 border border-graphite-800 text-[10px] font-mono text-slate-300 flex items-center justify-between cursor-pointer hover:border-forge-cyan transition"
                        >
                          <span className="truncate max-w-sm text-forge-cyan font-bold">{src.document_title || src.filename} ({src.section})</span>
                          <span className="text-[9px] bg-forge-cyan/20 px-1.5 py-0.5 rounded text-forge-cyan shrink-0">
                            {src.relevance_pct || `${Math.round((src.relevance || 0.9) * 100)}%`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-graphite-800 border border-graphite-700 flex items-center justify-center text-slate-300 shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-forge-cyan/20 border border-forge-cyan/40 flex items-center justify-center text-forge-cyan font-mono font-bold text-xs">
                FQ
              </div>
              <div className="p-3.5 rounded-2xl bg-graphite-850 border border-graphite-750 text-xs font-mono text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-forge-cyan animate-spin" />
                <span>Correlating multi-agent inference & ISO manuals...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="mt-4 pt-3 border-t border-graphite-800 flex gap-2">
          <input
            type="text"
            placeholder="Ask Forge Copilot about vibration spikes, temperature anomalies, Cpk limits, scrap estimates..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-graphite-850 border border-graphite-750 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-forge-cyan font-mono"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !inputQuery.trim()}
            className="px-5 py-2.5 rounded-xl bg-forge-cyan text-graphite-950 font-mono text-xs font-bold hover:bg-cyan-300 transition flex items-center gap-1.5 disabled:opacity-40"
          >
            <Send className="w-3.5 h-3.5" />
            <span>TRANSMIT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
