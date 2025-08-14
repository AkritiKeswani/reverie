import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log('Supabase connection details:', {
  url: supabaseUrl,
  key: supabaseAnonKey ? 'SET' : 'NOT SET'
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface JournalEntry {
  id: string
  user_id: string
  content: string
  prompt_used?: string
}

export interface CreateJournalEntry {
  content: string
  prompt_used?: string
}
