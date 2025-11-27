// data/locales.ts

export type Locale = 'zh' | 'zh-tw' | 'zh-hk' | 'ja' | 'en'

// 所有支持的语言选项（提供给 Header 语言切换菜单）
export const LOCALES: Record<Locale, string> = {
  zh: '简体中文',
  'zh-tw': '繁體中文（台灣）',
  'zh-hk': '繁體中文（香港）',
  ja: '日本語',
  en: 'English',
}


