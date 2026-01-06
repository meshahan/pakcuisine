-- Add Event-Focused Gallery Images for Marketing
-- Run this in your Supabase SQL Editor to populate the gallery with event showcase images

-- Clear existing images (optional - comment out if you want to keep existing images)
-- DELETE FROM public.gallery_images;

-- Add event and food showcase images with marketing captions
INSERT INTO public.gallery_images (image_url, caption, display_order, is_visible)
VALUES
    -- Events & Celebrations
    ('https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800', 'Elegant Wedding Reception - We make your special day unforgettable with authentic Pakistani cuisine and beautiful decor', 1, true),
    ('https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800', 'Birthday Party Setup - Celebrate your milestones with us! Custom menus and decorations available', 2, true),
    ('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800', 'Corporate Event Catering - Professional service for business meetings, conferences, and corporate gatherings', 3, true),
    
    -- Signature Dishes
    ('https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800', 'Our Famous Chicken Biryani - Aromatic basmati rice layered with tender chicken and exotic spices', 4, true),
    ('https://images.unsplash.com/photo-1567337710282-00832b415979?w=800', 'Freshly Baked Naan - Soft, fluffy naan bread baked fresh in our traditional tandoor oven', 5, true),
    ('https://images.unsplash.com/photo-1574484284002-952d92456975?w=800', 'Spicy Chicken Karahi - A Pakistani favorite! Tender chicken cooked with tomatoes, ginger, and green chilies', 6, true),
    
    -- More Events
    ('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', 'Anniversary Celebration - Romantic ambiance and exquisite dining for your special anniversary', 7, true),
    ('https://images.unsplash.com/photo-1478145787956-f6f12c59624d?w=800', 'Family Gathering - Spacious seating and family-friendly atmosphere for reunions and get-togethers', 8, true),
    
    -- More Dishes
    ('https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800', 'Crispy Samosas - Golden, flaky pastries filled with spiced potatoes and peas. Perfect appetizer!', 9, true),
    ('https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800', 'Tandoori Mixed Grill - Succulent meats marinated in yogurt and spices, grilled to perfection', 10, true),
    ('https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800', 'Lamb Korma - Rich and creamy curry with tender lamb pieces in a cashew-based sauce', 11, true),
    ('https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800', 'Butter Chicken - Creamy tomato-based curry with tender chicken pieces. A crowd favorite!', 12, true);

-- Verify the images were added
SELECT id, caption, display_order, is_visible FROM public.gallery_images ORDER BY display_order;
