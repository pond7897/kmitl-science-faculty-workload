import { auth } from '@/lib/auth/auth';
import { NextResponse } from 'next/server';

async function handleSignOut(request: Request) {
  try {
    // Call Better Auth sign out
    const response = await auth.api.signOut({
      headers: request.headers,
    });

    if (!response?.success) {
      return NextResponse.json(
        { error: 'Failed to sign out' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.BETTER_AUTH_URL || new URL(request.url).origin;
    return NextResponse.redirect(new URL('/', baseUrl), { status: 302 });
  } catch (error) {
    console.error('[signOut] Error:', error);
    return NextResponse.json(
      { error: 'Failed to sign out' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  return handleSignOut(request);
}

export async function POST(request: Request) {
  return handleSignOut(request);
}