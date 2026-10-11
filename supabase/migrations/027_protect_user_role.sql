-- 027: A user cannot make themselves an admin (canon lesson L-112, 2026-10-11)
--
-- ensureAdmin() (lib/admin/auth.ts), /api/auth/role and the JWT hook's user_role claim all trust
-- user_profiles.role. Three database routes let a user write it:
--   · 002's "user_profiles: users update own" lets an authenticated user UPDATE their own row with no
--     column restriction (its comment says "non-role fields"; nothing enforced it), so
--     PATCH /rest/v1/user_profiles?id=eq.<self> {"role":"admin"} with the anon key and their own JWT
--     makes them an admin;
--   · 002's "user_profiles: admin insert" lets a user INSERT their own row (id = auth.uid()) with any
--     role; only the row signup already created stands in the way;
--   · 002's handle_new_user() copied role from raw_user_meta_data, which the person signing up writes
--     (GoTrue /signup data:{role:"admin"}). The site has no signup page, but signup is open on the
--     project (/auth/v1/settings disable_signup=false, 2026-10-11).
-- The app never changes a role, so a role change is refused unless it comes from the service role or
-- the SQL editor, and a new profile is always a customer. The fourth route, getCurrentUser's
-- service-role fallback insert, is closed in lib/auth/queries.ts.
--
-- Measured before this was written: user_profiles held 2 rows, both admin, both the operator's and
-- the client's own addresses; no user metadata carried a role
-- (.handoff/l112-role-escalation/01-db-inspector.md, 2026-10-11).
--
-- Adapted from blindly 8c92db6 supabase/migrations/041_protect_user_role.sql.
--
-- NOT APPLIED BY THIS FILE. Apply it by hand in the Supabase SQL editor, then record it in
-- brief/EVIDENCE.md.

create or replace function public.protect_user_role()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  -- PostgREST runs a signed-in user's request as `authenticated` and an anonymous one as `anon`;
  -- the service key runs as `service_role`, the SQL editor as `postgres`.
  if current_user in ('authenticated', 'anon') and (
       (tg_op = 'INSERT' and new.role is distinct from 'customer')
    or (tg_op = 'UPDATE' and new.role is distinct from old.role)
  ) then
    raise exception 'user_profiles.role can only be changed by an administrator'
      using errcode = '42501';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_user_role on public.user_profiles;
create trigger protect_user_role
  before insert or update of role on public.user_profiles
  for each row execute function public.protect_user_role();

-- A new profile is a customer. An admin is made by hand here.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.user_profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    'customer'
  );
  return new;
end;
$$;

-- Verify after applying (expect: protect_user_role and set_updated_at listed; the function body
-- without raw_user_meta_data ->> 'role'):
--   select tgname from pg_trigger where tgrelid = 'public.user_profiles'::regclass and not tgisinternal;
--   select prosrc from pg_proc where proname = 'handle_new_user';
