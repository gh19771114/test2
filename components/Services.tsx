'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useMemo, useState } from 'react'
import { Building2, ClipboardCheck, Globe2, TrendingUp, Rocket } from 'lucide-react'
import Link from 'next/link'

const Services = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [hoveredService, setHoveredService] = useState<string | null>(null)

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
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-0"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-white mb-2"
          >
            主要业务
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-200 max-w-2xl mx-auto"
          >
            从选房买卖到资产运营，再到企业落地，我们以一站式服务陪伴您在日本的每一步投资与发展。
          </motion.p>
        </motion.div>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="flex flex-col items-center gap-12 relative"
        >
          {/* 业务说明列表 - 从饼图后方滑出 */}
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

          {/* 圆盘图表 - 放大并突出 */}
          <motion.div
            variants={itemVariants}
            className="relative"
            style={{ zIndex: 20 }}
          >
            <svg width="800" height="800" viewBox="0 0 800 800" className="transform rotate-0 drop-shadow-2xl">
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
                
                return (
                  <g key={service.title} className="pie-segment-group">
                    <Link href={service.link}>
                      <path
                        d={pieData.path}
                        fill={service.color}
                        stroke="white"
                        strokeWidth="5"
                        className="transition-all duration-300 cursor-pointer"
                        style={{ 
                          filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))',
                          transformOrigin: '400px 400px',
                          transform: `scale(${scale})`,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.filter = 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.25)) brightness(1.15)'
                          setHoveredService(service.title)
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.filter = 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))'
                          setHoveredService(null)
                        }}
                      />
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
                    </Link>
                  </g>
                )
              })}
            </svg>
          </motion.div>
        </motion.div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-0"
        >
          <a
            href="#contact"
            className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2 hover:scale-105 transform transition-all duration-200"
          >
            联系我们预约咨询
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default Services

