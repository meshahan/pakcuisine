-- 1. Fix Reservations RLS (Allow public to see their own insertion results)
DROP POLICY IF EXISTS "Anyone can create reservation" ON public.reservations;
CREATE POLICY "Anyone can create reservation" ON public.reservations
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view reservations" ON public.reservations;
CREATE POLICY "Public can view reservations" ON public.reservations
    FOR SELECT USING (true);

-- 2. Fix Orders RLS
DROP POLICY IF EXISTS "Allow public read orders" ON public.orders;
CREATE POLICY "Allow public read orders" ON public.orders
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert orders" ON public.orders;
CREATE POLICY "Allow public insert orders" ON public.orders
    FOR INSERT WITH CHECK (true);

-- 3. Fix Order Items RLS
DROP POLICY IF EXISTS "Allow public read items" ON public.order_items;
CREATE POLICY "Allow public read items" ON public.order_items
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert items" ON public.order_items;
CREATE POLICY "Allow public insert items" ON public.order_items
    FOR INSERT WITH CHECK (true);

-- 4. Fix Subscribers RLS
DROP POLICY IF EXISTS "Public can subscribe" ON public.subscribers;
CREATE POLICY "Public can subscribe" ON public.subscribers
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view own subscription" ON public.subscribers;
CREATE POLICY "Public can view own subscription" ON public.subscribers
    FOR SELECT USING (true);
