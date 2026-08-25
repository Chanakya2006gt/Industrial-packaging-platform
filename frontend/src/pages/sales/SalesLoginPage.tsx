import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle, Shield, RefreshCw, Sparkles } from 'lucide-react';
import { useAuth } from '../../lib/auth';

export const SalesLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/sales/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { error, profile } = await signIn(email, password);

    if (error || !profile) {
      setErrorMsg(error?.message || 'Authentication failed. Please verify your credentials.');
      setLoading(false);
      return;
    }

    // Role verification
    if (profile.role !== 'sales' && profile.role !== 'superadmin') {
      setErrorMsg('Unauthorized role. This terminal is strictly for Sales & Plant Estimators.');
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate(from, { replace: true });
  };

  const fillDemoCredentials = () => {
    setEmail('sales@apexconverting.demo');
    setPassword('SalesPass2026!');
  };

  return (
    <div className="min-h-screen bg-[#070B12] bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(0,163,224,0.15),transparent_70%)] flex items-center justify-center p-4 selection:bg-cyan-500 selection:text-slate-950">
      <div className="w-full max-w-md rounded-2xl bg-[#0B0F19] border border-slate-800/90 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)] p-6 sm:p-8 space-y-6 text-white">
        
        {/* Brand Header & Workstation Badge */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-2.5 rounded-xl bg-white border border-slate-700 shadow-md">
            <img src="/assets/logo.svg" alt="Apex Packaging & Converting" className="h-7 w-auto object-contain" />
          </div>
          
          <div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-700/60 shadow-xs tracking-wider uppercase">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sales & Estimating Console</span>
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-tight text-white">Commercial Sales Sign In</h1>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              Access RFQ pipeline, review CAD dielines & dispatch CPQ quotes
            </p>
          </div>
        </div>

        {/* Quick Fill Demo Helper Card */}
        <div className="p-3.5 rounded-xl bg-[#0E1524] border border-cyan-500/20 flex items-center justify-between text-xs font-mono shadow-inner">
          <div className="flex items-center gap-2 text-slate-300 text-[11px]">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
            <span>Demo: <strong className="text-cyan-300 font-semibold">sales@apexconverting.demo</strong></span>
          </div>
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 font-sans font-bold text-[11px] transition-all shadow-sm cursor-pointer"
          >
            Auto-Fill
          </button>
        </div>

        {/* Error Message Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-950/90 border border-rose-600/80 text-xs font-mono text-rose-200 flex items-center gap-2.5 shadow-lg">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="leading-snug">{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-medium text-slate-300">
              Sales Estimator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#070B12] border border-slate-700 text-sm text-slate-100 font-mono placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none transition-all shadow-inner"
                placeholder="sales@apexconverting.demo"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-medium text-slate-300">
              Workstation Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#070B12] border border-slate-700 text-sm text-slate-100 font-mono placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none transition-all shadow-inner"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#E00019] hover:bg-[#c00015] active:scale-[0.98] text-white font-sans text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(224,0,25,0.35)] disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Verifying Workstation Credentials...</span>
              </>
            ) : (
              <>
                <span>Sign In to Workstation</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Navigation Links */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono">
          <a href="/" className="text-slate-400 hover:text-cyan-400 transition-colors">
            ← Return to Public Portal
          </a>
          <a href="/admin/login" className="text-slate-400 hover:text-cyan-400 transition-colors">
            Executive Gateway →
          </a>
        </div>

      </div>
    </div>
  );
};

