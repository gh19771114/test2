'use client'

import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

const SITE_URL = 'https://bournmark.com'

// 路径片段对应的面包屑名称（英文，供搜索引擎用，不显示在页面上）
const SEGMENT_NAMES: Record<string, string> = {
  company: 'Company',
  overview: 'Overview',
  history: 'History',
  philosophy: 'Philosophy',
  ceo: 'CEO Message',
  sns: 'SNS',
  careers: 'Careers',
  tenant: 'Tenant Services',
  kaiyaku: 'Kaiyaku',
  preview: 'Preview',
  privacy: 'Privacy Policy',
  cases: 'Cases',
  encyclopedia: 'Encyclopedia',
  news: 'News',
  maimai: 'For Sale',
  touzi: 'Investment',
  qichu: 'Qichu',
  wuye: 'Property Management',
  shouzhi: 'Income & Expense',
  baoxian: 'Insurance',
  zengzhi: 'Value Added',
  xiushan: 'Repair',
  ruzhu: 'Move-in',
  zulin: 'Rental',
}

function getSegmentName(segment: string): string {
  return SEGMENT_NAMES[segment] ?? segment
}

/**
 * 仅输出 BreadcrumbList 的 JSON-LD script，不渲染任何可见内容，供搜索引擎使用。
 */
export function BreadcrumbStructuredData() {
  const pathname = usePathname()
  const jsonLd = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean)
    const itemListElement = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL + '/',
      },
      ...segments.map((segment, index) => {
        const path = '/' + segments.slice(0, index + 1).join('/')
        return {
          '@type': 'ListItem',
          position: index + 2,
          name: getSegmentName(segment),
          item: SITE_URL + path,
        }
      }),
    ]
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement,
    }
  }, [pathname])

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
