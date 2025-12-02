'use client'

import { motion } from 'framer-motion'
import { useMemo, useState, useEffect, useRef } from 'react'
import { encyclopediaEntries, latestNews } from '@/lib/knowledge'
import Image from 'next/image'
import Link from 'next/link'

const Insights = () => {
  const [isIPad, setIsIPad] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const newsScrollRef = useRef<HTMLDivElement>(null)
  const encyclopediaScrollRef = useRef<HTMLDivElement>(null)
  
  // 统一的滚动速度：30px/秒
  const SCROLL_SPEED_PX_PER_SEC = 30

  // 按时间排序，显示最新20条资讯（取消半年期限限制）
  const filteredAndSortedNews = useMemo(() => {
    // 按日期排序（最新的在前）
    const sorted = [...latestNews].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    
    // 返回最新的20条资讯
    return sorted.slice(0, 20)
  }, [])

  const newsList = useMemo(() => filteredAndSortedNews, [filteredAndSortedNews])
  const encyclopedia = useMemo(() => encyclopediaEntries, [])

  // 检测是否为iPad或移动设备，并设置统一的滚动速度
  useEffect(() => {
    setIsMounted(true)
    
    const checkDevice = () => {
      if (typeof window === 'undefined') return
      const width = window.innerWidth
      const height = window.innerHeight
      // iPad检测
      const isIPadDevice = (width >= 768 && width <= 1366 && height >= 768 && height <= 1366) &&
                           !(width >= 1920 && height >= 1080)
      // 移动设备检测（包括手机和iPad）
      const isMobileDevice = width < 1024 || isIPadDevice
      setIsIPad(isMobileDevice)
    }
    
    // 设置统一滚动速度的函数
    const updateScrollSpeed = () => {
      if (typeof window === 'undefined') return
      const width = window.innerWidth
      const height = window.innerHeight
      const isIPadDevice = (width >= 768 && width <= 1366 && height >= 768 && height <= 1366) &&
                           !(width >= 1920 && height >= 1080)
      const isMobileDevice = width < 1024 || isIPadDevice
      
      if (!isMobileDevice && newsScrollRef.current && encyclopediaScrollRef.current) {
        // 获取第一个子元素的高度
        const newsFirstItem = newsScrollRef.current.querySelector('a')
        const encyclopediaFirstItem = encyclopediaScrollRef.current.querySelector('a')
        
        if (newsFirstItem && encyclopediaFirstItem) {
          const newsItemHeight = newsFirstItem.offsetHeight
          const encyclopediaItemHeight = encyclopediaFirstItem.offsetHeight
          
          // 计算总高度（项目数 × 项目高度）
          const newsTotalHeight = newsList.length * newsItemHeight
          const encyclopediaTotalHeight = encyclopedia.length * encyclopediaItemHeight
          
          // 根据内容高度和固定速度（30px/s）计算动画时长
          const newsDuration = newsTotalHeight / SCROLL_SPEED_PX_PER_SEC
          const encyclopediaDuration = encyclopediaTotalHeight / SCROLL_SPEED_PX_PER_SEC
          
          // 设置CSS变量
          newsScrollRef.current.style.setProperty('--scroll-duration', `${newsDuration}s`)
          encyclopediaScrollRef.current.style.setProperty('--scroll-duration', `${encyclopediaDuration}s`)
        }
      }
    }
    
    checkDevice()
    
    // 延迟执行以确保DOM已渲染
    const timeoutId = setTimeout(updateScrollSpeed, 300)
    
    window.addEventListener('resize', checkDevice)
    window.addEventListener('resize', updateScrollSpeed)
    window.addEventListener('orientationchange', checkDevice)
    window.addEventListener('orientationchange', updateScrollSpeed)
    
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', checkDevice)
      window.removeEventListener('resize', updateScrollSpeed)
      window.removeEventListener('orientationchange', checkDevice)
      window.removeEventListener('orientationchange', updateScrollSpeed)
    }
  }, [newsList, encyclopedia, SCROLL_SPEED_PX_PER_SEC])

  const blockVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section className="relative section-padding">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            variants={blockVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="rounded-3xl bg-gradient-to-br from-white/80 via-white/80 to-gray-100/80 backdrop-blur-sm shadow-xl border border-gray-100 p-8 flex flex-col"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2 md:gap-0">
              <h3 className="text-2xl font-bold text-navy-700 whitespace-nowrap">最新资讯</h3>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">实时关注日本房产动态</span>
                <Link 
                  href="/news" 
                  className="text-sm text-navy-600 hover:text-navy-700 font-medium underline"
                >
                  查看全部
                </Link>
              </div>
            </div>
            <div 
              className={`relative rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 ${
                isMounted && isIPad ? 'overflow-y-auto' : 'overflow-hidden'
              }`} 
              style={{ maxHeight: '400px' }}
            >
              {newsList.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  <p>暂无最新资讯</p>
                </div>
              ) : isMounted && isIPad ? (
                // 移动设备（包括手机和iPad）: 使用手动滚动
                <div>
                  {newsList.map((item, index) => (
                    <Link
                      key={`${item.title}-${index}`}
                      href={`/news/${item.slug}`}
                      className="flex items-start gap-3 px-6 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <span className="mt-1 h-2 w-2 rounded-full bg-navy-500 flex-shrink-0"></span>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium hover:text-navy-700 transition-colors">{item.title}</p>
                        <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                // 桌面端: 使用自动滚动动画
                <div 
                  ref={newsScrollRef}
                  className="animate-vertical-scroll hover:[animation-play-state:paused]"
                  style={{ '--scroll-duration': '20s' } as React.CSSProperties}
                >
                  {[...newsList, ...newsList].map((item, index) => (
                    <Link
                      key={`${item.title}-${index}`}
                      href={`/news/${item.slug}`}
                      className="flex items-start gap-3 px-6 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <span className="mt-1 h-2 w-2 rounded-full bg-navy-500 flex-shrink-0"></span>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium hover:text-navy-700 transition-colors">{item.title}</p>
                        <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            variants={blockVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="rounded-3xl bg-gradient-to-br from-white/80 via-white/80 to-gray-100/80 backdrop-blur-sm shadow-xl border border-gray-100 p-8 flex flex-col"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2 md:gap-0">
              <h3 className="text-2xl font-bold text-navy-700 whitespace-nowrap">日本房产投资百科</h3>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">系统解读投资要点</span>
                <Link 
                  href="/encyclopedia" 
                  className="text-sm text-navy-600 hover:text-navy-700 font-medium underline"
                >
                  查看全部
                </Link>
              </div>
            </div>
            <div 
              className={`relative rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 ${
                isMounted && isIPad ? 'overflow-y-auto' : 'overflow-hidden'
              }`} 
              style={{ maxHeight: '400px' }}
            >
              {isMounted && isIPad ? (
                // 移动设备（包括手机和iPad）: 使用手动滚动
                <div>
                  {encyclopedia.map((item, index) => (
                    <Link
                      key={`${item.title}-${index}`}
                      href={`/encyclopedia/${item.slug}`}
                      className="block px-6 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <p className="text-gray-800 font-medium mb-1 hover:text-navy-700 transition-colors">{item.title}</p>
                      <span className="inline-flex items-center px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                        {item.tag}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                // 桌面端: 使用自动滚动动画
                <div 
                  ref={encyclopediaScrollRef}
                  className="animate-vertical-scroll hover:[animation-play-state:paused]"
                  style={{ '--scroll-duration': '20s' } as React.CSSProperties}
                >
                  {[...encyclopedia, ...encyclopedia].map((item, index) => (
                    <Link
                      key={`${item.title}-${index}`}
                      href={`/encyclopedia/${item.slug}`}
                      className="block px-6 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <p className="text-gray-800 font-medium mb-1 hover:text-navy-700 transition-colors">{item.title}</p>
                      <span className="inline-flex items-center px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                        {item.tag}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Insights

