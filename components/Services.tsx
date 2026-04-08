'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useMemo, useState, useEffect } from 'react'
import { Building2, ClipboardCheck, Globe2, TrendingUp, Rocket } from 'lucide-react'
import Link from 'next/link'
import { useTContent } from '@/hooks/useTContent'

const Services = () => {
  const { t, tTitle, contentLanguage: language } = useTContent()
  const ref = useRef(null)
  const pieChartRef = useRef(null)
  const mobilePieChartRef = useRef<HTMLDivElement>(null)
  const mobilePieChartInnerRef = useRef<HTMLDivElement>(null)
  const mobilePieChartSvgRef = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const isPieChartInView = useInView(pieChartRef, { once: true, margin: '200px' }) // 提前加载
  const isMobilePieChartInView = useInView(mobilePieChartRef, { once: true, margin: '100px' }) // 移动端饼图
  const [hoveredService, setHoveredService] = useState<string | null>(null) // 使用 service.link 作为标识符，而不是 title
  // 初始状态设为false，避免在iPad上初始渲染时显示
  const [shouldRenderPieChart, setShouldRenderPieChart] = useState(false)
  
  // 初始状态：服务端和客户端都默认为false，避免hydration错误
  // 只在客户端挂载后才检测iPad
  const [isIPad, setIsIPad] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  // iPad上点击状态，独立于hover状态，防止滚动时被清空
  const [clickedIPadService, setClickedIPadService] = useState<string | null>(null)
  // 使用ref保存iPad点击状态，确保滚动时不会被重置 - ref 是唯一真实来源
  const clickedIPadServiceRef = useRef<string | null>(null)
  // 使用ref缓存iPad检测结果，避免每次渲染都重新计算，防止滚动时尺寸变化
  // 初始值设为false，在客户端挂载后再检测，避免hydration错误
  const isIPadDeviceRef = useRef<boolean>(false)
  const [shouldShowDesktopChart, setShouldShowDesktopChart] = useState(false)
  // 检测是否为“手机横屏”（注意：很多手机横屏 width 会超过 767px，所以不能用 width<=767 判断）
  // 判定策略：横屏 + 触摸设备 + 短边足够小（排除 iPad/平板）
  const [isMobileLandscape, setIsMobileLandscape] = useState(false)
  // 手机横版：点击后将饼图精准移动到页面左侧（用像素计算，避免写死的 vw 位移在不同机型失效）
  const [mobileLandscapeShiftX, setMobileLandscapeShiftX] = useState(0)
  /** 移动端饼图标签字号倍率：首帧恒为 1，与 SSR 一致；仅在 checkIPad effect 里按视口更新，避免 SVG tspan hydration 不匹配 */
  const [pieMobileLabelScale, setPieMobileLabelScale] = useState(1)
  /** 饼图 SVG 文字延后到挂载后再渲染，避免服务端与客户端在 language/翻译折行上不一致导致 <text>/<tspan> hydration 失败 */
  const [pieSvgLabelsReady, setPieSvgLabelsReady] = useState(false)
  
  // 强制同步：确保 ref 始终是最新的，state 只是用于触发重新渲染
  useEffect(() => {
    // 如果 state 有值但 ref 没有，同步到 ref
    if (clickedIPadService && !clickedIPadServiceRef.current) {
      clickedIPadServiceRef.current = clickedIPadService
    }
    // 如果 ref 有值但 state 没有，同步到 state（用于触发渲染）
    if (clickedIPadServiceRef.current && !clickedIPadService) {
      setClickedIPadService(clickedIPadServiceRef.current)
    }
  }, [clickedIPadService])
  
  // 确保在滚动时，如果说明框已经打开，状态不会被重置
  // 只在必要时恢复状态，避免无限循环
  useEffect(() => {
    if (clickedIPadServiceRef.current && !clickedIPadService) {
      setClickedIPadService(clickedIPadServiceRef.current)
    }
  }, [clickedIPadService]) // 只依赖 clickedIPadService，避免无限循环
  
  // 检测是否为iPad - 只在客户端执行，避免hydration错误
  useEffect(() => {
    setIsMounted(true)
    setPieSvgLabelsReady(true)
    const checkIPad = () => {
      if (typeof window === 'undefined') return
      const width = window.innerWidth
      const height = window.innerHeight
      
      // 更精确的iPad检测：包括横屏和竖屏，排除桌面端大屏幕
      // iPad检测：宽度或高度在768-1366之间，且另一个维度在合理范围内，排除大桌面屏幕
      const isIPadDevice = (width >= 768 && width <= 1366 && height >= 768 && height <= 1366) &&
                           !(width >= 1920 && height >= 1080) // 排除大桌面屏幕
      
      // 检测手机横版（仅手机，不含 iPad）：
      // - 横屏：width > height
      // - 触摸设备：pointer coarse / maxTouchPoints
      // - 短边阈值：多数手机短边 < 600；iPad 短边通常 >= 768
      // 检测是否为触摸设备（真正的iPad/平板/手机）
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isPhoneLike = Math.min(width, height) < 600
      const isMobileLandscapeMode = width > height && isTouchDevice && isPhoneLike && !isIPadDevice
      setIsMobileLandscape(isMobileLandscapeMode)
      // 检查是否为手机端（宽度 < 1024）
      const isMobile = width < 1024
      // 小屏幕电脑（宽度>=1024但<=1366，且非触摸设备）应该显示桌面版饼图
      const isSmallDesktop = width >= 1024 && width <= 1366 && !isTouchDevice
      
      // 如果之前已经检测到是iPad，保持为true，避免滚动时状态变化导致opacity闪烁
      // 一旦检测到是iPad，就始终保持为true，不会因为滚动而改变
      if (isIPadDeviceRef.current && isTouchDevice) {
        // 如果之前是iPad（触摸设备），保持为true，不更新（避免滚动时状态变化）
        setIsIPad(true)
        setShouldShowDesktopChart(false)
      } else {
        // 之前不是iPad，根据当前检测结果更新
        // 只有真正的触摸设备iPad才被认为是iPad
        const realIPadDevice = isIPadDevice && isTouchDevice
        isIPadDeviceRef.current = realIPadDevice
        setIsIPad(realIPadDevice)
        // 只有在不是iPad且不是手机端时才显示桌面版饼图，或者小屏幕电脑也显示
        setShouldShowDesktopChart((!realIPadDevice && !isMobile) || isSmallDesktop)
      }
      
      // 直接操作DOM，强制隐藏桌面版饼图（优先级最高，使用!important）
      if (pieChartRef.current) {
        const pieChartElement = pieChartRef.current as HTMLElement
        if (isIPadDevice) {
          pieChartElement.style.setProperty('display', 'none', 'important')
          pieChartElement.style.setProperty('visibility', 'hidden', 'important')
        } else {
          pieChartElement.style.removeProperty('display')
          pieChartElement.style.removeProperty('visibility')
        }
      }
      
      // 强制隐藏桌面版饼图容器
      const desktopContainer = document.querySelector('.desktop-pie-chart-container') as HTMLElement
      if (desktopContainer) {
        if (isIPadDevice) {
          desktopContainer.style.setProperty('display', 'none', 'important')
          desktopContainer.style.setProperty('visibility', 'hidden', 'important')
        } else {
          desktopContainer.style.removeProperty('display')
          desktopContainer.style.removeProperty('visibility')
        }
      }

      // 不在 render 中读取 window：首帧 pieMobileLabelScale===1 与 SSR 一致，挂载后再放大移动端标签
      if (width < 1024) {
        const scale = isIPadDeviceRef.current ? 1.3 : 1.4
        setPieMobileLabelScale(scale)
      } else {
        setPieMobileLabelScale(1)
      }
    }
    
    // 立即执行一次检测
    checkIPad()
    
    // 滚动时保持说明框状态（节流处理，避免性能问题）
    let scrollTimeout: NodeJS.Timeout | null = null
    const handleScroll = () => {
      // 使用节流，避免频繁更新状态
      if (scrollTimeout) return
      scrollTimeout = setTimeout(() => {
        scrollTimeout = null
        // 确保说明框状态在滚动时保持：如果ref有值但state没有，恢复state
        if (clickedIPadServiceRef.current && !clickedIPadService) {
          setClickedIPadService(clickedIPadServiceRef.current)
        }
      }, 100) // 每100ms最多执行一次
    }
    
    // 添加滚动事件监听，确保滚动时iPad检测保持更新
    window.addEventListener('resize', checkIPad)
    window.addEventListener('orientationchange', checkIPad)
    window.addEventListener('scroll', handleScroll, { passive: true })
    // 使用多个requestAnimationFrame确保DOM已渲染后再检查
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        checkIPad()
      })
    })
    // 移除MutationObserver，避免性能问题
    // 桌面版饼图已经通过条件渲染和CSS完全隐藏，不需要监听DOM变化
    return () => {
      window.removeEventListener('resize', checkIPad)
      window.removeEventListener('orientationchange', checkIPad)
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
    }
  }, [])

  // 手机横版：当弹窗打开时，计算饼图需要左移的像素值（让饼图贴近页面左边）
  useEffect(() => {
    if (!isMobileLandscape) {
      if (mobileLandscapeShiftX !== 0) setMobileLandscapeShiftX(0)
      return
    }

    // 只在“有选中服务（弹窗出现）”时移动
    const activeServiceLink = clickedIPadServiceRef.current || clickedIPadService
    if (!activeServiceLink) {
      if (mobileLandscapeShiftX !== 0) setMobileLandscapeShiftX(0)
      return
    }

    const computeShift = () => {
      const el = mobilePieChartRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const desiredLeft = 16 // 与页面边缘保持 16px 间距
      const shift = desiredLeft - rect.left
      setMobileLandscapeShiftX(shift)
    }

    // 等待本次渲染完成后再测量
    const raf = requestAnimationFrame(computeShift)
    window.addEventListener('resize', computeShift)
    window.addEventListener('orientationchange', computeShift)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', computeShift)
      window.removeEventListener('orientationchange', computeShift)
    }
  }, [isMobileLandscape, clickedIPadService, mobileLandscapeShiftX])

  // 同步ref和state，确保状态在滚动时保持
  // 只在state变化时更新ref，避免覆盖用户操作
  useEffect(() => {
    if (clickedIPadService !== clickedIPadServiceRef.current) {
      clickedIPadServiceRef.current = clickedIPadService
    }
  }, [clickedIPadService])

  // 在iPad上，确保滚动时状态不会丢失（但不触发重新渲染，避免饼图大小变化）
  useEffect(() => {
    if (!isMounted || !isIPad) return

    // 防止滚动时状态丢失 - 但不触发重新渲染，避免饼图大小变化
    // 移除滚动监听，因为说明框的显示已经直接使用 ref，不需要 state 触发渲染
  }, [isMounted, isIPad])
  
  // 在iPad横屏时，直接设置DOM尺寸，防止滚动时尺寸变化
  useEffect(() => {
    if (!isMounted || !isIPad) return
    
    const setFixedSize = () => {
      // 检查是否为横屏
      const isLandscape = window.innerWidth > window.innerHeight
      if (!isLandscape) return
      
      // 直接设置DOM元素尺寸，强制固定为472.5px（525px的90%）
      if (mobilePieChartInnerRef.current) {
        const element = mobilePieChartInnerRef.current
        // 使用直接赋值，确保优先级最高
        element.style.width = '472.5px'
        element.style.height = '472.5px'
        element.style.minWidth = '472.5px'
        element.style.maxWidth = '472.5px'
        element.style.minHeight = '472.5px'
        element.style.maxHeight = '472.5px'
        element.style.flexShrink = '0'
        element.style.flexGrow = '0'
        // 清除可能影响尺寸的其他属性
        element.style.aspectRatio = 'none'
      }
      
      if (mobilePieChartSvgRef.current) {
        const svg = mobilePieChartSvgRef.current
        svg.style.width = '472.5px'
        svg.style.height = '472.5px'
        svg.style.minWidth = '472.5px'
        svg.style.maxWidth = '472.5px'
        svg.style.minHeight = '472.5px'
        svg.style.maxHeight = '472.5px'
      }
    }
    
    setFixedSize()
    
    // 监听滚动和窗口变化，确保尺寸始终固定
    const handleScroll = () => {
      requestAnimationFrame(setFixedSize)
    }
    
    const handleResize = () => {
      requestAnimationFrame(setFixedSize)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [isMounted, isIPad])
  
  // 立即渲染饼图，避免加载时点击跳转（但只在非iPad设备上）
  useEffect(() => {
    if (!isMounted) return
    // 只在非iPad设备上渲染桌面版饼图
    // 使用更严格的检查，确保在iPad上始终为false
    const isIPadDevice = isIPad || isIPadDeviceRef.current
    if (isIPadDevice) {
      setShouldRenderPieChart(false)
      // 强制确保桌面版饼图不渲染
      if (pieChartRef.current) {
        const pieChartElement = pieChartRef.current as HTMLElement
        pieChartElement.style.setProperty('display', 'none', 'important')
        pieChartElement.style.setProperty('visibility', 'hidden', 'important')
      }
      const desktopContainer = document.querySelector('.desktop-pie-chart-container') as HTMLElement
      if (desktopContainer) {
        desktopContainer.style.setProperty('display', 'none', 'important')
        desktopContainer.style.setProperty('visibility', 'hidden', 'important')
      }
    } else {
      setShouldRenderPieChart(true)
    }
  }, [isMounted, isIPad])
  
  // 移动端和iPad饼图始终渲染，不需要复杂的检查逻辑
  

  const services = useMemo(() => [
    {
      icon: ClipboardCheck,
      title: tTitle('home.services.wuye.title'),
      percentage: 60,
      color: '#3b82f6', // blue
      description: t('home.services.wuye.description'),
      features: (t('home.services.wuye.features', { returnObjects: true }) as string[]) || [],
      link: '/wuye'
    },
    {
      icon: Building2,
      title: tTitle('home.services.maimai.title'),
      percentage: 20,
      color: '#10b981', // green
      description: t('home.services.maimai.description'),
      features: t('home.services.maimai.features', { returnObjects: true }) as string[],
      link: '/maimai'
    },
    {
      icon: Globe2,
      title: tTitle('home.services.qichu.title'),
      percentage: 12.5,
      color: '#f59e0b', // amber
      description: t('home.services.qichu.description'),
      features: t('home.services.qichu.features', { returnObjects: true }) as string[],
      link: '/qichu'
    },
    {
      icon: TrendingUp,
      title: tTitle('home.services.touzi.title'),
      percentage: 7.5,
      color: '#8b5cf6', // purple
      description: t('home.services.touzi.description'),
      features: t('home.services.touzi.features', { returnObjects: true }) as string[],
      link: '/touzi'
    },
  ], [t, tTitle])

  // 饼图文字：SVG <text> 不支持自动换行；英文标题较长时容易溢出扇区
  // 这里做两件事：
  // 1) 英文按空格智能分成两行（尽量均匀）
  // 2) 根据“最长行长度”自动缩小字号，确保文字收纳在饼图内
  const getPieLabelLines = (title: string) => {
    const raw = String(title ?? '').trim()
    if (!raw) return ['']

    // 允许未来通过翻译直接传入换行（\n），统一在这里处理
    if (raw.includes('\n')) {
      const lines = raw
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean)
      return lines.length ? lines.slice(0, 3) : ['']
    }

    if (language !== 'en') return [raw]

    const words = raw.split(/\s+/).filter(Boolean)
    if (words.length <= 1) return [raw]

    // 找一个最“均衡”的断点：让两行的最大长度尽量小，同时两行长度差尽量小
    let bestIdx = 1
    let bestScore = Number.POSITIVE_INFINITY
    for (let i = 1; i < words.length; i++) {
      const line1 = words.slice(0, i).join(' ')
      const line2 = words.slice(i).join(' ')
      const maxLen = Math.max(line1.length, line2.length)
      const diff = Math.abs(line1.length - line2.length)
      const score = maxLen * 2 + diff // maxLen 权重更高
      if (score < bestScore) {
        bestScore = score
        bestIdx = i
      }
    }

    const l1 = words.slice(0, bestIdx).join(' ')
    const l2 = words.slice(bestIdx).join(' ')
    return [l1, l2]
  }

  const computePieLabelFontSizePx = (basePx: number, title: string) => {
    const lines = getPieLabelLines(title)
    const longest = Math.max(...lines.map(l => l.length))

    let shrink = 1
    if (language === 'en') {
      // 两行会更占垂直空间，略微缩小
      if (lines.length >= 2) shrink *= 0.92

      // 英文更容易溢出，按最长行长度再缩小
      if (longest > 12) shrink *= Math.max(0.70, 12 / longest)
      else if (longest > 10) shrink *= 0.90
    }

    return Math.max(12, Math.round(basePx * shrink))
  }

  // 计算饼图的路径和文字位置（使用固定精度避免 hydration 错误）
  const calculatePieData = (percentage: number, startAngle: number) => {
    const radius = 300 // 外圆半径
    const innerRadius = 70 // 内圆半径，避免圆心尖角重叠（适当缩小）
    const centerX = 400
    const centerY = 400
    const angle = (percentage / 100) * 360
    const endAngle = startAngle + angle
    const midAngle = startAngle + angle / 2
    
    const startAngleRad = (startAngle - 90) * (Math.PI / 180)
    const endAngleRad = (endAngle - 90) * (Math.PI / 180)
    const midAngleRad = (midAngle - 90) * (Math.PI / 180)
    
    // 外圆上的点
    const outerX1 = Number((centerX + radius * Math.cos(startAngleRad)).toFixed(2))
    const outerY1 = Number((centerY + radius * Math.sin(startAngleRad)).toFixed(2))
    const outerX2 = Number((centerX + radius * Math.cos(endAngleRad)).toFixed(2))
    const outerY2 = Number((centerY + radius * Math.sin(endAngleRad)).toFixed(2))
    
    // 内圆上的点
    const innerX1 = Number((centerX + innerRadius * Math.cos(startAngleRad)).toFixed(2))
    const innerY1 = Number((centerY + innerRadius * Math.sin(startAngleRad)).toFixed(2))
    const innerX2 = Number((centerX + innerRadius * Math.cos(endAngleRad)).toFixed(2))
    const innerY2 = Number((centerY + innerRadius * Math.sin(endAngleRad)).toFixed(2))
    
    // 文字位置（根据百分比调整位置，避免文字遮挡饼图边缘）
    // 物业管理（60%）向圆心移动，买卖中介（20%）和企业出海助力（12.5%）向内部移动
    const textRadius = percentage >= 50 
      ? radius * 0.60  // 物业管理
      : percentage >= 15 
        ? radius * 0.65  // 买卖中介（20%）向内部移动
        : percentage >= 10
          ? radius * 0.70  // 企业出海助力（12.5%）向内部移动
          : radius * 0.85  // 资产投资运营（7.5%）
    const textX = Number((centerX + textRadius * Math.cos(midAngleRad)).toFixed(2))
    // 物业管理文字稍微向上移动（y值减小）
    const textYOffset = percentage >= 50 ? -8 : 0 // 物业管理向上移动8px
    const textY = Number((centerY + textRadius * Math.sin(midAngleRad) + textYOffset).toFixed(2))
    
    const largeArcFlag = angle > 180 ? 1 : 0
    
    // 绘制从内圆到外圆的扇区路径，避免圆心尖角重叠
    const path = `M ${innerX1} ${innerY1} L ${outerX1} ${outerY1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${outerX2} ${outerY2} L ${innerX2} ${innerY2} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerX1} ${innerY1} Z`
    
    return { path, textX, textY, midAngle: Number(midAngle.toFixed(2)), percentage }
  }

  // 使用 useMemo 缓存饼图数据
  // 注意：这里必须依赖 services，否则切换语言时 service.title 会停留在首次渲染的语言（饼图文字不跟随多语言变化）
  const pieDataList = useMemo(() => {
    let currentAngle = 0
    return services.map((service) => {
      const data = calculatePieData(service.percentage, currentAngle)
      currentAngle += service.percentage * 3.6
      return { ...data, service }
    })
  }, [services])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <section 
      id="services" 
      className="relative section-padding scroll-mt-32"
    >
      <div className="container-custom relative z-10">
        <div
          ref={ref}
          className="text-center mb-0"
        >
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-2"
            suppressHydrationWarning
          >
            {t('home.services.title')}
          </h2>
          <p
            className="text-lg text-gray-200 max-w-2xl mx-auto whitespace-pre-line"
            suppressHydrationWarning
          >
            {t('home.services.subtitle')}
          </p>
        </div>

          <div
            ref={ref}
            className="flex flex-col items-center gap-4 relative mobile-services-container"
            style={{ contentVisibility: 'auto', containIntrinsicSize: '800px' }}
          >
          {/* 手机横版：包装容器，用于横向布局 */}
          {(() => {
            // 优先使用ref，因为它不会因为滚动而改变
            const activeServiceLink = clickedIPadServiceRef.current || clickedIPadService
            return (
              <div 
                className={`mobile-landscape-wrapper w-full ${activeServiceLink ? 'has-description-box' : ''}`}
                style={isMobileLandscape ? {
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  // 未点击：饼图在屏幕中央；点击后：饼图靠左、弹窗在右
                  justifyContent: activeServiceLink ? 'flex-start' : 'center',
                  gap: activeServiceLink ? '1rem' : '0',
                  // 在 container-custom 内做“全宽铺满”，让横版布局真正贴近屏幕两边
                  width: '100vw',
                  marginLeft: 'calc(50% - 50vw)',
                  marginRight: 'calc(50% - 50vw)',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  position: 'relative',
                  overflow: 'visible',
                } : {}}
          >
          {/* 移动端和iPad：饼图 */}
          <div 
            ref={mobilePieChartRef} 
            className="w-full flex justify-center mb-0 mobile-pie-chart-container ipad-pie-chart-wrapper mobile-pie-chart-wrapper"
            style={isMobileLandscape && activeServiceLink ? {
              minHeight: 'auto',
              transform: `translateX(${mobileLandscapeShiftX}px)`,
              transition: 'transform 0.25s ease-in-out',
              width: 'auto',
              maxWidth: 'none',
              flexShrink: 0,
              justifyContent: 'flex-start',
            } : isMobileLandscape ? {
              minHeight: 'auto',
              // 横屏未点击：保持居中
              width: '100%',
              maxWidth: 'none',
              flexShrink: 0,
              justifyContent: 'center',
            } : { minHeight: '400px' }}
          >
            <div 
              ref={mobilePieChartInnerRef}
              className="relative mobile-pie-chart-inner" 
              style={{ 
                // 在iPad上，完全由CSS控制尺寸，不使用内联样式
                ...(isMounted && isIPadDeviceRef.current ? {} : {
                  width: '100%', 
                  maxWidth: '400px', 
                  aspectRatio: '1/1',
                }),
                flexShrink: 0,
                willChange: 'auto',
                // 移除 transform，让CSS控制移动效果
                backfaceVisibility: 'hidden',
              }}
            >
                <svg 
                  ref={mobilePieChartSvgRef}
                  viewBox="0 0 800 800" 
                  className="drop-shadow-lg ipad-pie-chart-svg"
                  style={{ 
                    // 在iPad上，完全由CSS控制尺寸，不使用内联样式
                    // 非iPad设备使用百分比
                    ...(isMounted && isIPadDeviceRef.current ? {} : {
                      width: '100%',
                      height: '100%',
                    })
                  }}
                >
                  {/* 圆心优化 - 添加白色圆形遮罩 */}
                  <circle cx="400" cy="400" r="70" fill="white" opacity="0.98" />
                  
                  {pieDataList.map((pieData, index) => {
                    const { service } = pieData
                    // 完全使用ref来判断，不依赖任何state，确保滚动时状态稳定
                    // 移除对isMounted的依赖，因为isMounted在滚动时可能变化
                    // 使用 service.link 作为标识符，而不是 title，确保多语言版本正常工作
                    const isIPadMode = isIPadDeviceRef.current
                    const isSelected = isIPadMode && clickedIPadServiceRef.current === service.link
                    // 修复opacity逻辑：完全使用ref来判断，避免滚动时state变化导致opacity闪烁
                    // 只在iPad模式下，且有选中的服务，且当前服务不是选中的服务时，才变暗
                    const hasActiveService = clickedIPadServiceRef.current !== null
                    const shouldDim = isIPadMode && hasActiveService && clickedIPadServiceRef.current !== service.link
                    return (
                      <g key={service.link || service.title}>
                        <path
                          d={pieData.path}
                          fill={service.color}
                          stroke="white"
                          strokeWidth={isSelected ? "5" : "3"}
                          className="cursor-pointer transition-all duration-200"
                          style={{
                            opacity: isSelected ? 1 : shouldDim ? 0.6 : 1,
                            filter: isSelected ? 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3)) brightness(1.1)' : 'none',
                          }}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            if (typeof window === 'undefined') return

                            // 小屏/移动版饼图：点击应“弹出说明框”（手机竖版、iPad、小屏桌面都需要）
                            // - 手机/平板（触摸设备）：点击弹出
                            // - 小屏桌面（窗口宽度 < 1024）：点击也弹出（避免“点不开/没有弹窗”）
                            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
                            const isSmallLayout = window.innerWidth < 1024
                            const shouldUsePopup = isTouchDevice || isSmallLayout
                            
                            if (shouldUsePopup) {
                              // 使用 service.link 作为标识符，而不是 title，确保多语言版本正常工作
                              const currentService = clickedIPadServiceRef.current
                              const newService = currentService === service.link ? null : service.link
                              // 先更新ref，确保状态立即生效
                              clickedIPadServiceRef.current = newService
                              // 然后更新state，触发重新渲染
                              setClickedIPadService(newService)
                              // 强制阻止任何可能的导航
                              return false
                            } else {
                              // 大屏桌面：直接导航
                              if (service.link) {
                                window.location.href = service.link
                              }
                            }
                          }}
                        />
                        {pieSvgLabelsReady ? (
                        <text
                          x={pieData.textX}
                          y={pieData.textY}
                          className="fill-white pointer-events-none"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          stroke={(service.percentage === 60 || service.percentage === 12.5) ? '#000000' : 'none'}
                          strokeWidth={(service.percentage === 60 || service.percentage === 12.5) ? '2' : '0'}
                          paintOrder="stroke fill"
                            style={{
                            fontSize: `${(() => {
                              const baseSize = pieData.percentage >= 50 ? 32 : pieData.percentage >= 20 ? 24 : pieData.percentage >= 10 ? 18 : 14
                              return computePieLabelFontSizePx(Math.round(baseSize * pieMobileLabelScale), service.title)
                            })()}px`,
                            fontWeight: '600',
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                          }}
                        >
                          {(() => {
                            const lines = getPieLabelLines(service.title)
                            const lineHeightEm = 1.05
                            const startDy = lines.length === 1 ? '0em' : `${-((lines.length - 1) / 2) * lineHeightEm}em`
                            return lines.map((line, i) => (
                              <tspan
                                key={`${service.link}-m-${i}`}
                                x={pieData.textX}
                                dy={i === 0 ? startDy : `${lineHeightEm}em`}
                              >
                                {line}
                              </tspan>
                            ))
                          })()}
                        </text>
                        ) : null}
                      </g>
                    )
                  })}
                </svg>
              </div>
          </div>


          {/* 移动端和iPad：说明框 - 显示在饼图下方 */}
          {(() => {
            // 优先使用ref，因为它不会因为滚动而改变
            // 使用 service.link 作为标识符，而不是 title，确保多语言版本正常工作
            const activeServiceLink = clickedIPadServiceRef.current || clickedIPadService
            
            // 如果没有选中的服务，不显示说明框
            if (!activeServiceLink) return null
            
            // 检测是否为移动设备（包括手机和iPad）
            // 修复运算符优先级：确保条件判断正确
            // 如果说明框已经打开，即使检测暂时失败也保持显示，避免滚动时闪烁
            const isMobileMode = isMounted && (
              (typeof window !== 'undefined' && window.innerWidth < 1024) || 
              (isIPad || isIPadDeviceRef.current)
            )
            
            // 如果说明框已经打开（有activeServiceLink），就显示它，不管isMobileMode如何
            // 这样可以避免滚动时说明框闪烁
            
            // 使用 service.link 来查找服务，而不是 title
            const activeService = services.find(s => s.link === activeServiceLink)
            if (!activeService) return null
            
            return (
              <div 
                className="w-full flex justify-center ipad-description-box mb-[3.5rem] -mt-4 mobile-landscape-description-box"
                style={isMobileLandscape ? {
                  flex: 1,
                  minWidth: 0,
                  maxWidth: '50%',
                  width: 'auto',
                  marginTop: 0,
                  // 横屏：弹窗在右侧时，下方留出更多空间，避免贴近下方“联系我们预约咨询”按钮
                  marginBottom: '1.5rem',
                  marginLeft: '1rem',
                  marginRight: 0,
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  order: 2,
                } : {}}
              >
                <div className="w-full max-w-[600px]">
                  <Link href={activeService.link} className="block">
                    <div
                      className="rounded-xl p-6 bg-gradient-to-br from-gray-50 to-white shadow-2xl border-l-4 cursor-pointer hover:shadow-3xl transition-shadow duration-300"
                      style={{ borderLeftColor: activeService.color }}
                    >
                      <div className="flex items-center justify-center mb-4">
                        <div 
                          className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center shadow-md"
                          style={{ backgroundColor: `${activeService.color}20` }}
                        >
                          <activeService.icon className="w-7 h-7" style={{ color: activeService.color }} />
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-navy-900 mb-2 text-center">{activeService.title}</h3>
                        <p className="text-gray-700 mb-4 leading-relaxed text-base font-medium">{activeService.description}</p>
                        <ul className="space-y-2">
                          {activeService.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start">
                              <div 
                                className="w-1.5 h-1.5 rounded-full mr-3 mt-1.5 flex-shrink-0"
                                style={{ backgroundColor: activeService.color }}
                              ></div>
                              <span className="text-sm text-gray-600 leading-relaxed">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="flex items-center justify-end mt-3 text-sm" style={{ color: activeService.color }}>
                          <span>{t('home.services.detailPage')}</span>
                          <span className="ml-1">→</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )
          })()}
              </div>
            )
          })()}
          {/* 手机横版：包装容器结束 */}

          {/* 桌面端：饼图容器 - 包含饼图和弹窗（仅大屏幕桌面端，非iPad） */}
          {/* 在iPad上完全不渲染，避免闪现 - 使用shouldShowDesktopChart状态控制 */}
          {shouldShowDesktopChart && (
          <div 
            className={`desktop-pie-chart-container relative w-full overflow-visible`} 
            style={{ 
              minHeight: '400px', 
              padding: '0',
              pointerEvents: 'auto',
              position: 'relative',
              zIndex: 20
            }}
          >
            {/* 桌面端：业务说明列表 - 从饼图后方滑出（非iPad） */}
            {isMounted && (
              <div className="absolute pointer-events-none" style={{ zIndex: 10, width: '1800px', height: '1550px', left: '50%', top: '50%', transform: 'translate(calc(-50% + 50px), calc(-50% - 450px))', overflow: 'visible' }}>
                {services.map((service, index) => {
                  const isHovered = hoveredService === service.link // 使用 link 作为标识符，而不是 title
                  const pieData = pieDataList[index]
                  
                  // 物业管理（index 0）在右侧，其他在左侧
                  const isRightSide = index === 0
                  
                  // 根据扇区角度计算弹窗的垂直位置（分散开，不都集中在底部）
                  const midAngle = pieData.midAngle
                  // 将角度转换为垂直偏移（0度在顶部，180度在底部）
                  // 使用正弦计算垂直偏移
                  const angleRad = (midAngle - 90) * (Math.PI / 180)
                  const verticalOffset = Math.sin(angleRad) * 100 // 根据角度分散位置
                  
                  // 计算弹窗的最终位置
                  // 弹窗父容器：1800px宽，1100px高，通过translate(-50%, -50%)居中
                  // 饼图SVG容器：1700px宽（1500px + 向右扩大200px），300px高（800px - 下方缩小500px），在容器中居中
                  // 饼图容器在弹窗父容器中居中，左边缘在：(1800-1700)/2 = 50px
                  // 饼图中心在饼图容器中：850px（1700/2）X坐标，150px（300/2）Y坐标
                  // 饼图中心在弹窗父容器中：50 + 850 = 900px X坐标，150px Y坐标
                  // 饼图向右移动200px，所以实际中心：900 + 200 = 1100px X坐标
                  // 弹窗宽度280px，中心需要距离饼图中心至少：300（饼图半径）+ 140（弹窗宽度一半）+ 30（安全边距）= 470px
                  const pieCenterX = 1100 // 饼图中心X坐标（弹窗父容器1800px宽，饼图容器1700px居中，再向右移动200px）
                  const pieCenterY = 150 // 饼图中心Y坐标（容器高度300px，饼图居中）
                  const minDistance = 470 // 最小距离，确保弹窗不被饼图遮挡
                  
                  // 计算弹窗中心位置（相对于弹窗父容器）
                  // 物业管理（右侧）：向左移动200px，向下移动300px + 350px = 650px
                  // 其他三个（资产投资运营、企业出海助力、买卖中介）：向右移动350px - 50px = 300px，向下移动100px
                  const popupCenterX = isRightSide 
                    ? pieCenterX + minDistance - 100 - 80 - 200  // 右侧（物业管理）：1100 + 470 - 100 - 80 - 200 = 1190px（向左移动200px）
                    : pieCenterX - minDistance - 100 - 80 - 300 - 50 - 150 + 350 - 50  // 左侧（其他三个）：1100 - 470 - 100 - 80 - 300 - 50 - 150 + 350 - 50 = 250px（向右移动350px，再向左移动50px）
                  const popupCenterYRaw = isRightSide 
                    ? pieCenterY + verticalOffset + 500 + 300 + 350  // 物业管理：向下移动500px + 300px + 350px = 1300px左右
                    : pieCenterY + verticalOffset + 500 + 200 + 300 + 100  // 其他三个：向下移动500px + 200px + 300px + 100px = 1250px左右

                  // 仅英文版：英文内容更容易撑高弹窗 → 适当上移避免底部被裁切
                  // 但部分扇区（/qichu, /touzi）上移过多会导致顶部越界，所以对这两项减少上移量（等价于向下移动）
                  const isEnglish = language === 'en'
                  const englishNeedsLessUpShift =
                    isEnglish && (service.link === '/qichu' || service.link === '/touzi')
                  const popupCenterY = isEnglish
                    ? popupCenterYRaw - (englishNeedsLessUpShift ? 120 : 220)
                    : popupCenterYRaw
                  
                  // 边界检查：确保弹窗完全在父容器内（1800x1550）
                  // 弹窗宽度280px，高度约320px
                  // 左侧边界：250px（弹窗中心）- 140px（弹窗宽度一半）= 110px（安全）
                  // 右侧边界：1190px（弹窗中心）+ 140px（弹窗宽度一半）= 1330px（安全）
                  // 顶部边界：物业管理弹窗中心Y在1300px左右，其他三个在1250px左右
                  // 底部边界：物业管理弹窗中心Y在1300px左右（底部在1460px左右），其他三个在1250px左右（底部在1410px左右）
                  const clampedX = Math.max(140, Math.min(1660, popupCenterX))
                  const clampedY = isEnglish
                    ? Math.max(220, Math.min(1550 - 220, popupCenterY))
                    : popupCenterY // 其他语言保持原逻辑
                  
                  return (
                    <motion.div
                      key={service.link}
                      initial={{ 
                        opacity: 0,
                        scale: 0.85,
                        zIndex: 10, // 初始状态在饼图后面（饼图z-index是20）
                      }}
                      animate={{
                        opacity: isHovered ? 1 : 0,
                        scale: isHovered ? 1 : 0.85,
                        pointerEvents: isHovered ? 'auto' : 'none',
                        zIndex: isHovered ? 30 : 10, // 弹出时在饼图前面（30 > 20）
                      }}
                      transition={{ 
                        duration: 0.4,
                        ease: 'easeOut'
                      }}
                      className="absolute w-[252px]" // 高瘦的长方形，固定宽度（90%）
                      style={{
                        left: `${clampedX}px`, // 弹窗中心X坐标（相对于弹窗父容器）
                        top: `${clampedY}px`, // 弹窗中心Y坐标（相对于弹窗父容器）
                        transform: 'translate(-50%, -50%)', // 让弹窗以中心点定位
                        transformOrigin: 'center center',
                      }}
                      onMouseLeave={() => setHoveredService(null)}
                    >
                      <Link href={service.link} className="block pointer-events-auto h-full">
                        <div
                          className="rounded-xl p-5 bg-gradient-to-br from-gray-50 to-white shadow-2xl border-l-4 cursor-pointer hover:shadow-3xl transition-shadow duration-300 h-full flex flex-col"
                          style={{ borderLeftColor: service.color, minHeight: '288px' }} // 高瘦的长方形（90%）
                        >
                          <div className="flex items-center justify-center mb-4">
                            <div 
                              className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center shadow-md"
                              style={{ backgroundColor: `${service.color}20` }}
                            >
                              <service.icon className="w-7 h-7" style={{ color: service.color }} />
                            </div>
                          </div>
                          <div className="flex-1 flex flex-col">
                            <p className="text-gray-700 mb-4 leading-relaxed text-base font-medium flex-shrink-0">{service.description}</p>
                            <ul className="space-y-2 flex-1">
                              {service.features.map((feature, featureIndex) => (
                                <li key={featureIndex} className="flex items-start">
                                  <div 
                                    className="w-1.5 h-1.5 rounded-full mr-3 mt-1.5 flex-shrink-0"
                                    style={{ backgroundColor: service.color }}
                                  ></div>
                                  <span className="text-sm text-gray-600 leading-relaxed">{feature}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="flex items-center justify-end mt-3 text-sm" style={{ color: service.color }}>
                              <span>{t('home.services.detailPage')}</span>
                              <span className="ml-1">→</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
          )}

          {/* 桌面端：圆盘图表 - 放大并突出（仅大屏幕桌面端，非iPad） */}
          {/* 在iPad上完全不渲染，避免闪现 - 使用shouldShowDesktopChart状态控制 */}
          {shouldShowDesktopChart && (
          <div
            ref={pieChartRef}
            className={`relative mx-auto`}
            style={{ 
              zIndex: 50, 
              minHeight: '300px', 
              width: '1700px', 
              height: '300px', 
              transform: 'translate(250px, -450px)',
              pointerEvents: 'auto',
              overflow: 'visible',
              position: 'relative'
            }}
          >
            {shouldRenderPieChart ? (
              <svg 
                width="720" 
                height="720" 
                viewBox="0 0 800 800" 
                className="transform rotate-0 drop-shadow-2xl" 
                style={{
                  pointerEvents: 'auto',
                  overflow: 'visible'
                }}
              >
                {/* 圆心优化 - 添加白色圆形遮罩，与内圆半径一致 */}
                <circle cx="400" cy="400" r="70" fill="white" opacity="0.98" />
                
                {pieDataList.map((pieData, index) => {
                const { service, percentage } = pieData
                // 根据百分比调整文字大小：60%用42px，20%用30px，12.5%用22px，7.5%用18px
                const baseFontSize = percentage >= 50 
                  ? 42  // 物业管理
                  : percentage >= 20 
                    ? 30  // 买卖中介
                    : percentage >= 10
                      ? 22  // 企业出海助力（放大以适配饼图大小）
                      : 18  // 资产投资运营
                const isHovered = hoveredService === service.link // 使用 link 作为标识符，而不是 title
                const scale = isHovered ? 1.08 : 1
                
                // 检测是否为触摸设备（统一检测方法）
                const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
                
                return (
                  <g key={service.link} className="pie-segment-group" style={{ pointerEvents: 'auto' }}>
                    {shouldRenderPieChart ? (
                      // 桌面端使用a标签，确保在所有浏览器和系统上都能正常工作
                      <a 
                        href={service.link}
                        onClick={(e) => {
                          // 确保点击事件能正确触发
                          e.stopPropagation()
                          // 强制导航，确保在所有情况下都能正常工作
                          if (service.link) {
                            // 立即导航，不等待Link的默认行为
                            try {
                              window.location.href = service.link
                            } catch (err) {
                              window.location.assign(service.link)
                            }
                          }
                        }}
                        style={{ 
                          pointerEvents: 'auto',
                          display: 'block',
                          position: 'relative',
                          zIndex: 60,
                          textDecoration: 'none',
                          outline: 'none',
                          cursor: 'pointer',
                          WebkitTapHighlightColor: 'transparent'
                        }}
                      >
                        <path
                          d={pieData.path}
                          fill={service.color}
                          stroke="white"
                          strokeWidth="5"
                          className="transition-all duration-300 cursor-pointer"
                          style={{ 
                            filter: isHovered ? 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.25)) brightness(1.15)' : 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))',
                            transformOrigin: '360px 360px',
                            transform: `scale(${scale})`,
                            transition: 'filter 0.2s ease, transform 0.2s ease',
                            pointerEvents: 'auto',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={() => {
                            // 只在非触摸设备上使用hover，显示弹窗
                            if (typeof window !== 'undefined') {
                              const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
                            if (!isTouchDevice) {
                                setHoveredService(service.link) // 使用 link 作为标识符，而不是 title
                              }
                            }
                          }}
                          onClick={(e) => {
                            // 桌面端点击：也显示弹窗（用户反馈“小屏幕电脑点不开/没有弹窗”）
                            e.preventDefault()
                            e.stopPropagation()
                            setHoveredService((prev) => (prev === service.link ? null : service.link))
                          }}
                          onTouchStart={(e) => {
                            // 触摸设备：也显示弹窗（不直接跳转）
                            e.stopPropagation()
                            setHoveredService((prev) => (prev === service.link ? null : service.link))
                          }}
                          // 移除 onMouseLeave，弹窗不会因为离开饼图而消失
                        />
                      </a>
                    ) : null}
                    {pieSvgLabelsReady ? (
                    <text
                      x={pieData.textX}
                      y={pieData.textY}
                      className="fill-white pointer-events-none transition-all duration-300"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      stroke={(service.percentage === 60 || service.percentage === 12.5) ? '#000000' : 'none'}
                      strokeWidth={(service.percentage === 60 || service.percentage === 12.5) ? '2' : '0'}
                      paintOrder="stroke fill"
                      style={{
                        fontSize: `${computePieLabelFontSizePx(baseFontSize * scale, service.title)}px`,
                        fontWeight: '600',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                        transformOrigin: `${pieData.textX}px ${pieData.textY}px`,
                        transform: `scale(${scale})`,
                      }}
                    >
                      {(() => {
                        const lines = getPieLabelLines(service.title)
                        const lineHeightEm = 1.05
                        const startDy = lines.length === 1 ? '0em' : `${-((lines.length - 1) / 2) * lineHeightEm}em`
                        return lines.map((line, i) => (
                          <tspan
                            key={`${service.link}-d-${i}`}
                            x={pieData.textX}
                            dy={i === 0 ? startDy : `${lineHeightEm}em`}
                          >
                            {line}
                          </tspan>
                        ))
                      })()}
                    </text>
                    ) : null}
                  </g>
                )
              })}
              </svg>
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ minHeight: '400px' }}>
                <div className="w-16 h-16 border-4 border-navy-200 border-t-navy-600 rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          )}
        </div>

        <div
          ref={ref}
          className="text-center mt-0"
        >
          <a
            href="#contact"
            className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2 hover:scale-105 transform transition-all duration-200"
            suppressHydrationWarning
          >
            {t('home.contact.consultation')}
          </a>
        </div>
      </div>
    </section>
  )
}

export default Services
