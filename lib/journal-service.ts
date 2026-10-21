import { JournalEntry, CreateJournalEntry } from './supabase';

// Client-side wrapper around /api/entries. The API routes authenticate
// with Clerk and talk to Supabase server-side.
export class JournalService {
  static async getUserEntries(): Promise<JournalEntry[]> {
    const res = await fetch('/api/entries');
    if (!res.ok) throw new Error('Failed to load entries');
    return res.json();
  }

  static async createEntry(entry: CreateJournalEntry): Promise<JournalEntry> {
    const res = await fetch('/api/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
    if (!res.ok) throw new Error('Failed to save entry');
    return res.json();
  }
}
