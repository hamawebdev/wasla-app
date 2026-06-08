import i18n from '@/lib/i18n';

// Map the active app language to a concrete locale for Intl formatting.
const LOCALE_BY_LANG: Record<string, string> = {
  ar: 'ar-DZ',
  en: 'en-US',
  fr: 'fr-FR',
};

function activeLocale(): string {
  return LOCALE_BY_LANG[i18n.language as string] ?? 'en-US';
}

// Locale-aware number formatting. Arabic keeps Arabic-Indic digits (ar-DZ);
// English/French use Western digits.
export function formatNumber(value: number): string {
  return value.toLocaleString(activeLocale());
}

// Locale-aware date formatting.
export function formatDate(
  value: string | number | Date,
  options?: Intl.DateTimeFormatOptions,
): string {
  return new Date(value).toLocaleDateString(activeLocale(), options);
}

// Locale-aware time formatting.
export function formatTime(
  value: string | number | Date,
  options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' },
): string {
  return new Date(value).toLocaleTimeString(activeLocale(), options);
}
