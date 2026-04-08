import type { Metadata } from 'next'

/** 首页五套内容与 SEO 配置键；日语对应站点路径为 /jp（见 canonicalPath） */
export type HomeLocale = 'ja' | 'en' | 'zh-cn' | 'zh-tw' | 'zh-hk'

export const SITE_URL = 'https://bournmark.com'

export const HOME_LOCALES: HomeLocale[] = ['ja', 'en', 'zh-cn', 'zh-tw', 'zh-hk']

export type HomeSeoConfig = {
  title: string
  description: string
  keywords: string[]
  htmlLang: string
  canonicalPath: string
  ogLocale: string
  webPageInLanguage: string
}

const KEYWORDS_JA = [
  'ボーンマーク',
  '株式会社ボーンマーク',
  'Bourn Mark',
  '川雨流痕',
  '公式サイト',
  '日本不動産',
  '不動産売買',
  '不動産管理',
  '不動産仲介',
  '投資用不動産',
  '東京不動産',
]

const KEYWORDS_EN = [
  'Bourn Mark',
  'Bournmark',
  'Japan real estate',
  'Tokyo property',
  'Property management',
  'Real estate investment',
  'Japan property sales',
]

const KEYWORDS_ZH_CN = [
  'Bourn Mark',
  'BournMark',
  '川雨流痕',
  '日本不动产',
  '日本房产',
  '买卖中介',
  '物业管理',
  '投资顾问',
  '东京房产',
]

const KEYWORDS_ZH_TW = [
  'Bourn Mark',
  'BournMark',
  '川雨流痕',
  '日本不動產',
  '日本房產',
  '買賣中介',
  '物業管理',
  '投資顧問',
  '東京房產',
]

const KEYWORDS_ZH_HK = [
  'Bourn Mark',
  'BournMark',
  '川雨流痕',
  '日本不動產',
  '日本樓',
  '買賣中介',
  '物業管理',
  '投資顧問',
  '東京房產',
]

export const HOME_SEO: Record<HomeLocale, HomeSeoConfig> = {
  ja: {
    title: '株式会社ボーンマーク Bourn Mark - 日本の不動産売買・投資物件管理',
    description:
      '株式会社ボーンマークは、日本の不動産売買仲介、投資用不動産管理、関連コンサルティングを提供します。',
    keywords: KEYWORDS_JA,
    htmlLang: 'ja',
    canonicalPath: '/jp',
    ogLocale: 'ja_JP',
    webPageInLanguage: 'ja',
  },
  en: {
    title: '株式会社ボーンマーク Bourn Mark - Japan Real Estate Sales, Investment & Property Management',
    description:
      'Professional Japan real estate sales, investment property management, and advisory services.',
    keywords: KEYWORDS_EN,
    htmlLang: 'en',
    canonicalPath: '/en',
    ogLocale: 'en_US',
    webPageInLanguage: 'en',
  },
  'zh-cn': {
    title: '株式会社ボーンマーク Bourn Mark - 日本房地产买卖与投资物业管理',
    description: '提供专业的日本房地产买卖中介、投资物业管理及相关咨询服务。',
    keywords: KEYWORDS_ZH_CN,
    htmlLang: 'zh-CN',
    canonicalPath: '/zh-cn',
    ogLocale: 'zh_CN',
    webPageInLanguage: 'zh-CN',
  },
  'zh-tw': {
    title: '株式会社ボーンマーク Bourn Mark - 日本房地產買賣與投資物業管理',
    description: '提供專業的日本房地產買賣中介、投資物業管理及相關諮詢服務。',
    keywords: KEYWORDS_ZH_TW,
    htmlLang: 'zh-TW',
    canonicalPath: '/zh-tw',
    ogLocale: 'zh_TW',
    webPageInLanguage: 'zh-TW',
  },
  'zh-hk': {
    title: '株式会社ボーンマーク Bourn Mark - 日本房地產買賣與投資物業管理',
    description: '提供專業的日本房地產買賣中介、投資物業管理及相關諮詢服務。',
    keywords: KEYWORDS_ZH_HK,
    htmlLang: 'zh-HK',
    canonicalPath: '/zh-hk',
    ogLocale: 'zh_HK',
    webPageInLanguage: 'zh-HK',
  },
}

export function hreflangAlternateLanguages(): Record<string, string> {
  return {
    ja: `${SITE_URL}/jp`,
    en: `${SITE_URL}/en`,
    'zh-CN': `${SITE_URL}/zh-cn`,
    'zh-TW': `${SITE_URL}/zh-tw`,
    'zh-HK': `${SITE_URL}/zh-hk`,
    'x-default': `${SITE_URL}/`,
  }
}

export function buildHomeMetadata(locale: HomeLocale): Metadata {
  const c = HOME_SEO[locale]
  const canonical = `${SITE_URL}${c.canonicalPath}`
  return {
    title: c.title,
    description: c.description,
    keywords: c.keywords,
    alternates: {
      canonical,
      languages: hreflangAlternateLanguages(),
    },
    openGraph: {
      title: c.title,
      description: c.description,
      type: 'website',
      siteName: '株式会社ボーンマーク Bourn Mark',
      url: canonical,
      locale: c.ogLocale,
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
      title: c.title,
      description: c.description,
      images: ['/imgs/og-share.png'],
    },
    robots: { index: true, follow: true },
    authors: [{ name: '株式会社ボーンマーク Bourn Mark' }],
  }
}

const ORGANIZATION_ID = `${SITE_URL}/#organization`

export function homeWebPageJsonLd(locale: HomeLocale) {
  const c = HOME_SEO[locale]
  const pageUrl = `${SITE_URL}${c.canonicalPath}`
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: c.title,
    inLanguage: c.webPageInLanguage,
    mainEntity: { '@id': ORGANIZATION_ID },
  }
}
