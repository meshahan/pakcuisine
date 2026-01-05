export interface MenuCategory {
  id: string;
  name: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_vegetarian: boolean;
  is_halal: boolean;
  is_gluten_free: boolean;
  spicy_level: number;
  is_featured: boolean;
  is_available: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  category?: MenuCategory;
}

export interface Reservation {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
  party_size: number;
  reservation_date: string;
  reservation_time: string;
  special_requests: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  customer_image: string | null;
  rating: number;
  review_text: string;
  is_featured: boolean;
  is_visible: boolean;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  is_published: boolean;
  published_at: string | null;
  author_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface OpeningHours {
  id: string;
  day_of_week: number;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
}

export interface GalleryImage {
  id: string;
  image_url: string;
  caption: string | null;
  display_order: number;
  is_visible: boolean;
  created_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: Record<string, any>;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export type AppRole = 'admin' | 'user';

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}
