'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useMemo, useEffect, useState } from 'react'

export default function CompanySNSPage() {
  const { t } = useLanguage()
  const [latestVideoId, setLatestVideoId] = useState<string>('dQw4w9WgXcQ') // 默认视频ID
  const [isLoadingVideo, setIsLoadingVideo] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [showQRModal, setShowQRModal] = useState<string | null>(null)

  useEffect(() => {
    // 检测是否为移动设备
    const checkMobile = () => {
      setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // 获取最新视频ID
    const fetchLatestVideo = async () => {
      try {
        setIsLoadingVideo(true)
        const response = await fetch('/api/youtube-latest')
        
        if (!response.ok) {
          console.error('API response not OK:', response.status, response.statusText)
          return
        }
        
        const data = await response.json()
        console.log('YouTube API response:', data)
        
        if (data.videoId) {
          setLatestVideoId(data.videoId)
          console.log('Video ID set to:', data.videoId, 'Source:', data.source)
        } else {
          console.warn('No videoId in response:', data)
        }
      } catch (error) {
        console.error('Failed to fetch latest video:', error)
      } finally {
        setIsLoadingVideo(false)
      }
    }

    fetchLatestVideo()
  }, [])

  const renderSocialIcon = (type: string, className: string) => {
    switch (type) {
      case 'youtube':
        return (
          <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        )
      case 'douyin':
        return (
          <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
          </svg>
        )
      case 'xiaohongshu':
        return (
          <svg className={className} viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M 29,0.33332825 C 13.959937,3.4666748 1.5356731,15.204498 0,31 -1.586103,47.314209 0,64.597672 0,81 v 102 c 0,18.76035 -4.7369685,44.19888 7.3333335,60 C 20.372129,260.06897 44.156731,256 63,256 h 111 35 c 5.78276,0 12.33244,0.84741 18,-0.33333 15.0401,-3.13336 27.46432,-14.87115 29,-30.66667 1.58612,-16.31419 0,-33.59769 0,-50 V 73 C 256,54.239685 260.73697,28.801102 248.66667,13 235.62787,-4.0689697 211.84329,0 193,0 H 82 47 C 41.217228,0 34.667561,-0.84741211 29,0.33332825 M 120,91 l -7,19 h 12 l -10,24 9,1 c -0.98794,2.68155 -2.31718,7.73317 -4.33334,9.83334 C 118.18945,146.3721 115.92654,146 114,146 c -4.35942,0 -13.16798,1.80539 -15.5,-3 -1.069664,-2.20416 0.465553,-4.98451 1.333336,-7 1.813624,-4.21228 4.222554,-8.51549 5.166664,-13 -2.17548,0 -4.92464,0.42967 -7,-0.33333 -7.778526,-2.85974 0.874031,-15.36435 2.66666,-19.66667 1.25875,-3.020981 2.75652,-9.584732 5.5,-11.5 C 110.01874,88.810822 115.88325,90.674988 120,91 m -79,63 c 2.750713,0 6.837379,0.81721 8.5,-2 1.769028,-2.99753 0.5,-9.58963 0.5,-13 V 106 C 50,102.90659 48.438198,93.464493 51.166668,91.5 53.41069,89.884308 62.832935,90.226166 63.833332,93 65.47065,97.539825 64,105.16241 64,110 v 32 c 0,5.48389 0.949112,11.8645 -1.333332,17 -2.177158,4.89861 -12.303417,9.27243 -17.333336,5.5 C 43.120155,162.84012 41.545292,156.59013 41,154 M 193,91 v 5 c 3.72887,0 8.4108,-0.763367 12,0.333328 11.97635,3.659424 11,15.422502 11,25.666672 1.99706,0 4.04419,-0.15562 6,0.33333 11.49335,2.87334 10,14.36401 10,23.66667 0,4.95615 0.93086,10.82184 -2.33333,15 -3.59567,4.60246 -9.48195,4 -14.66667,4 -1.6116,0 -4.26318,0.51051 -5.66667,-0.5 -2.62326,-1.88875 -3.78159,-7.50485 -4.33333,-10.5 3.28711,0 9.2179,1.12517 11.83333,-1.33334 C 219.9164,149.76859 218.65411,138.43454 215,136.5 c -1.93661,-1.02527 -4.88672,-0.5 -7,-0.5 h -15 v 29 h -14 v -29 h -14 v -14 h 14 v -12 h -9 V 96 h 9 v -5 h 14 m -32,5 v 14 h -8 v 42 h 13 v 13 H 120 L 125.33334,152.5 138,152 v -42 h -8 V 96 h 31 m 57,14 c 0,-2.84204 -0.51608,-6.25871 0.33333,-9 3.34434,-10.793121 19.61577,-2.093994 11.5,6.83333 -0.92279,1.01507 -2.54419,1.51106 -3.83333,1.83334 C 223.43948,110.30679 220.61993,110 218,110 M 41,110 36.833332,147 30,159 24,143 27,110 h 14 m 46,0 3,33 -6,15 h -2 c -5.366936,-8.49765 -6.053299,-17.26251 -7,-27 -0.672195,-6.91406 -2,-14.04004 -2,-21 h 14 m 106,0 v 12 h 9 v -12 h -9 m -75,42 -5,13 H 91 L 96.333336,151.5 104,151.66666 Z" fill="white" />
          </svg>
        )
      case 'facebook':
        return (
          <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        )
      case 'wechat':
        return (
          <svg className={className} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect width="512" height="512" rx="77" fill="white"/>
            <path d="m402 369c23-17 38-42 38-70 0-51-50-92-111-92s-110 41-110 92 49 92 110 92c13 0 25-2 36-5 4-1 8 0 9 1l25 14c3 2 6 0 5-4l-6-22c0-3 2-5 4-6m-110-85a15 15 0 1 1 0-29 15 15 0 0 1 0 29m74 0a15 15 0 1 1 0-29 15 15 0 0 1 0 29" fill="#00c70a"/>
            <path d="m205 105c-73 0-132 50-132 111 0 33 17 63 45 83 3 2 5 5 4 10l-7 24c-1 5 3 7 6 6l30-17c3-2 7-3 11-2 26 8 48 6 51 6-24-84 59-132 123-128-10-52-65-93-131-93m-44 93a18 18 0 1 1 0-35 18 18 0 0 1 0 35m89 0a18 18 0 1 1 0-35 18 18 0 0 1 0 35" fill="#00c70a"/>
          </svg>
        )
      case 'line':
        return (
          <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.086.766.062 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
          </svg>
        )
      default:
        return <span className="text-base text-white">SNS</span>
    }
  }

  const snsPlatforms = useMemo(() => [
    {
      name: 'YouTube',
      type: 'youtube',
      color: 'bg-[#FF0000]',
      href: 'https://www.youtube.com/@bournmark',
      description: t('company.sns.platforms.youtube'),
      qrImage: null,
    },
    {
      name: t('company.sns.platforms.douyin.name'),
      type: 'douyin',
      color: 'bg-gradient-to-br from-gray-900 via-black to-[#050505]',
      href: 'https://v.douyin.com/qgZX22LW6SM/',
      description: t('company.sns.platforms.douyin.description'),
      qrImage: null,
    },
    {
      name: t('company.sns.platforms.xiaohongshu.name'),
      type: 'xiaohongshu',
      color: 'bg-[#FF2442]',
      href: 'https://xhslink.com/m/28skxkhb9X0',
      description: t('company.sns.platforms.xiaohongshu.description'),
      qrImage: null,
    },
    {
      name: t('company.sns.platforms.wechat.name'),
      type: 'wechat',
      color: 'bg-[#07C160]',
      href: '#', // 改为 #，点击时显示二维码弹窗
      description: t('company.sns.platforms.wechat.description'),
      qrImage: '/imgs/gongzhonghaoQR.JPG',
    },
    {
      name: 'Line',
      type: 'line',
      color: 'bg-[#00B900]',
      href: 'https://line.me/ti/p/ErxgTcaKMx',
      description: t('company.sns.platforms.line'),
      qrImage: null,
    },
    {
      name: 'Facebook',
      type: 'facebook',
      color: 'bg-[#1877F2]',
      href: 'https://www.facebook.com/bournmarkjapan/',
      description: t('company.sns.platforms.facebook'),
      qrImage: null,
    },
  ], [t, isMobile])
  return (
    <PageLayout>
      <section className="relative pt-28 pb-16 bg-gradient-to-br from-pink-800 via-pink-700 to-navy-800 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt={t('company.sns.title')}
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-pink-900/80 to-navy-900/60"></div>
        </div>
        <div className="relative z-10 container-custom">
          <p className="text-sm text-pink-300 font-semibold mb-4">{t('company.sns.subtitle')}</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">{t('company.sns.title')}</h1>
          <p className="text-lg text-gray-200 max-w-3xl leading-relaxed">
            {t('company.sns.description')}
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          {/* 视频播放区域 */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">{t('company.sns.latestVideo')}</h2>
            <div className="max-w-4xl mx-auto">
              <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
                {isLoadingVideo ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                      <p className="text-sm">{t('company.sns.loadingVideo')}</p>
                    </div>
                  </div>
                ) : (
                  <iframe
                    src={`https://www.youtube.com/embed/${latestVideoId}`}
                    title={t('company.sns.videoTitle')}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  ></iframe>
                )}
              </div>
              <p className="text-center text-gray-200 mt-4 text-sm">
                {t('company.sns.videoDescription')}
              </p>
            </div>
          </div>

          {/* 社交媒体平台 */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">{t('company.sns.followUs')}</h2>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {snsPlatforms.map((platform) => {
              const handleClick = (e: React.MouseEvent) => {
                // 如果有QR码且链接为 #，显示QR码弹窗（包括微信，所有设备都显示）
                if (platform.qrImage && platform.href === '#') {
                  e.preventDefault()
                  setShowQRModal(platform.name)
                } else if (platform.href === '#') {
                  e.preventDefault()
                }
              }
              
              return (
                <a
                  key={platform.name}
                  href={platform.href}
                  target={platform.href !== '#' ? "_blank" : undefined}
                  rel={platform.href !== '#' ? "noopener noreferrer" : undefined}
                  onClick={handleClick}
                  className="group bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer flex-shrink-0 w-[140px] md:w-[160px] lg:w-[180px]"
                >
                  <div className="flex flex-col items-center text-center w-full">
                    <div className={`w-16 h-16 md:w-20 md:h-20 ${platform.color} rounded-full flex items-center justify-center mb-4 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {renderSocialIcon(platform.type, "w-8 h-8 md:w-10 md:h-10 text-white flex-shrink-0")}
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-navy-900 mb-1 md:mb-2 line-clamp-2">{platform.name}</h3>
                    <div className="flex items-center gap-1 md:gap-2 text-blue-600 font-medium group-hover:text-blue-700 text-xs md:text-sm">
                      <span>{t('company.sns.visitPlatform')}</span>
                      <ExternalLink size={12} className="md:w-4 md:h-4" />
                    </div>
                  </div>
                </a>
              )
            })}
            </div>
          </div>

          {/* QR码弹窗 */}
          {showQRModal && (
            <div 
              className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
              onClick={() => setShowQRModal(null)}
            >
              <div 
                className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-navy-900">
                    {snsPlatforms.find(p => p.name === showQRModal)?.name}
                  </h3>
                  <button
                    onClick={() => setShowQRModal(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>
                <div className="flex justify-center">
                  {snsPlatforms.find(p => p.name === showQRModal)?.qrImage && (
                    <Image
                      src={snsPlatforms.find(p => p.name === showQRModal)!.qrImage!}
                      alt={`${showQRModal} QR Code`}
                      width={300}
                      height={300}
                      className="rounded-lg"
                    />
                  )}
                </div>
                <p className="text-center text-gray-600 mt-4 text-sm">
                  {t('company.sns.scanQRCode')}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  )
}

