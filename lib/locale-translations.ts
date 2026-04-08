import zhTranslations from '@/locales/zh.json'
import zhTWTranslations from '@/locales/zh-TW.json'
import zhHKTranslations from '@/locales/zh-HK.json'
import jaTranslations from '@/locales/ja.json'
import enTranslations from '@/locales/en.json'

export type AppLanguage = 'zh' | 'zh-TW' | 'zh-HK' | 'ja' | 'en'

export const LOCALE_TRANSLATIONS: Record<AppLanguage, Record<string, unknown>> = {
  zh: zhTranslations,
  'zh-TW': zhTWTranslations,
  'zh-HK': zhHKTranslations,
  ja: jaTranslations,
  en: enTranslations,
}
