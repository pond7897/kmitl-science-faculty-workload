import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for session cookie using Better Auth cookie names
  let sessionToken = 
    request.cookies.get('better_auth.session_token')?.value ||
    request.cookies.get('better-auth.session_token')?.value ||
    request.cookies.get('sessionToken')?.value;

  if (pathname.startsWith('/dashboard') || pathname.includes('/profile')) {
    if (!sessionToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Extract session ID from signed token (format: sessionId.signature)
    if (sessionToken.includes('.')) {
      const [sessionId] = sessionToken.split('.');
      sessionToken = sessionId;
    }
    
    // Optionally: verify session is not expired by querying DB
    // For now, just having the token is enough for proxy
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|auth|_next/static|_next/image|favicon.ico|images).*)'],
};
