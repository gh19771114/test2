'use client'

import PageLayout from '@/components/PageLayout'
import { ArrowLeft, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { encyclopediaEntries } from '@/lib/knowledge'
import { useLanguage } from '@/contexts/LanguageContext'

export default function EncyclopediaListPage() {
  const { t } = useLanguage()
  
  // 获取翻译后的标签和标题的辅助函数
  const getEncyclopediaTitle = (slug: string, fallback: string) => {
    const key = `encyclopedia.items.${slug}.title`
    const translated = t(key)
    return translated !== key ? translated : fallback
  }

  const getEncyclopediaTag = (slug: string, fallback: string) => {
    const key = `encyclopedia.items.${slug}.tag`
    const translated = t(key)
    return translated !== key ? translated : fallback
  }

  // 按标签分组（使用原始tag作为分组键，但显示时使用翻译）
  const groupedByTag = encyclopediaEntries.reduce((acc, entry) => {
    if (!acc[entry.tag]) {
      acc[entry.tag] = []
    }
    acc[entry.tag].push(entry)
    return acc
  }, {} as Record<string, typeof encyclopediaEntries>)

  const tags = Object.keys(groupedByTag)

  return (
    <PageLayout>
      <div className="min-h-screen">
        {/* 头部 */}
        <section
          className="relative bg-gradient-to-br from-green-50 to-white pt-[calc(5rem+env(safe-area-inset-top))] pb-4 md:pt-28 md:pb-16"
        >
          <div className="container-custom">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-navy-700 hover:text-navy-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('common.backToHome')}</span>
            </Link>
            
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-8 h-8 text-green-600" />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900">
                {t('home.insights.encyclopediaTitle')}
              </h1>
            </div>
            
            <p className="text-lg text-gray-600 max-w-3xl">
              {t('home.insights.encyclopediaSubtitle')}
            </p>
          </div>
        </section>

        {/* 百科列表 */}
        <section className="section-padding" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
          <div className="container-custom max-w-5xl">
            <div className="md:space-y-8" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {tags.map((tag) => {
                // 获取第一个条目的翻译标签作为分组标题（所有同标签条目应该有相同的翻译）
                const firstEntry = groupedByTag[tag][0]
                const translatedTag = getEncyclopediaTag(firstEntry.slug, tag)
                return (
                <div key={tag}>
                    <h2 className="text-2xl font-bold text-white md:mb-4 pb-2 border-b border-white/25" style={{ marginBottom: '0.375rem', paddingBottom: '0.375rem' }} suppressHydrationWarning>
                      {translatedTag}
                  </h2>
                    <div className="md:space-y-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {groupedByTag[tag].map((entry) => (
                      <Link
                        key={entry.slug}
                        href={`/encyclopedia/${entry.slug}`}
                          className="block rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 md:p-6 hover:shadow-lg hover:border-green-300 transition-all duration-200 group"
                          style={{ padding: '0.25rem' }}
                      >
                          <div className="flex items-start md:gap-4" style={{ gap: '0.25rem' }}>
                          <div className="flex-1">
                              <h3 className="text-xl font-bold text-navy-900 md:mb-2 group-hover:text-navy-700 transition-colors" style={{ marginBottom: '0.0625rem' }} suppressHydrationWarning>
                                {getEncyclopediaTitle(entry.slug, entry.title)}
                            </h3>
                              <span className="inline-flex items-center px-3 py-1 text-xs rounded-full bg-green-600 text-white border border-green-500" suppressHydrationWarning>
                                {getEncyclopediaTag(entry.slug, entry.tag)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
                )
              })}
            </div>

            {/* 返回按钮 */}
            <div className="mt-12 pt-8 border-t border-gray-300">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-navy-700 hover:text-navy-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('common.backToHome')}</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
