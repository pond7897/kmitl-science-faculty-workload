import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './lib/i18n/routing';

// Create next-intl middleware
const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get access token from cookies
  const accessToken = request.cookies.get('access_token');
  
  // Protected routes that require authentication
  const isProtectedRoute = pathname.includes('/profile');
  
  // If accessing protected route without token, redirect to home
  if (isProtectedRoute && !accessToken) {
    const url = new URL('/', request.url);
    return NextResponse.redirect(url);
  }
  
  // Apply next-intl middleware for internationalization
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - API routes
  // - Auth callback route
  // - Static files (_next/static)
  // - Image optimization files (_next/image)
  // - Favicon
  matcher: ['/((?!api|auth|_next/static|_next/image|favicon.ico).*)']
};
