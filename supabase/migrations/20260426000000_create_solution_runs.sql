create extension if not exists "pgcrypto";

create table if not exists public.solution_runs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete set null,
  problem text not null,
  topic text,
  difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced')),
  known_variables jsonb not null default '[]'::jsonb,
  unknown_variables jsonb not null default '[]'::jsonb,
  agents jsonb not null default '[]'::jsonb,
  equations jsonb not null default '[]'::jsonb,
  step_by_step_solution jsonb not null default '[]'::jsonb,
  final_answer text,
  common_mistakes jsonb not null default '[]'::jsonb,
  visualization_plan jsonb not null default '{}'::jsonb,
  image_prompt text,
  model_used text,
  source text not null default 'openai'
);

create index if not exists solution_runs_created_at_idx
  on public.solution_runs (created_at desc);

create index if not exists solution_runs_user_id_created_at_idx
  on public.solution_runs (user_id, created_at desc);

alter table public.solution_runs enable row level security;

create policy "Users can read their own solution runs"
  on public.solution_runs
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own solution runs"
  on public.solution_runs
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can delete their own solution runs"
  on public.solution_runs
  for delete
  to authenticated
  using (auth.uid() = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'physics-visuals',
  'physics-visuals',
  true,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public can read generated physics visuals"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'physics-visuals');

create policy "Authenticated users can upload physics visuals"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'physics-visuals');
