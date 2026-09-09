import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = status.toUpperCase().replace(/\s+/g, '_');

  const getStyle = () => {
    switch (normalized) {
      case 'ACTIVE':
      case 'OPERATIONAL':
      case 'ONLINE':
      case 'OPEN':
      case 'ON_DUTY':
      case 'VALID':
      case 'NORMAL':
      case 'SUCCESS':
        return 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60';

      case 'WARNING':
      case 'STANDBY':
      case 'UNDER_MAINTENANCE':
      case 'MAINTENANCE':
      case 'DRILLING':
      case 'LOADING':
      case 'INVESTIGATING':
        return 'bg-amber-950/40 text-amber-400 border-amber-800/60';

      case 'CRITICAL':
      case 'CRITICAL_FAULT':
      case 'EVACUATED':
      case 'EMERGENCY_EVACUATION':
      case 'UNSTABLE':
      case 'BLOCKED':
      case 'INJURED':
      case 'CATASTROPHIC':
      case 'FAILED':
      case 'RESTRICTED':
        return 'bg-red-950/40 text-red-400 border-red-800/60 animate-pulse';

      case 'OFFLINE':
      case 'DECOMMISSIONED':
      case 'OFF_DUTY':
      case 'CLOSED':
      case 'EXPIRED':
      default:
        return 'bg-slate-800/40 text-slate-400 border-slate-700/60';
    }
  };

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center font-mono font-semibold uppercase tracking-wider rounded-md border ${getStyle()} ${sizeClass}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
      {status.replace(/_/g, ' ')}
    </span>
  );
};
