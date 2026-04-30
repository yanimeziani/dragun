-- Local-dev seed.
-- Runs automatically on `supabase start` and `supabase db reset`.
-- Inserts a confirmed "Yani Meziani" user so any future "Sign in as Yani"
-- dev shortcut can authenticate via email+password without OAuth wiring.
-- Production Supabase never executes this file.

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  is_sso_user,
  is_anonymous
)
values (
  '00000000-0000-0000-0000-000000000000',
  '11111111-1111-1111-1111-111111111111',
  'authenticated',
  'authenticated',
  'mezianiyani0@gmail.com',
  crypt('devpass', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Yani Meziani","name":"Yani Meziani"}'::jsonb,
  now(),
  now(),
  false,
  false
)
on conflict (id) do nothing;

insert into auth.identities (
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
values (
  '11111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  jsonb_build_object(
    'sub', '11111111-1111-1111-1111-111111111111',
    'email', 'mezianiyani0@gmail.com',
    'email_verified', true
  ),
  'email',
  now(),
  now(),
  now()
)
on conflict (provider, provider_id) do nothing;
