'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useMemo, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Building2, ClipboardCheck, Globe2, TrendingUp, Rocket } from 'lucide-react'
import Link from 'next/link'

const Services = () => {
  const ref = useRef(null)
  const pieChartRef = useRef(null)
  const mobilePieChartRef = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const isPieChartInView = useInView(pieChartRef, { once: true, margin: '200px' }) // 提前加载
  const isMobilePieChartInView = useInView(mobilePieChartRef, { once: true, margin: '100px' }) // 移动端饼图
  const [hoveredService, setHoveredService] = useState<string | null>(null)
  const [shouldRenderPieChart, setShouldRenderPieChart] = useState(false)
  const [shouldRenderMobilePieChart, setShouldRenderMobilePieChart] = useState(false)
  const [isIPad, setIsIPad] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [selectedMobileService, setSelectedMobileService] = useState<string | null>(null)
  const mobileButtonsRef = useRef<HTMLDivElement>(null)
  const mobileButtonRefs = useRef<Record<string, HTMLDivElement | null>>({})
  // iPad上点击状态，独立于hover状态，防止滚动时被清空
  const [clickedIPadService, setClickedIPadService] = useState<string | null>(null)
  // 使用ref保存iPad点击状态，确保滚动时不会被重置 - ref 是唯一真实来源
  const clickedIPadServiceRef = useRef<string | null>(null)
  
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
  
  // 检测是否为iPad - 只在客户端执行，避免hydration错误
  useEffect(() => {
    setIsMounted(true)
    const checkIPad = () => {
      if (typeof window === 'undefined') return
      const width = window.innerWidth
      const height = window.innerHeight
      // 更精确的iPad检测：排除桌面端大屏幕
      const isIPadDevice = (width >= 768 && width <= 1024 && height >= 768 && height <= 1366) || 
                           (height >= 768 && height <= 1024 && width >= 768 && width <= 1366)
      setIsIPad(isIPadDevice)
    }
    
    checkIPad()
    window.addEventListener('resize', checkIPad)
    return () => window.removeEventListener('resize', checkIPad)
  }, [])

  // 同步ref和state，确保状态在滚动时保持
  useEffect(() => {
    clickedIPadServiceRef.current = clickedIPadService
  }, [clickedIPadService])

  // 在iPad上，确保滚动时状态不会丢失
  useEffect(() => {
    if (!isMounted || !isIPad) return

    // 防止滚动时状态丢失 - 强制同步 ref 到 state
    const handleScroll = () => {
      const refValue = clickedIPadServiceRef.current
      // 如果 ref 有值但 state 没有，强制恢复 state（触发重新渲染）
      if (refValue && !clickedIPadService) {
        setClickedIPadService(refValue)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMounted, isIPad, clickedIPadService])
  
  // 立即渲染饼图，避免加载时点击跳转
  useEffect(() => {
    // 移除延迟，立即渲染饼图
    setShouldRenderPieChart(true)
  }, [])
  
  // 延迟渲染移动端饼图
  useEffect(() => {
    if (isMobilePieChartInView) {
      const timer = requestAnimationFrame(() => {
        setShouldRenderMobilePieChart(true)
      })
      return () => cancelAnimationFrame(timer)
    }
  }, [isMobilePieChartInView])
  
  // 移动端：点击饼图区域时，滑动对应按钮到中央
  useEffect(() => {
    if (!selectedMobileService || !mobileButtonsRef.current || !mobileButtonRefs.current[selectedMobileService]) return
    
    const container = mobileButtonsRef.current
    const targetButton = mobileButtonRefs.current[selectedMobileService]
    
    if (!container || !targetButton) return
    
    const containerRect = container.getBoundingClientRect()
    const buttonRect = targetButton.getBoundingClientRect()
    const containerCenter = containerRect.left + containerRect.width / 2
    const buttonCenter = buttonRect.left + buttonRect.width / 2
    const scrollLeft = container.scrollLeft + (buttonCenter - containerCenter)
    
    container.scrollTo({
      left: scrollLeft,
      behavior: 'smooth'
    })
  }, [selectedMobileService])

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
            className="flex flex-col items-center gap-12 relative"
            style={{ contentVisibility: 'auto', containIntrinsicSize: '800px' }}
          >
          {/* 移动端：饼图 - 无点击放大和弹窗功能 */}
          <div ref={mobilePieChartRef} className="md:hidden w-full flex justify-center mb-8">
            {shouldRenderMobilePieChart ? (
              <div className="relative" style={{ width: '100%', maxWidth: '400px', aspectRatio: '1/1' }}>
                <svg 
                  width="100%" 
                  height="100%" 
                  viewBox="0 0 800 800" 
                  className="drop-shadow-lg"
                  style={{ width: '100%', height: '100%' }}
                >
                  {/* 圆心优化 - 添加白色圆形遮罩 */}
                  <circle cx="400" cy="400" r="70" fill="white" opacity="0.98" />
                  
                  {pieDataList.map((pieData, index) => {
                    const { service } = pieData
                    const isSelected = selectedMobileService === service.title
                    return (
                      <g key={service.title}>
                        <path
                          d={pieData.path}
                          fill={service.color}
                          stroke="white"
                          strokeWidth={isSelected ? "5" : "3"}
                          className="cursor-pointer transition-all duration-200"
                          style={{
                            opacity: isSelected ? 1 : selectedMobileService && selectedMobileService !== service.title ? 0.6 : 1,
                            filter: isSelected ? 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3)) brightness(1.1)' : 'none',
                          }}
                          onClick={() => {
                            setSelectedMobileService(service.title)
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
                            fontSize: `${pieData.percentage >= 50 ? 32 : pieData.percentage >= 20 ? 24 : pieData.percentage >= 10 ? 18 : 14}px`,
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
            ) : (
              <div className="w-full max-w-[400px] aspect-square flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-navy-200 border-t-navy-600 rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* 移动端：按钮列表 - 横向滑动形式 */}
          <div 
            ref={mobileButtonsRef}
            className="md:hidden w-full overflow-x-auto pb-4 mb-8 scrollbar-hide"
            style={{ 
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <div className="flex gap-4 px-4" style={{ minWidth: 'max-content' }}>
              {services.map((service, index) => {
                const Icon = service.icon
                const isSelected = selectedMobileService === service.title
                return (
                  <div
                    key={service.title}
                    ref={(el) => {
                      if (el) {
                        mobileButtonRefs.current[service.title] = el
                      }
                    }}
                    className="flex-shrink-0 w-[280px] h-[180px]"
                    style={{ scrollSnapAlign: 'center' }}
                  >
                    <Link
                      href={service.link}
                      className={`group bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border-2 transition-all duration-300 block h-full flex flex-col ${
                        isSelected 
                          ? 'border-4 shadow-xl scale-105' 
                          : 'border-gray-100 hover:shadow-xl'
                      }`}
                      style={{ 
                        borderLeftColor: service.color, 
                        borderLeftWidth: isSelected ? '6px' : '4px',
                        borderColor: isSelected ? service.color : undefined
                      }}
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div 
                          className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-transform duration-300"
                          style={{ 
                            backgroundColor: `${service.color}20`,
                            transform: isSelected ? 'scale(1.1)' : 'scale(1)'
                          }}
                        >
                          <Icon className="w-6 h-6" style={{ color: service.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-lg font-semibold mb-2 transition-colors line-clamp-1 ${
                            isSelected ? 'text-navy-700' : 'text-navy-900 group-hover:text-navy-600'
                          }`}>
                            {service.title}
                          </h3>
                          <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{service.description}</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 桌面端：饼图容器 - 包含饼图和iPad弹窗 */}
          <div className="hidden md:block relative w-full flex flex-col items-center">
            {/* 桌面端：业务说明列表 - 从饼图后方滑出（非iPad） */}
            {(!isMounted || !isIPad) && isMounted && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 10 }}>
                {services.map((service, index) => {
                  const isHovered = hoveredService === service.title
                  const pieData = pieDataList[index]
                  
                  // 物业管理（index 0）在右侧，其他在左侧
                  const isRightSide = index === 0
                  
                  // 根据扇区角度计算弹窗的垂直位置（分散开，不都集中在底部）
                  const midAngle = pieData.midAngle
                  // 将角度转换为垂直偏移（0度在顶部，180度在底部）
                  const angleRad = (midAngle - 90) * (Math.PI / 180)
                  const verticalOffset = Math.sin(angleRad) * 150 // 根据角度分散位置
                  
                  // 计算弹窗的最终位置
                  // 饼图SVG宽度800px，半径300px，中心在400px
                  // 弹窗宽度280px，中心需要距离饼图中心至少：300（饼图半径）+ 140（弹窗宽度一半）+ 80（安全边距）= 520px
                  // 左侧弹窗需要更往左（负值更小），右侧弹窗需要更往右（正值更大）
                  const finalX = isRightSide ? 500 : -520 // 物业管理在右侧（稍微向右移动），其他在左侧
                  
                  return (
                    <motion.div
                      key={service.title}
                      initial={{ 
                        opacity: 0,
                        x: '-50%', // 从饼图中心（后方）开始，先居中
                        y: `calc(-50% + ${verticalOffset}px)`, // 垂直偏移
                        scale: 0.85,
                        zIndex: 10, // 初始状态在饼图后面（饼图z-index是20）
                      }}
                      animate={{
                        opacity: isHovered ? 1 : 0,
                        x: isHovered ? `calc(-50% + ${finalX}px)` : '-50%', // 从中心滑出到最终位置
                        y: `calc(-50% + ${verticalOffset}px)`,
                        scale: isHovered ? 1 : 0.85,
                        pointerEvents: isHovered ? 'auto' : 'none',
                        zIndex: isHovered ? 30 : 10, // 弹出时在饼图前面（30 > 20）
                      }}
                      transition={{ 
                        duration: 0.4,
                        ease: 'easeOut'
                      }}
                      className="absolute w-[280px]" // 高瘦的长方形，固定宽度
                      style={{
                        left: '50%',
                        top: '50%',
                      }}
                    >
                      <Link href={service.link} className="block pointer-events-auto h-full">
                        <div
                          className="rounded-xl p-5 bg-gradient-to-br from-gray-50 to-white shadow-2xl border-l-4 cursor-pointer hover:shadow-3xl transition-shadow duration-300 h-full flex flex-col"
                          style={{ borderLeftColor: service.color, minHeight: '320px' }} // 高瘦的长方形
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

          {/* 桌面端：圆盘图表 - 放大并突出 */}
          {/* iPad上点击时缩小饼图，为下方弹窗留出空间 */}
          <div
            ref={pieChartRef}
            className="hidden md:block relative"
            style={{ zIndex: 20, minHeight: isMounted && isIPad && clickedIPadServiceRef.current ? '1100px' : '800px' }}
          >
            {/* iPad上弹窗统一显示在饼图正下方 - 使用 Portal 渲染到 body，避免受父容器影响 */}
            {(() => {
              // 在渲染时直接读取 ref，避免依赖 state
              const currentActiveService = clickedIPadServiceRef.current
              const isIPadMode = isMounted && (isIPad || (typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth <= 1024))
              
              if (!isIPadMode || !currentActiveService || typeof window === 'undefined' || typeof document === 'undefined') {
                return null
              }
              
              const activeService = services.find(s => s.title === currentActiveService)
              if (!activeService) return null
              
              const popupContent = (
                <div
                  key={`ipad-popup-${activeService.title}`}
                  className="fixed w-[340px] max-w-[90vw] z-[100]"
                  style={{
                    // 使用固定的视口中心位置
                    left: '50%',
                    top: '50%',
                    marginTop: '160px', // 从视口中心向下偏移 160px
                    transform: 'translateX(-50%) translateY(0) translateZ(0)', // 使用 translateZ(0) 启用硬件加速
                    position: 'fixed', // 明确指定fixed定位
                    marginLeft: 0,
                    marginRight: 0,
                    padding: 0,
                    // 使用transform3d启用硬件加速，避免滚动时位置跳动
                    transformOrigin: 'center center',
                    // 使用will-change优化性能
                    willChange: 'transform',
                    // 确保弹窗不会因为滚动而重新定位
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    // 确保弹窗不受父容器 transform 影响
                    isolation: 'isolate',
                    // 强制使用视口定位，不受任何父容器影响
                    contain: 'layout style paint',
                  }}
                >
                    <Link href={activeService.link} className="block pointer-events-auto h-full">
                      <div
                        className="rounded-xl p-5 bg-gradient-to-br from-gray-50 to-white shadow-2xl border-l-4 cursor-pointer hover:shadow-3xl transition-shadow duration-300 h-full flex flex-col"
                        style={{ borderLeftColor: activeService.color, minHeight: '280px' }}
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
                          <p className="text-gray-700 mb-4 leading-relaxed text-base font-medium flex-shrink-0">{activeService.description}</p>
                          <ul className="space-y-2 flex-1">
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
                )
                // 使用 Portal 将弹窗渲染到 body，避免受父容器 transform 影响
                return createPortal(popupContent, document.body)
              })()
            }
            {shouldRenderPieChart ? (
              <svg 
                width="800" 
                height="800" 
                viewBox="0 0 800 800" 
                className="transform rotate-0 drop-shadow-2xl" 
                style={{ 
                  willChange: isMounted && isIPad && clickedIPadServiceRef.current ? 'transform' : 'auto',
                  // 直接使用 ref，确保滚动时 transform 不会重置
                  transform: isMounted && isIPad && clickedIPadServiceRef.current
                    ? 'scale(0.65) translateY(-80px) translateZ(0)' 
                    : 'scale(1) translateY(0) translateZ(0)',
                  transition: 'transform 0.3s ease-out',
                  // 确保 transform 在滚动时不会被重置
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
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
                const isHovered = hoveredService === service.title
                const scale = isHovered ? 1.08 : 1
                
                // 检测是否为iPad或触摸设备
                const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
                // 使用ref来检查，确保即使state被清空也能正确判断
                const shouldShowPopup = isMounted && (isIPad || (typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth <= 1024))
                
                return (
                  <g key={service.title} className="pie-segment-group">
                    {shouldShowPopup && shouldRenderPieChart ? (
                      // iPad上不使用Link，直接渲染path，点击只显示弹窗 - 只有在饼图加载完成后才可点击
                      <path
                        d={pieData.path}
                        fill={service.color}
                        stroke="white"
                        strokeWidth="5"
                        className="transition-all duration-300 cursor-pointer"
                        style={{ 
                          filter: isHovered ? 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.25)) brightness(1.15)' : 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))',
                          transformOrigin: '400px 400px',
                          transform: `scale(${scale})`,
                          transition: 'filter 0.2s ease, transform 0.2s ease',
                        }}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          // 如果点击的是当前已选中的，则关闭；否则选中新的
                          const currentService = clickedIPadServiceRef.current
                          const newService = currentService === service.title ? null : service.title
                          // 先设置 ref，确保状态立即生效
                          clickedIPadServiceRef.current = newService
                          // 然后设置 state，触发重新渲染
                          setClickedIPadService(newService)
                          setHoveredService(newService)
                          // 强制触发一次重新渲染，确保状态同步
                          if (newService) {
                            // 使用 requestAnimationFrame 确保状态更新
                            requestAnimationFrame(() => {
                              if (clickedIPadServiceRef.current !== newService) {
                                clickedIPadServiceRef.current = newService
                                setClickedIPadService(newService)
                              }
                            })
                          }
                        }}
                      />
                    ) : shouldRenderPieChart ? (
                      // 桌面端使用Link，可以跳转 - 只有在饼图加载完成后才可点击
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
                            transformOrigin: '400px 400px',
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
              <div className="w-full h-full flex items-center justify-center" style={{ minHeight: '800px' }}>
                <div className="w-16 h-16 border-4 border-navy-200 border-t-navy-600 rounded-full animate-spin"></div>
              </div>
            )}
          </div>
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

