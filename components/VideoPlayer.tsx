'use client'

import { useEffect, useMemo, useRef } from 'react'

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const sources = useMemo(
    () => [
      { src: '/movie/top.mp4', type: 'video/mp4' },
      { src: '/movie/top.webm', type: 'video/webm' },
    ],
    []
  )

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const restart = () => {
      try {
        // 先回到 0，再在下一帧触发播放，减少部分设备的卡顿/停顿
        video.currentTime = 0
        requestAnimationFrame(() => {
          video.play().catch(() => {})
        })
      } catch {
        // ignore
      }
    }

    const handleCanPlay = () => {
      // 尝试播放
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {})
      }
    }

    const handleError = (e: Event) => {
      console.error('Video load error:', e)
    }

    const handleLoadedMetadata = () => {
      video.setAttribute('playsinline', 'true')
      video.setAttribute('webkit-playsinline', 'true')
      video.setAttribute('muted', 'true')
    }

    // 设置视频属性
    video.muted = true
    video.loop = true
    video.playsInline = true
    // 选择“当前设备能播放”的单一源，避免多 source 在部分移动端导致黑屏/循环异常
    const pickBestSource = () => {
      for (const s of sources) {
        const can = video.canPlayType(s.type)
        if (can === 'probably' || can === 'maybe') return s.src
      }
      // fallback：至少给一个
      return sources[0]?.src
    }
    const picked = pickBestSource()
    if (picked && video.getAttribute('src') !== picked) {
      video.src = picked
      // 重新加载资源
      video.load()
    }

    // 为了更接近“无间隙循环”，尽量提前加载完整视频数据
    video.preload = 'auto'

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)

    // iOS/部分安卓浏览器在某些编码下 loop 不稳定：加 ended 兜底，确保一定循环
    const handleEnded = () => restart()
    video.addEventListener('ended', handleEnded)

    // 有些设备不会稳定触发 ended（或 ended 后直接停住）：
    // - timeupdate：快到结尾就提前跳回 0
    // - watchdog：定时检查是否“停在结尾附近”，是则重播
    const handleTimeUpdate = () => {
      const d = video.duration
      if (!Number.isFinite(d) || d <= 0) return
      if (d - video.currentTime <= 0.25) {
        restart()
      }
    }
    video.addEventListener('timeupdate', handleTimeUpdate)

    const watchdog = window.setInterval(() => {
      const d = video.duration
      if (!Number.isFinite(d) || d <= 0) return
      const nearEnd = d - video.currentTime <= 0.35
      if ((video.ended || (video.paused && nearEnd)) && !video.seeking) {
        restart()
      }
    }, 500)

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      window.clearInterval(watchdog)
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
        preload="auto"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      >
        您的浏览器不支持视频播放。
      </video>
    </div>
  )
}

export default VideoPlayer

