'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Building2, Train, TrendingUp, Clock, ArrowLeft, X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useEffect, useState, useRef } from 'react'

export default function LionsHigashiGinza2FPage() {
  const { t } = useLanguage()
  const p = t('maimai.propertyDetail.properties.lions-higashiginza-2f', { returnObjects: true }) as any
  const labels = t('maimai.propertyDetail.labels', { returnObjects: true }) as any
  const categories = t('maimai.propertyDetail.categories', { returnObjects: true }) as any
  const [isMobileLandscape, setIsMobileLandscape] = useState(false)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const mobileVideoRef = useRef<HTMLVideoElement>(null)
  const desktopVideoRef = useRef<HTMLVideoElement>(null)
  const modalVideoRef = useRef<HTMLVideoElement>(null)
  
  // 处理重复的"约"：如果面积中包含"约"，就去掉坪数中的"约"
  const getPingText = () => {
    const pingText = t('maimai.propertyDetail.labels.approxPing', { ping: p.areaPing })
    // 检查面积文本中是否包含"约"（中文简体、繁体、日文）或"Approx."（英文）
    if (p.area && (p.area.includes('约') || p.area.includes('約') || p.area.includes('Approx.'))) {
      // 去掉坪数文本中的"约"相关字符，但保留括号和坪数
      // 例如："（约 38.6 坪）" -> "（38.6 坪）"
      return pingText.replace(/约|約|Approx\.\s*/g, '').replace(/\s{2,}/g, ' ').trim()
    }
    return pingText
  }

  useEffect(() => {
    const checkOrientation = () => {
      const isLandscape = window.matchMedia('(max-width: 767px) and (orientation: landscape)').matches
      setIsMobileLandscape(isLandscape)
    }
    
    checkOrientation()
    window.addEventListener('resize', checkOrientation)
    window.addEventListener('orientationchange', checkOrientation)
    
    return () => {
      window.removeEventListener('resize', checkOrientation)
      window.removeEventListener('orientationchange', checkOrientation)
    }
  }, [])

  // 处理视频自动播放和加载
  useEffect(() => {
    const setupVideo = (video: HTMLVideoElement | null) => {
      if (!video) return
      
      video.muted = true
      video.playsInline = true
      video.setAttribute('playsinline', 'true')
      video.setAttribute('webkit-playsinline', 'true')
      video.setAttribute('x5-playsinline', 'true')
      
      const tryPlay = async () => {
        try {
          await video.play()
        } catch (error) {
          console.log('视频自动播放被阻止，等待用户交互')
        }
      }
      
      // 监听视频加载完成
      const handleCanPlay = () => {
        tryPlay()
      }
      
      // 监听错误
      const handleError = (e: Event) => {
        console.error('视频加载错误:', e)
      }
      
      video.addEventListener('canplay', handleCanPlay)
      video.addEventListener('error', handleError)
      
      // 立即尝试播放
      tryPlay()
      
      return () => {
        video.removeEventListener('canplay', handleCanPlay)
        video.removeEventListener('error', handleError)
      }
    }

    const cleanup1 = mobileVideoRef.current ? setupVideo(mobileVideoRef.current) : undefined
    const cleanup2 = desktopVideoRef.current ? setupVideo(desktopVideoRef.current) : undefined
    
    return () => {
      cleanup1?.()
      cleanup2?.()
    }
  }, [])

  // 打开弹窗时播放视频
  useEffect(() => {
    if (isVideoModalOpen && modalVideoRef.current) {
      modalVideoRef.current.play().catch(console.error)
    }
  }, [isVideoModalOpen])
  
  return (
    <PageLayout>
      <main className="min-h-screen bg-slate-50 text-slate-900">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-amber-100 via-slate-50 to-sky-100 pt-28 pb-16">
          <div className="container-custom">
            <div className="mx-auto max-w-6xl">
              <Link
                href="/maimai"
                className="mb-6 inline-flex items-center gap-2 rounded-lg bg-white/80 px-4 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-white hover:text-slate-900 shadow-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('maimai.propertyDetail.backToPrevious')}
              </Link>
            </div>
            <div className="mx-auto max-w-6xl lg:flex lg:items-center lg:gap-10 lions-higashiginza-hero">
              <div className="flex-1">
                <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-amber-700">
                  {t('maimai.propertyDetail.subtitle')}
                </p>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                  {p.title}
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-slate-700" dangerouslySetInnerHTML={{ __html: p.description }} />

                {/* 视频和四个方块的容器 - iPad竖版使用flex布局 */}
                <div className="lions-higashiginza-video-info-container">
                  {/* 视频 - 手机竖版显示在介绍文案下面，iPad竖版显示在左边 */}
                  <div className="mt-6 lions-higashiginza-video-mobile-portrait">
                    <div 
                      className="relative h-64 w-full overflow-hidden rounded-3xl bg-slate-900/5 shadow-lg cursor-pointer"
                      onClick={() => setIsVideoModalOpen(true)}
                    >
                      <video
                        ref={mobileVideoRef}
                        className="w-full h-full object-cover"
                        loop
                        muted
                        playsInline
                        preload="auto"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      >
                        <source src="/movie/higashiginza.mp4" type="video/mp4" />
                        您的浏览器不支持视频播放。
                      </video>
                    </div>
                  </div>

                  {/* 四个方块 */}
                  <dl className={`mt-6 grid gap-4 text-xs lions-higashiginza-info-grid ${isMobileLandscape ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
                    <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                      <dt className="text-slate-500">{labels.area}</dt>
                      <dd className="mt-1 font-semibold text-slate-900">
                        {p.area}
                        <span className="block text-[11px] text-slate-500">（{getPingText()}）</span>
                      </dd>
                    </div>
                    <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                      <dt className="text-slate-500">{labels.equipment}</dt>
                      <dd className="mt-1 font-semibold text-slate-900">
                        {p.type}
                        <span className="block text-[11px] text-slate-500">{p.typeNote}</span>
                      </dd>
                    </div>
                    <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                      <dt className="text-slate-500">{labels.nearestStation}</dt>
                      <dd className="mt-1 font-semibold text-slate-900">
                        {p.station}
                        <span className="block text-[11px] text-slate-500">
                          {p.stationNote}
                        </span>
                      </dd>
                    </div>
                    <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                      <dt className="text-slate-500">{labels.priceRent}</dt>
                      <dd className="mt-1 font-semibold text-slate-900">
                        {p.price}
                        <span className="block text-[11px] text-amber-600">
                          {p.priceNote}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* 右侧视频 - 桌面版和iPad横版 */}
              <div className="mt-8 flex-1 justify-center lg:flex lions-higashiginza-video-desktop">
                <div 
                  className="relative h-64 w-full max-w-sm overflow-hidden rounded-3xl bg-slate-900/5 shadow-lg cursor-pointer"
                  onClick={() => setIsVideoModalOpen(true)}
                >
                  <video
                    ref={desktopVideoRef}
                    className="w-full h-full object-cover"
                    loop
                    muted
                    playsInline
                    preload="auto"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  >
                    <source src="/movie/higashiginza.mp4" type="video/mp4" />
                    您的浏览器不支持视频播放。
                  </video>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 图片画廊 */}
        <section className="bg-white py-12">
          <div className="container-custom">
            <div className="mx-auto max-w-6xl">
              <h2 className="mb-6 text-xl font-semibold text-slate-900">{t('maimai.propertyDetail.photos')}</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="relative h-64 overflow-hidden rounded-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt={labels.exterior || labels.appearance || p.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-64 overflow-hidden rounded-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt={labels.surroundings || labels.appearance || p.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-64 overflow-hidden rounded-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt={labels.interior || labels.appearance || p.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 物业概要 */}
        <section className="mx-auto mt-6 max-w-6xl px-4 pb-14">
          <div className="grid gap-10 lg:grid-cols-[2fr,1.2fr]">
            {/* 左侧：详情 */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{t('maimai.propertyDetail.overview')}</h2>
              <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm">
                <table className="w-full border-separate border-spacing-0 text-xs">
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <th className="w-32 bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        {labels.address}
                      </th>
                      <td className="px-4 py-3">
                        {p.address}
                        <span className="ml-1 text-[11px] text-slate-500">{p.buildingName}</span>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100 align-top">
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        {labels.access}
                      </th>
                      <td className="px-4 py-3">
                        <ul className="space-y-1">
                          <li>{p.access1}</li>
                          <li>{p.access2}</li>
                          <li>{p.access3}</li>
                          <li>{p.access4}</li>
                          <li>{p.access5}</li>
                          <li>{p.access6}</li>
                        </ul>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        {labels.structure}
                      </th>
                      <td className="px-4 py-3">
                        {p.structure}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        {labels.floor}
                      </th>
                      <td className="px-4 py-3">
                        {p.floorInfo}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        {labels.area}
                      </th>
                      <td className="px-4 py-3">
                        {p.area}（{getPingText()}）
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        {labels.priceRent}
                      </th>
                      <td className="px-4 py-3">
                        {p.expectedRentText}
                        <span className="ml-1 text-[11px] text-amber-700">
                          {p.referenceRentNote}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        {labels.equipment}
                      </th>
                      <td className="px-4 py-3">
                        {p.usageSuggestion}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 投资亮点 */}
              <h2 className="mt-10 text-lg font-semibold text-slate-900">{t('maimai.propertyDetail.investmentPoints')}</h2>
              <div className="mt-4 grid gap-4 text-xs md:grid-cols-2">
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-amber-600" />
                    <h3 className="text-sm font-semibold text-slate-900">{p.point1Title}</h3>
                  </div>
                  <p className="mt-2 leading-relaxed text-slate-700">
                    {p.point1Desc}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <Train className="h-4 w-4 text-blue-600" />
                    <h3 className="text-sm font-semibold text-slate-900">{p.point2Title}</h3>
                  </div>
                  <p className="mt-2 leading-relaxed text-slate-700">
                    {p.point2Desc}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-green-600" />
                    <h3 className="text-sm font-semibold text-slate-900">{p.point3Title}</h3>
                  </div>
                  <p className="mt-2 leading-relaxed text-slate-700">
                    {p.point3Desc}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    <h3 className="text-sm font-semibold text-slate-900">{p.point4Title}</h3>
                  </div>
                  <p className="mt-2 leading-relaxed text-slate-700">
                    {p.point4Desc}
                  </p>
                </div>
              </div>

              {/* 周边设施 */}
              <h2 className="mt-10 text-lg font-semibold text-slate-900">{t('maimai.propertyDetail.surroundings')}</h2>
              <div className="mt-4 grid gap-4 text-xs md:grid-cols-3">
                <div className="rounded-xl bg-gradient-to-br from-blue-50 to-white p-4 shadow-sm">
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">{categories.life}</h3>
                  <ul className="space-y-1 text-slate-700">
                    <li>・{p.life1}</li>
                    <li>・{p.life2}</li>
                    <li>・{p.life3}</li>
                  </ul>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-green-50 to-white p-4 shadow-sm">
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">{categories.education}</h3>
                  <ul className="space-y-1 text-slate-700">
                    <li>・{p.education1}</li>
                    <li>・{p.education2}</li>
                    <li>・{p.education3}</li>
                  </ul>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-amber-50 to-white p-4 shadow-sm">
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">{categories.transport}</h3>
                  <ul className="space-y-1 text-slate-700">
                    <li>・{p.transport1}</li>
                    <li>・{p.transport2}</li>
                    <li>・{p.transport3}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 右侧：注意事项 */}
            <aside className="space-y-6">
              <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 p-5 text-xs text-amber-900">
                <div className="mb-3 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-700" />
                  <h3 className="text-sm font-semibold">{labels.notes}</h3>
                </div>
                <p className="mt-2 leading-relaxed">
                  {p.notesText}
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section className="bg-white py-12">
          <div className="container-custom">
            <div className="mx-auto max-w-6xl flex justify-center">
              <Link
                href="/maimai"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-6 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 hover:text-slate-900 shadow-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('maimai.propertyDetail.backToPrevious')}
              </Link>
            </div>
          </div>
        </section>

        {/* 视频播放器弹窗 */}
        {isVideoModalOpen && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99999] flex items-center justify-center p-4"
            onClick={() => setIsVideoModalOpen(false)}
          >
            <div 
              className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
                aria-label="关闭"
              >
                <X className="w-6 h-6" />
              </button>
              <video
                ref={modalVideoRef}
                className="w-full h-full object-contain"
                controls
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              >
                <source src="/movie/higashiginza.mp4" type="video/mp4" />
                您的浏览器不支持视频播放。
              </video>
            </div>
          </div>
        )}
      </main>
    </PageLayout>
  )
}
