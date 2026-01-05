
-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  order_type TEXT DEFAULT 'delivery', -- 'delivery' or 'pickup'
  payment_method TEXT DEFAULT 'cod', -- 'cod' or 'card'
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'failed'
  order_status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'
  total_amount DECIMAL(10, 2) NOT NULL,
  special_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 🔴 FIX FOR 403 ERROR: Allow public read access so checkout works
CREATE POLICY "Allow public read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update orders" ON public.orders FOR UPDATE USING (true);

CREATE POLICY "Allow public read items" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Allow public insert items" ON public.order_items FOR INSERT WITH CHECK (true);

-- Note: In a real production app with sensitive data, you would restrict SELECTs to only the user's own orders.
-- Since this is an anonymous checkout demo, "Public Read" allows the success page to show the confirmed order details.
