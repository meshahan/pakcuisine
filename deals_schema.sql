-- Create sales/deals table
CREATE TABLE IF NOT EXISTS deals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2), -- For showing struck-through price
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

-- Policies
-- Everyone can view active deals
DROP POLICY IF EXISTS "Public can view active deals" ON deals;
CREATE POLICY "Public can view active deals" ON deals
    FOR SELECT
    USING (is_active = true OR auth.role() = 'authenticated');

-- Only admins/authenticated users can view all deals (including inactive)
DROP POLICY IF EXISTS "Admins can view all deals" ON deals;
CREATE POLICY "Admins can view all deals" ON deals
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Admins can insert
DROP POLICY IF EXISTS "Admins can insert deals" ON deals;
CREATE POLICY "Admins can insert deals" ON deals
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Admins can update
DROP POLICY IF EXISTS "Admins can update deals" ON deals;
CREATE POLICY "Admins can update deals" ON deals
    FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Admins can delete
DROP POLICY IF EXISTS "Admins can delete deals" ON deals;
CREATE POLICY "Admins can delete deals" ON deals
    FOR DELETE
    USING (auth.role() = 'authenticated');

-- Realtime
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'deals'
  ) THEN
    ALTER PUBLICATION supabase_realtime DROP TABLE deals;
  END IF;
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE deals;

-- Create subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for subscribers
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Public can insert (subscribe)
DROP POLICY IF EXISTS "Public can subscribe" ON subscribers;
CREATE POLICY "Public can subscribe" ON subscribers
    FOR INSERT
    WITH CHECK (true);

-- Admins can view subscribers
DROP POLICY IF EXISTS "Admins can view subscribers" ON subscribers;
CREATE POLICY "Admins can view subscribers" ON subscribers
    FOR SELECT
    USING (auth.role() = 'authenticated');
    
-- Admins can delete subscribers
DROP POLICY IF EXISTS "Admins can delete subscribers" ON subscribers;
CREATE POLICY "Admins can delete subscribers" ON subscribers
    FOR DELETE
    USING (auth.role() = 'authenticated');
