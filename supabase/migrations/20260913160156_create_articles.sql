create table public.articles (
  id uuid not null primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  category text not null,
  title text not null,
  content text not null,
  image_url text,
  created_at timestamp with time zone not null default now()
);

alter table public.articles enable row level security;

create policy "Articles are viewable by everyone"
  on public.articles for select
  using (true);

create policy "Users can create their own articles"
  on public.articles for insert
  with check ((select auth.uid()) = author_id);

create policy "Users can update their own articles"
  on public.articles for update
  using ((select auth.uid()) = author_id);

create policy "Users can delete their own articles"
  on public.articles for delete
  using ((select auth.uid()) = author_id);

-- Public bucket for article cover images.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'articles',
  'articles',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create policy "Article images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'articles');

create policy "Users can upload their own article images"
  on storage.objects for insert
  with check (
    bucket_id = 'articles'
    and (select auth.uid()::text) = (storage.foldername(name))[1]
  );

create policy "Users can delete their own article images"
  on storage.objects for delete
  using (
    bucket_id = 'articles'
    and (select auth.uid()::text) = (storage.foldername(name))[1]
  );
