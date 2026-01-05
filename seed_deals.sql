-- Ensure table columns exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='deals' AND column_name='is_active') THEN
        ALTER TABLE public.deals ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Insert initial deals if table is empty
INSERT INTO deals (title, description, price, original_price, image_url, is_active)
SELECT title, description, price, original_price, image_url, is_active FROM (
    VALUES
    (
        'Crispy Golden Broast', 
        'Quarter leg piece fried to perfection, served with crispy fries, dinner bun, and our signature garlic sauce.', 
        5.99, 
        8.99, 
        'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1000&auto=format&fit=crop',
        true
    ),
    (
        'Zinger Burger Combo', 
        'Crunchy spicy chicken fillet topped with fresh lettuce and mayo in a sesame bun. Includes a cold drink.', 
        4.50, 
        6.50, 
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop',
        true
    ),
    (
        'Prawn Fried Rice', 
        'Authentic Chinese-style egg fried rice wok-tossed with fresh vegetables and succulent jumbo prawns.', 
        8.99, 
        12.00, 
        'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?q=80&w=1000&auto=format&fit=crop',
        true
    ),
    (
        'Lahori Fish Fry', 
        'Traditional spicy battered fish, deep-fried to a golden crisp. Served with tamarind chutney and naan.', 
        9.99, 
        14.50, 
        'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=1000&auto=format&fit=crop',
        true
    )
) AS t(title, description, price, original_price, image_url, is_active)
WHERE NOT EXISTS (SELECT 1 FROM deals);
    (
        'Double Zinger Feast', 
        'Double the crunch! 2 delicious Zinger Burgers served with a large portion of hot fries and a cold drink.', 
        12.99, 
        16.50, 
        'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=1000&auto=format&fit=crop',
        true
    ),
    (
        'BBQ Tikka Platter', 
        'Smokey Chicken Tikka leg piece served over a bed of aromatic vegetable rice with raita and salad.', 
        10.99, 
        13.50, 
        'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=1000&auto=format&fit=crop',
        true
    );
