'use client'

import Header from './Header'
import Footer from './Footer'
import FloatingActions from './FloatingActions'
import Image from 'next/image'
import backgroundImage from '@/imgs/background.png'

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* 背景图容器 - 使用 absolute 定位，随页面滚动 */}
      <div className="absolute inset-0 z-0 w-full">
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
      <div className="relative z-10 min-h-screen">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <FloatingActions />
      </div>
    </div>
  )
}




