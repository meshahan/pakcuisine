-- Gallery Images Diagnostic & Fix Script
-- Run this in your Supabase SQL Editor to check and fix gallery image visibility

-- 1. Check if there are any gallery images in the database
SELECT 
    id,
    image_url,
    caption,
    display_order,
    is_visible,
    created_at
FROM public.gallery_images
ORDER BY display_order;

-- 2. Count total images
SELECT COUNT(*) as total_images FROM public.gallery_images;

-- 3. Count visible vs hidden images
SELECT 
    is_visible,
    COUNT(*) as count
FROM public.gallery_images
GROUP BY is_visible;

-- 4. If images exist but aren't showing in admin, check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'gallery_images';

-- 5. OPTIONAL: If you want to make all existing images visible
-- Uncomment the line below to run it:
-- UPDATE public.gallery_images SET is_visible = true WHERE is_visible = false;

-- 6. OPTIONAL: Add sample gallery images if table is empty
-- Uncomment the lines below to add sample images:

/*
INSERT INTO public.gallery_images (image_url, caption, display_order, is_visible)
VALUES
    ('https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800', 'Delicious Biryani', 1, true),
    ('https://images.unsplash.com/photo-1567337710282-00832b415979?w=800', 'Fresh Naan Bread', 2, true),
    ('https://images.unsplash.com/photo-1574484284002-952d92456975?w=800', 'Spicy Chicken Karahi', 3, true),
    ('https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800', 'Traditional Samosas', 4, true),
    ('https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800', 'Tandoori Platter', 5, true),
    ('https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800', 'Lamb Korma', 6, true);
*/

-- 7. Verify the insert worked
-- SELECT * FROM public.gallery_images ORDER BY display_order;
