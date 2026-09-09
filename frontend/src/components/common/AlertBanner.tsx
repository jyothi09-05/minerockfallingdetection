import React from 'react';
import { ShieldAlert, AlertTriangle, Info } from 'lucide-react';

interface AlertBannerProps {
  level: 'INFO' | 'WARNING' | 'CRITICAL' | 'EMERGENCY_EVACUATION';
  title: string;
  message: string;
  onAcknowledge?: () => void;
  isAcknowledged?: boolean;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  level,
  title,
  message,
  onAcknowledge,
  isAcknowledged
}) => {
  const getStyle = () => {
    switch (level) {
      case 'EMERGENCY_EVACUATION':
      case 'CRITICAL':
        return {
          bg: 'bg-red-950/60 border-red-800 text-red-100 hazard-stripes',
          icon: ShieldAlert,
          iconColor: 'text-red-400',
          glow: 'pulse-glow-red'
        };
      case 'WARNING':
        return {
          bg: 'bg-amber-950/40 border-amber-800/80 text-amber-100',
          icon: AlertTriangle,
          iconColor: 'text-mine-amber',
          glow: 'pulse-glow-amber'
        };
      default:
        return {
          bg: 'bg-slate-900 border-mine-border text-slate-200',
          icon: Info,
          iconColor: 'text-mine-cyan',
          glow: ''
        };
    }
  };

  const style = getStyle();
  const Icon = style.icon;

  return (
    <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${style.bg} ${style.glow}`}>
      <div className="flex items-start space-x-3">
        <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${style.iconColor}`} />
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-black/40 border border-white/10">
              {level.replace('_', ' ')}
            </span>
            <h4 className="text-xs font-bold font-sans">{title}</h4>
          </div>
          <p className="text-xs text-slate-300 mt-1">{message}</p>
        </div>
      </div>
      {onAcknowledge && (
        <button
          onClick={onAcknowledge}
          disabled={isAcknowledged}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition shrink-0 ${
            isAcknowledged
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
              : 'bg-mine-amber text-black hover:bg-amber-400 shadow-amber-glow'
          }`}
        >
          {isAcknowledged ? 'ACKNOWLEDGED' : 'ACKNOWLEDGE'}
        </button>
      )}
    </div>
  );
};
