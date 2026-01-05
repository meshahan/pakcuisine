-- Create the Specific Admin User requested by user (meshahan@gmail.com)
-- Run this in Supabase SQL Editor

INSERT INTO auth.users (
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
  updated_at
)
SELECT 
  '00000000-0000-0000-0000-000000000000',
  uuid_generate_v4(),
  'authenticated',
  'authenticated',
  'meshahan@gmail.com', -- The email you tried to use
  crypt('Sarah@Shahan', gen_salt('bf')), -- The password you requested
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Master Admin"}',
  now(),
  now()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'meshahan@gmail.com'
);
