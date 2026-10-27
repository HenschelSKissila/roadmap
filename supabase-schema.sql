-- ════════════════════════════════════════════════════════════════════════════
--  Feuille de route — Automatisierungstechnik
--  Schéma Supabase complet : tables, trigger, RLS, Realtime
--  À coller tel quel dans  Supabase → SQL Editor → New query → Run
--  Projet dédié (séparé des apps ECL).
-- ════════════════════════════════════════════════════════════════════════════

-- ── 1. Tables ───────────────────────────────────────────────────────────────

create table if not exists public.blocs (
  id          text        not null,
  user_id     uuid        not null default auth.uid() references auth.users on delete cascade,
  name        text        not null,
  subtitle    text,
  color       text,
  priority    int         not null default 1,
  updated_at  timestamptz not null default now(),
  primary key (user_id, id)
);

create table if not exists public.courses (
  id              uuid        primary key default gen_random_uuid(),
  user_id         uuid        not null default auth.uid() references auth.users on delete cascade,
  num             int,
  title           text        not null,
  bloc_id         text        not null,
  hours           numeric     not null default 0,
  hours_verified  boolean     not null default false,   -- durée relevée sur Udemy
  url             text,                                  -- fiche du cours
  objective       text,
  skills          text[]      not null default '{}',     -- compétences acquises
  why             text,                                  -- « à quoi ça te sert »
  flag            text,                                  -- optionnel | si besoin | selon sujet | plus tard | à acquérir | non-cours
  status          text        not null default 'a_faire'
                  check (status in ('a_faire','en_cours','termine')),
  progress_pct    int         not null default 0 check (progress_pct between 0 and 100),
  started_at      date,
  completed_at    date,
  notes           text,
  sort_order      int         not null default 0,
  deleted         boolean     not null default false,
  updated_at      timestamptz not null default now()
);

create table if not exists public.settings (
  user_id          uuid        primary key default auth.uid() references auth.users on delete cascade,
  weekly_hours     numeric     not null default 8,
  practice_factor  numeric     not null default 1.8,
  updated_at       timestamptz not null default now()
);

create table if not exists public.study_log (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null default auth.uid() references auth.users on delete cascade,
  course_id   uuid        not null references public.courses(id) on delete cascade,
  day         date        not null default current_date,
  minutes     int         not null check (minutes > 0),
  created_at  timestamptz not null default now()
);

-- Index utiles
create index if not exists courses_user_bloc_idx on public.courses (user_id, bloc_id, sort_order);
create index if not exists study_log_user_day_idx on public.study_log (user_id, day desc);

-- ── 2. Trigger updated_at ───────────────────────────────────────────────────

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists blocs_touch    on public.blocs;
drop trigger if exists courses_touch  on public.courses;
drop trigger if exists settings_touch on public.settings;

create trigger blocs_touch    before update on public.blocs    for each row execute function public.touch_updated_at();
create trigger courses_touch  before update on public.courses  for each row execute function public.touch_updated_at();
create trigger settings_touch before update on public.settings for each row execute function public.touch_updated_at();

-- ── 3. Row Level Security ───────────────────────────────────────────────────
--  Politique unique par table : je ne vois et ne modifie que mes propres lignes.
--  Sans session authentifiée, auth.uid() vaut NULL → aucune ligne n'est lisible.

alter table public.blocs     enable row level security;
alter table public.courses   enable row level security;
alter table public.settings  enable row level security;
alter table public.study_log enable row level security;

drop policy if exists blocs_owner     on public.blocs;
drop policy if exists courses_owner   on public.courses;
drop policy if exists settings_owner  on public.settings;
drop policy if exists study_log_owner on public.study_log;

create policy blocs_owner     on public.blocs     for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy courses_owner   on public.courses   for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy settings_owner  on public.settings  for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy study_log_owner on public.study_log for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ── 4. Realtime ─────────────────────────────────────────────────────────────
--  Diffusion des changements vers les autres appareils, sans rechargement.

alter table public.blocs     replica identity full;
alter table public.courses   replica identity full;
alter table public.settings  replica identity full;
alter table public.study_log replica identity full;

do $$
begin
  begin execute 'alter publication supabase_realtime add table public.blocs';     exception when duplicate_object then null; end;
  begin execute 'alter publication supabase_realtime add table public.courses';   exception when duplicate_object then null; end;
  begin execute 'alter publication supabase_realtime add table public.settings';  exception when duplicate_object then null; end;
  begin execute 'alter publication supabase_realtime add table public.study_log'; exception when duplicate_object then null; end;
end $$;

-- ── 5. Vérification rapide ──────────────────────────────────────────────────
--  Doit renvoyer rowsecurity = true sur les 4 tables.
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in ('blocs','courses','settings','study_log')
order by tablename;


-- ════════════════════════════════════════════════════════════════════════════
--  Feuille de route — v2 : engagements, heures HiWi, modules du Master
--  MIGRATION ADDITIVE : ne touche à aucune donnée de la v1.
--  À coller dans  Supabase → SQL Editor → New query → Run,
--  APRÈS supabase-schema.sql (v1).
-- ════════════════════════════════════════════════════════════════════════════

