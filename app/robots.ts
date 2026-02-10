import type { MetadataRoute } from 'next'

const CANONICAL_HOST = 'https://bournmark.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/tenant/kaiyaku/preview'],
      },
    ],
    sitemap: `${CANONICAL_HOST}/sitemap.xml`,
    host: CANONICAL_HOST.replace(/^https?:\/\//, ''),
  }
}
