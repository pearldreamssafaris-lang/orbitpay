-- OrbitPay Phase 2: profile foundation. Apply only to a new Supabase project.
create type public.account_type as enum ('personal','merchant','admin');
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  account_type public.account_type not null default 'personal',
  full_name text,
  business_name text,
  country_code char(2),
  verification_status text not null default 'not_started'
    check (verification_status in ('not_started','pending','verified','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id,email,account_type)
  values (new.id,new.email,
    case when new.raw_user_meta_data->>'account_type' = 'merchant'
      then 'merchant'::public.account_type else 'personal'::public.account_type end);
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();
-- Admin privileges must be assigned only by a trusted server-side process.
-- Never allow a user to promote their own account_type to admin.
