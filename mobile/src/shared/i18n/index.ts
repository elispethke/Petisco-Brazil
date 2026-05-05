import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import pt from './pt';
import en from './en';
import de from './de';

i18n.use(initReactI18next).init({
  resources: { pt, en, de },
  lng: 'pt',
  fallbackLng: 'pt',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v3',
});

export default i18n;
