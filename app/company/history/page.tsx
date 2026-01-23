'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function CompanyHistoryPage() {
  const { t } = useLanguage()
  const timelineRef = useRef<HTMLDivElement | null>(null)
  
  const milestones = useMemo(() => [
  {
    year: t('company.history.milestones.milestone1.year'),
    title: t('company.history.milestones.milestone1.title'),
    description: t('company.history.milestones.milestone1.description'),
  },
  {
    year: t('company.history.milestones.milestone2.year'),
    title: t('company.history.milestones.milestone2.title'),
    description: t('company.history.milestones.milestone2.description'),
  },
  {
    year: t('company.history.milestones.milestone3.year'),
    title: t('company.history.milestones.milestone3.title'),
    description: t('company.history.milestones.milestone3.description'),
  },
  {
    year: t('company.history.milestones.milestone4.year'),
    title: t('company.history.milestones.milestone4.title'),
    description: t('company.history.milestones.milestone4.description'),
  },
  {
    year: t('company.history.milestones.milestone5.year'),
    title: t('company.history.milestones.milestone5.title'),
    description: t('company.history.milestones.milestone5.description'),
  },
  {
    year: t('company.history.milestones.milestone6.year'),
    title: t('company.history.milestones.milestone6.title'),
    description: t('company.history.milestones.milestone6.description'),
  },
  {
    year: t('company.history.milestones.milestone7.year'),
    title: t('company.history.milestones.milestone7.title'),
    description: t('company.history.milestones.milestone7.description'),
  },
  {
    year: t('company.history.milestones.milestone8.year'),
    title: t('company.history.milestones.milestone8.title'),
    description: t('company.history.milestones.milestone8.description'),
  },
  {
    year: t('company.history.milestones.milestone9.year'),
    title: t('company.history.milestones.milestone9.title'),
    description: t('company.history.milestones.milestone9.description'),
  },
  {
    year: t('company.history.milestones.milestone10.year'),
    title: t('company.history.milestones.milestone10.title'),
    description: t('company.history.milestones.milestone10.description'),
  },
  {
    year: t('company.history.milestones.milestone11.year'),
    title: t('company.history.milestones.milestone11.title'),
    description: t('company.history.milestones.milestone11.description'),
  },
  ], [t])

  // 时间线：拖拽滚动兜底（解决部分移动端/WebView 无法横滑的问题）
  useEffect(() => {
    const el = timelineRef.current
    if (!el) return

    let isDragging = false
    let startX = 0
    let startScrollLeft = 0

    const onPointerDown = (e: PointerEvent) => {
      // 仅左键/触摸
      if (e.pointerType === 'mouse' && e.button !== 0) return
      isDragging = true
      startX = e.clientX
      startScrollLeft = el.scrollLeft
      el.setPointerCapture?.(e.pointerId)
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return
      // 非 passive listener 下阻止页面纵向滚动抢手势
      e.preventDefault()
      const dx = e.clientX - startX
      el.scrollLeft = startScrollLeft - dx
    }

    const endDrag = () => {
      isDragging = false
    }

    el.addEventListener('pointerdown', onPointerDown, { passive: false })
    el.addEventListener('pointermove', onPointerMove, { passive: false })
    el.addEventListener('pointerup', endDrag, { passive: true })
    el.addEventListener('pointercancel', endDrag, { passive: true })

    return () => {
      el.removeEventListener('pointerdown', onPointerDown as any)
      el.removeEventListener('pointermove', onPointerMove as any)
      el.removeEventListener('pointerup', endDrag as any)
      el.removeEventListener('pointercancel', endDrag as any)
    }
  }, [])

  return (
    <PageLayout>
        <section className="relative pt-28 pb-16 bg-gradient-to-br from-teal-800 via-teal-700 to-navy-800 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=60"
            alt={t('company.history.title')}
            fill
            className="object-cover opacity-30"
            priority
            quality={60}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-teal-900/80 to-navy-900/60"></div>
        </div>
        <div className="relative z-10 container-custom">
          <p className="text-sm text-teal-300 font-semibold mb-4">{t('company.history.subtitle')}</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">{t('company.history.title')}</h1>
          <p className="text-lg text-gray-200 max-w-4xl leading-relaxed text-balance">
            {t('company.history.description')}
          </p>
        </div>
      </section>

        {/* Timeline Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-custom max-w-6xl mx-auto">
            <div className="relative">
              {/* 横向时间轴线（桌面端） */}
              <div className="hidden md:block absolute left-0 right-0 top-7">
                <div
                  className="h-0.5 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"
                  style={{ boxShadow: '0 0 10px rgba(59, 130, 246, 0.35)' }}
                />
              </div>

              {/* 横向滚动时间轴：只显示文案 */}
              <div
                ref={timelineRef}
                className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory select-none cursor-grab active:cursor-grabbing"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch',
                  touchAction: 'pan-x',
                  overscrollBehavior: 'contain',
                }}
              >
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={`${milestone.year}-${index}`}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.35 }}
                    className="relative snap-start flex-shrink-0 w-[280px] sm:w-[320px] md:w-[380px]"
                  >
                    {/* 桌面端：连接到轴线的圆点 */}
                    <div className="hidden md:flex absolute left-6 -top-2 z-10 items-center justify-center">
                      <div
                        className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg"
                        style={{ boxShadow: '0 0 14px rgba(59, 130, 246, 0.6)' }}
                      />
                    </div>

                    <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                      {/* 移动端：顶部时间点 */}
                      <div className="md:hidden flex items-center gap-2 mb-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500 border border-white shadow" />
                        <span className="text-sm font-semibold text-navy-700">{milestone.year}</span>
                      </div>

                      <div className="hidden md:block text-2xl font-bold text-navy-700 mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-navy-900 mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                        {milestone.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
    </PageLayout>
  )
}
