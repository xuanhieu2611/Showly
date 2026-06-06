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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      artist_profiles: {
        Row: {
          bio: string | null
          city: string
          contact_info: string | null
          created_at: string | null
          district: string
          id: string
          instagram_url: string | null
          is_published: boolean | null
          price_range: string | null
          tiktok_url: string | null
          updated_at: string | null
          user_id: string
          username: string
          years_experience: string | null
        }
        Insert: {
          bio?: string | null
          city: string
          contact_info?: string | null
          created_at?: string | null
          district: string
          id?: string
          instagram_url?: string | null
          is_published?: boolean | null
          price_range?: string | null
          tiktok_url?: string | null
          updated_at?: string | null
          user_id: string
          username: string
          years_experience?: string | null
        }
        Update: {
          bio?: string | null
          city?: string
          contact_info?: string | null
          created_at?: string | null
          district?: string
          id?: string
          instagram_url?: string | null
          is_published?: boolean | null
          price_range?: string | null
          tiktok_url?: string | null
          updated_at?: string | null
          user_id?: string
          username?: string
          years_experience?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "artist_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      photo_tags: {
        Row: {
          id: string
          photo_id: string | null
          specialty: string
          tag_slug: string
        }
        Insert: {
          id?: string
          photo_id?: string | null
          specialty: string
          tag_slug: string
        }
        Update: {
          id?: string
          photo_id?: string | null
          specialty?: string
          tag_slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "photo_tags_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "portfolio_photos"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_photos: {
        Row: {
          artist_id: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string
          is_cover: boolean | null
          sort_order: number | null
          thumbnail_url: string
          title: string | null
        }
        Insert: {
          artist_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url: string
          is_cover?: boolean | null
          sort_order?: number | null
          thumbnail_url: string
          title?: string | null
        }
        Update: {
          artist_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string
          is_cover?: boolean | null
          sort_order?: number | null
          thumbnail_url?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_photos_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_views: {
        Row: {
          artist_id: string | null
          id: string
          viewed_at: string | null
          viewer_ip_hash: string
        }
        Insert: {
          artist_id?: string | null
          id?: string
          viewed_at?: string | null
          viewer_ip_hash: string
        }
        Update: {
          artist_id?: string | null
          id?: string
          viewed_at?: string | null
          viewer_ip_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_views_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          artist_id: string | null
          created_at: string | null
          id: string
          is_flagged: boolean | null
          rating: number | null
          review_text: string | null
          reviewer_id: string | null
        }
        Insert: {
          artist_id?: string | null
          created_at?: string | null
          id?: string
          is_flagged?: boolean | null
          rating?: number | null
          review_text?: string | null
          reviewer_id?: string | null
        }
        Update: {
          artist_id?: string | null
          created_at?: string | null
          id?: string
          is_flagged?: boolean | null
          rating?: number | null
          review_text?: string | null
          reviewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artist_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      specialties: {
        Row: {
          artist_id: string | null
          id: string
          specialty: string | null
        }
        Insert: {
          artist_id?: string | null
          id?: string
          specialty?: string | null
        }
        Update: {
          artist_id?: string | null
          id?: string
          specialty?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "specialties_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          account_type: string | null
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          email: string
          id: string
        }
        Insert: {
          account_type?: string | null
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email: string
          id: string
        }
        Update: {
          account_type?: string | null
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
