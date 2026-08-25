import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle, ShieldAlert, RefreshCw, Sparkles } from 'lucide-react';
import { useAuth } from '../../lib/auth';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { error, profile } = await signIn(email, password);

    if (error || !profile) {
      setErrorMsg(error?.message || 'Admin authentication failed.');
      setLoading(false);
      return;
    }

    // Role verification: Admin console is strictly for 'superadmin'
    if (profile.role !== 'superadmin') {
      setErrorMsg('Access Denied. Only Executive SuperAdmins can enter this console.');
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate(from, { replace: true });
  };

  const fillDemoCredentials = () => {
    setEmail('admin@apexconverting.demo');
    setPassword('AdminPass2026!');
  };

  return (
    <div className="min-h-screen bg-[#070A10] bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(224,0,25,0.12),transparent_70%)] flex items-center justify-center p-4 selection:bg-[#E00019] selection:text-white">
      <div className="double-bezel w-full max-w-md bg-slate-950/90 border-rose-950/80 shadow-2xl text-white backdrop-blur-sm">
        <div className="double-bezel-inner p-8 bg-[#090D18]/95 space-y-6">
          
          {/* Brand Header & Executive Badge */}
          <div className="text-center space-y-2">
            <div className="bg-white inline-block p-2.5 rounded-xl border border-slate-700 mb-1 shadow-md">
              <img src="/assets/logo.svg" alt="Apex Packaging & Converting" className="h-7 w-auto object-contain" />
            </div>
            
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-rose-400 bg-rose-950/70 px-2.5 py-1 rounded-full border border-rose-800/80 shadow-xs">
                <ShieldAlert className="w-3 h-3 text-rose-400" />
                <span>EXECUTIVE MANAGEMENT GATEWAY</span>
              </div>
            </div>

            <h1 className="text-xl font-extrabold tracking-tight text-white pt-1">Plant Admin Portal</h1>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Executive oversight, staff account management & plant telemetry
            </p>
          </div>

          {/* Quick Fill Demo Helper Pill */}
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-rose-200 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>Admin Account: <strong className="text-white">admin@apexconverting.demo</strong></span>
            </div>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="px-2 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-[10px] transition-colors border border-rose-500/40 cursor-pointer"
            >
              Auto-Fill
            </button>
          </div>

          {/* Error Alert */}
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
                SuperAdmin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9.5 pr-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-slate-100 font-mono placeholder:text-slate-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none transition-all"
                  placeholder="admin@apexconverting.demo"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-200 mb-1.5">
                Master Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9.5 pr-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-slate-100 font-mono placeholder:text-slate-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none transition-all"
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
                  <span>Authorizing Executive Token...</span>
                </>
              ) : (
                <>
                  <span>Authenticate Executive Access</span>
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
            <a href="/sales/login" className="text-slate-500 hover:text-slate-300 transition-colors">
              Sales Workstation →
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

