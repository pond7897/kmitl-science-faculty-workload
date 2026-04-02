'use client';

import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/use-language';
import { Building2, BookOpen } from 'lucide-react';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import type { UserProfile, UserInfo } from '@/lib/types/auth';

const roleLabels: Record<string, { en: string; th: string }> = {
  student: { en: 'Student', th: 'นักศึกษา' },
  faculty: { en: 'Faculty Member', th: 'อาจารย์' },
  staff: { en: 'Staff', th: 'เจ้าหน้าที่' },
  admin: { en: 'Administrator', th: 'ผู้ดูแลระบบ' },
};

interface ProfileHeroCardProps {
  profile: UserProfile;
  userinfo: UserInfo;
}

export function ProfileHeroCard({ profile, userinfo }: ProfileHeroCardProps) {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  const isTh = currentLanguage === 'th';

  const fullName = isTh
    ? `${profile.data.title ?? ''}${profile.data.spacial_title ?? ''}${profile.data.firstname_th ?? ''} ${profile.data.lastname_th ?? ''}`.trim()
    : `${profile.data.spacial_title ?? ''}${profile.data.firstname_en ?? ''} ${profile.data.lastname_en ?? ''}`.trim();

  const academicTitle = isTh
    ? (profile.data.position_th ?? profile.data.position_en ?? roleLabels[userinfo.data.role?.toLowerCase() ?? '']?.th ?? '')
    : (profile.data.position_en ?? profile.data.position_th ?? roleLabels[userinfo.data.role?.toLowerCase() ?? '']?.en ?? '');

  const facultyName = t('Profile.facultyName');
  const departmentName = isTh
    ? (profile.data.department?.name_th ?? '')
    : (profile.data.department?.name_en ?? '');

  const avatarSrc = userinfo.data.avatar ?? profile.data.avatar_url ?? null;
  // ใช้ชื่อจริง (ไม่มีคำนำหน้า) เป็น initial ของ avatar
  const avatarName = isTh
    ? (profile.data.firstname_th ?? fullName)
    : (profile.data.firstname_en ?? fullName);

  return (
    <div className="bg-white dark:bg-[#292524] rounded-2xl border border-gray-100 dark:border-[#4a4441] shadow-sm p-4 sm:p-8">
      <div className="flex flex-row items-center gap-4 sm:gap-6">
        {/* Avatar — sm ตอน mobile, ขยายบน desktop */}
        <ProfileAvatar src={avatarSrc} name={avatarName} size="sm" className="sm:w-28! sm:h-28! [&>span]:sm:text-5xl" />

        {/* Name block */}
        <div className="flex flex-col items-start gap-1 sm:gap-1.5 min-w-0">
          {/* Full name */}
          <h2 className="text-lg sm:text-3xl font-bold text-gray-900 dark:text-[#f0ebe5] leading-tight">
            {fullName || '—'}
          </h2>

          {/* Academic title (orange, like Figma) */}
          {academicTitle && (
            <p className="text-xs sm:text-lg font-semibold text-[#F27F0D] dark:text-[#C96442]">
              {academicTitle}
            </p>
          )}

          {/* Faculty + Department chips */}
          <div className="flex flex-wrap gap-x-3 sm:gap-x-4 gap-y-1 mt-0.5 sm:mt-1">
            {facultyName && (
              <span className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 dark:text-[#8b7f77]">
                <Building2 className="w-3 h-3 sm:w-4 sm:h-4 shrink-0 text-gray-400 dark:text-[#8b7f77]" />
                {facultyName}
              </span>
            )}
            {departmentName && (
              <span className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 dark:text-[#8b7f77]">
                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 shrink-0 text-gray-400 dark:text-[#8b7f77]" />
                {departmentName}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
