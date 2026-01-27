'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import PageLayout from '@/components/PageLayout'
import { Calendar, MapPin, Tag, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { caseIds, caseDates, caseImages, caseCategoryGroups } from '@/lib/casesData'
import { activeManagedPropertyCards, getManagedPropertyTitle } from '@/lib/managedProperties'
import { investmentProperties } from '@/app/touzi/propertyData'
import { maimaiAllPropertyCards } from '@/app/maimai/propertiesData'

// 仅对“Logo 类图片”使用 contain + 留白；本社大楼为照片类，需贴边显示
const shouldContainImage = (src: string) => /(^|\/)(helte|logo)\b/i.test(src) || /logo/i.test(src)

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
}

export default function CasesPage() {
  const { t, language } = useLanguage()
  const inViewRef = useRef<HTMLDivElement | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const transformModeRef = useRef(false)
  const offsetRef = useRef(0)
  const maxOffsetRef = useRef(0)
  const isInView = useInView(inViewRef, { once: true, margin: '-100px' })
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // 构建案例数据（使用翻译）
  const cases = useMemo(() => {
    const base = caseIds.map((id) => {
      const detail = t(`cases.details.${id}`, { returnObjects: true }) as any
      return {
        id,
        date: caseDates[id],
        type: detail?.type || '',
        categoryGroup: caseCategoryGroups[id],
        title: detail?.title || '',
        location: detail?.location || '',
        category: detail?.category || '',
        image: caseImages[id],
        description: detail?.description || '',
        href: `/cases/${id}`,
      }
    })

    // 物业管理：与 /wuye “管理房产”卡片同步（数量与图片一致）
    const wuyeManaged = activeManagedPropertyCards.map((card) => ({
      id: card.id,
      date: '',
      type: t('wuye.properties.type'),
      categoryGroup: 'wuye',
      title: getManagedPropertyTitle(card, language),
      location: '',
      category: '',
      image: card.image,
      description: '',
      href: '/wuye',
    }))

    // 资产投资：与 /touzi 的投资卡片同步（数量与图文一致）
    const touziAssets = investmentProperties.map((p, idx) => ({
      id: `touzi-asset-${idx + 1}`,
      date: '',
      type: t('touzi.title'),
      categoryGroup: 'touzi',
      title: t(p.titleKey),
      location: t(p.locationKey),
      category: '',
      image: p.image || '/imgs/honsha.png',
      description: '',
      href: '/touzi',
    }))

    // 买卖中介：与 /maimai “销售中房产”卡片同步（数量与图文一致）
    const maimaiCards = maimaiAllPropertyCards.map((p) => ({
      id: p.href,
      date: '',
      type: t('maimai.properties.title'),
      categoryGroup: 'maimai',
      title: p.title,
      location: p.location,
      category: '',
      image: p.image,
      description: '',
      href: p.href,
    }))

    return [...base, ...wuyeManaged, ...touziAssets, ...maimaiCards]
  }, [t, language])

  // 筛选案例
  const filteredCases = useMemo(() => {
    if (selectedCategory === 'all') {
      return cases
    }
    return cases.filter((caseItem) => caseItem.categoryGroup === selectedCategory)
  }, [cases, selectedCategory])

  // 让 /cases 的横向拖拽体验与 /company/overview “企业持有资产”一致
  useEffect(() => {
    const container = scrollRef.current
    const track = trackRef.current
    if (!container || !track) return

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isCoarsePointer =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(pointer: coarse)').matches
    const isTouchDevice =
      typeof window !== 'undefined' &&
      (('ontouchstart' in window) ||
        (typeof navigator !== 'undefined' && (navigator.maxTouchPoints || 0) > 0) ||
        isCoarsePointer)

    // 桌面端：transform（丝滑 + 可控）；触摸端：原生滚动（惯性更自然）
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
      offsetPx += delta
      apply()
      // 轻微暂停（避免某些触摸板连滑时“漂移感”太强）
      if (!isDragging) pauseBriefly(180)
    }

    const onPointerDown = (e: PointerEvent) => {
      // 桌面鼠标拖拽；触摸设备保留原生滚动
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

    return () => {
      container.removeEventListener('pointerdown', onPointerDown as any)
      container.removeEventListener('pointermove', onPointerMove as any)
      container.removeEventListener('pointerup', endDrag as any)
      container.removeEventListener('pointercancel', endDrag as any)
      container.removeEventListener('wheel', onWheel as any)
      if (resumeTimeout) window.clearTimeout(resumeTimeout)
      ro.disconnect()
      track.style.willChange = prevWillChange
      track.style.transform = ''
      container.style.overflowX = prevOverflowX
    }
  }, [filteredCases.length])

  // 切换筛选后回到起点（避免变更后处于“空白尾部”）
  useEffect(() => {
    const container = scrollRef.current
    const track = trackRef.current
    if (!container) return
    if (transformModeRef.current && track) {
      offsetRef.current = 0
      track.style.transform = 'translate3d(0, 0, 0)'
    } else {
      container.scrollLeft = 0
    }
  }, [selectedCategory])

  // 滚动函数
  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current
    if (!container) return
    const scrollAmount = 400
    if (transformModeRef.current) {
      const next = offsetRef.current + (direction === 'left' ? -scrollAmount : scrollAmount)
      offsetRef.current = Math.max(0, Math.min(maxOffsetRef.current, next))
      const track = trackRef.current
      if (track) track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`
      return
    }

    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <PageLayout>
        <div className="relative min-h-screen cases-page">
          {/* Hero Section */}
        <section className="relative pt-28 pb-16 bg-gradient-to-br from-cyan-800 via-cyan-700 to-navy-800 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="案例展示"
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/80 to-navy-900/60"></div>
          </div>
          <div className="relative z-10 container-custom">
            <p className="text-sm text-cyan-300 font-semibold mb-4 drop-shadow-md">Case Studies</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 drop-shadow-lg">{t('cases.page.title')}</h1>
            <p className="text-lg text-gray-200 max-w-3xl leading-relaxed drop-shadow-md">
              {t('cases.page.subtitle')}
            </p>
          </div>
        </section>

        {/* Filter Menu */}
        <section className="relative section-padding border-b border-gray-200">
          
          <div className="container-custom relative z-10">
            <div className="flex flex-wrap items-center gap-4">
              {[
                { id: 'all', key: 'all' },
                { id: 'maimai', key: 'maimai' },
                { id: 'wuye', key: 'wuye' },
                { id: 'qichu', key: 'qichu' },
                { id: 'touzi', key: 'touzi' },
              ].map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t(`cases.page.filters.${category.key}`)}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Horizontal Scrolling Cases */}
        <section className="relative section-padding">
          <div className="container-custom relative z-10">
            <div className="relative">
              {/* 左滚动按钮 */}
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hidden md:flex items-center justify-center"
                aria-label={t('cases.page.scrollLeft')}
              >
                <ChevronLeft size={24} className="text-navy-900" />
              </button>

              {/* 右滚动按钮 */}
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hidden md:flex items-center justify-center"
                aria-label={t('cases.page.scrollRight')}
              >
                <ChevronRight size={24} className="text-navy-900" />
              </button>

              {/* 横向滚动容器 */}
              <div
                ref={scrollRef}
                className="overflow-x-auto scroll-smooth pb-4 scrollbar-hide cursor-grab active:cursor-grabbing"
                style={{
                  WebkitOverflowScrolling: 'touch',
                  // 不锁死竖向页面滚动
                  touchAction: 'auto',
                  overscrollBehaviorX: 'contain',
                  overscrollBehaviorY: 'auto',
                }}
              >
                <motion.div
                  ref={(node) => {
                    inViewRef.current = node
                    trackRef.current = node
                  }}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                  variants={containerVariants}
                  className="flex gap-6 min-w-max"
                  style={{ width: 'max-content' }}
                >
                  {filteredCases.map((caseItem) => {
                    const contain = shouldContainImage(caseItem.image)
                    return (
                      <motion.div
                        key={caseItem.id}
                        variants={itemVariants}
                        className="group bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg flex-shrink-0 cases-card"
                        style={{ width: '380px' }}
                      >
                        <div className="relative overflow-hidden">
                          <div className="relative w-full h-64 cases-card-media">
                            <div className={`absolute inset-0 ${contain ? 'p-6 bg-white' : ''}`}>
                              <div className="relative w-full h-full">
                                <Image
                                  src={caseItem.image}
                                  alt={caseItem.title}
                                  fill
                                  className={contain ? 'object-contain' : 'object-cover'}
                                  sizes="380px"
                                  unoptimized={caseItem.image.startsWith('/imgs/')}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="absolute top-4 right-4">
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                              {caseItem.type}
                            </span>
                          </div>
                        </div>

                      <div className="p-6 cases-card-body">
                        {caseItem.categoryGroup !== 'wuye' && caseItem.date ? (
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3 cases-card-meta">
                            <Calendar size={16} />
                            <span>{caseItem.date}</span>
                          </div>
                        ) : null}

                        {caseItem.href ? (
                          <Link href={caseItem.href}>
                            <h3 className="text-xl font-semibold text-navy-900 mb-2 hover:text-blue-600 transition-colors cases-card-title">
                              {caseItem.title}
                            </h3>
                          </Link>
                        ) : (
                          <h3 className="text-xl font-semibold text-navy-900 mb-2 cases-card-title">{caseItem.title}</h3>
                        )}

                        {caseItem.categoryGroup !== 'wuye' && caseItem.location ? (
                          <div className="flex items-center gap-2 text-sm text-gray-700 mb-3 cases-card-location">
                            <MapPin size={16} />
                            <span>{caseItem.location}</span>
                          </div>
                        ) : null}

                        {caseItem.categoryGroup !== 'wuye' && caseItem.description ? (
                          <p className="text-gray-700 text-sm leading-relaxed line-clamp-2 cases-card-desc">
                            {caseItem.description}
                          </p>
                        ) : null}
                      </div>
                      </motion.div>
                    )
                  })}
                </motion.div>
              </div>
            </div>
          </div>
        </section>
        </div>
    </PageLayout>
  )
}

