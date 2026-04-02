'use client';

import { useTranslation } from 'react-i18next';

export default function DashboardPage() {
  const { t } = useTranslation();

  const cards = [
    t('Dashboard.totalWorkload'),
    t('Dashboard.pendingWorkload'),
    t('Dashboard.approvedWorkload'),
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-[#f0ebe5]">
          {t('Dashboard.title')}
        </h1>
        <p className="text-gray-500 dark:text-[#8b7f77] mt-1 text-sm">
          {t('Dashboard.overview')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((label) => (
          <div
            key={label}
            className="bg-white dark:bg-[#292524] rounded-xl border border-gray-100 dark:border-[#4a4441] p-5 shadow-sm"
          >
            <p className="text-sm text-gray-500 dark:text-[#8b7f77]">{label}</p>
            <p className="text-3xl font-bold text-[#F27F0D] dark:text-[#C96442] mt-1">—</p>
          </div>
        ))}
      </div>
    </div>
  );
}
