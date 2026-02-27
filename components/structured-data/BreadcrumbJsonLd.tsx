'use client'

import { usePathname } from 'next/navigation'

const SITE_URL = 'https://bournmark.com'

// 路径片段 -> 面包屑名称（英文，供搜索引擎），不显示在页面上
const SEGMENT_NAMES: Record<string, string> = {
  maimai: 'Property Sales',
  wuye: 'Property Management',
  zulin: 'Rental',
  shouzhi: 'Income & Expense',
  xiushan: 'Repairs',
  zengzhi: 'Value-Added',
  ruzhu: 'Move-in Support',
  baoxian: 'Insurance',
  qichu: 'Global Expansion',
  touzi: 'Investment',
  cases: 'Case Studies',
  company: 'Company',
  overview: 'Overview',
  history: 'History',
  philosophy: 'Philosophy',
  ceo: 'CEO Message',
  sns: 'SNS',
  careers: 'Careers',
  tenant: 'Tenant Services',
  privacy: 'Privacy Policy',
}

function getBreadcrumbItems(pathname: string): { name: string; path: string }[] {
  const items: { name: string; path: string }[] = []
  const segments = pathname.split('/').filter(Boolean)
  let path = ''

  items.push({ name: 'Home', path: SITE_URL + '/' })

  for (const segment of segments) {
    path += '/' + segment
    const name = SEGMENT_NAMES[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1)
    items.push({ name, path: SITE_URL + path })
  }

  return items
}

/** 仅输出 BreadcrumbList JSON-LD 供搜索引擎使用，页面上无任何展示 */
export function BreadcrumbJsonLd() {
  const pathname = usePathname()
  const items = getBreadcrumbItems(pathname ?? '')

  if (items.length <= 1) return null

  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.path,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
    />
  )
}
