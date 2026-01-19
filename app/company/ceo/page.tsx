'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import { useEffect, useState, useMemo, Fragment, useRef } from 'react'
import ceoPortrait1 from '@/imgs/ceo3.png'
import ceoPortrait2 from '@/imgs/ceo2.png'
import { useLanguage } from '@/contexts/LanguageContext'

export default function CompanyCeoPage() {
  const { t, language } = useLanguage()
  const [activeTab, setActiveTab] = useState<'profile' | 'message'>('profile')

  const [isIpadDevice, setIsIpadDevice] = useState(false)
  const [ipadOrientation, setIpadOrientation] = useState<'landscape' | 'portrait'>('portrait')
  const ipadLandscapeTextBasePx = 434
  const ipadLandscapeTextScale = 1.2 // “当前的120%”
  const ipadLandscapeTextMaxPx = Math.round(ipadLandscapeTextBasePx * ipadLandscapeTextScale) // 521
  const [ipadLandscapeTextWidthPx, setIpadLandscapeTextWidthPx] = useState<number>(ipadLandscapeTextMaxPx)

  // iPad（含外接键盘/触控板）设备识别：用 data-attribute 让 CSS 稳定命中，不再依赖 any-pointer/hover
  useEffect(() => {
    if (typeof window === 'undefined') return

    const root = document.documentElement
    const isIpad =
      /iPad/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && (navigator as any).maxTouchPoints > 1)

    if (!isIpad) {
      // 清理可能残留的标记
      if (root.dataset.device === 'ipad') delete root.dataset.device
      if (root.dataset.orientation) delete root.dataset.orientation
      setIsIpadDevice(false)
      return
    }

    root.dataset.device = 'ipad'
    setIsIpadDevice(true)

    const syncOrientation = () => {
      const isLandscape = window.matchMedia?.('(orientation: landscape)')?.matches
      root.dataset.orientation = isLandscape ? 'landscape' : 'portrait'
      setIpadOrientation(isLandscape ? 'landscape' : 'portrait')
    }

    syncOrientation()
    window.addEventListener('orientationchange', syncOrientation)
    window.addEventListener('resize', syncOrientation)

    return () => {
      window.removeEventListener('orientationchange', syncOrientation)
      window.removeEventListener('resize', syncOrientation)
    }
  }, [])

  const profileHighlights = useMemo(() => [
    { label: t('company.ceo.profile.highlights.birth.label'), value: t('company.ceo.profile.highlights.birth.value', { returnObjects: true }) },
    { label: t('company.ceo.profile.highlights.earlyExperience.label'), value: t('company.ceo.profile.highlights.earlyExperience.value', { returnObjects: true }) },
    { label: t('company.ceo.profile.highlights.qualification.label'), value: t('company.ceo.profile.highlights.qualification.value') },
    { label: t('company.ceo.profile.highlights.career.label'), value: t('company.ceo.profile.highlights.career.value', { returnObjects: true }) },
    { label: t('company.ceo.profile.highlights.currentPosition.label'), value: t('company.ceo.profile.highlights.currentPosition.value') },
    { label: t('company.ceo.profile.highlights.socialPosition.label'), value: t('company.ceo.profile.highlights.socialPosition.value', { returnObjects: true }) },
    { label: t('company.ceo.profile.highlights.media.label'), value: t('company.ceo.profile.highlights.media.value', { returnObjects: true }) },
  ], [t])

  // 原始文本（用于桌面版和iPad横版）
  const messageParagraphsOriginal = useMemo(() => {
    const paragraphs = t('company.ceo.message.paragraphs.original', { returnObjects: true })
    return Array.isArray(paragraphs) ? paragraphs : []
  }, [t])

  // 带换行标签的文本（用于iPad竖版）
  const messageParagraphs = useMemo(() => {
    const paragraphs = t('company.ceo.message.paragraphs.withBreaks', { returnObjects: true })
    return Array.isArray(paragraphs) ? paragraphs : []
  }, [t])

  // 手机竖版：按“第一行（到‘业务为起’）”的实际宽度锁定前两段的行宽，让第 1/2 段每一行都按同一行宽排版
  const [mobilePortraitIntroWidthPx, setMobilePortraitIntroWidthPx] = useState<number | null>(null)
  const mobilePortraitIntroRef = useRef<HTMLDivElement | null>(null)

  // 手机竖版：第一段强制换行（“业务为起”后换行，让“点，于2009年...”进入第二行）
  const mobilePortraitMessageParagraphs = useMemo(() => {
    // 只在中文系做这个精确换行（英文/日文不适用该短语）
    const shouldApply =
      language === 'zh' || language === 'zh-HK' || language === 'zh-TW'
    if (!shouldApply) return messageParagraphs

    if (!Array.isArray(messageParagraphs) || messageParagraphs.length === 0) return messageParagraphs
    const cloned = [...messageParagraphs]
    const p0 = String(cloned[0] ?? '')
    // 将 “业务为起点，于2009年” 改为 “业务为起<br/>点，于2009年”
    // 兼容全角/半角逗号与可能的空格
    cloned[0] = p0.replace(
      /业务为起点[，,]\s*于\s*2009\s*年/g,
      '业务为起<br/>点，于2009年'
    )
    return cloned
  }, [messageParagraphs, language])

  useEffect(() => {
    // 只在手机竖版（非 iPad）测量
    if (typeof window === 'undefined') return
    if (isIpadDevice) return
    if (!window.matchMedia?.('(orientation: portrait)')?.matches) return
    if (window.innerWidth > 767) return

    const host = mobilePortraitIntroRef.current
    if (!host) return

    const firstParaRaw = mobilePortraitMessageParagraphs?.[0]
    if (!firstParaRaw) return

    // 取“业务为起”之前的文本作为第一行（因为我们会在“业务为起”后插入 <br/>）
    const plain = String(firstParaRaw).replace(/<[^>]*>/g, '')
    const idx = plain.indexOf('业务为起')
    if (idx === -1) return
    const firstLineText = plain.slice(0, idx + '业务为起'.length)

    const measure = () => {
      const sampleP = host.querySelector('p') as HTMLElement | null
      const cs = sampleP ? window.getComputedStyle(sampleP) : null

      const span = document.createElement('span')
      span.style.position = 'absolute'
      span.style.left = '-99999px'
      span.style.top = '-99999px'
      span.style.visibility = 'hidden'
      span.style.whiteSpace = 'nowrap'
      span.style.fontFamily = cs?.fontFamily || 'inherit'
      span.style.fontSize = cs?.fontSize || '14px'
      span.style.fontWeight = cs?.fontWeight || '400'
      span.style.letterSpacing = cs?.letterSpacing || 'normal'
      span.textContent = firstLineText
      document.body.appendChild(span)
      const w = Math.ceil(span.getBoundingClientRect().width)
      span.remove()

      // 给一点点安全余量，避免设备字体渲染差异导致意外换行
      setMobilePortraitIntroWidthPx(Math.max(240, w + 6))
    }

    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('orientationchange', measure)
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('orientationchange', measure)
    }
  }, [isIpadDevice, mobilePortraitMessageParagraphs])

  // iPad 横版：根据第一行（到“于 2009 年”）实际文本宽度，动态锁定正文容器宽度
  // 目的：保证第一行不会在更早处自动换行，并让后续段落沿用同一宽度。
  useEffect(() => {
    if (!isIpadDevice || ipadOrientation !== 'landscape') return
    if (typeof window === 'undefined') return

    const firstPara = messageParagraphsOriginal?.[0]
    if (!firstPara) return

    const re = /于\s*2009\s*年/
    const m = firstPara.match(re)
    if (!m || m.index === undefined) return

    const cutEnd = m.index + m[0].length
    const firstLineText = firstPara.slice(0, cutEnd)

    const measure = () => {
      // 创建离屏 span 测量文本宽度（尽量匹配正文样式）
      const span = document.createElement('span')
      span.style.position = 'absolute'
      span.style.left = '-99999px'
      span.style.top = '-99999px'
      span.style.visibility = 'hidden'
      span.style.whiteSpace = 'nowrap'
      span.style.fontSize = '1.05rem'
      span.style.lineHeight = '1.8'
      span.style.fontFamily = 'inherit'
      span.textContent = firstLineText
      document.body.appendChild(span)

      const textPx = Math.ceil(span.getBoundingClientRect().width)
      span.remove()

      // 计算在横屏下可用的最大正文宽度：视口宽度 - 右侧人物图预留(55%) - 左右边距
      const reservedForPortrait = Math.round(window.innerWidth * 0.55)
      const sidePadding = 32 // 粗略预留 container padding + 间隙
      const maxAvailable = Math.max(260, window.innerWidth - reservedForPortrait - sidePadding)

      const nextWidth = Math.min(Math.max(260, textPx), maxAvailable)
      setIpadLandscapeTextWidthPx(nextWidth)
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [isIpadDevice, ipadOrientation, messageParagraphsOriginal])

  const tabs: Array<{ id: 'profile' | 'message'; label: string }> = useMemo(() => [
    { id: 'profile', label: t('company.ceo.tabs.profile') },
    { id: 'message', label: t('company.ceo.tabs.message') },
  ], [t])

  return (
    <PageLayout>
        <section className="relative pt-20 md:pt-28 pb-8 md:pb-20 bg-gradient-to-br from-amber-800 via-amber-700 to-navy-800 overflow-hidden company-ceo-header-section">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt={t('company.ceo.title')}
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/80 to-navy-900/60"></div>
        </div>
        <div className="relative z-10 container-custom text-center md:text-left">
            <p className="text-xs md:text-sm text-amber-300 font-semibold mb-1 md:mb-4">{t('company.ceo.subtitle')}</p>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white">{t('company.ceo.title')}</h1>
            <p className="mt-2 md:mt-4 text-sm md:text-lg text-gray-200 max-w-3xl">
              {t('company.ceo.description')}
            </p>
            <div className="mt-4 md:mt-10 w-full max-w-3xl mx-auto md:mx-0 rounded-2xl overflow-hidden border border-white/40 bg-white grid grid-cols-2 gap-0 company-ceo-tabs-container">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full px-2 md:px-6 py-2 md:py-3 text-sm md:text-lg font-semibold transition-all company-ceo-tab-button ${
                      isActive
                        ? 'bg-white text-navy-800 shadow-lg'
                        : 'text-navy-900/85 hover:bg-white/15 hover:text-navy-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {activeTab === 'profile' ? (
          <section className="relative py-3 md:py-6">
          
          <div className="container-custom company-ceo-profile-container">
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-3 md:p-6 company-ceo-profile-intro">
                <div className="company-ceo-profile-intro-content">
                  <div className="relative w-full max-w-sm mx-auto lg:mx-0 aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-gray-200 company-ceo-profile-image lg:float-left lg:mr-6 lg:mb-4">
                    <Image src={ceoPortrait2} alt={t('company.ceo.profile.name')} fill className="object-cover" sizes="(min-width: 1024px) 28vw, 80vw" />
                  </div>
                  <div className="company-ceo-profile-intro-image">
                    <Image src={ceoPortrait2} alt={t('company.ceo.profile.name')} fill className="object-cover" sizes="(max-width: 767px) 45vw, 28vw" />
              </div>
                  <div className="company-ceo-profile-intro-text">
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-navy-800">{t('company.ceo.profile.name')}</h2>
                    <div className="space-y-2 md:space-y-3">
                      <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed">
                        {t('company.ceo.profile.introduction1')}
                    </p>
                      <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed">
                        {t('company.ceo.profile.introduction2')}
                    </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-3 md:p-6 company-ceo-profile-highlights">
                <div className="space-y-1.5 md:space-y-2">
                  {profileHighlights.map((item, index) => (
                    <div key={item.label} className={index !== profileHighlights.length - 1 ? 'border-b border-gray-200 pb-1.5 md:pb-2' : ''}>
                      <div className="flex flex-row items-start justify-between md:justify-start gap-3">
                        <p className="text-sm font-semibold text-indigo-600 flex-shrink-0 md:w-32 lg:w-40">{item.label}</p>
                        <div className="flex-1 text-right">
                      {Array.isArray(item.value) ? (
                        <div className="space-y-1">
                              {item.value.map((line, lineIndex) => (
                                <p key={lineIndex} className="text-gray-700 leading-relaxed text-sm md:text-base text-right">{line}</p>
                          ))}
                        </div>
                      ) : (
                            <p className="text-gray-700 leading-relaxed text-sm md:text-base text-right break-words">{item.value}</p>
                      )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : (
          <>
            {/* 桌面版 */}
            <section className="desktop-message relative min-h-[90vh] bg-[#f3eadf]" style={{ background: '#f3eadf' }}>
              <div className="container-custom relative z-10 py-16 md:py-20 desktop-message-wrap">
                <div className="desktop-message-text text-slate-900 space-y-6">
                  {/* 桌面版寄语：文字环绕“红色图片区域”的占位块（实际图片用绝对定位渲染） */}
                  <div className="desktop-message-portrait-spacer" aria-hidden="true" />

                  <div>
                    <p className="text-xl tracking-[0.35em] text-slate-700">{t('company.ceo.message.title')}</p>
                    <p className="text-sm uppercase tracking-[0.4em] text-slate-500 mt-2">{t('company.ceo.message.subtitle')}</p>
                  </div>
                  <div className="space-y-5 text-[1.05rem] leading-relaxed">
                    {messageParagraphsOriginal.map((paragraph, index) => (
                      <p key={index} className="text-balance">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  <div className="pt-4">
                    <p className="text-base text-slate-600">{t('company.ceo.message.presidentTitle')}</p>
                    <p className="text-2xl font-semibold text-navy-800 mt-2 tracking-wide">{t('company.ceo.message.presidentName')}</p>
                  </div>
                </div>

                {/* 实际人物图：必须紧贴页尾（section 底部），并放大到 170% */}
                <div className="desktop-message-portrait-abs" aria-hidden="true">
                  <div className="desktop-message-portrait-abs-inner">
                    <Image
                      src={ceoPortrait1}
                      alt="桂小川人物照片"
                      fill
                      className="object-contain object-bottom"
                      priority={false}
                      sizes="42vw"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* iPad横版 */}
            <section className="ipad-landscape-message relative min-h-[90vh] bg-[#f3eadf]" style={{ background: '#f3eadf' }}>
              <div className="absolute inset-0 flex justify-center ipad-message-portrait" style={{ paddingLeft: '8%' }}>
                <div className="ipad-message-portrait-inner relative w-full max-w-[1120px] h-full min-h-[90vh] overflow-visible">
                  <Image
                    src={ceoPortrait1}
                    alt="桂小川人物照片"
                    fill
                    className="object-contain object-bottom"
                    priority={false}
                    sizes="100vw"
                  />
                </div>
              </div>
              <div className="container-custom relative z-10 flex items-start md:items-center justify-start py-16 md:py-20" style={{ paddingLeft: 'calc(1rem + 8%)' }}>
                <div className="max-w-[620px] text-slate-900 space-y-6 ceo-message-text">
                  <div>
                    <p className="text-xl tracking-[0.35em] text-slate-700">{t('company.ceo.message.title')}</p>
                    <p className="text-sm uppercase tracking-[0.4em] text-slate-500 mt-2">{t('company.ceo.message.subtitle')}</p>
                  </div>
                  <div className="space-y-5 text-[1.05rem] leading-relaxed ceo-message-paragraphs">
                    {messageParagraphsOriginal.map((paragraph, index) => (
                      <p key={index} className="text-balance">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  <div className="pt-4 ceo-message-signature">
                    <p className="text-base text-slate-600">{t('company.ceo.message.presidentTitle')}</p>
                    <p className="text-2xl font-semibold text-navy-800 mt-2 tracking-wide">{t('company.ceo.message.presidentName')}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* iPad竖版 */}
            <section className="ipad-portrait-message relative min-h-[90vh] bg-[#f3eadf]" style={{ background: '#f3eadf' }}>
              <div className="absolute inset-0 flex justify-center ipad-message-portrait" style={{ paddingLeft: '8%' }}>
                <div className="ipad-message-portrait-inner relative w-full max-w-[1120px] h-full min-h-[90vh] overflow-visible">
                  <Image
                    src={ceoPortrait1}
                    alt="桂小川人物照片"
                    fill
                    className="object-contain object-bottom"
                    priority={false}
                    sizes="100vw"
                  />
                </div>
              </div>
              <div className="container-custom relative z-10 flex items-start md:items-center justify-start py-16 md:py-20" style={{ paddingLeft: 'calc(1rem + 8%)' }}>
                <div className="max-w-[620px] text-slate-900 space-y-6 ceo-message-text">
                  <div>
                    <p className="text-xl tracking-[0.35em] text-slate-700">{t('company.ceo.message.title')}</p>
                    <p className="text-sm uppercase tracking-[0.4em] text-slate-500 mt-2">{t('company.ceo.message.subtitle')}</p>
                  </div>
                  <div className="space-y-5 text-[1.05rem] leading-relaxed ceo-message-paragraphs">
                    {messageParagraphs.map((paragraph, index) => (
                      <p key={index} className="text-balance" dangerouslySetInnerHTML={{ __html: paragraph }} />
                    ))}
                  </div>
                  <div className="pt-4 ceo-message-signature">
                    <p className="text-base text-slate-600">{t('company.ceo.message.presidentTitle')}</p>
                    <p className="text-2xl font-semibold text-navy-800 mt-2 tracking-wide">{t('company.ceo.message.presidentName')}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 手机横版 - 文字环绕人物图 */}
            <section className="mobile-landscape-message relative bg-[#f3eadf]" style={{ background: '#f3eadf', minHeight: '90vh' }}>
              <div className="container-custom relative z-10 py-6 md:py-20 px-4">
                <div className="mobile-landscape-message-content relative">
                  <div className="mobile-landscape-message-text ceo-message-text">
                    <div>
                      <p className="text-lg md:text-xl tracking-[0.35em] text-slate-700">{t('company.ceo.message.title')}</p>
                      <p className="text-xs md:text-sm uppercase tracking-[0.4em] text-slate-500 mt-1 md:mt-2">{t('company.ceo.message.subtitle')}</p>
                    </div>
                    <div className="space-y-3 md:space-y-5 text-sm md:text-[1.05rem] leading-relaxed ceo-message-paragraphs">
                      {messageParagraphsOriginal.map((paragraph, index) => (
                        <Fragment key={index}>
                          {/* 从第 3 段开始才环绕人物图：让第 1/2 段尽量拉长行宽，填掉人物图上方的空白区域 */}
                          {index === 2 && <div className="mobile-landscape-message-float-spacer" aria-hidden="true" />}
                          <p>{paragraph}</p>
                        </Fragment>
                      ))}
                  </div>
                    <div className="pt-2 md:pt-4 ceo-message-signature">
                      <p className="text-sm md:text-base text-slate-600">{t('company.ceo.message.presidentTitle')}</p>
                      <p className="text-lg md:text-2xl font-semibold text-navy-800 mt-1 md:mt-2 tracking-wide">{t('company.ceo.message.presidentName')}</p>
                    </div>
                  </div>
                  <div className="mobile-landscape-message-image-wrapper" aria-hidden="true">
                    <Image
                      src={ceoPortrait1}
                      alt="桂小川人物照片"
                      width={400}
                      height={600}
                      className="mobile-landscape-message-image"
                      priority={false}
                      sizes="40vw"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* 手机竖版 - 文字环绕人物图 */}
            <section className="mobile-portrait-message relative bg-[#f3eadf]" style={{ background: '#f3eadf', minHeight: '90vh' }}>
              <div className="container-custom relative z-10 py-6 md:py-20 px-4">
                <div className="mobile-portrait-message-content relative">
                  <div className="mobile-portrait-message-text ceo-message-text">
                    <div>
                      <p className="text-lg md:text-xl tracking-[0.35em] text-slate-700">{t('company.ceo.message.title')}</p>
                      <p className="text-xs md:text-sm uppercase tracking-[0.4em] text-slate-500 mt-1 md:mt-2">{t('company.ceo.message.subtitle')}</p>
                    </div>
                    <div className="space-y-3 md:space-y-5 text-sm md:text-[1.05rem] leading-relaxed ceo-message-paragraphs">
                      {/* 前两段：锁定为“第一行宽度”，并强制第一段在“业务为起”后换行 */}
                      <div
                        ref={mobilePortraitIntroRef}
                        className="mobile-portrait-message-intro"
                        style={
                          mobilePortraitIntroWidthPx
                            ? { width: `${mobilePortraitIntroWidthPx}px`, maxWidth: `${mobilePortraitIntroWidthPx}px` }
                            : undefined
                        }
                      >
                        {mobilePortraitMessageParagraphs.slice(0, 2).map((paragraph, index) => (
                          <p key={`intro-${index}`} dangerouslySetInnerHTML={{ __html: paragraph }} />
                        ))}
                      </div>

                      {/* 从第 3 段开始绕图 */}
                      {mobilePortraitMessageParagraphs.slice(2).map((paragraph, index) => (
                        <Fragment key={`rest-${index}`}>
                          {index === 0 && <div className="mobile-portrait-message-float-spacer" aria-hidden="true" />}
                          <p dangerouslySetInnerHTML={{ __html: paragraph }} />
                        </Fragment>
                      ))}
                  </div>
                    <div className="pt-2 md:pt-4 ceo-message-signature">
                      <p className="text-sm md:text-base text-slate-600">{t('company.ceo.message.presidentTitle')}</p>
                      <p className="text-lg md:text-2xl font-semibold text-navy-800 mt-1 md:mt-2 tracking-wide">{t('company.ceo.message.presidentName')}</p>
                    </div>
                  </div>
                  <div className="mobile-portrait-message-image-wrapper" aria-hidden="true">
                    <Image
                      src={ceoPortrait1}
                      alt="桂小川人物照片"
                      width={300}
                      height={450}
                      className="mobile-portrait-message-image"
                      priority={false}
                      sizes="45vw"
                    />
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
    </PageLayout>
  )
}

