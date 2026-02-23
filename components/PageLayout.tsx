'use client'

import Header from './Header'
import Footer from './Footer'
import FloatingActions from './FloatingActions'
import Image from 'next/image'
import backgroundImage from '@/imgs/background.png'

type PageLayoutProps = { children: React.ReactNode; compact?: boolean }

export default function PageLayout({ children, compact = false }: PageLayoutProps) {
  return (
    <div
      className={`flex flex-col relative ${compact ? 'min-h-0' : 'min-h-screen'}`}
      style={compact ? { minHeight: 0 } : undefined}
      data-compact={compact ? 'true' : undefined}
    >
      {/* 背景图容器 - 使用 absolute 定位，随页面滚动 */}
      <div className="absolute inset-0 z-0 w-full page-background">
        <Image
          src={backgroundImage}
          alt=""
          fill
          className="object-cover"
          priority={false}
          quality={90}
          sizes="100vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center top',
          }}
        />
      </div>
      <div
        className={`relative z-10 page-layout-inner ${compact ? 'min-h-0' : 'min-h-screen'}`}
        data-page-layout-inner
        style={compact ? { minHeight: 0, height: 'auto' } : undefined}
        data-compact={compact ? 'true' : undefined}
      >
        <Header />
        <main className={compact ? '' : 'flex-1'} style={compact ? { flex: '0 1 auto', minHeight: 0 } : undefined}>
          {children}
        </main>
        <Footer />
        <FloatingActions />
      </div>
    </div>
  )
}



