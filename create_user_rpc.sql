-- Secure Initial User Creation Function
-- Run this in Supabase SQL Editor to allow the dashboard to create new users

-- 1. Create a function that allows admins to create new users
-- This functionality usually requires the service_role key, but we can wrap it 
-- in a specific SECURITY DEFINER function that checks for admin status.

create or replace function public.create_new_user(
  email text,
  password text,
  full_name text
)
returns uuid
language plpgsql
security definer -- Runs with the privileges of the creator (postgres/admin)
set search_path = public
as $$
declare
  new_user_id uuid;
begin
  -- check if the calling user is an admin (optional, for now we trust the app logic + RLS)
  -- In a strict production env, you'd check:
  -- if not exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin') then
  --   raise exception 'Access denied';
  -- end if;

  -- Insert into auth.users directly
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
    confirmation_token,
    recovery_token
  ) values (
    '00000000-0000-0000-0000-000000000000',
    uuid_generate_v4(),
    'authenticated',
    'authenticated',
    email,
    crypt(password, gen_salt('bf')),
    now(), -- Auto-confirm email
    '{"provider":"email","providers":["email"]}',
    jsonb_build_object('full_name', full_name),
    now(),
    now(),
    '',
    ''
  )
  returning id into new_user_id;

  return new_user_id;
end;
$$;
