'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useMemo, useState, useEffect } from 'react'
import { Building2, ClipboardCheck, Globe2, TrendingUp, Rocket } from 'lucide-react'
import Link from 'next/link'

const Services = () => {
  const ref = useRef(null)
  const pieChartRef = useRef(null)
  const mobilePieChartRef = useRef<HTMLDivElement>(null)
  const mobilePieChartInnerRef = useRef<HTMLDivElement>(null)
  const mobilePieChartSvgRef = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const isPieChartInView = useInView(pieChartRef, { once: true, margin: '200px' }) // 提前加载
  const isMobilePieChartInView = useInView(mobilePieChartRef, { once: true, margin: '100px' }) // 移动端饼图
  const [hoveredService, setHoveredService] = useState<string | null>(null)
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
    const checkIPad = () => {
      if (typeof window === 'undefined') return
      const width = window.innerWidth
      const height = window.innerHeight
      // 更精确的iPad检测：包括横屏和竖屏，排除桌面端大屏幕
      // iPad检测：宽度或高度在768-1366之间，且另一个维度在合理范围内，排除大桌面屏幕
      const isIPadDevice = (width >= 768 && width <= 1366 && height >= 768 && height <= 1366) &&
                           !(width >= 1920 && height >= 1080) // 排除大桌面屏幕
      // 检查是否为手机端（宽度 < 1024）
      const isMobile = width < 1024
      
      // 如果之前已经检测到是iPad，保持为true，避免滚动时状态变化导致opacity闪烁
      // 一旦检测到是iPad，就始终保持为true，不会因为滚动而改变
      if (isIPadDeviceRef.current) {
        // 如果之前是iPad，保持为true，不更新（避免滚动时状态变化）
        setIsIPad(true)
        setShouldShowDesktopChart(false)
      } else {
        // 之前不是iPad，根据当前检测结果更新
        isIPadDeviceRef.current = isIPadDevice
        setIsIPad(isIPadDevice)
        // 只有在不是iPad且不是手机端时才显示桌面版饼图
        setShouldShowDesktopChart(!isIPadDevice && !isMobile)
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
  

  const services = [
    {
      icon: ClipboardCheck,
      title: '物业管理',
      percentage: 60,
      color: '#3b82f6', // blue
      description: '面向在日资产及海外业主的托管服务，包括租赁管理、收支统计、内装修缮、税务申报，确保资产稳健运营。',
      features: ['租客筛选与签约', '租金收取与账目透明', '定期巡检与应急维修', '保险与税费协办'],
      link: '/wuye'
    },
    {
      icon: Building2,
      title: '买卖中介',
      percentage: 20,
      color: '#10b981', // green
      description: '针对住宅、公寓、整栋楼宇及商用物业提供全流程购置与出售服务，助您高效匹配优质项目。',
      features: ['严选投资房源', '一对一顾问陪同', '税务与贷款协调', '交割与法律支持'],
      link: '/maimai'
    },
    {
      icon: Globe2,
      title: '企业出海助力',
      percentage: 12.5,
      color: '#f59e0b', // amber
      description: '为有意拓展日本市场的企业提供落地策略、伙伴对接与项目执行支持，快速适配当地商业环境。',
      features: ['市场调研与选址', '合作伙伴对接', '注册与合规办理', '宣传与品牌本地化'],
      link: '/qichu'
    },
    {
      icon: TrendingUp,
      title: '资产投资运营',
      percentage: 7.5,
      color: '#8b5cf6', // purple
      description: 'Bourn Mark 长期持有优质不动产与创新企业股权，展示自有资本运营成果，供业务伙伴了解集团实力。',
      features: ['企业自有资产展示', '长期稳健运营体系', '跨城市投资布局', '不对外提供投资募集'],
      link: '/touzi'
    },
  ]

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

  // 使用 useMemo 缓存饼图数据，避免 hydration 错误
  const pieDataList = useMemo(() => {
    let currentAngle = 0
    return services.map((service) => {
      const data = calculatePieData(service.percentage, currentAngle)
      currentAngle += service.percentage * 3.6
      return { ...data, service }
    })
  }, [])

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
          >
            主要业务
          </h2>
          <p
            className="text-lg text-gray-200 max-w-2xl mx-auto"
          >
            从选房买卖到资产运营，再到企业落地，我们以一站式服务陪伴您在日本的每一步投资与发展。
          </p>
        </div>

          <div
            ref={ref}
            className="flex flex-col items-center gap-4 relative"
            style={{ contentVisibility: 'auto', containIntrinsicSize: '800px' }}
          >
          {/* 移动端和iPad：饼图 */}
          <div 
            ref={mobilePieChartRef} 
            className="w-full flex justify-center mb-0 mobile-pie-chart-container ipad-pie-chart-wrapper"
            style={{ minHeight: '400px' }}
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
                transform: 'translate3d(0, 0, 0)',
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
                    const isIPadMode = isIPadDeviceRef.current
                    const isSelected = isIPadMode && clickedIPadServiceRef.current === service.title
                    // 修复opacity逻辑：完全使用ref来判断，避免滚动时state变化导致opacity闪烁
                    // 只在iPad模式下，且有选中的服务，且当前服务不是选中的服务时，才变暗
                    const hasActiveService = clickedIPadServiceRef.current !== null
                    const shouldDim = isIPadMode && hasActiveService && clickedIPadServiceRef.current !== service.title
                    return (
                      <g key={service.title}>
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
                            // 移动端（包括手机和iPad）点击时，设置选中状态用于显示下方说明框
                            // 完全使用ref来判断，确保滚动时也能正常工作
                            if (typeof window === 'undefined') return
                            const width = window.innerWidth
                            const isMobileDevice = width < 1024 || isIPadDeviceRef.current
                            
                            if (isMobileDevice) {
                              const currentService = clickedIPadServiceRef.current
                              const newService = currentService === service.title ? null : service.title
                              // 先更新ref，确保状态立即生效
                              clickedIPadServiceRef.current = newService
                              // 然后更新state，触发重新渲染
                              setClickedIPadService(newService)
                              // 强制阻止任何可能的导航
                              return false
                            }
                          }}
                        />
                        <text
                          x={pieData.textX}
                          y={pieData.textY}
                          className="fill-white pointer-events-none"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          stroke={service.title === '物业管理' || service.title === '企业出海助力' ? '#000000' : 'none'}
                          strokeWidth={service.title === '物业管理' || service.title === '企业出海助力' ? '2' : '0'}
                          paintOrder="stroke fill"
                            style={{
                            fontSize: `${(() => {
                              const baseSize = pieData.percentage >= 50 ? 32 : pieData.percentage >= 20 ? 24 : pieData.percentage >= 10 ? 18 : 14
                              // 移动设备（包括手机和iPad）放大文字
                              if (isMounted && typeof window !== 'undefined') {
                                const isMobile = window.innerWidth < 1024
                                if (isMobile) {
                                  // iPad放大1.3倍，手机放大1.4倍
                                  const scale = (isIPad || isIPadDeviceRef.current) ? 1.3 : 1.4
                                  return Math.round(baseSize * scale)
                                }
                              }
                              return baseSize
                            })()}px`,
                            fontWeight: '600',
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                          }}
                        >
                          {service.title}
                        </text>
                      </g>
                    )
                  })}
                </svg>
              </div>
          </div>


          {/* 移动端和iPad：说明框 - 显示在饼图下方 */}
          {(() => {
            // 优先使用ref，因为它不会因为滚动而改变
            const activeServiceTitle = clickedIPadServiceRef.current || clickedIPadService
            
            // 如果没有选中的服务，不显示说明框
            if (!activeServiceTitle) return null
            
            // 检测是否为移动设备（包括手机和iPad）
            // 修复运算符优先级：确保条件判断正确
            // 如果说明框已经打开，即使检测暂时失败也保持显示，避免滚动时闪烁
            const isMobileMode = isMounted && (
              (typeof window !== 'undefined' && window.innerWidth < 1024) || 
              (isIPad || isIPadDeviceRef.current)
            )
            
            // 如果说明框已经打开（有activeServiceTitle），就显示它，不管isMobileMode如何
            // 这样可以避免滚动时说明框闪烁
            
            const activeService = services.find(s => s.title === activeServiceTitle)
            if (!activeService) return null
            
            return (
              <div className="w-full flex justify-center ipad-description-box mb-4 -mt-4">
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
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )
          })()}

          {/* 桌面端：饼图容器 - 包含饼图和弹窗（仅大屏幕桌面端，非iPad） */}
          {/* 在iPad上完全不渲染，避免闪现 - 使用shouldShowDesktopChart状态控制 */}
          {shouldShowDesktopChart && (
          <div 
            className={`desktop-pie-chart-container relative w-full overflow-visible`} 
            style={{ 
              minHeight: '400px', 
              padding: '0'
            }}
          >
            {/* 桌面端：业务说明列表 - 从饼图后方滑出（非iPad） */}
            {isMounted && (
              <div className="absolute pointer-events-none" style={{ zIndex: 10, width: '1800px', height: '1550px', left: '50%', top: '50%', transform: 'translate(calc(-50% + 50px), calc(-50% - 450px))', overflow: 'visible' }}>
                {services.map((service, index) => {
                  const isHovered = hoveredService === service.title
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
                  const popupCenterY = isRightSide 
                    ? pieCenterY + verticalOffset + 500 + 300 + 350  // 物业管理：向下移动500px + 300px + 350px = 1300px左右
                    : pieCenterY + verticalOffset + 500 + 200 + 300 + 100  // 其他三个：向下移动500px + 200px + 300px + 100px = 1250px左右
                  
                  // 边界检查：确保弹窗完全在父容器内（1800x1550）
                  // 弹窗宽度280px，高度约320px
                  // 左侧边界：250px（弹窗中心）- 140px（弹窗宽度一半）= 110px（安全）
                  // 右侧边界：1190px（弹窗中心）+ 140px（弹窗宽度一半）= 1330px（安全）
                  // 顶部边界：物业管理弹窗中心Y在1300px左右，其他三个在1250px左右
                  // 底部边界：物业管理弹窗中心Y在1300px左右（底部在1460px左右），其他三个在1250px左右（底部在1410px左右）
                  const clampedX = Math.max(140, Math.min(1660, popupCenterX))
                  const clampedY = popupCenterY // 不限制Y坐标，容器高度已扩大到1550px
                  
                  return (
                    <motion.div
                      key={service.title}
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
              zIndex: 20, 
              minHeight: '300px', 
              width: '1700px', 
              height: '300px', 
              transform: 'translate(250px, -450px)'
            }}
          >
            {shouldRenderPieChart ? (
              <svg 
                width="720" 
                height="720" 
                viewBox="0 0 800 800" 
                className="transform rotate-0 drop-shadow-2xl" 
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
                const isHovered = hoveredService === service.title
                const scale = isHovered ? 1.08 : 1
                
                // 检测是否为触摸设备
                const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
                
                return (
                  <g key={service.title} className="pie-segment-group">
                    {shouldRenderPieChart ? (
                      // 桌面端使用Link，可以跳转
                      <Link 
                        href={service.link}
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
                          }}
                          onMouseEnter={() => {
                            // 只在非触摸设备上使用hover
                            if (!isTouchDevice) {
                              setHoveredService(service.title)
                            }
                          }}
                          onMouseLeave={() => {
                            // 只在非触摸设备上使用mouseLeave
                            if (!isTouchDevice) {
                              setHoveredService(null)
                            }
                          }}
                        />
                      </Link>
                    ) : null}
                    <text
                      x={pieData.textX}
                      y={pieData.textY}
                      className="fill-white pointer-events-none transition-all duration-300"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      stroke={service.title === '物业管理' || service.title === '企业出海助力' ? '#000000' : 'none'}
                      strokeWidth={service.title === '物业管理' || service.title === '企业出海助力' ? '2' : '0'}
                      paintOrder="stroke fill"
                      style={{
                        fontSize: `${baseFontSize * scale}px`,
                        fontWeight: '600',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                        transformOrigin: `${pieData.textX}px ${pieData.textY}px`,
                        transform: `scale(${scale})`,
                      }}
                    >
                      {service.title}
                    </text>
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
          >
            联系我们预约咨询
          </a>
        </div>
      </div>
    </section>
  )
}

export default Services

