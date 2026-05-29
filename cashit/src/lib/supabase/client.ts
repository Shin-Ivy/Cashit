import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

/**
 * Browser-safe Supabase client.
 *
 * Uses the ANON (public) key — safe for use in Client Components and custom hooks.
 * Row-Level Security policies on Supabase protect all data access.
 */
export function createBrowserClient(): ReturnType<typeof createClient<Database>> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY env variables.',
    );
  }

  return createClient<Database>(url, key);
}
