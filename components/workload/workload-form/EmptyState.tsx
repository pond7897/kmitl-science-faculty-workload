"use client";

import { useTranslation } from "react-i18next";

interface EmptyStateProps {
  onAddClick: () => void;
}

export function EmptyState({ onAddClick }: EmptyStateProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-3 sm:p-4 dark:border-[#4a4441] dark:bg-[#302826] min-h-28 sm:min-h-32">
      <p className="mb-2 sm:mb-3 text-xs sm:text-sm text-gray-500 dark:text-[#8b7f77] text-center">
        {t('WorkloadForm.emptyState')}
      </p>
      <button
        onClick={onAddClick}
        className="inline-flex h-7 sm:h-8 px-3 sm:px-4 items-center justify-center rounded-full border-2 border-orange-400 text-orange-500 transition-all hover:bg-orange-50 hover:border-orange-500 dark:hover:bg-[#3d3533] dark:border-[#C96442] dark:text-[#C96442] cursor-pointer gap-1 text-xs font-semibold"
      >
        <span className="text-base sm:text-lg font-semibold">+</span>
        <span>{t('WorkloadForm.addCourse')}</span>
      </button>
    </div>
  );
}
