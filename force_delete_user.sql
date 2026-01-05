-- Force delete the corrupted user records
-- Run this in Supabase SQL Editor

DELETE FROM auth.users 
WHERE email IN ('meshahan@admin.com', 'meshahan@gmail.com');
