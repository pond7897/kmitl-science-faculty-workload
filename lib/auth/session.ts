import { cookies } from 'next/headers';
import { prisma } from '@/lib/auth/auth';
import type { AuthSession, AppUser } from '@/lib/types/auth';

export async function getAuthSession(): Promise<AuthSession | null> {
  try {
    const cookieStore = await cookies();

    let sessionToken =
      cookieStore.get('better_auth.session_token')?.value ||
      cookieStore.get('better-auth.session_token')?.value ||
      cookieStore.get('__Secure-better_auth.session_token')?.value ||
      cookieStore.get('__Secure-better-auth.session_token')?.value ||
      cookieStore.get('sessionToken')?.value;

    if (!sessionToken) {
      return null;
    }

    if (sessionToken.includes('.')) {
      const [sessionId] = sessionToken.split('.');

      sessionToken = sessionId;
    }

    // Query the database for the session and user data
    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
      include: {
        user: true,
      },
    });

    if (!session) {
      return null;
    }

    // Check if session has expired
    if (new Date(session.expiresAt) < new Date()) {
      return null;
    }

    return {
      profile: {
        data: {
          firstname_en: session.user.firstname_en || session.user.name || '',
          lastname_en: session.user.lastname_en || '',
          firstname_th: session.user.firstname_th || session.user.name || '',
          lastname_th: session.user.lastname_th || '',
          position_en: 'Faculty Member',
          avatar_url: session.user.image || '',
        },
      },
    } as AuthSession;
  } catch (error) {
    return null;
  }
}

/**
 * Get a simplified AppUser object for use in UI components.
 */
export async function getAppUser(): Promise<AppUser | null> {
  const session = await getAuthSession();
  if (!session) return null;

  const { profile } = session;
  return {
    name: `${profile?.data.firstname_en || 'User'} ${profile?.data.lastname_en || ''}`.trim(),
    role: profile?.data.position_en || 'Faculty Member',
    avatar: profile?.data.avatar_url,
  };
}

/**
 * Check whether the user is authenticated (session exists and is valid).
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();

    let sessionToken =
      cookieStore.get('better_auth.session_token')?.value ||
      cookieStore.get('better-auth.session_token')?.value ||
      cookieStore.get('sessionToken')?.value;

    if (!sessionToken) {
      return false;
    }

    // Extract session ID from signed token (format: sessionId.signature)
    if (sessionToken.includes('.')) {
      const [sessionId] = sessionToken.split('.');
      sessionToken = sessionId;
    }

    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
    });

    if (!session) {
      return false;
    }

    // Check if session has expired
    if (new Date(session.expiresAt) < new Date()) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('[isAuthenticated] Error:', error);
    return false;
  }
}
