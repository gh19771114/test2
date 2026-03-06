import type { Metadata, Viewport } from 'next'
import { headers } from 'next/headers'
import './globals.css'
import localFont from 'next/font/local'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { BreadcrumbStructuredData } from '@/components/BreadcrumbStructuredData'
import { PerformanceMeasureGuard } from '@/components/PerformanceMeasureGuard'

type SiteLocale = 'zh' | 'zh-TW' | 'zh-HK' | 'ja' | 'en'

// 多语言站点标题与描述（用于 SEO / 搜索结果显示）
const SITE_TITLE_BY_LOCALE: Record<SiteLocale, string> = {
  zh: '株式会社ボーンマーク Bourn Mark 川雨流痕-专业的日本房地产买卖和投资物业管理公司',
  'zh-TW': '株式会社ボーンマーク Bourn Mark 川雨流痕-專業的日本房地產買賣與投資物業管理公司',
  'zh-HK': '株式会社ボーンマーク Bourn Mark 川雨流痕-專業的日本房地產買賣與投資物業管理公司',
  ja: '株式会社ボーンマーク（Bourn Mark）川雨流痕-日本の不動産売買・投資用物件の管理',
  en: '株式会社ボーンマーク Bourn Mark - Japan Real Estate Sales, Investment & Property Management',
}

const SITE_DESCRIPTION_BY_LOCALE: Record<SiteLocale, string> = {
  zh: '提供专业的日本房地产买卖咨询中介服务，以及投资型房地产的物业管理服务。让您在日本的投资更省心、更增值。联系电话：03-6661-7745',
  'zh-TW': '提供專業的日本房地產買賣諮詢中介服務，以及投資型房地產的物業管理服務。讓您在日本投資更省心、更增值。聯繫電話：03-6661-7745',
  'zh-HK': '提供專業的日本房地產買賣諮詢中介服務，以及投資型房地產的物業管理服務。讓您在日本投資更省心、更增值。聯絡電話：03-6661-7745',
  ja: '株式会社ボーンマーク（ボーンマーク）。不動産売買仲介・不動産管理する専門会社。日本不動産投資をより安心・有利に。TEL：03-6661-7745',
  en: 'Professional Japan real estate sales, investment property management, and advisory. Your trusted partner for investing in Japan. Tel: 03-6661-7745',
}

function getLocaleFromAcceptLanguage(acceptLanguage: string): SiteLocale {
  const lower = acceptLanguage.toLowerCase()
  if (lower.includes('zh-tw') || lower.includes('zh-hk')) return 'zh-TW'
  if (lower.includes('zh')) return 'zh'
  if (lower.includes('ja')) return 'ja'
  if (lower.includes('en')) return 'en'
  return 'zh'
}

const COOKIE_LOCALE = 'NEXT_LOCALE'
const VALID_LOCALES: SiteLocale[] = ['zh', 'zh-TW', 'zh-HK', 'ja', 'en']

/** 服务端用于首屏：先读 cookie（用户曾选过的语言），再回退到 Accept-Language，避免打开时先闪中文再切语言 */
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

// 使用本地字体，避免构建阶段依赖 Google Fonts（fonts.gstatic.com）
// 注意：此处实际加载的是 Noto Sans SC（中文简体）字体文件
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

// 公司电话/传真/地址与 Schema.org 保持一致，便于“搜电话、地址找到公司”等 SEO
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

// 营业时间：工作日 10:00-18:00（与页脚一致），Schema 格式 Mo-Fr 10:00-18:00
const OPENING_HOURS_SPEC = {
  '@type': 'OpeningHoursSpecification',
  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  opens: '10:00',
  closes: '18:00',
} as const

const ORGANIZATION_ID = 'https://bournmark.com/#organization'

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: 'Bourn Mark',
  legalName: '株式会社ボーンマーク',
  alternateName: ['株式会社ボーンマーク', '川雨流痕', 'Bournmrak', 'Bourn mark'],
  url: 'https://bournmark.com',
  description: '日本不动产管理公司',
  logo: 'https://bournmark.com/imgs/logo-icon.png',
  image: 'https://bournmark.com/imgs/logo-icon.png',
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

const SITE_URL = 'https://bournmark.com'

// LocalBusiness：利于本地搜索、地图等，仅 JSON-LD 不显示在页面上
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

// WebSite：利于站点级检索、站点链接等，仅 JSON-LD 不显示在页面上
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

// 多语言搜索关键词（按浏览器语言输出对应 meta keywords）
const KEYWORDS_BY_LOCALE: Record<SiteLocale, string[]> = {
  zh: [
    'Bourn Mark',
    'BournMark',
    '川雨流痕',
    '日本不动产管理公司',
    '官网',
    '日本房产',
    '买卖中介',
    '物业管理',
    '企业出海',
    '投资顾问',
    '东京房产',
  ],
  'zh-TW': [
    'Bourn Mark',
    'BournMark',
    '川雨流痕',
    '日本不動產管理公司',
    '官網',
    '日本房產',
    '買賣中介',
    '物業管理',
    '投資顧問',
    '東京房產',
  ],
  'zh-HK': [
    'Bourn Mark',
    'BournMark',
    '川雨流痕',
    '日本不動產管理公司',
    '官網',
    '日本樓',
    '買賣中介',
    '物業管理',
    '投資顧問',
    '東京房產',
  ],
  ja: [
    'ボーンマーク',
    '株式会社ボーンマーク',
    'Bourn Mark',
    '川雨流痕',
    '公式サイト',
    '日本不動産',
    '不動産売買',
    '不動産管理',
    '不動産仲介',
    '賃貸管理',
    'マンション管理',
    '投資用不動産',
    '東京不動産',
    '不動産会社',
    '管理会社',
    '東京都不動産',
    '新宿不動産',
    '渋谷不動産',
  ],
  en: [
    'Bourn Mark',
    'Bournmark',
    'Japan real estate',
    'Official website',
    'Tokyo property',
    'Property management',
    'Real estate investment',
    'Japan property sales',
  ],
}

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || '/'
  const canonical = pathname === '/' ? `${SITE_URL}/` : `${SITE_URL}${pathname.startsWith('/') ? pathname : `/${pathname}`}`

  const locale = await getInitialLocale()
  const title = SITE_TITLE_BY_LOCALE[locale]
  const description = SITE_DESCRIPTION_BY_LOCALE[locale]
  const keywords = KEYWORDS_BY_LOCALE[locale]
  return {
    metadataBase: new URL(SITE_URL),
    alternates: { canonical },
    title: {
      default: title,
      template: `%s | 株式会社ボーンマーク Bourn Mark`,
    },
    description,
    keywords,
    authors: [{ name: '株式会社ボーンマーク Bourn Mark' }],
    icons: {
      icon: '/imgs/logo-icon.png',
      shortcut: '/imgs/logo-icon.png',
      apple: '/imgs/logo-icon.png',
    },
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: '株式会社ボーンマーク Bourn Mark',
    },
    robots: {
      index: true,
      follow: true,
    },
  }
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
  const locale = await getInitialLocale()
  const htmlLang = HTML_LANG_BY_LOCALE[locale]
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
