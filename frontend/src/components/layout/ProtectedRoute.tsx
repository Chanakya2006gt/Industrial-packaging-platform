import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, NormalizedRole } from '../../lib/auth';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ('admin' | 'sales')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, profile, role, loading } = useAuth();
  const location = useLocation();

  // Determine path-aware login redirect target
  const isAdminPath = location.pathname.startsWith('/admin');
  const loginRedirect = isAdminPath ? '/admin/login' : '/sales/login';

  // 1. While loading session & profile: Show branded loading state (no flash of dashboard)
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white font-mono text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#E00019]/20 border border-[#E00019]/40 flex items-center justify-center mb-4 text-[#E00019] animate-pulse">
          <RefreshCw className="w-8 h-8 animate-spin" />
        </div>
        <h2 className="font-extrabold text-sm tracking-wider uppercase">
          Verifying Plant Security Credentials
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">
          Authenticating workstation session with Mwembeshi Road security gateway...
        </p>
      </div>
    );
  }

  // 2. If unauthenticated or no valid active user: Redirect to login
  if (!user || !profile || profile.is_active === false) {
    return <Navigate to={loginRedirect} state={{ from: location }} replace />;
  }

  // 3. Role Check: Verify normalized role against allowed roles
  if (!role || !allowedRoles.includes(role)) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white font-mono text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mb-4 text-amber-400">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="font-extrabold text-base tracking-wider uppercase text-amber-400">
          Access Restricted • Role Unauthorized
        </h2>
        <p className="text-xs text-slate-400 mt-2 max-w-sm">
          Your account role (<span className="text-white font-bold">{profile.role}</span>) does not have sufficient clearance to access this terminal.
        </p>
        <div className="mt-6 flex gap-3">
          <a
            href={loginRedirect}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold border border-slate-700 transition-all"
          >
            Switch Account
          </a>
          <a
            href="/"
            className="px-4 py-2 rounded-xl bg-[#E00019] hover:bg-[#c00015] text-xs font-bold transition-all"
          >
            Return to Public Portal
          </a>
        </div>
      </div>
    );
  }

  // 4. Authorized: Render protected view
  return <>{children}</>;
};
