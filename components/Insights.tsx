'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import { encyclopediaEntries, latestNews } from '@/lib/knowledge'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

const Insights = () => {
  const { t } = useLanguage()
  const [isMounted, setIsMounted] = useState(false)
  const pinnedBarRef = useRef<HTMLDivElement>(null)
  const [pinnedBarHeight, setPinnedBarHeight] = useState(0)
  const newsScrollContainerRef = useRef<HTMLDivElement>(null)
  const encyclopediaScrollContainerRef = useRef<HTMLDivElement>(null)
  const newsAutoScrollAnimationRef = useRef<number | null>(null)
  const encyclopediaAutoScrollAnimationRef = useRef<number | null>(null)
  const newsIsUserScrollingRef = useRef(false)
  const encyclopediaIsUserScrollingRef = useRef(false)
  const newsScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const encyclopediaScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const newsLastScrollTimeRef = useRef<number>(0)
  const encyclopediaLastScrollTimeRef = useRef<number>(0)
  
  // 统一的滚动速度：30px/秒
  const SCROLL_SPEED_PX_PER_SEC = 30

  // 分离置顶和非置顶资讯（含置顶通知，按 pinnedOrder 优先再按日期排序）
  const pinnedNewsList = useMemo(() => {
    const pinnedNews = latestNews.filter((news) => news.isPinned)
    return [...pinnedNews].sort((a, b) => {
      const orderA = a.pinnedOrder ?? 999
      const orderB = b.pinnedOrder ?? 999
      if (orderA !== orderB) return orderA - orderB
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  }, [])

  // 获取分类标识
  const getCategoryLabel = (news: any) => {
    if (news.category) {
      // 如果category是"公司活动"，需要翻译
      if (news.category === '公司活动') {
        return t('news.category.companyActivity')
      }
      if (news.category === '通知') {
        return t('news.category.notice')
      }
      return news.category
    }
    if (news.isNotice) {
      return t('news.category.notice')
    }
    return t('news.category.news')
  }

  // 按时间排序，显示最新20条普通资讯（不包含置顶），只保留3个月以内的新闻
  const filteredAndSortedNews = useMemo(() => {
    const normalNews = latestNews.filter(news => !news.isPinned)
    
    // 计算3个月前的日期
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
    
    // 过滤掉3个月以前的新闻（但保留通知和公司活动）
    const recentNews = normalNews.filter(news => {
      const newsDate = new Date(news.date)
      // 如果是通知或公司活动，不进行时间过滤
      if (news.isNotice || news.category === '通知' || news.category === '公司活动') {
        return true
      }
      // 其他新闻只保留3个月以内的
      return newsDate >= threeMonthsAgo
    })
    
    // 按日期排序（最新的在前）
    const sortedNormal = [...recentNews].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    // 返回最新的20条普通资讯
    return sortedNormal.slice(0, 20)
  }, [])

  const newsList = useMemo(() => filteredAndSortedNews, [filteredAndSortedNews])
  const newsLoopList = useMemo(() => [...newsList, ...newsList], [newsList])
  const encyclopedia = useMemo(() => encyclopediaEntries, [])
  const encyclopediaLoopList = useMemo(() => [...encyclopedia, ...encyclopedia], [encyclopedia])

  const getNewsTitle = (slug: string) => {
    const translated = t(`news.items.${slug}.title`)
    if (!translated || translated === `news.items.${slug}.title`) return slug
    return translated
  }

  const getEncyclopediaTitle = (slug: string, fallback?: string) => {
    const translated = t(`encyclopedia.items.${slug}.title`)
    if (!translated || translated === `encyclopedia.items.${slug}.title`) return fallback || slug
    return translated
  }

  const getEncyclopediaTag = (slug: string, fallback?: string) => {
    const translated = t(`encyclopedia.items.${slug}.tag`)
    if (!translated || translated === `encyclopedia.items.${slug}.tag`) return fallback || ''
    return translated
  }

  // 检测置顶栏高度，用于精确对齐滚动框
  useEffect(() => {
    if (pinnedBarRef.current && pinnedNewsList.length > 0) {
      // offsetHeight 包含元素高度，但不包括 margin
      // 需要加上 mb-3 (12px) 的 margin-bottom
      const height = pinnedBarRef.current.offsetHeight + 12 // mb-3 = 12px
      setPinnedBarHeight(height)
    } else {
      setPinnedBarHeight(0)
    }
  }, [pinnedNewsList.length])

  // 启动自动滚动（使用 requestAnimationFrame 实现平滑滚动）
  const startAutoScroll = (
    containerRef: React.RefObject<HTMLDivElement>, 
    isUserScrollingRef: React.MutableRefObject<boolean>, 
    animationRef: React.MutableRefObject<number | null>,
    lastScrollTimeRef: React.MutableRefObject<number>
  ) => {
    // 清除之前的动画
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current)
    }
    
    // 检查容器是否存在
    if (!containerRef.current) return
    
    lastScrollTimeRef.current = performance.now()
    
    const animate = (currentTime: number) => {
      // 每一帧都重新获取容器引用，确保引用是最新的
      const container = containerRef.current
      
      // 检查容器是否存在
      if (!container) {
        animationRef.current = null
        return
      }

      // 若内容不足以滚动，则不做自动滚动（也不做任何“重置”动作）
      if (container.scrollHeight <= container.clientHeight + 1) {
        lastScrollTimeRef.current = currentTime
        animationRef.current = requestAnimationFrame(animate)
        return
      }
      
      // 如果用户正在滚动，不更新位置，但继续动画循环
      if (!isUserScrollingRef.current) {
        const deltaTime = currentTime - lastScrollTimeRef.current
        lastScrollTimeRef.current = currentTime
        
        // 计算基于时间的滚动距离（像素/秒转换为像素/毫秒）
        const scrollDistance = (SCROLL_SPEED_PX_PER_SEC * deltaTime) / 1000

        // 无缝循环：渲染两份列表，滚到“第一份末尾”时回绕到对应位置（不会跳到第一条）
        const half = container.scrollHeight / 2
        if (half > 0 && container.scrollTop >= half) {
          container.scrollTop -= half
        } else {
          container.scrollTop += scrollDistance
        }
      } else {
        // 用户正在滚动，更新时间戳但不更新位置
        lastScrollTimeRef.current = currentTime
      }
      
      // 始终继续下一帧动画，保持流畅
      animationRef.current = requestAnimationFrame(animate)
    }
    
    // 启动动画循环
    animationRef.current = requestAnimationFrame(animate)
  }

  // 停止自动滚动
  const stopAutoScroll = (animationRef: React.MutableRefObject<number | null>) => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
  }

  // 组件挂载后启动自动滚动
  useEffect(() => {
    setIsMounted(true)
    
    // 延迟启动，确保DOM已渲染
    const timeoutId = setTimeout(() => {
      if (newsScrollContainerRef.current) {
        startAutoScroll(newsScrollContainerRef, newsIsUserScrollingRef, newsAutoScrollAnimationRef, newsLastScrollTimeRef)
      }
      if (encyclopediaScrollContainerRef.current) {
        startAutoScroll(encyclopediaScrollContainerRef, encyclopediaIsUserScrollingRef, encyclopediaAutoScrollAnimationRef, encyclopediaLastScrollTimeRef)
      }
    }, 300)
    
    return () => {
      clearTimeout(timeoutId)
      stopAutoScroll(newsAutoScrollAnimationRef)
      stopAutoScroll(encyclopediaAutoScrollAnimationRef)
    }
  }, [newsList.length, encyclopedia.length])

  // 处理鼠标滚轮事件
  const handleWheel = (
    e: React.WheelEvent<HTMLDivElement>, 
    containerRef: React.RefObject<HTMLDivElement>, 
    isUserScrollingRef: React.MutableRefObject<boolean>,
    timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>
  ) => {
    const container = containerRef.current
    if (!container) return

    // 内容不足以滚动时，不拦截页面滚动（避免用户在某些屏幕高度处“卡住/跳动”）
    if (container.scrollHeight <= container.clientHeight + 1) return

    // 始终阻止事件冒泡，防止页面滚动（只要在滚动栏区域内）
    e.preventDefault()
    e.stopPropagation()

    // 标记用户正在滚动，暂停自动滚动
    isUserScrollingRef.current = true
    
    // 清除之前的定时器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    // 手动滚动
    const delta = e.deltaY
    const half = container.scrollHeight / 2
    let newScroll = container.scrollTop + delta
    if (half > 0) {
      // 上下回绕，保持无缝循环
      if (newScroll >= half) newScroll -= half
      if (newScroll < 0) newScroll += half
    }
    container.scrollTop = newScroll
    
    // 设置新的定时器，在停止滚动后恢复自动滚动
    timeoutRef.current = setTimeout(() => {
      isUserScrollingRef.current = false
    }, 1500) // 1.5秒后恢复自动滚动
  }

  // 处理鼠标离开事件，恢复自动滚动
  const handleMouseLeave = (
    isUserScrollingRef: React.MutableRefObject<boolean>,
    lastScrollTimeRef: React.MutableRefObject<number>
  ) => {
    // 恢复自动滚动
    isUserScrollingRef.current = false
    // 重置时间戳，避免突然跳跃
    lastScrollTimeRef.current = performance.now()
  }

  return (
    <section className="relative section-padding">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-3xl bg-gradient-to-br from-white/80 via-white/80 to-gray-100/80 backdrop-blur-sm shadow-xl border border-gray-100 p-8 flex flex-col insights-card">
            <div className="flex flex-col mb-6 gap-2 insights-header pt-4 md:pt-0">
              <h3 className="text-2xl font-bold text-navy-700 whitespace-nowrap">{t('home.insights.title')}</h3>
              <div className="flex items-center gap-4 md:justify-between">
                <span className="text-sm text-gray-500">{t('home.insights.subtitle')}</span>
                <Link 
                  href="/news" 
                  className="text-sm text-navy-600 hover:text-navy-700 font-medium underline"
                >
                  {t('home.insights.viewAll')}
                </Link>
              </div>
            </div>
            {/* 置顶栏 - 固定位置 */}
            {pinnedNewsList.length > 0 && (
              <div ref={pinnedBarRef} className="mb-3 rounded-xl border-2 border-red-200 bg-red-50/80 backdrop-blur-sm">
                {pinnedNewsList.map((item, index) => (
                  <Link
                    key={`pinned-${item.slug}-${index}`}
                    href={`/news/${item.slug}`}
                    className={`flex items-start gap-3 px-4 py-3 hover:bg-red-100/50 transition-colors cursor-pointer insights-pinned-item ${index < pinnedNewsList.length - 1 ? 'border-b-2 border-red-300' : ''}`}
                  >
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium hover:text-navy-700 transition-colors">
                        <span className={`font-semibold mr-2 ${
                          item.category === '公司活动' ? 'text-green-600' :
                          item.isNotice || item.category === '通知' ? 'text-red-600' :
                          'text-blue-600'
                        }`}>
                          {getCategoryLabel(item)}
                        </span>
                        <span suppressHydrationWarning>{isMounted ? getNewsTitle(item.slug) : ''}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <div 
              ref={newsScrollContainerRef}
              className="relative rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 overflow-y-auto"
              style={{ 
                height: '400px',
                maxHeight: '400px',
                minHeight: '400px',
                willChange: 'scroll-position',
                WebkitOverflowScrolling: 'touch',
                overflowAnchor: 'none',
              } as React.CSSProperties}
              onWheel={(e) => handleWheel(e, newsScrollContainerRef, newsIsUserScrollingRef, newsScrollTimeoutRef)}
              onMouseLeave={() => handleMouseLeave(newsIsUserScrollingRef, newsLastScrollTimeRef)}
            >
              {newsList.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  <p>{t('home.insights.noNews')}</p>
                </div>
              ) : (
                <div style={{ paddingTop: '8px', paddingBottom: '8px' }}>
                  {newsLoopList.map((item, index) => (
                    <Link
                      key={`${item.slug}-${index}`}
                      href={`/news/${item.slug}`}
                      className="flex items-start gap-3 px-6 py-4 border-b-2 border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer insights-news-item"
                    >
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium hover:text-navy-700 transition-colors">
                          <span className={`font-semibold mr-2 ${
                            item.category === '公司活动' ? 'text-green-600' :
                            item.isNotice || item.category === '通知' ? 'text-red-600' :
                            'text-blue-600'
                          }`}>
                            {getCategoryLabel(item)}
                          </span>
                          <span suppressHydrationWarning>{isMounted ? getNewsTitle(item.slug) : ''}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-white/80 via-white/80 to-gray-100/80 backdrop-blur-sm shadow-xl border border-gray-100 p-8 flex flex-col insights-card">
            <div className="flex flex-col mb-6 gap-2 insights-header pt-4 md:pt-0">
              <h3 className="text-2xl font-bold text-navy-700 whitespace-nowrap">{t('home.insights.encyclopediaTitle')}</h3>
              <div className="flex items-center gap-4 md:justify-between">
                <span className="text-sm text-gray-500">{t('home.insights.encyclopediaSubtitle')}</span>
                <Link 
                  href="/encyclopedia" 
                  className="text-sm text-navy-600 hover:text-navy-700 font-medium underline"
                >
                  {t('home.insights.encyclopediaViewAll')}
                </Link>
              </div>
            </div>
            <div 
              ref={encyclopediaScrollContainerRef}
              className="relative rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 overflow-y-auto"
              style={{ 
                height: pinnedBarHeight > 0 ? `${400 + pinnedBarHeight}px` : '400px',
                maxHeight: pinnedBarHeight > 0 ? `${400 + pinnedBarHeight}px` : '400px',
                minHeight: pinnedBarHeight > 0 ? `${400 + pinnedBarHeight}px` : '400px',
                willChange: 'scroll-position',
                overflowAnchor: 'none',
              }}
              onWheel={(e) => handleWheel(e, encyclopediaScrollContainerRef, encyclopediaIsUserScrollingRef, encyclopediaScrollTimeoutRef)}
              onMouseLeave={() => handleMouseLeave(encyclopediaIsUserScrollingRef, encyclopediaLastScrollTimeRef)}
            >
              <div style={{ paddingTop: '8px', paddingBottom: '8px' }}>
                {encyclopediaLoopList.map((item, index) => (
                  <Link
                    key={`${item.slug}-${index}`}
                    href={`/encyclopedia/${item.slug}`}
                      className="block px-6 py-4 border-b-2 border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer insights-encyclopedia-item"
                  >
                    <p className="text-gray-800 font-medium mb-1 hover:text-navy-700 transition-colors">
                      <span suppressHydrationWarning>{isMounted ? getEncyclopediaTitle(item.slug, item.title) : ''}</span>
                    </p>
                    <span className="inline-flex items-center px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-600 border border-blue-100" suppressHydrationWarning>
                      {isMounted ? getEncyclopediaTag(item.slug, item.tag) : ''}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Insights
