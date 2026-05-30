import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import type { JWT } from 'next-auth/jwt';
import type { Session, User } from 'next-auth';

/**
 * Server-only Supabase admin client.
 * Uses the service role key — never exposed to the browser.
 */
function getServiceSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  /**
   * @auth/supabase-adapter writes OAuth user/account data to Supabase.
   * The adapter is still used for Google account creation and linking
   * even though the session strategy is 'jwt'.
   */
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  }),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      /**
       * Force Google to always show the Account Chooser screen so users
       * can freely switch between multiple Google accounts after logout.
       * Using URL string format for maximum compatibility with Auth.js v5 beta.
       */
      authorization:
        "https://accounts.google.com/o/oauth2/v2/auth?prompt=select_account&access_type=offline",
      /**
       * Allows a user who registered via Email/Password to later sign in
       * with Google (same email), linking both methods to one account.
       */
      allowDangerousEmailAccountLinking: true,
    }),

    Credentials({
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      /**
       * Verifies the supplied credentials against the Supabase `users` table
       * and the `user_credentials` table that stores bcrypt password hashes.
       * Returns the User object on success, or null on failure.
       */
      async authorize(credentials): Promise<User | null> {
        if (
          typeof credentials?.email !== 'string' ||
          typeof credentials?.password !== 'string'
        ) {
          return null;
        }

        const supabase = getServiceSupabase();

        // 1. Look up the user by email in the NextAuth users table.
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('id, email, name, image')
          .eq('email', credentials.email)
          .maybeSingle();

        if (userError !== null || user === null) return null;

        // 2. Retrieve the hashed password from the separate credentials table.
        const { data: cred, error: credError } = await supabase
          .from('user_credentials')
          .select('password_hash')
          .eq('user_id', user.id)
          .maybeSingle();

        if (credError !== null || cred === null) return null;

        // 3. Compare the supplied password against the stored hash.
        const isValid = await bcrypt.compare(credentials.password, cred.password_hash);
        if (!isValid) return null;

        return {
          id: user.id as string,
          email: user.email as string,
          name: (user.name ?? null) as string | null,
          image: (user.image ?? null) as string | null,
        };
      },
    }),
  ],

  session: {
    /**
     * JWT strategy is required when mixing CredentialsProvider with a database
     * adapter. The adapter is still used for OAuth account/user creation.
     * Session tokens are signed HttpOnly cookies — not localStorage.
     */
    strategy: 'jwt',
  },

  callbacks: {
    /**
     * Embed the user's database UUID into the JWT on first sign-in so every
     * subsequent request can resolve the user ID without a DB lookup.
     */
    async jwt({ token, user }: { token: JWT; user?: User }): Promise<JWT> {
      if (user?.id !== undefined) {
        token.id = user.id;
      }
      return token;
    },

    /**
     * Expose the user ID (from the JWT) on the session object so that
     * Server Components and Client Components can access it via useSession().
     */
    async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
      if (token.id !== undefined && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  pages: {
    /** All auth flows redirect to the root login/signup page. */
    signIn: '/',
  },

  /**
   * Explicit secret for signing JWTs and encrypting cookies.
   * Auth.js v5 looks for AUTH_SECRET by default, but we also
   * fall back to NEXTAUTH_SECRET for local-dev compatibility.
   */
  secret: (process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET) as string,
});
