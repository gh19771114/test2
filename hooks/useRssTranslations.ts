'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import type { Language } from '@/contexts/LanguageContext'

type RssTranslationItem = {
  title: Record<string, string>
  summary: Record<string, string>
}

export function useRssTranslations() {
  const { language } = useLanguage()
  const [map, setMap] = useState<Record<string, RssTranslationItem>>({})
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/news/rss-translations')
      .then((r) => r.ok ? r.json() as Promise<Record<string, RssTranslationItem>> : Promise.resolve({}))
      .then((data: unknown) => {
        if (!cancelled) {
          const next =
            typeof data === 'object' && data !== null
              ? (data as Record<string, RssTranslationItem>)
              : {}
          setMap(next)
          setReady(true)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMap({})
          setReady(true)
        }
      })
    return () => { cancelled = true }
  }, [])

  const getTitle = useCallback(
    (id: string, fallback: string): string => {
      const t = map[id]
      if (!t?.title) return fallback
      const lang = language as string
      return t.title[lang] ?? t.title['ja'] ?? t.title['en'] ?? fallback
    },
    [map, language]
  )

  const getSummary = useCallback(
    (id: string, fallback: string): string => {
      const t = map[id]
      if (!t?.summary) return fallback
      const lang = language as string
      return t.summary[lang] ?? t.summary['ja'] ?? t.summary['en'] ?? fallback
    },
    [map, language]
  )

  return { getTitle, getSummary, ready }
}
