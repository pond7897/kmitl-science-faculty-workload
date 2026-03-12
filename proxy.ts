import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|auth|_next/static|_next/image|favicon.ico|images).*)']
};
