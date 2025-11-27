'use client'

import Header from './Header'
import Footer from './Footer'
import FloatingActions from './FloatingActions'
import Image from 'next/image'
import backgroundImage from '@/imgs/background.png'

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt=""
          fill
          className="object-cover"
          priority={false}
          quality={90}
        />
      </div>
      <div className="relative z-10">
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




