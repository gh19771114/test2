'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import { useEffect, useState, useMemo } from 'react'
import ceoPortrait1 from '@/imgs/ceo3.png'
import ceoPortrait2 from '@/imgs/ceo2.png'
import { useLanguage } from '@/contexts/LanguageContext'

export default function CompanyCeoPage() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<'profile' | 'message'>('profile')
  const [handheldMode, setHandheldMode] = useState<'portrait' | 'landscape' | null>(null)
  const [isCoarsePointer, setIsCoarsePointer] = useState(false)
  const [coarseShortSide, setCoarseShortSide] = useState<number | null>(null)

  // 仅用于“手机端寄语页稳定布局”判断：
  // - 不依赖 viewport 宽度（因为用户可能点过“切换到PC版”，会把 viewport 强制到 1280）
  // - 用 coarse pointer + 高度阈值排除 iPad（iPad 竖屏一般 >=1024px，横屏高度一般 >=768px）
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return

    const compute = () => {
      const isCoarse = window.matchMedia('(pointer: coarse)').matches
      setIsCoarsePointer(isCoarse)
      if (!isCoarse) {
        setHandheldMode(null)
        setCoarseShortSide(null)
        return
      }

      const isPortrait = window.matchMedia('(orientation: portrait)').matches
      const w = window.innerWidth || 0
      const h = window.innerHeight || 0

      // 用“短边”区分手机与平板：
      // - 手机短边通常 <= 600px（包含部分大屏安卓机；即使高度很大也不会误判）
      // - iPad 竖屏短边 768px、横屏短边 768px，都不会命中
      const shortSide = Math.min(w || 0, h || 0)
      setCoarseShortSide(shortSide > 0 ? shortSide : null)

      const isPhone = shortSide > 0 && shortSide <= 600
      if (!isPhone) {
        setHandheldMode(null)
        return
      }

      setHandheldMode(isPortrait ? 'portrait' : 'landscape')
    }

    compute()
    window.addEventListener('resize', compute)
    window.addEventListener('orientationchange', compute)
    return () => {
      window.removeEventListener('resize', compute)
      window.removeEventListener('orientationchange', compute)
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
            <section className={`relative bg-[#f3eadf] company-ceo-message-section${handheldMode === 'portrait' ? ' company-ceo-message-handheld-portrait' : ''}`}>
              {(() => {
                /**
                 * 杂志式排版（文字环绕人物图）
                 * - 桌面/平板：用“右侧 float 占位块”让文字环绕；人物图用 absolute bottom-0 硬贴页尾
                 * - 手机：保持一致（人物图仍在右侧），同样使用 float 占位块 + absolute bottom-0
                 */
                // 说明：
                // - 这里必须用“普通文档流 + float”才能稳定实现“文字环绕人物图”
                // - 不使用 flex/grid（会导致 float 失效，从而出现大空白/遮挡）
                // 手机竖版：降低最小宽度，避免为人物图预留过多空间导致文案列过窄（对齐 iPad 的比例观感）
                const portraitW = 'clamp(160px, 42vw, 380px)'
                const portraitH = 'clamp(320px, 60vh, 620px)'
                const gap = 2

                // 手机端（竖/横）寄语
                if (handheldMode) {
                  const portraitWidth =
                    handheldMode === 'landscape' ? 'min(23vw, 160px)' : 'min(42vw, 240px)'

                  // 手机竖版：第一、二段满宽；第三段前约 3 行单独满宽，再人物图，第三段其余及以后环绕
                  if (handheldMode === 'portrait') {
                    const [p0, p1, p2, ...restParagraphs] = messageParagraphsOriginal
                    const portraitWidthPortrait = 'min(32vw, 160px)'
                    // 第三段按“约 9 行”拆成两段：前 9 行（含第 6、7、8、9 行）满宽与第 1 行一致，后段环绕图
                    const charsPerLine = 32
                    const splitAt = charsPerLine * 9
                    const splitParagraph = (text: string) => {
                      if (!text || text.length <= splitAt) return { head: text, tail: '' }
                      let i = splitAt
                      const breakChars = ' .。，、'
                      while (i < text.length && !breakChars.includes(text[i])) i++
                      if (i >= text.length) i = splitAt
                      else i++
                      return { head: text.slice(0, i).trim(), tail: text.slice(i).trim() }
                    }
                    const p2Split = p2 ? splitParagraph(p2) : { head: '', tail: '' }

                    return (
                      <div className="container-custom pt-2 pb-0 company-ceo-message-container">
                        <div className="mx-auto max-w-5xl relative company-ceo-message-stage company-ceo-message-stage-handheld-portrait">
                          <div
                            className="text-slate-900 company-ceo-message-text company-ceo-message-text-wrap"
                            style={{
                              paddingInline: '1.2em',
                              paddingTop: '1.2em',
                              paddingBottom: '1.2em',
                              textAlign: 'left',
                              textJustify: 'auto',
                            } as React.CSSProperties}
                          >
                            <div className="mb-2">
                              <div className="space-y-1">
                                <p className="text-lg sm:text-xl tracking-[0.28em] text-slate-700 leading-snug">
                                  {t('company.ceo.message.title')}
                                </p>
                                <p className="text-xs sm:text-sm uppercase tracking-[0.32em] text-slate-500 leading-snug">
                                  {t('company.ceo.message.subtitle')}
                                </p>
                              </div>
                            </div>

                            {/* 第一段：满宽，左对齐 */}
                            {p0 ? (
                              <div className="company-ceo-message-full-width space-y-3 text-sm sm:text-[1.05rem] leading-relaxed company-ceo-message-paragraphs mb-3" style={{ textAlign: 'left' }}>
                                <p style={{ textAlign: 'left' }}>{p0}</p>
                              </div>
                            ) : null}

                            {/* 第二段：满宽，左对齐 */}
                            {p1 ? (
                              <div className="company-ceo-message-full-width space-y-3 text-sm sm:text-[1.05rem] leading-relaxed company-ceo-message-paragraphs mb-3" style={{ textAlign: 'left' }}>
                                <p style={{ textAlign: 'left' }}>{p1}</p>
                              </div>
                            ) : null}

                            {/* 第三段前约 9 行：满宽与第 1 行一致，左对齐 */}
                            {p2Split.head ? (
                              <div className="company-ceo-message-full-width space-y-3 text-sm sm:text-[1.05rem] leading-relaxed company-ceo-message-paragraphs mb-3" style={{ textAlign: 'left' }}>
                                <p style={{ textAlign: 'left' }}>{p2Split.head}</p>
                              </div>
                            ) : null}

                            {/* 人物图：float 右侧，第三段其余及以后在左侧和下方环绕 */}
                            <div
                              className="float-right company-ceo-message-portrait company-ceo-message-portrait-float"
                              style={{
                                width: portraitWidthPortrait,
                                aspectRatio: '3 / 4',
                                marginLeft: '0.6em',
                                marginBottom: '0.6em',
                                marginTop: '0.25em',
                              }}
                              aria-hidden="true"
                            >
                              <Image
                                src={ceoPortrait1}
                                alt="桂小川人物照片"
                                fill
                                className="object-contain object-bottom"
                                priority={false}
                                sizes="36vw"
                              />
                            </div>

                            {/* 第三段其余 + 更多段落：在图片左侧和下方环绕，强制左对齐 */}
                            <div
                              className="company-ceo-message-wrap-after-float space-y-3 text-sm sm:text-[1.05rem] leading-relaxed company-ceo-message-paragraphs"
                              style={{ textAlign: 'left', textJustify: 'auto' } as React.CSSProperties}
                            >
                              {p2Split.tail ? <p style={{ textAlign: 'left', textJustify: 'auto' } as React.CSSProperties}>{p2Split.tail}</p> : null}
                              {restParagraphs.map((paragraph, index) => (
                                <p key={index} style={{ textAlign: 'left', textJustify: 'auto' } as React.CSSProperties}>
                                  {paragraph}
                                </p>
                              ))}
                            </div>

                            <div className="clear-both" aria-hidden="true" />
                            <div className="pt-6 sm:pt-7 company-ceo-message-signature">
                              <p className="text-sm sm:text-base text-slate-600">{t('company.ceo.message.presidentTitle')}</p>
                              <p className="text-xl sm:text-2xl font-semibold text-navy-800 mt-2 tracking-wide">
                                {t('company.ceo.message.presidentName')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }

                  // 手机横屏：保持原布局（正文 + 右侧人物图 flex）
                  const p0 = messageParagraphsOriginal[0]
                  const p1 = messageParagraphsOriginal[1]
                  const p2 = messageParagraphsOriginal[2]
                  const rest = messageParagraphsOriginal.slice(3)
                  const narrowTextWidth = '70vw'

                  return (
                    <div className="container-custom pt-2 pb-0 company-ceo-message-container">
                      <div className="mx-auto max-w-5xl company-ceo-message-stage">
                        <div className="text-slate-900 company-ceo-message-text">
                          <div className="mb-2">
                            <div className="space-y-1">
                              <p className="text-lg sm:text-xl tracking-[0.28em] text-slate-700 leading-snug">
                                {t('company.ceo.message.title')}
                              </p>
                              <p className="text-xs sm:text-sm uppercase tracking-[0.32em] text-slate-500 leading-snug">
                                {t('company.ceo.message.subtitle')}
                              </p>
                            </div>
                          </div>

                          {p0 ? (
                            <div className="space-y-3 sm:space-y-4 text-sm sm:text-[1.05rem] leading-relaxed company-ceo-message-paragraphs">
                              <p className="text-balance">{p0}</p>
                            </div>
                          ) : null}

                          <div className="mt-3 flex items-start justify-between gap-3">
                            <div style={{ width: narrowTextWidth }} className="space-y-3 sm:space-y-4 text-sm sm:text-[1.05rem] leading-relaxed">
                              {p1 ? <p className="text-balance">{p1}</p> : null}
                              {p2 ? <p className="text-balance">{p2}</p> : null}
                            </div>
                            <div
                              className="relative company-ceo-message-portrait flex-shrink-0"
                              style={{ width: portraitWidth, aspectRatio: '3 / 4', marginTop: '4.85em' }}
                              aria-hidden="true"
                            >
                              <Image
                                src={ceoPortrait1}
                                alt="桂小川人物照片"
                                fill
                                className="object-contain object-bottom"
                                priority={false}
                                sizes="(min-width: 1024px) 420px, (min-width: 768px) 360px, 52vw"
                              />
                            </div>
                          </div>

                          {rest.length ? (
                            <div className="mt-4 space-y-3 sm:space-y-4 text-sm sm:text-[1.05rem] leading-relaxed company-ceo-message-paragraphs">
                              {rest.map((paragraph, index) => (
                                <p key={`rest-${index}`} className="text-balance">
                                  {paragraph}
                                </p>
                              ))}
                            </div>
                          ) : null}

                          <div className="pt-6 sm:pt-7 company-ceo-message-signature">
                            <p className="text-sm sm:text-base text-slate-600">{t('company.ceo.message.presidentTitle')}</p>
                            <p className="text-xl sm:text-2xl font-semibold text-navy-800 mt-2 tracking-wide">
                              {t('company.ceo.message.presidentName')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }

                return (
                  <div className="container-custom pt-2 pb-0 company-ceo-message-container">
                    <div
                      className="mx-auto max-w-5xl relative company-ceo-message-stage"
                      style={
                        {
                          minHeight: portraitH,
                          ['--ceoPortraitW' as any]: portraitW,
                          ['--ceoPortraitH' as any]: portraitH,
                          ['--ceoPortraitGap' as any]: `${gap}px`,
                        } as any
                      }
                    >
                      {/* 文案区：整体向中间收窄、并为人物图预留右侧空间（全端一致） */}
                      <div
                        className="text-slate-900 relative z-10 company-ceo-message-text"
                        // iPad 等粗指针设备：正文上下留出一行文字高度的空间
                        style={
                          isCoarsePointer && coarseShortSide !== null && coarseShortSide > 600
                            ? ({ paddingTop: '1.6em', paddingBottom: '1.6em' } as any)
                            : undefined
                        }
                      >
                        {/* 右侧浮动占位块：让正文像杂志一样环绕人物图
                            注意：这里不再额外使用 paddingRight，否则会“预留两次”导致大量空白 */}
                        <div
                          className="float-right company-ceo-message-float"
                          style={{
                            width: 'var(--ceoPortraitW)',
                            height: 'var(--ceoPortraitH)',
                            marginLeft: 'var(--ceoPortraitGap)',
                          }}
                          aria-hidden="true"
                        />

                        {/* 桌面版：正文列固定最大宽度，使第一段与下两段每行长度一致 */}
                        <div className="company-ceo-message-text-column" style={{ maxWidth: 'calc(100% - var(--ceoPortraitW) - var(--ceoPortraitGap))' } as any}>
                          {/* 标题区：收紧两行之间与上下间距，避免出现“巨大空白” */}
                          <div className="mb-2">
                            <div className="space-y-1">
                              <p className="text-lg sm:text-xl tracking-[0.28em] text-slate-700 leading-snug">
                                {t('company.ceo.message.title')}
                              </p>
                              <p className="text-xs sm:text-sm uppercase tracking-[0.32em] text-slate-500 leading-snug">
                                {t('company.ceo.message.subtitle')}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3 sm:space-y-4 text-sm sm:text-[1.05rem] leading-relaxed company-ceo-message-paragraphs">
                            {messageParagraphsOriginal.map((paragraph, index) => (
                              <p key={index} className="text-balance">
                                {paragraph}
                              </p>
                            ))}
                          </div>

                          {/* 署名区：尽量向下“顶”到人物图底部附近，减少空白 */}
                          <div className="pt-6 sm:pt-7 company-ceo-message-signature">
                            <p className="text-sm sm:text-base text-slate-600">{t('company.ceo.message.presidentTitle')}</p>
                            <p className="text-xl sm:text-2xl font-semibold text-navy-800 mt-2 tracking-wide">
                              {t('company.ceo.message.presidentName')}
                            </p>
                          </div>
                        </div>

                        {/* 清理浮动，确保容器高度计算正确 */}
                        <div className="clear-both" aria-hidden="true" />
                      </div>

                      {/* 全端：人物图放大并紧贴页尾（footer 顶部） */}
                      <div
                        className="absolute right-0 bottom-0 z-0 pointer-events-none select-none company-ceo-message-portrait"
                        style={{ width: 'var(--ceoPortraitW)', height: 'var(--ceoPortraitH)' } as any}
                        aria-hidden="true"
                      >
                        <Image
                          src={ceoPortrait1}
                          alt="桂小川人物照片"
                          fill
                          className="object-contain object-bottom"
                          priority={false}
                          sizes="(min-width: 1024px) 420px, (min-width: 768px) 360px, 52vw"
                        />
                      </div>
                    </div>
                  </div>
                )
              })()}
            </section>
          </>
        )}
    </PageLayout>
  )
}

