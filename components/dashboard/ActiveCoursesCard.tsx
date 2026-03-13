'use client';

import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpenText } from 'lucide-react';

interface ActiveCoursesCardProps {
  count: number;
  loading?: boolean;
}

export function ActiveCoursesCard({ count, loading }: ActiveCoursesCardProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-[#2a2a2a] rounded-2xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6 shadow-sm flex flex-col gap-3 sm:gap-4">
      {/* Icon box */}
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
        <BookOpenText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 dark:text-blue-400" />
      </div>

      {/* Label */}
      <p className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400">
        {t('Dashboard.activeCourses')}
      </p>

      {/* Value */}
      {loading ? (
        <Skeleton className="h-8 w-20" />
      ) : (
        <p className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white leading-none">
          {count}{' '}
          <span className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white leading-none">
            {t('Dashboard.courseUnit')}
          </span>
        </p>
      )}
    </div>
  );
}
