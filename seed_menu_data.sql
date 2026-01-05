-- Seed Database with Existing Menu Data
-- Run this in Supabase SQL Editor

-- 1. CLEANUP (Optional - removes existing menu data to avoid duplicates)
DELETE FROM public.menu_items;
DELETE FROM public.menu_categories;

-- 2. INSERT CATEGORIES
-- We insert them and rely on the name to link items later, or we could hardcode UUIDs.
-- For simplicity in a script, we'll just insert them.

INSERT INTO public.menu_categories (name, description, display_order, is_active) VALUES
('Appetizers', 'Starters to awaken your taste buds', 1, true),
('Biryani & Rice', 'Aromatic rice dishes', 2, true),
('Curries', 'Rich and flavorful curries', 3, true),
('Tandoori', 'Sizzling clay oven specialties', 4, true),
('Desserts', 'Sweet endings', 5, true),
('Beverages', 'Refreshing drinks', 6, true);

-- 3. INSERT MENU ITEMS
-- We use a subquery to get the category_id based on the name 'Appetizers', etc.

-- Appetizers
INSERT INTO public.menu_items (category_id, name, description, price, image_url, is_vegetarian, spicy_level, is_featured)
SELECT id, 'Samosa', 'Crispy pastry filled with spiced potatoes and peas, served with mint chutney.', 6.99, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=400&auto=format&fit=crop', true, 0, false
FROM public.menu_categories WHERE name = 'Appetizers';

INSERT INTO public.menu_items (category_id, name, description, price, image_url, is_vegetarian, spicy_level, is_featured)
SELECT id, 'Chicken Pakora', 'Tender chicken pieces coated in spiced batter and deep fried until golden.', 9.99, 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=400&auto=format&fit=crop', false, 1, false
FROM public.menu_categories WHERE name = 'Appetizers';

-- Biryani
INSERT INTO public.menu_items (category_id, name, description, price, image_url, is_vegetarian, spicy_level, is_featured)
SELECT id, 'Chicken Biryani', 'Fragrant basmati rice layered with tender chicken, aromatic spices, and saffron.', 18.99, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=400&auto=format&fit=crop', false, 2, true
FROM public.menu_categories WHERE name = 'Biryani & Rice';

INSERT INTO public.menu_items (category_id, name, description, price, image_url, is_vegetarian, spicy_level, is_featured)
SELECT id, 'Mutton Biryani', 'Premium mutton slow-cooked with aged basmati rice and traditional spices.', 24.99, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=400&auto=format&fit=crop', false, 2, false
FROM public.menu_categories WHERE name = 'Biryani & Rice';

INSERT INTO public.menu_items (category_id, name, description, price, image_url, is_vegetarian, spicy_level, is_featured)
SELECT id, 'Vegetable Biryani', 'Mixed vegetables and paneer cooked with aromatic basmati rice.', 14.99, 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?q=80&w=400&auto=format&fit=crop', true, 1, false
FROM public.menu_categories WHERE name = 'Biryani & Rice';

-- Curries
INSERT INTO public.menu_items (category_id, name, description, price, image_url, is_vegetarian, spicy_level, is_featured)
SELECT id, 'Lamb Karahi', 'Succulent lamb cooked in a wok with tomatoes, ginger, and green chilies.', 24.99, 'https://images.unsplash.com/photo-1545247181-516773cae754?q=80&w=400&auto=format&fit=crop', false, 2, true
FROM public.menu_categories WHERE name = 'Curries';

INSERT INTO public.menu_items (category_id, name, description, price, image_url, is_vegetarian, spicy_level, is_featured)
SELECT id, 'Butter Chicken', 'Tender chicken in a rich, creamy tomato sauce with aromatic spices.', 19.99, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=400&auto=format&fit=crop', false, 0, false
FROM public.menu_categories WHERE name = 'Curries';

INSERT INTO public.menu_items (category_id, name, description, price, image_url, is_vegetarian, spicy_level, is_featured)
SELECT id, 'Palak Paneer', 'Cottage cheese cubes in a creamy spinach sauce with Indian spices.', 15.99, 'https://images.unsplash.com/photo-1618449840665-9ed506d73a34?q=80&w=400&auto=format&fit=crop', true, 0, false
FROM public.menu_categories WHERE name = 'Curries';

-- Tandoori
INSERT INTO public.menu_items (category_id, name, description, price, image_url, is_vegetarian, spicy_level, is_featured)
SELECT id, 'Seekh Kebab', 'Minced lamb skewers seasoned with herbs and spices, grilled to perfection.', 16.99, 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=400&auto=format&fit=crop', false, 2, false
FROM public.menu_categories WHERE name = 'Tandoori';

INSERT INTO public.menu_items (category_id, name, description, price, image_url, is_vegetarian, spicy_level, is_featured)
SELECT id, 'Chicken Tikka', 'Boneless chicken marinated in yogurt and spices, cooked in tandoor.', 17.99, 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=400&auto=format&fit=crop', false, 2, false
FROM public.menu_categories WHERE name = 'Tandoori';

INSERT INTO public.menu_items (category_id, name, description, price, image_url, is_vegetarian, spicy_level, is_featured)
SELECT id, 'Paneer Tikka', 'Marinated cottage cheese cubes grilled with bell peppers and onions.', 14.99, 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=400&auto=format&fit=crop', true, 1, false
FROM public.menu_categories WHERE name = 'Tandoori';

-- Desserts
INSERT INTO public.menu_items (category_id, name, description, price, image_url, is_vegetarian, spicy_level, is_featured)
SELECT id, 'Gulab Jamun', 'Deep-fried milk dumplings soaked in rose-flavored sugar syrup.', 5.99, '/images/gulab-jamun.png', true, 0, false
FROM public.menu_categories WHERE name = 'Desserts';

INSERT INTO public.menu_items (category_id, name, description, price, image_url, is_vegetarian, spicy_level, is_featured)
SELECT id, 'Kheer', 'Creamy rice pudding with cardamom, nuts, and rose water.', 6.99, 'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=400&auto=format&fit=crop', true, 0, false
FROM public.menu_categories WHERE name = 'Desserts';

-- Beverages
INSERT INTO public.menu_items (category_id, name, description, price, image_url, is_vegetarian, spicy_level, is_featured)
SELECT id, 'Mango Lassi', 'Refreshing yogurt drink blended with sweet mango pulp.', 4.99, 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?q=80&w=400&auto=format&fit=crop', true, 0, false
FROM public.menu_categories WHERE name = 'Beverages';

INSERT INTO public.menu_items (category_id, name, description, price, image_url, is_vegetarian, spicy_level, is_featured)
SELECT id, 'Masala Chai', 'Traditional spiced tea with milk and aromatic spices.', 3.99, 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?q=80&w=400&auto=format&fit=crop', true, 0, false
FROM public.menu_categories WHERE name = 'Beverages';

