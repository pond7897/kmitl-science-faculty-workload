import { headers as nextHeaders } from 'next/headers';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/auth/prisma';
import { formatPositionLabel } from '@/lib/positions';
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
    const userData = user as typeof user & {
      firstname_en?: string | null;
      lastname_en?: string | null;
      firstname_th?: string | null;
      lastname_th?: string | null;
      role?: string | null;
    };

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        firstname_en: true,
        lastname_en: true,
        firstname_th: true,
        lastname_th: true,
        image: true,
        role: true,
        position: true,
        department: {
          select: {
            id: true,
            nameEn: true,
            nameTh: true,
          },
        },
      },
    });

    const role = dbUser?.role ?? userData.role ?? 'staff';

    return {
      profile: {
        data: {
          firstname_en: dbUser?.firstname_en || userData.firstname_en || user.name || '',
          lastname_en: dbUser?.lastname_en || userData.lastname_en || '',
          firstname_th: dbUser?.firstname_th || userData.firstname_th || user.name || '',
          lastname_th: dbUser?.lastname_th || userData.lastname_th || '',
          position: dbUser?.position ?? null,
          role,
          avatar_url: dbUser?.image || user.image || '',
          department: dbUser?.department
            ? {
                id: dbUser.department.id,
                name_en: dbUser.department.nameEn,
                name_th: dbUser.department.nameTh,
              }
            : undefined,
        },
      },
      userinfo: {
        data: {
          id: user.id,
          email: user.email,
          avatar: dbUser?.image || user.image,
          role,
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
    role: profile?.data.role || 'staff',
    avatar: profile?.data.avatar_url,
    position: formatPositionLabel(profile?.data.position, 'en') || 'Faculty Member',
  };
}

/**
 * Check whether the user is authenticated (session exists and is valid).
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getAuthSession();
  return !!session;
}
