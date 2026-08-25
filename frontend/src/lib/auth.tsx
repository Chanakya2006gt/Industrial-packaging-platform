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

  // Helper to fetch profile row by auth.uid()
  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        // If profile row doesn't exist yet, check user metadata fallback
        return null;
      }

      if (data.is_active === false) {
        // Deactivated staff member
        await supabase.auth.signOut();
        return null;
      }

      return data as UserProfile;
    } catch (err) {
      return null;
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
        const prof = await fetchProfile(session.user.id);
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
        const prof = await fetchProfile(newSession.user.id);
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
        const prof = await fetchProfile(data.user.id);
        if (!prof || prof.is_active === false) {
          await supabase.auth.signOut();
          return { error: new Error('Account inactive or profile not found. Please contact administration.') };
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
