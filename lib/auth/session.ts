import { headers as nextHeaders } from 'next/headers';
import { auth } from '@/lib/auth/auth';
import type { AuthSession, AppUser } from '@/lib/types/auth';

export async function getAuthSession(): Promise<AuthSession | null> {
  try {
    const headers = await nextHeaders();
    const session = await auth.api.getSession({
      headers: headers,
    });

    if (!session) {
      return null;
    }

    const { user } = session;
    const userData = user as any;

    return {
      profile: {
        data: {
          firstname_en: userData.firstname_en || user.name || '',
          lastname_en: userData.lastname_en || '',
          firstname_th: userData.firstname_th || user.name || '',
          lastname_th: userData.lastname_th || '',
          position_en: 'Faculty Member',
          avatar_url: user.image || '',
        },
      },
      userinfo: {
        data: {
          id: user.id,
          email: user.email,
          avatar: user.image,
        },
      },
    } as AuthSession;
  } catch (error) {
    console.error('[getAuthSession] Error:', error);
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
  const session = await getAuthSession();
  return !!session;
}
