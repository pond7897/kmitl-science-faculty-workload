import { getAuthSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { ProfileContent } from '@/components/profile/ProfileContent';

export default async function ProfilePage() {
  const session = await getAuthSession();

  if (!session) {
    redirect('/');
  }

  const { profile, userinfo } = session;

  return (
    <ProfileContent
      data={{
        firstname_th: profile?.data.firstname_th,
        lastname_th: profile?.data.lastname_th,
        firstname_en: profile?.data.firstname_en,
        lastname_en: profile?.data.lastname_en,
        position_en: profile?.data.position_en,
        email: userinfo?.data.email,
      }}
      rawSession={{ profile, userinfo }}
    />
  );
}
