import { handlers } from '@/lib/auth';

/**
 * Next.js App Router route handler for NextAuth v5.
 * Catches all /api/auth/* requests (signIn, signOut, callback, session …).
 */
export const { GET, POST } = handlers;
