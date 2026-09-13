create type public.user_role as enum ('user', 'admin');

alter table public.profiles
  add column role public.user_role not null default 'user';

drop policy "Users can create their own articles" on public.articles;

create policy "Admins can create articles"
  on public.articles for insert
  with check (
    (select auth.uid()) = author_id
    and exists (
      select 1 from public.profiles
      where id = (select auth.uid()) and role = 'admin'
    )
  );
