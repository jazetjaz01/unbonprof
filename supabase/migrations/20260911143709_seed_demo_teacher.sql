-- Demo teacher profile, used to preview the teacher card/search UI.
do $$
declare
  demo_user_id uuid := gen_random_uuid();
  demo_email text := 'sophie.martin.demo@unbonprof.fr';
begin
  if exists (select 1 from auth.users where email = demo_email) then
    return;
  end if;

  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, email_change,
    email_change_token_new, recovery_token
  ) values (
    '00000000-0000-0000-0000-000000000000',
    demo_user_id,
    'authenticated',
    'authenticated',
    demo_email,
    extensions.crypt('DemoProf123!', extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    jsonb_build_object('full_name', 'Sophie Martin'),
    now(),
    now(),
    '',
    '',
    '',
    ''
  );

  insert into auth.identities (
    id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
  ) values (
    gen_random_uuid(),
    demo_user_id,
    demo_user_id::text,
    jsonb_build_object('sub', demo_user_id::text, 'email', demo_email),
    'email',
    now(), now(), now()
  );

  -- public.profiles row is created automatically by the on_auth_user_created trigger.

  insert into public.teachers (
    id, headline, bio, experience_years, diploma, city, postal_code,
    teaches_online, teaches_at_home, teaches_at_teacher_home,
    hourly_rate, first_lesson_free, availability, status, is_verified
  ) values (
    demo_user_id,
    'Professeure de piano et de chant diplômée du Conservatoire',
    'Pianiste diplômée du Conservatoire de Paris, je donne des cours de piano et de chant depuis plus de 8 ans, pour tous niveaux et tous âges. Pédagogie adaptée à chacun, dans la bonne humeur !',
    8,
    'Diplôme du Conservatoire National de Région',
    'Paris',
    '75011',
    true, true, true,
    35.00,
    true,
    '{"monday": ["14:00-19:00"], "wednesday": ["09:00-12:00", "14:00-19:00"], "saturday": ["10:00-13:00"]}'::jsonb,
    'published',
    true
  );

  insert into public.teacher_subjects (teacher_id, subject_id, level, hourly_rate)
  select demo_user_id, id, 'Tous niveaux', 35.00
  from public.subjects
  where name in ('Piano', 'Chant');
end $$;
