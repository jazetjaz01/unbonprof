create table public.posts (
  id uuid not null primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  content text not null check (char_length(content) <= 500),
  image_url text,
  created_at timestamp with time zone not null default now()
);

alter table public.posts enable row level security;

create policy "Posts are viewable by everyone"
  on public.posts for select
  using (true);

create policy "Users can create their own posts"
  on public.posts for insert
  with check ((select auth.uid()) = author_id);

create policy "Users can delete their own posts"
  on public.posts for delete
  using ((select auth.uid()) = author_id);

-- Public bucket for images attached to posts.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'posts',
  'posts',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create policy "Post images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'posts');

create policy "Users can upload their own post images"
  on storage.objects for insert
  with check (
    bucket_id = 'posts'
    and (select auth.uid()::text) = (storage.foldername(name))[1]
  );

create policy "Users can delete their own post images"
  on storage.objects for delete
  using (
    bucket_id = 'posts'
    and (select auth.uid()::text) = (storage.foldername(name))[1]
  );
