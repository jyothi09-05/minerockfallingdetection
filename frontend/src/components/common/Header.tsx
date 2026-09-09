import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Mine, Alert } from '../../types';
import { Bell, ShieldAlert, Radio, User, ChevronDown, LogOut, CheckCircle } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout, selectedMineId, setSelectedMineId } = useAuth();
  const [mines, setMines] = useState<Mine[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    api.getMines().then(setMines);
    api.getAlerts(selectedMineId).then(setActiveAlerts);
    const interval = setInterval(() => {
      api.getAlerts(selectedMineId).then(setActiveAlerts);
    }, 8000);
    return () => clearInterval(interval);
  }, [selectedMineId]);

  const currentMine = mines.find(m => m.id === selectedMineId) || mines[0];
  const unackAlerts = activeAlerts.filter(a => !a.isAcknowledged);

  return (
    <header className="h-16 bg-[#0B0F17] border-b border-mine-border px-6 flex items-center justify-between sticky top-0 z-30 shadow-md">
      {/* Left: Active Mine Selector */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-[#121824] px-3 py-1.5 rounded-md border border-mine-border">
          <Radio className="w-4 h-4 text-mine-emerald animate-pulse" />
          <span className="text-xs font-mono text-slate-400 uppercase">ACTIVE MINE:</span>
          <select 
            value={selectedMineId} 
            onChange={(e) => setSelectedMineId(e.target.value)}
            className="bg-transparent text-sm font-semibold text-slate-100 outline-none cursor-pointer"
          >
            {mines.map(m => (
              <option key={m.id} value={m.id} className="bg-mine-card text-slate-200">
                {m.name} ({m.code})
              </option>
            ))}
          </select>
        </div>

        <div className="hidden lg:flex items-center space-x-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>AIR QUALITY: OPTIMAL (42 PPM)</span>
          <span className="text-slate-600">|</span>
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <span>FLEET HEALTH: 94%</span>
        </div>
      </div>

      {/* Center: Live Alert Ticker if any active alerts */}
      {unackAlerts.length > 0 && (
        <div className="hidden xl:flex items-center space-x-2 bg-red-950/40 border border-red-800/60 px-3 py-1 rounded text-red-300 text-xs font-mono animate-pulse">
          <ShieldAlert className="w-4 h-4 text-red-400" />
          <span className="font-bold">CRITICAL WARNING:</span>
          <span>{unackAlerts[0].title}</span>
        </div>
      )}

      {/* Right: Telemetry Hub & User Profile */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button className="p-2 rounded-lg bg-mine-surface border border-mine-border text-slate-300 hover:text-white hover:bg-mine-hover transition flex items-center">
            <Bell className="w-4 h-4" />
            {activeAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeAlerts.length}
              </span>
            )}
          </button>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 bg-mine-surface border border-mine-border px-3 py-1.5 rounded-lg hover:bg-mine-hover transition"
          >
            <div className="w-7 h-7 rounded bg-mine-amber text-black font-bold text-xs flex items-center justify-center">
              {user?.firstName?.charAt(0) || 'A'}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-slate-100">{user?.fullName || 'Alexander Vance'}</div>
              <div className="text-[10px] font-mono text-mine-amber uppercase">
                {user?.roles?.[0]?.replace('ROLE_', '') || 'SUPER_ADMIN'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-mine-card border border-mine-border rounded-lg shadow-xl py-1 z-50">
              <div className="px-4 py-2 border-b border-mine-border">
                <p className="text-xs text-slate-400">Signed in as</p>
                <p className="text-sm font-semibold text-slate-200 truncate">{user?.email}</p>
              </div>
              <button 
                onClick={logout}
                className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-950/30 flex items-center space-x-2 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
