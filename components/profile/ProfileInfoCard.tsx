'use client';

import { useTranslation } from 'react-i18next';
import { IdCard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InfoField {
  labelKey: string;
  value?: string | null;
}

interface ProfileInfoCardProps {
  fields: InfoField[];
}

export function ProfileInfoCard({ fields }: ProfileInfoCardProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-[#292524] rounded-2xl border border-gray-100 dark:border-[#4a4441] shadow-sm p-4 sm:p-8">
      {/* Section heading */}
      <div className="flex items-center gap-2 sm:gap-2.5 mb-4 sm:mb-6">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-orange-50 dark:bg-[#C96442]/20 flex items-center justify-center shrink-0">
          <IdCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F27F0D] dark:text-[#C96442]" />
        </div>
        <h3 className="text-base sm:text-xl font-bold text-gray-800 dark:text-[#f0ebe5]">
          {t('Profile.personalInfo')}
        </h3>
      </div>

      {/* Fields — one row per field with divider, label inline with value */}
      <dl className="divide-y divide-gray-100 dark:divide-[#4a4441]">
        {fields.map(({ labelKey, value }) => (
          <div key={labelKey} className="flex items-baseline gap-3 sm:gap-4 py-3 sm:py-4 first:pt-0 last:pb-0">
            <dt className="w-24 sm:w-40 shrink-0 text-xs sm:text-sm text-[#F27F0D] dark:text-[#C96442] font-medium">
              {t(labelKey)}
            </dt>
            <dd
              className={cn(
                'text-sm sm:text-base font-semibold',
                value
                  ? 'text-gray-900 dark:text-[#f0ebe5]'
                  : 'text-gray-300 dark:text-[#8b7f77]',
              )}
            >
              {value || '—'}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
