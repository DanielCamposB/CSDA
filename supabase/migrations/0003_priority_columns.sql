-- Columna de prioridad para destacar/fijar contenido en los módulos que rotan
-- (mayor número = aparece primero / se destaca).
alter table public.news add column if not exists priority int not null default 0;
alter table public.matches add column if not exists priority int not null default 0;
alter table public.events add column if not exists priority int not null default 0;
alter table public.sponsors add column if not exists priority int not null default 0;
alter table public.benefits add column if not exists priority int not null default 0;