-- ── 1. Tables ───────────────────────────────────────────────────────────────

-- Engagements : job HiWi, Projekt, Masterarbeit
create table if not exists public.projects (
  id              uuid        primary key default gen_random_uuid(),
  user_id         uuid        not null default auth.uid() references auth.users on delete cascade,
  code            text        not null,          -- 'hiwi' | 'projekt' | 'masterarbeit'
  title           text        not null,
  institute       text,                          -- 'IALB' | 'IAT'
  topic           text,
  supervisor      text,
  cp              numeric,                       -- null pour le job
  start_date      date,
  end_date        date,
  status          text        not null default 'prevu'
                  check (status in ('prevu','en_cours','termine')),
  contract_hours  numeric,                       -- job : 36
  hourly_rate     numeric,                       -- job : 15.20
  notes           text,
  sort_order      int         not null default 0,
  updated_at      timestamptz not null default now()
);

-- Jalons de chaque engagement
create table if not exists public.milestones (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null default auth.uid() references auth.users on delete cascade,
  project_id  uuid        not null references public.projects(id) on delete cascade,
  title       text        not null,
  due_date    date,
  done        boolean     not null default false,
  done_at     date,
  sort_order  int         not null default 0,
  deleted     boolean     not null default false,
  updated_at  timestamptz not null default now()
);

-- Quels cours préparent quel engagement
create table if not exists public.project_courses (
  user_id     uuid        not null default auth.uid() references auth.users on delete cascade,
  project_id  uuid        not null references public.projects(id) on delete cascade,
  course_id   uuid        not null references public.courses(id) on delete cascade,
  relevance   text        not null default 'utile'
              check (relevance in ('indispensable','utile')),
  updated_at  timestamptz not null default now(),
  primary key (project_id, course_id)
);

-- Heures travaillées au job HiWi
create table if not exists public.work_hours (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null default auth.uid() references auth.users on delete cascade,
  project_id  uuid        not null references public.projects(id) on delete cascade,
  day         date        not null,
  hours       numeric     not null check (hours > 0),
  kind        text        not null default 'travail'
              check (kind in ('travail','conge','maladie')),
  activity    text,
  deleted     boolean     not null default false,
  updated_at  timestamptz not null default now(),
  created_at  timestamptz not null default now()
);

-- Modules du Master (notes)
create table if not exists public.modules (
  id              uuid        primary key default gen_random_uuid(),
  user_id         uuid        not null default auth.uid() references auth.users on delete cascade,
  code            text        not null,
  title           text        not null,
  type            text        not null check (type in ('P','WP','W','PROJEKT','MA')),
  cp              numeric     not null,
  graded          boolean     not null default true,
  grade           numeric,                        -- null si non noté ou pas encore connu
  status          text        not null default 'prevu'
                  check (status in ('prevu','en_cours','valide','provisoire')),
  semester        text,
  count_in_final  boolean     not null default true,   -- plafond Wahl §2(6)
  notes           text,
  sort_order      int         not null default 0,
  deleted         boolean     not null default false,
  updated_at      timestamptz not null default now()
);

-- Réglages v2 ajoutés à la table existante
alter table public.settings add column if not exists wahl_mode text not null default 'best'
  check (wahl_mode in ('best','manual'));          -- sélection des 30 CP du Wahlbereich
alter table public.settings add column if not exists ma_start date;   -- inscription Masterarbeit

-- Index
create index if not exists milestones_proj_idx  on public.milestones (user_id, project_id, sort_order);
create index if not exists work_hours_proj_idx  on public.work_hours (user_id, project_id, day);
create index if not exists modules_user_idx     on public.modules (user_id, sort_order);

-- ── 2. Trigger updated_at (réutilise la fonction de la v1) ──────────────────

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end; $$;

do $$
declare t text;
begin
  foreach t in array array['projects','milestones','project_courses','work_hours','modules'] loop
    execute format('drop trigger if exists %I_touch on public.%I', t, t);
    execute format('create trigger %I_touch before update on public.%I
                    for each row execute function public.touch_updated_at()', t, t);
  end loop;
end $$;

-- ── 3. Row Level Security ───────────────────────────────────────────────────

do $$
declare t text;
begin
  foreach t in array array['projects','milestones','project_courses','work_hours','modules'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists %I_owner on public.%I', t, t);
    execute format('create policy %I_owner on public.%I for all
                    using (user_id = auth.uid()) with check (user_id = auth.uid())', t, t);
  end loop;
end $$;

-- ── 4. Realtime ─────────────────────────────────────────────────────────────

do $$
declare t text;
begin
  foreach t in array array['projects','milestones','project_courses','work_hours','modules'] loop
    execute format('alter table public.%I replica identity full', t);
    begin
      execute format('alter publication supabase_realtime add table public.%I', t);
    exception when duplicate_object then null;
    end;
  end loop;
end $$;

-- ── 5. Vérification ─────────────────────────────────────────────────────────
--  Doit renvoyer rowsecurity = true sur les neuf tables (v1 + v2).
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in ('blocs','courses','settings','study_log',
                    'projects','milestones','project_courses','work_hours','modules')
order by tablename;
