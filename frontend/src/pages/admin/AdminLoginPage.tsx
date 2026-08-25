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
    <div className="min-h-screen bg-slate-50 dark:bg-[#070B12] flex items-center justify-center p-4 selection:bg-[#E00019] selection:text-white transition-colors">
      <div className="w-full max-w-md">
        
        {/* Main Card */}
        <div className="bg-white dark:bg-[#0E1422] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8 space-y-6">
          
          {/* Brand Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <img src="/assets/logo.svg" alt="Apex Packaging & Converting" className="h-8 w-auto object-contain" />
            </div>
            
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-xs font-mono font-bold text-[#E00019] dark:text-rose-400">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>EXECUTIVE MANAGEMENT GATEWAY</span>
              </span>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                Plant Admin Portal
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                Executive oversight, staff account management & plant telemetry
              </p>
            </div>
          </div>

          {/* Quick Fill Demo Helper Card */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Demo ID: <strong className="text-slate-950 dark:text-white font-bold">admin@apexconverting.demo</strong></span>
            </div>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/80 text-[#E00019] dark:text-rose-300 font-bold text-[10px] transition-colors border border-rose-200 dark:border-rose-800 cursor-pointer"
            >
              Auto-Fill
            </button>
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-xs font-mono text-rose-800 dark:text-rose-200 flex items-center gap-2.5 shadow-sm">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#E00019] dark:text-rose-400" />
              <span className="leading-snug">{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                SuperAdmin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm text-slate-950 dark:text-white font-mono placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-[#E00019] focus:ring-2 focus:ring-rose-500/20 focus:outline-none transition-all"
                  placeholder="admin@apexconverting.demo"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Master Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm text-slate-950 dark:text-white font-mono placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-[#E00019] focus:ring-2 focus:ring-rose-500/20 focus:outline-none transition-all"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#E00019] hover:bg-[#c00015] active:scale-[0.99] text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Authorizing Executive Token...</span>
                </>
              ) : (
                <>
                  <span>Authenticate Executive Access</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Navigation Links */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
            <a href="/" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
              ← Public Portal
            </a>
            <a href="/sales/login" className="text-slate-500 hover:text-[#E00019] dark:text-slate-400 dark:hover:text-rose-400 transition-colors">
              Sales Workstation →
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

