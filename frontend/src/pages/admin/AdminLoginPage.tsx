import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle, ShieldAlert, RefreshCw } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-[#070A10] flex items-center justify-center p-4">
      <div className="double-bezel w-full max-w-md bg-slate-950 border-rose-950/80 shadow-2xl text-white">
        <div className="double-bezel-inner p-8 bg-[#090D18] space-y-6">
          
          <div className="text-center space-y-2">
            <div className="bg-white inline-block p-2 rounded-xl border border-slate-700 mb-2 shadow-sm">
              <img src="/assets/logo.svg" alt="PrintFast Zambia" className="h-8 w-auto object-contain" />
            </div>
            <div className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800">
              <ShieldAlert className="w-3 h-3" />
              <span>EXECUTIVE ADMIN GATEWAY</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">Plant Master Console</h1>
            <p className="text-xs text-slate-400">Restricted to Executive Plant Managers & Directors</p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs font-mono text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Administrator Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:border-rose-500 focus:outline-none"
                  placeholder="admin@printfastzambia.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Master Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:border-rose-500 focus:outline-none"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#E00019] hover:bg-[#c00015] text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying Master Credentials...</span>
                </>
              ) : (
                <>
                  <span>Enter Master Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center">
            <a href="/" className="text-[11px] font-mono text-slate-400 hover:text-white transition-colors">
              ← Return to PrintFast Zambia Public Site
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};
