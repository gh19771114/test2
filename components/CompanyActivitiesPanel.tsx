'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { latestNews } from '@/lib/knowledge'

type Props = {
  limit?: number
  className?: string
}

export default function CompanyActivitiesPanel({ limit = 6, className = '' }: Props) {
  const { t } = useLanguage()

  const items = useMemo(() => {
    const activities = latestNews.filter((n) => n.category === '公司活动')
    return [...activities].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, limit)
  }, [limit])

  const getNewsTitle = (slug: string) => {
    const translated = t(`news.items.${slug}.title`)
    if (!translated || translated === `news.items.${slug}.title`) return slug
    return translated
  }

  return (
    <aside className={className}>
      <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-bold text-navy-800">{t('careers.companyInfoTitle')}</h3>
        </div>

        {items.length === 0 ? (
          <div className="px-6 py-8 text-sm text-gray-500">{t('home.insights.noNews')}</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <Link
                key={item.slug}
                href={`/news/${item.slug}`}
                className="flex gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="relative w-20 h-14 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {item.image ? (
                    <Image src={item.image} alt="" fill className="object-cover" sizes="80px" />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-gray-400">{item.date}</div>
                  <div className="text-sm font-medium text-gray-800 line-clamp-2">{getNewsTitle(item.slug)}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}

