'use client';

import { useTranslation } from 'react-i18next';

export default function WorkloadHistoryPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('Sidebar.workloadHistory')}
        </h1>
      </div>
    </div>
  );
}
