import type { Metadata, Viewport } from 'next'
import { headers } from 'next/headers'
import './globals.css'
import localFont from 'next/font/local'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { BreadcrumbStructuredData } from '@/components/BreadcrumbStructuredData'
import { PerformanceMeasureGuard } from '@/components/PerformanceMeasureGuard'
import { SITE_URL } from '@/lib/i18n-home-seo'
import { getHomePathLocale } from '@/lib/home-path-locale'

type SiteLocale = 'zh' | 'zh-TW' | 'zh-HK' | 'ja' | 'en'

function getLocaleFromAcceptLanguage(acceptLanguage: string): SiteLocale {
  const t = acceptLanguage.trim()
  if (!t) return 'zh'
  const lower = t.toLowerCase()
  if (lower.includes('zh-hk') || lower.includes('zh-hant-hk')) return 'zh-HK'
  if (lower.includes('zh-tw') || lower.includes('zh-hant-tw')) return 'zh-TW'
  if (lower.includes('zh-cn') || lower.includes('zh-hans')) return 'zh'
  if (lower.includes('zh')) return 'zh'
  if (lower.includes('ja')) return 'ja'
  if (lower.includes('en')) return 'en'
  return 'zh'
}

const COOKIE_LOCALE = 'NEXT_LOCALE'
const VALID_LOCALES: SiteLocale[] = ['zh', 'zh-TW', 'zh-HK', 'ja', 'en']

/** 内页等非「五语言首页」路径：沿用 cookie / Accept-Language（与改造前一致） */
async function getInitialLocale(): Promise<SiteLocale> {
  const headersList = await headers()
  const cookie = headersList.get('cookie') || ''
  const match = cookie.match(new RegExp(`${COOKIE_LOCALE}=([^;]+)`))
  const fromCookie = match?.[1]?.trim()
  if (fromCookie && VALID_LOCALES.includes(fromCookie as SiteLocale)) {
    return fromCookie as SiteLocale
  }
  const acceptLanguage = headersList.get('accept-language') || ''
  return getLocaleFromAcceptLanguage(acceptLanguage)
}

const notoSansSc = localFont({
  src: [
    {
      path: '../public/fonts/NotoSansSC-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-noto-sans-sc',
})

const COMPANY_PHONE = '+81-3-6661-7745'
const COMPANY_FAX = '+81-3-6661-7744'
const COMPANY_EMAIL = 'info@bournmark.jp'

const organizationAddress = {
  '@type': 'PostalAddress',
  addressCountry: 'JP',
  addressRegion: '東京都',
  addressLocality: '中央区',
  streetAddress: '日本橋人形町1-2-12 Bourn Mark Ningyocho BLD. 2F',
} as const

const OPENING_HOURS_SPEC = {
  '@type': 'OpeningHoursSpecification',
  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  opens: '10:00',
  closes: '18:00',
} as const

const ORGANIZATION_ID = `${SITE_URL}/#organization`

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: 'Bourn Mark',
  legalName: '株式会社ボーンマーク',
  alternateName: ['株式会社ボーンマーク', '川雨流痕', 'Bournmrak', 'Bourn mark'],
  url: SITE_URL,
  description: '日本不动产管理公司',
  logo: `${SITE_URL}/imgs/logo-icon.png`,
  image: `${SITE_URL}/imgs/logo-icon.png`,
  telephone: COMPANY_PHONE,
  faxNumber: COMPANY_FAX,
  email: COMPANY_EMAIL,
  address: organizationAddress,
  openingHoursSpecification: OPENING_HOURS_SPEC,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: COMPANY_PHONE,
    email: COMPANY_EMAIL,
    contactType: 'customer service',
    areaServed: 'JP',
    availableLanguage: ['Japanese', 'Chinese', 'English'],
    hoursAvailable: OPENING_HOURS_SPEC,
  },
  sameAs: ['https://www.facebook.com/bournmarkjapan/', 'https://www.youtube.com/@bournmark'],
} as const

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'Bourn Mark',
  legalName: '株式会社ボーンマーク',
  url: SITE_URL,
  description: '日本不动产管理公司',
  telephone: COMPANY_PHONE,
  faxNumber: COMPANY_FAX,
  email: COMPANY_EMAIL,
  address: organizationAddress,
  openingHoursSpecification: OPENING_HOURS_SPEC,
  logo: `${SITE_URL}/imgs/logo-icon.png`,
  image: `${SITE_URL}/imgs/logo-icon.png`,
} as const

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: '株式会社ボーンマーク Bourn Mark',
  alternateName: ['Bourn Mark', '川雨流痕'],
  url: SITE_URL,
  description: '日本不动产管理公司',
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: ['ja', 'zh-Hans', 'zh-Hant', 'en'],
} as const

/**
 * 全站内页默认 SEO（非首页五 URL）。首页 title/description/canonical/hreflang 由各语言 page.tsx 固定输出。
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: '株式会社ボーンマーク Bourn Mark',
    template: '%s | 株式会社ボーンマーク Bourn Mark',
  },
  description:
    '株式会社ボーンマーク（Bourn Mark）。日本の不動産売買仲介・投資用不動産の管理。川雨流痕。',
  authors: [{ name: '株式会社ボーンマーク Bourn Mark' }],
  icons: {
    icon: '/imgs/logo-icon.png',
    shortcut: '/imgs/logo-icon.png',
    apple: '/imgs/logo-icon.png',
  },
  openGraph: {
    type: 'website',
    siteName: '株式会社ボーンマーク Bourn Mark',
    images: [
      {
        url: '/imgs/og-share.png',
        width: 1200,
        height: 630,
        alt: '株式会社ボーンマーク Bourn Mark',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/imgs/og-share.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

const HTML_LANG_BY_LOCALE: Record<SiteLocale, string> = {
  zh: 'zh-CN',
  'zh-TW': 'zh-TW',
  'zh-HK': 'zh-HK',
  ja: 'ja',
  en: 'en',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || '/'
  const home = getHomePathLocale(pathname)

  const locale = home ? home.language : await getInitialLocale()
  const htmlLang = home ? home.htmlLang : HTML_LANG_BY_LOCALE[locale]

  return (
    <html lang={htmlLang} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body
        className={`${notoSansSc.variable} antialiased font-sans`}
        suppressHydrationWarning
      >
        <LanguageProvider initialLocale={locale}>
          <PerformanceMeasureGuard />
          <BreadcrumbStructuredData />
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
