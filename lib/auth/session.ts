import { cookies } from 'next/headers';
import type { AuthSession, AppUser } from '@/lib/types/auth';

/**
 * Get the raw auth session (profile + userinfo) from the httpOnly cookie.
 * Returns null if the cookie is missing or invalid.
 */
export async function getAuthSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get('user_info')?.value;
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
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
 * Check whether the user is authenticated (access_token cookie is present).
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return !!cookieStore.get('access_token')?.value;
}
