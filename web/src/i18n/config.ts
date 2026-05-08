export const i18nConfig = {
  defaultLocale: 'pt',
  locales: ['pt', 'en', 'de'],
} as const;

export type Locale =
  (typeof i18nConfig.locales)[number];