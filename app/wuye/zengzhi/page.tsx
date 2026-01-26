'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useEffect, useRef, useMemo, useState } from 'react'
import { TrendingUp, Search, Briefcase, Hand, Hammer, Coins, BarChart3, Building2, Target, CheckCircle2, ArrowRight, Sparkles, MapPin, Tag, X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ZengzhiPage() {
  const { t } = useLanguage()
  const heroRef = useRef(null)
  const statsRef = useRef(null)
  const servicesRef = useRef(null)
  const casesRef = useRef(null)
  const [isAnimOpen, setIsAnimOpen] = useState(false)
  const [isMobileAnimOpen, setIsMobileAnimOpen] = useState(false)
  const [animKey, setAnimKey] = useState(0)
  
  const isHeroInView = useInView(heroRef, { once: true })
  const isStatsInView = useInView(statsRef, { once: true, margin: '-100px' })
  const isServicesInView = useInView(servicesRef, { once: true, margin: '-100px' })
  const isCasesInView = useInView(casesRef, { once: true, margin: '-100px' })

  // 交互规则：
  // - 小窗（embed）：静音自动播放
  // - 手机：点击小窗直接“大屏弹层”（不直接进入系统全屏）
  // - 其它设备：维持“点开放大弹层”
  // - 需要系统全屏：在大屏弹层内点击动画自带全屏按钮
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia?.('(pointer: coarse)') // touch device hint
    const update = () => {
      const coarse = mq?.matches ?? false
      const narrow = window.innerWidth <= 768
      setIsMobileAnimOpen(coarse || narrow)
    }
    update()
    mq?.addEventListener?.('change', update)
    window.addEventListener('resize', update)
    return () => {
      mq?.removeEventListener?.('change', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return
    if (!isAnimOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isAnimOpen])

  const openAnimLarge = () => {
    setAnimKey((k) => k + 1) // remount to restart audio from 0
    setIsAnimOpen(true)
  }

  const closeAnimLarge = () => {
    setIsAnimOpen(false)
  }

  // 从多语言文件读取数据
  const stats = useMemo(() => [
    { value: t('wuye.zengzhi.stats.rentIncrease.value'), label: t('wuye.zengzhi.stats.rentIncrease.label'), icon: TrendingUp },
    { value: t('wuye.zengzhi.stats.successCases.value'), label: t('wuye.zengzhi.stats.successCases.label'), icon: CheckCircle2 },
    { value: t('wuye.zengzhi.stats.satisfaction.value'), label: t('wuye.zengzhi.stats.satisfaction.label'), icon: Target },
    { value: t('wuye.zengzhi.stats.experience.value'), label: t('wuye.zengzhi.stats.experience.label'), icon: Building2 },
  ], [t])

  const services = useMemo(() => [
    {
      title: t('wuye.zengzhi.services.service1.title'),
      icon: Search,
      image: '/imgs/wuye/real/zengzhi-service-1.jpg',
      description: t('wuye.zengzhi.services.service1.description'),
      items: (t('wuye.zengzhi.services.service1.items', { returnObjects: true }) as string[]) || [],
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: t('wuye.zengzhi.services.service2.title'),
      icon: Hand,
      image: '/imgs/wuye/real/zengzhi-service-2.jpg',
      description: t('wuye.zengzhi.services.service2.description'),
      items: (t('wuye.zengzhi.services.service2.items', { returnObjects: true }) as string[]) || [],
      color: 'from-green-500 to-green-600',
    },
    {
      title: t('wuye.zengzhi.services.service3.title'),
      icon: Hammer,
      image: '/imgs/wuye/real/zengzhi-service-3.jpg',
      description: t('wuye.zengzhi.services.service3.description'),
      items: (t('wuye.zengzhi.services.service3.items', { returnObjects: true }) as string[]) || [],
      color: 'from-orange-500 to-orange-600',
    },
    {
      title: t('wuye.zengzhi.services.service4.title'),
      icon: Coins,
      image: '/imgs/wuye/real/zengzhi-service-4.jpg',
      description: t('wuye.zengzhi.services.service4.description'),
      items: (t('wuye.zengzhi.services.service4.items', { returnObjects: true }) as string[]) || [],
      color: 'from-amber-500 to-amber-600',
    },
  ], [t])

  // 旧版 3 张图文案例（需要保留）
  const legacyCases = useMemo(() => [
    {
      title: t('wuye.zengzhi.cases.case1.title'),
      location: t('wuye.zengzhi.cases.case1.location'),
      result: t('wuye.zengzhi.cases.case1.result'),
      description: t('wuye.zengzhi.cases.case1.description'),
      image: '/imgs/Noa shibuya.jpeg',
      category: t('wuye.zengzhi.cases.case1.category'),
    },
    {
      title: t('wuye.zengzhi.cases.case2.title'),
      location: t('wuye.zengzhi.cases.case2.location'),
      result: t('wuye.zengzhi.cases.case2.result'),
      description: t('wuye.zengzhi.cases.case2.description'),
      image: '/imgs/wuye/real/zengzhi-cases/YHS.jpeg',
      category: t('wuye.zengzhi.cases.case2.category'),
    },
    {
      title: t('wuye.zengzhi.cases.case3.title'),
      location: t('wuye.zengzhi.cases.case3.location'),
      result: t('wuye.zengzhi.cases.case3.result'),
      description: t('wuye.zengzhi.cases.case3.description'),
      image: '/imgs/wuye/real/zengzhi-cases/JPC%20Koishikawa.jpeg',
      category: t('wuye.zengzhi.cases.case3.category'),
    },
  ], [t])

  const yenFmt = useMemo(() => new Intl.NumberFormat('ja-JP'), [])
  const areaFmt = useMemo(() => new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }), [])

  const rentCases = useMemo(() => {
    return [
      { kind: '店舖', address: '神奈川県相模原市緑区', area: 57.61, before: 85000, after: 130000, diff: 45000, rate: 53, image: '/imgs/wuye/real/zengzhi-cases/Asahi Plaza Hashimoto II.jpeg' },
      { kind: '事務所', address: '東京都中央区新川', area: 70.24, before: 240000, after: 308000, diff: 68000, rate: 28, image: '/imgs/wuye/real/zengzhi-cases/Daigosankyo Building.png' },
      { kind: '事務所', address: '神奈川県横浜市西区', area: 82.21, before: 298320, after: 386000, diff: 87680, rate: 29, image: '/imgs/wuye/real/zengzhi-cases/Minato Mirai Midsquare.jpeg' },
      { kind: '住宅', address: '東京都中野区中央', area: 10.83, before: 58000, after: 65000, diff: 7000, rate: 12, image: '/imgs/wuye/real/zengzhi-cases/Urban Place V Sakagami A.jpg' },
      { kind: '住宅', address: '東京都新宿区歌舞伎町', area: 38.07, before: 128000, after: 138000, diff: 10000, rate: 8, image: '/imgs/wuye/real/zengzhi-cases/Noah Shinjuku.jpeg' },
      { kind: '住宅', address: '東京都荒川区町屋', area: 64.54, before: 136000, after: 146000, diff: 10000, rate: 7, image: '/imgs/wuye/real/zengzhi-cases/ND Building.jpeg' },
      { kind: '住宅', address: '東京都新宿区西新宿', area: 323.9, before: 1567680, after: 1693100, diff: 125420, rate: 8, image: '/imgs/wuye/real/zengzhi-cases/Token New Heights Nishi-Shinjuku.jpeg' },
      { kind: '住宅', address: '東京都杉並区荻窪', area: 30.52, before: 75000, after: 80000, diff: 5000, rate: 7, image: '/imgs/wuye/real/zengzhi-cases/Ark Ogikubo.jpeg' },
    ].map((c) => ({
      ...c,
      areaText: `${areaFmt.format(c.area)}㎡`,
      beforeText: `¥${yenFmt.format(c.before)}`,
      afterText: `¥${yenFmt.format(c.after)}`,
      diffText: `+¥${yenFmt.format(c.diff)}`,
      rateText: `${c.rate}%`,
    }))
  }, [areaFmt, yenFmt])

  const casesScrollRef = useRef<HTMLDivElement | null>(null)

  const casesBase = useMemo(() => {
    const legacy = legacyCases.map((c) => ({ type: 'legacy' as const, ...c }))
    const rent = rentCases.map((c) => ({ type: 'rent' as const, ...c }))
    return [...legacy, ...rent]
  }, [legacyCases, rentCases])

  const casesLoop = useMemo(() => {
    if (!casesBase.length) return []
    return [...casesBase, ...casesBase]
  }, [casesBase])

  // 成功案例：全端横向滚动栏（自动循环 + 鼠标拖拽 + 触摸板手势）
  useEffect(() => {
    const container = casesScrollRef.current
    if (!container) return

    // 移动端（触摸为主）优先保证“手滑横向滚动”体验：
    // - 关闭自动循环滚动，避免每帧写 scrollLeft 抵消触摸滚动
    // - 保留 scroll 归一化逻辑，保证循环列表不会跑出边界
    const isCoarsePointer =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(pointer: coarse)').matches
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isTouchDevice =
      typeof window !== 'undefined' &&
      (('ontouchstart' in window) ||
        (typeof navigator !== 'undefined' && (navigator.maxTouchPoints || 0) > 0) ||
        isCoarsePointer)
    // 触摸设备上彻底关闭自动滚动，避免与手滑抢 scrollLeft（iPhone/Safari 尤其明显）
    const enableAutoScroll = !isTouchDevice && !prefersReducedMotion

    let scrollPosition = container.scrollLeft || 0
    // 桌面端自动滚动速度：对齐“企业概要/企业持有资产”滚动栏体验
    // - 企业概要当前实现是 1px/frame（≈ 60px/s @ 60fps）
    // - 本页内容更重，帧率波动会导致“按帧加 px”变慢，所以这里用“按时间”滚动保证一致速度
    const scrollPxPerSec = 60
    let animationFrameId: number | null = null
    let isPaused = false
    let isDragging = false
    let startX = 0
    let startScrollLeft = 0
    let resumeTimeout: number | null = null
    let lastTs: number | null = null

    const getHalf = () => {
      const half = container.scrollWidth / 2
      return Number.isFinite(half) ? half : 0
    }

    const normalize = () => {
      const half = getHalf()
      if (half <= 0) return
      if (container.scrollLeft >= half) {
        container.scrollLeft -= half
      } else if (container.scrollLeft < 0) {
        container.scrollLeft += half
      }
      scrollPosition = container.scrollLeft
    }

    const tick = (ts: number) => {
      // 保证暂停/拖拽期间也更新时间戳，避免恢复时 dt 过大导致“瞬移”
      if (lastTs === null) lastTs = ts
      const dt = Math.max(0, ts - lastTs) / 1000
      lastTs = ts

      if (!isPaused && !isDragging) {
        scrollPosition += scrollPxPerSec * dt
        const half = getHalf()
        if (half > 0 && scrollPosition >= half) scrollPosition -= half
        container.scrollLeft = scrollPosition
      }
      animationFrameId = requestAnimationFrame(tick)
    }

    const onMouseEnter = () => {
      isPaused = true
    }
    const onMouseLeave = () => {
      isPaused = false
    }

    const onWheel = (e: WheelEvent) => {
      const half = getHalf()
      if (half <= 0) return
      isPaused = true
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      if (delta === 0) return
      e.preventDefault()
      e.stopPropagation()
      container.scrollLeft += delta
      normalize()
      if (resumeTimeout) window.clearTimeout(resumeTimeout)
      resumeTimeout = window.setTimeout(() => {
        isPaused = false
      }, 600)
    }

    const onPointerDown = (e: PointerEvent) => {
      // 鼠标拖拽即可；触摸保持原生惯性更丝滑
      if (e.pointerType !== 'mouse') {
        isPaused = true
        if (resumeTimeout) window.clearTimeout(resumeTimeout)
        resumeTimeout = window.setTimeout(() => {
          isPaused = false
        }, 900)
        return
      }
      if (e.button !== 0) return

      // 允许用户选中文本：如果按下发生在“可选择文本区域”，就不进入拖拽滚动模式
      const target = e.target as HTMLElement | null
      if (target && target.closest('[data-carousel-selectable="true"]')) {
        return
      }

      isDragging = true
      isPaused = true
      startX = e.clientX
      startScrollLeft = container.scrollLeft
      container.setPointerCapture?.(e.pointerId)
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return
      e.preventDefault()
      const dx = e.clientX - startX
      container.scrollLeft = startScrollLeft - dx
      normalize()
    }
    const endDrag = () => {
      if (!isDragging) return
      isDragging = false
      scrollPosition = container.scrollLeft
      isPaused = false
    }

    const onScroll = () => {
      normalize()
      isPaused = true
      if (resumeTimeout) window.clearTimeout(resumeTimeout)
      resumeTimeout = window.setTimeout(() => {
        isPaused = false
      }, 450)
    }

    container.addEventListener('mouseenter', onMouseEnter)
    container.addEventListener('mouseleave', onMouseLeave)
    container.addEventListener('pointerdown', onPointerDown, { passive: false })
    container.addEventListener('pointermove', onPointerMove, { passive: false })
    container.addEventListener('pointerup', endDrag, { passive: true })
    container.addEventListener('pointercancel', endDrag, { passive: true })
    if (enableAutoScroll) {
      container.addEventListener('wheel', onWheel, { passive: false })
    }
    container.addEventListener('scroll', onScroll, { passive: true })

    if (enableAutoScroll) {
      animationFrameId = requestAnimationFrame(tick)
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      container.removeEventListener('mouseenter', onMouseEnter)
      container.removeEventListener('mouseleave', onMouseLeave)
      container.removeEventListener('pointerdown', onPointerDown)
      container.removeEventListener('pointermove', onPointerMove)
      container.removeEventListener('pointerup', endDrag)
      container.removeEventListener('pointercancel', endDrag)
      if (enableAutoScroll) {
        container.removeEventListener('wheel', onWheel)
      }
      container.removeEventListener('scroll', onScroll)
      if (resumeTimeout) window.clearTimeout(resumeTimeout)
    }
  }, [casesLoop.length])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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

  return (
    <PageLayout>
      <div className="relative wuye-subpage">
        {/* Hero Section */}
        <section ref={heroRef} className="relative pt-28 pb-20 md:pb-24 bg-gradient-to-br from-purple-800 via-purple-700 to-navy-800 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/imgs/wuye/real/zengzhi-hero.jpg"
              alt="资产增值"
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 to-navy-900/60"></div>
            {/* 装饰性元素 */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-navy-400/20 rounded-full blur-3xl"></div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative z-10 container-custom"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={isHeroInView ? { scale: 1, rotate: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <TrendingUp className="w-8 h-8 text-purple-300" />
                  </motion.div>
                  <p className="text-sm text-purple-300 font-semibold">{t('wuye.zengzhi.subtitle')}</p>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                  {t('wuye.zengzhi.title')}
                </h1>
                <p className="text-lg text-gray-200 max-w-3xl leading-relaxed mb-8">
                  {t('wuye.zengzhi.description')}
                </p>
              </div>

              {/* 右侧：动画播放窗口（嵌入 public 下的 HTML 动画） */}
              <div className="w-full">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black/20 shadow-2xl">
                  <iframe
                    title="Bournmark 动画演示"
                    src="/imgs/wuye/real/animationHTMLCodes-2026-01-23-10-43-50.html?mode=embed"
                    className="absolute inset-0 w-full h-full"
                    loading="lazy"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    sandbox="allow-scripts allow-same-origin"
                  />
                  {/* 覆盖层：点击放大/大屏（避免 iframe 吃掉点击事件） */}
                  <button
                    type="button"
                    onClick={openAnimLarge}
                    className="absolute inset-0 cursor-pointer bg-black/0 hover:bg-black/10 transition-colors"
                    aria-label={isMobileAnimOpen ? '点击大屏播放' : '点击放大播放'}
                  />
                  <div className="absolute bottom-3 right-3 pointer-events-none">
                    <span className="px-3 py-1 rounded-full bg-black/55 border border-white/15 text-white text-xs">
                      {isMobileAnimOpen ? '点击大屏' : '点击放大'}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-white/70">
                  小窗默认静音；点击进入大屏后可播放声音；若无法播放，可
                  <a
                    href="/imgs/wuye/real/animationHTMLCodes-2026-01-23-10-43-50.html"
                    target="_blank"
                    rel="noreferrer"
                    className="ml-1 underline underline-offset-2 hover:text-white"
                  >
                    新窗口打开
                  </a>
                  。
                </div>
              </div>
            </div>

            {/* 大屏/放大弹层（手机：全屏大小；其它：居中放大） */}
            {isAnimOpen ? (
              <div
                className={`fixed inset-0 z-[9999] bg-black/70 ${isMobileAnimOpen ? 'p-2' : 'p-4 md:p-8'} flex items-center justify-center`}
                role="dialog"
                aria-modal="true"
                aria-label="MG 动画播放"
              >
                <div
                  className={`relative bg-black ${
                    isMobileAnimOpen
                      ? 'w-[min(100%,980px)] h-[92svh] rounded-2xl'
                      : 'w-[min(96vw,1100px)] h-[min(78vh,680px)] rounded-2xl'
                  } overflow-hidden shadow-2xl`}
                >
                  <button
                    type="button"
                    onClick={closeAnimLarge}
                    className="absolute z-10 w-10 h-10 rounded-full bg-black/55 border border-white/15 text-white flex items-center justify-center hover:bg-black/70"
                    style={
                      isMobileAnimOpen
                        ? {
                            top: 'calc(12px + env(safe-area-inset-top))',
                            right: 'calc(12px + env(safe-area-inset-right))',
                          }
                        : { top: 12, right: 12 }
                    }
                    aria-label="关闭"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <iframe
                    key={animKey}
                    title="Bournmark 动画演示（大屏）"
                    src="/imgs/wuye/real/animationHTMLCodes-2026-01-23-10-43-50.html"
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              </div>
            ) : null}
          </motion.div>
        </section>

        {/* Stats Section */}
        <section ref={statsRef} className="section-padding bg-gradient-to-b from-gray-900 to-navy-900">
          <div className="container-custom">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isStatsInView ? 'visible' : 'hidden'}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-300 text-center group"
                >
                  <div className="flex justify-center mb-4">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${stat.icon === TrendingUp ? 'from-blue-500 to-blue-600' : stat.icon === CheckCircle2 ? 'from-green-500 to-green-600' : stat.icon === Target ? 'from-purple-500 to-purple-600' : 'from-amber-500 to-amber-600'} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-gray-300">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section ref={servicesRef} className="section-padding">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isServicesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                {t('wuye.zengzhi.description')}
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isServicesInView ? 'visible' : 'hidden'}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
            >
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group relative bg-gray-50/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-60 group-hover:opacity-80 transition-opacity duration-300`}></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white mb-1">{service.title}</h3>
                      <p className="text-base text-white/90">{service.description}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-3">
                      {service.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-3">
                          <div className={`mt-1.5 w-2.5 h-2.5 rounded-full bg-gradient-to-br ${service.color} flex-shrink-0`}></div>
                          <span className="text-base text-gray-700 leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Success Cases Section */}
        <section ref={casesRef} className="section-padding" data-cases-style="true">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isCasesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('wuye.zengzhi.cases.title')}</h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                {t('wuye.zengzhi.cases.subtitle')}
              </p>
            </motion.div>

            {/* 全端：横向滚动栏（自动循环 + 可拖拽） */}
            <div
              ref={casesScrollRef}
              className="overflow-x-auto pb-2 scrollbar-hide cursor-grab active:cursor-grabbing"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
                scrollBehavior: 'auto',
                touchAction: 'pan-x',
                overscrollBehavior: 'contain',
              }}
            >
              <div className="flex gap-6 min-w-max px-1">
                {casesLoop.map((item, index) => (
                  <div
                    key={`${item.type}-${index}-${item.type === 'legacy' ? item.title : item.address}`}
                    className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[380px]"
                  >
                    {item.type === 'legacy' ? (
                      <div className="group bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg flex-shrink-0 cases-card flex flex-col h-[460px] md:h-[500px]">
                        <div className="relative overflow-hidden">
                          <div className="relative w-full h-64 bg-gray-200 cases-card-media" data-zengzhi-case-image="true">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover"
                              sizes="380px"
                            />
                          </div>
                          <div className="absolute top-4 right-4">
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                              {item.category}
                            </span>
                          </div>
                        </div>

                        <div className="p-6 cases-card-body flex flex-col flex-1 min-h-0" data-carousel-selectable="true">
                          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-3 cases-card-meta">
                            <Tag size={16} />
                            <span>{item.category}</span>
                          </div>
                          <h3 className="text-base md:text-xl font-semibold text-navy-900 mb-2 hover:text-blue-600 transition-colors cases-card-title line-clamp-2">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-700 mb-3 cases-card-location">
                            <MapPin size={16} />
                            <span className="min-w-0 truncate">{item.location}</span>
                          </div>
                          {/* 手机端隐藏一行“结果”，避免内容过高导致裁切/遮挡 */}
                          <div className="hidden sm:flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-3">
                            <TrendingUp size={16} className="text-green-600" />
                            <span className="font-semibold text-green-600">{item.result}</span>
                          </div>
                          <p className="text-gray-700 text-xs md:text-sm leading-relaxed line-clamp-2 cases-card-desc">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="group bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg flex-shrink-0 cases-card flex flex-col h-[460px] md:h-[500px]">
                        <div className="relative overflow-hidden">
                          <div className="relative w-full h-64 bg-gray-200 cases-card-media" data-zengzhi-case-image="true">
                            <Image
                              src={item.image}
                              alt={`${item.kind} ${item.address}`}
                              fill
                              className="object-cover"
                              sizes="380px"
                              unoptimized={item.image.startsWith('/imgs/')}
                            />
                          </div>
                          <div className="absolute top-4 right-4">
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                              {item.kind}
                            </span>
                          </div>
                        </div>

                        <div className="p-6 cases-card-body flex flex-col flex-1 min-h-0" data-carousel-selectable="true">
                          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-3 cases-card-meta">
                            <Tag size={16} />
                            <span>{item.kind}</span>
                          </div>
                          <h3 className="text-base md:text-xl font-semibold text-navy-900 mb-2 hover:text-blue-600 transition-colors cases-card-title line-clamp-2">
                            {item.address}
                          </h3>
                          <div className="flex items-center justify-between text-xs md:text-sm text-gray-700 mb-3 cases-card-location">
                            <div className="flex items-center gap-2 min-w-0">
                              <MapPin size={16} />
                              <span className="min-w-0 truncate">
                                {t('wuye.zengzhi.cases.table.area')} {item.areaText}
                              </span>
                            </div>
                            <span className="font-semibold text-green-600">{item.rateText}</span>
                          </div>

                          <div className="mt-auto rounded-xl border border-gray-200 bg-white/70 p-3 cases-card-bottom" data-carousel-selectable="true">
                            <div className="flex items-center justify-between">
                              <div className="min-w-0">
                                <div className="text-[11px] text-gray-500">{t('wuye.zengzhi.cases.table.rentBefore')}</div>
                                <div className="text-xs text-gray-700 tabular-nums">{item.beforeText}</div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-gray-400" />
                              <div className="min-w-0 text-right">
                                <div className="text-[11px] text-gray-500">{t('wuye.zengzhi.cases.table.rentAfter')}</div>
                                <div className="text-xs font-semibold text-navy-900 tabular-nums">{item.afterText}</div>
                              </div>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-bold text-green-700 tabular-nums">{item.diffText}</span>
                              </div>
                              <span className="text-sm font-bold text-green-700 tabular-nums">{item.rateText}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
