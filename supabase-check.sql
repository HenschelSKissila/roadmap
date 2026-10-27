-- ════════════════════════════════════════════════════════════════════════════
--  Vérification — LECTURE SEULE, ne modifie rien.
--  Supabase → SQL Editor → New query → coller → Run.
--  Chaque ligne doit afficher « ok ». Une ligne « MANQUANT » dit quoi repasser.
-- ════════════════════════════════════════════════════════════════════════════
with t(name) as (values ('blocs'),('courses'),('settings'),('study_log'),
                        ('projects'),('milestones'),('project_courses'),('work_hours'),('modules'))
select
  t.name                                                         as "table",
  case when c.oid is null then 'MANQUANT → passer le schéma v1/v2' else 'ok' end as "existe",
  case when c.relrowsecurity then 'ok' else 'MANQUANT → RLS désactivée' end   as "RLS",
  case when exists (select 1 from pg_policies p where p.schemaname='public' and p.tablename=t.name)
       then 'ok' else 'MANQUANT → politique' end                                 as "politique",
  case when t.name = 'study_log' then '— (pas de updated_at)'
       when exists (select 1 from pg_trigger g where g.tgrelid=c.oid and g.tgname=t.name||'_touch')
       then 'ok' else 'MANQUANT → repasser le schéma' end                        as "trigger updated_at",
  case when exists (select 1 from pg_publication_tables r where r.pubname='supabase_realtime'
                    and r.schemaname='public' and r.tablename=t.name)
       then 'ok' else 'absent (la synchro marche quand même, en différé)' end    as "temps réel"
from t left join pg_class c on c.relname=t.name and c.relnamespace='public'::regnamespace
order by 1;

-- Combien de comptes ont des données ? Il ne devrait y en avoir QU'UN.
-- Deux lignes ici = deux comptes différents (deux adresses e-mail) : c'est
-- alors ça qui explique que deux appareils montrent des données différentes.
select u.email, left(u.id::text, 8) as "id court",
       (select count(*) from public.courses  c where c.user_id=u.id) as cours,
       (select count(*) from public.modules  m where m.user_id=u.id and not m.deleted) as modules,
       (select count(*) from public.projects p where p.user_id=u.id) as engagements
from auth.users u order by u.created_at;
