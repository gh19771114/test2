'use client'

import dynamic from 'next/dynamic'
import { useLanguage } from '@/contexts/LanguageContext'

// 背景视频只在客户端加载
const VideoPlayer = dynamic(() => import('./VideoPlayer'), {
  ssr: false,
})

const Hero = () => {
  const { t } = useLanguage()

  const headlineLines = [
    t('hero.headlineLine1'),
    t('hero.headlineLine2'),
    t('hero.headlineLine3')
  ]

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <VideoPlayer />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
      </div>

      <div className="relative z-10 w-full">
        <div className="container-custom flex flex-col items-start justify-center min-h-screen py-24">
          <div className="max-w-3xl">
            <div className="space-y-6 bg-transparent rounded-3xl px-6 py-8 md:px-10 md:py-10 shadow-lg">
              <h1 className="font-display text-left text-4xl md:text-5xl lg:text-6xl font-semibold md:font-bold leading-tight text-white">
                {headlineLines.map((line, index) => (
                  <span
                    key={index}
                    className={`block ${
                      index === headlineLines.length - 1
                        ? 'text-blue-200/95 tracking-widest mt-1 md:mt-2'
                        : 'text-white/95'
                    }`}
                  >
                    {line}
                  </span>
                ))}
              </h1>

              <p className="text-left text-base md:text-xl text-white/85 leading-relaxed md:leading-relaxed">
                {t('hero.subtext')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero