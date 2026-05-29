/**
 * Auto-generated Supabase database types.
 *
 * Regenerate this file whenever you run a new migration:
 *   npx supabase gen types typescript --project-id <YOUR_PROJECT_ID> > src/types/database.ts
 *
 * Do NOT manually edit this file.
 */

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
      users: {
        Row: {
          id: string;
          name: string | null;
          email: string | null;
          email_verified: string | null;
          image: string | null;
        };
        Insert: {
          id?: string;
          name?: string | null;
          email?: string | null;
          email_verified?: string | null;
          image?: string | null;
        };
        Update: {
          id?: string;
          name?: string | null;
          email?: string | null;
          email_verified?: string | null;
          image?: string | null;
        };
      };
      accounts: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          provider: string;
          provider_account_id: string;
          refresh_token: string | null;
          access_token: string | null;
          expires_at: number | null;
          token_type: string | null;
          scope: string | null;
          id_token: string | null;
          session_state: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          provider: string;
          provider_account_id: string;
          refresh_token?: string | null;
          access_token?: string | null;
          expires_at?: number | null;
          token_type?: string | null;
          scope?: string | null;
          id_token?: string | null;
          session_state?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          provider?: string;
          provider_account_id?: string;
          refresh_token?: string | null;
          access_token?: string | null;
          expires_at?: number | null;
          token_type?: string | null;
          scope?: string | null;
          id_token?: string | null;
          session_state?: string | null;
        };
      };
      sessions: {
        Row: {
          id: string;
          user_id: string;
          session_token: string;
          expires: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_token: string;
          expires: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_token?: string;
          expires?: string;
        };
      };
      verification_tokens: {
        Row: {
          identifier: string;
          token: string;
          expires: string;
        };
        Insert: {
          identifier: string;
          token: string;
          expires: string;
        };
        Update: {
          identifier?: string;
          token?: string;
          expires?: string;
        };
      };
      wallets: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          balance: number;
          currency: string;
          icon: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          balance?: number;
          currency?: string;
          icon?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          balance?: number;
          currency?: string;
          icon?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          wallet_id: string;
          user_id: string;
          type: 'income' | 'expense';
          amount: number;
          category: string;
          note: string | null;
          date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          wallet_id: string;
          user_id: string;
          type: 'income' | 'expense';
          amount: number;
          category: string;
          note?: string | null;
          date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          wallet_id?: string;
          user_id?: string;
          type?: 'income' | 'expense';
          amount?: number;
          category?: string;
          note?: string | null;
          date?: string;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_wallet_balances: {
        Args: { p_user_id: string };
        Returns: {
          wallet_id: string;
          wallet_name: string;
          balance: number;
        }[];
      };
    };
    Enums: {
      transaction_type: 'income' | 'expense';
    };
  };
}
