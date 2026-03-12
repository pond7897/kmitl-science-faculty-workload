'use client';

import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/use-language';

interface ProfileData {
  firstname_th?: string;
  lastname_th?: string;
  firstname_en?: string;
  lastname_en?: string;
  position_en?: string;
  email?: string;
}

interface ProfileContentProps {
  data: ProfileData;
  rawSession?: object;
}

export function ProfileContent({ data, rawSession }: ProfileContentProps) {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  const fields = [
    { label: t('Profile.firstnameTh'), value: data.firstname_th },
    { label: t('Profile.lastnameTh'), value: data.lastname_th },
    { label: t('Profile.firstnameEn'), value: data.firstname_en },
    { label: t('Profile.lastnameEn'), value: data.lastname_en },
    { label: t('Profile.position'), value: data.position_en },
    { label: t('Profile.email'), value: data.email },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('Profile.title')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          {t('Profile.welcome')}{' '}
          {currentLanguage === 'en'
            ? `${data.firstname_en || data.firstname_th || 'User'} ${data.lastname_en || data.lastname_th || ''}`
            : `${data.firstname_th || 'User'} ${data.lastname_th || ''}`}
        </p>
      </div>

      {/* User Info Card */}
      <div className="bg-white dark:bg-[#2a2a2a] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-4">
          {t('Profile.detail')}
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(({ label, value }) => (
            <div key={label}>
              <dt className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                {label}
              </dt>
              <dd className="text-sm font-medium text-gray-900 dark:text-white">
                {value || '—'}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Raw JSON (dev only) */}
      {process.env.NODE_ENV === 'development' && rawSession && (
        <details className="bg-white dark:bg-[#2a2a2a] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
          <summary className="text-sm font-medium text-gray-500 cursor-pointer select-none">
            Raw session data (dev only)
          </summary>
          <pre className="mt-3 bg-gray-50 dark:bg-gray-900 p-3 rounded-md overflow-auto text-xs text-gray-700 dark:text-gray-300">
            {JSON.stringify(rawSession, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
