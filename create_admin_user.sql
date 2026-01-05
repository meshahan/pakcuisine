-- Create the Master Admin User
-- NOTE: This script must be run in the Supabase SQL Editor
-- It bypasses public signup restrictions to seed the initial admin

-- 1. Create the user in auth.users
-- Password is 'Sarah@Shahan'
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  uuid_generate_v4(),
  'authenticated',
  'authenticated',
  'meshahan', -- Using username as email/id placeholder or actual email if provided
  crypt('Sarah@Shahan', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Master Admin"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
)
ON CONFLICT DO NOTHING;
-- Note: Ideally, 'meshahan' should be a valid email like 'meshahan@example.com' for Supabase Auth to work standardly.
-- Updating to use a placeholder email if 'meshahan' is strictly required as login, 
-- but Supabase Auth requires an email. Assuming 'meshahan@admin.com' for the email field if 'meshahan' is the username aimed for.

-- Correcting insertion to ensure valid email format which is required for auth
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
  'meshahan@admin.com', -- Using a constructed email since 'meshahan' isn't an email
  crypt('Sarah@Shahan', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Master Admin"}',
  now(),
  now()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'meshahan@admin.com'
);
