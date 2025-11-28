import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Noto_Sans_JP, Inter, Playfair_Display } from 'next/font/google'

const notoSansJp = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto-sans-jp',
  preload: true,
  adjustFontFallback: true,
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-playfair',
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${notoSansJp.variable} ${inter.variable} ${playfair.variable} antialiased font-sans`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}
