-- CSD Algarrobo — esquema inicial (Fase 0/1/2 del documento maestro)

create extension if not exists "pgcrypto";

-- ==========================================================================
-- PERFILES Y ROLES
-- ==========================================================================

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

-- Crea automáticamente un perfil (rol editor por defecto) al registrar un usuario.
-- El primer admin se promueve manualmente vía SQL editor:
--   update public.profiles set role = 'admin' where id = '<uuid>';
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- security definer evita recursión de RLS al consultar profiles desde otras políticas.
create function public.is_staff()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  );
$$;

-- ==========================================================================
-- CONTENIDO DEPORTIVO E INSTITUCIONAL
-- ==========================================================================

create table public.sports (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique
);

create table public.seasons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  year int not null,
  is_current boolean not null default false
);

create table public.teams (
  id uuid primary key default gen_random_uuid(),
  sport_id uuid not null references public.sports (id) on delete cascade,
  season_id uuid references public.seasons (id) on delete set null,
  name text not null,
  category text
);

create table public.players (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references public.teams (id) on delete set null,
  full_name text not null,
  "position" text,
  jersey_number int,
  photo_url text,
  bio text,
  is_published boolean not null default true
);

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  sport_id uuid not null references public.sports (id) on delete cascade,
  team_id uuid references public.teams (id) on delete set null,
  is_home boolean not null default true,
  rival_name text not null,
  competition text,
  match_date timestamptz not null,
  location text,
  status text not null default 'programado'
    check (status in ('programado', 'confirmado', 'suspendido', 'reprogramado', 'finalizado')),
  home_score int,
  away_score int,
  notes text
);

create table public.club_history (
  id uuid primary key default gen_random_uuid(),
  year int,
  title text not null,
  description text,
  image_url text,
  sort_order int not null default 0
);

create table public.trophies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  year int,
  sport_id uuid references public.sports (id) on delete set null,
  category text,
  description text,
  image_url text
);

create table public.directors (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role_title text not null,
  period text,
  bio text,
  photo_url text,
  sort_order int not null default 0
);

-- "Grandes figuras" — sección histórica, distinta de la directiva vigente.
create table public.club_figures (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  category text not null check (category in ('jugador', 'entrenador', 'dirigente', 'profesor', 'colaborador')),
  role_title text,
  period text,
  bio text,
  achievements text,
  photo_url text,
  sort_order int not null default 0
);

-- ==========================================================================
-- ACTUALIDAD Y MULTIMEDIA
-- ==========================================================================

create table public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  cover_image_url text,
  category text,
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  author_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date timestamptz not null,
  location text,
  cover_image_url text,
  status text not null default 'published' check (status in ('draft', 'published'))
);

create table public.galleries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  sport_id uuid references public.sports (id) on delete set null,
  event_date date,
  cover_image_url text
);

create table public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  gallery_id uuid not null references public.galleries (id) on delete cascade,
  image_url text not null,
  caption text,
  sort_order int not null default 0
);

-- ==========================================================================
-- SOCIOS Y AUSPICIADORES
-- ==========================================================================

create table public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  website_url text,
  tier text not null default 'colaborador' check (tier in ('principal', 'oficial', 'colaborador')),
  description text
);

create table public.benefits (
  id uuid primary key default gen_random_uuid(),
  sponsor_id uuid references public.sponsors (id) on delete set null,
  title text not null,
  description text,
  conditions text,
  valid_until date
);

-- ==========================================================================
-- CONTACTO
-- ==========================================================================

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message_type text not null default 'consulta' check (message_type in ('consulta', 'sugerencia')),
  message text not null,
  created_at timestamptz not null default now(),
  ip_hash text,
  handled boolean not null default false
);

-- ==========================================================================
-- ROW LEVEL SECURITY
-- ==========================================================================

