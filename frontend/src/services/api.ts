import {
  Machine, Anomaly, PredictedDefect, Recommendation,
  AgentMessage, QualitySummary, WhatIfSimulationResult,
  IncidentReplayStep, MaintenanceEvent, RAGDocument, RAGChunk
} from '../types';

const API_BASE = '/api';

export const api = {
  // Machines
  async getMachines(): Promise<Machine[]> {
    const res = await fetch(`${API_BASE}/machines`);
    if (!res.ok) throw new Error('Failed to fetch machines');
    return res.json();
  },

  async getMachineDetail(id: string): Promise<{ machine: Machine; active_anomalies: Anomaly[]; pending_recommendations: Recommendation[] }> {
    const res = await fetch(`${API_BASE}/machines/${id}`);
    if (!res.ok) throw new Error('Failed to fetch machine detail');
    return res.json();
  },

  // Sensor History
  async getSensorHistory(id: string): Promise<{ machine_id: string; history: any[] }> {
    const res = await fetch(`${API_BASE}/sensors/${id}/history`);
    if (!res.ok) throw new Error('Failed to fetch sensor history');
    return res.json();
  },

  async getSensorsSummary(): Promise<any> {
    const res = await fetch(`${API_BASE}/sensors/summary`);
    if (!res.ok) throw new Error('Failed to fetch sensor summary');
    return res.json();
  },

  // Anomalies
  async getAnomalies(): Promise<Anomaly[]> {
    const res = await fetch(`${API_BASE}/anomalies`);
    if (!res.ok) throw new Error('Failed to fetch anomalies');
    return res.json();
  },

  async resolveAnomaly(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/anomalies/resolve/${id}`, { method: 'POST' });
    return res.json();
  },

  // Quality & Forge Quality Index
  async getQualitySummary(): Promise<QualitySummary> {
    const res = await fetch(`${API_BASE}/quality/summary`);
    if (!res.ok) throw new Error('Failed to fetch quality summary');
    return res.json();
  },

  // Defects
  async getDefects(): Promise<PredictedDefect[]> {
    const res = await fetch(`${API_BASE}/defects`);
    if (!res.ok) throw new Error('Failed to fetch defects');
    return res.json();
  },

  // Recommendations
  async getRecommendations(): Promise<Recommendation[]> {
    const res = await fetch(`${API_BASE}/recommendations`);
    if (!res.ok) throw new Error('Failed to fetch recommendations');
    return res.json();
  },

  async approveRecommendation(id: string, operator_name = 'Lead Quality Engineer'): Promise<any> {
    const res = await fetch(`${API_BASE}/recommendations/${id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operator_name, notes: 'Approved via Control Center' })
    });
    return res.json();
  },

  async rejectRecommendation(id: string, operator_name = 'Lead Quality Engineer'): Promise<any> {
    const res = await fetch(`${API_BASE}/recommendations/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operator_name, notes: 'Rejected by operator' })
    });
    return res.json();
  },

  async modifyRecommendation(id: string, modified_params: Record<string, any>, operator_name = 'Lead Quality Engineer'): Promise<any> {
    const res = await fetch(`${API_BASE}/recommendations/${id}/modify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operator_name, modified_params, notes: 'Adjusted and approved' })
    });
    return res.json();
  },

  // Agents
  async getAgentsStatus(): Promise<{ consensus_score: number; consensus_label: string; agents: AgentMessage[] }> {
    const res = await fetch(`${API_BASE}/agents/status`);
    if (!res.ok) throw new Error('Failed to fetch agent status');
    return res.json();
  },

  async triggerAgentRun(machine_id = 'M-206'): Promise<any> {
    const res = await fetch(`${API_BASE}/agents/run?machine_id=${machine_id}`, { method: 'POST' });
    return res.json();
  },

  // RAG Knowledge Center
  async getRAGDocuments(): Promise<RAGDocument[]> {
    const res = await fetch(`${API_BASE}/rag/documents`);
    if (!res.ok) throw new Error('Failed to fetch documents');
    return res.json();
  },

  async getRAGChunks(): Promise<RAGChunk[]> {
    const res = await fetch(`${API_BASE}/rag/chunks`);
    if (!res.ok) throw new Error('Failed to fetch chunks');
    return res.json();
  },

  async searchRAG(query: string, top_k = 4): Promise<{ query: string; results: RAGChunk[] }> {
    const res = await fetch(`${API_BASE}/rag/search?query=${encodeURIComponent(query)}&top_k=${top_k}`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to search RAG');
    return res.json();
  },

  async uploadRAGDoc(doc: { title: string; category: string; filename: string; content: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/rag/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc)
    });
    return res.json();
  },

  // Reports
  async getLatestReport(): Promise<any> {
    const res = await fetch(`${API_BASE}/reports/latest`);
    if (!res.ok) throw new Error('Failed to fetch report');
    return res.json();
  },

  // Analytics
  async getAnalytics(timeframe = '24 Hours'): Promise<any> {
    const res = await fetch(`${API_BASE}/analytics/overview?timeframe=${encodeURIComponent(timeframe)}`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  // What-If Simulator
  async runWhatIf(current_params: Record<string, number>, simulated_params: Record<string, number>): Promise<WhatIfSimulationResult> {
    const res = await fetch(`${API_BASE}/simulation/what-if`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_params, simulated_params })
    });
    if (!res.ok) throw new Error('Failed to run What-If simulation');
    return res.json();
  },

  // Simulator Controls & Fault Injection
  async startSimulation(): Promise<any> {
    const res = await fetch(`${API_BASE}/simulation/start`, { method: 'POST' });
    return res.json();
  },

  async pauseSimulation(): Promise<any> {
    const res = await fetch(`${API_BASE}/simulation/pause`, { method: 'POST' });
    return res.json();
  },

  async resetSimulation(): Promise<any> {
    const res = await fetch(`${API_BASE}/simulation/reset`, { method: 'POST' });
    return res.json();
  },

  async injectFault(machine_id: string, fault_type: string): Promise<any> {
    const res = await fetch(`${API_BASE}/simulation/inject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ machine_id, fault_type })
    });
    return res.json();
  },

  // Forge Copilot
  async chatWithCopilot(query: string, machine_id?: string): Promise<{ query: string; answer: string; rag_sources: RAGChunk[]; model: string; mode: string }> {
    const res = await fetch(`${API_BASE}/copilot/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, machine_id })
    });
    if (!res.ok) throw new Error('Failed to communicate with Copilot');
    return res.json();
  },

  // Maintenance
  async getMaintenance(): Promise<{ overall_maintenance_health: number; urgent_attention_count: number; events: MaintenanceEvent[] }> {
    const res = await fetch(`${API_BASE}/maintenance`);
    if (!res.ok) throw new Error('Failed to fetch maintenance data');
    return res.json();
  },

  // Incident Replay
  async getIncidentReplay(): Promise<{ incident_title: string; machine_name: string; total_steps: number; steps: IncidentReplayStep[] }> {
    const res = await fetch(`${API_BASE}/incident-replay`);
    if (!res.ok) throw new Error('Failed to fetch incident replay');
    return res.json();
  }
};
