export type MachineStatus = 'normal' | 'warning' | 'critical' | 'maintenance';

export interface Machine {
  id: string;
  name: string;
  type: string;
  line: string;
  cell: string;
  status: MachineStatus;
  rpm: number;
  temp: number;
  pressure: number;
  vibration: number;
  speed: number;
  torque: number;
  humidity: number;
  health: number;
  quality_score: number;
  defect_prob: number;
  prod_count: number;
}

export interface TelemetryPoint {
  timestamp: string;
  time_str: string;
  temperature: number;
  pressure: number;
  vibration: number;
  rpm: number;
  torque: number;
  speed: number;
  quality_score: number;
  defect_prob: number;
}

export interface Anomaly {
  id: string;
  machine_id: string;
  machine_name: string;
  parameter: string;
  current_value: number;
  unit: string;
  normal_range: string;
  deviation: string;
  severity: 'normal' | 'warning' | 'critical';
  timestamp: string;
  time_str: string;
  trend: string;
  ai_explanation: string;
  status: 'active' | 'resolved';
}

export interface TopContributor {
  name: string;
  impact: string;
  value: string;
}

export interface PredictedDefect {
  id: string;
  machine_id: string;
  machine_name: string;
  defect_type: string;
  probability: number;
  probability_pct: string;
  risk_level: 'NORMAL' | 'EARLY WARNING' | 'HIGH RISK' | 'CRITICAL';
  confidence: number;
  confidence_pct: string;
  top_contributors: TopContributor[];
  predicted_scrap_rate: string;
  affected_batch?: string;
  similar_incidents: string[];
  timestamp: string;
}

export interface RAGSource {
  document: string;
  document_title?: string;
  section: string;
  relevance: number;
  relevance_pct?: string;
  excerpt: string;
}

export interface Recommendation {
  id: string;
  machine_id: string;
  machine_name: string;
  title: string;
  action_type: string;
  current_params: Record<string, any>;
  recommended_params: Record<string, any>;
  expected_impact: {
    defect_probability: string;
    quality_score: string;
    scrap_reduction: string;
    production_time: string;
  };
  confidence: number;
  approval_status: 'pending' | 'approved' | 'rejected' | 'modified_and_approved';
  reviewed_by: string | null;
  reviewed_at: string | null;
  rag_source: RAGSource;
  reasoning: string;
  created_at: string;
}

export interface AgentMessage {
  agent: string;
  agent_role: string;
  status: string;
  task: string;
  input: string;
  output: string;
  confidence: number;
  processing_time: string;
  last_action: string;
  reasoning_summary: string;
  timestamp?: string;
}

export interface QualitySummary {
  forge_quality_index: number;
  fqi_label: string;
  fqi_disclaimer: string;
  factory_quality_score: number;
  factory_defect_risk: number;
  active_anomalies_count: number;
  machines_online: string;
  average_machine_health: number;
  total_production: number;
  composite_factors: {
    factor: string;
    weight: string;
    score: number;
    status: string;
  }[];
}

export interface WhatIfSimulationResult {
  is_model_estimate: boolean;
  disclaimer: string;
  current_state: {
    temperature: number;
    pressure: number;
    rpm: number;
    speed: number;
    coolant_flow: number;
    defect_probability: number;
    quality_score: number;
    estimated_scrap_rate: number;
    thermal_stability: string;
  };
  simulated_state: {
    temperature: number;
    pressure: number;
    rpm: number;
    speed: number;
    coolant_flow: number;
    defect_probability: number;
    quality_score: number;
    estimated_scrap_rate: number;
    production_time_delta: string;
    energy_saving_delta: string;
    thermal_stability: string;
  };
  impact_deltas: {
    defect_prob_reduction: string;
    quality_score_improvement: string;
    scrap_reduction: string;
    production_time: string;
  };
  recommendation_summary: string;
}

export interface IncidentReplayStep {
  step: number;
  time: string;
  timestamp: string;
  event: string;
  status: 'normal' | 'warning' | 'critical';
  temp: number;
  pressure: number;
  vibration: number;
  rpm: number;
  defect_prob: number;
  quality_score: number;
  description: string;
  active_agent: string;
  agent_thought: string;
}

export interface MaintenanceEvent {
  id: string;
  machine_id: string;
  machine_name: string;
  component: string;
  health: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  operating_hours: number;
  last_serviced: string;
  predicted_rul_days: number;
  recommendation: string;
}

export interface RAGDocument {
  id: string;
  title: string;
  category: string;
  filename: string;
  uploaded_at: string;
  filesize: string;
  sections_count: number;
  is_simulated: boolean;
  description: string;
  chunks?: RAGChunk[];
}

export interface RAGChunk {
  id: string;
  document_id?: string;
  document_title?: string;
  filename?: string;
  category?: string;
  section: string;
  content: string;
  relevance?: number;
  relevance_pct?: string;
}
