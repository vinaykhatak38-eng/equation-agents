drop policy if exists "Anonymous solver requests can create solution runs" on public.solution_runs;

create policy "Anonymous solver requests can create solution runs"
  on public.solution_runs
  for insert
  to anon
  with check (
    user_id is null
    and char_length(problem) between 8 and 4000
    and (
      difficulty is null
      or difficulty in ('beginner', 'intermediate', 'advanced')
    )
  );
