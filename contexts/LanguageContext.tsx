'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import zhTranslations from '@/locales/zh.json'

export type Language = 'zh' | 'zh-TW' | 'zh-HK' | 'ja' | 'en'

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

export function LanguageProvider({ children }: { children: ReactNode }) {
  // 使用函数初始化，确保服务器端和客户端都使用相同的初始值
  const [language, setLanguageState] = useState<Language>(() => {
    // 关键：为了避免 Hydration mismatch（SSR 固定用 zh），客户端首次渲染也必须用 zh。
    // 挂载后再从 localStorage/浏览器语言切换到用户语言（见下方 useEffect）。
    return 'zh'
  })
  
  const [translations, setTranslations] = useState<Record<string, any>>(zhTranslations)
  const [titleTranslations, setTitleTranslations] = useState<Record<string, any>>(zhTranslations)
  const [isMounted, setIsMounted] = useState(false)

  // 组件挂载后标记为已挂载
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // 根据浏览器语言自动设置语言
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // 检查是否已经设置过语言（用户手动选择过）
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage) {
      // 如果用户已经手动选择过语言，就不自动设置
      return
    }

    // 更强的保护：如果用户曾经手动选择过语言（我们记录一个标记），就永远不再用设备语言覆盖
    const userSelected = localStorage.getItem('languageUserSelected')
    if (userSelected === 'true') {
      return
    }
    
    // 检查是否已经自动设置过
    const autoSet = localStorage.getItem('languageAutoSet')
    if (autoSet === 'true') {
      return
    }
    
    // 检测浏览器语言
    const detectLanguage = () => {
      try {
        // 获取浏览器语言设置（优先使用 navigator.languages，如果没有则使用 navigator.language）
        const browserLanguages = navigator.languages || [navigator.language]
        let detectedLanguage: Language = 'zh-TW' // 默认繁体中文台湾
        
        // 遍历浏览器语言列表，找到第一个匹配的语言
        for (const lang of browserLanguages) {
          const langLower = lang.toLowerCase()
          const langCode = langLower.split('-')[0] // 获取主语言代码（如 'zh', 'ja', 'en'）
          const fullLang = langLower.split('-').slice(0, 2).join('-') // 获取完整语言代码（如 'zh-tw', 'zh-cn'）
          
          // 精确匹配（优先级更高）
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
          
          // 如果精确匹配未找到，尝试主语言代码匹配
          if (detectedLanguage === 'zh-TW') {
            if (langCode === 'zh') {
              // 如果只有 'zh' 而没有地区代码，默认为繁体中文台湾
              detectedLanguage = 'zh-TW'
            } else if (langCode === 'ja') {
              detectedLanguage = 'ja'
            } else if (langCode === 'en') {
              detectedLanguage = 'en'
            }
          }
        }
        
        setLanguageState(detectedLanguage)
        localStorage.setItem('language', detectedLanguage)
        localStorage.setItem('languageAutoSet', 'true')
      } catch (error) {
        console.error('Failed to detect language from browser:', error)
        // 出错时使用默认值
        setLanguageState('zh-TW')
        localStorage.setItem('language', 'zh-TW')
        localStorage.setItem('languageAutoSet', 'true')
      }
    }
    
    detectLanguage()
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

  // 客户端挂载后，如果语言与初始状态不同，重新加载翻译
  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      const savedLanguageRaw = localStorage.getItem('language')
      const normalized =
        savedLanguageRaw === 'zh-CN' ? 'zh' :
        savedLanguageRaw === 'ja-JP' ? 'ja' :
        savedLanguageRaw
      const savedLanguage = normalized as Language
      if (savedLanguage && savedLanguage !== language && (savedLanguage === 'zh' || savedLanguage === 'zh-TW' || savedLanguage === 'zh-HK' || savedLanguage === 'ja' || savedLanguage === 'en')) {
        setLanguageState(savedLanguage)
      }
    }
  }, [isMounted, language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang)
      // 标记：用户明确选择过语言，后续所有页面都以该语言为准，不再用设备语言覆盖
      localStorage.setItem('languageUserSelected', 'true')
      // 同时标记已自动/已设置过，避免设备语言逻辑再次触发
      localStorage.setItem('languageAutoSet', 'true')
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
