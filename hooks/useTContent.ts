'use client'

import { useMemo } from 'react'
import { useLanguage, type Language } from '@/contexts/LanguageContext'
import { useHomePageContentLanguage } from '@/contexts/HomePageContentContext'
import { tForLanguage, tTitleForLanguage } from '@/lib/i18n-content-by-language'

/**
 * 在首页（HomePageContentProvider 内）：t / tTitle / contentLanguage 固定为当前 URL 对应语种。
 * 其他页面：与 useLanguage 一致。
 */
export function useTContent() {
  const { language } = useLanguage()
  const homeContentLang = useHomePageContentLanguage()
  const effectiveLang: Language = (homeContentLang ?? language) as Language

  return useMemo(
    () => ({
      t: (key: string, options?: { returnObjects?: boolean; [key: string]: unknown }) =>
        tForLanguage(effectiveLang, key, options),
      tTitle: (key: string, options?: { returnObjects?: boolean; [key: string]: unknown }) =>
        tTitleForLanguage(effectiveLang, key, options),
      /** 用于分支逻辑（如日文排版）；在首页等于 URL 语种 */
      contentLanguage: effectiveLang,
    }),
    [effectiveLang]
  )
}
