import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './en.json';
import hiTranslation from './hi.json';
import mrTranslation from './mr.json';

const savedLanguage = localStorage.getItem('relink_lang') || 'hi';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      hi: { translation: hiTranslation },
      mr: { translation: mrTranslation }
    },
    lng: savedLanguage,
    fallbackLng: 'hi',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;
