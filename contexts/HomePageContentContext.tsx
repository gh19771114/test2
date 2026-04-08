'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { HomeLocale } from '@/lib/i18n-home-seo'
import type { AppLanguage } from '@/lib/locale-translations'
import { homeLocaleToContentLanguage } from '@/lib/home-locale-bridge'

const HomePageContentContext = createContext<AppLanguage | null>(null)

/** 仅包在五个语言首页外：主内容文案固定为当前 URL 语种，不随语言切换器变化 */
export function HomePageContentProvider({
  homeLocale,
  children,
}: {
  homeLocale: HomeLocale
  children: ReactNode
}) {
  const contentLang = homeLocaleToContentLanguage(homeLocale)
  return (
    <HomePageContentContext.Provider value={contentLang}>{children}</HomePageContentContext.Provider>
  )
}

export function useHomePageContentLanguage(): AppLanguage | null {
  return useContext(HomePageContentContext)
}
