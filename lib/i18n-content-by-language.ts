import { LOCALE_TRANSLATIONS, type AppLanguage } from '@/lib/locale-translations'
import { getTitleLocale } from '@/lib/get-title-locale'
import { translateKey } from '@/lib/translate-key'

const zhSource = LOCALE_TRANSLATIONS.zh

export function tForLanguage(
  lang: AppLanguage,
  key: string,
  options?: { returnObjects?: boolean; [key: string]: unknown }
): any {
  const source = (LOCALE_TRANSLATIONS[lang] ?? zhSource) as Record<string, unknown>
  return translateKey(source, key, options)
}

export function tTitleForLanguage(
  lang: AppLanguage,
  key: string,
  options?: { returnObjects?: boolean; [key: string]: unknown }
): any {
  const titleLang = getTitleLocale(lang)
  const source = (
    titleLang === lang ? LOCALE_TRANSLATIONS[lang] : LOCALE_TRANSLATIONS[titleLang]
  ) as Record<string, unknown>
  return translateKey((source ?? zhSource) as Record<string, unknown>, key, options)
}
