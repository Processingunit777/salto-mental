import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_data: {
        Row: {
          id: string;
          user_id: string;
          saved_money: number;
          days_clean: number;
          mood: number;
          daily_savings: number;
          last_savings_click: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          saved_money?: number;
          days_clean?: number;
          mood?: number;
          daily_savings?: number;
          last_savings_click?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          saved_money?: number;
          days_clean?: number;
          mood?: number;
          daily_savings?: number;
          last_savings_click?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          icon: string;
          target_amount: number;
          current_amount: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          icon: string;
          target_amount: number;
          current_amount?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          icon?: string;
          target_amount?: number;
          current_amount?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
