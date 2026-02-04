import type { Metadata, Viewport } from 'next'
import './globals.css'
import localFont from 'next/font/local'
import { LanguageProvider } from '@/contexts/LanguageContext'

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
  alternateName: ['ボーンマーク', '川雨留痕', 'Bournmark'],
  url: 'https://bournmark.com',
  description: '日本不动产管理公司',
  sameAs: ['https://www.facebook.com/bournmarkjapan/', 'https://www.youtube.com/@bournmark'],
} as const

// 用于 Google 等搜索引擎的标题与描述（可在此修改搜索结果显示文案）
const SITE_TITLE = 'Bourn Mark川雨流痕-专业的公司'
const SITE_DESCRIPTION =
  '提供专业的日本房地产买卖咨询中介服务，以及投资型房地产的物业管理服务。让您在日本的投资更省心、更增值。'

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_TITLE}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'Bourn Mark',
    'BournMark',
    '川雨留痕',
    'ボーンマーク',
    '日本不动产管理公司',
    '官网',
    '公式サイト',
    'Official website',
    '日本房产',
    '买卖中介',
    '物业管理',
    '企业出海',
    '投资顾问',
    '东京房产',
  ],
  authors: [{ name: 'Bourn Mark' }],
  icons: {
    icon: '/imgs/logo-icon.png',
    shortcut: '/imgs/logo-icon.png',
    apple: '/imgs/logo-icon.png',
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: 'website',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
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
