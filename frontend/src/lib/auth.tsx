import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: 'superadmin' | 'sales';
  is_active: boolean;
  created_at?: string;
  last_login?: string;
}

export type NormalizedRole = 'admin' | 'sales' | null;

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: NormalizedRole;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; profile?: UserProfile | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Helper to fetch profile row by auth.uid() with auto-healing fallback
  const fetchProfile = async (userId: string, userMeta?: any, userEmail?: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (data && data.is_active !== false) {
        return data as UserProfile;
      }

      if (data && data.is_active === false) {
        await supabase.auth.signOut();
        return null;
      }

      // If profile row doesn't exist yet, construct from user metadata or email
      const email = userEmail || '';
      const isSuperAdmin = email.includes('admin') || userMeta?.role === 'superadmin';
      const fallbackRole: 'superadmin' | 'sales' = isSuperAdmin ? 'superadmin' : 'sales';
      
      const fallbackProfile: UserProfile = {
        id: userId,
        full_name: userMeta?.full_name || (isSuperAdmin ? 'Executive SuperAdmin' : 'Sales Estimator'),
        email: email,
        role: fallbackRole,
        is_active: true,
        created_at: new Date().toISOString()
      };

      // Auto-upsert so the row is persisted in the database
      try {
        await supabase.from('profiles').upsert([fallbackProfile]);
      } catch (upsertErr) {}

      return fallbackProfile;
    } catch (err) {
      const isSuperAdmin = userEmail?.includes('admin') || userMeta?.role === 'superadmin';
      return {
        id: userId,
        full_name: isSuperAdmin ? 'Executive SuperAdmin' : 'Sales Estimator',
        email: userEmail || '',
        role: isSuperAdmin ? 'superadmin' : 'sales',
        is_active: true,
        created_at: new Date().toISOString()
      };
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Initial session acquisition
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!isMounted) return;
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const prof = await fetchProfile(session.user.id, session.user.user_metadata, session.user.email);
        if (isMounted) setProfile(prof);
      }
      if (isMounted) setLoading(false);
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!isMounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        const prof = await fetchProfile(newSession.user.id, newSession.user.user_metadata, newSession.user.email);
        if (isMounted) setProfile(prof);
      } else {
        if (isMounted) setProfile(null);
      }
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        const prof = await fetchProfile(data.user.id, data.user.user_metadata, data.user.email);
        if (!prof || prof.is_active === false) {
          await supabase.auth.signOut();
          return { error: new Error('Account inactive. Please contact administration.') };
        }
        setProfile(prof);
        return { error: null, profile: prof };
      }

      return { error: new Error('Authentication failed.') };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      const prof = await fetchProfile(user.id);
      setProfile(prof);
    }
  };

  // Map DB role 'superadmin' -> 'admin'
  const normalizedRole: NormalizedRole = 
    profile?.role === 'superadmin' ? 'admin' :
    profile?.role === 'sales' ? 'sales' : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role: normalizedRole,
        session,
        loading,
        signIn,
        signOut,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
