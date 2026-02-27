'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import zhTranslations from '@/locales/zh.json'
import zhTWTranslations from '@/locales/zh-TW.json'
import zhHKTranslations from '@/locales/zh-HK.json'
import jaTranslations from '@/locales/ja.json'
import enTranslations from '@/locales/en.json'

export type Language = 'zh' | 'zh-TW' | 'zh-HK' | 'ja' | 'en'

const LOCALE_TRANSLATIONS: Record<Language, Record<string, any>> = {
  zh: zhTranslations,
  'zh-TW': zhTWTranslations,
  'zh-HK': zhHKTranslations,
  ja: jaTranslations,
  en: enTranslations,
}

/** 卡片标题显示语言：简体/台湾/香港/日本 → 日语，英文 → 英语 */
function getTitleLocale(lang: Language): Language {
  if (lang === 'zh' || lang === 'zh-TW' || lang === 'zh-HK' || lang === 'ja') return 'ja'
  return 'en'
}

export { getTitleLocale }

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, options?: { returnObjects?: boolean; [key: string]: any }) => string | any
  /** 卡片标题专用：按 getTitleLocale 取日语/英语/简体，用于所有卡片上的标题名称 */
  tTitle: (key: string, options?: { returnObjects?: boolean; [key: string]: any }) => string | any
  /** 当前卡片标题应使用的语言（zh/zh-TW/zh-HK/ja→ja, en→en），用于 getManagedPropertyTitle 等 */
  titleLocale: Language
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({
  children,
  initialLocale,
}: {
  children: ReactNode
  /** 服务端传入的初始语言（cookie 或 Accept-Language），首屏即用该语言，避免先闪中文再切语种 */
  initialLocale?: Language
}) {
  const initialLang = initialLocale ?? 'zh'
  const initialTitleLang = getTitleLocale(initialLang)
  const [language, setLanguageState] = useState<Language>(() => initialLang)
  const [translations, setTranslations] = useState<Record<string, any>>(
    () => LOCALE_TRANSLATIONS[initialLang] ?? zhTranslations
  )
  const [titleTranslations, setTitleTranslations] = useState<Record<string, any>>(
    () => LOCALE_TRANSLATIONS[initialTitleLang] ?? zhTranslations
  )
  const [isMounted, setIsMounted] = useState(false)

  // 组件挂载后：标记已挂载；若有服务端 initialLocale 且本地未存过语言则持久化并写 cookie，避免下方「自动检测」再次覆盖导致闪烁
  useEffect(() => {
    setIsMounted(true)
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem('language') as Language | null
    if (saved && (saved === 'zh' || saved === 'zh-TW' || saved === 'zh-HK' || saved === 'ja' || saved === 'en')) {
      document.cookie = `NEXT_LOCALE=${saved}; path=/; max-age=31536000; SameSite=Lax`
    } else if (initialLocale && !saved) {
      localStorage.setItem('language', initialLocale)
      localStorage.setItem('languageAutoSet', 'true')
      document.cookie = `NEXT_LOCALE=${initialLocale}; path=/; max-age=31536000; SameSite=Lax`
    }
  }, [initialLocale])

  // 根据浏览器语言自动设置语言（延迟到 hydration 之后执行，避免服务端 zh 与客户端恢复的 ja 等不一致导致 hydration 报错）
  useEffect(() => {
    if (typeof window === 'undefined') return
    const timer = setTimeout(() => {
      // 检查是否已经设置过语言（用户手动选择过）
      const savedLanguage = localStorage.getItem('language')
      if (savedLanguage) {
        return
      }
      const userSelected = localStorage.getItem('languageUserSelected')
      if (userSelected === 'true') return
      const autoSet = localStorage.getItem('languageAutoSet')
      if (autoSet === 'true') return

      const detectLanguage = () => {
        try {
          const browserLanguages = navigator.languages || [navigator.language]
          let detectedLanguage: Language = 'zh-TW'
          for (const lang of browserLanguages) {
            const langLower = lang.toLowerCase()
            const langCode = langLower.split('-')[0]
            const fullLang = langLower.split('-').slice(0, 2).join('-')
            if (fullLang === 'zh-cn' || langLower === 'zh-hans' || langLower === 'zh-hans-cn') {
              detectedLanguage = 'zh'
              break
            } else if (fullLang === 'zh-tw' || langLower === 'zh-hant-tw') {
              detectedLanguage = 'zh-TW'
              break
            } else if (fullLang === 'zh-hk' || langLower === 'zh-hant-hk' || fullLang === 'zh-mo') {
              detectedLanguage = 'zh-HK'
              break
            } else if (fullLang === 'ja-jp' || langCode === 'ja') {
              detectedLanguage = 'ja'
              break
            } else if (langCode === 'en') {
              detectedLanguage = 'en'
              break
            }
            if (detectedLanguage === 'zh-TW') {
              if (langCode === 'zh') detectedLanguage = 'zh-TW'
              else if (langCode === 'ja') detectedLanguage = 'ja'
              else if (langCode === 'en') detectedLanguage = 'en'
            }
          }
          setLanguageState(detectedLanguage)
          localStorage.setItem('language', detectedLanguage)
          localStorage.setItem('languageAutoSet', 'true')
        } catch (error) {
          console.error('Failed to detect language from browser:', error)
          setLanguageState('zh-TW')
          localStorage.setItem('language', 'zh-TW')
          localStorage.setItem('languageAutoSet', 'true')
        }
      }
      detectLanguage()
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  // 加载翻译文件（主界面 + 卡片标题用语言）
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        let translationsModule: any
        switch (language) {
          case 'zh':
            translationsModule = await import('@/locales/zh.json')
            break
          case 'zh-TW':
            translationsModule = await import('@/locales/zh-TW.json')
            break
          case 'zh-HK':
            translationsModule = await import('@/locales/zh-HK.json')
            break
          case 'ja':
            translationsModule = await import('@/locales/ja.json')
            break
          case 'en':
            translationsModule = await import('@/locales/en.json')
            break
          default:
            translationsModule = await import('@/locales/zh.json')
        }
        const loaded = translationsModule.default || translationsModule
        setTranslations(loaded)

        const titleLang = getTitleLocale(language)
        if (titleLang === language) {
          setTitleTranslations(loaded)
        } else {
          let titleModule: any
          switch (titleLang) {
            case 'zh':
              titleModule = await import('@/locales/zh.json')
              break
            case 'ja':
              titleModule = await import('@/locales/ja.json')
              break
            case 'en':
              titleModule = await import('@/locales/en.json')
              break
            default:
              titleModule = await import('@/locales/ja.json')
          }
          setTitleTranslations(titleModule.default || titleModule)
        }

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('languagechange'))
        }
      } catch (error) {
        console.error(`Failed to load translations for ${language}:`, error)
        setTranslations(zhTranslations)
        setTitleTranslations(zhTranslations)
      }
    }
    loadTranslations()
  }, [language])

  // 客户端挂载后，若 localStorage 中语言与当前不同则恢复（延迟到 hydration 之后执行，避免与服务端 zh 不一致导致 hydration 报错）
  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return
    const timer = setTimeout(() => {
      const savedLanguageRaw = localStorage.getItem('language')
      const normalized =
        savedLanguageRaw === 'zh-CN' ? 'zh' :
        savedLanguageRaw === 'ja-JP' ? 'ja' :
        savedLanguageRaw
      const savedLanguage = normalized as Language
      if (savedLanguage && savedLanguage !== language && (savedLanguage === 'zh' || savedLanguage === 'zh-TW' || savedLanguage === 'zh-HK' || savedLanguage === 'ja' || savedLanguage === 'en')) {
        setLanguageState(savedLanguage)
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [isMounted, language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang)
      // 标记：用户明确选择过语言，后续所有页面都以该语言为准，不再用设备语言覆盖
      localStorage.setItem('languageUserSelected', 'true')
      // 同时标记已自动/已设置过，避免设备语言逻辑再次触发
      localStorage.setItem('languageAutoSet', 'true')
      // 写入 cookie 供服务端下次请求用，首屏直接返回对应语言，避免闪中文
      document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000; SameSite=Lax`
    }
  }

  const resolveFrom = (source: Record<string, any>, fullKey: string) => {
    const keys = fullKey.split('.')
    let value: any = source
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return { found: false as const, value: undefined, usedKey: fullKey }
      }
    }
    return { found: true as const, value, usedKey: fullKey }
  }

  const translate = (source: Record<string, any>, key: string, options?: { returnObjects?: boolean; [key: string]: any }) => {
    let resolved = resolveFrom(source, key)
    if (!resolved.found && key.startsWith('tenant.kaiyaku.')) {
      resolved = resolveFrom(source, key.replace(/^tenant\.kaiyaku\./, 'tenant.services.kaiyaku.'))
    }
    if (!resolved.found) {
      const fb = resolveFrom(zhTranslations as any, key)
      if (!fb.found && key.startsWith('tenant.kaiyaku.')) {
        const fb2 = resolveFrom(zhTranslations as any, key.replace(/^tenant\.kaiyaku\./, 'tenant.services.kaiyaku.'))
        if (fb2.found) resolved = fb2
      } else if (fb.found) resolved = fb
    }
    const value = resolved.found ? resolved.value : undefined
    if (options?.returnObjects && (Array.isArray(value) || typeof value === 'object')) return value
    let result = typeof value === 'string' ? value : key
    if (options && typeof result === 'string') {
      Object.keys(options).forEach(optKey => {
        if (optKey !== 'returnObjects' && options[optKey] !== undefined) {
          result = result.replace(new RegExp(`\\{${optKey}\\}`, 'g'), String(options[optKey]))
        }
      })
    }
    return result
  }

  const t = (key: string, options?: { returnObjects?: boolean; [key: string]: any }): any =>
    translate(translations, key, options)

  const tTitle = (key: string, options?: { returnObjects?: boolean; [key: string]: any }): any =>
    translate(titleTranslations, key, options)

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tTitle, titleLocale: getTitleLocale(language) }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
