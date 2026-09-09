import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { UnifiedCommandCenter } from './pages/UnifiedCommandCenter';
import { IncidentManagement } from './pages/IncidentManagement';
import { EmergencyResponse } from './pages/EmergencyResponse';
import { AnalyticsPlatform } from './pages/AnalyticsPlatform';
import { ReportsCenter } from './pages/ReportsCenter';
import { Administration } from './pages/Administration';
import { Observability } from './pages/Observability';
import { AiAssistant } from './pages/AiAssistant';
import { AiOverview } from './pages/AiOverview';
import { GeotechnicalRisk } from './pages/GeotechnicalRisk';
import { CollisionAvoidance } from './pages/CollisionAvoidance';
import { PredictiveMaintenance } from './pages/PredictiveMaintenance';
import { WorkerSafetyAi } from './pages/WorkerSafetyAi';
import { ComputerVision } from './pages/ComputerVision';
import { ModelRegistry } from './pages/ModelRegistry';
import { DigitalTwin } from './pages/DigitalTwin';
import { SimulationStudio } from './pages/SimulationStudio';
import { MineList } from './pages/MineList';
import { MineDetails } from './pages/MineDetails';
import { ZoneManagement } from './pages/ZoneManagement';
import { EquipmentManagement } from './pages/EquipmentManagement';
import { VehicleManagement } from './pages/VehicleManagement';
import { WorkerManagement } from './pages/WorkerManagement';
import { SensorManagement } from './pages/SensorManagement';
import { UserManagement } from './pages/UserManagement';
import { AuditLogs } from './pages/AuditLogs';
import { Settings } from './pages/Settings';

const ProtectedLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#070A0F] text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="p-6 flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<UnifiedCommandCenter />} />
            <Route path="/incidents" element={<IncidentManagement />} />
            <Route path="/emergency" element={<EmergencyResponse />} />
            <Route path="/analytics" element={<AnalyticsPlatform />} />
            <Route path="/reports" element={<ReportsCenter />} />
            <Route path="/admin" element={<Administration />} />
            <Route path="/observability" element={<Observability />} />
            <Route path="/dashboard-legacy" element={<Dashboard />} />
            <Route path="/ai-assistant" element={<AiAssistant />} />
            <Route path="/ai-overview" element={<AiOverview />} />
            <Route path="/geotech-risk" element={<GeotechnicalRisk />} />
            <Route path="/collision-avoidance" element={<CollisionAvoidance />} />
            <Route path="/predictive-maintenance" element={<PredictiveMaintenance />} />
            <Route path="/worker-safety-ai" element={<WorkerSafetyAi />} />
            <Route path="/computer-vision" element={<ComputerVision />} />
            <Route path="/model-registry" element={<ModelRegistry />} />
            <Route path="/digital-twin" element={<DigitalTwin />} />
            <Route path="/simulation-studio" element={<SimulationStudio />} />
            <Route path="/mines" element={<MineList />} />
            <Route path="/mines/:id" element={<MineDetails />} />
            <Route path="/zones" element={<ZoneManagement />} />
            <Route path="/equipment" element={<EquipmentManagement />} />
            <Route path="/vehicles" element={<VehicleManagement />} />
            <Route path="/workers" element={<WorkerManagement />} />
            <Route path="/sensors" element={<SensorManagement />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<ProtectedLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
