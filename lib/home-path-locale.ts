import type { Language } from '@/contexts/LanguageContext'
import type { HomeLocale } from '@/lib/i18n-home-seo'
import { HOME_SEO } from '@/lib/i18n-home-seo'

/** 五语言首页路径（与 app 下各语言首页、middleware x-pathname 一致） */
export const LOCALE_HOME_PATHS = ['/jp', '/en', '/zh-cn', '/zh-tw', '/zh-hk'] as const

const PATH_TO_HOME: Record<
  (typeof LOCALE_HOME_PATHS)[number],
  { homeLocale: HomeLocale; language: Language }
> = {
  '/jp': { homeLocale: 'ja', language: 'ja' },
  '/en': { homeLocale: 'en', language: 'en' },
  '/zh-cn': { homeLocale: 'zh-cn', language: 'zh' },
  '/zh-tw': { homeLocale: 'zh-tw', language: 'zh-TW' },
  '/zh-hk': { homeLocale: 'zh-hk', language: 'zh-HK' },
}

/** 将请求路径规范为无前导歧义形式，如 /jp/ -> /jp */
export function normalizePathname(pathname: string): string {
  if (!pathname || pathname === '/') return '/'
  const trimmed = pathname.replace(/\/+$/, '') || '/'
  return trimmed
}

/** 当前路径是否为五语言首页之一（含尾部斜杠规范化） */
export function isLocaleHomePath(pathname: string | null): boolean {
  if (!pathname) return false
  const pathOnly = pathname.split('?')[0] ?? ''
  const p = normalizePathname(pathOnly)
  return p in PATH_TO_HOME
}

/**
 * 若当前路径为五个固定语言首页之一，返回对应的 LanguageProvider 语言与 html lang。
 * 其他路径返回 null，由根布局回退到 cookie / Accept-Language。
 */
export function getHomePathLocale(pathname: string): {
  homeLocale: HomeLocale
  language: Language
  htmlLang: string
} | null {
  const p = normalizePathname(pathname)
  if (!(p in PATH_TO_HOME)) return null
  const hit = PATH_TO_HOME[p as keyof typeof PATH_TO_HOME]
  return {
    homeLocale: hit.homeLocale,
    language: hit.language,
    htmlLang: HOME_SEO[hit.homeLocale].htmlLang,
  }
}
