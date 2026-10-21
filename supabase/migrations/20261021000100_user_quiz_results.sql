-- Quiz results, keyed by Clerk user id ("anonymous" for demo mode).
-- Quiz content itself is served from the API routes, so no FK to a quizzes table.
create table if not exists public.user_quiz_results (
  id bigint generated always as identity primary key,
  user_id text not null,
  quiz_id integer not null,
  answers jsonb,
  dimensions jsonb,
  result_summary text,
  completed_at timestamptz not null default now()
);

create index if not exists user_quiz_results_user_id_idx
  on public.user_quiz_results (user_id, completed_at desc);

-- RLS on with no policies: only the service role key (API routes) can access it.
alter table public.user_quiz_results enable row level security;
