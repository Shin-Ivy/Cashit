import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * CashIt Auth Middleware
 *
 * - Unauthenticated requests to protected routes → redirect to /
 * - Authenticated requests to / (login page) → redirect to /dashboard
 * - All /api/auth/* routes are always public (NextAuth internals)
 */
export default auth(function middleware(req: NextRequest & { auth: { user?: { id: string } } | null }) {
  const { pathname } = req.nextUrl;
  const isAuthenticated = Boolean(req.auth?.user?.id);

  // Always allow NextAuth internals
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Redirect authenticated users away from the login page
  if (pathname === '/' && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Protect all /dashboard routes
  if (pathname.startsWith('/dashboard') && !isAuthenticated) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
});

export const config = {
  /**
   * Match all routes except static assets, _next internals, and favicon.
   * NextAuth /api/auth/* is also excluded from heavy processing above.
   */
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
