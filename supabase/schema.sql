-- =========================================================
-- NurseChoice MVP — Supabase schema
-- Run this in Supabase SQL editor.
-- =========================================================

create extension if not exists "pgcrypto";

-- ---------- Tables ----------

create table if not exists public.hospitals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  prefecture text,
  hospital_type text,
  bed_count int,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.wards (
  id uuid primary key default gen_random_uuid(),
  hospital_id uuid not null references public.hospitals(id) on delete cascade,
  name text not null,
  department text,
  description text,
  staff_count int,
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  ward_id uuid not null references public.wards(id) on delete cascade,
  author_year int not null default 1,
  is_current_staff boolean not null default true,
  score_human_relations int not null check (score_human_relations between 1 and 5),
  score_busyness int not null check (score_busyness between 1 and 5),
  score_education int not null check (score_education between 1 and 5),
  score_work_life int not null check (score_work_life between 1 and 5),
  overtime_avg int not null default 0,
  overtime_paid boolean not null default true,
  pre_overtime boolean not null default false,
  has_difficult_person boolean not null default false,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.internships (
  id uuid primary key default gen_random_uuid(),
  ward_id uuid not null references public.wards(id) on delete cascade,
  date date not null,
  start_time time not null,
  end_time time not null,
  capacity int not null default 1,
  remaining int not null default 1,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  school_name text,
  graduation_year int,
  user_type text not null default 'student' check (user_type in ('student','nurse')),
  preferred_prefecture text,
  preferred_department text,
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  internship_id uuid not null references public.internships(id) on delete cascade,
  motivation text,
  status text not null default 'pending' check (status in ('pending','approved','rejected','cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  ward_id uuid not null references public.wards(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, ward_id)
);

create table if not exists public.matching_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  answers jsonb not null,
  scores jsonb,
  created_at timestamptz not null default now()
);

-- ---------- Indexes ----------
create index if not exists wards_hospital_idx on public.wards(hospital_id);
create index if not exists reviews_ward_idx on public.reviews(ward_id);
create index if not exists internships_ward_idx on public.internships(ward_id);
create index if not exists internships_date_idx on public.internships(date);
create index if not exists bookings_user_idx on public.bookings(user_id);
create index if not exists favorites_user_idx on public.favorites(user_id);

-- ---------- RLS ----------
alter table public.hospitals enable row level security;
alter table public.wards enable row level security;
alter table public.reviews enable row level security;
alter table public.internships enable row level security;
alter table public.user_profiles enable row level security;
alter table public.bookings enable row level security;
alter table public.favorites enable row level security;
alter table public.matching_results enable row level security;

-- Public read for catalog data
drop policy if exists "read hospitals" on public.hospitals;
create policy "read hospitals" on public.hospitals for select using (true);

drop policy if exists "read wards" on public.wards;
create policy "read wards" on public.wards for select using (true);

drop policy if exists "read reviews" on public.reviews;
create policy "read reviews" on public.reviews for select using (true);

drop policy if exists "read internships" on public.internships;
create policy "read internships" on public.internships for select using (true);

-- user_profiles: user can read/write own record
drop policy if exists "read own profile" on public.user_profiles;
create policy "read own profile" on public.user_profiles for select using (auth.uid() = id);

drop policy if exists "upsert own profile" on public.user_profiles;
create policy "upsert own profile" on public.user_profiles for insert with check (auth.uid() = id);

drop policy if exists "update own profile" on public.user_profiles;
create policy "update own profile" on public.user_profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- bookings
drop policy if exists "read own bookings" on public.bookings;
create policy "read own bookings" on public.bookings for select using (auth.uid() = user_id);

drop policy if exists "create own bookings" on public.bookings;
create policy "create own bookings" on public.bookings for insert with check (auth.uid() = user_id);

drop policy if exists "cancel own bookings" on public.bookings;
create policy "cancel own bookings" on public.bookings for update using (auth.uid() = user_id);

-- favorites
drop policy if exists "read own favorites" on public.favorites;
create policy "read own favorites" on public.favorites for select using (auth.uid() = user_id);

drop policy if exists "add own favorites" on public.favorites;
create policy "add own favorites" on public.favorites for insert with check (auth.uid() = user_id);

drop policy if exists "remove own favorites" on public.favorites;
create policy "remove own favorites" on public.favorites for delete using (auth.uid() = user_id);

-- matching_results
drop policy if exists "read own results" on public.matching_results;
create policy "read own results" on public.matching_results for select using (auth.uid() = user_id);

drop policy if exists "insert own results" on public.matching_results;
create policy "insert own results" on public.matching_results for insert with check (auth.uid() = user_id);

drop policy if exists "update own results" on public.matching_results;
create policy "update own results" on public.matching_results for update using (auth.uid() = user_id);

-- Allow updating internships.remaining when booking (server-side with service role bypasses RLS anyway)
drop policy if exists "update internship remaining" on public.internships;
create policy "update internship remaining" on public.internships for update using (true) with check (true);
