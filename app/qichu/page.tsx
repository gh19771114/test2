'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import Link from 'next/link'
import { Building2, Users, Briefcase, Landmark, Globe, Calendar, Store, Palette, Monitor, Sparkles, Megaphone, Target, FileCheck, LifeBuoy } from 'lucide-react'
import { motion, Variants } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'
import { caseImages, caseDates } from '@/lib/casesData'

const relatedServices = [
  {
    name: '商业地产租赁',
    desc: '提供东京周边地区商铺、写字楼、工厂、仓库等各种商业地产的租赁服务。',
    icon: Store,
  },
  {
    name: '室内软装',
    desc: '根据品牌定位提供室内软装设计、陈设与执行，打造统一的空间体验。',
    icon: Palette,
  },
  {
    name: '办公设备采购及设置',
    desc: '整合IT设备、办公家具等采购渠道，负责配送、安装与调试。',
    icon: Monitor,
  },
  {
    name: '企业相关活动承办',
    desc: '开业典礼、展会设置等商务活动的策划与现场执行支持。',
    icon: Sparkles,
  },
  {
    name: '广告宣传策划',
    desc: '整合线上线下媒体资源，制定品牌本地化宣传与推广方案。',
    icon: Megaphone,
  },
]

// 合作伙伴数据将在组件内从多语言文件读取

const partnerIcons = [Building2, Users, Briefcase, Globe, Landmark]

// 定义类型
type Partner = {
  name: string
  desc: string
  icon: string | null
  wide?: boolean
  link?: string
}

type PartnerIcon = typeof Building2 | typeof Users | typeof Briefcase | typeof Globe | typeof Landmark

type Project = {
  title: string
  result: string
}

type ProjectData = {
  id: string
  date: string
  image: string
}

// 合作伙伴网络组件（带动画）
function PartnersNetwork({ partners, partnerIcons, containerRef }: { partners: Partner[], partnerIcons: PartnerIcon[], containerRef: React.RefObject<HTMLDivElement> }) {
  const ref = useRef<HTMLDivElement>(null)
  const networkContainerRef = useRef<HTMLDivElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [networkScale, setNetworkScale] = useState(0)

  // 桌面版参数：相对于绿框居中，确保内容不溢出
  // 绿框高度是855px（缩小5%），留出上下各17px边距，实际可用高度821px
  const redBoxHeight = '821px' // 固定高度，确保不溢出绿框（缩小5%，864 * 0.95）
  const blueBoxHeight = '821px' // 固定高度，确保不溢出绿框（缩小5%，864 * 0.95）

  // 桌面版：计算缩放比例，使内容充满容器
  useEffect(() => {
    if (typeof window === 'undefined') {
      setNetworkScale(1)
      return
    }

    const calculateScales = () => {
      // 计算网络图缩放比例（地图缩放已移除，因为红框已删除）
      if (networkContainerRef.current) {
        const networkContainerRect = networkContainerRef.current.getBoundingClientRect()
        const networkContainerWidth = networkContainerRect.width
        const networkContainerHeight = networkContainerRect.height

        // 网络图原始尺寸：1800 x 1200
        const networkOriginalWidth = 1800
        const networkOriginalHeight = 1200

        // 计算缩放比例，确保网络图完全显示在容器内（保持宽高比）
        const scaleX = networkContainerWidth / networkOriginalWidth
        const scaleY = networkContainerHeight / networkOriginalHeight
        const networkScaleValue = Math.min(scaleX, scaleY, 1) // 取较小值，但不超过1，防止过度放大

        setNetworkScale(networkScaleValue > 0 ? networkScaleValue : 0.5) // 如果计算值为0，使用默认值0.5
      }
    }

    // 立即计算一次
    calculateScales()

    // 使用requestAnimationFrame确保在下一帧计算，避免闪烁
    const rafId = requestAnimationFrame(() => {
      calculateScales()
    })

    window.addEventListener('resize', calculateScales)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', calculateScales)
    }
  }, [])

  // 客户端挂载后检查sessionStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    setIsMounted(true)
    try {
      const animated = sessionStorage.getItem('partners-network-animated') === 'true'
      if (animated) {
        setHasAnimated(true)
      }
    } catch (error) {
      // 忽略sessionStorage错误（某些浏览器或隐私模式下可能不可用）
      console.warn('sessionStorage not available:', error)
    }
  }, [])

  // 如果已经播放过，不等待isInView，直接显示
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // 监听sessionStorage变化（当其他实例播放动画时）
  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return

    const checkAnimated = () => {
      try {
        const animated = sessionStorage.getItem('partners-network-animated') === 'true'
        if (animated && !hasAnimated) {
          setHasAnimated(true)
        }
      } catch (error) {
        // 忽略sessionStorage错误
        console.warn('sessionStorage not available:', error)
      }
    }

    // 定期检查（因为storage事件只在不同标签页间触发）
    const interval = setInterval(checkAnimated, 100)

    return () => {
      clearInterval(interval)
    }
  }, [hasAnimated, isMounted])

  // 当动画触发时，记录到sessionStorage
  useEffect(() => {
    if (isInView && !hasAnimated && isMounted && typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('partners-network-animated', 'true')
        setHasAnimated(true)
      } catch (error) {
        // 忽略sessionStorage错误
        console.warn('sessionStorage not available:', error)
        setHasAnimated(true) // 即使无法保存，也设置状态
      }
    }
  }, [isInView, hasAnimated, isMounted])

  // 确保内容始终显示：默认显示，动画只是增强效果
  // 如果已经播放过动画，直接显示；否则等待isInView；如果已挂载，也显示
  const shouldAnimate = true // 始终显示内容，动画只是视觉效果
  // 使用固定宽度，确保中心点位置一致
  const containerWidth = 1800
  const containerHeight = 1026 // 缩小5%（1080 * 0.95）
  // 地图容器高度（缩小为一半）
  // 蓝框的显示尺寸（和黄框相同的缩放逻辑）
  const blueBoxWidth = containerWidth - 400 // 1400px
  const blueBoxDisplayHeight = containerHeight - 200 // 1000px
  // 蓝框内容缩放比例
  const blueBoxScale = Math.min(blueBoxWidth / containerWidth, blueBoxDisplayHeight / containerHeight)
  // 黄框的显示尺寸
  const yellowBoxWidth = containerWidth - 400 // 1400px
  const yellowBoxHeight = containerHeight - 200 // 1000px
  // 黄框内容缩放比例：内容基于原始尺寸(1800x1200)设计，缩放到黄框尺寸
  const yellowBoxScale = Math.min(yellowBoxWidth / containerWidth, yellowBoxHeight / containerHeight)
  // 内容基于原始尺寸定位（1800x1200）
  const centerX = containerWidth / 2 // 900px（基于1800px原始尺寸）
  const centerY = containerHeight / 2 // 600px（基于1200px原始尺寸）
  // 卡片尺寸
  const cardWidth = 240
  const cardHeight = 150
  // 计算安全半径：确保卡片不会超出容器
  // 卡片中心到边缘的距离 = 卡片对角线的一半 + 一些边距
  // 考虑最宽的卡片（放大后360px）和高度（放大后170px）
  const maxCardWidth = 360 // 放大后的最大宽度
  const maxCardHeight = 170 // 放大后的高度
  const cardDiagonal = Math.sqrt(maxCardWidth * maxCardWidth + maxCardHeight * maxCardHeight) / 2
  // 基于原始尺寸计算最大半径，卡片边缘贴近容器边缘
  const maxRadius = Math.min(
    (containerWidth / 2) - cardDiagonal,
    (containerHeight / 2) - cardDiagonal
  )
  // 使用最大半径，让卡片尽量靠近边缘
  const baseRadius = maxRadius + 100

  // 如果baseRadius小于requiredRadius，说明容器空间不足，需要减少卡片尺寸或增加间距
  // 这里我们通过CSS的margin来增加实际间距

  // 优化角度分布：9个合作伙伴，均匀分布在360度
  // 调整角度避免遮挡：日本大型保险公司（索引8，320度）和日本大型金融机构（索引0，0度）在圆形上接近
  const angleOffsets: number[] = []
  for (let i = 0; i < partners.length; i++) {
    let angle = (i * 360) / partners.length
    // 调整日本大型保险公司的角度，让它离顶部更远，避免与日本大型金融机构重叠
    if (i === 8) { // 日本大型保险公司，原本320度（接近顶部0度）
      angle = 310 // 调整到310度，离顶部更远
    }
    angleOffsets.push(angle)
  }

  const containerVariants = {
    hidden: { opacity: 1 }, // 改为1，确保始终可见
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 0.3,
      transition: {
        duration: 1,
        ease: 'easeOut',
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.5, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  }

  const centerVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
      },
    },
  }

  return null // PartnersNetwork 函数不再返回内容，内容直接在 section#partners 中渲染
}

