import type { Metadata, Viewport } from 'next'
import { headers } from 'next/headers'
import './globals.css'
import localFont from 'next/font/local'
import { LanguageProvider } from '@/contexts/LanguageContext'

type SiteLocale = 'zh' | 'zh-TW' | 'zh-HK' | 'ja' | 'en'

// 多语言站点标题与描述（用于 SEO / 搜索结果显示）
const SITE_TITLE_BY_LOCALE: Record<SiteLocale, string> = {
  zh: 'Bourn Mark 川雨流痕-专业的日本房地产买卖和投资物业管理公司',
  'zh-TW': 'Bourn Mark 川雨流痕-專業的日本房地產買賣與投資物業管理公司',
  'zh-HK': 'Bourn Mark 川雨流痕-專業的日本房地產買賣與投資物業管理公司',
  ja: '株式会社ボーンマーク（Bourn Mark）川雨流痕-日本の不動産売買・投資用物件の管理',
  en: 'Bourn Mark - Japan Real Estate Sales, Investment & Property Management',
}

const SITE_DESCRIPTION_BY_LOCALE: Record<SiteLocale, string> = {
  zh: '提供专业的日本房地产买卖咨询中介服务，以及投资型房地产的物业管理服务。让您在日本的投资更省心、更增值。',
  'zh-TW': '提供專業的日本房地產買賣諮詢中介服務，以及投資型房地產的物業管理服務。讓您在日本投資更省心、更增值。',
  'zh-HK': '提供專業的日本房地產買賣諮詢中介服務，以及投資型房地產的物業管理服務。讓您在日本投資更省心、更增值。',
  ja: '株式会社ボーンマーク（ボーンマーク）。不動産売買仲介・不動産管理する専門会社。日本不動産投資をより安心・有利に。',
  en: 'Professional Japan real estate sales, investment property management, and advisory. Your trusted partner for investing in Japan.',
}

async function getLocaleFromHeaders(): Promise<SiteLocale> {
  const headersList = await headers()
  const acceptLanguage = headersList.get('accept-language') || ''
  const lower = acceptLanguage.toLowerCase()
  if (lower.includes('zh-tw') || lower.includes('zh-hk')) return 'zh-TW'
  if (lower.includes('zh')) return 'zh'
  if (lower.includes('ja')) return 'ja'
  if (lower.includes('en')) return 'en'
  return 'zh'
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

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Bourn Mark',
  alternateName: ['株式会社ボーンマーク', '川雨流痕','Bournmrak' ,'Bourn mark'],
  url: 'https://bournmark.com',
  description: '日本不动产管理公司',
  sameAs: ['https://www.facebook.com/bournmarkjapan/', 'https://www.youtube.com/@bournmark'],
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
  const locale = await getLocaleFromHeaders()
  const title = SITE_TITLE_BY_LOCALE[locale]
  const description = SITE_DESCRIPTION_BY_LOCALE[locale]
  const keywords = KEYWORDS_BY_LOCALE[locale]
  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    keywords,
    authors: [{ name: 'Bourn Mark' }],
    icons: {
      icon: '/imgs/logo-icon.png',
      shortcut: '/imgs/logo-icon.png',
      apple: '/imgs/logo-icon.png',
    },
    openGraph: {
      title,
      description,
      type: 'website',
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
  const locale = await getLocaleFromHeaders()
  const htmlLang = HTML_LANG_BY_LOCALE[locale]
  return (
    <html lang={htmlLang} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body
        className={`${notoSansSc.variable} antialiased font-sans`}
        suppressHydrationWarning
      >
        <LanguageProvider>
        {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
