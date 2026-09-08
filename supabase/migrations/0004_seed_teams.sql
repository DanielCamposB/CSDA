-- Series y divisiones reales del club, para poblar los selectores de
-- Equipos/Series usados en partidos, jugadores y trofeos.
-- Seguro de volver a ejecutar: no duplica series que ya existan.

insert into public.teams (sport_id, name, category)
select s.id, t.name, t.category
from public.sports s
join (values
  -- Fútbol masculino adulto
  ('Serie Honor', 'Masculino'),
  ('Segunda Serie', 'Masculino'),
  ('Tercera Serie', 'Masculino'),
  ('Senior', 'Masculino'),
  ('Super Senior', 'Masculino'),
  ('Dorados', 'Masculino'),
  -- Fútbol femenino
  ('Serie Adulta', 'Femenino'),
  ('Infantil', 'Femenino'),
  -- Series infantiles de fútbol
  ('Primera Infantil', 'Infantil'),
  ('Segunda Infantil', 'Infantil'),
  ('Tercera Infantil', 'Infantil'),
  ('Cuarta Infantil', 'Infantil')
) as t(name, category) on true
where s.slug = 'futbol'
  and not exists (
    select 1 from public.teams existing
    where existing.sport_id = s.id and existing.name = t.name
  );

insert into public.teams (sport_id, name, category)
select s.id, t.name, 'Escuela'
from public.sports s
join (values
  ('Sub 8'), ('Sub 10'), ('Sub 12'), ('Sub 14'), ('Sub 16'), ('Sub 18')
) as t(name) on true
where s.slug = 'escuela-de-futbol'
  and not exists (
    select 1 from public.teams existing
    where existing.sport_id = s.id and existing.name = t.name
  );
