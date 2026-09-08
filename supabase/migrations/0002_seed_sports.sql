insert into public.sports (name, slug) values
  ('Fútbol', 'futbol'),
  ('Vóleibol', 'voleibol'),
  ('Fútbolito', 'futbolito'),
  ('Escuela de fútbol', 'escuela-de-futbol')
on conflict (slug) do nothing;
