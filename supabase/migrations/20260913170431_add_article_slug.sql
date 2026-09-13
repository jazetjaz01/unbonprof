alter table public.articles add column slug text;

-- Backfill existing rows with a URL-safe slug derived from the title,
-- suffixed with part of the id to guarantee uniqueness.
update public.articles
set slug = lower(regexp_replace(trim(title), '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(id::text, 1, 8)
where slug is null;

alter table public.articles
  alter column slug set not null,
  add constraint articles_slug_key unique (slug);
