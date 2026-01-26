import type { MetadataRoute } from 'next'

function getBaseUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
    'http://localhost:3000'

  return raw.replace(/\/+$/, '')
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl()

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

