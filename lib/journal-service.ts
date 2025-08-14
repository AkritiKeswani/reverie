import { supabase } from './supabase';
import { JournalEntry, CreateJournalEntry } from './supabase';

export class JournalService {
  // Create a new journal entry
  static async createEntry(userId: string, entry: CreateJournalEntry): Promise<JournalEntry | null> {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert([{
          user_id: userId,
          content: entry.content,
          prompt_used: entry.prompt_used,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating journal entry:', error);
      return null;
    }
  }

  // Get all journal entries for a user
  static async getUserEntries(userId: string): Promise<JournalEntry[]> {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting user entries:', error);
      return [];
    }
  }

  // Get a specific journal entry
  static async getEntry(entryId: string): Promise<JournalEntry | null> {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('id', entryId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting entry:', error);
      return null;
    }
  }

  // Update a journal entry
  static async updateEntry(entryId: string, updates: Partial<CreateJournalEntry>): Promise<JournalEntry | null> {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', entryId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating entry:', error);
      return null;
    }
  }

  // Delete a journal entry
  static async deleteEntry(entryId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entryId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting entry:', error);
      return false;
    }
  }

  // Get entries by date range
  static async getEntriesByDateRange(userId: string, startDate: string, endDate: string): Promise<JournalEntry[]> {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting entries by date range:', error);
      return [];
    }
  }

  // Get entries by mood
  static async getEntriesByMood(userId: string, mood: string): Promise<JournalEntry[]> {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .eq('mood', mood)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting entries by mood:', error);
      return [];
    }
  }
}
