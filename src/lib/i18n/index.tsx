/* eslint-disable react-refresh/only-export-components */
import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';

import { resources } from './resources';
import { getLanguage } from './utils';

export * from './utils';

// Wasla is Arabic-first. Fall back to device locale, then to 'ar'.
const savedLang = getLanguage();
const deviceLang = getLocales()[0]?.languageTag;
const initialLang = savedLang ?? (deviceLang?.startsWith('ar') ? 'ar' : 'ar');

i18n.use(initReactI18next).init({
  resources,
  lng: initialLang,
  fallbackLng: 'ar',
  compatibilityJSON: 'v4',
  interpolation: {
    escapeValue: false,
  },
});

export const isRTL: boolean = i18n.dir() === 'rtl';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default i18n;