// 将蓝框、黄框的内容提取为独立组件，在 section#partners 中使用（红框已删除）
function PartnersNetworkContent({
  networkContainerRef,
  ref,
  shouldAnimate,
  containerVariants,
  containerWidth,
  containerHeight,
  networkScale,
  redBoxHeight,
  blueBoxHeight,
  blueBoxScale,
  yellowBoxScale,
  partners,
  partnerIcons,
  angleOffsets,
  centerX,
  centerY,
  baseRadius,
  cardWidth,
  cardHeight,
  lineVariants,
  centerVariants,
  cardVariants
}: {
  networkContainerRef: React.RefObject<HTMLDivElement>
  ref: React.RefObject<HTMLDivElement>
  shouldAnimate: boolean
  containerVariants: Variants
  containerWidth: number
  containerHeight: number
  networkScale: number
  redBoxHeight: string
  blueBoxHeight: string
  blueBoxScale: number
  yellowBoxScale: number
  partners: Partner[]
  partnerIcons: PartnerIcon[]
  angleOffsets: number[]
  centerX: number
  centerY: number
  baseRadius: number
  cardWidth: number
  cardHeight: number
  lineVariants: Variants
  centerVariants: Variants
  cardVariants: Variants
}) {
  return (
    <>
      {/* 黑白世界地图背景 - 白框，直接相对于绿框定位 */}
      <div
        className="white-box-container"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          width: 'calc(100% - 40px)',
          height: redBoxHeight,
          zIndex: 3,
            opacity: 0.15,
            filter: 'grayscale(100%) brightness(0.8)',
          pointerEvents: 'auto',
          boxSizing: 'border-box',
          cursor: 'pointer',
          }}
        >
          <img
            src="/imgs/worldmap.svg"
            alt="世界地图"
            style={{
              width: '100%',
              height: '100%',
            objectFit: 'fill',
              display: 'block'
            }}
          />
      </div>

      {/* 网络图内容容器 - 黄框，直接相对于绿框定位 */}
      <motion.div
        ref={ref}
        initial="visible"
        animate={shouldAnimate ? 'visible' : 'visible'}
        variants={containerVariants}
        style={{
          width: `${containerWidth}px`,
          height: `${containerHeight}px`,
          position: 'absolute', // 相对于绿框定位
          left: '50%', // 相对于绿框水平居中
          top: '50%', // 相对于绿框垂直居中
          margin: '0', // 移除margin，使用transform居中
          transform: `translate(-50%, -50%) scale(${yellowBoxScale})`, // 居中并缩放到黄框尺寸
          transformOrigin: 'center center',
          zIndex: 2, // 确保在蓝框之上
          pointerEvents: 'auto', // 允许交互
          overflow: 'hidden', // 防止内容溢出
        } as React.CSSProperties}
      >
        {/* 动画连接线 */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 1 }}
          width={containerWidth}
          height={containerHeight}
        >
          {partners.map((_: Partner, index: number) => {
            // 从顶部（-90度）开始，顺时针分布
            const angleDeg = angleOffsets[index] - 90
            const radians = angleDeg * (Math.PI / 180)
            // 使用与卡片相同的半径计算逻辑
            const partner = partners[index]
            let lineRadius = baseRadius
            // 使用索引判断，而不是名称，以支持多语言
            if (index === 0 || index === 6 || index === 7) { // 日本大型金融机构、大型保证公司、日本大型装修公司
              lineRadius = baseRadius * 0.85
            } else if (index === 8) { // 日本大型保险公司
              lineRadius = baseRadius * 0.92
            }
            const x = Math.round((centerX + lineRadius * Math.cos(radians)) * 100) / 100
            const y = Math.round((centerY + lineRadius * Math.sin(radians)) * 100) / 100

            return (
              <motion.line
                key={index}
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="6,4"
                variants={lineVariants}
              />
            )
          })}
        </svg>


        {/* 中心公司 - 带动画 */}
        <motion.div
          className="absolute"
          style={{
            left: `${centerX}px`,
            top: `${centerY}px`,
            width: '288px',
            height: '288px',
            marginLeft: '-144px',
            marginTop: '-144px',
            zIndex: 10,
            boxSizing: 'border-box',
            pointerEvents: 'auto'
          }}
          variants={centerVariants}
        >
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-full w-72 h-72 flex items-center justify-center shadow-2xl border-4 border-white hover:scale-110 transition-transform duration-300">
            <div className="text-center text-white">
              <div className="text-4xl font-bold mb-1">Bourn</div>
              <div className="text-4xl font-bold">Mark</div>
            </div>
          </div>
        </motion.div>

        {/* 合作伙伴卡片 - 带动画 */}
        {partners.map((partner: Partner, index: number) => {
          const Icon = partnerIcons[index % partnerIcons.length]
          // 从顶部（-90度）开始，顺时针分布
          const angleDeg = angleOffsets[index] - 90
          const radians = angleDeg * (Math.PI / 180)

          // 为特定合作伙伴设置特殊半径，让它们更靠近中心
          // 使用索引判断，而不是名称，以支持多语言
          let finalRadius = baseRadius
          if (index === 0 || index === 6 || index === 7) { // 日本大型金融机构、大型保证公司、日本大型装修公司
            // 这些卡片较小，可以更靠近中心
            finalRadius = baseRadius * 0.85
          } else if (index === 8) { // 日本大型保险公司
            // 日本大型保险公司使用稍大的半径，避免遮挡日本大型金融机构
            finalRadius = baseRadius * 0.92
          }

          let x = Math.round((centerX + finalRadius * Math.cos(radians)) * 100) / 100
          let y = Math.round((centerY + finalRadius * Math.sin(radians)) * 100) / 100

          // 为特定合作伙伴添加位置偏移（使用索引）
          if (index === 1) { // 在日中国企业协会
            x += 100 // 向右移动100px
            x += 20 // 再向右移动20px
          } else if (index === 8) { // 日本大型保险公司
            x -= 40 // 向左移动40px（从50px改为40px，向右移动了10px）
            y -= 30 // 向上移动30px
          } else if (index === 0) { // 日本大型金融机构
            y -= 10 // 向上移动10px
            x += 30 // 向右移动30px
          } else if (index === 6) { // 大型保证公司
            y -= 10 // 向上移动10px
            x -= 20 // 向左移动20px
          } else if (index === 7) { // 日本大型装修公司
            x -= 20 // 向左移动20px
          } else if (index === 4) { // Jetro 日本贸易振兴协会
            y += 20 // 向下移动20px
            x += 60 // 向右移动60px
          } else if (index === 3) { // 综合法律与会计事务所
            y -= 20 // 向上移动20px
          }

          // 为特定合作伙伴设置特殊宽度和拉宽方向（使用索引）
          let finalCardWidth = cardWidth
          let cardOffsetX = 0

          if (index === 2) { // 全日本中国企业协会联合会
            // 向左拉宽20px（从350px改为370px，但向左拉宽意味着左边扩展20px）
            finalCardWidth = 320 + 50 // 原320px + 50px = 370px（30px向右 + 20px向左，实际总宽度增加50px）
            cardOffsetX = (finalCardWidth - cardWidth) / 2 - 20 // 向左偏移20px，实现向左拉宽
          } else if (index === 4) { // Jetro 日本贸易振兴协会
            // 向右拉宽40px
            finalCardWidth = 320 + 40 // 320px + 40px = 360px
            cardOffsetX = (finalCardWidth - cardWidth) / 2 // 向右偏移，保持中心点不变，向右拉宽40px
          } else if (index === 3) { // 综合法律与会计事务所
            // 向左拉宽20px
            finalCardWidth = 320 + 20 // 320px + 20px = 340px
            cardOffsetX = (finalCardWidth - cardWidth) / 2 - 20 // 向左偏移20px，实现向左拉宽
          } else if (index === 8) { // 日本大型保险公司
            // 向左拉宽50px（30px + 20px，宽度增加50px，左边扩展50px），然后向左移动20px
            finalCardWidth = cardWidth + 50 // 240 + 50 = 290px
            cardOffsetX = -70 // 向左偏移70px（-50拉宽 + -20移动）
          } else if (index === 7) { // 日本大型装修公司
            // 向左拉宽50px（30px + 20px，宽度增加50px，左边扩展50px）
            finalCardWidth = cardWidth + 50 // 240 + 50 = 290px
            cardOffsetX = -50 // 向左偏移50px，实现向左拉宽（再向左拉宽20px）
          } else if (index === 0) { // 日本大型金融机构
            // 向左拉宽10px，向右拉宽100px（60px + 40px，总宽度增加110px，左边扩展10px，右边扩展100px），然后向左移动40px，再向右移动30px
            finalCardWidth = cardWidth + 110 // 240 + 110 = 350px
            cardOffsetX = -10 // 向左移动10px（从-40变成-10，向右移动了30px）
          } else if (index === 6) { // 大型保证公司
            // 向左拉宽40px，向左移动20px，然后向右拉宽20px
            finalCardWidth = cardWidth + 60 // 240 + 60 = 300px（40px向左 + 20px向右）
            cardOffsetX = -60 // 向左偏移60px（-40拉宽 + -20移动），向右拉宽20px
          } else if (index === 1) { // 在日中国企业协会
            // 向右拉宽90px（30px + 30px + 30px，宽度增加90px，右边扩展90px）
            finalCardWidth = cardWidth + 90 // 240 + 90 = 330px
            cardOffsetX = 30 // 向右偏移30px，实现向右拉宽（再向右拉宽30px）
          } else if (index === 5) { // 苏州工业园区
            // 向左拉宽80px（30px + 50px，宽度增加80px，左边扩展80px）
            finalCardWidth = cardWidth + 80 // 240 + 80 = 320px
            cardOffsetX = -80 // 向左偏移80px，实现向左拉宽（再向左拉宽50px）
          }

          const cardContent = (
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white rounded-xl p-5 shadow-lg border-2 border-gray-100 cursor-pointer"
              style={{
                width: `${finalCardWidth}px`,
                minHeight: `${cardHeight}px`
              }}
            >
              <div className="flex items-start gap-3 mb-3">
                <motion.div
                  className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                >
                  {Icon ? <Icon className="w-6 h-6 text-green-600" /> : <Globe className="w-6 h-6 text-green-600" />}
                </motion.div>
                <h3 className="font-semibold text-navy-900 leading-tight flex-1" style={{ fontSize: '22px' }}>{partner.name}</h3>
              </div>
              <p className="text-gray-700 leading-relaxed" style={{ fontSize: '18px' }}>{partner.desc}</p>
            </motion.div>
          )

          return (
            <motion.div
              key={partner.name}
              className="absolute"
              style={{
                left: `${x + cardOffsetX}px`,
                top: `${y}px`,
                transform: 'translate(-50%, -50%)',
                zIndex: 2,
                pointerEvents: 'auto'
              }}
            >
              {partner.link ? (
                <a
                  href={partner.link}
                  className="block focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded-xl"
                >
                  {cardContent}
                </a>
              ) : (
                cardContent
              )}
            </motion.div>
          )
        })}
        {/* 黄框中心点 - 标记黄框的实际中心位置 */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '12px',
            height: '12px',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            backgroundColor: 'yellow',
            border: '2px solid white',
            zIndex: 1001,
            pointerEvents: 'none',
            boxSizing: 'border-box'
          }}
        />
      </motion.div>
    </>
  )
}

