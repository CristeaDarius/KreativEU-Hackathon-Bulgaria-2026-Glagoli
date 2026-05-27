import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ro from './locales/ro.json';
import bg from './locales/bg.json';
import sk from './locales/sk.json';
import pl from './locales/pl.json';
import cs from './locales/cs.json';

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, ro: { translation: ro }, bg: { translation: bg }, sk: { translation: sk }, pl: { translation: pl }, cs: { translation: cs } },
  lng: localStorage.getItem('lang') || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
