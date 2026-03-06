'use client'

import { useState, useEffect } from 'react'
import PageLayout from '@/components/PageLayout'
import { Calendar, ArrowLeft, Newspaper, BarChart3, Filter } from 'lucide-react'
import Link from 'next/link'
import { getLatestNews } from '@/lib/knowledge'
import { getJapanRealEstateNewsById } from '@/data/japanRealEstateNews'
import { useLanguage } from '@/contexts/LanguageContext'
import { useRssTranslations } from '@/hooks/useRssTranslations'

type LatestItem = { slug: string; date: string; realEstateId?: string; isPinned?: boolean; category?: string; isNotice?: boolean } | { slug: string; date: string; title: string; source: string; link: string }

export default function NewsListPage() {
  const { t } = useLanguage()
  const { getTitle: getRssTitle } = useRssTranslations()
  const [items, setItems] = useState<LatestItem[]>(() => getLatestNews())
  useEffect(() => {
    fetch('/api/news/latest').then((r) => r.ok ? r.json() : { items: [] }).then((d: { items: LatestItem[] }) => { if (d.items?.length) setItems(d.items) }).catch(() => {})
  }, [])
  const getNewsTitle = (slug: string) => {
    if (slug.startsWith('real-estate-')) {
      const id = slug.slice('real-estate-'.length)
      const item = getJapanRealEstateNewsById(id)
      const localized = t(`news.realEstate.${id}.title`, { defaultValue: '' })
      if (localized) return localized
      return item?.title ?? slug
    }
    return t(`news.items.${slug}.title`, { defaultValue: slug })
  }
  const getItemTitle = (news: LatestItem) => {
    if ('title' in news && news.slug.startsWith('rss-')) {
      return getRssTitle(news.slug.slice(4), news.title)
    }
    return 'title' in news ? news.title : getNewsTitle(news.slug)
  }
  const getItemHref = (news: LatestItem) => (news.slug.startsWith('rss-') ? `/news/rss/${news.slug.slice(4)}` : `/news/${news.slug}`)

  const getCategoryLabel = (news: LatestItem) => {
    if ('category' in news && news.category) {
      if (news.category === '公司活动') return t('news.category.companyActivity')
      if (news.category === '通知') return t('news.category.notice')
      return news.category
    }
    if ('isNotice' in news && news.isNotice) return t('news.category.notice')
    return t('news.category.news')
  }

  const sortedNews = [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <PageLayout>
        <div className="min-h-screen">
        {/* 头部 */}
        <section className="relative md:pt-28 md:pb-16 bg-gradient-to-br from-blue-50 to-white" style={{ paddingTop: '5rem', paddingBottom: '1rem' }}>
          <div className="container-custom" style={{ paddingTop: '1rem' }}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-navy-700 hover:text-navy-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('news.backToHome')}</span>
            </Link>
            
            <div className="flex items-center gap-3 mb-4">
              <Newspaper className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900">
                {t('news.title')}
              </h1>
            </div>
            
            <p className="text-lg text-gray-600 max-w-3xl">
              {t('news.subtitle')}
            </p>

            {/* 不动产动向解读入口 + 精选房地产新闻入口 */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/news/real-estate-outlook"
                className="inline-flex items-center gap-3 rounded-xl bg-navy-800 text-white px-5 py-3 hover:bg-navy-700 transition-colors shadow-md"
              >
                <BarChart3 className="w-6 h-6" />
                <span className="font-semibold">{t('news.outlookEntry')}</span>
              </Link>
              <Link
                href="/news/real-estate-screened"
                className="inline-flex items-center gap-3 rounded-xl border-2 border-navy-600 text-navy-800 px-5 py-3 hover:bg-navy-50 transition-colors shadow-sm"
              >
                <Filter className="w-6 h-6" />
                <span className="font-semibold">{t('news.screenedEntry')}</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 新闻列表 */}
        <section className="section-padding" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
          <div className="container-custom max-w-5xl">
            <div className="md:space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {sortedNews.map((news) => (
                <Link
                  key={news.slug}
                  href={getItemHref(news)}
                  className="block rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 md:p-6 hover:shadow-lg hover:border-navy-300 transition-all duration-200 group"
                  style={{ padding: '0.25rem' }}
                >
                  <div className="flex items-start md:gap-4" style={{ gap: '0.25rem' }}>
                    <div className="flex-shrink-0 w-3 h-3 rounded-full bg-navy-500 group-hover:bg-navy-700 transition-colors" style={{ marginTop: '0.0625rem' }}></div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-navy-900 md:mb-2 group-hover:text-navy-700 transition-colors" style={{ marginBottom: '0.0625rem' }}>
                        <span className={`font-semibold mr-2 ${
                          'category' in news && news.category === '公司活动' ? 'text-green-600' :
                          'isNotice' in news && news.isNotice || ('category' in news && news.category === '通知') ? 'text-red-600' :
                          'text-blue-600'
                        }`}>
                          {getCategoryLabel(news)}
                        </span>
                        {getItemTitle(news)}
                      </h2>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <time dateTime={news.date}>{news.date}</time>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* 返回按钮 */}
            <div className="mt-12 pt-8 border-t border-gray-300">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-navy-700 hover:text-navy-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('news.backToHome')}</span>
              </Link>
            </div>
          </div>
        </section>
        </div>
    </PageLayout>
  )
}
