'use client'

import { useEffect, useRef, useState } from 'react'

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleCanPlay = () => {
      setIsLoaded(true)
      setError(null)
      // 尝试播放
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn('Video autoplay prevented:', err)
          setError('视频自动播放被阻止，请点击播放')
        })
      }
    }

    const handleError = (e: Event) => {
      console.error('Video load error:', e)
      setError('视频加载失败，请检查文件是否为 H.264 / WebM 格式')
      setIsLoaded(false)
    }

    const handleLoadedMetadata = () => {
      video.setAttribute('playsinline', 'true')
      video.setAttribute('muted', 'true')
    }

    // 设置视频属性
    video.muted = true
    video.loop = true
    video.playsInline = true
    video.preload = 'metadata'

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)

    // 确保视频循环播放
    const handleEnded = () => {
      video.currentTime = 0
      video.play().catch(() => {})
    }
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('ended', handleEnded)
    }
  }, [])

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      >
        <source src="/movie/top_compat.mp4" type="video/mp4" />
        <source src="/movie/top.webm" type="video/webm" />
        <source src="/movie/top.mp4" type="video/mp4; codecs=hevc" />
        您的浏览器不支持视频播放。
      </video>
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-blue-900 flex items-center justify-center z-10">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-sm">视频加载中...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-blue-900 flex items-center justify-center z-10">
          <div className="text-white text-center p-4">
            <p className="text-sm mb-2">{error}</p>
            <button
              onClick={() => {
                const video = videoRef.current
                if (video) {
                  video.load()
                  video.play().catch(console.error)
                }
              }}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors"
            >
              重试
            </button>
            <button
              onClick={() => {
                const video = videoRef.current
                if (video) {
                  video.controls = true
                }
              }}
              className="mt-3 px-4 py-2 border border-white/40 hover:bg-white/20 rounded-lg text-sm transition-colors"
            >
              手动播放
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoPlayer

