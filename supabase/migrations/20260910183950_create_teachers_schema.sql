-- Teacher profile status, used to hide unfinished/suspended profiles from search.
create type public.teacher_status as enum ('draft', 'pending_review', 'published', 'suspended');

create table public.teachers (
  id uuid not null primary key references public.profiles (id) on delete cascade,
  headline text,
  bio text,
  video_url text,
  experience_years int,
  diploma text,
  city text,
  postal_code text,
  lat double precision,
  lng double precision,
  teaches_online boolean not null default false,
  teaches_at_home boolean not null default false,
  teaches_at_teacher_home boolean not null default false,
  hourly_rate numeric(10, 2),
  first_lesson_free boolean not null default false,
  availability jsonb not null default '{}'::jsonb,
  status public.teacher_status not null default 'draft',
  is_verified boolean not null default false,
  rating_avg numeric(3, 2),
  rating_count int not null default 0,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table public.teachers enable row level security;

create policy "Published teacher profiles are viewable by everyone"
  on public.teachers for select
  using (status = 'published' or (select auth.uid()) = id);

create policy "Users can create their own teacher profile"
  on public.teachers for insert
  with check ((select auth.uid()) = id);

create policy "Teachers can update their own profile"
  on public.teachers for update
  using ((select auth.uid()) = id);

-- Reference table of subjects that can be taught.
create table public.subjects (
  id uuid not null primary key default gen_random_uuid(),
  name text not null unique,
  category text
);

alter table public.subjects enable row level security;

create policy "Subjects are viewable by everyone"
  on public.subjects for select
  using (true);

-- Many-to-many: which subjects a teacher teaches, at which level/price.
create table public.teacher_subjects (
  id uuid not null primary key default gen_random_uuid(),
  teacher_id uuid not null references public.teachers (id) on delete cascade,
  subject_id uuid not null references public.subjects (id) on delete cascade,
  level text,
  hourly_rate numeric(10, 2),
  unique (teacher_id, subject_id, level)
);

alter table public.teacher_subjects enable row level security;

create policy "Teacher subjects are viewable by everyone"
  on public.teacher_subjects for select
  using (true);

create policy "Teachers can manage their own subjects"
  on public.teacher_subjects for all
  using ((select auth.uid()) = teacher_id)
  with check ((select auth.uid()) = teacher_id);

-- Student reviews left on a teacher's profile.
create table public.reviews (
  id uuid not null primary key default gen_random_uuid(),
  teacher_id uuid not null references public.teachers (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamp with time zone not null default now(),
  unique (teacher_id, student_id)
);

alter table public.reviews enable row level security;

create policy "Reviews are viewable by everyone"
  on public.reviews for select
  using (true);

create policy "Students can leave reviews"
  on public.reviews for insert
  with check ((select auth.uid()) = student_id);

create policy "Students can update their own review"
  on public.reviews for update
  using ((select auth.uid()) = student_id);

create policy "Students can delete their own review"
  on public.reviews for delete
  using ((select auth.uid()) = student_id);

-- Keeps teachers.rating_avg/rating_count in sync with public.reviews.
create function public.handle_review_change()
returns trigger
set search_path = ''
as $$
declare
  affected_teacher_id uuid := coalesce(new.teacher_id, old.teacher_id);
begin
  update public.teachers
  set
    rating_avg = (select round(avg(rating)::numeric, 2) from public.reviews where teacher_id = affected_teacher_id),
    rating_count = (select count(*) from public.reviews where teacher_id = affected_teacher_id)
  where id = affected_teacher_id;
  return null;
end;
$$ language plpgsql security definer;

create trigger on_review_change
  after insert or update or delete on public.reviews
  for each row execute function public.handle_review_change();
