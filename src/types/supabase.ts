export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          is_premium: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          is_premium?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          is_premium?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string;
          icon: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color?: string;
          icon?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          color?: string;
          icon?: string;
          created_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          category_id: string | null;
          title: string;
          description: string | null;
          is_completed: boolean;
          priority: 'low' | 'medium' | 'high';
          due_date: string | null;
          reminder_at: string | null;
          tags: string[];
          created_at: string;
          updated_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id?: string | null;
          title: string;
          description?: string | null;
          is_completed?: boolean;
          priority?: 'low' | 'medium' | 'high';
          due_date?: string | null;
          reminder_at?: string | null;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          category_id?: string | null;
          title?: string;
          description?: string | null;
          is_completed?: boolean;
          priority?: 'low' | 'medium' | 'high';
          due_date?: string | null;
          reminder_at?: string | null;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// Convenience types
export type Profile = Tables<'profiles'>;
export type Category = Tables<'categories'>;
export type Task = Tables<'tasks'>;
