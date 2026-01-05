-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. BLOG POSTS TABLE
create table public.blog_posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  featured_image text,
  author_id uuid references auth.users(id),
  is_published boolean default false,
  published_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  meta_title text,
  meta_description text
);

-- 2. MENU CATEGORIES TABLE
create table public.menu_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  display_order integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- 3. MENU ITEMS TABLE
create table public.menu_items (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references public.menu_categories(id),
  name text not null,
  description text,
  price decimal(10,2) not null,
  image_url text,
  is_vegetarian boolean default false,
  is_gluten_free boolean default false,
  is_halal boolean default true,
  spicy_level integer default 0, -- 0-3
  is_featured boolean default false,
  is_available boolean default true,
  display_order integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 4. RESERVATIONS TABLE
create table public.reservations (
  id uuid primary key default uuid_generate_v4(),
  guest_name text not null,
  guest_email text not null,
  guest_phone text,
  party_size integer not null,
  reservation_date date not null,
  reservation_time time not null,
  special_requests text,
  status text default 'pending', -- pending, confirmed, cancelled, completed
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 5. CONTACT SUBMISSIONS TABLE
create table public.contact_submissions (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  status text default 'unread', -- unread, read, replied
  created_at timestamp with time zone default now()
);

-- 6. GALLERY IMAGES TABLE
create table public.gallery_images (
  id uuid primary key default uuid_generate_v4(),
  image_url text not null,
  caption text,
  display_order integer default 0,
  is_visible boolean default true,
  created_at timestamp with time zone default now()
);

-- 7. TESTIMONIALS TABLE
create table public.testimonials (
  id uuid primary key default uuid_generate_v4(),
  customer_name text not null,
  customer_image text,
  rating integer default 5, -- 1-5
  review_text text not null,
  is_featured boolean default false,
  is_visible boolean default true,
  created_at timestamp with time zone default now()
);

-- 8. SITE SETTINGS TABLE (Key-Value Store)
create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default now()
);

-- Row Level Security (RLS) Policies
alter table public.blog_posts enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.reservations enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.gallery_images enable row level security;
alter table public.testimonials enable row level security;
alter table public.site_settings enable row level security;

-- PUBLIC READ ACCESS (Anyone can view active content)
create policy "Allow public read on published blog posts"
  on public.blog_posts for select
  using (is_published = true);

create policy "Allow public read on active menu categories"
  on public.menu_categories for select
  using (is_active = true);

create policy "Allow public read on available menu items"
  on public.menu_items for select
  using (is_available = true);

create policy "Allow public read on visible gallery images"
  on public.gallery_images for select
  using (is_visible = true);

create policy "Allow public read on visible testimonials"
  on public.testimonials for select
  using (is_visible = true);

create policy "Allow public read on site settings"
  on public.site_settings for select
  using (true);

-- CREATE ACCESS (Public submissions)
create policy "Allow public to create reservations"
  on public.reservations for insert
  with check (true);

create policy "Allow public to create contact submissions"
  on public.contact_submissions for insert
  with check (true);

-- ADMIN FULL ACCESS (Authenticated users can manage everything)
-- Note: In a production app, you'd check for specific 'admin' role claims.
-- For simplicity in this demo, we allow any authenticated user to manage content.
-- Secure this by adding `and auth.jwt() ->> 'email' = 'your-admin-email@example.com'` if needed.

create policy "Enable all access for authenticated users on blog posts"
  on public.blog_posts for all
  using (auth.role() = 'authenticated');

create policy "Enable all access for authenticated users on menu categories"
  on public.menu_categories for all
  using (auth.role() = 'authenticated');

create policy "Enable all access for authenticated users on menu items"
  on public.menu_items for all
  using (auth.role() = 'authenticated');

create policy "Enable all access for authenticated users on reservations"
  on public.reservations for all
  using (auth.role() = 'authenticated');

create policy "Enable all access for authenticated users on contact submissions"
  on public.contact_submissions for all
  using (auth.role() = 'authenticated');

create policy "Enable all access for authenticated users on gallery images"
  on public.gallery_images for all
  using (auth.role() = 'authenticated');

create policy "Enable all access for authenticated users on testimonials"
  on public.testimonials for all
  using (auth.role() = 'authenticated');

create policy "Enable all access for authenticated users on site settings"
  on public.site_settings for all
  using (auth.role() = 'authenticated');

-- Initial Data for Site Settings
insert into public.site_settings (key, value) values
('theme', '{"primary": "#F97316", "secondary": "#F59E0B", "accent": "#10B981"}'),
('seo', '{"title": "Pak Cuisine", "description": "Authentic Pakistani Flavors", "keywords": "pakistani food, halal, dining"}'),
('contact', '{"phone": "+1 234 567 890", "email": "info@pakcuisine.com", "address": "123 Spice Street, Food City", "facebook": "", "instagram": "", "twitter": ""}');
