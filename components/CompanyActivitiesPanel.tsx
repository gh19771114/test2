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

export default function CompanyActivitiesPanel({ limit = 8, className = '' }: Props) {
  const { t } = useLanguage()

  const activities = useMemo(() => {
    const sorted = [...latestNews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    const activitiesOnly = sorted.filter((n) => n.category === '公司活动')
    return activitiesOnly.slice(0, limit)
  }, [limit])

  const getNewsTitle = (slug: string) => {
    const translated = t(`news.items.${slug}.title`)
    if (!translated || translated === `news.items.${slug}.title`) return slug
    return translated
  }

  const renderItem = (item: any) => {
    return (
      <Link
        key={item.slug}
        href={`/news/${item.slug}`}
        className="flex gap-3 px-6 py-3 hover:bg-gray-50 transition-colors"
      >
        <div className="relative w-20 h-14 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
          {item.image ? <Image src={item.image} alt="" fill className="object-cover" sizes="80px" /> : null}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                item.category === '公司活动'
                  ? 'text-green-700 bg-green-50 border-green-200'
                  : 'text-green-700 bg-green-50 border-green-200'
              }`}
            >
              {t('news.category.companyActivity')}
            </span>
            <div className="text-xs text-gray-400">{item.date}</div>
          </div>
          <div className="text-sm font-medium text-gray-800 line-clamp-2 mt-1">{getNewsTitle(item.slug)}</div>
        </div>
      </Link>
    )
  }

  const renderEmptySlot = (_: unknown, idx: number) => {
    return (
      <div key={`empty-${idx}`} className="flex gap-3 px-6 py-3">
        <div className="w-20 h-14 flex-shrink-0 rounded-lg bg-gray-100" />
        <div className="min-w-0 flex-1">
          <div className="h-4" />
          <div className="h-4 mt-1" />
        </div>
      </div>
    )
  }

  return (
    <aside className={className}>
      <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-bold text-navy-800">{t('careers.companyInfoTitle')}</h3>
          <div className="mt-1 text-xs font-bold text-gray-600 tracking-wide">
            {t('news.category.companyActivity')}
          </div>
        </div>

        <div className="max-h-[calc(100vh-10rem)] overflow-y-auto divide-y divide-gray-100">
          {activities.length > 0 ? activities.map(renderItem) : null}
          {Array.from({ length: Math.max(0, limit - activities.length) }).map(renderEmptySlot)}
        </div>
      </div>
    </aside>
  )
}

