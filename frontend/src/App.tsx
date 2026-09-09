import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
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
            <Route path="/" element={<Dashboard />} />
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
