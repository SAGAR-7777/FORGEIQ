import React, { useState } from 'react';
import {
  BookOpen, Search, Upload, FileText, CheckCircle2,
  ExternalLink, Sparkles, AlertCircle, Database, Layers, X, Tag
} from 'lucide-react';
import { useFactory } from '../../context/FactoryContext';
import { api } from '../../services/api';
import { RAGDocument, RAGChunk } from '../../types';

export const KnowledgeCenter: React.FC = () => {
  const { ragDocuments, refreshData, showToast } = useFactory();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<RAGChunk[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<RAGDocument | null>(ragDocuments[0] || null);
  const [selectedChunk, setSelectedChunk] = useState<RAGChunk | null>(null);

  // Upload modal state
  const [uploadOpen, setUploadOpen] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState('Machine Manual & SOP');
  const [docFilename, setDocFilename] = useState('');
  const [docContent, setDocContent] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await api.searchRAG(searchQuery, 5);
      setSearchResults(res.results);
      if (res.results.length === 0) {
        showToast('No matching chunks found for this semantic query.');
      }
    } catch (err) {
      showToast('Search request failed.');
    } finally {
      setSearching(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle || !docContent) return;
    try {
      await api.uploadRAGDoc({
        title: docTitle,
        category: docCategory,
        filename: docFilename || `${docTitle.toLowerCase().replace(/\s+/g, '_')}.pdf`,
        content: docContent
      });
      await refreshData();
      setUploadOpen(false);
      setDocTitle('');
      setDocContent('');
      showToast(`Document "${docTitle}" successfully ingested into RAG vector index.`);
    } catch (err) {
      showToast('Upload failed.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-graphite-900 border border-graphite-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white font-mono tracking-wide">RAG KNOWLEDGE CENTER</h2>
              <span className="text-[10px] font-mono uppercase bg-forge-cyan/20 text-forge-cyan px-2 py-0.5 rounded border border-forge-cyan/40">
                VECTOR DATABASE RETRIEVAL
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Grounds all multi-agent reasoning, root-cause derivations, and process optimizations in verified machine manuals, ISO/DIN manufacturing standards, and historical failure analysis reports.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setUploadOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-forge-cyan/20 border border-forge-cyan/50 hover:border-forge-cyan text-forge-cyan font-mono text-xs font-bold flex items-center gap-2 transition shadow-sm hover:shadow-[0_0_15px_rgba(0,229,255,0.2)]"
            >
              <Upload className="w-4 h-4" />
              <span>INGEST NEW DOCUMENT</span>
            </button>
          </div>
        </div>

        {/* Semantic Search Bar */}
        <form onSubmit={handleSearch} className="mt-5 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search manufacturing standards, vibration thresholds, thermal drift compensations, Cpk tolerances..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-graphite-850 border border-graphite-750 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-forge-cyan font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-forge-cyan to-forge-blue text-graphite-950 font-mono text-xs font-bold hover:brightness-110 transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{searching ? 'RETRIEVING...' : 'SEMANTIC SEARCH'}</span>
          </button>
        </form>

        {/* Demo Data Notice */}
        <div className="mt-3 text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-forge-cyan" />
          <span>Notice: Grounding corpus contains simulated industrial specifications (ISO 9001, ISO 10816-3, Haas SOP-704, DIN EN 10083).</span>
        </div>
      </div>

      {/* Semantic Search Results (if present) */}
      {searchResults.length > 0 && (
        <div className="bg-graphite-900 border border-forge-cyan/40 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-graphite-800">
            <span className="text-xs font-bold font-mono text-forge-cyan flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              SEMANTIC RETRIEVAL MATCHES ({searchResults.length} CHUNKS)
            </span>
            <button onClick={() => setSearchResults([])} className="text-slate-400 hover:text-white text-xs font-mono">
              Clear Results
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {searchResults.map((chunk) => (
              <div
                key={chunk.id}
                onClick={() => setSelectedChunk(chunk)}
                className="p-3.5 rounded-xl bg-graphite-850 border border-graphite-750 hover:border-forge-cyan transition cursor-pointer"
              >
                <div className="flex items-center justify-between font-mono text-xs mb-1">
                  <span className="text-white font-bold truncate max-w-xs">{chunk.document_title}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-forge-cyan/20 text-forge-cyan border border-forge-cyan/30">
                    {chunk.relevance_pct || `${Math.round((chunk.relevance || 0.9) * 100)}%`} MATCH
                  </span>
                </div>
                <div className="text-[11px] text-forge-cyan font-mono mb-2">{chunk.section}</div>
                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{chunk.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Indexed Document Library & Chunk Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Document List (5 cols) */}
        <div className="lg:col-span-5 bg-graphite-900 border border-graphite-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-graphite-800">
            <h3 className="text-xs font-bold text-white font-mono uppercase flex items-center gap-2">
              <Database className="w-4 h-4 text-forge-cyan" />
              INDEXED MANUFACTURING CORPUS
            </h3>
            <span className="text-[10px] font-mono text-slate-400">{ragDocuments.length} DOCUMENTS</span>
          </div>

          <div className="space-y-2.5">
            {ragDocuments.map((doc) => {
              const isSelected = selectedDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer select-none bg-graphite-850 ${
                    isSelected
                      ? 'border-forge-cyan ring-1 ring-forge-cyan/50 shadow-[0_0_15px_rgba(0,229,255,0.15)]'
                      : 'border-graphite-750 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-[10px] uppercase font-bold text-forge-cyan">{doc.category}</span>
                    <span className="text-[10px] text-slate-400">{doc.filesize}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white font-mono mb-1 leading-snug">{doc.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{doc.description}</p>
                  <div className="mt-2 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                    <span>{doc.filename}</span>
                    <span className="text-slate-300">{doc.sections_count} Indexed Chunks</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Chunks & Metadata Inspector (7 cols) */}
        {selectedDoc && (
          <div className="lg:col-span-7 bg-graphite-900 border border-graphite-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-graphite-800">
              <div>
                <span className="text-[10px] font-mono text-forge-cyan uppercase font-bold tracking-tight">
                  DOCUMENT METADATA
                </span>
                <h3 className="text-sm font-bold text-white font-mono mt-0.5">{selectedDoc.title}</h3>
                <p className="text-xs text-slate-400">{selectedDoc.description}</p>
              </div>
              <span className="text-xs font-mono text-slate-400 bg-graphite-850 px-2 py-1 rounded border border-graphite-750">
                {selectedDoc.filesize}
              </span>
            </div>

            {/* Document Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono bg-graphite-950/60 p-3 rounded-xl border border-graphite-800">
              <div>
                <span className="text-[10px] text-slate-400 block">CATEGORY:</span>
                <span className="text-slate-200 font-bold">{selectedDoc.category}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">FILENAME:</span>
                <span className="text-slate-200 truncate block">{selectedDoc.filename}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">CHUNKS:</span>
                <span className="text-forge-cyan font-bold">{selectedDoc.chunks?.length || 2} Sections</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">TYPE:</span>
                <span className="text-emerald-400 font-bold">Simulated Technical SOP</span>
              </div>
            </div>

            {/* Chunks List */}
            <div>
              <span className="text-xs font-bold font-mono text-white uppercase block mb-2">INDEXED VECTOR CHUNKS</span>
              <div className="space-y-3">
                {selectedDoc.chunks?.map((chunk) => (
                  <div
                    key={chunk.id}
                    onClick={() => setSelectedChunk(chunk)}
                    className="p-3.5 rounded-xl bg-graphite-850 border border-graphite-750 hover:border-forge-cyan/60 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs font-mono text-forge-cyan mb-1.5">
                      <span className="font-bold">{chunk.section}</span>
                      <span className="text-[10px] text-slate-400">{chunk.id}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{chunk.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload Document Modal */}
      {uploadOpen && (
        <div className="fixed inset-0 bg-graphite-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-graphite-900 border border-graphite-700 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-graphite-800">
              <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-forge-cyan" />
                INGEST TECHNICAL DOCUMENT TO RAG INDEX
              </h3>
              <button onClick={() => setUploadOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-slate-300 block mb-1">Document Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Trumpf TruLaser Operating Manual (SOP-802)"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full bg-graphite-850 border border-graphite-700 rounded p-2.5 text-white focus:border-forge-cyan"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Category:</label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value)}
                  className="w-full bg-graphite-850 border border-graphite-700 rounded p-2.5 text-white focus:border-forge-cyan"
                >
                  <option value="Machine Manual & SOP">Machine Manual & SOP</option>
                  <option value="International Standard">International Standard (ISO/DIN)</option>
                  <option value="Material Specification">Material Specification</option>
                  <option value="Historical Production Report">Historical Production Report</option>
                  <option value="Quality Inspection Procedure">Quality Inspection Procedure</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Filename:</label>
                <input
                  type="text"
                  placeholder="e.g. Trumpf_Laser_SOP_802.pdf"
                  value={docFilename}
                  onChange={(e) => setDocFilename(e.target.value)}
                  className="w-full bg-graphite-850 border border-graphite-700 rounded p-2.5 text-white focus:border-forge-cyan"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Content / Technical Text (Will be auto-chunked):</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Paste procedure text, operating tolerances, parameter guidelines..."
                  value={docContent}
                  onChange={(e) => setDocContent(e.target.value)}
                  className="w-full bg-graphite-850 border border-graphite-700 rounded p-2.5 text-white focus:border-forge-cyan font-sans text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setUploadOpen(false)}
                  className="px-4 py-2 rounded-lg bg-graphite-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-forge-cyan text-graphite-950 font-bold hover:bg-cyan-300 transition"
                >
                  INDEX DOCUMENT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Chunk Inspector Modal */}
      {selectedChunk && (
        <div className="fixed inset-0 bg-graphite-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-graphite-900 border border-graphite-700 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-graphite-800">
              <span className="text-xs font-mono font-bold text-forge-cyan">{selectedChunk.section}</span>
              <button onClick={() => setSelectedChunk(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-sans bg-graphite-850 p-4 rounded-xl border border-graphite-750">
              {selectedChunk.content}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedChunk(null)}
                className="px-4 py-2 rounded-lg bg-graphite-800 text-slate-300 hover:text-white text-xs font-mono"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
