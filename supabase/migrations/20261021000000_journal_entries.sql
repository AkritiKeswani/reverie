-- Journal entries, keyed by Clerk user id.
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  content text not null,
  prompt_used text,
  mood text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists journal_entries_user_id_created_at_idx
  on public.journal_entries (user_id, created_at desc);

-- RLS on with no policies: the anon key can't touch this table.
-- All access goes through Next.js API routes using the service role key.
alter table public.journal_entries enable row level security;
