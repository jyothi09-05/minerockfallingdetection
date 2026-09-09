import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'amber' | 'emerald' | 'cyan' | 'red' | 'slate';
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'amber',
  trend
}) => {
  const variantStyles = {
    amber: 'text-mine-amber border-mine-amber/20 bg-mine-amber/5',
    emerald: 'text-mine-emerald border-mine-emerald/20 bg-mine-emerald/5',
    cyan: 'text-mine-cyan border-mine-cyan/20 bg-mine-cyan/5',
    red: 'text-mine-red border-mine-red/20 bg-mine-red/5',
    slate: 'text-slate-300 border-slate-700/40 bg-slate-800/20'
  };

  return (
    <div className="bg-[#121824] border border-mine-border rounded-xl p-5 shadow-industrial hover:border-slate-700 transition relative overflow-hidden group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className="text-2xl font-bold font-mono text-slate-100 mt-1 tracking-tight">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-lg border flex items-center justify-center ${variantStyles[variant]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {(subtitle || trend) && (
        <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-mine-border/60">
          {subtitle && <span className="text-slate-400 font-sans">{subtitle}</span>}
          {trend && <span className="font-mono text-mine-emerald font-semibold">{trend}</span>}
        </div>
      )}
    </div>
  );
};
