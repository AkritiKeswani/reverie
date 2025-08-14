import { useState, useEffect } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { UserService, SupabaseUser } from '@/lib/user-service';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(false); // Start as false, only true when actively authenticating
  const [isInitialized, setIsInitialized] = useState(false);

  // Only initialize auth when explicitly needed (like when signing in)
  const initializeAuth = () => {
    if (isInitialized) return;
    
    setLoading(true);
    setIsInitialized(true);
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          // Create or update user in Supabase
          const supabaseUser = await UserService.upsertUser(user);
          setSupabaseUser(supabaseUser);
        } catch (error) {
          console.error('Error syncing user with Supabase:', error);
          // Don't fail authentication if Supabase sync fails
          setSupabaseUser(null);
        }
      } else {
        setSupabaseUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  };

  // Initialize auth when component mounts (but don't start listening yet)
  useEffect(() => {
    // Don't start auth listener automatically
    setIsInitialized(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      initializeAuth(); // Initialize auth before signing in
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signInWithGoogle = async () => {
    try {
      initializeAuth(); // Initialize auth before signing in
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return { success: true, user: result.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return {
    user,
    supabaseUser,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    resetPassword
  };
}
