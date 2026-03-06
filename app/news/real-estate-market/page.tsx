'use client'

import React, { useState, useEffect } from 'react'
import PageLayout from '@/components/PageLayout'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, ChevronDown, ChevronUp, Image as ImageIcon, Rss } from 'lucide-react'
import { getFilteredJapanRealEstateNews } from '@/data/japanRealEstateNews'
import { useLanguage } from '@/contexts/LanguageContext'
import { useRssTranslations } from '@/hooks/useRssTranslations'

type RssItem = { id?: string; title: string; link: string; date: string; source: string }

function toIdFromLink(link: string): string {
  try {
    const bytes = new TextEncoder().encode(link)
    let binary = ''
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
    const base64 = btoa(binary)
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  } catch {
    return ''
  }
}

export default function JapanRealEstateNewsPage() {
  const { t } = useLanguage()
  const { getTitle: getRssTitle } = useRssTranslations()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [rssItems, setRssItems] = useState<RssItem[]>([])
  const [rssLoading, setRssLoading] = useState(true)
  const sorted = getFilteredJapanRealEstateNews()

  // 使用 /api/news/latest 的缓存快照，避免每次打开都请求 google-rss-screened（大量请求易导致 Cursor 崩溃）
  useEffect(() => {
    fetch('/api/news/latest')
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data: { items: Array<{ slug: string; date?: string; title?: string; source?: string; link?: string }> }) => {
        const rss = (data.items || [])
          .filter((x) => x.slug?.startsWith('rss-'))
          .map((x) => ({
            id: x.slug?.slice(4),
            title: x.title ?? '',
            link: x.link ?? '',
            date: x.date ?? '',
            source: x.source ?? 'Google News',
          }))
        setRssItems(rss)
      })
      .catch(() => setRssItems([]))
      .finally(() => setRssLoading(false))
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
              <span>{t('news.backToNews', { defaultValue: '返回最新情报' })}</span>
            </Link>
            <h1 className="text-2xl md:text-4xl font-bold text-navy-900 mb-2">
              {t('news.items.real-estate-market.title', { defaultValue: '日本房地产相关新闻（近3个月·影响地价/房价）' })}
            </h1>
            <p className="text-gray-600 max-w-3xl">
              {t('news.realEstateMarket.pageDesc', { defaultValue: '仅显示近三个月内的新闻；已排除正文过短（仅一两句话）、公司人事任命类条目；下方 RSS 列表会尽量排除需登录/付费才能看全文的链接（通过访问链接检测）。标题、时间、出处、链接及正文与正文内图片，点击行可展开查看全文与相关图片。' })}
            </p>
            <Link
              href="/news/real-estate-outlook"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-navy-700 text-white px-4 py-2 text-sm font-medium hover:bg-navy-600 transition-colors"
            >
              {t('news.realEstateMarket.outlookLink', { defaultValue: '查看近期动向与未来预期解读' })}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </section>

        <section className="section-padding py-6 md:py-10">
          <div className="container-custom px-4 max-w-5xl">
            {sorted.length === 0 ? (
              <p className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
                {t('news.realEstateMarket.noCurated', { defaultValue: '近三个月内暂无收录的房地产相关新闻，请稍后再看或补充数据。' })}
              </p>
            ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-sm font-semibold text-navy-800 w-8"></th>
                    <th className="px-4 py-3 text-sm font-semibold text-navy-800">{t('news.realEstateMarket.colTitle', { defaultValue: '标题' })}</th>
                    <th className="px-4 py-3 text-sm font-semibold text-navy-800 whitespace-nowrap">{t('news.realEstateMarket.colDate', { defaultValue: '时间' })}</th>
                    <th className="px-4 py-3 text-sm font-semibold text-navy-800">{t('news.realEstateMarket.colSource', { defaultValue: '出处' })}</th>
                    <th className="px-4 py-3 text-sm font-semibold text-navy-800 w-24">{t('news.realEstateMarket.colLink', { defaultValue: '链接' })}</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((item) => {
                    const isExpanded = expandedId === item.id
                    return (
                      <React.Fragment key={item.id}>
                        <tr
                          key={item.id}
                          className="border-b border-gray-100 hover:bg-gray-50/80 cursor-pointer transition-colors"
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        >
                          <td className="px-4 py-3 text-gray-500">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-medium text-navy-800 line-clamp-2">{item.title}</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{item.date}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.source}</td>
                          <td className="px-4 py-3">
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="w-4 h-4" />
                              {t('news.readOriginal', { defaultValue: '原文' })}
                            </a>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr key={`${item.id}-detail`} className="border-b border-gray-200 bg-gray-50/50">
                            <td colSpan={5} className="px-4 py-4">
                              <div className="space-y-4">
                                <div>
                                  <h3 className="text-sm font-semibold text-navy-800 mb-2">{t('news.realEstateMarket.bodyLabel', { defaultValue: '正文' })}</h3>
                                  <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed max-h-[400px] overflow-y-auto rounded-lg bg-white p-4 border border-gray-100">
                                    {item.body}
                                  </div>
                                </div>
                                {item.images && item.images.length > 0 && (
                                  <div>
                                    <h3 className="text-sm font-semibold text-navy-800 mb-2 flex items-center gap-1">
                                      <ImageIcon className="w-4 h-4" />
                                      {t('news.realEstateMarket.bodyImages', { defaultValue: '正文相关图片' })}
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                      {item.images.map((src, idx) => (
                                        <a
                                          key={idx}
                                          href={src}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="block relative w-48 h-32 rounded-lg overflow-hidden border border-gray-200 bg-gray-100"
                                        >
                                          {/* eslint-disable-next-line @next/next/no-img-element */}
                                          <img
                                            src={src}
                                            alt={t('news.realEstateMarket.imageAlt', { defaultValue: '报道插图' }) + ` ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                          />
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
            )}

            {/* Google News RSS 抓取列表：标题按当前语言显示（rssTranslations），其余同前 */}
            <div className="mt-10">
              <h2 className="text-lg font-semibold text-navy-800 mb-3 flex items-center gap-2">
                <Rss className="w-5 h-5 text-amber-600" />
                {t('news.realEstateMarket.rssHeading', { defaultValue: '来自 Google News RSS（日本・不動産相关，近3个月，已筛选）' })}
              </h2>
              {rssLoading ? (
                <p className="text-gray-500 text-sm">{t('news.realEstateMarket.rssLoading', { defaultValue: '正在抓取 RSS…' })}</p>
              ) : rssItems.length === 0 ? (
                <p className="text-gray-500 text-sm">{t('news.realEstateMarket.rssEmpty', { defaultValue: '暂无 RSS 条目或抓取失败。' })}</p>
              ) : (
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="px-4 py-2 text-sm font-semibold text-navy-800">{t('news.realEstateMarket.colTitle', { defaultValue: '标题' })}</th>
                        <th className="px-4 py-2 text-sm font-semibold text-navy-800 w-28">{t('news.realEstateMarket.colDate', { defaultValue: '日期' })}</th>
                        <th className="px-4 py-2 text-sm font-semibold text-navy-800 w-32">{t('news.realEstateMarket.colSource', { defaultValue: '出处' })}</th>
                        <th className="px-4 py-2 text-sm font-semibold text-navy-800 w-20">{t('news.realEstateMarket.colLink', { defaultValue: '链接' })}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rssItems.map((item, idx) => {
                        const id = item.id ?? toIdFromLink(item.link)
                        const displayTitle = getRssTitle(id, item.title)
                        return (
                          <tr key={id || idx} className="border-b border-gray-100 hover:bg-gray-50/80">
                            <td className="px-4 py-2 text-sm text-navy-800 line-clamp-2">{displayTitle}</td>
                            <td className="px-4 py-2 text-sm text-gray-600 whitespace-nowrap">{item.date}</td>
                            <td className="px-4 py-2 text-sm text-gray-600">{item.source}</td>
                            <td className="px-4 py-2">
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                              >
                                <ExternalLink className="w-4 h-4" />
                                {t('news.realEstateMarket.readLink', { defaultValue: '阅读' })}
                              </a>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-navy-700 hover:text-navy-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('news.backToNews', { defaultValue: '返回最新情报' })}</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