// projects 和 comingSoonProjects 将在组件内从多语言文件读取

export default function QiChuPage() {
  const { t } = useLanguage()
  const [showMobilePortrait, setShowMobilePortrait] = useState(false)
  const [showIpadPortrait, setShowIpadPortrait] = useState(false)
  const [showIpadProPortrait, setShowIpadProPortrait] = useState(false)
  const [showIpadLandscape, setShowIpadLandscape] = useState(false)
  const [showMobileLandscape, setShowMobileLandscape] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isNetworkExpanded, setIsNetworkExpanded] = useState(false) // 手机竖版网络图放大状态
  const [ipadPortraitScale, setIpadPortraitScale] = useState(0.75) // iPad竖版缩放比例（固定值，不随横竖屏切换改变）
  const [yellowBoxScale, setYellowBoxScale] = useState(0.78) // 黄框内容缩放比例（固定值，不随横竖屏切换改变）
  const [renderKey, setRenderKey] = useState(0) // 强制重新渲染的key
  const ipadPortraitScaleInitializedRef = useRef(false) // 标记 iPad 竖版缩放比例是否已初始化
  const yellowBoxScaleInitializedRef = useRef(false) // 标记黄框缩放比例是否已初始化
  const ipadPortraitScaleCalculatedInPortraitRef = useRef(false) // 标记是否在竖版时计算过 ipadPortraitScale
  const [isInitialized, setIsInitialized] = useState(false) // 标记是否已初始化
  
  // 从多语言文件读取合作伙伴数据
  const partners = useMemo(() => {
    type PartnerFromLocale = {
      name: string
      desc: string
      icon?: string | null
      wide?: boolean
      link?: string
    }
    const partnersList = t('qichu.partners.list', { returnObjects: true }) as PartnerFromLocale[]
    return partnersList.map((p: PartnerFromLocale) => ({
      name: p.name,
      desc: p.desc,
      icon: null,
      wide: p.wide || false,
      link: p.link || undefined
    }))
  }, [t])
  
  // 从多语言文件读取项目数据
  const projects = useMemo((): Project[] => {
    return [
      {
        title: t('qichu.cases.project1.title'),
        result: t('qichu.cases.project1.result'),
      },
    ]
  }, [t])
  
  const comingSoonProjects = useMemo(() => {
    return [
      { title: t('qichu.cases.comingSoon1.title'), result: t('qichu.cases.comingSoon1.result') },
      { title: t('qichu.cases.comingSoon2.title'), result: t('qichu.cases.comingSoon2.result') },
      { title: t('qichu.cases.comingSoon3.title'), result: t('qichu.cases.comingSoon3.result') },
    ]
  }, [t])
  
  // 从 sessionStorage 恢复放大状态
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('network-expanded')
      if (saved === 'true') {
        setIsNetworkExpanded(true)
      }
    }
  }, [])

  // --- Partners infographic (fixed canvas + scale, NO clipping/overlap) ---
  const PARTNERS_BASE_W = 1800
  const PARTNERS_BASE_H = 1200
  const PARTNERS_EXTRA_BOTTOM = 260 // 给底部卡片/阴影留余量，避免压到下一个区块

  const partnersStageRef = useRef<HTMLDivElement>(null)
  const [partnersScale, setPartnersScale] = useState(1)

  // containerRef 定义在 QiChuPage 中，直接相对于绿框定位
  const containerRef = useRef<HTMLDivElement>(null)
  const whiteBoxRef = useRef<HTMLDivElement>(null) // 白框（地图背景）的引用
  const networkContainerRef = useRef<HTMLDivElement>(null)
  const networkContentRef = useRef(null)
  const ref = useRef<HTMLDivElement>(null)

  // 网络图相关变量（缩小5%）
  const shouldAnimate = true
  const containerWidth = 1800
  const containerHeight = 1026 // 缩小5%（1080 * 0.95）
  // 蓝框的显示尺寸
  const blueBoxWidth = containerWidth - 400 // 1400px
  const blueBoxDisplayHeight = containerHeight - 200 // 1000px
  // 蓝框内容缩放比例
  const blueBoxScale = Math.min(blueBoxWidth / containerWidth, blueBoxDisplayHeight / containerHeight)
  // 黄框的显示尺寸（这些值在横竖屏切换时会通过状态更新）
  // yellowBoxScale 现在是状态变量，会在 checkViewport 中动态更新
  // 内容基于原始尺寸定位（1800x1200）
  const centerX = containerWidth / 2 // 900px
  const centerY = containerHeight / 2 // 600px
  const cardWidth = 240
  const cardHeight = 150
  const maxCardWidth = 360
  const maxCardHeight = 170
  const cardDiagonal = Math.sqrt(maxCardWidth * maxCardWidth + maxCardHeight * maxCardHeight) / 2
  // 基于原始尺寸计算最大半径
  const maxRadius = Math.min(
    (containerWidth / 2) - cardDiagonal,
    (containerHeight / 2) - cardDiagonal
  )
  // 使用最大半径，让卡片尽量靠近边缘
  const baseRadius = maxRadius + 100

  const angleOffsets: number[] = []
  for (let i = 0; i < partners.length; i++) {
    let angle = (i * 360) / partners.length
    if (i === 8) {
      angle = 310
    }
    angleOffsets.push(angle)
  }

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 0.3,
      transition: {
        duration: 1,
        ease: 'easeOut',
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.5, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  }

  const centerVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
      },
    },
  }

  // 桌面版参数（缩小5%）
  const redBoxHeight = '821px' // 缩小5%（864 * 0.95）
  const blueBoxHeight = '821px' // 缩小5%（864 * 0.95）
  const [networkScale, setNetworkScale] = useState(0)

  // 桌面版：计算缩放比例，使内容充满容器
  useEffect(() => {
    if (typeof window === 'undefined') {
      setNetworkScale(1)
      return
    }

    const calculateScales = () => {
      // 计算网络图缩放比例（地图缩放已移除，因为红框已删除）
      if (networkContainerRef.current) {
        const networkContainerRect = networkContainerRef.current.getBoundingClientRect()
        const networkContainerWidth = networkContainerRect.width
        const networkContainerHeight = networkContainerRect.height

        // 网络图原始尺寸：1800 x 1200
        const networkOriginalWidth = 1800
        const networkOriginalHeight = 1200

        // 计算缩放比例，确保网络图完全显示在容器内（保持宽高比）
        const scaleX = networkContainerWidth / networkOriginalWidth
        const scaleY = networkContainerHeight / networkOriginalHeight
        const networkScaleValue = Math.min(scaleX, scaleY, 1) // 取较小值，但不超过1，防止过度放大

        setNetworkScale(networkScaleValue > 0 ? networkScaleValue : 0.5) // 如果计算值为0，使用默认值0.5
      }
    }

    // 立即计算一次
    calculateScales()

    // 使用requestAnimationFrame确保在下一帧计算，避免闪烁
    const rafId = requestAnimationFrame(() => {
      calculateScales()
    })

    window.addEventListener('resize', calculateScales)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', calculateScales)
    }
  }, [])

  useEffect(() => {
    const el = partnersStageRef.current
    if (!el || typeof window === 'undefined') return

    const compute = () => {
      const w = el.getBoundingClientRect().width
      const usableW = Math.max(320, w - 24) // 左右留点空隙
      const s = usableW / PARTNERS_BASE_W
      // 不超过 1（设计稿尺寸），也不让它变成 0
      setPartnersScale(Math.min(1, Math.max(0.18, s)))
    }

    compute()
    const ro = new ResizeObserver(() => compute())
    ro.observe(el)

    return () => ro.disconnect()
  }, [])

  const partnersScaledW = PARTNERS_BASE_W * partnersScale
  const partnersScaledH = (PARTNERS_BASE_H + PARTNERS_EXTRA_BOTTOM) * partnersScale

  useEffect(() => {
    // 确保只在客户端执行
    if (typeof window === 'undefined') return

    const checkViewport = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const isPortrait = height > width

      // 手机竖版：宽度 ≤767 且竖屏（与CSS媒体查询匹配）
      const mobilePortrait = width <= 767 && isPortrait
      setShowMobilePortrait(mobilePortrait)

      // iPad竖版：宽度 768–1023 且竖屏（与CSS媒体查询匹配）
      const ipadPortrait = width >= 768 && width <= 1023 && isPortrait
      setShowIpadPortrait(ipadPortrait)

      // 计算iPad竖版的缩放比例，确保网络图完整显示
      // 如果当前是 iPad 竖版，且 ipadPortraitScale 还没有根据竖版视口计算过，则计算
      if (ipadPortrait) {
        if (!ipadPortraitScaleInitializedRef.current) {
          // 网络图原始尺寸
          const networkOriginalWidth = 1800
          const networkOriginalHeight = 1026
          // 可用宽度（减去padding，约40px）
          const availableWidth = width - 40
          // 可用高度（容器高度1000px，减去标题等，约200px）
          const availableHeight = 800
          // 计算缩放比例，取较小值确保完整显示
          const scaleX = availableWidth / networkOriginalWidth
          const scaleY = availableHeight / networkOriginalHeight
          const scale = Math.min(scaleX, scaleY, 0.8) // 最大不超过0.8，避免过大
          // 只在首次计算时设置，之后保持不变
          setIpadPortraitScale(Math.max(scale, 0.75))
          ipadPortraitScaleInitializedRef.current = true
          ipadPortraitScaleCalculatedInPortraitRef.current = true // 标记已在竖版时计算过
        }
        // 如果已经初始化过（在横屏时），但还没有在竖版时计算过，则重新计算
        // 确保竖版时使用正确的缩放值，而不是横屏时的默认值
        else if (!ipadPortraitScaleCalculatedInPortraitRef.current) {
          const networkOriginalWidth = 1800
          const networkOriginalHeight = 1026
          const availableWidth = width - 40
          const availableHeight = 800
          const scaleX = availableWidth / networkOriginalWidth
          const scaleY = availableHeight / networkOriginalHeight
          const scale = Math.min(scaleX, scaleY, 0.8)
          setIpadPortraitScale(Math.max(scale, 0.75))
          ipadPortraitScaleCalculatedInPortraitRef.current = true // 标记已在竖版时计算过
        }
      }
      // 注意：不在 else 中重置 ipadPortraitScale，保持当前值，避免横竖屏切换时变小

      // iPad Pro竖版：宽度 1024–1279 且竖屏（iPad Pro 12.9"竖版）
      const ipadProPortrait = width >= 1024 && width <= 1279 && isPortrait
      setShowIpadProPortrait(ipadProPortrait)

      // iPad横版：width >= 1024 && width <= 1369 && !isPortrait（与CSS媒体查询匹配）
      const ipadLandscape = width >= 1024 && width <= 1369 && !isPortrait
      setShowIpadLandscape(ipadLandscape)

      // 手机横版：width <= 1023 && !isPortrait（与CSS媒体查询匹配）
      const mobileLandscape = width <= 1023 && !isPortrait
      setShowMobileLandscape(mobileLandscape)

      // 桌面版：仅宽度 > 1369（排除所有iPad横版）
      const desktop = width > 1369 && !ipadLandscape
      setIsDesktop(desktop)
      
      // 只在首次初始化时计算黄框缩放比例，之后保持不变，避免横竖屏切换时大小变化
      if (!yellowBoxScaleInitializedRef.current) {
        const containerWidth = 1800
        const containerHeight = 1026
        const yellowBoxWidth = containerWidth - 400 // 1400px
        const yellowBoxHeight = containerHeight - 200 // 1000px
        const newYellowBoxScale = Math.min(yellowBoxWidth / containerWidth, yellowBoxHeight / containerHeight)
        setYellowBoxScale(newYellowBoxScale)
        yellowBoxScaleInitializedRef.current = true
      }
      
      // 如果 ipadPortraitScale 还没有初始化，且当前不是 iPad 竖版，也初始化一个默认值
      // 这样横竖屏切换时可以使用相同的缩放值，避免变小
      if (!ipadPortraitScaleInitializedRef.current && !ipadPortrait) {
        // 使用一个合理的默认值，确保横竖屏切换时大小一致
        // 这个值应该与首次在 iPad 竖版时计算出的值接近
        setIpadPortraitScale(0.75) // 使用初始值
        ipadPortraitScaleInitializedRef.current = true
      }
    }

    const updateMapStyles = () => {
      if (whiteBoxRef.current) {
        // 强制应用地图颜色（防止变白）
        whiteBoxRef.current.style.setProperty('opacity', '0.15', 'important')
        whiteBoxRef.current.style.setProperty('filter', 'grayscale(100%) brightness(0.8)', 'important')
        
        // 检查当前视口状态
        const width = window.innerWidth
        const height = window.innerHeight
        const isPortrait = height > width
        const isMobilePortrait = width <= 767 && isPortrait
        const isExpanded = sessionStorage.getItem('network-expanded') === 'true'
        
        // 确保地图始终在网络图之下（除非手机竖版放大状态）
        if (isMobilePortrait && isExpanded) {
          whiteBoxRef.current.style.setProperty('z-index', '200', 'important')
        } else {
          whiteBoxRef.current.style.setProperty('z-index', '1', 'important')
        }
      }
    }

    // 立即执行一次
    checkViewport()
    // 立即应用地图样式
    setTimeout(updateMapStyles, 50)

    // 延迟执行多次，确保在DOM渲染后
    const timeoutId1 = setTimeout(() => {
      checkViewport()
      updateMapStyles()
    }, 100)
    const timeoutId2 = setTimeout(() => {
      checkViewport()
      updateMapStyles()
    }, 300)
    const timeoutId3 = setTimeout(() => {
      checkViewport()
      updateMapStyles()
    }, 500)

    const handleResize = () => {
      // 防止浏览器自动缩放：确保 viewport 设置正确
      const viewport = document.querySelector('meta[name="viewport"]')
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no')
      }
      
      checkViewport()
      // 使用 requestAnimationFrame 确保在浏览器重绘后应用样式
      requestAnimationFrame(() => {
        setTimeout(updateMapStyles, 50)
      })
    }
    
    const handleOrientationChange = () => {
      // 防止浏览器自动缩放：确保 viewport 设置正确
      const viewport = document.querySelector('meta[name="viewport"]')
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no')
      }
      
      // 立即应用一次样式，防止变白
      updateMapStyles()
      // 延迟一下，等待浏览器完成横竖屏切换
      setTimeout(() => {
        // 多次调用 checkViewport，确保状态正确更新
        checkViewport()
        updateMapStyles()
        setTimeout(() => {
          checkViewport()
          updateMapStyles()
          // 使用 requestAnimationFrame 确保在浏览器重绘后应用样式
          requestAnimationFrame(() => {
              setTimeout(() => {
                checkViewport() // 再次检查，确保状态更新
                updateMapStyles()
                // 再次确保样式应用（双重保障）
                setTimeout(() => {
                  updateMapStyles()
                  checkViewport() // 最后一次检查，确保缩放比例正确
                  updateMapStyles() // 最后一次应用样式
                }, 100)
              }, 50)
          })
        }, 100)
      }, 200)
    }
    
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleOrientationChange)

    return () => {
      clearTimeout(timeoutId1)
      clearTimeout(timeoutId2)
      clearTimeout(timeoutId3)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleOrientationChange)
    }
  }, [])

  return (
    <PageLayout>
      <div className="relative">
        {/* Hero Section with Background Image */}
        <section className="relative pt-28 pb-16 bg-gradient-to-br from-green-800 via-green-700 to-navy-800 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="企业出海"
              fill
              className="object-cover opacity-30"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 to-navy-900/60" style={{ minHeight: '100%' }}></div>
          </div>
          <div className="relative z-10 container-custom px-4 md:px-6 lg:px-8">
            <p className="text-xs md:text-sm text-green-300 font-semibold mb-3 md:mb-4 drop-shadow-md">{t('qichu.subtitle')}</p>
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 md:mb-6 drop-shadow-lg">{t('qichu.title')}</h1>
            <p className="text-sm md:text-base lg:text-lg text-gray-200 max-w-3xl leading-relaxed drop-shadow-md">
              {t('qichu.description')}
            </p>
          </div>
        </section>

        <section id="services" className="section-padding" style={{ position: 'relative', zIndex: 10 }}>
          <div className="container-custom">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">相关服务</h2>
              <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto px-4 md:px-0">
                为企业提供全方位的落地支持服务，从选址到运营，一站式解决方案
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8 relative z-10">
              {relatedServices.map((service) => {
                const Icon = service.icon
                return (
                  <div
                    key={service.name}
                    className="group bg-gradient-to-br from-white to-green-50/50 backdrop-blur-sm border-2 border-green-100 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 md:hover:-translate-y-2 hover:border-green-300 relative z-10"
                    style={{ pointerEvents: 'auto' }}
                  >
                    <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                        <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base md:text-lg font-bold text-navy-700 mb-1 md:mb-2 group-hover:text-green-600 transition-colors">{service.name}</h3>
                        <p className="text-sm md:text-base text-gray-700 leading-relaxed">{service.desc}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* 一站式服务优势 */}
            <div className="bg-gradient-to-br from-navy-900/90 via-green-900/80 to-navy-800/90 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 lg:p-12 border-2 border-green-500/30 shadow-2xl">
              <div className="text-center mb-6 md:mb-8">
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 md:mb-3">一站式企业落地解决方案</h3>
                <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto px-4 md:px-0">
                  整合全链条资源，提供端到端服务支持，助力企业快速建立并优化在日运营体系
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-lg md:rounded-xl p-5 md:p-6 border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-3 md:mb-4 shadow-lg">
                    <Target className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h4 className="text-white font-bold text-base md:text-lg mb-2">战略规划</h4>
                  <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                    基于市场洞察制定进入策略，明确业务定位与资源配置方案
                  </p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg md:rounded-xl p-5 md:p-6 border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-3 md:mb-4 shadow-lg">
                    <FileCheck className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h4 className="text-white font-bold text-base md:text-lg mb-2">合规落地</h4>
                  <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                    协助完成法人设立、税务登记、劳动合规等关键环节，确保合法运营
                  </p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg md:rounded-xl p-5 md:p-6 border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-3 md:mb-4 shadow-lg">
                    <LifeBuoy className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h4 className="text-white font-bold text-base md:text-lg mb-2">运营支持</h4>
                  <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                    提供持续性的本地化运营指导，优化业务流程，提升运营效率
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 合作伙伴网络 - 所有版本都显示网络图 */}
        <section
          id="partners"
          ref={partnersStageRef}
          className={cn(
            "section-padding partners-section desktop-partners-network",
            "relative z-10 w-full overflow-hidden box-border",
            "pt-0 pb-2",
            "h-[600px] min-h-[600px]",
            "tablet:h-[812px] tablet:min-h-[812px]",
            "tablet-lg:h-[1000px] tablet-lg:min-h-[1000px]",
            "desktop:h-[1000px] desktop:min-h-[1000px]"
          )}
          style={{
            // 简化逻辑：清晰的设备分支
            paddingTop: isDesktop || showIpadProPortrait ? '0' : (showIpadPortrait ? '0' : '43px'),
            paddingBottom: '8px',
            // 高度分配：
            // - 桌面版/iPad Pro竖版：1000px（正常显示）
            // - iPad竖版：1000px（与桌面版相同，确保内容正确显示）
            // - 手机竖版：600px
            // - 其他（iPad横版/手机横版）：812px
            minHeight: isDesktop || showIpadProPortrait || showIpadPortrait ? '1000px' : (showMobilePortrait ? '600px' : '812px'),
            height: isDesktop || showIpadProPortrait || showIpadPortrait ? '1000px' : (showMobilePortrait ? '600px' : '812px'),
          }}
        >
          <div className="container-custom" style={{ overflow: 'visible' }}>
            <div className="text-center mb-4">
              <h2 className="text-3xl font-bold text-white mb-4">{t('qichu.partners.title')}</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                {t('qichu.partners.description')}
              </p>
            </div>
          </div>

          {/* 黑白世界地图背景 - 白框，相对于绿框居中 */}
          <div
            key={`map-${renderKey}`}
            ref={whiteBoxRef}
            className="white-box-container hover:scale-110 transition-transform duration-300"
            style={{
              position: 'absolute',
              left: '50%',
              // 所有版本都使用正常居中
              top: '50%',
              width: 'calc(100% - 40px)',
              height: redBoxHeight,
              transform: showMobilePortrait && isNetworkExpanded
                ? 'translate(-50%, -50%) scale(2)'
                : (showIpadPortrait
                  ? `translate(-50%, -50%) scale(${ipadPortraitScale})` // iPad竖版使用固定缩放
                  : (showIpadLandscape || isDesktop
                    ? `translate(-50%, -50%) scale(${yellowBoxScale * 1.2})` // iPad横版和桌面版放大到120%
                    : 'translate(-50%, -50%)')), // 其他版本不缩放
              // 确保地图始终在网络图之下（网络图的 z-index 是 2 或 201）
              zIndex: showMobilePortrait && isNetworkExpanded ? 200 : 1,
              // 确保在所有版本中地图颜色都正确（横竖屏切换时不会变白）
              opacity: 0.15,
              filter: 'grayscale(100%) brightness(0.8)',
              pointerEvents: 'auto',
              boxSizing: 'border-box',
              cursor: 'pointer',
              transformOrigin: 'center center',
            }}
            onClick={showMobilePortrait ? () => {
              const newExpanded = !isNetworkExpanded
              setIsNetworkExpanded(newExpanded)
              // 保存状态到 sessionStorage，用于横竖屏切换时恢复
              if (typeof window !== 'undefined') {
                sessionStorage.setItem('network-expanded', String(newExpanded))
              }
              // 更新地图的 z-index
              if (whiteBoxRef.current) {
                whiteBoxRef.current.style.zIndex = newExpanded ? '200' : '1'
              }
            } : undefined}
          >
                <img
                  src="/imgs/worldmap.svg"
                  alt="世界地图"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'fill', // 填满整个白框
                    display: 'block'
                  }}
            />
          </div>

          {/* 网络图内容容器 - 黄框，直接相对于绿框定位 */}
          <motion.div
                key={`network-${renderKey}`}
                ref={ref}
                className="yellow-network-container"
                initial="visible"
                animate={shouldAnimate ? 'visible' : 'visible'}
                variants={containerVariants}
                style={{
                  width: `${containerWidth}px`, // 内容基于原始尺寸
                  height: `${containerHeight}px`,
                  position: 'absolute',
                  left: '50%',
                  // 所有版本都使用正常居中
                  top: '50%',
                  margin: '0',
                  transform: showMobileLandscape 
                    ? `translate(-50%, -50%) scale(${yellowBoxScale * 0.65})` 
                    : (showMobilePortrait && isNetworkExpanded
                      ? `translate(-50%, -50%) scale(${yellowBoxScale * 2})`
                      : (showIpadPortrait
                        ? `translate(-50%, -50%) scale(${yellowBoxScale * ipadPortraitScale})` // iPad竖版使用固定缩放
                        : (showIpadLandscape || isDesktop
                          ? `translate(-50%, -50%) scale(${yellowBoxScale * ipadPortraitScale * 1.2})` // iPad横版和桌面版放大到120%
                          : `translate(-50%, -50%) scale(${yellowBoxScale})`))), // 其他版本使用黄框缩放
                  transformOrigin: 'center center',
                  zIndex: showMobilePortrait && isNetworkExpanded ? 201 : 2,
                  pointerEvents: 'none', // 允许鼠标事件穿透到白框
                  overflow: 'hidden', // 防止内容溢出容器
                } as React.CSSProperties}
              >
                {/* 动画连接线 */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ zIndex: 1 }}
                  width={containerWidth}
                  height={containerHeight}
                  viewBox={`0 0 ${containerWidth} ${containerHeight}`}
                >
                  {partners.map((partner: Partner, index: number) => {
                    const angleDeg = angleOffsets[index] - 90
                    const radians = angleDeg * (Math.PI / 180)
                    let lineRadius = baseRadius
                    // 使用索引判断，而不是名称，以支持多语言
                    if (index === 0 || index === 6 || index === 7) { // 日本大型金融机构、大型保证公司、日本大型装修公司
                      lineRadius = baseRadius * 0.85
                    } else if (index === 8) { // 日本大型保险公司
                      lineRadius = baseRadius * 0.92
                    }
                    const x = Math.round((centerX + lineRadius * Math.cos(radians)) * 100) / 100
                    const y = Math.round((centerY + lineRadius * Math.sin(radians)) * 100) / 100

                    return (
                      <motion.line
                        key={index}
                        x1={centerX}
                        y1={centerY}
                        x2={x}
                        y2={y}
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeDasharray="6,4"
                        variants={lineVariants}
                      />
                    )
                  })}
                </svg>

                {/* 中心公司 */}
                <motion.div
                  className="absolute"
                  style={{
                    left: `${centerX}px`,
                    top: `${centerY}px`,
                    width: '288px',
                    height: '288px',
                    marginLeft: '-144px',
                    marginTop: '-144px',
                    zIndex: 10,
                    boxSizing: 'border-box',
                    pointerEvents: 'auto'
                  }}
                  variants={centerVariants}
                >
                  <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-full w-72 h-72 flex items-center justify-center shadow-2xl border-4 border-white hover:scale-110 transition-transform duration-300">
                    <div className="text-center text-white">
                      <div className="text-4xl font-bold mb-1">Bourn</div>
                      <div className="text-4xl font-bold">Mark</div>
                    </div>
                  </div>
                </motion.div>

                {/* 合作伙伴卡片 */}
                {partners.map((partner: Partner, index: number) => {
                  const Icon = partnerIcons[index % partnerIcons.length]
                  const angleDeg = angleOffsets[index] - 90
                  const radians = angleDeg * (Math.PI / 180)

                  // 使用索引判断，而不是名称，以支持多语言
                  let finalRadius = baseRadius
                  if (index === 0 || index === 6 || index === 7) { // 日本大型金融机构、大型保证公司、日本大型装修公司
                    finalRadius = baseRadius * 0.85
                  } else if (index === 8) { // 日本大型保险公司
                    finalRadius = baseRadius * 0.92
                  }

                  let x = Math.round((centerX + finalRadius * Math.cos(radians)) * 100) / 100
                  let y = Math.round((centerY + finalRadius * Math.sin(radians)) * 100) / 100

                  // 使用索引判断位置偏移
                  if (index === 1) { // 在日中国企业协会
                    x += 120
                  } else if (index === 8) { // 日本大型保险公司
                    x -= 40
                    y -= 30
                  } else if (index === 0) { // 日本大型金融机构
                    y -= 10
                    x += 30
                  } else if (index === 6) { // 大型保证公司
                    y -= 10
                    x -= 20
                  } else if (index === 7) { // 日本大型装修公司
                    x -= 20
                  } else if (index === 4) { // Jetro 日本贸易振兴协会
                    y += 20
                    x += 60
                  } else if (index === 3) { // 综合法律与会计事务所
                    y -= 20
                  }

                  let finalCardWidth = cardWidth
                  let cardOffsetX = 0

                  // 使用索引判断卡片宽度和偏移
                  if (index === 2) { // 全日本中国企业协会联合会
                    finalCardWidth = 320 + 50
                    cardOffsetX = (finalCardWidth - cardWidth) / 2 - 20
                  } else if (index === 4) { // Jetro 日本贸易振兴协会
                    finalCardWidth = 320 + 40
                    cardOffsetX = (finalCardWidth - cardWidth) / 2
                  } else if (index === 3) { // 综合法律与会计事务所
                    finalCardWidth = 320 + 20
                    cardOffsetX = (finalCardWidth - cardWidth) / 2 - 20
                  } else if (index === 8) { // 日本大型保险公司
                    finalCardWidth = cardWidth + 50
                    cardOffsetX = -70
                  } else if (index === 7) { // 日本大型装修公司
                    finalCardWidth = cardWidth + 50
                    cardOffsetX = -50
                  } else if (index === 0) { // 日本大型金融机构
                    finalCardWidth = cardWidth + 110
                    cardOffsetX = -10
                  } else if (index === 6) { // 大型保证公司
                    finalCardWidth = cardWidth + 60
                    cardOffsetX = -60
                  } else if (index === 1) { // 在日中国企业协会
                    finalCardWidth = cardWidth + 90
                    cardOffsetX = 30
                  } else if (index === 5) { // 苏州工业园区
                    finalCardWidth = cardWidth + 80
                    cardOffsetX = -80
                  }

                  const cardContent = (
                    <motion.div
                      variants={cardVariants}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="bg-white rounded-xl p-5 shadow-lg border-2 border-gray-100 cursor-pointer"
                      style={{
                        width: `${finalCardWidth}px`,
                        minHeight: `${cardHeight}px`
                      }}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <motion.div
                          className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0"
                          whileHover={{ scale: 1.2, rotate: 5 }}
                        >
                          {Icon ? <Icon className="w-6 h-6 text-green-600" /> : <Globe className="w-6 h-6 text-green-600" />}
                        </motion.div>
                        <h3 className="font-semibold text-navy-900 leading-tight flex-1" style={{ fontSize: '22px' }}>{partner.name}</h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed" style={{ fontSize: '18px' }}>{partner.desc}</p>
                    </motion.div>
                  )

                  return (
                    <motion.div
                      key={partner.name}
                      className="absolute"
                      style={{
                        left: `${x + cardOffsetX}px`,
                        top: `${y}px`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 5, // 高于白框(3)，确保可以交互
                        pointerEvents: 'auto'
                      }}
                    >
                      {partner.link ? (
                        <a
                          href={partner.link}
                          className="block focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded-xl"
                        >
                          {cardContent}
                        </a>
                      ) : (
                        cardContent
                      )}
                    </motion.div>
                  )
                })}
          </motion.div>

        </section>


        <section id="cases" className="section-padding" style={{ marginTop: '0px', position: 'relative', zIndex: 10 }}>
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 text-center">{t('qichu.cases.title')}</h2>

            {/* 横向滚动容器 */}
            <div className="relative">
              <div className="overflow-x-auto scroll-smooth pb-4 scrollbar-hide">
                <div className="flex gap-6 min-w-max">
                  {projects.map((project, index) => {
                    // 从案例展示页面获取对应的图片和日期
                    const projectDataMap: Record<string, ProjectData> = {
                      '金山 WPS 日本子公司设立服务': {
                        id: 'kingsoft-wps-japan',
                        date: caseDates['kingsoft-wps-japan'],
                        image: caseImages['kingsoft-wps-japan'],
                      },
                    }
                    const projectData: ProjectData = projectDataMap[project.title] || {
                      id: `project-${index}`,
                      date: '2024/01/01',
                      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    }

                     return (
                       <Link
                         key={project.title}
                         href={`/cases/${projectData.id}`}
                         className="group bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 md:hover:-translate-y-2 flex-shrink-0 w-[280px] md:w-[380px]"
                       >
                        <div className="relative overflow-hidden">
                          <div className="relative w-full h-64">
                            <Image
                              src={projectData.image}
                              alt={project.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              sizes="380px"
                            />
                          </div>
                          <div className="absolute top-4 right-4">
                            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                              企业服务
                            </span>
                          </div>
                        </div>

                        <div className="p-3 md:p-6">
                          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-1.5 md:mb-3">
                            <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            <span>{projectData.date}</span>
                          </div>
                          <h3 className="text-base md:text-lg lg:text-xl font-semibold text-navy-900 mb-1.5 md:mb-2 group-hover:text-navy-600 transition-colors duration-200">
                            {project.title}
                          </h3>
                          <p className="text-gray-700 text-xs md:text-sm leading-relaxed line-clamp-2">
                            {project.result}
                          </p>
                        </div>
                      </Link>
                    )
                  })}
                  {/* Coming Soon 卡片 */}
                  {comingSoonProjects.map((project, index) => (
                    <div
                      key={`coming-soon-${index}`}
                      className="group bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg flex-shrink-0 w-[280px] md:w-[380px] opacity-75"
                    >
                      <div className="relative overflow-hidden">
                        <div className="relative w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-gray-400 mb-2">Coming Soon</div>
                            <div className="text-xs md:text-sm text-gray-500">案例准备中</div>
                          </div>
                          <div className="absolute top-4 right-4">
                            <span className="bg-gray-400 text-white px-3 py-1 rounded-full text-sm font-medium">
                              准备中
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 md:p-6">
                        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400 mb-1.5 md:mb-3">
                          <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          <span>—</span>
                        </div>
                        <h3 className="text-base md:text-lg lg:text-xl font-semibold text-gray-400 mb-1.5 md:mb-2">
                          {project.title}
                        </h3>
                        <p className="text-gray-500 text-xs md:text-sm leading-relaxed line-clamp-2">
                          {project.result}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom text-center px-4 md:px-0">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">计划拓展日本业务？</h2>
            <p className="text-sm md:text-base text-gray-200 max-w-2xl mx-auto mb-5 md:mb-6 leading-relaxed">
              告诉我们您的行业、预算与时间安排，我们将提供市场评估、落地路线与伙伴资源建议，为您构建可持续的在日业务体系。
            </p>
            <a href="/#contact" className="btn-primary inline-flex items-center gap-2 text-sm md:text-base px-6 md:px-8 py-2.5 md:py-3">
              获取专属方案
            </a>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}


