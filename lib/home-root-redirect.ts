import type { Language } from '@/contexts/LanguageContext'

export { LOCALE_HOME_PATHS, isLocaleHomePath } from '@/lib/home-path-locale'

const COOKIE_LOCALE = 'NEXT_LOCALE'
const VALID: Language[] = ['zh', 'zh-TW', 'zh-HK', 'ja', 'en']

export function languageToHomePath(lang: Language): string {
  switch (lang) {
    case 'zh':
      return '/zh-cn'
    case 'zh-TW':
      return '/zh-tw'
    case 'zh-HK':
      return '/zh-hk'
    case 'ja':
      return '/jp'
    case 'en':
      return '/en'
    default:
      return '/jp'
  }
}

export function parseLocaleCookie(cookieHeader: string | null): Language | null {
  if (!cookieHeader) return null
  const match = cookieHeader.match(new RegExp(`${COOKIE_LOCALE}=([^;]+)`))
  const v = match?.[1]?.trim() as Language | undefined
  if (v && VALID.includes(v)) return v
  return null
}

/** Accept-Language → Language；无匹配时返回 null（由调用方默认 /jp） */
export function languageFromAcceptLanguage(acceptLanguage: string): Language | null {
  const lower = acceptLanguage.toLowerCase()
  if (lower.includes('zh-hk') || lower.includes('zh-hant-hk')) return 'zh-HK'
  if (lower.includes('zh-tw') || lower.includes('zh-hant-tw')) return 'zh-TW'
  if (lower.includes('zh-cn') || lower.includes('zh-hans')) return 'zh'
  if (lower.includes('zh')) return 'zh'
  if (lower.includes('ja')) return 'ja'
  if (lower.includes('en')) return 'en'
  return null
}

export function resolveRootRedirectTarget(cookieHeader: string | null, acceptLanguage: string | null): string {
  const fromCookie = parseLocaleCookie(cookieHeader)
  if (fromCookie) return languageToHomePath(fromCookie)
  const fromAl = acceptLanguage ? languageFromAcceptLanguage(acceptLanguage) : null
  if (fromAl) return languageToHomePath(fromAl)
  return '/jp'
}
