import type { Metadata, Viewport } from 'next'
import './globals.css'
import localFont from 'next/font/local'
import { LanguageProvider } from '@/contexts/LanguageContext'

// 使用本地字体，避免构建阶段依赖 Google Fonts（fonts.gstatic.com）
const notoSansJp = localFont({
  src: [
    {
      path: '../public/fonts/NotoSansSC-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-noto-sans-jp',
})

export const metadata: Metadata = {
  title: 'Bourn Mark - 日本房产投资与企业落地服务',
  description:
    '提供日本房产买卖中介、物业管理与企业出海助力等一站式解决方案，让您的在日投资更省心、更增值。',
  keywords:
    '日本房产, 买卖中介, 物业管理, 企业出海, 投资顾问, 东京房产',
  authors: [{ name: 'Bourn Mark' }],
  icons: {
    icon: '/imgs/logo-icon.png',        // 请把文件改名成无空格英文名
    shortcut: '/imgs/logo-icon.png',
    apple: '/imgs/logo-icon.png',
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
      <body
        className={`${notoSansJp.variable} antialiased font-sans`}
        suppressHydrationWarning
      >
        <LanguageProvider>
        {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
