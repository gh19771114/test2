import type { AppLanguage } from '@/lib/locale-translations'

/** 卡片标题显示语言：简体/台湾/香港/日本 → 日语，英文 → 英语 */
export function getTitleLocale(lang: AppLanguage): AppLanguage {
  if (lang === 'zh' || lang === 'zh-TW' || lang === 'zh-HK' || lang === 'ja') return 'ja'
  return 'en'
}
