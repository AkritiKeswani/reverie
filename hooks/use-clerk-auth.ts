'use client';

import { useUser, useAuth as useClerkAuth } from '@clerk/nextjs';

// User profiles live in Clerk; app data in Supabase is keyed by the Clerk user id
export function useAuth() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerkAuth();

  const logout = async () => {
    try {
      await signOut();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return {
    user,
    loading: !isLoaded,
    logout
  };
}
