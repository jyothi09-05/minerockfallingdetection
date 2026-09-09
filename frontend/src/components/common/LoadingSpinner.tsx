import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading telemetry data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-3">
      <Loader2 className="w-8 h-8 text-mine-amber animate-spin" />
      <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">{message}</p>
    </div>
  );
};
