-- Permite asignar un partido a una o varias series/equipos a la vez
-- (antes un partido solo podía tener una serie).

create table public.match_teams (
  match_id uuid not null references public.matches (id) on delete cascade,
  team_id uuid not null references public.teams (id) on delete cascade,
  primary key (match_id, team_id)
);

alter table public.match_teams enable row level security;

create policy "match_teams_read_all" on public.match_teams for select using (true);
create policy "match_teams_write_staff" on public.match_teams for all
  using (public.is_staff()) with check (public.is_staff());

-- Traspasa la serie única que ya tuviera cada partido a la nueva tabla.
insert into public.match_teams (match_id, team_id)
select id, team_id from public.matches where team_id is not null
on conflict do nothing;

alter table public.matches drop column team_id;
