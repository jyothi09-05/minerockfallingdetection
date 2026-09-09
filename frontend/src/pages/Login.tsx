import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Cpu, ShieldCheck, Lock, User, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState('superadmin@minemind.io');
  const [password, setPassword] = useState('MineMind@Admin2026!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(identifier, password);
    setLoading(false);

    if (success) {
      navigate('/');
    } else {
      setError('Invalid username or password. Please verify your credentials.');
    }
  };

  const handleQuickFill = (userType: string) => {
    if (userType === 'admin') {
      setIdentifier('superadmin@minemind.io');
      setPassword('MineMind@Admin2026!');
    } else if (userType === 'safety') {
      setIdentifier('safety@minemind.io');
      setPassword('MineMind@Safety2026!');
    } else {
      setIdentifier('viewer@minemind.io');
      setPassword('MineMind@Viewer2026!');
    }
  };

  return (
    <div className="min-h-screen bg-[#070A0F] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background industrial grid accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161F30_1px,transparent_1px),linear-gradient(to_bottom,#161F30_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>

      <div className="w-full max-w-md bg-[#0B0F17] border border-mine-border rounded-2xl shadow-2xl p-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-mine-amber/10 border border-mine-amber/30 text-mine-amber mx-auto flex items-center justify-center shadow-amber-glow mb-4">
            <Cpu className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold font-mono tracking-wider text-slate-100">
            MINEMIND<span className="text-mine-amber">.AI</span>
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-widest">
            Mining Digital Twin & Operations Platform
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-1.5">
              Username or Corporate Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full bg-[#121824] border border-mine-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:border-mine-amber focus:outline-none transition"
                placeholder="operator@minemind.io"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-1.5">
              Access Key / Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#121824] border border-mine-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:border-mine-amber focus:outline-none transition"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-mine-amber text-black font-mono font-bold py-3 rounded-lg hover:bg-amber-400 transition shadow-amber-glow text-sm uppercase tracking-wider flex items-center justify-center space-x-2 mt-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Establish Secure Session'}</span>
          </button>
        </form>

        {/* Preset quick test accounts */}
        <div className="mt-8 pt-6 border-t border-mine-border">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider text-center mb-2.5">
            Quick Fill Demo Accounts:
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className="py-1.5 px-2 rounded bg-mine-surface border border-mine-border hover:border-mine-amber text-slate-300 text-[11px] transition"
            >
              Super Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('safety')}
              className="py-1.5 px-2 rounded bg-mine-surface border border-mine-border hover:border-mine-amber text-slate-300 text-[11px] transition"
            >
              Safety Lead
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('viewer')}
              className="py-1.5 px-2 rounded bg-mine-surface border border-mine-border hover:border-mine-amber text-slate-300 text-[11px] transition"
            >
              Auditor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
