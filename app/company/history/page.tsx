'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

function MilestoneImage({
  src,
  alt,
  sizes,
}: {
  src: string
  alt: string
  sizes: string
}) {
  const [aspectRatio, setAspectRatio] = useState<string | null>(null)

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden border border-gray-200 mb-4 bg-white"
      // 先给一个合理的兜底比例，图片加载完后会自动更新为真实比例，从而“容器大小=图片大小”
      style={{ aspectRatio: aspectRatio || '16 / 9' }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        // 不裁切：完整显示图片内容；容器比例会自动贴合图片比例，因此不会出现“黑色空隙”
        className="object-contain"
        sizes={sizes}
        unoptimized={src.startsWith('/imgs/')}
        onLoadingComplete={(img) => {
          if (aspectRatio) return
          const w = img.naturalWidth
          const h = img.naturalHeight
          if (!w || !h) return
          setAspectRatio(`${w} / ${h}`)
        }}
      />
    </div>
  )
}

export default function CompanyHistoryPage() {
  const { t } = useLanguage()
  const timelineRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const transformModeRef = useRef(false)
  const offsetRef = useRef(0) // px
  const maxOffsetRef = useRef(0)
  
  const milestones = useMemo(() => [
  {
    year: t('company.history.milestones.milestone1.year'),
    title: t('company.history.milestones.milestone1.title'),
    description: t('company.history.milestones.milestone1.description'),
    image: '/imgs/warmlight.jpg',
    imageAlt: t('company.history.milestones.milestone1.imageAlt'),
  },
  {
    year: t('company.history.milestones.milestone2.year'),
    title: t('company.history.milestones.milestone2.title'),
    description: t('company.history.milestones.milestone2.description'),
  },
  {
    year: t('company.history.milestones.milestone13.year'),
    title: t('company.history.milestones.milestone13.title'),
    description: t('company.history.milestones.milestone13.description'),
    image: '/imgs/lou.jpg',
    imageAlt: t('company.history.milestones.milestone13.imageAlt'),
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
    image: '/imgs/kaiye2.jpg',
    imageAlt: t('company.history.milestones.milestone4.imageAlt'),
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
    image: '/imgs/honnsya2.jpeg',
    imageAlt: t('company.history.milestones.milestone6.imageAlt'),
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
    image: '/imgs/Warm Light Residence.jpeg',
    imageAlt: t('company.history.milestones.milestone8.imageAlt'),
  },
  {
    year: t('company.history.milestones.milestone9.year'),
    title: t('company.history.milestones.milestone9.title'),
    description: t('company.history.milestones.milestone9.description'),
    image: '/imgs/Karasuma Rokujo Hotel.jpeg',
    imageAlt: t('company.history.milestones.milestone9.imageAlt'),
  },
  {
    year: t('company.history.milestones.milestone12.year'),
    title: t('company.history.milestones.milestone12.title'),
    description: t('company.history.milestones.milestone12.description'),
    image: '/imgs/lingshiguan.jpg',
    imageAlt: t('company.history.milestones.milestone12.imageAlt'),
  },
  {
    year: t('company.history.milestones.milestone10.year'),
    title: t('company.history.milestones.milestone10.title'),
    description: t('company.history.milestones.milestone10.description'),
    image: '/imgs/helte LOGO.png',
    imageAlt: t('company.history.milestones.milestone10.imageAlt'),
  },
  {
    year: t('company.history.milestones.milestone11.year'),
    title: t('company.history.milestones.milestone11.title'),
    description: t('company.history.milestones.milestone11.description'),
    image: '/imgs/logo2.jpg',
    imageAlt: t('company.history.milestones.milestone11.imageAlt'),
  },
  ], [t])

  // 时间线：拖拽/滚轮逻辑（对齐 /company/overview 的“企业持有资产”滚动栏）
  useEffect(() => {
    const container = timelineRef.current
    const track = trackRef.current
    if (!container || !track) return

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    const isCoarsePointer =
      typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)')?.matches
    const isTouchDevice =
      typeof window !== 'undefined' &&
      (('ontouchstart' in window) ||
        (typeof navigator !== 'undefined' && (navigator.maxTouchPoints || 0) > 0) ||
        isCoarsePointer)

    // 桌面端使用 transform 拖拽/滚轮，触摸设备保留原生滚动
    const enableTransform = !isTouchDevice && !prefersReducedMotion
    transformModeRef.current = enableTransform

    let offsetPx = offsetRef.current
    let isPaused = false
    let isDragging = false
    let startX = 0
    let startOffset = 0
    let resumeTimeout: number | null = null

    const prevWillChange = track.style.willChange
    track.style.willChange = 'transform'

    const getMax = () => {
      const max = Math.max(0, track.scrollWidth - container.clientWidth)
      maxOffsetRef.current = max
      return max
    }
    const clamp = (v: number) => {
      const max = getMax()
      return Math.max(0, Math.min(max, v))
    }
    const apply = () => {
      offsetPx = clamp(offsetPx)
      offsetRef.current = offsetPx
      track.style.transform = `translate3d(${-offsetPx}px, 0, 0)`
      setCanScrollLeft(offsetPx > 4)
      setCanScrollRight(offsetPx < maxOffsetRef.current - 4)
    }

    const pauseBriefly = (ms: number) => {
      isPaused = true
      if (resumeTimeout) window.clearTimeout(resumeTimeout)
      resumeTimeout = window.setTimeout(() => {
        isPaused = false
      }, ms)
    }

    const onWheel = (e: WheelEvent) => {
      if (!enableTransform) return
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      if (delta === 0) return
      e.preventDefault()
      e.stopPropagation()
      if (!isPaused && !isDragging) {
        offsetPx += delta
        apply()
        pauseBriefly(250)
      } else {
        offsetPx += delta
        apply()
      }
    }

    const onPointerDown = (e: PointerEvent) => {
      // 桌面鼠标拖拽；触摸/触摸板走 wheel/原生
      if (!enableTransform || e.pointerType !== 'mouse') return
      if (e.button !== 0) return
      isDragging = true
      isPaused = true
      startX = e.clientX
      startOffset = offsetPx
      container.setPointerCapture?.(e.pointerId)
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return
      e.preventDefault()
      const dx = e.clientX - startX
      offsetPx = startOffset - dx
      apply()
    }
    const endDrag = () => {
      if (!isDragging) return
      isDragging = false
      isPaused = false
    }

    const prevOverflowX = container.style.overflowX
    if (enableTransform) {
      container.style.overflowX = 'hidden'
      container.scrollLeft = 0
      offsetPx = clamp(offsetPx)
      apply()
    }

    container.addEventListener('pointerdown', onPointerDown, { passive: false })
    container.addEventListener('pointermove', onPointerMove, { passive: false })
    container.addEventListener('pointerup', endDrag, { passive: true })
    container.addEventListener('pointercancel', endDrag, { passive: true })
    container.addEventListener('wheel', onWheel, { passive: false })

    const ro = new ResizeObserver(() => {
      if (!enableTransform) return
      apply()
    })
    ro.observe(container)
    ro.observe(track)

    // native scroll mode arrow state
    const onScrollNative = () => {
      if (enableTransform) return
      const max = Math.max(0, container.scrollWidth - container.clientWidth)
      const left = container.scrollLeft
      setCanScrollLeft(left > 4)
      setCanScrollRight(left < max - 4)
    }
    if (!enableTransform) {
      onScrollNative()
      container.addEventListener('scroll', onScrollNative, { passive: true })
    }

    return () => {
      container.removeEventListener('pointerdown', onPointerDown as any)
      container.removeEventListener('pointermove', onPointerMove as any)
      container.removeEventListener('pointerup', endDrag as any)
      container.removeEventListener('pointercancel', endDrag as any)
      container.removeEventListener('wheel', onWheel as any)
      container.removeEventListener('scroll', onScrollNative as any)
      if (resumeTimeout) window.clearTimeout(resumeTimeout)
      ro.disconnect()
      track.style.willChange = prevWillChange
      track.style.transform = ''
      container.style.overflowX = prevOverflowX
    }
  }, [])

  // 时间线：左右箭头可用性（仅用于桌面鼠标用户提示）
  useEffect(() => {
    const el = timelineRef.current
    if (!el) return

    let raf: number | null = null
    const update = () => {
      if (raf !== null) return
      raf = requestAnimationFrame(() => {
        raf = null
        const max = Math.max(0, el.scrollWidth - el.clientWidth)
        const left = el.scrollLeft
        setCanScrollLeft(left > 4)
        setCanScrollRight(left < max - 4)
      })
    }

    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    const ro = new ResizeObserver(update)
    ro.observe(el)

    return () => {
      if (raf !== null) cancelAnimationFrame(raf)
      el.removeEventListener('scroll', update as any)
      window.removeEventListener('resize', update as any)
      ro.disconnect()
    }
  }, [])

  const scrollTimelineBy = (dir: -1 | 1) => {
    const container = timelineRef.current
    if (!container) return
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    const step = Math.max(320, Math.floor(container.clientWidth * 0.7))
    if (transformModeRef.current) {
      offsetRef.current = Math.max(0, Math.min(maxOffsetRef.current, offsetRef.current + dir * step))
      // 直接更新 transform
      const track = trackRef.current
      if (track) track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`
      setCanScrollLeft(offsetRef.current > 4)
      setCanScrollRight(offsetRef.current < maxOffsetRef.current - 4)
    } else {
      container.scrollBy({
        left: dir * step,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      })
    }
  }

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
              {/* 横向滚动时间轴：只显示文案 */}
              <div
                ref={timelineRef}
                className="overflow-x-auto scrollbar-hide snap-x snap-mandatory [@media(pointer:coarse)]:snap-none select-none cursor-grab active:cursor-grabbing"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch',
                  // 允许上下滚动页面（不锁死竖向手势）
                  touchAction: 'auto',
                  // 只限制横向越界，不影响竖向页面滚动
                  overscrollBehaviorX: 'contain',
                  overscrollBehaviorY: 'auto',
                }}
              >
                {/* 让时间线线条跟随横向滚动（移动端也可见），并在末尾延长 + 箭头 */}
                {/* 让卡片以时间线为中轴纵向居中，从而形成“横跨时间线中间”的视觉效果 */}
                <div ref={trackRef} className="relative flex items-center gap-6 min-w-max py-14 pr-32">
                  {/* 时间轴线（全端可见，随内容滚动） */}
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-0 pointer-events-none"
                    // 让时间线直接延伸到箭头下方，由箭头头部覆盖收口，彻底避免“没连上”的视觉缝隙
                    // 右侧额外内收一些像素，避免抗锯齿/柔光导致“超过箭头尖端”的视觉残留
                    style={{ right: '36px', height: '24px', overflow: 'hidden' }}
                  >
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5">
                      {/* 柔光底线（被外层裁切，避免右侧溢出） */}
                      <div className="absolute inset-x-0 -top-0.5 h-1 rounded-full bg-gradient-to-r from-sky-400/40 via-blue-500/40 to-indigo-500/40 blur-[6px]" />
                      {/* 清晰主线 */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 shadow-[0_0_12px_rgba(59,130,246,0.28)]" />
                    </div>
                  </div>

                  {/* 末尾箭头（延长时间线的视觉收尾） */}
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                    <svg
                      width="56"
                      height="28"
                      viewBox="0 0 56 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <defs>
                        <linearGradient id="timelineArrowGradient" x1="0" y1="0" x2="56" y2="0">
                          <stop stopColor="#38BDF8" />
                          <stop offset="0.55" stopColor="#3B82F6" />
                          <stop offset="1" stopColor="#4F46E5" />
                        </linearGradient>
                        <filter id="timelineArrowGlow" x="-30%" y="-80%" width="160%" height="260%">
                          <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
                          <feColorMatrix
                            in="blur"
                            type="matrix"
                            values="
                              1 0 0 0 0
                              0 1 0 0 0
                              0 0 1 0 0
                              0 0 0 0.55 0
                            "
                            result="glow"
                          />
                          <feMerge>
                            <feMergeNode in="glow" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                      <g filter="url(#timelineArrowGlow)">
                        <path
                          d="M36.5 6.4L55 14L36.5 21.6Z"
                          fill="url(#timelineArrowGradient)"
                          stroke="rgba(255,255,255,0.55)"
                          strokeWidth="1"
                          strokeLinejoin="round"
                        />
                      </g>
                    </svg>
                  </div>

                  {milestones.map((milestone, index) => (
                    <motion.div
                      key={`${milestone.year}-${index}`}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.35 }}
                      transition={{ duration: 0.35 }}
                      className="relative z-10 snap-start flex-shrink-0 w-[280px] sm:w-[320px] md:w-[380px]"
                    >
                      <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                        {milestone.image ? (
                          <MilestoneImage
                            src={milestone.image}
                            alt={milestone.imageAlt || milestone.title}
                            sizes="(min-width: 768px) 380px, 320px"
                          />
                        ) : null}

                        <div className="text-2xl font-bold text-navy-700 mb-2">
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

              {/* 左右箭头（仅鼠标设备显示；不影响触摸板/触摸） */}
              <div className="hidden [@media(pointer:fine)]:block pointer-events-none">
                {canScrollLeft && (
                  <button
                    type="button"
                    aria-label="Scroll timeline left"
                    onClick={() => scrollTimelineBy(-1)}
                    className="pointer-events-auto absolute left-0 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/90 border border-gray-200 shadow-lg hover:bg-white transition flex items-center justify-center"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M15 18l-6-6 6-6" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
                {canScrollRight && (
                  <button
                    type="button"
                    aria-label="Scroll timeline right"
                    onClick={() => scrollTimelineBy(1)}
                    className="pointer-events-auto absolute right-0 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/90 border border-gray-200 shadow-lg hover:bg-white transition flex items-center justify-center"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M9 6l6 6-6 6" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
    </PageLayout>
  )
}
