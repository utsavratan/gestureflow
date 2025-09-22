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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievement_shares: {
        Row: {
          created_at: string
          id: string
          message: string | null
          shared_by: string
          shared_with: string | null
          user_achievement_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          shared_by: string
          shared_with?: string | null
          user_achievement_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          shared_by?: string
          shared_with?: string | null
          user_achievement_id?: string
        }
        Relationships: []
      }
      achievements: {
        Row: {
          achievement_type: Database["public"]["Enums"]["achievement_type"]
          created_at: string
          criteria: Json
          description: string
          icon_url: string | null
          id: string
          is_active: boolean | null
          name: string
          points: number | null
          rarity: string | null
        }
        Insert: {
          achievement_type: Database["public"]["Enums"]["achievement_type"]
          created_at?: string
          criteria: Json
          description: string
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          points?: number | null
          rarity?: string | null
        }
        Update: {
          achievement_type?: Database["public"]["Enums"]["achievement_type"]
          created_at?: string
          criteria?: Json
          description?: string
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          points?: number | null
          rarity?: string | null
        }
        Relationships: []
      }
      daily_challenges: {
        Row: {
          challenge_data: Json
          challenge_type: Database["public"]["Enums"]["challenge_type"]
          created_at: string
          description: string
          difficulty: Database["public"]["Enums"]["skill_level"]
          end_date: string
          id: string
          is_active: boolean | null
          points_reward: number | null
          start_date: string
          title: string
        }
        Insert: {
          challenge_data: Json
          challenge_type: Database["public"]["Enums"]["challenge_type"]
          created_at?: string
          description: string
          difficulty: Database["public"]["Enums"]["skill_level"]
          end_date: string
          id?: string
          is_active?: boolean | null
          points_reward?: number | null
          start_date: string
          title: string
        }
        Update: {
          challenge_data?: Json
          challenge_type?: Database["public"]["Enums"]["challenge_type"]
          created_at?: string
          description?: string
          difficulty?: Database["public"]["Enums"]["skill_level"]
          end_date?: string
          id?: string
          is_active?: boolean | null
          points_reward?: number | null
          start_date?: string
          title?: string
        }
        Relationships: []
      }
      friendships: {
        Row: {
          created_at: string
          friend_id: string
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          friend_id: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          friend_id?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      leaderboards: {
        Row: {
          accuracy_average: number | null
          id: string
          monthly_points: number | null
          practice_streak: number | null
          total_lessons_completed: number | null
          total_points: number | null
          updated_at: string
          user_id: string
          weekly_points: number | null
        }
        Insert: {
          accuracy_average?: number | null
          id?: string
          monthly_points?: number | null
          practice_streak?: number | null
          total_lessons_completed?: number | null
          total_points?: number | null
          updated_at?: string
          user_id: string
          weekly_points?: number | null
        }
        Update: {
          accuracy_average?: number | null
          id?: string
          monthly_points?: number | null
          practice_streak?: number | null
          total_lessons_completed?: number | null
          total_points?: number | null
          updated_at?: string
          user_id?: string
          weekly_points?: number | null
        }
        Relationships: []
      }
      learning_paths: {
        Row: {
          completion_percentage: number | null
          created_at: string
          description: string | null
          estimated_duration: number | null
          id: string
          is_active: boolean | null
          name: string
          skill_level: Database["public"]["Enums"]["skill_level"]
          updated_at: string
          user_id: string
        }
        Insert: {
          completion_percentage?: number | null
          created_at?: string
          description?: string | null
          estimated_duration?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          skill_level: Database["public"]["Enums"]["skill_level"]
          updated_at?: string
          user_id: string
        }
        Update: {
          completion_percentage?: number | null
          created_at?: string
          description?: string | null
          estimated_duration?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          skill_level?: Database["public"]["Enums"]["skill_level"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          content: Json
          created_at: string
          description: string | null
          estimated_duration: number | null
          id: string
          is_published: boolean | null
          lesson_type: Database["public"]["Enums"]["lesson_type"]
          order_index: number
          prerequisites: Json | null
          skill_level: Database["public"]["Enums"]["skill_level"]
          title: string
          updated_at: string
        }
        Insert: {
          content: Json
          created_at?: string
          description?: string | null
          estimated_duration?: number | null
          id?: string
          is_published?: boolean | null
          lesson_type: Database["public"]["Enums"]["lesson_type"]
          order_index: number
          prerequisites?: Json | null
          skill_level: Database["public"]["Enums"]["skill_level"]
          title: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          description?: string | null
          estimated_duration?: number | null
          id?: string
          is_published?: boolean | null
          lesson_type?: Database["public"]["Enums"]["lesson_type"]
          order_index?: number
          prerequisites?: Json | null
          skill_level?: Database["public"]["Enums"]["skill_level"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          is_read: boolean
          message: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          message?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          message?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          parent_comment_id: string | null
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          achievement_data: Json | null
          content: string | null
          created_at: string
          id: string
          image_url: string | null
          post_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          achievement_data?: Json | null
          content?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          post_type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          achievement_data?: Json | null
          content?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          post_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      practice_sessions: {
        Row: {
          accuracy_score: number | null
          created_at: string
          duration: number
          feedback_data: Json | null
          id: string
          lesson_id: string | null
          mistakes_count: number | null
          session_data: Json | null
          session_type: string
          signs_attempted: number | null
          signs_correct: number | null
          user_id: string
        }
        Insert: {
          accuracy_score?: number | null
          created_at?: string
          duration: number
          feedback_data?: Json | null
          id?: string
          lesson_id?: string | null
          mistakes_count?: number | null
          session_data?: Json | null
          session_type: string
          signs_attempted?: number | null
          signs_correct?: number | null
          user_id: string
        }
        Update: {
          accuracy_score?: number | null
          created_at?: string
          duration?: number
          feedback_data?: Json | null
          id?: string
          lesson_id?: string | null
          mistakes_count?: number | null
          session_data?: Json | null
          session_type?: string
          signs_attempted?: number | null
          signs_correct?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "practice_sessions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          id: string
          progress_data: Json | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          id?: string
          progress_data?: Json | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          id?: string
          progress_data?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_challenge_progress: {
        Row: {
          challenge_id: string
          completed_at: string | null
          created_at: string
          id: string
          is_completed: boolean | null
          progress: number | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean | null
          progress?: number | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean | null
          progress?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_challenge_progress_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "daily_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_levels: {
        Row: {
          created_at: string
          current_level: number
          experience_points: number
          id: string
          total_experience: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_level?: number
          experience_points?: number
          id?: string
          total_experience?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_level?: number
          experience_points?: number
          id?: string
          total_experience?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          accessibility_settings: Json | null
          avatar_url: string | null
          created_at: string
          current_streak: number | null
          daily_goal: number | null
          display_name: string | null
          id: string
          preferred_learning_pace: string | null
          skill_level: Database["public"]["Enums"]["skill_level"] | null
          total_practice_time: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          accessibility_settings?: Json | null
          avatar_url?: string | null
          created_at?: string
          current_streak?: number | null
          daily_goal?: number | null
          display_name?: string | null
          id?: string
          preferred_learning_pace?: string | null
          skill_level?: Database["public"]["Enums"]["skill_level"] | null
          total_practice_time?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          accessibility_settings?: Json | null
          avatar_url?: string | null
          created_at?: string
          current_streak?: number | null
          daily_goal?: number | null
          display_name?: string | null
          id?: string
          preferred_learning_pace?: string | null
          skill_level?: Database["public"]["Enums"]["skill_level"] | null
          total_practice_time?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          accuracy_score: number | null
          completed_at: string | null
          completion_percentage: number | null
          created_at: string
          id: string
          is_completed: boolean | null
          last_practiced_at: string | null
          learning_path_id: string | null
          lesson_id: string
          time_spent: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          accuracy_score?: number | null
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string
          id?: string
          is_completed?: boolean | null
          last_practiced_at?: string | null
          learning_path_id?: string | null
          lesson_id: string
          time_spent?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          accuracy_score?: number | null
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string
          id?: string
          is_completed?: boolean | null
          last_practiced_at?: string | null
          learning_path_id?: string | null
          lesson_id?: string
          time_spent?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_learning_path_id_fkey"
            columns: ["learning_path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      level_up_user: {
        Args: { exp_gained: number; user_uuid: string }
        Returns: Json
      }
    }
    Enums: {
      achievement_type: "streak" | "accuracy" | "completion" | "social"
      challenge_type: "daily" | "weekly" | "special"
      lesson_type:
        | "alphabet"
        | "numbers"
        | "vocabulary"
        | "phrases"
        | "conversation"
      skill_level: "beginner" | "intermediate" | "advanced"
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
      achievement_type: ["streak", "accuracy", "completion", "social"],
      challenge_type: ["daily", "weekly", "special"],
      lesson_type: [
        "alphabet",
        "numbers",
        "vocabulary",
        "phrases",
        "conversation",
      ],
      skill_level: ["beginner", "intermediate", "advanced"],
    },
  },
} as const
