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

// Direction follows the resolved language: Arabic is RTL, English/French are LTR.
export const isRTL: boolean = i18n.dir() === 'rtl';

// Wasla drives layout direction manually from the selected language (see lib/rtl.ts)
// rather than the native RTL engine. This keeps the experience deterministic across
// iOS/Android/web and lets a language switch take effect with a plain JS reload.
// Keep the native layout engine in LTR so it never double-flips our explicit
// direction-aware styles.
I18nManager.allowRTL(false);
I18nManager.forceRTL(false);

export default i18n;
