import { createClient } from '@supabase/supabase-js';

// Supabase client for server-side use
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  }
});

// Types for our database
export interface Database {
  public: {
    Tables: {
      ideas: {
        Row: {
          id: string;
          user_id: string;
          raw_idea: string;
          refinement: any;
          product: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          raw_idea: string;
          refinement?: any;
          product?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          raw_idea?: string;
          refinement?: any;
          product?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      files: {
        Row: {
          id: string;
          idea_id: string;
          format: 'pdf' | 'docx';
          r2_key: string;
          download_url: string;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          idea_id: string;
          format: 'pdf' | 'docx';
          r2_key: string;
          download_url: string;
          expires_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          idea_id?: string;
          format?: 'pdf' | 'docx';
          r2_key?: string;
          download_url?: string;
          expires_at?: string;
          created_at?: string;
        };
      };
    };
  };
}