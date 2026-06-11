'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { useMemo, useEffect, useRef, useState } from 'react'
import React from 'react'
import { investmentProperties } from '@/app/touzi/propertyData'

function BankLogo({ bank }: { bank: { name: string; logo: string; abbr: string; color: string } }) {
  const [error, setError] = useState(false)
  if (error) {
    return (
      <div className={`w-full h-full rounded-lg flex items-center justify-center text-white text-xs md:text-sm font-semibold ${bank.color}`}>
        {bank.abbr}
      </div>
    )
  }
  return (
    <Image
      src={bank.logo}
      alt={bank.name}
      width={96}
      height={64}
      className="w-full h-full object-contain p-0.5 md:p-1"
      sizes="96px"
      unoptimized
      onError={() => setError(true)}
    />
  )
}

export default function CompanyOverviewPage() {
  const { t, tTitle } = useLanguage()

  const professionalTeam = useMemo(() => [
    { title: t('company.overview.team.team1.title'), count: t('company.overview.team.team1.count') },
    { title: t('company.overview.team.team2.title'), count: t('company.overview.team.team2.count') },
    { title: t('company.overview.team.team3.title'), count: t('company.overview.team.team3.count') },
    { title: t('company.overview.team.team4.title'), count: t('company.overview.team.team4.count') },
    { title: t('company.overview.team.team5.title'), count: t('company.overview.team.team5.count') },
  ], [t])

  const partnerNetwork = useMemo(() => [
    { title: t('company.overview.partners.partner1.title'), count: t('company.overview.partners.partner1.count') },
    { title: t('company.overview.partners.partner2.title'), count: t('company.overview.partners.partner2.count') },
    { title: t('company.overview.partners.partner3.title'), count: t('company.overview.partners.partner3.count') },
    { title: t('company.overview.partners.partner4.title'), count: t('company.overview.partners.partner4.count') },
    { title: t('company.overview.partners.partner5.title'), count: t('company.overview.partners.partner5.count') },
    { title: t('company.overview.partners.partner6.title'), count: t('company.overview.partners.partner6.count') },
    { title: t('company.overview.partners.partner7.title'), count: t('company.overview.partners.partner7.count') },
  ], [t])

  const corporateProfile = useMemo(() => [
    { 
      label: t('company.overview.profile.companyName'), 
      value: t('company.overview.profile.companyNameValue'),
      isCompanyName: true // 标记为公司名称，需要特殊处理
    },
    { label: t('company.overview.profile.establishmentDate'), value: t('company.overview.profile.establishmentDateValue') },
    { label: t('company.overview.profile.legalRepresentative'), value: t('company.overview.profile.legalRepresentativeValue') },
    { label: t('company.overview.profile.capital'), value: t('company.overview.profile.capitalValue') },
    { label: t('company.overview.profile.headquartersAddress'), value: t('company.overview.profile.headquartersAddressValue') },
    {
      label: t('company.overview.profile.businessContent'),
      value: t('company.overview.profile.businessContentValue'),
    },
    {
      label: t('company.overview.profile.affiliatedGroups'),
      value: t('company.overview.profile.affiliatedGroupsValue'),
    },
    {
      label: t('company.overview.profile.qualifications'),
      value: t('company.overview.profile.qualificationsValue'),
    },
  ], [t])

  const financialPartners = useMemo(() => [
    { name: t('company.overview.financialPartners.bank1.name'), branch: t('company.overview.financialPartners.bank1.branch'), logo: '/imgs/company/banks/smbc.svg', abbr: 'SMBC', color: 'bg-green-600' },
    { name: t('company.overview.financialPartners.bank2.name'), branch: t('company.overview.financialPartners.bank2.branch'), logo: '/imgs/company/banks/mufg.svg', abbr: 'MUFG', color: 'bg-red-600' },
    { name: t('company.overview.financialPartners.bank3.name'), branch: t('company.overview.financialPartners.bank3.branch'), logo: '/imgs/company/banks/mizuho.svg', abbr: 'MIZUHO', color: 'bg-blue-600' },
    { name: t('company.overview.financialPartners.bank4.name'), branch: t('company.overview.financialPartners.bank4.branch'), logo: '/imgs/company/banks/kiraboshi.png', abbr: 'KIRA', color: 'bg-purple-500' },
    { name: t('company.overview.financialPartners.bank5.name'), branch: t('company.overview.financialPartners.bank5.branch'), logo: '/imgs/company/banks/higashi.svg', abbr: 'HIGASHI', color: 'bg-cyan-600' },
    { name: t('company.overview.financialPartners.bank6.name'), branch: t('company.overview.financialPartners.bank6.branch'), logo: '/imgs/company/banks/kansaimirai.svg', abbr: 'KMB', color: 'bg-emerald-600' },
    { name: t('company.overview.financialPartners.bank7.name'), branch: t('company.overview.financialPartners.bank7.branch'), logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Tokyo_Shinkin_Bank_Logo.svg/3840px-Tokyo_Shinkin_Bank_Logo.svg.png', abbr: 'TOSHI', color: 'bg-orange-500' },
    { name: t('company.overview.financialPartners.bank8.name'), branch: t('company.overview.financialPartners.bank8.branch'), logo: '/imgs/company/banks/sugamo_shinkin.png', abbr: 'SUGAMO', color: 'bg-amber-600' },
  ], [t])

  return (
    <PageLayout>
        <div className="relative">
        <section className="relative pt-28 pb-16 bg-gradient-to-br from-navy-800 via-blue-800 to-purple-800 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt={t('company.overview.title')}
              fill
              className="object-cover opacity-30"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-navy-900/80 to-blue-900/60"></div>
          </div>
          <div className="relative z-10 container-custom space-y-4">
            <p className="text-sm text-blue-200 font-semibold">{t('company.overview.subtitle')}</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">{t('company.overview.title')}</h1>
            <div className="max-w-4xl space-y-4 text-gray-100 text-lg leading-relaxed">
              <p>
                {t('company.overview.description1')}
              </p>
              <p>
                {t('company.overview.description2')}
              </p>
            </div>
          </div>
        </section>

        <section className="py-3 md:py-6">
          <div className="container-custom">
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-3 md:gap-6 items-stretch">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-3 md:p-6 relative">
                {/* 手机竖版：公司大楼图片放在容器上面 */}
                <div className="md:hidden mb-4 w-full rounded-xl overflow-hidden border border-blue-100 shadow-md company-overview-mobile-image">
                  <Image
                    src="/imgs/honsha.png"
                    alt={t('company.overview.headquartersImageAlt')}
                    width={800}
                    height={600}
                    className="w-full h-auto object-contain"
                    priority={false}
                    sizes="100vw"
                  />
                </div>
                
                {/* iPad版：公司大楼图片放在容器内右上方 */}
                <div className="hidden md:block xl:hidden absolute top-3 right-3 company-overview-ipad-image rounded-xl overflow-hidden border border-blue-100 shadow-md z-10">
                  <Image
                    src="/imgs/honsha.png"
                    alt={t('company.overview.headquartersImageAlt')}
                    fill
                    className="object-contain"
                    priority={false}
                    sizes="256px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-transparent"></div>
                </div>
                
                <h2 className="text-xl md:text-2xl font-bold text-navy-700 mb-2 md:mb-4 md:pr-36 xl:pr-0">{t('company.overview.profileTitle')}</h2>
                <div className="space-y-1.5 md:space-y-2.5 md:pr-36 xl:pr-0">
                  {corporateProfile.map((item, index) => {
                    const isCompanyName = (item as any).isCompanyName
                    const isHeadquartersAddress = item.label === t('company.overview.profile.headquartersAddress')
                    // 匹配格式：川雨流痕股份有限公司（Bourn Mark CO., LTD.）
                    const companyNameMatch = isCompanyName ? item.value.match(/^(.+?)[（(](.+?)[）)]$/) : null
                    // 匹配总部地址：提取"Bourn Mark Ningyocho BLD. 2F"部分
                    const addressMatch = isHeadquartersAddress ? item.value.match(/^(.+?)\s+(Bourn\s+Mark.+)$/) : null
                    
                    return (
                      <div key={item.label} className={`${index !== corporateProfile.length - 1 ? 'border-b border-gray-200 pb-1.5 md:pb-2.5' : ''}`}>
                        {isCompanyName && companyNameMatch ? (
                          // 公司名称特殊处理：括号内容放到第二行
                          <>
                            {/* 手机版布局 */}
                            <div className="flex md:hidden flex-row items-start justify-between gap-3">
                              <p className="text-sm font-semibold text-blue-600 tracking-wide flex-shrink-0">{item.label}</p>
                              <div className="flex-1 text-right min-w-0">
                                <div className="text-gray-700 text-sm break-words">{companyNameMatch[1]}</div>
                                <div className="text-gray-700 text-sm mt-0.5 break-words">（{companyNameMatch[2]}）</div>
                              </div>
                            </div>
                            {/* iPad和桌面版布局 */}
                            <div className="hidden md:flex md:flex-row md:items-start gap-3">
                              <p className="text-sm font-semibold text-blue-600 tracking-wide flex-shrink-0 md:w-32 lg:w-40">{item.label}</p>
                              <div className="flex-1">
                                <div className="text-gray-700 text-sm md:text-base">{companyNameMatch[1]}</div>
                                <div className="text-gray-700 text-sm md:text-base mt-0.5">（{companyNameMatch[2]}）</div>
                              </div>
                            </div>
                          </>
                        ) : isHeadquartersAddress && addressMatch ? (
                          // 总部地址特殊处理：Bourn Mark部分放到第二行
                          <div className="flex flex-row md:flex-row items-start justify-between md:justify-start gap-3">
                            <p className="text-sm font-semibold text-blue-600 tracking-wide flex-shrink-0 md:w-32 lg:w-40">{item.label}</p>
                            <div className="text-gray-700 leading-relaxed text-sm md:text-base flex-1 text-right md:text-left">
                              <div className="text-balance">{addressMatch[1]}</div>
                              <div className="text-balance mt-0.5">{addressMatch[2]}</div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-row md:flex-row items-start justify-between md:justify-start gap-3">
                            <p className="text-sm font-semibold text-blue-600 tracking-wide flex-shrink-0 md:w-32 lg:w-40">{item.label}</p>
                            <div className="text-gray-700 leading-relaxed text-sm md:text-base flex-1 text-right md:text-left">
                              {item.label === t('company.overview.profile.qualifications') ? (
                                // 资格认证特殊处理：防止"东京都知事"和"国土交通大臣"被分开
                                <div className="whitespace-pre-line">
                                  {item.value.split('\n').map((line: string, idx: number) => (
                                    <div key={idx} className="mb-1 last:mb-0">
                                      {line.includes('東京都知事') ? (
                                        <>
                                          {line.split('東京都知事').map((part: string, partIdx: number, parts: string[]) => (
                                            <React.Fragment key={partIdx}>
                                              {part}
                                              {partIdx < parts.length - 1 && <span className="whitespace-nowrap">東京都知事</span>}
                                            </React.Fragment>
                                          ))}
                                        </>
                                      ) : line.includes('国土交通大臣') ? (
                                        <>
                                          {line.split('国土交通大臣').map((part: string, partIdx: number, parts: string[]) => (
                                            <React.Fragment key={partIdx}>
                                              {part}
                                              {partIdx < parts.length - 1 && <span className="whitespace-nowrap">国土交通大臣</span>}
                                            </React.Fragment>
                                          ))}
                                        </>
                                      ) : (
                                        line
                                      )}
                    </div>
                  ))}
                                </div>
                              ) : (
                                <p className="text-balance whitespace-pre-line">{item.value}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 桌面版：公司大楼图片独立显示 */}
              <div className="hidden xl:block relative overflow-hidden rounded-3xl border border-blue-100 shadow-xl min-h-[260px] xl:min-h-full">
                <Image
                  src="/imgs/honsha.png"
                  alt={t('company.overview.headquartersImageAlt')}
                  fill
                  className="object-contain"
                  priority={false}
                  sizes="(min-width: 1280px) 40vw, 80vw"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/25 via-black/15 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-1 md:py-6">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-1.5 md:gap-5">
              <div className="bg-white rounded-2xl p-1.5 md:p-5 shadow-lg border border-gray-100">
                <h2 className="text-xl md:text-2xl font-bold text-navy-700 mb-0.5 md:mb-4">{t('company.overview.teamTitle')}</h2>
                <div className="grid grid-cols-2 gap-0.5 md:gap-2.5">
                  {professionalTeam.map((item) => (
                    <div key={item.title} className="flex items-center justify-between bg-blue-50 rounded-xl px-1 py-0.5 md:px-3 md:py-2">
                      <span className="text-gray-700 font-medium text-xs md:text-base break-words">{item.title}</span>
                      <span className="text-blue-600 font-semibold text-xs md:text-base flex-shrink-0 ml-0.5">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-1.5 md:p-5 shadow-lg border border-gray-100">
                <h2 className="text-xl md:text-2xl font-bold text-navy-700 mb-0.5 md:mb-4">{t('company.overview.partnersTitle')}</h2>
                <div className="grid grid-cols-2 gap-0.5 md:gap-2.5">
                  {partnerNetwork.map((item) => (
                    <div key={item.title} className="flex items-center justify-between bg-green-50 rounded-xl px-1 py-0.5 md:px-3 md:py-2">
                      <span className="text-gray-700 font-medium text-xs md:text-base break-words">{item.title}</span>
                      <span className="text-green-600 font-semibold text-xs md:text-base flex-shrink-0 ml-0.5">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-1 md:py-6">
          <div className="container-custom max-w-6xl">
            <div className="bg-gray-50 rounded-3xl p-1.5 md:p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-navy-700 mb-0.5 md:mb-4 text-center">{t('company.overview.financialPartnersTitle')}</h2>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-0.5 md:gap-3">
                {financialPartners.map((bank) => (
                  <div key={bank.name} className="flex items-center gap-0.5 md:gap-3 bg-white rounded-xl px-1 py-0.5 md:px-4 md:py-3 border border-gray-100 shadow-sm">
                    <div className="w-14 h-10 md:w-24 md:h-16 rounded-lg flex items-center justify-center flex-shrink-0 bg-white border border-gray-100 overflow-hidden">
                      <BankLogo bank={bank} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 font-semibold text-[11px] md:text-base break-words leading-tight">{bank.name}</p>
                      <p className="text-[10px] md:text-xs text-gray-500 mt-0 break-words leading-tight">{bank.branch}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 企业持有资产横向滚动展示框 */}
        <section className="py-6 md:py-12 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-navy-700 mb-6 md:mb-8 text-center">
              {t('company.overview.assetsTitle')}
            </h2>
            <AutoScrollAssets />
          </div>
        </section>
      </div>
    </PageLayout>
  )
}

// 自动横向滚动资产展示组件
function AutoScrollAssets() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const { t, tTitle } = useLanguage()

  useEffect(() => {
    const container = scrollContainerRef.current
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

    // 触摸设备保留原生惯性滚动；桌面端启用更丝滑的 transform 自动滚动
    const enableAuto = !isTouchDevice && !prefersReducedMotion

    let offsetPx = 0
    const scrollPxPerSec = 140
    let rafId: number | null = null
    let isPaused = false
    let isDragging = false
    let startX = 0
    let startOffset = 0
    let resumeTimeout: number | null = null
    let lastTs: number | null = null

    const prevWillChange = track.style.willChange
    track.style.willChange = 'transform'

    const getHalf = () => {
      const half = track.scrollWidth / 2
      return Number.isFinite(half) ? half : 0
    }

    const normalize = () => {
      const half = getHalf()
      if (half <= 0) return
      offsetPx = ((offsetPx % half) + half) % half
    }

    const apply = () => {
      track.style.transform = `translate3d(${-offsetPx}px, 0, 0)`
    }

    const tick = (ts: number) => {
      if (lastTs === null) lastTs = ts
      const dt = Math.max(0, ts - lastTs) / 1000
      lastTs = ts

      if (enableAuto && !isPaused && !isDragging) {
        offsetPx += scrollPxPerSec * dt
        normalize()
        apply()
      }

      rafId = requestAnimationFrame(tick)
    }

    const pauseBriefly = (ms: number) => {
      isPaused = true
      if (resumeTimeout) window.clearTimeout(resumeTimeout)
      resumeTimeout = window.setTimeout(() => {
        isPaused = false
      }, ms)
    }

    const onWheel = (e: WheelEvent) => {
      if (!enableAuto) return
      const half = getHalf()
      if (half <= 0) return

      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      if (delta === 0) return

      e.preventDefault()
      e.stopPropagation()
      offsetPx += delta
      normalize()
      apply()
      pauseBriefly(600)
    }

    const onPointerDown = (e: PointerEvent) => {
      // 桌面鼠标拖拽；触摸设备走原生滚动
      if (!enableAuto || e.pointerType !== 'mouse') return
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
      normalize()
      apply()
    }
    const endDrag = () => {
      if (!isDragging) return
      isDragging = false
      isPaused = false
    }

    // 启用自动滚动时，把外层滚动关掉（避免 scrollLeft 与 transform 互相打架）
    const prevOverflowX = container.style.overflowX
    if (enableAuto) {
      container.style.overflowX = 'hidden'
      container.scrollLeft = 0
      offsetPx = 0
      apply()
    }

    container.addEventListener('pointerdown', onPointerDown, { passive: false })
    container.addEventListener('pointermove', onPointerMove, { passive: false })
    container.addEventListener('pointerup', endDrag, { passive: true })
    container.addEventListener('pointercancel', endDrag, { passive: true })
    container.addEventListener('wheel', onWheel, { passive: false })

    rafId = requestAnimationFrame(tick)

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      container.removeEventListener('pointerdown', onPointerDown as any)
      container.removeEventListener('pointermove', onPointerMove as any)
      container.removeEventListener('pointerup', endDrag as any)
      container.removeEventListener('pointercancel', endDrag as any)
      container.removeEventListener('wheel', onWheel as any)
      if (resumeTimeout) window.clearTimeout(resumeTimeout)
      track.style.willChange = prevWillChange
      track.style.transform = ''
      container.style.overflowX = prevOverflowX
    }
  }, [])

  // 为了无缝循环，需要复制资产列表
  const duplicatedAssets = [...investmentProperties, ...investmentProperties]

  return (
    <div className="relative">
      {/* 左侧渐变遮罩 */}
      <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent z-10 pointer-events-none"></div>
      {/* 右侧渐变遮罩 */}
      <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent z-10 pointer-events-none"></div>
      
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-x',
          overscrollBehavior: 'contain',
        }}
      >
        <div ref={trackRef} className="flex gap-4 md:gap-6 min-w-max">
          {duplicatedAssets.map((property, index) => {
            const title = tTitle(property.titleKey)
            const location = t(property.locationKey)
            // 仅对“Logo 类图片”使用 contain + 留白；本社大楼（honsha）为照片类，需贴边显示
            const contain = /(^|\/)(helte|logo)\b/i.test(property.image || '') || /logo/i.test(property.image || '')
            return (
              <div
                key={`${property.titleKey}-${index}`}
                className="flex-shrink-0 w-64 md:w-80 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="relative h-48 md:h-56 bg-gradient-to-br from-gray-100 to-gray-200">
                  {property.image ? (
                    <div className={`absolute inset-0 ${contain ? 'p-6 bg-white' : ''}`}>
                      <div className="relative w-full h-full">
                        <Image
                          src={property.image}
                          alt={title}
                          fill
                          className={`${contain ? 'object-contain' : 'object-cover'} transition-transform duration-300 group-hover:scale-105`}
                          sizes="320px"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      {t('company.overview.assets.noImage')}
                    </div>
                  )}
                </div>
                <div className="p-4 md:p-5">
                  <h3 className="text-lg md:text-xl font-bold text-navy-800 mb-2 line-clamp-2">
                    {title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600">
                    {location}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
