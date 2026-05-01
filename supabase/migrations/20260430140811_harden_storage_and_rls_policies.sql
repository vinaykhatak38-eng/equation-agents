drop policy if exists "Public can read generated physics visuals" on storage.objects;

drop policy if exists "Users can read their own solution runs" on public.solution_runs;
drop policy if exists "Users can insert their own solution runs" on public.solution_runs;
drop policy if exists "Users can delete their own solution runs" on public.solution_runs;

create policy "Users can read their own solution runs"
  on public.solution_runs
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own solution runs"
  on public.solution_runs
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own solution runs"
  on public.solution_runs
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