alter table public.profiles enable row level security;
alter table public.sports enable row level security;
alter table public.seasons enable row level security;
alter table public.teams enable row level security;
alter table public.players enable row level security;
alter table public.matches enable row level security;
alter table public.club_history enable row level security;
alter table public.trophies enable row level security;
alter table public.directors enable row level security;
alter table public.club_figures enable row level security;
alter table public.news enable row level security;
alter table public.events enable row level security;
alter table public.galleries enable row level security;
alter table public.gallery_images enable row level security;
alter table public.sponsors enable row level security;
alter table public.benefits enable row level security;
alter table public.contact_messages enable row level security;

-- profiles: cada usuario ve/edita solo su propio perfil.
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Lectura pública de contenido publicado; escritura solo staff (admin/editor).
create policy "sports_read_all" on public.sports for select using (true);
create policy "sports_write_staff" on public.sports for all using (public.is_staff()) with check (public.is_staff());

create policy "seasons_read_all" on public.seasons for select using (true);
create policy "seasons_write_staff" on public.seasons for all using (public.is_staff()) with check (public.is_staff());

create policy "teams_read_all" on public.teams for select using (true);
create policy "teams_write_staff" on public.teams for all using (public.is_staff()) with check (public.is_staff());

create policy "players_read_published" on public.players for select using (is_published = true or public.is_staff());
create policy "players_write_staff" on public.players for all using (public.is_staff()) with check (public.is_staff());

create policy "matches_read_all" on public.matches for select using (true);
create policy "matches_write_staff" on public.matches for all using (public.is_staff()) with check (public.is_staff());

create policy "club_history_read_all" on public.club_history for select using (true);
create policy "club_history_write_staff" on public.club_history for all using (public.is_staff()) with check (public.is_staff());

create policy "trophies_read_all" on public.trophies for select using (true);
create policy "trophies_write_staff" on public.trophies for all using (public.is_staff()) with check (public.is_staff());

create policy "directors_read_all" on public.directors for select using (true);
create policy "directors_write_staff" on public.directors for all using (public.is_staff()) with check (public.is_staff());

create policy "club_figures_read_all" on public.club_figures for select using (true);
create policy "club_figures_write_staff" on public.club_figures for all using (public.is_staff()) with check (public.is_staff());

create policy "news_read_published" on public.news for select using (status = 'published' or public.is_staff());
create policy "news_write_staff" on public.news for all using (public.is_staff()) with check (public.is_staff());

create policy "events_read_published" on public.events for select using (status = 'published' or public.is_staff());
create policy "events_write_staff" on public.events for all using (public.is_staff()) with check (public.is_staff());

create policy "galleries_read_all" on public.galleries for select using (true);
create policy "galleries_write_staff" on public.galleries for all using (public.is_staff()) with check (public.is_staff());

create policy "gallery_images_read_all" on public.gallery_images for select using (true);
create policy "gallery_images_write_staff" on public.gallery_images for all using (public.is_staff()) with check (public.is_staff());

create policy "sponsors_read_all" on public.sponsors for select using (true);
create policy "sponsors_write_staff" on public.sponsors for all using (public.is_staff()) with check (public.is_staff());

create policy "benefits_read_all" on public.benefits for select using (true);
create policy "benefits_write_staff" on public.benefits for all using (public.is_staff()) with check (public.is_staff());

-- contact_messages: cualquiera puede enviar (insert), nadie externo puede leer.
create policy "contact_messages_insert_anon" on public.contact_messages for insert with check (true);
create policy "contact_messages_manage_staff" on public.contact_messages for select using (public.is_staff());
create policy "contact_messages_update_staff" on public.contact_messages for update using (public.is_staff());
create policy "contact_messages_delete_staff" on public.contact_messages for delete using (public.is_staff());

-- ==========================================================================
-- STORAGE (fotos y documentos)
-- ==========================================================================

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media_public_read" on storage.objects for select using (bucket_id = 'media');
create policy "media_staff_write" on storage.objects for insert with check (bucket_id = 'media' and public.is_staff());
create policy "media_staff_update" on storage.objects for update using (bucket_id = 'media' and public.is_staff());
create policy "media_staff_delete" on storage.objects for delete using (bucket_id = 'media' and public.is_staff());
