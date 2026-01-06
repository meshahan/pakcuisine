-- Fix the broken Anniversary Celebration image
-- Run this in your Supabase SQL Editor

-- Update the broken image URL (display_order 7)
UPDATE public.gallery_images 
SET image_url = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800'
WHERE display_order = 7;

-- Alternative: If you want to use a different anniversary/romantic dining image
-- UPDATE public.gallery_images 
-- SET image_url = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800'
-- WHERE display_order = 7;

-- Verify the update
SELECT id, caption, image_url, display_order 
FROM public.gallery_images 
WHERE display_order = 7;
