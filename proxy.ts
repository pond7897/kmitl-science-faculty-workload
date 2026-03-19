import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * RBAC roles supported by the app.
 * Keep values in sync with whatever the backend issues into the NextAuth JWT.
 */
type AppRole = 'faculty' | 'head-of-dept' | 'admin';

function normalizeRole(raw: unknown): AppRole | null {
  if (typeof raw !== 'string') return null;
  const v = raw.trim().toLowerCase();
  if (v === 'faculty' || v === 'head-of-dept' || v === 'admin') return v;
  return null;
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /**
   * Dashboard protection (NextAuth JWT)
   */
  if (pathname.startsWith('/dashboard')) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Not logged in -> /login
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = normalizeRole((token as { role?: unknown }).role);

    // Missing/unknown role -> unauthorized
    if (!role) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // RBAC: /dashboard/admin/* only for admin
    if (pathname.startsWith('/dashboard/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    return NextResponse.next();
  }

  /**
   * Existing protected routes that require authentication (cookie-based)
   */
  const accessToken = request.cookies.get('access_token');
  const isProtectedRoute = pathname.includes('/profile');

  // If accessing protected route without token, redirect to login
  if (isProtectedRoute && !accessToken) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|auth|_next/static|_next/image|favicon.ico|images).*)'],
};
