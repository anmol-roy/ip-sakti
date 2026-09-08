export const locales = ['en', 'hi', 'kn'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const localeNames: Record<Locale, { native: string; english: string }> = {
  en: { native: 'English', english: 'English' },
  hi: { native: 'हिन्दी', english: 'Hindi' },
  kn: { native: 'ಕನ್ನಡ', english: 'Kannada' },
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}
