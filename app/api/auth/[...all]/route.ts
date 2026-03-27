import { auth } from '@/lib/auth/auth';
import { toNextJsHandler } from 'better-auth/next-js';

const handler = toNextJsHandler(auth);

function fixRequest(req: Request): Request {
  const proto = req.headers.get('x-forwarded-proto') || 'https';
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || '9pm.website';
  const url = new URL(req.url);
  const fixedUrl = `${proto}://${host}${url.pathname}${url.search}`;

  const isSignIn = url.pathname.includes('/sign-in');
  let headers = new Headers(req.headers);
  
  if (isSignIn) {
    const cookies = req.headers.get('cookie') || '';
    const filteredCookies = cookies
      .split(';')
      .map(c => c.trim())
      .filter(c => !c.startsWith('__Secure-better-auth.session_token=') && 
                   !c.startsWith('better-auth.session_token=') &&
                   !c.startsWith('better_auth.session_token='))
      .join('; ');
    
    if (filteredCookies) {
      headers.set('cookie', filteredCookies);
    } else {
      headers.delete('cookie');
    }
  }

  return new Request(fixedUrl, {
    method: req.method,
    headers,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    duplex: 'half',
  } as RequestInit);
}

export async function POST(req: Request) {
  const fixed = fixRequest(req);
  const res = await handler.POST(fixed);
  return res;
}

export async function GET(req: Request) {
  const fixed = fixRequest(req);
  return handler.GET(fixed);
}