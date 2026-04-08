import type { HomeLocale } from '@/lib/i18n-home-seo'
import type { AppLanguage } from '@/lib/locale-translations'

/** 五语言首页 URL → LanguageContext 语种（用于静态文案包） */
export function homeLocaleToContentLanguage(homeLocale: HomeLocale): AppLanguage {
  const map: Record<HomeLocale, AppLanguage> = {
    ja: 'ja',
    en: 'en',
    'zh-cn': 'zh',
    'zh-tw': 'zh-TW',
    'zh-hk': 'zh-HK',
  }
  return map[homeLocale]
}
