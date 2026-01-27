'use client'

import PageLayout from '@/components/PageLayout'
import { ArrowLeft, BookOpen } from 'lucide-react'
import Link from 'next/link'
import EncyclopediaContent from '@/components/EncyclopediaContent'
import { useLanguage } from '@/contexts/LanguageContext'

export default function EncyclopediaDetailClient({ entry }: { entry: any }) {
  const { t, language } = useLanguage()

  // 获取翻译后的标题和标签
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

  // 正文与图表：如果该条目提供了对应语言的内容，则优先使用；否则回退到中文原文
  const localized = entry?.i18n?.[language]
  const content = (localized?.content as string | undefined) || entry.content
  const charts = (localized?.charts as any[] | undefined) || (entry.charts as any)

  return (
    <PageLayout>
      <article className="min-h-screen">
        {/* 头部 */}
        <section className="relative md:pt-28 md:pb-16 bg-gradient-to-br from-green-50 to-white" style={{ paddingTop: '4rem', paddingBottom: '1rem' }}>
          <div className="container-custom">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-navy-700 hover:text-navy-900 md:mb-6 transition-colors"
              style={{ marginBottom: '0.75rem' }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('common.backToHome')}</span>
            </Link>
            
            <div className="flex items-center gap-3 md:mb-4" style={{ marginBottom: '0.5rem' }}>
              <BookOpen className="w-5 h-5 text-green-600" />
              <span className="inline-flex items-center px-3 py-1 text-sm rounded-full bg-green-600 text-white border border-green-500" suppressHydrationWarning>
                {getEncyclopediaTag(entry.slug, entry.tag)}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 md:mb-6" style={{ marginBottom: '0.75rem' }} suppressHydrationWarning>
              {getEncyclopediaTitle(entry.slug, entry.title)}
            </h1>
          </div>
        </section>

        {/* 内容 */}
        <section className="section-padding" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
          <div className="container-custom max-w-4xl">
            <EncyclopediaContent 
              content={content} 
              charts={charts as any}
            />

            {/* 返回按钮 */}
            <div className="md:mt-12 md:pt-8 border-t border-gray-400" style={{ marginTop: '1rem', paddingTop: '1rem' }}>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-gray-200 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('common.backToHome')}</span>
              </Link>
            </div>
          </div>
        </section>
      </article>
    </PageLayout>
  )
}

