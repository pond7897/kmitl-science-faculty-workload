import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import thCommon from '@/locales/th/common.json';
import enCommon from '@/locales/en/common.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      th: { common: thCommon },
      en: { common: enCommon },
    },
    defaultNS: 'common',
    fallbackLng: 'th',
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'language',
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
