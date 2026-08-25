import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle, Shield, RefreshCw, KeyRound, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-[#070B12] bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(0,163,224,0.12),transparent_70%)] flex items-center justify-center p-4 selection:bg-cyan-500 selection:text-slate-950">
      <div className="double-bezel w-full max-w-md bg-slate-900/90 border-slate-800 shadow-2xl text-white backdrop-blur-sm">
        <div className="double-bezel-inner p-8 bg-[#0C1220]/95 space-y-6">
          
          {/* Brand Header & Workstation Badge */}
          <div className="text-center space-y-2">
            <div className="bg-white inline-block p-2.5 rounded-xl border border-slate-700 mb-1 shadow-md">
              <img src="/assets/logo.svg" alt="Apex Packaging & Converting" className="h-7 w-auto object-contain" />
            </div>
            
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/70 px-2.5 py-1 rounded-full border border-cyan-800/80 shadow-xs">
                <Shield className="w-3 h-3 text-cyan-400" />
                <span>SALES & ESTIMATING CONSOLE</span>
              </div>
            </div>

            <h1 className="text-xl font-extrabold tracking-tight text-white pt-1">Commercial Sales Sign In</h1>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Access RFQ pipeline, review CAD dielines & dispatch CPQ quotes
            </p>
          </div>

          {/* Quick Fill Demo Helper Pill */}
          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/50 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-cyan-200 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Demo Account: <strong className="text-white">sales@apexconverting.demo</strong></span>
            </div>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="px-2 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-[10px] transition-colors border border-cyan-500/40 cursor-pointer"
            >
              Auto-Fill
            </button>
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-700/80 text-xs font-mono text-rose-200 flex items-center gap-2.5 shadow-lg">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span className="leading-snug">{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-200 mb-1.5">
                Sales Estimator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9.5 pr-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-slate-100 font-mono placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all"
                  placeholder="sales@apexconverting.demo"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-200 mb-1.5">
                Workstation Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9.5 pr-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-slate-100 font-mono placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#E00019] hover:bg-[#c00015] active:scale-[0.99] text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying Workstation Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Workstation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Navigation Links */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
            <a href="/" className="text-slate-400 hover:text-white transition-colors">
              ← Return to Public Portal
            </a>
            <a href="/admin/login" className="text-slate-500 hover:text-slate-300 transition-colors">
              Executive Gateway →
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

