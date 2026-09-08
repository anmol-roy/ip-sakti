import type { Locale } from './config'
import en from './locales/en.json'
import hi from './locales/hi.json'
import kn from './locales/kn.json'

export type Dictionary = typeof en

export const dictionaries: Record<Locale, Dictionary> = {
  en,
  hi: hi as Dictionary,
  kn: kn as Dictionary,
}
