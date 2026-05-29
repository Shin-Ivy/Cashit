/**
 * NextAuth v5 (Auth.js) — TypeScript module augmentation.
 *
 * Extends the built-in `Session` and `User` interfaces so that
 * `session.user.id` is available and strongly typed everywhere
 * `useSession()`, `auth()`, or `getServerSession()` are used.
 *
 * This file MUST be a `.d.ts` declaration file so that TypeScript
 * merges it with the original next-auth types without re-importing.
 */

import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Extends the Session object returned by `useSession()` and `auth()`.
   * The `id` field is populated by the `session` callback in `lib/auth.ts`.
   */
  interface Session {
    user: {
      /** The user's UUID from the `next_auth.users` table in Supabase. */
      id: string;
    } & DefaultSession['user'];
  }
}
