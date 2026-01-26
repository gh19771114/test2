import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'

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

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = await getBaseUrl()

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/tenant/kaiyaku/preview'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

