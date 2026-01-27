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

  // 时间线：拖拽滚动兜底（解决部分移动端/WebView 无法横滑的问题）
  useEffect(() => {
    const el = timelineRef.current
    if (!el) return

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    const isCoarsePointer =
      typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)')?.matches

    let isDragging = false
    let startX = 0
    let startScrollLeft = 0
    let lastX: number | null = null
    let lastTs: number | null = null
    let velocity = 0 // px/sec (scrollLeft direction)

    let applyRaf: number | null = null
    let pendingScrollLeft: number | null = null

    let momentumRaf: number | null = null

    const clampScroll = (v: number) => {
      const max = Math.max(0, el.scrollWidth - el.clientWidth)
      return Math.max(0, Math.min(max, v))
    }

    const applyScroll = () => {
      if (pendingScrollLeft === null) return
      el.scrollLeft = clampScroll(pendingScrollLeft)
      pendingScrollLeft = null
    }

    const scheduleApply = () => {
      if (applyRaf !== null) return
      applyRaf = requestAnimationFrame(() => {
        applyRaf = null
        applyScroll()
      })
    }

    const stopMomentum = () => {
      if (momentumRaf !== null) {
        cancelAnimationFrame(momentumRaf)
        momentumRaf = null
      }
    }

    const startMomentum = () => {
      if (prefersReducedMotion) return
      // 速度太小不启动
      if (Math.abs(velocity) < 80) return

      stopMomentum()
      let ts0: number | null = null

      const tick = (ts: number) => {
        if (ts0 === null) ts0 = ts
        const dt = Math.max(0, ts - ts0) / 1000
        ts0 = ts

        // 位置更新
        const next = clampScroll(el.scrollLeft + velocity * dt)
        const hitEdge = next === 0 || next === Math.max(0, el.scrollWidth - el.clientWidth)
        el.scrollLeft = next

        // 指数衰减（接近“丝滑惯性”手感）
        velocity *= Math.exp(-6 * dt)

        if (hitEdge || Math.abs(velocity) < 25) {
          momentumRaf = null
          return
        }

        momentumRaf = requestAnimationFrame(tick)
      }

      momentumRaf = requestAnimationFrame(tick)
    }

    const onPointerDown = (e: PointerEvent) => {
      // 触摸/平板：使用浏览器原生滚动，避免 JS 拖拽导致“卡一卡”，并且允许上下滚动页面
      if (isCoarsePointer || e.pointerType === 'touch') return
      // 仅左键/触摸
      if (e.pointerType === 'mouse' && e.button !== 0) return
      stopMomentum()
      isDragging = true
      startX = e.clientX
      startScrollLeft = el.scrollLeft
      lastX = e.clientX
      lastTs = performance.now()
      velocity = 0
      el.setPointerCapture?.(e.pointerId)
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return
      // 非 passive listener 下阻止页面纵向滚动抢手势
      e.preventDefault()
      const dx = e.clientX - startX
      pendingScrollLeft = startScrollLeft - dx
      scheduleApply()

      // 估算松手后的惯性速度（scrollLeft 方向）
      const now = performance.now()
      if (lastX !== null && lastTs !== null) {
        const dt = Math.max(1, now - lastTs) / 1000
        const pointerV = (e.clientX - lastX) / dt // px/sec (pointer direction)
        // pointer 往右拖时 scrollLeft 往左，所以取反
        velocity = -pointerV
      }
      lastX = e.clientX
      lastTs = now
    }

    const endDrag = () => {
      isDragging = false
      lastX = null
      lastTs = null
      // 统一一次最终位置，避免最后一帧未落地
      applyScroll()
      startMomentum()
    }

    // 鼠标滚轮：纵向滚动映射为横向时间线滚动（不影响触摸板原生手势）
    const onWheel = (e: WheelEvent) => {
      // 触摸/平板：不接管，保持原生
      if (isCoarsePointer) return
      // Ctrl+滚轮常用于缩放，不劫持
      if ((e as any).ctrlKey) return
      // 触摸板通常会带 deltaX（或 deltaY 很小且连续），不接管
      const absX = Math.abs(e.deltaX)
      const absY = Math.abs(e.deltaY)
      const isLikelyMouseWheel =
        // 传统鼠标滚轮常见：按行滚动（deltaMode=1）
        e.deltaMode === 1 ||
        // 或像素模式但步进较大且基本没有 deltaX
        (e.deltaMode === 0 && absY >= 50 && absX < 5)

      if (!isLikelyMouseWheel) return

      // 阻止页面纵向滚动，把滚轮用于横向时间线
      e.preventDefault()
      stopMomentum()

      const factor = e.deltaMode === 1 ? 24 : 1
      pendingScrollLeft = el.scrollLeft + e.deltaY * factor
      scheduleApply()
    }

    el.addEventListener('pointerdown', onPointerDown, { passive: false })
    el.addEventListener('pointermove', onPointerMove, { passive: false })
    el.addEventListener('pointerup', endDrag, { passive: true })
    el.addEventListener('pointercancel', endDrag, { passive: true })
    el.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      stopMomentum()
      if (applyRaf !== null) cancelAnimationFrame(applyRaf)
      el.removeEventListener('pointerdown', onPointerDown as any)
      el.removeEventListener('pointermove', onPointerMove as any)
      el.removeEventListener('pointerup', endDrag as any)
      el.removeEventListener('pointercancel', endDrag as any)
      el.removeEventListener('wheel', onWheel as any)
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
                <div className="relative flex items-center gap-6 min-w-max py-14 pr-32">
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
            </div>
          </div>
        </section>
    </PageLayout>
  )
}
