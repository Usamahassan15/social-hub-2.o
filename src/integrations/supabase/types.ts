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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      content_violations: {
        Row: {
          ai_confidence: number | null
          content_preview: string | null
          content_type: string
          created_at: string
          id: string
          status: Database["public"]["Enums"]["violation_status"]
          user_id: string
          violation_type: Database["public"]["Enums"]["violation_type"]
          warning_number: number
        }
        Insert: {
          ai_confidence?: number | null
          content_preview?: string | null
          content_type: string
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["violation_status"]
          user_id: string
          violation_type: Database["public"]["Enums"]["violation_type"]
          warning_number?: number
        }
        Update: {
          ai_confidence?: number | null
          content_preview?: string | null
          content_type?: string
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["violation_status"]
          user_id?: string
          violation_type?: Database["public"]["Enums"]["violation_type"]
          warning_number?: number
        }
        Relationships: []
      }
      spam_tracking: {
        Row: {
          action_type: string
          content_hash: string | null
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          action_type: string
          content_hash?: string | null
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          action_type?: string
          content_hash?: string | null
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_bans: {
        Row: {
          ban_duration_hours: number
          ban_status: Database["public"]["Enums"]["ban_status"]
          created_at: string
          ends_at: string
          id: string
          reason: string
          starts_at: string
          user_id: string
          violation_id: string | null
        }
        Insert: {
          ban_duration_hours: number
          ban_status?: Database["public"]["Enums"]["ban_status"]
          created_at?: string
          ends_at: string
          id?: string
          reason: string
          starts_at?: string
          user_id: string
          violation_id?: string | null
        }
        Update: {
          ban_duration_hours?: number
          ban_status?: Database["public"]["Enums"]["ban_status"]
          created_at?: string
          ends_at?: string
          id?: string
          reason?: string
          starts_at?: string
          user_id?: string
          violation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_bans_violation_id_fkey"
            columns: ["violation_id"]
            isOneToOne: false
            referencedRelation: "content_violations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_moderation_stats: {
        Row: {
          created_at: string
          current_ban_ends_at: string | null
          id: string
          is_currently_banned: boolean
          total_violations: number
          total_warnings: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_ban_ends_at?: string | null
          id?: string
          is_currently_banned?: boolean
          total_violations?: number
          total_warnings?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_ban_ends_at?: string | null
          id?: string
          is_currently_banned?: boolean
          total_violations?: number
          total_warnings?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_reports: {
        Row: {
          admin_notes: string | null
          created_at: string
          description: string | null
          evidence_url: string | null
          id: string
          report_reason: Database["public"]["Enums"]["report_reason"]
          reported_content_id: string | null
          reported_user_id: string | null
          reporter_id: string
          status: Database["public"]["Enums"]["report_status"]
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          description?: string | null
          evidence_url?: string | null
          id?: string
          report_reason: Database["public"]["Enums"]["report_reason"]
          reported_content_id?: string | null
          reported_user_id?: string | null
          reporter_id: string
          status?: Database["public"]["Enums"]["report_status"]
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          description?: string | null
          evidence_url?: string | null
          id?: string
          report_reason?: Database["public"]["Enums"]["report_reason"]
          reported_content_id?: string | null
          reported_user_id?: string | null
          reporter_id?: string
          status?: Database["public"]["Enums"]["report_status"]
          updated_at?: string
        }
        Relationships: []
      }
      user_trust_scores: {
        Row: {
          account_age_days: number
          created_at: string
          id: string
          is_restricted: boolean
          negative_interactions: number
          positive_interactions: number
          restriction_reason: string | null
          spam_score: number
          trust_score: number
          updated_at: string
          user_id: string
          verified_email: boolean
          verified_phone: boolean
        }
        Insert: {
          account_age_days?: number
          created_at?: string
          id?: string
          is_restricted?: boolean
          negative_interactions?: number
          positive_interactions?: number
          restriction_reason?: string | null
          spam_score?: number
          trust_score?: number
          updated_at?: string
          user_id: string
          verified_email?: boolean
          verified_phone?: boolean
        }
        Update: {
          account_age_days?: number
          created_at?: string
          id?: string
          is_restricted?: boolean
          negative_interactions?: number
          positive_interactions?: number
          restriction_reason?: string | null
          spam_score?: number
          trust_score?: number
          updated_at?: string
          user_id?: string
          verified_email?: boolean
          verified_phone?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_trust_score: {
        Args: { check_user_id: string }
        Returns: number
      }
      check_spam_rate: {
        Args: { action: string; check_user_id: string; minutes?: number }
        Returns: number
      }
      get_user_violation_count: {
        Args: { check_user_id: string }
        Returns: number
      }
      is_user_banned: { Args: { check_user_id: string }; Returns: boolean }
    }
    Enums: {
      ban_status: "active" | "expired" | "lifted"
      report_reason:
        | "spam"
        | "harassment"
        | "scam"
        | "adult_content"
        | "fake_account"
        | "hate_speech"
        | "violence"
        | "copyright"
        | "other"
      report_status: "pending" | "reviewed" | "resolved" | "dismissed"
      violation_status: "pending" | "confirmed" | "dismissed"
      violation_type:
        | "nudity"
        | "sexual_content"
        | "explicit_text"
        | "pornographic"
        | "adult_services"
        | "vulgar_content"
        | "violence"
        | "other"
        | "scam"
        | "phishing"
        | "hate_speech"
        | "harassment"
        | "spam"
        | "unsafe_link"
        | "bot_activity"
        | "copyright"
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
      ban_status: ["active", "expired", "lifted"],
      report_reason: [
        "spam",
        "harassment",
        "scam",
        "adult_content",
        "fake_account",
        "hate_speech",
        "violence",
        "copyright",
        "other",
      ],
      report_status: ["pending", "reviewed", "resolved", "dismissed"],
      violation_status: ["pending", "confirmed", "dismissed"],
      violation_type: [
        "nudity",
        "sexual_content",
        "explicit_text",
        "pornographic",
        "adult_services",
        "vulgar_content",
        "violence",
        "other",
        "scam",
        "phishing",
        "hate_speech",
        "harassment",
        "spam",
        "unsafe_link",
        "bot_activity",
        "copyright",
      ],
    },
  },
} as const
