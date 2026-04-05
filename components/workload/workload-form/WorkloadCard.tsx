'use client';

import { Clock, MapPin, Users } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

interface WorkloadCardProps {
  courseCode: string;
  courseName: string;
  time: string;
  room: string;
  studentCount: number;
}

export function WorkloadCard({
  courseCode,
  courseName,
  time,
  room,
  studentCount,
}: WorkloadCardProps) {
  const { currentLanguage } = useLanguage();
  const isTh = currentLanguage === 'th';

  return (
    <div className="rounded-xl border border-orange-200 bg-orange-50 p-3 shadow-sm transition-shadow dark:border-orange-500/25 dark:bg-orange-500/5 dark:shadow-[0_10px_30px_rgba(249,115,22,0.04)] sm:p-4">
      <div className="border-l-4 border-l-orange-500 pl-3 dark:border-l-orange-400">
        <p className="line-clamp-1 text-sm font-extrabold text-orange-600 dark:text-orange-300 sm:text-base">
          {courseCode}
        </p>

        <hr className="my-2 border-orange-200 dark:border-orange-400/15" />

        <p className="mb-2 text-sm font-extrabold leading-snug text-gray-900 dark:text-orange-50 sm:mb-3 sm:text-base">
          {courseName}
        </p>

        <div className="space-y-1 text-gray-500 dark:text-orange-100/75 sm:space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm">
            <Clock className="h-3.5 w-3.5 shrink-0 text-gray-400 dark:text-orange-300/65" />
            <span className="line-clamp-1">{time}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400 dark:text-orange-300/65" />
            <span className="line-clamp-1">{room}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm">
            <Users className="h-3.5 w-3.5 shrink-0 text-gray-400 dark:text-orange-300/65" />
            <span className="line-clamp-1">
              {isTh ? 'นักศึกษา' : 'Students'} : {studentCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
