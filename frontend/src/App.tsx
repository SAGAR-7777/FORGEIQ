import React from 'react';
import { FactoryProvider, useFactory } from './context/FactoryContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';

// Pages & Views
import { LandingPage } from './pages/LandingPage';
import { ExecutiveDashboard } from './pages/ExecutiveDashboard';
import { FactoryTwinMap } from './components/digital_twin/FactoryTwinMap';
import { MachinesPage } from './pages/MachinesPage';
import { LiveMonitoringPage } from './pages/LiveMonitoringPage';
import { AnomalyCenterPage } from './pages/AnomalyCenterPage';
import { DefectIntelligencePage } from './pages/DefectIntelligencePage';
import { RootCauseGraph } from './components/root_cause/RootCauseGraph';
import { OptimizationCopilot } from './components/optimization/OptimizationCopilot';
import { WhatIfSimulator } from './components/what_if/WhatIfSimulator';
import { AgentCommandCenter } from './components/agents/AgentCommandCenter';
import { ForgeCopilot } from './components/copilot/ForgeCopilot';
import { KnowledgeCenter } from './components/rag/KnowledgeCenter';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { IncidentReplayPlayer } from './components/incident_replay/IncidentReplayPlayer';
import { AIQualityReport } from './components/reports/AIQualityReport';
import { DataSimulatorPanel } from './components/simulator/DataSimulatorPanel';
import { SystemArchitecture } from './components/architecture/SystemArchitecture';
import { SettingsPage } from './pages/SettingsPage';

const MainLayout: React.FC = () => {
  const { currentView, toastMessage } = useFactory();

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage />;
      case 'dashboard':
        return <ExecutiveDashboard />;
      case 'factory_twin':
        return <FactoryTwinMap />;
      case 'machines':
        return <MachinesPage />;
      case 'live_monitoring':
        return <LiveMonitoringPage />;
      case 'anomalies':
        return <AnomalyCenterPage />;
      case 'defects':
        return <DefectIntelligencePage />;
      case 'root_cause':
        return <RootCauseGraph />;
      case 'optimization':
        return <OptimizationCopilot />;
      case 'what_if':
        return <WhatIfSimulator />;
      case 'agents':
        return <AgentCommandCenter />;
      case 'copilot':
        return <ForgeCopilot />;
      case 'knowledge':
        return <KnowledgeCenter />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'replay':
        return <IncidentReplayPlayer />;
      case 'reports':
        return <AIQualityReport />;
      case 'simulator':
        return <DataSimulatorPanel />;
      case 'architecture':
        return <SystemArchitecture />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <ExecutiveDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-graphite-950 text-slate-100 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      {currentView !== 'landing' && <Sidebar />}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {currentView !== 'landing' && <Navbar />}

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-grid-pattern">
          {renderView()}
        </main>
      </div>

      {/* Global Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-graphite-900 border border-forge-cyan text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 font-mono text-xs animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span className="w-2 h-2 rounded-full bg-forge-cyan animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <FactoryProvider>
      <MainLayout />
    </FactoryProvider>
  );
};

export default App;
