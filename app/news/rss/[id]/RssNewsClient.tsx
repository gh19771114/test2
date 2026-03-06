'use client'

import PageLayout from '@/components/PageLayout'
import Link from 'next/link'
import { Calendar, ArrowLeft, ExternalLink } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useRssTranslations } from '@/hooks/useRssTranslations'

export type RssItem = {
  title: string
  link: string
  date: string
  source: string
}

export default function RssNewsClient({ item, id }: { item: RssItem; id: string }) {
  const { t } = useLanguage()
  const { getTitle: getRssTitle, getSummary: getRssSummary } = useRssTranslations()
  const localizedTitle = getRssTitle(id, t(`news.rss.${id}.title`, { defaultValue: item.title }))
  const localizedSummary = getRssSummary(id, t(`news.rss.${id}.summary`, { defaultValue: '' }))
  const backLabel = t('news.screenedPage.backToNews', { defaultValue: '返回最新资讯' })
  const externalHint = t('news.rss.externalHint', { defaultValue: '本文由外部来源发布，请点击下方链接阅读全文。' })
  const readOriginal = t('news.readOriginal', { defaultValue: '阅读原文' })

  return (
    <PageLayout>
      <article className="min-h-screen">
        <section className="relative md:pt-28 md:pb-16 bg-gradient-to-br from-blue-50 to-white" style={{ paddingTop: '5rem', paddingBottom: '1rem' }}>
          <div className="container-custom" style={{ paddingTop: '1rem' }}>
            <Link href="/news" className="inline-flex items-center gap-2 text-navy-700 hover:text-navy-900 md:mb-6 transition-colors" style={{ marginBottom: '0.75rem' }}>
              <ArrowLeft className="w-4 h-4" />
              <span>{backLabel}</span>
            </Link>
            <div className="flex items-center gap-3 text-sm text-gray-600 md:mb-3" style={{ marginBottom: '0.5rem' }}>
              <Calendar className="w-4 h-4" />
              <time dateTime={item.date}>{item.date}</time>
              <span>{item.source}</span>
            </div>
            <h1 className="text-3xl font-bold text-navy-900 md:mb-6" style={{ marginBottom: '0.75rem' }}>
              {localizedTitle}
            </h1>
          </div>
        </section>
        <section className="section-padding bg-white" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
          <div className="container-custom max-w-4xl">
            {localizedSummary ? (
              <p className="text-gray-800 mb-4 leading-relaxed">{localizedSummary}</p>
            ) : (
              <p className="text-gray-800 mb-4">{externalHint}</p>
            )}
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
              <ExternalLink className="w-4 h-4" />
              {readOriginal}
            </a>
            <div className="md:mt-12 md:pt-8 border-t border-gray-200" style={{ marginTop: '1rem', paddingTop: '1rem' }}>
              <Link href="/news" className="inline-flex items-center gap-2 text-navy-700 hover:text-navy-900 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>{backLabel}</span>
              </Link>
            </div>
          </div>
        </section>
      </article>
    </PageLayout>
  )
}
