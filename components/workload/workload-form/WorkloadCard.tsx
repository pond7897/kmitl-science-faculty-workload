'use client';

import { Clock, MapPin, Users } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

interface WorkloadCardProps {
  courseCode: string;
  courseName: string;
  time: string;
  room: string;
  studentCount: number;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function WorkloadCard({
  courseCode,
  courseName,
  time,
  room,
  studentCount,
  isSelected = false,
  onSelect,
}: WorkloadCardProps) {
  const { currentLanguage } = useLanguage();
  const isTh = currentLanguage === 'th';
  const cardClassName = `w-full overflow-hidden rounded-xl border bg-orange-50 text-left shadow-sm transition-all duration-200 ${
    isSelected
      ? 'border-orange-300 border-l-4 border-l-orange-500 ring-2 ring-orange-200/80 dark:border-orange-500/35 dark:border-l-orange-400 dark:ring-orange-400/20'
      : 'border-orange-200 border-l-4 border-l-orange-500/80 hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md dark:border-orange-500/25 dark:border-l-orange-400 dark:hover:border-orange-500/40'
  } dark:bg-orange-500/5 dark:shadow-[0_10px_30px_rgba(249,115,22,0.04)]`;
  const content = (
    <div className="px-3 py-3 sm:px-4 sm:py-4">
      <div className="pl-1 sm:pl-2">
        <p className="break-all text-sm font-extrabold text-orange-600 dark:text-orange-300 sm:text-base">
          {courseCode}
        </p>

        <hr className="my-2 border-orange-200 dark:border-orange-400/15" />

        <p className="mb-2 line-clamp-2 text-sm font-extrabold leading-snug text-gray-900 dark:text-orange-50 sm:mb-3 sm:text-base">
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

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={`${cardClassName} cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={cardClassName}>
      {content}
    </div>
  );
}
