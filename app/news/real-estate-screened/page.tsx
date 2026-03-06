'use client'

import React, { useState, useEffect } from 'react'
import PageLayout from '@/components/PageLayout'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Rss } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

type RssItem = { title: string; link: string; date: string; source: string }

export default function RealEstateScreenedPage() {
  const { t } = useLanguage()
  const [items, setItems] = useState<RssItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/news/google-rss-screened')
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data: { items: RssItem[] }) => setItems(data.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageLayout>
      <div className="min-h-screen">
        <section className="relative pt-24 md:pt-28 pb-6 md:pb-10 bg-gradient-to-br from-blue-50 to-white">
          <div className="container-custom px-4">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-navy-700 hover:text-navy-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('news.screenedPage.backToNews')}</span>
            </Link>
            <h1 className="text-2xl md:text-4xl font-bold text-navy-900 mb-2">
              {t('news.screenedPage.title')}
            </h1>
            <p className="text-gray-600 max-w-3xl">
              {t('news.screenedPage.subtitle')}
            </p>
          </div>
        </section>

        <section className="section-padding py-6 md:py-10">
          <div className="container-custom px-4 max-w-5xl">
            {loading ? (
              <p className="text-gray-500 text-sm">{t('news.screenedPage.loading')}</p>
            ) : items.length === 0 ? (
              <p className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
                {t('news.screenedPage.empty')}
              </p>
            ) : (
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-sm font-semibold text-navy-800">{t('news.screenedPage.tableTitle')}</th>
                      <th className="px-4 py-3 text-sm font-semibold text-navy-800 w-28">{t('news.screenedPage.tableDate')}</th>
                      <th className="px-4 py-3 text-sm font-semibold text-navy-800 w-32">{t('news.screenedPage.tableSource')}</th>
                      <th className="px-4 py-3 text-sm font-semibold text-navy-800 w-20">{t('news.screenedPage.tableLink')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50/80">
                        <td className="px-4 py-3 text-sm text-navy-800 line-clamp-2">{item.title}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{item.date}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{item.source}</td>
                        <td className="px-4 py-3">
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                          >
                            <ExternalLink className="w-4 h-4" />
                            {t('news.screenedPage.read')}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-navy-700 hover:text-navy-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('news.screenedPage.backToNews')}</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
