'use client'

import PageLayout from '@/components/PageLayout'
import { Calendar, ArrowLeft, Newspaper } from 'lucide-react'
import Link from 'next/link'
import { latestNews } from '@/lib/knowledge'
import { useLanguage } from '@/contexts/LanguageContext'

export default function NewsListPage() {
  const { t } = useLanguage()

// 获取分类标识
  const getCategoryLabel = (news: any) => {
  if (news.category) {
      // 如果category是"公司活动"，需要翻译
      if (news.category === '公司活动') {
        return t('news.category.companyActivity')
      }
      if (news.category === '通知') {
        return t('news.category.notice')
      }
    return news.category
  }
  if (news.isNotice) {
      return t('news.category.notice')
  }
    return t('news.category.news')
  }

  // 按时间排序，最新的在前
  const sortedNews = [...latestNews].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

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
          </div>
        </section>

        {/* 新闻列表 */}
        <section className="section-padding" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
          <div className="container-custom max-w-5xl">
            <div className="md:space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {sortedNews.map((news) => (
                <Link
                  key={news.slug}
                  href={`/news/${news.slug}`}
                  className="block rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 md:p-6 hover:shadow-lg hover:border-navy-300 transition-all duration-200 group"
                  style={{ padding: '0.25rem' }}
                >
                  <div className="flex items-start md:gap-4" style={{ gap: '0.25rem' }}>
                    <div className="flex-shrink-0 w-3 h-3 rounded-full bg-navy-500 group-hover:bg-navy-700 transition-colors" style={{ marginTop: '0.0625rem' }}></div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-navy-900 md:mb-2 group-hover:text-navy-700 transition-colors" style={{ marginBottom: '0.0625rem' }}>
                        <span className={`font-semibold mr-2 ${
                          news.category === '公司活动' ? 'text-green-600' :
                          news.isNotice || news.category === '通知' ? 'text-red-600' :
                          'text-blue-600'
                        }`}>
                          {getCategoryLabel(news)}
                        </span>
                        {t(`news.items.${news.slug}.title`, { defaultValue: news.slug })}
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
