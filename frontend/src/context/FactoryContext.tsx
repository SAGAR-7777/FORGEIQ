import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Machine, Anomaly, PredictedDefect, Recommendation,
  AgentMessage, QualitySummary, IncidentReplayStep, MaintenanceEvent, RAGDocument
} from '../types';
import { api } from '../services/api';

interface FactoryContextType {
  machines: Machine[];
  selectedMachine: Machine | null;
  setSelectedMachine: (m: Machine | null) => void;
  anomalies: Anomaly[];
  defects: PredictedDefect[];
  recommendations: Recommendation[];
  qualitySummary: QualitySummary | null;
  agents: AgentMessage[];
  consensusScore: number;
  maintenanceEvents: MaintenanceEvent[];
  ragDocuments: RAGDocument[];
  currentView: string;
  setCurrentView: (view: string) => void;
  isStreaming: boolean;
  setIsStreaming: (active: boolean) => void;
  refreshData: () => Promise<void>;
  injectFault: (machineId: string, faultType: string) => Promise<any>;
  approveRecommendation: (id: string, operatorName?: string) => Promise<any>;
  rejectRecommendation: (id: string, operatorName?: string) => Promise<any>;
  modifyRecommendation: (id: string, params: Record<string, any>, operatorName?: string) => Promise<any>;
  triggerAgentRun: (machineId?: string) => Promise<any>;
  resetSimulation: () => Promise<void>;
  // Demo Mode Tour
  demoActive: boolean;
  setDemoActive: (active: boolean) => void;
  demoStep: number;
  setDemoStep: (step: number) => void;
  runDemoStep: (step: number) => Promise<void>;
  // Global search & notifications
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  notificationOpen: boolean;
  setNotificationOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const FactoryContext = createContext<FactoryContextType | undefined>(undefined);

export const FactoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [defects, setDefects] = useState<PredictedDefect[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [qualitySummary, setQualitySummary] = useState<QualitySummary | null>(null);
  const [agents, setAgents] = useState<AgentMessage[]>([]);
  const [consensusScore, setConsensusScore] = useState<number>(92.0);
  const [maintenanceEvents, setMaintenanceEvents] = useState<MaintenanceEvent[]>([]);
  const [ragDocuments, setRagDocuments] = useState<RAGDocument[]>([]);
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [demoActive, setDemoActive] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notificationOpen, setNotificationOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  }, []);

  const refreshData = useCallback(async () => {
    try {
      const [machList, qual, anom, defs, recs, agentSt, maint, docs] = await Promise.all([
        api.getMachines(),
        api.getQualitySummary(),
        api.getAnomalies(),
        api.getDefects(),
        api.getRecommendations(),
        api.getAgentsStatus(),
        api.getMaintenance(),
        api.getRAGDocuments()
      ]);

      setMachines(machList);
      setQualitySummary(qual);
      setAnomalies(anom);
      setDefects(defs);
      setRecommendations(recs);
      setAgents(agentSt.agents || []);
      setConsensusScore(agentSt.consensus_score || 92.0);
      setMaintenanceEvents(maint.events || []);
      setRagDocuments(docs);

      // Keep selected machine in sync
      if (selectedMachine) {
        const updated = machList.find((m: Machine) => m.id === selectedMachine.id);
        if (updated) setSelectedMachine(updated);
      } else if (machList.length > 0 && !selectedMachine) {
        // default select CNC-MILL #06
        const cnc6 = machList.find((m: Machine) => m.id === 'M-206') || machList[0];
        setSelectedMachine(cnc6);
      }
    } catch (err) {
      console.warn('Backend sync retry:', err);
    }
  }, [selectedMachine]);

  // Periodic polling every 3 seconds if streaming is active
  useEffect(() => {
    refreshData();
    if (!isStreaming) return;
    const interval = setInterval(() => {
      refreshData();
    }, 3000);
    return () => clearInterval(interval);
  }, [isStreaming, refreshData]);

  const injectFault = async (machineId: string, faultType: string) => {
    showToast(`Injecting ${faultType.replace('_', ' ')} into ${machineId}...`);
    const res = await api.injectFault(machineId, faultType);
    await refreshData();
    showToast(`Anomaly triggered! Multi-agent pipeline updated with consensus score.`);
    return res;
  };

  const approveRecommendation = async (id: string, operatorName = 'Lead Quality Engineer') => {
    showToast(`Authorizing recipe adjustment ${id}...`);
    const res = await api.approveRecommendation(id, operatorName);
    await refreshData();
    showToast(`Operator approved recommendation. Machine parameters updated.`);
    return res;
  };

  const rejectRecommendation = async (id: string, operatorName = 'Lead Quality Engineer') => {
    const res = await api.rejectRecommendation(id, operatorName);
    await refreshData();
    showToast(`Recommendation rejected by operator.`);
    return res;
  };

  const modifyRecommendation = async (id: string, params: Record<string, any>, operatorName = 'Lead Quality Engineer') => {
    const res = await api.modifyRecommendation(id, params, operatorName);
    await refreshData();
    showToast(`Modified recommendation approved.`);
    return res;
  };

  const triggerAgentRun = async (machineId = 'M-206') => {
    showToast(`Executing full multi-agent orchestration chain for ${machineId}...`);
    const res = await api.triggerAgentRun(machineId);
    await refreshData();
    showToast(`Multi-agent run completed! Consensus Score: ${res.consensus_score}%`);
    return res;
  };

  const resetSimulation = async () => {
    await api.resetSimulation();
    await refreshData();
    showToast(`Simulation reset to golden factory baseline.`);
  };

  // Guided Demo Flow execution
  const runDemoStep = async (step: number) => {
    setDemoStep(step);
    if (step === 1) {
      // 1. Start factory & golden state
      await resetSimulation();
      setCurrentView('dashboard');
      showToast('Demo Step 1: Factory initialized in nominal baseline operating mode.');
    } else if (step === 2) {
      // 2. Detect anomaly: inject vibration anomaly on CNC-MILL #06
      await injectFault('M-206', 'vibration_anomaly');
      setCurrentView('anomalies');
      showToast('Demo Step 2: Anomaly injected on CNC-MILL #06. Vibration exceeds ISO threshold.');
    } else if (step === 3) {
      // 3. Analyze quality
      setCurrentView('agents');
      showToast('Demo Step 3: Quality Analysis Agent flags Cpk deviation & pattern mismatch.');
    } else if (step === 4) {
      // 4. Predict defect
      setCurrentView('defects');
      showToast('Demo Step 4: Defect Prediction Agent projects 82% Dimensional Inaccuracy.');
    } else if (step === 5) {
      // 5. Explain root cause
      setCurrentView('root_cause');
      showToast('Demo Step 5: Root-Cause Graph visualizes causal link from bearing wear to thermal growth.');
    } else if (step === 6) {
      // 6. Run what-if simulation
      setCurrentView('what_if');
      showToast('Demo Step 6: What-If Simulator tests lowering RPM 1780 → 1420.');
    } else if (step === 7) {
      // 7. Approve recommendation (Human in the loop)
      setCurrentView('optimization');
      showToast('Demo Step 7: Process Optimization Agent stages REC-401 for operator sign-off.');
    } else if (step === 8) {
      // 8. Show improved simulated quality
      const pending = recommendations.find((r) => r.machine_id === 'M-206' && r.approval_status === 'pending');
      if (pending) {
        await approveRecommendation(pending.id);
      }
      setCurrentView('dashboard');
      showToast('Demo Step 8: Recommendation approved! Machine parameters restored to golden state.');
    }
  };

  return (
    <FactoryContext.Provider
      value={{
        machines,
        selectedMachine,
        setSelectedMachine,
        anomalies,
        defects,
        recommendations,
        qualitySummary,
        agents,
        consensusScore,
        maintenanceEvents,
        ragDocuments,
        currentView,
        setCurrentView,
        isStreaming,
        setIsStreaming,
        refreshData,
        injectFault,
        approveRecommendation,
        rejectRecommendation,
        modifyRecommendation,
        triggerAgentRun,
        resetSimulation,
        demoActive,
        setDemoActive,
        demoStep,
        setDemoStep,
        runDemoStep,
        searchQuery,
        setSearchQuery,
        notificationOpen,
        setNotificationOpen,
        toastMessage,
        showToast
      }}
    >
      {children}
    </FactoryContext.Provider>
  );
};

export const useFactory = () => {
  const context = useContext(FactoryContext);
  if (!context) throw new Error('useFactory must be used within a FactoryProvider');
  return context;
};
