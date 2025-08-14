import { supabase } from './supabase';
import { User } from 'firebase/auth';

export interface SupabaseUser {
  id: string;
  firebase_uid: string;
  email: string;
  display_name?: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSupabaseUser {
  firebase_uid: string;
  email: string;
  display_name?: string;
  photo_url?: string;
}

export class UserService {
  // Create or update user in Supabase when they sign in with Firebase
  static async upsertUser(firebaseUser: User): Promise<SupabaseUser | null> {
    try {
      // Check if Supabase is configured
      console.log('Environment variables check:', {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'
      });
      
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error('Supabase environment variables not configured');
        return null;
      }

      const userData: CreateSupabaseUser = {
        firebase_uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        display_name: firebaseUser.displayName || undefined,
        photo_url: firebaseUser.photoURL || undefined,
      };

      console.log('Attempting to upsert user:', userData);

      // Check if user already exists
      const { data: existingUser, error: selectError } = await supabase
        .from('users')
        .select('*')
        .eq('firebase_uid', firebaseUser.uid)
        .single();

      if (selectError && selectError.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error checking existing user:', selectError);
        throw selectError;
      }

      if (existingUser) {
        console.log('Updating existing user:', existingUser.id);
        // Update existing user
        const { data: updatedUser, error } = await supabase
          .from('users')
          .update({
            email: userData.email,
            display_name: userData.display_name,
            photo_url: userData.photo_url,
            updated_at: new Date().toISOString(),
          })
          .eq('firebase_uid', firebaseUser.uid)
          .select()
          .single();

        if (error) {
          console.error('Error updating user:', error);
          throw error;
        }
        return updatedUser;
      } else {
        console.log('Creating new user');
        // Create new user
        const { data: newUser, error } = await supabase
          .from('users')
          .insert([userData])
          .select()
          .single();

        if (error) {
          console.error('Error creating user:', error);
          throw error;
        }
        return newUser;
      }
    } catch (error) {
      console.error('Error upserting user:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
      }
      return null;
    }
  }

  // Get user by Firebase UID
  static async getUserByFirebaseUid(firebaseUid: string): Promise<SupabaseUser | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('firebase_uid', firebaseUid)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  // Get user by ID
  static async getUserById(id: string): Promise<SupabaseUser | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }
}
