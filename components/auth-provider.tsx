'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';

interface AuthContextType {
  user: any;
  supabaseUser: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; user?: any; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; user?: any; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; user?: any; error?: string }>;
  logout: () => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
