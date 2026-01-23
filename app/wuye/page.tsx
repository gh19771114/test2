'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import Link from 'next/link'
import { ClipboardCheck, DollarSign, Wrench, Shield, TrendingUp, Users, Calendar, MapPin, Search, Hand, Hammer, Coins, Building2, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useEffect, useMemo, useRef } from 'react'
import { activeManagedPropertyCards, getManagedPropertyTitle } from '@/lib/managedProperties'

export default function WuYePage() {
  const { t, language } = useLanguage()
  const propertiesScrollRef = useRef<HTMLDivElement | null>(null)

  const regularServices = useMemo(() => [
    {
      title: t('wuye.services.regular.zulin'),
      link: '/wuye/zulin',
      icon: ClipboardCheck,
    },
    {
      title: t('wuye.services.regular.shouzhi'),
      link: '/wuye/shouzhi',
      icon: DollarSign,
    },
    {
      title: t('wuye.services.regular.xiushan'),
      link: '/wuye/xiushan',
      icon: Wrench,
    },
    {
      title: t('wuye.services.regular.ruzhu'),
      link: '/wuye/ruzhu',
      icon: Users,
    },
    {
      title: t('wuye.services.regular.baoxian'),
      link: '/wuye/baoxian',
      icon: Shield,
    },
  ], [t])

  const assetAppreciationServices = useMemo(() => [
    {
      title: t('wuye.services.appreciation.marketResearch'),
      link: '/wuye/zengzhi',
      icon: Search,
    },
    {
      title: t('wuye.services.appreciation.rentNegotiation'),
      link: '/wuye/zengzhi',
      icon: Hand,
    },
    {
      title: t('wuye.services.appreciation.majorRepair'),
      link: '/wuye/zengzhi',
      icon: Hammer,
    },
    {
      title: t('wuye.services.appreciation.additionalIncome'),
      link: '/wuye/zengzhi',
      icon: Coins,
    },
  ], [t])

  const managedProperties = useMemo(() => {
    return activeManagedPropertyCards.map((card) => ({
      id: card.id,
      type: t('wuye.properties.type'),
      title: getManagedPropertyTitle(card, language),
      image: card.image,
    }))
  }, [t, language])

  // 管理房产：用于无缝自动滚动（渲染两份，滚动到一半回绕）
  const managedPropertiesLoop = useMemo(() => {
    return [...managedProperties, ...managedProperties]
  }, [managedProperties])

  // 管理房产：自动滚动 + 鼠标/触摸拖拽（参照 /company/overview 的 AutoScrollAssets 逻辑）
  useEffect(() => {
    const container = propertiesScrollRef.current
    if (!container) return

    let scrollPosition = container.scrollLeft || 0
    // 参照企业概要页：用“像素/帧”推进，体感更稳定；这里调快一些
    const scrollSpeed = 2.8 // px/frame（约 168px/s @60fps）
    let animationFrameId: number | null = null
    let isPaused = false
    let isDragging = false
    let startX = 0
    let startScrollLeft = 0
    let resumeTimeout: number | null = null

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

    const scroll = () => {
      if (isPaused || isDragging) {
        animationFrameId = requestAnimationFrame(scroll)
        return
      }

      scrollPosition += scrollSpeed
      const half = getHalf()
      if (half > 0 && scrollPosition >= half) {
        scrollPosition -= half
      }
      container.scrollLeft = scrollPosition
      animationFrameId = requestAnimationFrame(scroll)
    }

    const handleMouseEnter = () => {
      isPaused = true
    }
    const handleMouseLeave = () => {
      isPaused = false
      if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(scroll)
      }
    }

    // 触摸板/鼠标滚轮：将 deltaX/deltaY 映射为横向滚动，并阻止页面上下滚动“抢手势”
    const onWheel = (e: WheelEvent) => {
      const half = getHalf()
      if (half <= 0) return

      // 暂停自动滚动，避免抢夺
      isPaused = true

      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      if (delta === 0) return

      // 需要 non-passive 才能 preventDefault
      e.preventDefault()
      e.stopPropagation()
      container.scrollLeft += delta
      normalize()

      window.setTimeout(() => {
        isPaused = false
      }, 600)
    }

    const onPointerDown = (e: PointerEvent) => {
      // 移动端用原生滚动（带惯性）更丝滑：这里只保留鼠标拖拽
      if (e.pointerType !== 'mouse') {
        isPaused = true
        if (resumeTimeout) window.clearTimeout(resumeTimeout)
        resumeTimeout = window.setTimeout(() => {
          isPaused = false
        }, 900)
        return
      }
      if (e.button !== 0) return
      isDragging = true
      isPaused = true
      startX = e.clientX
      startScrollLeft = container.scrollLeft
      container.setPointerCapture?.(e.pointerId)
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return
      // 非 passive listener 下可阻止默认滚动，避免页面上下移动
      e.preventDefault()
      const dx = e.clientX - startX
      container.scrollLeft = startScrollLeft - dx
      normalize()
    }
    const endDrag = () => {
      if (!isDragging) return
      isDragging = false
      // 同步 scrollPosition，避免松手后“跳回”或速度突变
      scrollPosition = container.scrollLeft
      isPaused = false
    }

    // 原生滚动（手机惯性/触摸板）时，同步 scrollPosition 并短暂停止自动滚动，避免“抢滚动”
    const onScroll = () => {
      normalize()
      isPaused = true
      if (resumeTimeout) window.clearTimeout(resumeTimeout)
      resumeTimeout = window.setTimeout(() => {
        isPaused = false
      }, 450)
    }

    container.addEventListener('mouseenter', handleMouseEnter)
    container.addEventListener('mouseleave', handleMouseLeave)
    // 关键：pointermove 必须 non-passive，才能 preventDefault 阻止页面滚动
    container.addEventListener('pointerdown', onPointerDown, { passive: false })
    container.addEventListener('pointermove', onPointerMove, { passive: false })
    container.addEventListener('pointerup', endDrag, { passive: true })
    container.addEventListener('pointercancel', endDrag, { passive: true })
    // 关键：wheel 必须 non-passive，才能接管触摸板横向手势
    container.addEventListener('wheel', onWheel, { passive: false })
    container.addEventListener('scroll', onScroll, { passive: true })

    animationFrameId = requestAnimationFrame(scroll)

    return () => {
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId)
      container.removeEventListener('mouseenter', handleMouseEnter)
      container.removeEventListener('mouseleave', handleMouseLeave)
      container.removeEventListener('pointerdown', onPointerDown as any)
      container.removeEventListener('pointermove', onPointerMove as any)
      container.removeEventListener('pointerup', endDrag as any)
      container.removeEventListener('pointercancel', endDrag as any)
      container.removeEventListener('wheel', onWheel as any)
      container.removeEventListener('scroll', onScroll as any)
      if (resumeTimeout) window.clearTimeout(resumeTimeout)
    }
  }, [])
  return (
    <PageLayout>
      <div className="relative">
          {/* Hero Section with Background Image */}
          <section className="relative pt-28 pb-16 bg-gradient-to-br from-blue-800 via-blue-700 to-navy-800 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/imgs/wuye/real/wuye-hero.jpg"
              alt={t('wuye.title')}
              fill
              className="object-cover opacity-30"
              priority
            />
          </div>
          <div className="relative z-10 container-custom">
            <p className="text-sm text-blue-300 font-semibold mb-4">{t('wuye.subtitle')}</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">{t('wuye.title')}</h1>
            <p className="text-lg text-gray-200 max-w-3xl leading-relaxed">
              {t('wuye.description')}
            </p>
          </div>
        </section>

      <section id="tenant-services" className="section-padding">
        <div className="container-custom">
          {/* 左右两个大方块 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 常规服务 - 左侧大方块 */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 md:p-10 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl md:text-3xl font-bold text-navy-700 mb-8 text-center">{t('wuye.services.regularTitle')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {regularServices.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link key={item.title} href={item.link} className="block">
                      <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer wuye-service-item h-[112px] overflow-hidden">
                        <div className="flex flex-col md:flex-row items-center md:items-center justify-center md:justify-start gap-3 text-center md:text-left">
                          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Icon className="w-7 h-7 text-blue-600" />
                          </div>
                          <h4 className="text-lg md:text-base font-semibold text-navy-700 whitespace-pre-line leading-snug break-words line-clamp-2 min-w-0">{item.title}</h4>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* 资产维护&增值服务 - 右侧大方块（更醒目的主视觉入口） */}
            <div className="relative overflow-hidden rounded-3xl border-2 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0">
                <Image
                  src="/imgs/wuye/real/zengzhi-hero.jpg"
                  alt={t('wuye.services.appreciationTitle')}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-950/90 via-purple-900/78 to-navy-950/90" />
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-fuchsia-400/25 rounded-full blur-3xl" />
                <div className="absolute -bottom-28 -left-28 w-96 h-96 bg-blue-400/18 rounded-full blur-3xl" />
              </div>

              <div className="relative p-8 md:p-10">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm text-purple-200 font-semibold tracking-wide">
                      {t('wuye.zengzhi.subtitle')}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-tight break-words">
                      {t('wuye.services.appreciationTitle')}
                    </h3>
                  </div>
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center backdrop-blur-sm">
                    <TrendingUp className="w-6 h-6 text-purple-200" />
                  </div>
                </div>

                <p className="mt-4 text-sm md:text-base text-white/85 leading-relaxed">
                  {t('wuye.zengzhi.description')}
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {assetAppreciationServices.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.title}
                        href={item.link}
                        className="group block rounded-2xl bg-white/10 hover:bg-white/14 border border-white/15 hover:border-white/25 backdrop-blur-sm transition-all duration-300"
                      >
                        <div className="flex items-center gap-3 p-4">
                          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm md:text-base font-semibold text-white leading-snug break-words">
                              {item.title}
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>

                <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-3">
                  <Link
                    href="/wuye/zengzhi"
                    className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500 to-purple-500 px-5 py-3 text-white font-semibold shadow-lg hover:shadow-xl hover:brightness-110 transition-all duration-300"
                  >
                    <span className="truncate">{t('wuye.zengzhi.title')}</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>

                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-white/90">
                      {t('wuye.zengzhi.features.experience')}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-white/90">
                      {t('wuye.zengzhi.features.cases')}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-white/90">
                      {t('wuye.zengzhi.features.rentIncrease')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-white mb-6">{t('wuye.properties.title')}</h2>
          {/* 全端：横向滚动（使用 imgs/2 生成的卡片） */}
          <div
            ref={propertiesScrollRef}
            className="wuye-properties-scroll-container overflow-x-auto pb-4 scrollbar-hide select-none cursor-grab active:cursor-grabbing"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              scrollBehavior: 'auto',
              // 让浏览器把该区域识别为“横向手势区域”，减少页面竖向滚动抢手势
              touchAction: 'pan-x',
              overscrollBehavior: 'contain',
            }}
          >
            <div className="flex gap-4 min-w-max wuye-properties-scroll-wrapper px-1">
              {managedPropertiesLoop.map((property, index) => (
                <div
                  key={`${property.id}-${index < managedProperties.length ? 'a' : 'b'}`}
                  className="group bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg transition-all duration-300 wuye-property-card flex-shrink-0 w-[300px] sm:w-[320px] md:w-[360px] lg:w-[380px]"
                >
                  <div className="relative overflow-hidden">
                    <div className="relative w-full h-[200px] md:h-[220px] wuye-property-image">
                      <Image
                        src={property.image}
                        alt={property.title}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 380px, (min-width: 768px) 360px, 320px"
                        unoptimized={property.image.startsWith('/imgs/')}
                        priority={index < 6}
                      />
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {property.type}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 md:p-5">
                    <h3 className="text-lg md:text-xl font-semibold text-navy-700 wuye-property-title line-clamp-2">
                      {property.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 统计信息 */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto wuye-stats-grid">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border-2 border-blue-200 shadow-lg wuye-stat-btn">
              <div className="flex items-center gap-4 wuye-stat-btn-inner">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 wuye-stat-btn-icon">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div className="wuye-stat-btn-text">
                  <h3 className="text-2xl md:text-3xl font-bold text-navy-900 mb-1 wuye-stat-btn-value">
                    <span>1,300</span><span className="ml-2">{t('wuye.stats.units')}</span>
                  </h3>
                  <p className="text-base md:text-lg text-gray-700 font-medium wuye-stat-btn-label">{t('wuye.stats.totalProperties')}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 border-2 border-green-200 shadow-lg wuye-stat-btn">
              <div className="flex items-center gap-4 wuye-stat-btn-inner">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 wuye-stat-btn-icon">
                  <span className="text-white text-3xl font-bold">¥</span>
                </div>
                <div className="wuye-stat-btn-text">
                  <h3 className="text-2xl md:text-3xl font-bold text-navy-900 mb-1 wuye-stat-btn-value">
                    <span>{t('wuye.stats.amountValue')}</span><span className="ml-2">{t('wuye.stats.yen')}</span>
                  </h3>
                  <p className="text-base md:text-lg text-gray-700 font-medium wuye-stat-btn-label">{t('wuye.stats.totalAssets')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-bold text-white mb-4">{t('wuye.cta.title')}</h2>
          <p className="text-gray-200 max-w-2xl mx-auto mb-6 leading-relaxed">
            {t('wuye.cta.description')}
          </p>
          <a href="/#contact" className="btn-primary inline-flex items-center gap-2">
            {t('wuye.cta.button')}
          </a>
        </div>
      </section>
      </div>
    </PageLayout>
  )
}

