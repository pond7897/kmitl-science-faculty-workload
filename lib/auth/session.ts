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

const roleLabels: Record<string, { en: string; th: string }> = {
  student: { en: 'Student', th: 'นักศึกษา' },
  faculty: { en: 'Faculty Member', th: 'อาจารย์' },
  staff: { en: 'Staff', th: 'เจ้าหน้าที่' },
  admin: { en: 'Administrator', th: 'ผู้ดูแลระบบ' },
};

/**
 * Get a simplified AppUser object for use in UI components.
 */
export async function getAppUser(): Promise<AppUser | null> {
  const session = await getAuthSession();
  if (!session) return null;

  const { profile, userinfo } = session;

  const firstnameEn = profile?.data.firstname_en || '';
  const lastnameEn = profile?.data.lastname_en || '';
  const firstnameTh = profile?.data.firstname_th || '';
  const lastnameTh = profile?.data.lastname_th || '';

  const roleKey = userinfo?.data.role?.toLowerCase() || '';
  const roleEn =
    profile?.data.position_en ||
    roleLabels[roleKey]?.en ||
    'Faculty Member';
  const roleTh =
    profile?.data.position_th ||
    roleLabels[roleKey]?.th ||
    'อาจารย์';

  return {
    name_en: `${firstnameEn} ${lastnameEn}`.trim() || 'User',
    name_th: `${firstnameTh} ${lastnameTh}`.trim() || 'ผู้ใช้',
    role_en: roleEn,
    role_th: roleTh,
    avatar: userinfo?.data.avatar ?? profile?.data.avatar_url,
  };
}

/**
 * Check whether the user is authenticated (access_token cookie is present).
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return !!cookieStore.get('access_token')?.value;
}
