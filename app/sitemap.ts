import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'

import { encyclopediaEntries, latestNews } from '@/lib/knowledge'
import { caseDates, caseIds } from '@/lib/casesData'
import { maimaiAllPropertyCards } from '@/app/maimai/propertiesData'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

async function getBaseUrl() {
  // Prefer runtime request host so custom domains work
  // even when env vars are missing/mis-scoped on Vercel.
  try {
    const h = await headers()
    const host = h.get('x-forwarded-host') || h.get('host')
    const proto = h.get('x-forwarded-proto') || 'https'
    if (host) return `${proto}://${host}`.replace(/\/+$/, '')
  } catch {
    // ignore
  }

  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
    'http://localhost:3000'

  return raw.replace(/\/+$/, '')
}

function parseLooseDate(input: string | undefined): Date | undefined {
  if (!input) return undefined

  // Accept: YYYY-MM-DD, YYYY/MM/DD, YYYY/MM, YYYY/MM/DD...
  const normalized = input.trim().replace(/\//g, '-')
  const parts = normalized.split('-').filter(Boolean)
  if (parts.length === 0) return undefined

  const y = Number(parts[0])
  const m = parts.length >= 2 ? Number(parts[1]) : 1
  const d = parts.length >= 3 ? Number(parts[2]) : 1
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return undefined

  const dt = new Date(Date.UTC(y, Math.max(1, m) - 1, Math.max(1, d)))
  if (Number.isNaN(dt.getTime())) return undefined
  return dt
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = await getBaseUrl()
  const now = new Date()

  const items: MetadataRoute.Sitemap = []
  const seen = new Set<string>()

  const addUrl = (
    path: string,
    opts?: Omit<MetadataRoute.Sitemap[number], 'url'> & { lastModified?: Date }
  ) => {
    const url = new URL(path, baseUrl).toString()
    if (seen.has(url)) return
    seen.add(url)

    items.push({
      url,
      lastModified: opts?.lastModified || now,
      changeFrequency: opts?.changeFrequency,
      priority: opts?.priority,
    })
  }

  // Core pages
  addUrl('/', { changeFrequency: 'weekly', priority: 1 })
  addUrl('/cases', { changeFrequency: 'weekly', priority: 0.8 })
  addUrl('/news', { changeFrequency: 'daily', priority: 0.8 })
  addUrl('/encyclopedia', { changeFrequency: 'weekly', priority: 0.8 })
  addUrl('/maimai', { changeFrequency: 'weekly', priority: 0.8 })
  addUrl('/qichu', { changeFrequency: 'monthly', priority: 0.7 })
  addUrl('/touzi', { changeFrequency: 'monthly', priority: 0.7 })
  addUrl('/wuye', { changeFrequency: 'monthly', priority: 0.7 })
  addUrl('/wuye/zengzhi', { changeFrequency: 'monthly', priority: 0.7 })
  addUrl('/wuye/zulin', { changeFrequency: 'monthly', priority: 0.7 })
  addUrl('/wuye/xiushan', { changeFrequency: 'monthly', priority: 0.7 })
  addUrl('/wuye/shouzhi', { changeFrequency: 'monthly', priority: 0.7 })
  addUrl('/wuye/ruzhu', { changeFrequency: 'monthly', priority: 0.7 })
  addUrl('/wuye/baoxian', { changeFrequency: 'monthly', priority: 0.7 })

  addUrl('/company/overview', { changeFrequency: 'monthly', priority: 0.6 })
  addUrl('/company/history', { changeFrequency: 'monthly', priority: 0.6 })
  addUrl('/company/ceo', { changeFrequency: 'yearly', priority: 0.5 })
  addUrl('/company/philosophy', { changeFrequency: 'yearly', priority: 0.5 })
  addUrl('/company/sns', { changeFrequency: 'yearly', priority: 0.4 })
  addUrl('/careers', { changeFrequency: 'weekly', priority: 0.6 })
  addUrl('/privacy', { changeFrequency: 'yearly', priority: 0.2 })

  // Tenant pages (kept low priority; excludes preview)
  addUrl('/tenant', { changeFrequency: 'monthly', priority: 0.2 })
  addUrl('/tenant/kaiyaku', { changeFrequency: 'monthly', priority: 0.2 })

  // Dynamic: News
  for (const n of latestNews) {
    addUrl(`/news/${n.slug}`, {
      lastModified: parseLooseDate(n.date) || now,
      changeFrequency: 'yearly',
      priority: 0.55,
    })
  }

  // Dynamic: Encyclopedia
  for (const e of encyclopediaEntries) {
    addUrl(`/encyclopedia/${e.slug}`, {
      changeFrequency: 'yearly',
      priority: 0.55,
    })
  }

  // Dynamic: Success cases
  for (const id of caseIds) {
    // WPS：删除子页面，不输出到 sitemap
    if (id === 'kingsoft-wps-japan') continue
    addUrl(`/cases/${id}`, {
      lastModified: parseLooseDate(caseDates[id]) || now,
      changeFrequency: 'yearly',
      priority: 0.55,
    })
  }

  // Dynamic: Maimai property detail pages
  for (const p of maimaiAllPropertyCards) {
    addUrl(p.href, {
      changeFrequency: 'weekly',
      priority: 0.6,
    })
  }

  return items
}

