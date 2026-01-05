-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for role-based access control
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Profiles table for user info
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Menu categories table
CREATE TABLE public.menu_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;

-- Menu items table
CREATE TABLE public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.menu_categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    is_vegetarian BOOLEAN DEFAULT false,
    is_halal BOOLEAN DEFAULT true,
    is_gluten_free BOOLEAN DEFAULT false,
    spicy_level INTEGER DEFAULT 0 CHECK (spicy_level >= 0 AND spicy_level <= 3),
    is_featured BOOLEAN DEFAULT false,
    is_available BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Reservations table
CREATE TABLE public.reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    guest_phone TEXT,
    party_size INTEGER NOT NULL CHECK (party_size >= 1 AND party_size <= 20),
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    special_requests TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Contact submissions table
CREATE TABLE public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Testimonials table
CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_image TEXT,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Blog posts table
CREATE TABLE public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Site settings table
CREATE TABLE public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Opening hours table
CREATE TABLE public.opening_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    open_time TIME,
    close_time TIME,
    is_closed BOOLEAN DEFAULT false,
    UNIQUE (day_of_week)
);

ALTER TABLE public.opening_hours ENABLE ROW LEVEL SECURITY;

-- Gallery images table
CREATE TABLE public.gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- User roles policies
CREATE POLICY "Users can view their own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Menu categories - public read, admin write
CREATE POLICY "Anyone can view active categories" ON public.menu_categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON public.menu_categories
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Menu items - public read, admin write
CREATE POLICY "Anyone can view available items" ON public.menu_items
    FOR SELECT USING (is_available = true);

CREATE POLICY "Admins can manage items" ON public.menu_items
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Reservations - anyone can insert, admins can view all
CREATE POLICY "Anyone can create reservation" ON public.reservations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all reservations" ON public.reservations
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage reservations" ON public.reservations
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Contact submissions - anyone can insert, admins can view
CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view submissions" ON public.contact_submissions
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage submissions" ON public.contact_submissions
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Testimonials - public read visible, admin write
CREATE POLICY "Anyone can view visible testimonials" ON public.testimonials
    FOR SELECT USING (is_visible = true);

CREATE POLICY "Admins can manage testimonials" ON public.testimonials
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Blog posts - public read published, admin write
CREATE POLICY "Anyone can view published posts" ON public.blog_posts
    FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage posts" ON public.blog_posts
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Site settings - public read, admin write
CREATE POLICY "Anyone can view settings" ON public.site_settings
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage settings" ON public.site_settings
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Opening hours - public read, admin write
CREATE POLICY "Anyone can view hours" ON public.opening_hours
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage hours" ON public.opening_hours
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Gallery - public read visible, admin write
CREATE POLICY "Anyone can view visible gallery" ON public.gallery_images
    FOR SELECT USING (is_visible = true);

CREATE POLICY "Admins can manage gallery" ON public.gallery_images
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Function to handle profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

-- Trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_menu_categories_updated_at BEFORE UPDATE ON public.menu_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON public.menu_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON public.reservations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();