export const SUPPORTED_LOCALES = ['en', 'fr'] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]

export type ValuesByLocale<T> = {
  [key in Locale]: T
}

export const LOCALE_FALLBACK: Locale = 'fr'
