'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ExternalLink, Play } from 'lucide-react'
import Image from 'next/image'
import { useTContent } from '@/hooks/useTContent'
import { caseIds, caseDates, caseImages } from '@/lib/casesData'

const managedPropertyCaseIds = new Set([
  'abc-hall-management',
  'shibuya-luxury-apartment',
  'yokohama-waterfront-complex',
  'nagoya-student-apartment',
])

const Works = () => {
  const { t, tTitle } = useTContent()
  const [visibleCount, setVisibleCount] = useState(6) // 首页默认展示6个案例

  // 首页“成功案例”与 /cases 页共享同一套多语言数据源与图片映射
  const works = useMemo(() => {
    const baseWorks = caseIds.map((id) => {
      const detail = t(`cases.details.${id}`, { returnObjects: true }) as any
      return {
        id,
        date: caseDates[id],
        type: tTitle(`cases.details.${id}.type`) || detail?.type || '',
        category: detail?.category || '',
        title: tTitle(`cases.details.${id}.title`) || detail?.title || '',
        image: caseImages[id],
        description: managedPropertyCaseIds.has(id) ? '' : (detail?.description || ''),
    }
    })

    return baseWorks.filter((w) => w.id !== 'park-tower-nishishinjuku-101-201')
  }, [t, tTitle])

  // 首页只显示6个案例，不再滚动加载更多

  // 只渲染可见的案例
  const visibleWorks = useMemo(() => works.slice(0, visibleCount), [works, visibleCount])

  return (
    <section id="works" className="relative section-padding scroll-mt-32">
      <div className="container-custom">
        <div className="text-center mb-16">
          <Link
            href="/cases"
            className="text-3xl md:text-4xl font-bold text-white mb-4 hover:text-gray-200 transition-colors cursor-pointer inline-block"
            suppressHydrationWarning
          >
            {t('home.works.title')}
          </Link>
          <p 
            className="text-lg text-gray-200 max-w-2xl mx-auto"
            suppressHydrationWarning
          >
            {t('home.works.subtitle')}
          </p>
        </div>

        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleWorks.map((work, index) => (
            <div
              key={work.id}
              className="group relative bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg"
            >
                <div className="relative overflow-hidden">
                  <div className="relative w-full h-64">
                    <Image
                      src={work.image}
                      alt={work.title}
                      fill
                    className="object-cover"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    // 本地 /public/imgs 图片：绕过 next/image 优化器，避免个别 JPEG 在移动端优化失败导致不显示
                    unoptimized={work.image.startsWith('/imgs/')}
                      priority={index < 3} // 只对前3张图片使用优先级加载
                      loading={index < 3 ? undefined : "lazy"} // 后面的图片懒加载
                    quality={75} // 优化图片质量
                    />
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-navy-700 text-white px-3 py-1 rounded-full text-sm font-medium" suppressHydrationWarning>
                      {work.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium" suppressHydrationWarning>
                      {work.type}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  {work.date ? (
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <span>{work.date}</span>
                    </div>
                  ) : null}
                <h3 className="text-xl font-semibold text-navy-700 mb-2" suppressHydrationWarning>
                    {work.title}
                  </h3>
                  {work.description ? (
                    <p className="text-gray-600 text-sm leading-relaxed" suppressHydrationWarning>
                      {work.description}
                    </p>
                  ) : null}
                </div>
            </div>
          ))}
        </div>

        {/* 移动端：横向滑动形式 */}
        <div className="md:hidden overflow-x-auto pb-4 scrollbar-hide" style={{ 
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch'
        }}>
          <div className="flex gap-6 px-4" style={{ minWidth: 'max-content' }}>
            {visibleWorks.map((work, index) => (
              <div
                key={work.id}
                className="flex-shrink-0 w-[320px]"
                style={{ scrollSnapAlign: 'center' }}
              >
                <div className="group relative bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg h-full">
                    <div className="relative overflow-hidden">
                    <div className="relative w-full h-48" style={{ borderRadius: 0 }}>
                        <Image
                          src={work.image}
                          alt={work.title}
                          fill
                        className="object-cover"
                          sizes="320px"
                        unoptimized={work.image.startsWith('/imgs/')}
                          loading={index < 3 ? undefined : "lazy"}
                        quality={75}
                        style={{ borderRadius: 0 }}
                        />
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-navy-700 text-white px-3 py-1 rounded-full text-sm font-medium" suppressHydrationWarning>
                          {work.category}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium" suppressHydrationWarning>
                          {work.type}
                        </span>
                      </div>
                    </div>
                    
                  <div className="md:p-6" style={{ padding: '0.125rem' }}>
                      {work.date ? (
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <span suppressHydrationWarning>{work.date}</span>
                        </div>
                      ) : null}
                    <h3 className="text-xl font-semibold text-navy-700 mb-2 line-clamp-2" suppressHydrationWarning>
                        {work.title}
                      </h3>
                      {work.description ? (
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3" suppressHydrationWarning>
                          {work.description}
                        </p>
                      ) : null}
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <Link
            href="/cases"
            className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2 hover:scale-105 transform transition-all duration-200"
            suppressHydrationWarning
          >
            {t('home.works.viewMore')}
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Works
