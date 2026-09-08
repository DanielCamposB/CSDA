-- Permite ordenar las series/divisiones en un orden específico
-- (en vez de alfabético) dentro de los selectores del sitio.
alter table public.teams add column if not exists sort_order int not null default 0;
