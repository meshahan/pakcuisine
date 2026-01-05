export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_id: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          is_published: boolean | null
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean | null
          message: string
          name: string
          phone: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean | null
          message: string
          name: string
          phone?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean | null
          message?: string
          name?: string
          phone?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          caption: string | null
          created_at: string
          display_order: number | null
          id: string
          image_url: string
          is_visible: boolean | null
        }
        Insert: {
          caption?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          image_url: string
          is_visible?: boolean | null
        }
        Update: {
          caption?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string
          is_visible?: boolean | null
        }
        Relationships: []
      }
      menu_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_available: boolean | null
          is_featured: boolean | null
          is_gluten_free: boolean | null
          is_halal: boolean | null
          is_vegetarian: boolean | null
          name: string
          price: number
          spicy_level: number | null
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_featured?: boolean | null
          is_gluten_free?: boolean | null
          is_halal?: boolean | null
          is_vegetarian?: boolean | null
          name: string
          price: number
          spicy_level?: number | null
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_featured?: boolean | null
          is_gluten_free?: boolean | null
          is_halal?: boolean | null
          is_vegetarian?: boolean | null
          name?: string
          price?: number
          spicy_level?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      opening_hours: {
        Row: {
          close_time: string | null
          day_of_week: number
          id: string
          is_closed: boolean | null
          open_time: string | null
        }
        Insert: {
          close_time?: string | null
          day_of_week: number
          id?: string
          is_closed?: boolean | null
          open_time?: string | null
        }
        Update: {
          close_time?: string | null
          day_of_week?: number
          id?: string
          is_closed?: boolean | null
          open_time?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          created_at: string
          guest_email: string
          guest_name: string
          guest_phone: string | null
          id: string
          party_size: number
          reservation_date: string
          reservation_time: string
          special_requests: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          guest_email: string
          guest_name: string
          guest_phone?: string | null
          id?: string
          party_size: number
          reservation_date: string
          reservation_time: string
          special_requests?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          guest_email?: string
          guest_name?: string
          guest_phone?: string | null
          id?: string
          party_size?: number
          reservation_date?: string
          reservation_time?: string
          special_requests?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          created_at: string
          customer_image: string | null
          customer_name: string
          id: string
          is_featured: boolean | null
          is_visible: boolean | null
          rating: number | null
          review_text: string
        }
        Insert: {
          created_at?: string
          customer_image?: string | null
          customer_name: string
          id?: string
          is_featured?: boolean | null
          is_visible?: boolean | null
          rating?: number | null
          review_text: string
        }
        Update: {
          created_at?: string
          customer_image?: string | null
          customer_name?: string
          id?: string
          is_featured?: boolean | null
          is_visible?: boolean | null
          rating?: number | null
          review_text?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      deals: {
        Row: {
          id: string
          title: string
          description: string | null
          price: number
          original_price: number | null
          image_url: string | null
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          price: number
          original_price?: number | null
          image_url?: string | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          price?: number
          original_price?: number | null
          image_url?: string | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          customer_name: string
          customer_email: string | null
          customer_phone: string
          delivery_address: string
          order_type: string | null
          payment_method: string | null
          payment_status: string | null
          order_status: string | null
          total_amount: number
          special_instructions: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_name: string
          customer_email?: string | null
          customer_phone: string
          delivery_address: string
          order_type?: string | null
          payment_method?: string | null
          payment_status?: string | null
          order_status?: string | null
          total_amount: number
          special_instructions?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_name?: string
          customer_email?: string | null
          customer_phone?: string
          delivery_address?: string
          order_type?: string | null
          payment_method?: string | null
          payment_status?: string | null
          order_status?: string | null
          total_amount?: number
          special_instructions?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string | null
          item_name: string
          quantity: number
          unit_price: number
          total_price: number
        }
        Insert: {
          id?: string
          order_id?: string | null
          item_name: string
          quantity: number
          unit_price: number
          total_price: number
        }
        Update: {
          id?: string
          order_id?: string | null
          item_name?: string
          quantity?: number
          unit_price?: number
          total_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
    DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
    DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema["Enums"]
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
