import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

/**
 * Server-side Supabase client.
 *
 * Uses the SERVICE ROLE key — must only be called from:
 *   - React Server Components
 *   - Next.js Route Handlers
 *   - Server Actions
 *
 * NEVER import this in a Client Component.
 */
export function createServerClient(): ReturnType<typeof createClient<Database>> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env variables.',
    );
  }

  return createClient<Database>(url, key, {
    auth: {
      // Disable automatic session persistence — sessions are managed by NextAuth.
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
