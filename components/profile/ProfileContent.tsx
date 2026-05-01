'use client';

import { useLanguage } from '@/hooks/use-language';
import { ProfileHeroCard } from '@/components/profile/ProfileHeroCard';
import { ProfileInfoCard } from '@/components/profile/ProfileInfoCard';
import { formatPositionLabel } from '@/lib/positions';
import type { UserProfile, UserInfo } from '@/lib/types/auth';

interface ProfileContentProps {
  data: {
    firstname_th?: string;
    lastname_th?: string;
    firstname_en?: string;
    lastname_en?: string;
    position?: string | null;
    email?: string;
  };
  rawSession?: {
    profile?: UserProfile;
    userinfo?: UserInfo;
  };
}

export function ProfileContent({ data, rawSession }: ProfileContentProps) {
  const { currentLanguage } = useLanguage();

  // Build a normalised profile object so sub-components receive typed data.
  const profile: UserProfile = rawSession?.profile ?? {
    data: {
      firstname_en: data.firstname_en ?? '',
      lastname_en: data.lastname_en ?? '',
      firstname_th: data.firstname_th ?? '',
      lastname_th: data.lastname_th ?? '',
      position: data.position,
    },
  };

  const userinfo: UserInfo = rawSession?.userinfo ?? {
    data: { email: data.email ?? '' },
  };

  const isTh = currentLanguage === 'th';

  // ── Personal-info fields ──────────────────────────────────────────────────
  const positionValue = formatPositionLabel(profile.data.position, isTh ? 'th' : 'en');

  const employeeId = userinfo.data.id as string | undefined;

  const infoFields = [
    { labelKey: 'Profile.position', value: positionValue },
    { labelKey: 'Profile.employeeId', value: employeeId },
    { labelKey: 'Profile.email', value: userinfo.data.email },
    { labelKey: 'Profile.phone', value: undefined }, // phone not in API yet
  ];

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* ── Hero: avatar · name · title · faculty / dept ── */}
      <ProfileHeroCard profile={profile} userinfo={userinfo} />

      {/* ── Personal information fields ── */}
      <ProfileInfoCard fields={infoFields} />

      {/* ── Raw JSON (dev only) ── */}
      {process.env.NODE_ENV === 'development' && rawSession && (
        <details className="bg-white dark:bg-[#292524] rounded-2xl shadow-sm border border-gray-100 dark:border-[#4a4441] p-4 sm:p-6">
          <summary className="text-sm font-medium text-gray-500 cursor-pointer select-none">
            Raw session data (dev only)
          </summary>
          <pre className="mt-3 bg-gray-50 dark:bg-[#302826] p-3 rounded-lg overflow-auto text-xs text-gray-700 dark:text-[#e8e0d8] leading-relaxed">
            {JSON.stringify(rawSession, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
