'use client';

import { useTranslation } from 'react-i18next';

export type Locale = 'th' | 'en';

export function useLanguage() {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: Locale) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const currentLanguage = (i18n.language?.startsWith('th') ? 'th' : 'en') as Locale;

  return {
    currentLanguage,
    changeLanguage,
  };
}
