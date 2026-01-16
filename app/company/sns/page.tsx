'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import { Youtube, Video, ExternalLink } from 'lucide-react'
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

  const snsPlatforms = useMemo(() => [
    {
      name: 'YouTube',
      icon: Youtube,
      color: 'bg-[#FF0000]',
      href: 'https://www.youtube.com/@bournmark',
      description: t('company.sns.platforms.youtube'),
      qrImage: null,
    },
    {
      name: t('company.sns.platforms.douyin.name'),
      icon: Video,
      color: 'bg-gradient-to-br from-gray-900 via-black to-[#050505]',
      href: 'https://v.douyin.com/qgZX22LW6SM/',
      description: t('company.sns.platforms.douyin.description'),
      qrImage: null,
    },
    {
      name: t('company.sns.platforms.xiaohongshu.name'),
      icon: Video,
      color: 'bg-[#FF2442]',
      href: 'https://xhslink.com/m/28skxkhb9X0',
      description: t('company.sns.platforms.xiaohongshu.description'),
      qrImage: null,
    },
    {
      name: t('company.sns.platforms.wechat.name'),
      icon: Video,
      color: 'bg-[#07C160]',
      href: '#', // 改为 #，点击时显示二维码弹窗
      description: t('company.sns.platforms.wechat.description'),
      qrImage: '/imgs/gongzhonghaoQR.JPG',
    },
    {
      name: 'Line',
      icon: Video,
      color: 'bg-[#00B900]',
      href: 'https://line.me/ti/p/ErxgTcaKMx',
      description: t('company.sns.platforms.line'),
      qrImage: null,
    },
    {
      name: 'Facebook',
      icon: Video,
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
              const Icon = platform.icon
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
                      <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
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

