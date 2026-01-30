'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import Link from 'next/link'
import { Building2, Users, Briefcase, Landmark, Globe, Calendar, Store, Palette, Monitor, Sparkles, Megaphone, Target, FileCheck, LifeBuoy } from 'lucide-react'
import { motion, Variants } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils'

type QichuLayoutRect = { x: number; y: number; w: number; h: number }

// 固化的“手机竖版”布局（由 layout=edit 导出）
// - 坐标系：1800x1026 画布
// - 仅在手机竖版 + 对应语言时生效（不依赖 localStorage）
const QICHU_MOBILE_PORTRAIT_LAYOUT_PRESET: Partial<Record<string, QichuLayoutRect[]>> = {
  en: [
    { x: 864.1861015772487, y: 147.38080631025417, w: 460.7142857142857, h: 120.71428571428571 },
    { x: 1398.8212553577207, y: 277.3772140192802, w: 567.8571428571429, h: 110 },
    { x: 1384.5428353531386, y: 487.02583325822314, w: 551.7857142857142, h: 129.35714285714286 },
    { x: 1357.9295430213865, y: 711.2795793163892, w: 514.2857142857142, h: 110 },
    { x: 1198.096668978204, y: 925.7195327451427, w: 546.4285714285714, h: 110 },
    { x: 578.7328665169755, y: 918.1603741123646, w: 471.42857142857144, h: 113.28571428571429 },
    { x: 398.2874021869909, y: 705.8580646136178, w: 460.7142857142857, h: 113.28571428571429 },
    { x: 338.1894170570278, y: 522.4552811109838, w: 482.1428571428571, h: 110 },
    { x: 389.7292020423343, y: 297.3147962758459, w: 466.07142857142856, h: 134.71428571428572 },
  ],
}

// 固化的“iPad 编辑模式”布局（由 iPad 上 layout=edit 导出）
// - 坐标系：1800x1026 画布
// - 仅在 iPad + layout=edit 初始化时使用（不影响正常访问）
const QICHU_IPAD_LAYOUT_PRESET: Partial<Record<string, QichuLayoutRect[]>> = {
  default: [
    { x: 917.3655523647335, y: 113.32902671755724, w: 462.0458015267175, h: 202.02290076335882 },
    { x: 1480.6149479241476, y: 158.38253972789502, w: 505.557251908397, h: 188.2824427480916 },
    { x: 1526.0257096324171, y: 403.66549223592597, w: 475.78625954198475, h: 181.412213740458 },
    { x: 1425.0759611726248, y: 639.3167938931297, w: 413.9541984732825, h: 204.31297709923663 },
    { x: 1052.1989637799227, y: 878.4914605245384, w: 447.63358778625957, h: 199.7328244274809 },
    { x: 521.083478968169, y: 828.1097811352254, w: 498.68702290076334, h: 119.16030534351145 },
    { x: 459.65686325485603, y: 620.9961832061068, w: 462.0458015267176, h: 115 },
    { x: 335.80635143628496, y: 433.43648460233806, w: 372.7328244274809, h: 137.90076335877862 },
    { x: 398.20270581798906, y: 217.31220588074356, w: 434.5648854961832, h: 158.5114503816794 },
  ],
}
import { useLanguage } from '@/contexts/LanguageContext'
import { caseImages, caseDates } from '@/lib/casesData'

const relatedServiceIcons = [Store, Palette, Monitor, Sparkles, Megaphone]

// 合作伙伴数据将在组件内从多语言文件读取

const partnerIcons = [Building2, Users, Briefcase, Globe, Landmark]

function isWeChatBrowser() {
  if (typeof navigator === 'undefined') return false
  return /MicroMessenger/i.test(navigator.userAgent || '')
}

function normalizeWeChatMiniProgramLink(link: string) {
  // 语言包里存的是 "#小程序://..."（常见于微信内复制的格式）
  // 在网页里点击需要去掉 "#"，否则只会变成 hash，不会触发协议跳转
  return link.startsWith('#') ? link.slice(1) : link
}

function isIOS() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  return /iPad|iPhone|iPod/i.test(ua)
}

function openUrlByHiddenIframe(url: string) {
  if (typeof document === 'undefined') return
  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = url
  document.body.appendChild(iframe)
  window.setTimeout(() => {
    try {
      document.body.removeChild(iframe)
    } catch {
      // ignore
    }
  }, 1200)
}

async function copyToClipboard(text: string) {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // ignore
  }
  try {
    if (typeof document === 'undefined') return false
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.top = '-9999px'
    ta.style.left = '-9999px'
    document.body.appendChild(ta)
    ta.focus()
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}

function tryOpenWeChatMiniProgram(options: {
  rawLink: string
  confirmText: string
  fallbackText: string
}) {
  const normalized = normalizeWeChatMiniProgramLink(options.rawLink)
  // 支持：小程序口令（仅微信环境可识别）、微信 URL Scheme、以及外部可拉起的 URL Link（如 wxaurl.cn）
  const isMiniProgramToken = normalized.startsWith('小程序://')
  const isWeixinScheme = normalized.startsWith('weixin://')
  const isExternalLink = /^https?:\/\//i.test(normalized)
  if (!isMiniProgramToken && !isWeixinScheme && !isExternalLink) return false

  // 用户确认后再尝试拉起微信打开小程序
  const ok = typeof window !== 'undefined' ? window.confirm(options.confirmText) : false
  if (!ok) return true

  if (typeof window !== 'undefined') {
    // 关键事实：
    // - “小程序://...” 这种字符串在系统浏览器里并不是可被系统识别的 URL Scheme，无法直接拉起微信并打开小程序；
    //   它通常只在微信环境/聊天内被识别。
    // - 真正可从外部浏览器稳定拉起微信并打开小程序，需要小程序后台生成的 URL Scheme / Universal Link / URL Link（如 wxaurl.cn）。
    if (isMiniProgramToken) {
      // 小程序口令无法作为“URL”跳转（即使在微信内置浏览器里也不可靠）。
      // 正确方式：复制口令 → 去微信聊天输入框/搜索框粘贴并发送/搜索。
      void copyToClipboard(normalized)
      // 若不在微信里，顺便尝试拉起微信 App（仅打开 App，能否成功取决于系统策略）
      if (!isWeChatBrowser()) {
        openUrlByHiddenIframe('weixin://')
      }
      alert(options.fallbackText)
      return true
    }

    // 微信内置浏览器或已提供可拉起的链接：按原方式跳转
    if (isWeixinScheme) {
      // scheme 跳转用 iframe 触发，避免把当前页替换成错误页
      openUrlByHiddenIframe(normalized)
    } else {
      window.location.href = normalized
    }

    // 若系统/浏览器拦截协议跳转，页面通常不会离开；此时给出明确提示
    window.setTimeout(() => {
      try {
        if (typeof document !== 'undefined' && !document.hidden) {
          alert(options.fallbackText)
        }
      } catch {
        // ignore
      }
    }, 900)
  }

  return true
}

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
  id: string
  title: string
  result: string
  href?: string
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
                  href={normalizeWeChatMiniProgramLink(partner.link).startsWith('小程序://') ? '#' : normalizeWeChatMiniProgramLink(partner.link)}
                  className="block focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded-xl"
                  onClick={(e) => {
                    const raw = partner.link
                    if (!raw) return
                    const handled = tryOpenWeChatMiniProgram({
                      rawLink: raw,
                      confirmText: '将尝试打开微信并准备小程序口令（已自动复制），是否继续？',
                      fallbackText: '已复制小程序口令。请打开微信，在搜索框或任意聊天输入框中粘贴并发送/搜索，即可识别并打开该小程序。',
                    })
                    if (handled) {
                      e.preventDefault()
                      e.stopPropagation()
                    }
                  }}
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
  const { t, language } = useLanguage()
  const [debug, setDebug] = useState(false)
  // 用于“硬验证是否更新到最新代码”的构建标记（不依赖屏幕尺寸/JS 分支）
  const buildStamp = '2026-01-29-49'
  // 仅用于排查：确认手机是否真的访问到“当前正在运行”的 dev server，而不是旧端口/旧标签页/缓存
  const debugStamp = `qichu-debug-${buildStamp}`
  const [clientHost, setClientHost] = useState('')
  const [probe, setProbe] = useState(false)
  const [layoutEdit, setLayoutEdit] = useState(false)
  const [layoutEditStatus, setLayoutEditStatus] = useState<string>('')
  const [probeInfo, setProbeInfo] = useState<null | {
    stage?: any
    scaledRoot?: any
    map?: any
    net?: any
    img?: any
  }>(null)
  const [clientViewport, setClientViewport] = useState<{ w: number; h: number; dpr: number }>({ w: 0, h: 0, dpr: 1 })
  const [showMobilePortrait, setShowMobilePortrait] = useState(false)
  const [showIpadPortrait, setShowIpadPortrait] = useState(false)
  const [showIpadProPortrait, setShowIpadProPortrait] = useState(false)
  const [showIpadLandscape, setShowIpadLandscape] = useState(false)
  const [showMobileLandscape, setShowMobileLandscape] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isNetworkExpanded, setIsNetworkExpanded] = useState(false) // 手机竖版网络图放大状态
  // 手机竖版：点击合作伙伴卡片弹出放大详情
  const [mobilePartnerModal, setMobilePartnerModal] = useState<null | { index: number; name: string; desc: string; link?: string }>(null)
  // /qichu：手机端布局编辑模式（像画图一样拖拽）
  const [layoutEditRects, setLayoutEditRects] = useState<QichuLayoutRect[]>([])
  const layoutEditInitRef = useRef(false)
  const layoutDragRef = useRef<null | { index: number; pointerId: number; startClientX: number; startClientY: number; startX: number; startY: number }>(null)
  const layoutResizeRef = useRef<null | { index: number; pointerId: number; startClientX: number; startClientY: number; startW: number; startH: number }>(null)
  const [layoutSelectedIndex, setLayoutSelectedIndex] = useState<number>(-1)
  const [layoutInteracting, setLayoutInteracting] = useState(false)
  const [layoutJsonText, setLayoutJsonText] = useState<string>('')
  const [layoutUseSaved, setLayoutUseSaved] = useState(false)
  // layout=edit：全局字号调节（+/-），仅影响编辑模式的方块文字
  const [layoutFontDeltaPx, setLayoutFontDeltaPx] = useState(0)
  const [layoutPanelOpen, setLayoutPanelOpen] = useState(false)
  const [layoutPanelPos, setLayoutPanelPos] = useState<{ x: number; y: number }>({ x: 8, y: 8 })
  const layoutPanelDragRef = useRef<null | { pointerId: number; startClientX: number; startClientY: number; startX: number; startY: number }>(null)
  const [layoutJsonModalOpen, setLayoutJsonModalOpen] = useState(false)
  const layoutJsonTextareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [ipadPortraitScale, setIpadPortraitScale] = useState(0.75) // iPad竖版缩放比例（固定值，不随横竖屏切换改变）
  const [yellowBoxScale, setYellowBoxScale] = useState(0.78) // 黄框内容缩放比例（固定值，不随横竖屏切换改变）
  const [renderKey, setRenderKey] = useState(0) // 强制重新渲染的key
  const ipadPortraitScaleInitializedRef = useRef(false) // 标记 iPad 竖版缩放比例是否已初始化
  const yellowBoxScaleInitializedRef = useRef(false) // 标记黄框缩放比例是否已初始化
  const ipadPortraitScaleCalculatedInPortraitRef = useRef(false) // 标记是否在竖版时计算过 ipadPortraitScale
  const [isInitialized, setIsInitialized] = useState(false) // 标记是否已初始化

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const sp = new URLSearchParams(window.location.search)
      setDebug(sp.get('debug') === '1')
      setProbe(sp.get('probe') === '1')
      const lm = sp.get('layout')
      setLayoutEdit(lm === 'edit')
      setLayoutUseSaved(lm === 'use' || lm === 'edit')
      setClientHost(window.location.host || '')
      setClientViewport({ w: window.innerWidth, h: window.innerHeight, dpr: window.devicePixelRatio || 1 })
    } catch {
      setDebug(false)
      setProbe(false)
      setLayoutEdit(false)
      setLayoutUseSaved(false)
      setClientHost('')
      setClientViewport({ w: 0, h: 0, dpr: 1 })
    }
  }, [])

  // layout=edit：拖拽/缩放期间锁定页面滚动（否则手指一动页面也跟着滚，极难用）
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!layoutEdit) return
    if (!layoutInteracting) return
    const prevOverflow = document.body.style.overflow
    const prevOverscroll = (document.body.style as any).overscrollBehavior
    document.body.style.overflow = 'hidden'
    ;(document.body.style as any).overscrollBehavior = 'none'
    return () => {
      document.body.style.overflow = prevOverflow
      ;(document.body.style as any).overscrollBehavior = prevOverscroll
    }
  }, [layoutEdit, layoutInteracting])

  const copyLayoutJsonToClipboard = async () => {
    const text = JSON.stringify(layoutEditRects, null, 2)
    setLayoutJsonText(text)
    // 优先使用 Clipboard API
    try {
      await navigator.clipboard.writeText(text)
      setLayoutEditStatus('copied')
      return true
    } catch {
      // iOS Safari / 非 https / 权限问题：降级到 execCommand
      try {
        setLayoutJsonModalOpen(true)
        // 下一帧确保 textarea 已挂载
        requestAnimationFrame(() => {
          const el = layoutJsonTextareaRef.current
          if (!el) return
          el.focus()
          el.select()
          try {
            const ok = document.execCommand('copy')
            setLayoutEditStatus(ok ? 'copied_fallback' : 'copy_failed')
          } catch {
            setLayoutEditStatus('copy_failed')
          }
        })
        return false
      } catch {
        setLayoutEditStatus('copy_failed')
        return false
      }
    }
  }

  const downloadLayoutJson = () => {
    try {
      const text = JSON.stringify(layoutEditRects, null, 2)
      const blob = new Blob([text], { type: 'application/json;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${layoutStorageKey}.json`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setLayoutEditStatus('downloaded')
    } catch {
      setLayoutEditStatus('download_failed')
    }
  }
  
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
    const list: Project[] = [
      {
        id: 'kingsoft-wps-japan',
        title: t('qichu.cases.project1.title'),
        result: t('qichu.cases.project1.result'),
        href: '/cases/kingsoft-wps-japan',
      },
      {
        id: 'suzhou-industrial-park',
        title: t('qichu.cases.project2.title'),
        result: t('qichu.cases.project2.result'),
        // 该卡片暂不跳转案例详情页（未提供对应 cases 页面）
      },
    ]
    // 日语版不展示 WPS 案例卡片
    if (language === 'ja') return list.filter((p) => p.id !== 'kingsoft-wps-japan')
    return list
  }, [t, language])

  // 相关服务（多语言）
  const relatedServices = useMemo(() => {
    type RelatedService = { name: string; desc: string }
    const raw = t('qichu.services.related', { returnObjects: true }) as any
    if (Array.isArray(raw)) return raw as RelatedService[]
    if (raw && typeof raw === 'object') {
      return Object.keys(raw)
        .sort()
        .map((k) => raw[k])
        .filter((v) => v && typeof v === 'object' && 'name' in v && 'desc' in v) as RelatedService[]
    }
    return [] as RelatedService[]
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

  // 合作伙伴弹窗：锁定背景滚动 + ESC 关闭（所有版本；layout=edit 例外）
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!mobilePartnerModal) return
    if (layoutEdit) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobilePartnerModal(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [layoutEdit, mobilePartnerModal])

  // 更鲁棒的“竖屏窄屏”判断：用于压缩边距（避免某些手机/微信浏览器把宽度算到 768+ 导致手机规则不触发）
  const isNarrowPortrait = showMobilePortrait || showIpadPortrait

  // 手机端：网络图“按桌面版等比缩放”
  // - 关键：位置/尺寸都复用桌面版逻辑，只做整体 scale，这样手机端一定与桌面端同构
  const mobileFitScale = useMemo(() => {
    const w = clientViewport.w || 0
    if (!w) return null
    // 关键：手机端必须“像截图缩放一样”严格等比缩放到屏幕可用宽度内，
    // 否则会出现：内部画布比外层容器大 → 被 overflow-x-hidden 裁到“看起来全空”。
    const availableW = Math.max(280, w - 24) // 手机端尽量少留白，减少黑边
    const portraitBoost = showMobilePortrait ? 1.2 : 1
    const s = (availableW / 1800) * portraitBoost // 1800 是网络图基准画布宽度
    // 给一个合理下限，避免极端情况下太小（但绝不强制放大到超出屏幕）
    return Math.min(1, Math.max(0.16, s))
  }, [clientViewport.w, showMobilePortrait])

  // NOTE: transform 缩放不会改变布局占位；手机端必须手动用“缩放后的尺寸”占位，
  // 否则网络图可能跑到上一段被盖住，看起来像“消失”。
  const mobileNetworkScale = mobileFitScale || 0.55
  const mobileNetworkScaledW = Math.round(1800 * mobileNetworkScale)
  const mobileNetworkScaledH = Math.round(1026 * mobileNetworkScale)
  const layoutEditStorageKey = useMemo(() => `qichu:partnersLayout:${language}:mobilePortrait:v1`, [language])

  // 手机竖版：白框高度跟随缩放后的网络图高度，减少上下“黑空白”
  const mobilePortraitMapHeight = useMemo(() => {
    if (!showMobilePortrait) return null
    const s = mobileFitScale || 0.2
    const h = Math.round(1026 * s + 80) // +80 给标题/阴影留余量
    return `${Math.max(320, Math.min(520, h))}px`
  }, [showMobilePortrait, mobileFitScale])

  // --- Partners infographic (fixed canvas + scale, NO clipping/overlap) ---
  const PARTNERS_BASE_W = 1800
  const PARTNERS_BASE_H = 1200
  const PARTNERS_EXTRA_BOTTOM = 260 // 给底部卡片/阴影留余量，避免压到下一个区块

  const partnersStageRef = useRef<HTMLDivElement>(null)
  const [partnersScale, setPartnersScale] = useState(1)

  // containerRef 定义在 QiChuPage 中，直接相对于绿框定位
  const containerRef = useRef<HTMLDivElement>(null)
  // NOTE: 移动端/桌面端同时渲染（只是用 CSS hidden/show），同一个 ref 绑定两处 DOM 会导致 ref 指向“被隐藏的那一套”
  // 从而出现：逻辑/调试看到“有 ref”，但实际可见 DOM 没被操作/没被检查。
  const mobileWhiteBoxRef = useRef<HTMLDivElement>(null)
  const desktopWhiteBoxRef = useRef<HTMLDivElement>(null)
  const networkContainerRef = useRef<HTMLDivElement>(null)
  const networkContentRef = useRef(null)
  const mobileNetworkRef = useRef<HTMLDivElement>(null)
  const desktopNetworkRef = useRef<HTMLDivElement>(null)
  const mobileScaledRootRef = useRef<HTMLDivElement>(null)
  const mobileStageRef = useRef<HTMLDivElement>(null)

  // iOS/iPad 兜底：如果有任何全局 CSS 误伤（display/transform 等），用内联 important 把移动端/Pad 网络图强制拉起来
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!(showMobilePortrait || showMobileLandscape || showIpadPortrait || showIpadLandscape || showIpadProPortrait)) return

    const root = mobileScaledRootRef.current
    if (!root) return
    const W = 1800
    const H = 1026

    // 强制缩放与定位（避免被全局 `transform: none !important` 误伤）
    root.style.setProperty('width', `${W}px`, 'important')
    root.style.setProperty('height', `${H}px`, 'important')
    root.style.setProperty('position', 'absolute', 'important')
    root.style.setProperty('left', '50%', 'important')
    root.style.setProperty('top', '50%', 'important')
    root.style.setProperty('transform-origin', 'center', 'important')
    root.style.setProperty('transform', `translate(-50%, -50%) scale(${mobileNetworkScale})`, 'important')
    root.style.setProperty('display', 'block', 'important')
    root.style.setProperty('visibility', 'visible', 'important')
    root.style.setProperty('opacity', '1', 'important')
    root.style.setProperty('overflow', 'visible', 'important')

    const map = root.querySelector('.white-box-container') as HTMLElement | null
    if (map) {
      map.style.setProperty('display', 'block', 'important')
      map.style.setProperty('visibility', 'visible', 'important')
      map.style.setProperty('opacity', '0.55', 'important')
      map.style.setProperty('filter', 'none', 'important')
      map.style.setProperty('position', 'absolute', 'important')
      map.style.setProperty('left', '0px', 'important')
      map.style.setProperty('top', '0px', 'important')
      map.style.setProperty('width', `${W}px`, 'important')
      map.style.setProperty('height', `${H}px`, 'important')
      map.style.setProperty('z-index', '1', 'important')
      map.style.setProperty('pointer-events', 'none', 'important')
    }

    const net = root.querySelector('.yellow-network-container') as HTMLElement | null
    if (net) {
      net.style.setProperty('display', 'block', 'important')
      net.style.setProperty('visibility', 'visible', 'important')
      net.style.setProperty('opacity', '1', 'important')
      net.style.setProperty('position', 'absolute', 'important')
      net.style.setProperty('left', '0px', 'important')
      net.style.setProperty('top', '0px', 'important')
      net.style.setProperty('width', `${W}px`, 'important')
      net.style.setProperty('height', `${H}px`, 'important')
      net.style.setProperty('z-index', '2', 'important')
      net.style.setProperty('pointer-events', 'none', 'important')
      net.style.setProperty('overflow', 'visible', 'important')
      net.style.setProperty('transform', 'none', 'important')
    }
  }, [showMobilePortrait, showMobileLandscape, showIpadPortrait, showIpadLandscape, showIpadProPortrait, mobileNetworkScale, renderKey])

  // probe=1 时：把“到底渲染没渲染/有没有被 CSS 干掉/图片有没有加载”直接打印出来
  useEffect(() => {
    if (!probe || typeof window === 'undefined') return

    const snap = (el: HTMLElement | null) => {
      if (!el) return { exists: false }
      const r = el.getBoundingClientRect()
      const cs = window.getComputedStyle(el)
      const findHiddenAncestor = (node: HTMLElement | null) => {
        let cur: HTMLElement | null = node
        // 最多向上找 12 层，足够定位到关键容器
        for (let i = 0; i < 12 && cur; i++) {
          const s = window.getComputedStyle(cur)
          if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') {
            return {
              tag: cur.tagName,
              id: cur.id || '',
              cls: (cur.getAttribute('class') || '').slice(0, 120),
              display: s.display,
              visibility: s.visibility,
              opacity: s.opacity,
            }
          }
          cur = cur.parentElement
        }
        return null
      }
      return {
        exists: true,
        rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
        style: { display: cs.display, visibility: cs.visibility, opacity: cs.opacity, zIndex: cs.zIndex, position: cs.position, overflow: cs.overflow },
        metrics: {
          cssSize: { w: cs.width, h: cs.height },
          offset: { w: (el as any).offsetWidth ?? null, h: (el as any).offsetHeight ?? null },
          client: { w: el.clientWidth, h: el.clientHeight },
          scroll: { w: el.scrollWidth, h: el.scrollHeight },
          transform: cs.transform,
        },
        hiddenAncestor: findHiddenAncestor(el),
      }
    }

    const compute = () => {
      const stage = mobileStageRef.current
      const scaledRoot = mobileScaledRootRef.current
      const map = mobileWhiteBoxRef.current
      const net = mobileNetworkRef.current
      const imgEl = map?.querySelector('img') as HTMLImageElement | null

      setProbeInfo({
        stage: snap(stage),
        scaledRoot: snap(scaledRoot),
        map: snap(map),
        net: snap(net),
        img: imgEl
          ? {
              exists: true,
              complete: imgEl.complete,
              natural: { w: imgEl.naturalWidth, h: imgEl.naturalHeight },
              src: imgEl.currentSrc || imgEl.src,
            }
          : { exists: false },
      })
    }

    compute()
    const id = window.setInterval(compute, 500)
    return () => window.clearInterval(id)
  }, [probe])

  // 网络图相关变量（缩小5%）
  const shouldAnimate = true
  const containerWidth = 1800
  const containerHeight = 1026 // 缩小5%（1080 * 0.95）
  // 手机端：中心点（手机端绕圈布局用画布几何中心）
  const phoneCenterY = containerHeight / 2
  // 蓝框的显示尺寸
  const blueBoxWidth = containerWidth - 400 // 1400px
  const blueBoxDisplayHeight = containerHeight - 200 // 1000px
  // 蓝框内容缩放比例
  const blueBoxScale = Math.min(blueBoxWidth / containerWidth, blueBoxDisplayHeight / containerHeight)
  // 黄框的显示尺寸（这些值在横竖屏切换时会通过状态更新）
  // yellowBoxScale 现在是状态变量，会在 checkViewport 中动态更新
  // 内容基于原始尺寸定位（1800x1200）
  const centerX = containerWidth / 2 // 900px
  // IMPORTANT: 桌面端坐标必须保持原样（之前桌面“很好”就是这个中心点计算）
  const centerY = containerHeight / 2
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

  // 手机端也复用桌面版网络图结构（只做整体缩放）
  // - iPad：也统一走“可缩放画布布局”（避免 iPad 上看起来“没变化”）
  const isIpadNetwork = showIpadPortrait || showIpadLandscape || showIpadProPortrait
  // - iPad 也允许用 layout=edit 进入编辑模式（显示编辑面板/拖拽/缩放）
  const isEditOnIpad = layoutEdit && isIpadNetwork
  const isPhoneNetwork = showMobilePortrait || showMobileLandscape || isIpadNetwork
  const phoneCenterSize = 288

  // 手机/平板：根据“窗口短边”自动放大文字（避免 iPad 上整体缩放后文字显得过小）
  const phoneViewportTextScale = useMemo(() => {
    if (!isPhoneNetwork) return 1
    const w = clientViewport?.w || 0
    const h = clientViewport?.h || 0
    const m = Math.min(w, h)
    if (!m) return 1
    // 以 iPad 竖屏短边 ~834px 为 1.0，向上最多放大到 1.35
    const s = m / 834
    return Math.max(1, Math.min(1.35, s))
  }, [isPhoneNetwork, clientViewport?.w, clientViewport?.h])

  // NOTE: 手机端日文/英文文字更长，不要省略号；用更大的“固定卡片高度”来容纳全文（再通过布局保证不重叠）
  // 手机上英文/日文：直接给足高度，避免任何省略号/裁切
  // 手机横屏：同样文案会更少换行，不需要那么高（否则文字底部会出现很大空白）
  const phoneCardBaseH = showMobileLandscape
    ? (language === 'en' ? 220 : language === 'ja' ? 200 : 150)
    : (language === 'en' ? 260 : language === 'ja' ? 230 : 150)
  // 手机端：卡片宽度要更大（英文/日文更长），否则文字被迫挤成“又小又空”
  const phoneCardBaseW = language === 'en' ? 360 : language === 'ja' ? 340 : 300

  // 手机端：按实际文案估算每张卡片的“真实高度”，避免底部大空白，同时用于避碰计算（否则仍会遮挡）
  const phoneCardDims = useMemo(() => {
    if (!isPhoneNetwork) return [] as Array<{ w: number; h: number }>

    const isPhonePortrait = showMobilePortrait
    const isEnglishPhonePortrait = showMobilePortrait && language === 'en'

    // 渲染端的真实参数（与卡片 JSX 保持一致）
    // 目标：消除“住在边缘”的空隙（更贴边）
    // 手机竖版：进一步收紧（渲染端使用 0.5ch）
    // 这里用像素做近似估算，避免布局避碰计算低估实际占用空间导致重叠。
    // 手机竖版：0.5ch ≈ 4~6px（字体不同会略变），这里用 6px 做统一近似，宁可略“高估”，避免重叠。
    const padL = isPhonePortrait ? 6 : 6
    const padR = isPhonePortrait ? 6 : 6
    const padT = isPhonePortrait ? 6 : 6
    const padB = isPhonePortrait ? 6 : 5
    const gap = isPhonePortrait ? 1 : 6 // 竖版进一步收紧
    // 手机竖版：标题行图标盒子/间距也要同步变小，否则视觉上仍然“离边缘很远”
    const iconBox = isPhonePortrait ? 22 : 34
    const iconGap = isPhonePortrait ? 4 : 6

    // 手机竖版：把文字放大（用户要求），所以行高也要同步，否则估算会失真导致再次遮挡
    const titleLineH = isPhonePortrait ? 26 : 22
    const descLineH = isPhonePortrait ? 22 : 18 // 17px * 1.25 ≈ 21.25

    // 经验值：字号变大时，平均字符像素宽度也会略增
    const avgCharPxTitle = language === 'en' ? (isPhonePortrait ? 9.2 : 8) : (isPhonePortrait ? 18 : 16)
    const avgCharPxDesc = language === 'en' ? (isPhonePortrait ? 8.4 : 7.2) : (isPhonePortrait ? 17.2 : 15.5)

    const estimateLines = (text: string, charsPerLine: number) => {
      const t = (text || '').trim()
      if (!t) return 1
      return Math.max(1, Math.ceil(t.length / Math.max(8, charsPerLine)))
    }

    return partners.map((p) => {
      const name = (p?.name || '').trim()
      const isWideCard = isEnglishPhonePortrait && (
        name.includes('JETRO') ||
        name.includes('Japan External Trade Organization') ||
        name.includes('Suzhou Industrial Park')
      )
      // 手机竖版英文：JETRO / Suzhou Industrial Park 方块宽度拉长到 120%
      const w = isWideCard ? Math.round(phoneCardBaseW * 1.2) : phoneCardBaseW
      const titleAvail = Math.max(120, w - padL - padR - iconBox - iconGap)
      const descAvail = Math.max(140, w - padL - padR)
      const titleCpl = Math.max(8, Math.floor(titleAvail / avgCharPxTitle))
      const descCpl = Math.max(10, Math.floor(descAvail / avgCharPxDesc))

      const titleLines = estimateLines(p?.name || '', titleCpl)
      const descLines = estimateLines(p?.desc || '', descCpl)

      const headerH = Math.max(iconBox, titleLines * titleLineH)
      // 备注：手机横屏 descLines 通常更少，因此高度会自然变矮（减少底部空白）
      const h = padT + headerH + gap + descLines * descLineH + padB

      // 手机端最小高度：不要强行 150（会导致短文案卡片底部一大块空白）
      // 宽卡会自然减少换行而变矮；这里不额外强制拉高，避免底部“空白住人”
      const minH = isPhonePortrait
        ? (language === 'en' ? (isWideCard ? 128 : 140) : language === 'ja' ? 132 : 124)
        : (language === 'en' ? 140 : language === 'ja' ? 130 : 120)
      return { w, h: Math.max(minH, Math.round(h)) }
    })
  }, [isPhoneNetwork, partners, phoneCardBaseW, language, showMobilePortrait])

  const partnerRingLayout = useMemo(() => {
    const n = partners.length
    if (n === 0) return [] as Array<{ x: number; y: number; w: number; h: number }>

    const gapX = 14
    const gapY = 12
    // 手机竖版：尽量利用边缘空间（padding 越大越容易挤成一坨）
    const padding = showMobilePortrait ? 2 : 10
    const rotationDeg = -90 // 从正上方开始
    const ringCenterX = centerX
    const ringCenterY = containerHeight / 2 // 手机端绕圈布局使用真实画布中心

    const toRad = (deg: number) => (deg * Math.PI) / 180
    const within = (x: number, y: number, w: number, h: number) => {
      const halfW = w / 2
      const halfH = h / 2
      return (
        x >= halfW + padding &&
        x <= containerWidth - halfW - padding &&
        y >= halfH + padding &&
        y <= containerHeight - halfH - padding
      )
    }
    const overlaps = (a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }) => {
      return (
        Math.abs(a.x - b.x) < (a.w + b.w) / 2 + gapX &&
        Math.abs(a.y - b.y) < (a.h + b.h) / 2 + gapY
      )
    }

    if (!isPhoneNetwork) return [] as Array<{ x: number; y: number; w: number; h: number }>

    const baseDims = phoneCardDims.length === n
      ? phoneCardDims
      : Array.from({ length: n }, () => ({ w: phoneCardBaseW, h: phoneCardBaseH }))

    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))
    const anchorK = 0.055
    const pushK = 0.62
    const iterations = 220
    const centerR = phoneCenterSize / 2

    const solve = (dims: Array<{ w: number; h: number }>) => {
      // 能否在框内绕一圈：必须满足 minR <= maxR
      const maxRAll = Math.min(
        ...dims.map((d) => Math.floor(Math.min(containerWidth / 2 - d.w / 2 - padding, containerHeight / 2 - d.h / 2 - padding)))
      )
      const minRAll = Math.max(...dims.map((d) => Math.ceil(centerR + d.h / 2 + 18)))
      if (minRAll > maxRAll) return null

      const radius = maxRAll

      const targets = dims.map((d, i) => {
        const angle = rotationDeg + (i * 360) / n
        const rad = toRad(angle)
        const base = { x: ringCenterX + radius * Math.cos(rad), y: ringCenterY + radius * Math.sin(rad), w: d.w, h: d.h }
        const pName = (partners[i]?.name || '').trim()
        const isEnglishPhonePortrait = showMobilePortrait && language === 'en'
        // 把“用户说的 px”视为“屏幕 px”，换算成画布 px（因为整张网络图会被 mobileNetworkScale 缩放）
        const toCanvasPx = (screenPx: number) => {
          const s = Math.max(0.12, mobileNetworkScale || 0.25)
          return Math.round(screenPx / s)
        }

        // 手机竖版（所有语言）：综合法律与会计事务所方块向上移动 30px（保持单圈环绕）
        // 这里使用索引以支持多语言（与桌面端的索引约定保持一致：index===3）。
        if (showMobilePortrait && i === 3) {
          return { ...base, y: base.y - 30 }
        }

        // 手机竖版英文：按指定卡片做精确微调（只改英文手机竖版，其他不动）
        if (isEnglishPhonePortrait) {
          // Chinese Enterprise Association in Japan：向上 40px（屏幕 px）
          if (pName.includes('Chinese Enterprise Association in Japan')) {
            return { ...base, x: base.x + toCanvasPx(10), y: base.y - toCanvasPx(40) }
          }
          // Federation of Chinese Enterprise Associations in Japan：向上 20px，向右 20px（屏幕 px）
          if (pName.includes('Federation of Chinese Enterprise Associations in Japan')) {
            return { ...base, x: base.x + toCanvasPx(20), y: base.y - toCanvasPx(20) }
          }
          // Comprehensive Legal and Accounting Firms：向上 100px（屏幕 px）
          if (pName.includes('Comprehensive Legal and Accounting Firms')) {
            return { ...base, y: base.y - toCanvasPx(100) }
          }
          // Major Japanese Insurance Companies：向上 20px
          if (pName.includes('Major Japanese Insurance Companies')) {
            return { ...base, y: base.y - toCanvasPx(20) }
          }
          // Major Guarantee Companies：向上 40px（屏幕 px）
          if (pName.includes('Major Guarantee Companies')) {
            return { ...base, y: base.y - toCanvasPx(40) }
          }
        }

        return base
      })

      const rects = targets.map((t) => ({ ...t }))

      for (let iter = 0; iter < iterations; iter++) {
        for (let i = 0; i < rects.length; i++) {
          rects[i].x += (targets[i].x - rects[i].x) * anchorK
          rects[i].y += (targets[i].y - rects[i].y) * anchorK
        }

        for (let i = 0; i < rects.length; i++) {
          for (let j = i + 1; j < rects.length; j++) {
            if (!overlaps(rects[i], rects[j])) continue
            const dx = rects[i].x - rects[j].x
            const dy = rects[i].y - rects[j].y
            const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy))
            const ux = dx / dist
            const uy = dy / dist
            const desiredX = (rects[i].w + rects[j].w) / 2 + gapX
            const desiredY = (rects[i].h + rects[j].h) / 2 + gapY
            const overlapX = desiredX - Math.abs(dx)
            const overlapY = desiredY - Math.abs(dy)
            const push = pushK * Math.max(overlapX, overlapY)
            rects[i].x += ux * push
            rects[i].y += uy * push
            rects[j].x -= ux * push
            rects[j].y -= uy * push
          }
        }

        for (let i = 0; i < rects.length; i++) {
          const dx = rects[i].x - ringCenterX
          const dy = rects[i].y - ringCenterY
          const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy))
          const minDist = centerR + rects[i].h / 2 + 12
          if (dist < minDist) {
            const ux = dx / dist
            const uy = dy / dist
            const push = (minDist - dist) * 0.9
            rects[i].x += ux * push
            rects[i].y += uy * push
          }
        }

        for (let i = 0; i < rects.length; i++) {
          const halfW = rects[i].w / 2
          const halfH = rects[i].h / 2
          rects[i].x = clamp(rects[i].x, halfW + padding, containerWidth - halfW - padding)
          rects[i].y = clamp(rects[i].y, halfH + padding, containerHeight - halfH - padding)
        }
      }

      for (let i = 0; i < rects.length; i++) {
        for (let j = i + 1; j < rects.length; j++) {
          if (overlaps(rects[i], rects[j])) return null
        }
      }

      return rects
    }

    // 逐步缩小外框直到不重叠（只影响手机端，不影响文字大小/桌面）
    const isEnglishPhonePortrait = showMobilePortrait && language === 'en'

    const factors = isEnglishPhonePortrait
      ? [1, 0.97, 0.94, 0.91, 0.88, 0.85, 0.82, 0.78, 0.74, 0.7, 0.66, 0.62, 0.58, 0.54, 0.5, 0.46, 0.42]
      : (showMobilePortrait ? [1, 0.97, 0.94, 0.91, 0.88, 0.85] : [1, 0.96, 0.92, 0.88])
    for (const f of factors) {
      const dims = baseDims.map((d) => ({ w: Math.round(d.w * f), h: Math.round(d.h * f) }))
      const out = solve(dims)
      if (out) return out
    }

    // 最后兜底：仍然保持“单圈环绕”，只会继续缩小外框（不改变排列）
    const fallbackFactor = showMobilePortrait ? (language === 'en' ? 0.4 : 0.5) : 0.55
    const dims = baseDims.map((d) => ({ w: Math.round(d.w * fallbackFactor), h: Math.round(d.h * fallbackFactor) }))
    return solve(dims) || []
  }, [partners.length, partners, phoneCardDims, phoneCardBaseW, phoneCardBaseH, isPhoneNetwork, containerWidth, containerHeight, centerX, phoneCenterSize, showMobilePortrait, language, mobileNetworkScale])

  // /qichu：手机端布局编辑/使用已保存布局
  const layoutStorageKey = useMemo(() => `qichu-layout-mobile-portrait-${language}`, [language])
  const layoutFontKey = useMemo(() => `qichu-layout-font-delta-${language}`, [language])

  // 初始化：进入 edit/use 时
  // 1) 优先加载 localStorage（如果你正在微调）
  // 2) 否则使用代码内置 preset（用户定稿）
  // 3) 再否则回退到自动布局
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!isPhoneNetwork) return
    if (!(layoutEdit || layoutUseSaved)) return
    if (layoutEditInitRef.current) return
    // iPad + layout=edit 也允许初始化编辑布局
    if (!(showMobilePortrait || isEditOnIpad)) return

    // 先恢复字号偏移（不依赖 rect 是否成功加载）
    try {
      const rawFont = window.localStorage.getItem(layoutFontKey)
      if (rawFont != null) {
        const n = Number(rawFont)
        if (Number.isFinite(n)) setLayoutFontDeltaPx(Math.max(-12, Math.min(24, Math.round(n))))
      }
    } catch {}

    const tryLoad = () => {
      try {
        const raw = window.localStorage.getItem(layoutStorageKey)
        if (raw) {
          const parsed = JSON.parse(raw)
          if (Array.isArray(parsed)) {
            const arr = parsed as any[]
            const ok = arr.length === partners.length && arr.every((r) => r && typeof r.x === 'number' && typeof r.y === 'number')
            if (ok) {
              const merged = arr.map((r, idx) => ({
                x: r.x,
                y: r.y,
                w: typeof r.w === 'number' ? r.w : (partnerRingLayout[idx]?.w ?? phoneCardBaseW),
                h: typeof r.h === 'number' ? r.h : (partnerRingLayout[idx]?.h ?? phoneCardBaseH),
              }))
              setLayoutEditRects(merged)
              setLayoutJsonText(JSON.stringify(merged, null, 2))
              setLayoutEditStatus('loaded')
              layoutEditInitRef.current = true
              return true
            }
          }
        }
      } catch {}
      return false
    }

    const loaded = tryLoad()
    if (!loaded) {
      const preset =
        isEditOnIpad
          ? (QICHU_IPAD_LAYOUT_PRESET[language] ?? QICHU_IPAD_LAYOUT_PRESET.default)
          : QICHU_MOBILE_PORTRAIT_LAYOUT_PRESET[language]
      const presetOk = Array.isArray(preset) && preset.length === partners.length
      if (presetOk) {
        const base = preset as QichuLayoutRect[]
        setLayoutEditRects(base)
        setLayoutJsonText(JSON.stringify(base, null, 2))
        setLayoutEditStatus(isEditOnIpad ? 'preset_ipad' : 'preset')
        layoutEditInitRef.current = true
        return
      }

      const base = partnerRingLayout.length === partners.length
        ? partnerRingLayout
        : Array.from({ length: partners.length }, (_, i) => partnerRingLayout[i] || { x: centerX, y: phoneCenterY, w: phoneCardBaseW, h: phoneCardBaseH })
      const seeded = base.map((r) => ({ x: r.x, y: r.y, w: r.w, h: r.h }))
      setLayoutEditRects(seeded)
      setLayoutJsonText(JSON.stringify(seeded, null, 2))
      setLayoutEditStatus('seeded')
      layoutEditInitRef.current = true
    }
  }, [layoutEdit, layoutUseSaved, layoutStorageKey, layoutFontKey, partners.length, partnerRingLayout, showMobilePortrait, isPhoneNetwork, isEditOnIpad, phoneCardBaseW, phoneCardBaseH, centerX, phoneCenterY])

  // 编辑模式：拖拽时按“屏幕像素”移动 -> 转换成画布坐标（除以 mobileNetworkScale）
  const layoutCanvasDelta = useMemo(() => {
    const s = Math.max(0.12, mobileNetworkScale || 0.25)
    return (screenDelta: number) => screenDelta / s
  }, [mobileNetworkScale])

  const phoneLayoutRects = useMemo(() => {
    // 横版：恢复为原来的自动环绕布局（不要被竖版 preset / 编辑状态影响）
    if (showMobileLandscape && isPhoneNetwork) return partnerRingLayout as QichuLayoutRect[]

    // iPad：默认使用内置 iPad 预设（正常访问也生效）
    if (isIpadNetwork) {
      const preset = QICHU_IPAD_LAYOUT_PRESET[language] ?? QICHU_IPAD_LAYOUT_PRESET.default
      if (Array.isArray(preset) && preset.length === partners.length) return preset as QichuLayoutRect[]
      return partnerRingLayout as QichuLayoutRect[]
    }

    // 竖版：可用 preset / 编辑布局
    if (!(showMobilePortrait && isPhoneNetwork)) return [] as QichuLayoutRect[]

    // 编辑/使用本地保存：优先使用用户正在编辑的 rects
    if ((layoutEdit || layoutUseSaved) && layoutEditRects.length === partners.length) return layoutEditRects

    // 正常模式：如果代码内置了该语言的定稿布局，则直接使用
    const preset = QICHU_MOBILE_PORTRAIT_LAYOUT_PRESET[language]
    if (Array.isArray(preset) && preset.length === partners.length) return preset as QichuLayoutRect[]

    // 兜底：自动布局
    return partnerRingLayout as QichuLayoutRect[]
  }, [layoutEdit, layoutUseSaved, layoutEditRects, partners.length, showMobilePortrait, showMobileLandscape, isPhoneNetwork, partnerRingLayout, language])

  // 桌面端角度分布（所有语言复用）；用 useMemo 放在前面，避免后续 useMemo “先用后声明” 的 TS 报错
  const angleOffsets: number[] = useMemo(() => {
    const arr: number[] = []
    for (let i = 0; i < partners.length; i++) {
      let angle = (i * 360) / partners.length
      if (i === 8) {
        angle = 310
      }
      arr.push(angle)
    }
    return arr
  }, [partners.length])

  // 英文桌面端：沿用“与其他语言相同的基础布局”，只做最小位移的“避碰”防遮挡；
  // 同时根据文字长度估算卡片高度，让内容完整显示且不出现大量无意义空白。
  const isEnglishDesktopNetwork = language === 'en' && !isPhoneNetwork && isDesktop
  const englishDesktopResolvedLayout = useMemo(() => {
    const n = partners.length
    if (!isEnglishDesktopNetwork || n === 0) return [] as Array<{ x: number; y: number; w: number; h: number }>

    const padding = 12
    const gapX = 14
    const gapY = 12

    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))
    const overlaps = (a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }) => {
      return (
        Math.abs(a.x - b.x) < (a.w + b.w) / 2 + gapX &&
        Math.abs(a.y - b.y) < (a.h + b.h) / 2 + gapY
      )
    }

    const estimateLines = (text: string, charsPerLine: number) => {
      const t = (text || '').trim()
      if (!t) return 1
      return Math.max(1, Math.ceil(t.length / Math.max(8, charsPerLine)))
    }

    // 文字排版（用于估算高度，也用于后面渲染的字体大小）
    const titleFont = 20
    const descFont = 15
    const titleLineH = 24
    const descLineH = 19
    const iconRowH = 48
    const headerGap = 8
    const pad = 14

    // 先按“老的桌面布局规则”算出每个卡片的目标位置/宽度（保持和其它语言一致）
    const targets: Array<{ x: number; y: number; w: number; h: number }> = []
    for (let index = 0; index < n; index++) {
      const angleDeg = angleOffsets[index] - 90
      const radians = angleDeg * (Math.PI / 180)

      let finalRadius = baseRadius
      if (index === 0 || index === 6 || index === 7) finalRadius = baseRadius * 0.85
      else if (index === 8) finalRadius = baseRadius * 0.92

      let x = Math.round((centerX + finalRadius * Math.cos(radians)) * 100) / 100
      let y = Math.round((centerY + finalRadius * Math.sin(radians)) * 100) / 100

      // 位置微调（保持历史行为）
      if (index === 1) x += 120
      else if (index === 8) {
        x -= 40
        y -= 30
      } else if (index === 0) {
        y -= 10
        x += 30
      } else if (index === 6) {
        y -= 10
        x -= 20
      } else if (index === 7) x -= 20
      else if (index === 4) {
        y += 20
        x += 60
      } else if (index === 3) y -= 20

      let w = 300
      if (partners[index]?.wide) w = 360
      // 与现有“拉宽”保持一致的宽度（尽量少改视觉）
      if (index === 0) w = Math.max(w, 350)
      else if (index === 1) w = Math.max(w, 330)
      else if (index === 2) w = Math.max(w, 370)
      else if (index === 3) w = Math.max(w, 340)
      else if (index === 4) w = Math.max(w, 360)
      else if (index === 5) w = Math.max(w, 320)
      else if (index === 6) w = Math.max(w, 300)
      else if (index === 7) w = Math.max(w, 290)
      else if (index === 8) w = Math.max(w, 290)

      // 高度：按文本长度估算（不截断），避免“字小+空白大”
      const titleCharsPerLine = w >= 340 ? 26 : 22
      const descCharsPerLine = w >= 340 ? 55 : 44
      const titleLines = estimateLines(partners[index]?.name || '', titleCharsPerLine)
      const descLines = estimateLines(partners[index]?.desc || '', descCharsPerLine)
      const h = pad * 2 + iconRowH + headerGap + titleLines * titleLineH + descLines * descLineH

      targets.push({ x, y, w, h })
    }

    // 以 targets 为初始位置，做轻微“避碰”迭代，让卡片不互相遮挡，同时尽量贴回原位
    const rects = targets.map((t) => ({ ...t }))
    const anchorK = 0.04 // 拉回目标位置的弹簧强度（越大越贴回原样）
    const pushK = 0.55 // 推开重叠的力度
    const iterations = 140

    for (let iter = 0; iter < iterations; iter++) {
      for (let i = 0; i < rects.length; i++) {
        // pull towards target
        rects[i].x += (targets[i].x - rects[i].x) * anchorK
        rects[i].y += (targets[i].y - rects[i].y) * anchorK
      }

      for (let i = 0; i < rects.length; i++) {
        for (let j = i + 1; j < rects.length; j++) {
          if (!overlaps(rects[i], rects[j])) continue
          const dx = rects[i].x - rects[j].x
          const dy = rects[i].y - rects[j].y
          const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy))
          // 推开方向（避免完全水平/垂直卡死）
          const ux = dx / dist
          const uy = dy / dist
          const desiredX = (rects[i].w + rects[j].w) / 2 + gapX
          const desiredY = (rects[i].h + rects[j].h) / 2 + gapY
          const overlapX = desiredX - Math.abs(dx)
          const overlapY = desiredY - Math.abs(dy)
          const push = pushK * Math.max(overlapX, overlapY)
          rects[i].x += ux * push
          rects[i].y += uy * push
          rects[j].x -= ux * push
          rects[j].y -= uy * push
        }
      }

      // keep within bounds
      for (let i = 0; i < rects.length; i++) {
        const halfW = rects[i].w / 2
        const halfH = rects[i].h / 2
        rects[i].x = clamp(rects[i].x, halfW + padding, containerWidth - halfW - padding)
        rects[i].y = clamp(rects[i].y, halfH + padding, containerHeight - halfH - padding)
      }
    }

    return rects
  }, [partners, partners.length, isEnglishDesktopNetwork, centerX, centerY, containerWidth, containerHeight, baseRadius, angleOffsets])

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
      // 同步 viewport（用于手机端等比缩放占位）
      setClientViewport({ w: width, h: height, dpr: window.devicePixelRatio || 1 })
      const isPortrait = height > width
      // 兜底：部分手机（尤其内置/微信浏览器）会把 innerWidth 算得很大，导致 width<=767 判断失效
      // 用“触摸设备 + 短边阈值”补一层 phoneLike 判断，确保手机端一定走手机分支（避免整块网络图被裁掉）
      const isTouch = 'ontouchstart' in window || (navigator as any)?.maxTouchPoints > 0
      const isPhoneLike = isTouch && Math.min(width, height) < 700
      // 进一步兜底：有些手机在“请求桌面站点/特殊 WebView”里会把 viewport 伪装成 980px+
      // 这时用 UA 强制识别“手机”更可靠（不影响 iPad）。
      const ua = (navigator.userAgent || '').toLowerCase()
      const isPhoneUA =
        ua.includes('iphone') ||
        (ua.includes('android') && ua.includes('mobile')) ||
        ua.includes('windows phone')
      // iPadOS Safari 有时会伪装成 Macintosh（但 maxTouchPoints > 1）
      const isIpadUA =
        ua.includes('ipad') ||
        (ua.includes('macintosh') && (navigator as any)?.maxTouchPoints > 1)

      // 手机竖版：宽度 ≤767 且竖屏（与CSS媒体查询匹配）
      const mobilePortrait = (width <= 767 && isPortrait) || (isPhoneLike && isPortrait) || (isPhoneUA && isPortrait)
      setShowMobilePortrait(mobilePortrait)

      // iPad竖版：宽度 768–1023 且竖屏（与CSS媒体查询匹配；并用 UA 兜底）
      const ipadPortrait = ((width >= 768 && width <= 1023) || (isIpadUA && width >= 700 && width <= 1100)) && isPortrait
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

      // iPad Pro竖版：宽度 1024–1279 且竖屏（iPad Pro 12.9"竖版；并用 UA 兜底）
      const ipadProPortrait = ((width >= 1024 && width <= 1279) || (isIpadUA && width >= 900 && width <= 1400)) && isPortrait
      setShowIpadProPortrait(ipadProPortrait)

      // iPad横版：原先限定到 <=1369，但 iPadOS Safari 有时会报更大（缩放/桌面站点）
      // 用 UA + 触摸兜底，避免误判为桌面端导致“首屏不绘制/必须滚动才出现”
      const ipadLandscape = !isPortrait && (
        (width >= 1024 && width <= 1369) ||
        (isIpadUA && width >= 900 && width <= 1700)
      )
      setShowIpadLandscape(ipadLandscape)

      // 手机横版：width <= 1023 && !isPortrait（与CSS媒体查询匹配）
      const mobileLandscape = (width <= 1023 && !isPortrait) || (isPhoneLike && !isPortrait) || (isPhoneUA && !isPortrait)
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

    // 立即执行一次
    checkViewport()
    // iOS/iPadOS：首屏经常在地址栏/工具栏收起前后 innerHeight 会变化
    // 这里做两次延迟重算，避免“必须滑一下才显示”
    const t1 = window.setTimeout(() => checkViewport(), 50)
    const t2 = window.setTimeout(() => checkViewport(), 300)

    const handleResize = () => {
      checkViewport()
    }
    
    const handleOrientationChange = () => {
      checkViewport()
    }
    
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleOrientationChange)
    // iPad Safari：visualViewport 变化（地址栏收起/弹出）不会总是触发 window.resize
    const vv = (window as any).visualViewport as VisualViewport | undefined
    const handleVV = () => checkViewport()
    vv?.addEventListener?.('resize', handleVV)
    vv?.addEventListener?.('scroll', handleVV)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleOrientationChange)
      vv?.removeEventListener?.('resize', handleVV)
      vv?.removeEventListener?.('scroll', handleVV)
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [])

  return (
    <PageLayout>
      {/* 硬标记：用于抓取 HTML 验证当前站点是否已更新到最新构建 */}
      <div data-qichu-build={buildStamp} style={{ display: 'none' }} />
      {(process.env.NODE_ENV !== 'production' || debug) ? (
        <div
          className="fixed top-2 right-2 z-[9999] rounded-md bg-black/70 text-white text-[11px] px-2 py-1 border border-white/20"
          style={{ pointerEvents: 'none' }}
        >
          {process.env.NODE_ENV !== 'production' ? 'DEV ' : ''}{debugStamp}{clientHost ? ` @ ${clientHost}` : ''}
        </div>
      ) : null}

      {probe ? (
        <div
          className="fixed bottom-2 left-2 z-[9999] rounded-md bg-red-600 text-white text-[12px] px-2 py-1 border border-white/30"
          style={{ pointerEvents: 'none' }}
        >
          PROBE {debugStamp}{clientHost ? ` @ ${clientHost}` : ''} | {clientViewport.w}×{clientViewport.h} dpr{clientViewport.dpr}
        </div>
      ) : null}
      <div className="relative">
        {/* Hero Section with Background Image */}
        <section className="relative pt-16 sm:pt-24 lg:pt-28 pb-10 sm:pb-14 lg:pb-16 bg-gradient-to-br from-green-800 via-green-700 to-navy-800 overflow-hidden">
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
          <div className="relative z-10 container-custom">
            <p className="text-xs md:text-sm text-green-300 font-semibold mb-2 md:mb-4 drop-shadow-md">
              {t('qichu.subtitle')}
              {(showMobilePortrait || showMobileLandscape || showIpadPortrait || showIpadLandscape || showIpadProPortrait) ? (
                <span className="ml-2 text-[10px] font-normal text-white/70">v{buildStamp}</span>
              ) : null}
            </p>
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 md:mb-6 drop-shadow-lg">{t('qichu.title')}</h1>
            <p className="text-sm md:text-base lg:text-lg text-gray-200 max-w-3xl leading-snug md:leading-relaxed drop-shadow-md">
              {t('qichu.description')}
            </p>
          </div>
        </section>

        {/* 手机竖版：收紧 services 整段的上下留白；同时取消 section-padding 的左右 padding，避免叠加 container padding 导致“离边缘很远” */}
        <section id="services" className="section-padding !py-10 md:!py-16 !px-0" style={{ position: 'relative', zIndex: 10 }}>
          {/* 相关服务：保持正常左右留白 */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-5 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">{t('qichu.services.title')}</h2>
              <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto px-0">
                {t('qichu.services.subtitle')}
              </p>
            </div>

            <div className="qichu-related-services-grid grid gap-3 md:gap-6 mb-3 md:mb-8 relative z-10">
              {relatedServices.map((service, idx) => {
                const Icon = relatedServiceIcons[idx] || Store
                return (
                  <div
                    key={`${service.name}-${idx}`}
                    // Mobile Safari: backdrop-blur + long text can paint incorrectly.
                    // Use a solid background on mobile, and only enable blur/gradient on md+.
                    className="qichu-related-service-card group bg-white/95 md:bg-gradient-to-br md:from-white md:to-green-50/50 md:backdrop-blur-sm border-2 border-green-100 rounded-xl md:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 md:hover:-translate-y-2 hover:border-green-300 relative z-10"
                    style={{
                      pointerEvents: 'auto',
                      // iOS：避免“背景不跟随内容高度更新”的偶发绘制问题
                      contain: 'layout paint',
                      // 不裁切文字（裁切会让你更烦）；通过布局保证不溢出
                      overflow: 'visible',
                      isolation: 'isolate',
                    }}
                  >
                    <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                      <div className="w-9 h-9 md:w-14 md:h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                        <Icon className="w-5 h-5 md:w-7 md:h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[16px] md:text-lg font-bold text-navy-700 mb-1 md:mb-2 group-hover:text-green-600 transition-colors break-words">
                          {service.name}
                        </h3>
                        <p
                          className="text-[13px] md:text-base text-gray-700 leading-snug md:leading-relaxed break-words"
                          style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                        >
                          {service.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 一站式服务优势（就是你说的“相关服务下方两段文字”） */}
          {/* 手机竖版：单独控制左右留白，尽量贴边（避免 container-custom 在 768px 下强制 px-6 造成大空隙） */}
          {/* 手机竖版：做成 edge-to-edge，尽量消除“外容器到卡片”的左右空隙 */}
          <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-none sm:rounded-xl md:rounded-2xl border-y border-white/10 sm:border bg-gradient-to-br from-navy-900/70 via-navy-900/40 to-green-900/50 shadow-2xl">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-green-500/15 blur-3xl" />
                <div className="absolute -bottom-28 -left-28 w-72 h-72 rounded-full bg-cyan-400/10 blur-3xl" />
              </div>

              {/* 手机竖版：减少外层/内层 padding，压缩文字与容器边缘的无用空间 */}
              <div className="relative !p-1 sm:!p-4 md:!p-8 lg:!p-10">
                <div className="rounded-none sm:rounded-xl border-y border-white/10 sm:border bg-black/20 !p-1 sm:!p-4 md:!p-6">
                  <p className="text-gray-100/90 text-sm md:text-base leading-snug md:leading-relaxed whitespace-pre-line">
                    {t('qichu.oneStop.summary')}
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
            // NOTE: 不要带 desktop-partners-network（它会被 globals.css 的旧规则命中，强制 scale(0.3)）
            "section-padding partners-section qichu-partners-network",
            // 只裁 x，不裁 y：避免绝对定位/缩放时被裁切导致“整块消失”
            "relative z-10 w-full overflow-x-hidden overflow-y-visible box-border",
            "pt-0 pb-2",
            "h-[600px] min-h-[600px]",
            "tablet:h-[812px] tablet:min-h-[812px]",
            "tablet-lg:h-[1000px] tablet-lg:min-h-[1000px]",
            "desktop:h-[1000px] desktop:min-h-[1000px]"
          )}
          style={{
            // 简化逻辑：清晰的设备分支
            // 手机竖屏：减少顶部无用留白，避免标题/文案被整体“压下去”
            paddingTop: isDesktop || showIpadProPortrait || showIpadPortrait
              ? '0'
              : (showMobilePortrait ? '8px' : '43px'),
            // 竖屏窄屏：把左右 padding 压到 0（让标题/文案尽量贴边）
            paddingLeft: isNarrowPortrait ? '0px' : undefined,
            paddingRight: isNarrowPortrait ? '0px' : undefined,
            paddingBottom: '8px',
            outline: probe ? '4px solid #ff00ff' : undefined,
            outlineOffset: probe ? '-4px' : undefined,
            // 高度分配：
            // - 桌面版/iPad Pro竖版：1000px（正常显示）
            // - iPad竖版：1000px（与桌面版相同，确保内容正确显示）
            // - 手机竖版：600px
            // - 其他（iPad横版/手机横版）：812px
            // 移动端：不要固定高度（否则绝对定位的网络图容易压到标题/文案）
            // iPad 横版也需要固定高度：否则内部 absolute 定位会导致 section 高度塌陷，看起来像“网络图消失”
            minHeight: (isDesktop || showIpadProPortrait || showIpadPortrait || showIpadLandscape) ? '1000px' : 'auto',
            height: (isDesktop || showIpadProPortrait || showIpadPortrait || showIpadLandscape) ? '1000px' : 'auto',
          }}
        >
          {/* 这里不要再套一层 container-custom（它本身带左右 padding，叠加 section-padding 会导致手机竖版“离边缘太远”） */}
          <div className="max-w-7xl mx-auto w-full" style={{ overflow: 'visible' }}>
            <div className="text-center sm:text-center mb-2.5 sm:mb-4">
              <h2 className="text-center sm:text-center text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">
                {t('qichu.partners.title')}
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                {t('qichu.partners.description')}
              </p>
            </div>
          </div>

          {/* Partners Network：移动端用纯 CSS 控制显示（不依赖 JS 判定），避免手机端整块“消失”
              iPad：也强制走静态“可缩放画布布局”（并且 layout=edit 时显示编辑面板）。 */}
          <div className={cn("lg:hidden", (isIpadNetwork || layoutEdit) ? "!block" : "")}>
            <div
              className="mx-auto"
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                // 让下一块内容自然排在下面，不要靠绝对定位硬塞
                paddingBottom: '6px',
              }}
            >
              <div
                ref={mobileStageRef}
                style={{
                  width: `${mobileNetworkScaledW}px`,
                  height: `${mobileNetworkScaledH}px`,
                  position: 'relative',
                  // 去掉圆角白色底板（用户要求）
                  background: 'transparent',
                  border: 'none',
                  borderRadius: 0,
                  boxShadow: 'none',
                  overflow: 'visible',
                  zIndex: 50,
                }}
              >
                {layoutEdit ? (
                  <div
                    style={{
                      position: 'absolute',
                      left: layoutPanelPos.x,
                      top: layoutPanelPos.y,
                      zIndex: 20000,
                      pointerEvents: 'auto',
                    }}
                  >
                    {!layoutPanelOpen ? (
                      <button
                        type="button"
                        onClick={() => setLayoutPanelOpen(true)}
                        style={{
                          borderRadius: 999,
                          padding: '8px 10px',
                          fontSize: 12,
                          fontWeight: 900,
                          border: '1px solid rgba(15,23,42,0.18)',
                          background: 'rgba(255,255,255,0.92)',
                          color: '#0f172a',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
                          cursor: 'pointer',
                        }}
                      >
                        Editor
                      </button>
                    ) : (
                      <div
                        style={{
                          width: 'min(78vw, 320px)',
                          background: 'rgba(255,255,255,0.92)',
                          border: '1px solid rgba(15,23,42,0.18)',
                          borderRadius: 14,
                          boxShadow: '0 18px 60px rgba(0,0,0,0.35)',
                          padding: 10,
                        }}
                      >
                        <div
                          onPointerDown={(e) => {
                            try {
                              ;(e.currentTarget as any).setPointerCapture?.(e.pointerId)
                            } catch {}
                            layoutPanelDragRef.current = {
                              pointerId: e.pointerId,
                              startClientX: e.clientX,
                              startClientY: e.clientY,
                              startX: layoutPanelPos.x,
                              startY: layoutPanelPos.y,
                            }
                          }}
                          onPointerMove={(e) => {
                            const cur = layoutPanelDragRef.current
                            if (!cur) return
                            if (cur.pointerId !== e.pointerId) return
                            const dx = e.clientX - cur.startClientX
                            const dy = e.clientY - cur.startClientY
                            // 粗略限制在舞台范围内
                            const maxX = Math.max(0, mobileNetworkScaledW - 80)
                            const maxY = Math.max(0, mobileNetworkScaledH - 80)
                            const nx = Math.max(0, Math.min(maxX, cur.startX + dx))
                            const ny = Math.max(0, Math.min(maxY, cur.startY + dy))
                            setLayoutPanelPos({ x: nx, y: ny })
                          }}
                          onPointerUp={(e) => {
                            const cur = layoutPanelDragRef.current
                            if (!cur) return
                            if (cur.pointerId !== e.pointerId) return
                            layoutPanelDragRef.current = null
                          }}
                          onPointerCancel={(e) => {
                            const cur = layoutPanelDragRef.current
                            if (!cur) return
                            if (cur.pointerId !== e.pointerId) return
                            layoutPanelDragRef.current = null
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 10,
                            marginBottom: 6,
                            cursor: 'grab',
                            userSelect: 'none',
                            WebkitUserSelect: 'none',
                          }}
                        >
                          <div style={{ fontSize: 12, fontWeight: 900, color: '#0f172a' }}>
                            Layout editor · v{buildStamp}
                          </div>
                          <button
                            type="button"
                            onClick={() => setLayoutPanelOpen(false)}
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 10,
                              border: '1px solid rgba(15,23,42,0.16)',
                              background: 'rgba(255,255,255,0.9)',
                              color: '#0f172a',
                              fontSize: 16,
                              lineHeight: '26px',
                              textAlign: 'center',
                              cursor: 'pointer',
                              flexShrink: 0,
                            }}
                            aria-label="Close"
                          >
                            ×
                          </button>
                        </div>

                        <div style={{ fontSize: 12, color: '#334155', lineHeight: 1.25, marginBottom: 8 }}>
                          Drag cards. You can drag this panel by its header.
                        </div>
                        {layoutSelectedIndex >= 0 && partners[layoutSelectedIndex] ? (
                          <div style={{ marginBottom: 8 }}>
                            <div style={{ fontSize: 11, fontWeight: 900, color: '#0f172a' }}>Selected</div>
                            <div style={{ fontSize: 12, fontWeight: 800, color: '#334155', lineHeight: 1.2 }}>
                              {partners[layoutSelectedIndex].name}
                            </div>
                          </div>
                        ) : (
                          <div style={{ marginBottom: 8, fontSize: 12, color: '#64748b' }}>
                            Tap/drag a card to select it.
                          </div>
                        )}
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={() => {
                              try {
                                window.localStorage.setItem(layoutStorageKey, JSON.stringify(layoutEditRects))
                                window.localStorage.setItem(layoutFontKey, String(layoutFontDeltaPx))
                                setLayoutEditStatus('saved')
                              } catch {
                                setLayoutEditStatus('save_failed')
                              }
                            }}
                            style={{
                              borderRadius: 999,
                              padding: '7px 10px',
                              fontSize: 12,
                              fontWeight: 800,
                              border: '1px solid rgba(16,185,129,0.35)',
                              color: '#16a34a',
                              background: 'rgba(16,185,129,0.08)',
                              cursor: 'pointer',
                            }}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              await copyLayoutJsonToClipboard()
                            }}
                            style={{
                              borderRadius: 999,
                              padding: '7px 10px',
                              fontSize: 12,
                              fontWeight: 800,
                              border: '1px solid rgba(99,102,241,0.35)',
                              color: '#4f46e5',
                              background: 'rgba(99,102,241,0.08)',
                              cursor: 'pointer',
                            }}
                          >
                            Copy JSON
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const text = JSON.stringify(layoutEditRects, null, 2)
                              setLayoutJsonText(text)
                              setLayoutJsonModalOpen(true)
                              setLayoutEditStatus('json_open')
                              requestAnimationFrame(() => {
                                const el = layoutJsonTextareaRef.current
                                if (!el) return
                                el.focus()
                                el.select()
                              })
                            }}
                            style={{
                              borderRadius: 999,
                              padding: '7px 10px',
                              fontSize: 12,
                              fontWeight: 800,
                              border: '1px solid rgba(15,23,42,0.18)',
                              color: '#0f172a',
                              background: 'rgba(15,23,42,0.06)',
                              cursor: 'pointer',
                            }}
                          >
                            Open JSON
                          </button>
                          <button
                            type="button"
                            onClick={() => downloadLayoutJson()}
                            style={{
                              borderRadius: 999,
                              padding: '7px 10px',
                              fontSize: 12,
                              fontWeight: 800,
                              border: '1px solid rgba(2,132,199,0.35)',
                              color: '#0369a1',
                              background: 'rgba(2,132,199,0.08)',
                              cursor: 'pointer',
                            }}
                          >
                            Download
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const base = partnerRingLayout.length === partners.length ? partnerRingLayout : []
                              if (base.length === partners.length) {
                                const next = base.map((r) => ({ x: r.x, y: r.y, w: r.w, h: r.h }))
                                setLayoutEditRects(next)
                                setLayoutJsonText(JSON.stringify(next, null, 2))
                                setLayoutFontDeltaPx(0)
                                try { window.localStorage.setItem(layoutFontKey, '0') } catch {}
                                setLayoutEditStatus('reset')
                              }
                            }}
                            style={{
                              borderRadius: 999,
                              padding: '7px 10px',
                              fontSize: 12,
                              fontWeight: 800,
                              border: '1px solid rgba(15,23,42,0.18)',
                              color: '#0f172a',
                              background: 'rgba(15,23,42,0.06)',
                              cursor: 'pointer',
                            }}
                          >
                            Reset
                          </button>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '6px 8px',
                              borderRadius: 999,
                              border: '1px solid rgba(15,23,42,0.16)',
                              background: 'rgba(255,255,255,0.75)',
                            }}
                          >
                            <div style={{ fontSize: 12, fontWeight: 900, color: '#0f172a' }}>Font</div>
                            <button
                              type="button"
                              onClick={() => {
                                setLayoutFontDeltaPx((v) => {
                                  const nv = Math.max(-12, Math.min(24, v - 1))
                                  try { window.localStorage.setItem(layoutFontKey, String(nv)) } catch {}
                                  return nv
                                })
                                setLayoutEditStatus('font_down')
                              }}
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: 10,
                                border: '1px solid rgba(15,23,42,0.16)',
                                background: 'rgba(15,23,42,0.06)',
                                color: '#0f172a',
                                fontSize: 16,
                                fontWeight: 900,
                                lineHeight: '26px',
                                textAlign: 'center',
                                cursor: 'pointer',
                              }}
                              aria-label="Font -"
                            >
                              −
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setLayoutFontDeltaPx((v) => {
                                  const nv = Math.max(-12, Math.min(24, v + 1))
                                  try { window.localStorage.setItem(layoutFontKey, String(nv)) } catch {}
                                  return nv
                                })
                                setLayoutEditStatus('font_up')
                              }}
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: 10,
                                border: '1px solid rgba(15,23,42,0.16)',
                                background: 'rgba(15,23,42,0.06)',
                                color: '#0f172a',
                                fontSize: 16,
                                fontWeight: 900,
                                lineHeight: '26px',
                                textAlign: 'center',
                                cursor: 'pointer',
                              }}
                              aria-label="Font +"
                            >
                              +
                            </button>
                            <div style={{ fontSize: 12, fontWeight: 900, color: '#334155', minWidth: 36, textAlign: 'right' }}>
                              {layoutFontDeltaPx >= 0 ? `+${layoutFontDeltaPx}` : String(layoutFontDeltaPx)}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (layoutSelectedIndex < 0) return
                              setLayoutEditRects((prev) => {
                                if (!Array.isArray(prev) || prev.length !== partners.length) return prev
                                const next = prev.slice()
                                const r0 = next[layoutSelectedIndex]
                                if (!r0) return prev
                                const nw = Math.min(640, Math.max(220, r0.w * 1.08))
                                const nh = Math.min(420, Math.max(110, r0.h * 1.08))
                                next[layoutSelectedIndex] = { ...r0, w: nw, h: nh }
                                setLayoutJsonText(JSON.stringify(next, null, 2))
                                return next
                              })
                              setLayoutEditStatus('scaled_up')
                            }}
                            style={{
                              borderRadius: 999,
                              padding: '7px 10px',
                              fontSize: 12,
                              fontWeight: 800,
                              border: '1px solid rgba(79,70,229,0.35)',
                              color: '#4f46e5',
                              background: 'rgba(79,70,229,0.08)',
                              cursor: 'pointer',
                            }}
                          >
                            Scale +
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (layoutSelectedIndex < 0) return
                              setLayoutEditRects((prev) => {
                                if (!Array.isArray(prev) || prev.length !== partners.length) return prev
                                const next = prev.slice()
                                const r0 = next[layoutSelectedIndex]
                                if (!r0) return prev
                                const nw = Math.min(640, Math.max(220, r0.w * 0.92))
                                const nh = Math.min(420, Math.max(110, r0.h * 0.92))
                                next[layoutSelectedIndex] = { ...r0, w: nw, h: nh }
                                setLayoutJsonText(JSON.stringify(next, null, 2))
                                return next
                              })
                              setLayoutEditStatus('scaled_down')
                            }}
                            style={{
                              borderRadius: 999,
                              padding: '7px 10px',
                              fontSize: 12,
                              fontWeight: 800,
                              border: '1px solid rgba(79,70,229,0.35)',
                              color: '#4f46e5',
                              background: 'rgba(79,70,229,0.08)',
                              cursor: 'pointer',
                            }}
                          >
                            Scale -
                          </button>
                        </div>
                        {layoutEditStatus ? (
                          <div style={{ marginTop: 8, fontSize: 11, fontWeight: 800, color: '#0f172a' }}>
                            status: {layoutEditStatus}
                          </div>
                        ) : null}
                        <details style={{ marginTop: 8 }}>
                          <summary style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', cursor: 'pointer' }}>
                            JSON
                          </summary>
                          <textarea
                            readOnly
                            value={layoutJsonText}
                            style={{
                              marginTop: 6,
                              width: '100%',
                              height: 160,
                              fontSize: 10,
                              lineHeight: 1.25,
                              fontFamily:
                                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                              borderRadius: 10,
                              border: '1px solid rgba(15,23,42,0.14)',
                              padding: 8,
                              background: 'rgba(255,255,255,0.9)',
                              color: '#0f172a',
                            }}
                          />
                        </details>
                      </div>
                    )}
                  </div>
                ) : null}
                {layoutEdit && layoutJsonModalOpen ? (
                  <div
                    onClick={() => setLayoutJsonModalOpen(false)}
                    style={{
                      position: 'fixed',
                      inset: 0,
                      zIndex: 30000,
                      background: 'rgba(0,0,0,0.6)',
                      padding: 'max(env(safe-area-inset-top), 12px) 12px max(env(safe-area-inset-bottom), 12px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'auto',
                    }}
                  >
                    <div
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        width: 'min(96vw, 560px)',
                        maxHeight: '86vh',
                        overflow: 'auto',
                        borderRadius: 16,
                        background: 'rgba(255,255,255,0.96)',
                        border: '1px solid rgba(15,23,42,0.16)',
                        boxShadow: '0 20px 70px rgba(0,0,0,0.45)',
                        padding: 12,
                        WebkitOverflowScrolling: 'touch',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                        <div style={{ fontSize: 12, fontWeight: 900, color: '#0f172a' }}>Layout JSON · v{buildStamp}</div>
                        <button
                          type="button"
                          onClick={() => setLayoutJsonModalOpen(false)}
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 10,
                            border: '1px solid rgba(15,23,42,0.16)',
                            background: 'rgba(255,255,255,0.9)',
                            color: '#0f172a',
                            fontSize: 18,
                            lineHeight: '32px',
                            textAlign: 'center',
                            cursor: 'pointer',
                          }}
                          aria-label="Close"
                        >
                          ×
                        </button>
                      </div>
                      <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={async () => {
                            await copyLayoutJsonToClipboard()
                          }}
                          style={{
                            borderRadius: 999,
                            padding: '7px 10px',
                            fontSize: 12,
                            fontWeight: 800,
                            border: '1px solid rgba(99,102,241,0.35)',
                            color: '#4f46e5',
                            background: 'rgba(99,102,241,0.08)',
                            cursor: 'pointer',
                          }}
                        >
                          Copy
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const el = layoutJsonTextareaRef.current
                            if (!el) return
                            el.focus()
                            el.select()
                            setLayoutEditStatus('selected')
                          }}
                          style={{
                            borderRadius: 999,
                            padding: '7px 10px',
                            fontSize: 12,
                            fontWeight: 800,
                            border: '1px solid rgba(15,23,42,0.18)',
                            color: '#0f172a',
                            background: 'rgba(15,23,42,0.06)',
                            cursor: 'pointer',
                          }}
                        >
                          Select all
                        </button>
                        <button
                          type="button"
                          onClick={() => downloadLayoutJson()}
                          style={{
                            borderRadius: 999,
                            padding: '7px 10px',
                            fontSize: 12,
                            fontWeight: 800,
                            border: '1px solid rgba(2,132,199,0.35)',
                            color: '#0369a1',
                            background: 'rgba(2,132,199,0.08)',
                            cursor: 'pointer',
                          }}
                        >
                          Download
                        </button>
                      </div>
                      <textarea
                        ref={(el) => {
                          layoutJsonTextareaRef.current = el
                        }}
                        readOnly
                        value={layoutJsonText}
                        style={{
                          marginTop: 10,
                          width: '100%',
                          height: 320,
                          fontSize: 10,
                          lineHeight: 1.25,
                          fontFamily:
                            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                          borderRadius: 12,
                          border: '1px solid rgba(15,23,42,0.14)',
                          padding: 10,
                          background: 'rgba(255,255,255,0.92)',
                          color: '#0f172a',
                        }}
                      />
                      <div style={{ marginTop: 8, fontSize: 12, color: '#334155', lineHeight: 1.3 }}>
                        If Copy fails, tap “Select all”, then long-press and choose “Copy”.
                      </div>
                    </div>
                  </div>
                ) : null}
                {probe ? (
                  <div
                    style={{
                      position: 'absolute',
                      left: 8,
                      top: 8,
                      zIndex: 999,
                      pointerEvents: 'none',
                      background: 'rgba(0,0,0,0.55)',
                      border: '1px solid rgba(255,255,255,0.22)',
                      borderRadius: 10,
                      padding: '8px 10px',
                      maxWidth: '92%',
                      color: 'rgba(255,255,255,0.95)',
                      fontWeight: 700,
                      fontSize: '12px',
                      lineHeight: 1.25,
                      textShadow: '0 2px 10px rgba(0,0,0,0.65)',
                    }}
                  >
                    <div>NETWORK PROBE · v{buildStamp}</div>
                    <div>partners: {partners.length} · scale: {String(mobileNetworkScale).slice(0, 5)}</div>
                    <div>
                      stage: {mobileNetworkScaledW}×{mobileNetworkScaledH} · base: {containerWidth}×{containerHeight}
                    </div>
                    {probeInfo ? (
                      <div style={{ marginTop: 6, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}>
                        <div>stage: {probeInfo.stage?.exists ? `${probeInfo.stage.rect.w}×${probeInfo.stage.rect.h}` : 'none'} · {probeInfo.stage?.style?.display}/{probeInfo.stage?.style?.visibility}/{probeInfo.stage?.style?.opacity}/{probeInfo.stage?.style?.zIndex}</div>
                        <div>root: {probeInfo.scaledRoot?.exists ? `${probeInfo.scaledRoot.rect.w}×${probeInfo.scaledRoot.rect.h}` : 'none'} · {probeInfo.scaledRoot?.style?.display}/{probeInfo.scaledRoot?.style?.visibility}/{probeInfo.scaledRoot?.style?.opacity}/{probeInfo.scaledRoot?.style?.zIndex}</div>
                        <div>map: {probeInfo.map?.exists ? `${probeInfo.map.rect.w}×${probeInfo.map.rect.h}` : 'none'} · {probeInfo.map?.style?.display}/{probeInfo.map?.style?.visibility}/{probeInfo.map?.style?.opacity}/{probeInfo.map?.style?.zIndex}</div>
                        <div>net: {probeInfo.net?.exists ? `${probeInfo.net.rect.w}×${probeInfo.net.rect.h}` : 'none'} · {probeInfo.net?.style?.display}/{probeInfo.net?.style?.visibility}/{probeInfo.net?.style?.opacity}/{probeInfo.net?.style?.zIndex}</div>
                        <div>map css: {probeInfo.map?.metrics?.cssSize?.w}×{probeInfo.map?.metrics?.cssSize?.h} · off {probeInfo.map?.metrics?.offset?.w}×{probeInfo.map?.metrics?.offset?.h} · cli {probeInfo.map?.metrics?.client?.w}×{probeInfo.map?.metrics?.client?.h}</div>
                        <div>net css: {probeInfo.net?.metrics?.cssSize?.w}×{probeInfo.net?.metrics?.cssSize?.h} · off {probeInfo.net?.metrics?.offset?.w}×{probeInfo.net?.metrics?.offset?.h} · cli {probeInfo.net?.metrics?.client?.w}×{probeInfo.net?.metrics?.client?.h}</div>
                        <div>root tfm: {String(probeInfo.scaledRoot?.metrics?.transform || '').slice(0, 42)}</div>
                        <div>map anc: {probeInfo.map?.hiddenAncestor ? `${probeInfo.map.hiddenAncestor.tag}#${probeInfo.map.hiddenAncestor.id}.${probeInfo.map.hiddenAncestor.cls} ${probeInfo.map.hiddenAncestor.display}/${probeInfo.map.hiddenAncestor.visibility}/${probeInfo.map.hiddenAncestor.opacity}` : 'none'}</div>
                        <div>net anc: {probeInfo.net?.hiddenAncestor ? `${probeInfo.net.hiddenAncestor.tag}#${probeInfo.net.hiddenAncestor.id}.${probeInfo.net.hiddenAncestor.cls} ${probeInfo.net.hiddenAncestor.display}/${probeInfo.net.hiddenAncestor.visibility}/${probeInfo.net.hiddenAncestor.opacity}` : 'none'}</div>
                        <div>img: {probeInfo.img?.exists ? `${probeInfo.img.natural?.w}×${probeInfo.img.natural?.h} complete=${String(probeInfo.img.complete)}` : 'none'}</div>
                      </div>
                    ) : (
                      <div style={{ marginTop: 6, opacity: 0.85 }}>collecting…</div>
                    )}
                  </div>
                ) : null}
                <div
                  ref={mobileScaledRootRef}
                  style={{
                    width: `${containerWidth}px`,
                    height: `${containerHeight}px`,
                    // 手机端：用“中心点 + translate(-50%, -50%)”确保整体在容器中居中（避免看起来偏左/偏右）
                    transform: `translate(-50%, -50%) scale(${mobileNetworkScale})`,
                    transformOrigin: 'center',
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    zIndex: 1,
                  }}
                >
                <div
                  ref={mobileWhiteBoxRef}
                  className="white-box-container"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: `${containerWidth}px`,
                    height: `${containerHeight}px`,
                    zIndex: 1,
                    // 手机端：提高可见度（否则在深色背景上像“消失”）
                    opacity: 0.55,
                    filter: 'none',
                    pointerEvents: 'none',
                    boxSizing: 'border-box',
                  }}
                >
                  <img
                    src="/imgs/worldmap.svg"
                    alt="世界地图"
                    style={{ width: '100%', height: '100%', objectFit: 'fill', display: 'block' }}
                  />
                </div>

                {/* 手机端：不要依赖 framer-motion（部分移动端会出现“容器有但内容不绘制”）
                    直接用静态 DOM/SVG 来保证一定可见。 */}
                <div
                  key={`network-${renderKey}`}
                  ref={mobileNetworkRef}
                  className="yellow-network-container"
                  style={{
                    width: `${containerWidth}px`,
                    height: `${containerHeight}px`,
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    margin: 0,
                    transform: 'none',
                    zIndex: 2,
                    pointerEvents: 'none',
                    overflow: 'visible',
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
                    // 逻辑：除“英文桌面避碰”外，其余端全部复用桌面版坐标（手机端仅整体缩放）
                    let x = centerX
                    let y = phoneCenterY

                    if (isPhoneNetwork) {
                      const rect = phoneLayoutRects[index]
                      x = rect ? Math.round(rect.x * 100) / 100 : centerX
                      y = rect ? Math.round(rect.y * 100) / 100 : phoneCenterY
                    } else if (isEnglishDesktopNetwork) {
                      const r = englishDesktopResolvedLayout[index]
                      x = r ? Math.round(r.x * 100) / 100 : centerX
                      y = r ? Math.round(r.y * 100) / 100 : centerY
                    } else {
                      const angleDeg = angleOffsets[index] - 90
                      const radians = angleDeg * (Math.PI / 180)
                      let lineRadius = baseRadius
                      // 使用索引判断，而不是名称，以支持多语言（保持历史行为）
                      if (index === 0 || index === 6 || index === 7) {
                        lineRadius = baseRadius * 0.85
                      } else if (index === 8) {
                        lineRadius = baseRadius * 0.92
                      }
                      x = Math.round((centerX + lineRadius * Math.cos(radians)) * 100) / 100
                      y = Math.round((centerY + lineRadius * Math.sin(radians)) * 100) / 100
                    }

                    return (
                      <line
                        key={index}
                        x1={centerX}
                        y1={isPhoneNetwork ? phoneCenterY : centerY}
                        x2={x}
                        y2={y}
                        stroke="#10b981"
                        // 手机端整体缩放后线会变得很细，这里加粗确保可见
                        strokeWidth="6"
                        strokeDasharray="6,4"
                      />
                    )
                  })}
                </svg>

                {/* 中心公司 */}
                <div
                  className="absolute"
                  style={{
                    left: `${centerX}px`,
                    top: `${isPhoneNetwork ? phoneCenterY : centerY}px`,
                    width: `${isPhoneNetwork ? phoneCenterSize : 288}px`,
                    height: `${isPhoneNetwork ? phoneCenterSize : 288}px`,
                    marginLeft: `-${(isPhoneNetwork ? phoneCenterSize : 288) / 2}px`,
                    marginTop: `-${(isPhoneNetwork ? phoneCenterSize : 288) / 2}px`,
                    zIndex: 10,
                    boxSizing: 'border-box',
                    pointerEvents: 'auto'
                  }}
                >
                  <div
                    className={cn(
                      'bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-2xl border-4 border-white transition-transform duration-300',
                      isPhoneNetwork ? '' : 'hover:scale-110'
                    )}
                    style={{
                      width: `${isPhoneNetwork ? phoneCenterSize : 288}px`,
                      height: `${isPhoneNetwork ? phoneCenterSize : 288}px`,
                    }}
                  >
                    <div className="text-center text-white">
                      <div className={cn('font-bold mb-1', isPhoneNetwork ? 'text-3xl' : 'text-4xl')}>Bourn</div>
                      <div className={cn('font-bold', isPhoneNetwork ? 'text-3xl' : 'text-4xl')}>Mark</div>
                    </div>
                  </div>
                </div>

                {/* 合作伙伴卡片 */}
                {partners.map((partner: Partner, index: number) => {
                  const Icon = partnerIcons[index % partnerIcons.length]
                  const isEnglishDesktopCard = isEnglishDesktopNetwork
                  const isSuzhouMiniProgram =
                    isPhoneNetwork &&
                    typeof partner.link === 'string' &&
                    partner.link.includes('苏州工业园区东京商务中心')

                  const suzhouCtaLabel =
                    language === 'ja'
                      ? 'ミニプログラムへ'
                      : language === 'en'
                        ? 'Open mini program'
                        : '点击进入小程序'
                  // 只在手机端用“绕一圈”布局；桌面/iPad 维持原有定位/宽度/偏移逻辑
                  let x = centerX
                  let y = isPhoneNetwork ? phoneCenterY : centerY
                  let finalCardWidth = cardWidth
                  let finalCardHeight = cardHeight
                  let cardOffsetX = 0

                  if (isPhoneNetwork) {
                    const rect = phoneLayoutRects[index]
                    x = rect ? Math.round(rect.x * 100) / 100 : centerX
                    y = rect ? Math.round(rect.y * 100) / 100 : phoneCenterY
                    finalCardWidth = rect ? rect.w : cardWidth
                    finalCardHeight = rect ? rect.h : phoneCardBaseH
                    cardOffsetX = 0
                  } else if (isEnglishDesktopNetwork) {
                    const rect = englishDesktopResolvedLayout[index]
                    x = rect ? Math.round(rect.x * 100) / 100 : centerX
                    y = rect ? Math.round(rect.y * 100) / 100 : centerY
                    finalCardWidth = rect ? rect.w : cardWidth
                    finalCardHeight = rect ? rect.h : cardHeight
                    cardOffsetX = 0
                  } else {
                    const angleDeg = angleOffsets[index] - 90
                    const radians = angleDeg * (Math.PI / 180)

                    let finalRadius = baseRadius
                    if (index === 0 || index === 6 || index === 7) {
                      finalRadius = baseRadius * 0.85
                    } else if (index === 8) {
                      finalRadius = baseRadius * 0.92
                    }

                    x = Math.round((centerX + finalRadius * Math.cos(radians)) * 100) / 100
                    y = Math.round((centerY + finalRadius * Math.sin(radians)) * 100) / 100

                    // 位置微调（保持历史行为）
                    if (index === 1) {
                      x += 120
                    } else if (index === 8) {
                      x -= 40
                      y -= 30
                    } else if (index === 0) {
                      y -= 10
                      x += 30
                    } else if (index === 6) {
                      y -= 10
                      x -= 20
                    } else if (index === 7) {
                      x -= 20
                    } else if (index === 4) {
                      y += 20
                      x += 60
                    } else if (index === 3) {
                      y -= 20
                    }

                    // 宽度/偏移（保持历史行为）
                    if (index === 2) {
                      finalCardWidth = 320 + 50
                      cardOffsetX = (finalCardWidth - cardWidth) / 2 - 20
                    } else if (index === 4) {
                      finalCardWidth = 320 + 40
                      cardOffsetX = (finalCardWidth - cardWidth) / 2
                    } else if (index === 3) {
                      finalCardWidth = 320 + 20
                      cardOffsetX = (finalCardWidth - cardWidth) / 2 - 20
                    } else if (index === 8) {
                      finalCardWidth = cardWidth + 50
                      cardOffsetX = -70
                    } else if (index === 7) {
                      finalCardWidth = cardWidth + 50
                      cardOffsetX = -50
                    } else if (index === 0) {
                      finalCardWidth = cardWidth + 110
                      cardOffsetX = -10
                    } else if (index === 6) {
                      finalCardWidth = cardWidth + 60
                      cardOffsetX = -60
                    } else if (index === 1) {
                      finalCardWidth = cardWidth + 90
                      cardOffsetX = 30
                    } else if (index === 5) {
                      finalCardWidth = cardWidth + 80
                      cardOffsetX = -80
                    }
                  }

                  // layout=edit：当你缩放方块时，内部文字/图标/内边距也同步缩放（仅编辑模式生效）
                  const editUiScale = (() => {
                    if (!(layoutEdit && isPhoneNetwork)) return 1
                    const baseW = Math.max(1, phoneCardBaseW)
                    const baseH = Math.max(1, phoneCardBaseH)
                    const s = Math.min(finalCardWidth / baseW, finalCardHeight / baseH)
                    return Math.max(0.75, Math.min(1.5, s))
                  })()
                  // iPad：文字/图标/内边距也结合“方块自身 w/h”适当缩放（更贴合卡片大小）
                  const boxUiScale = (() => {
                    if (!isPhoneNetwork) return 1
                    if (layoutEdit) return editUiScale
                    if (!isIpadNetwork) return 1
                    const baseW = Math.max(1, phoneCardBaseW)
                    const baseH = Math.max(1, phoneCardBaseH)
                    const s = Math.min(finalCardWidth / baseW, finalCardHeight / baseH)
                    return Math.max(0.9, Math.min(1.25, s))
                  })()
                  const effectiveTextScale = boxUiScale * (isPhoneNetwork ? phoneViewportTextScale : 1)

                  // 仅用于排查：手机竖版英文的“偏移”在屏幕上到底是多少
                  const phoneDebugTweak = (() => {
                    if (!probe) return null
                    if (!(showMobilePortrait && isPhoneNetwork && language === 'en')) return null
                    const n = (partner?.name || '').trim()
                    // 这些值是“屏幕像素”的期望移动（我们会在 targets 中换算成画布像素）
                    if (n.includes('Chinese Enterprise Association in Japan')) return { dx: 10, dy: -40 }
                    if (n.includes('Federation of Chinese Enterprise Associations in Japan')) return { dx: 20, dy: -20 }
                    if (n.includes('Comprehensive Legal and Accounting Firms')) return { dx: 0, dy: -100 }
                    if (n.includes('Major Japanese Insurance Companies')) return { dx: 0, dy: -20 }
                    if (n.includes('Major Guarantee Companies')) return { dx: 0, dy: -40 }
                    return null
                  })()

                  const cardContent = (
                    <div
                      className={cn(
                        'bg-white rounded-xl shadow-lg border-2 border-gray-100 cursor-pointer',
                        // 手机端：减少内边距/间距，让文字更靠左，充分利用宽度
                        isPhoneNetwork ? 'p-0' : (isEnglishDesktopCard ? 'p-4' : 'p-5')
                      )}
                      style={{
                        position: 'relative',
                        width: `${finalCardWidth}px`,
                        minHeight: `${finalCardHeight}px`,
                        ...(isPhoneNetwork
                          ? {
                              // 手机端：更贴边（竖版更狠），减少无意义空隙
                              // 手机竖版：四边统一字符级内边距
                              // - 所有语言：0.5ch（用户要求“尽量去掉空隙”）
                              paddingLeft: (layoutEdit || isIpadNetwork) ? `${Math.round(6 * boxUiScale)}px` : (showMobilePortrait ? '0.5ch' : '6px'),
                              paddingRight: (layoutEdit || isIpadNetwork) ? `${Math.round(6 * boxUiScale)}px` : (showMobilePortrait ? '0.5ch' : '6px'),
                              paddingTop: (layoutEdit || isIpadNetwork) ? `${Math.round(6 * boxUiScale)}px` : (showMobilePortrait ? '0.5ch' : '6px'),
                              paddingBottom: (layoutEdit || isIpadNetwork) ? `${Math.round(5 * boxUiScale)}px` : (showMobilePortrait ? '0.5ch' : '5px'),
                            }
                          : null),
                        ...(phoneDebugTweak
                          ? {
                              outline: '3px solid rgba(255, 0, 255, 0.85)',
                              outlineOffset: 0,
                            }
                          : null),
                        ...(layoutEdit && isPhoneNetwork && layoutSelectedIndex === index
                          ? {
                              boxShadow: '0 0 0 3px rgba(79,70,229,0.35), 0 18px 60px rgba(0,0,0,0.35)',
                              borderColor: 'rgba(79,70,229,0.55)',
                            }
                          : null),
                      }}
                    >
                      {phoneDebugTweak ? (
                        <div
                          style={{
                            position: 'absolute',
                            top: 4,
                            right: 6,
                            zIndex: 999,
                            fontSize: 11,
                            lineHeight: 1.1,
                            fontWeight: 800,
                            padding: '3px 6px',
                            borderRadius: 999,
                            background: 'rgba(255,0,255,0.12)',
                            border: '1px solid rgba(255,0,255,0.45)',
                            color: '#a21caf',
                            pointerEvents: 'none',
                          }}
                        >
                          Δx {phoneDebugTweak.dx}px · Δy {phoneDebugTweak.dy}px
                        </div>
                      ) : null}
                      <div
                        className={cn(
                          'flex items-start',
                          isPhoneNetwork ? (showMobilePortrait ? 'gap-1 mb-1' : 'gap-1.5 mb-1.5') : 'gap-3 mb-3'
                        )}
                        style={{
                          ...(showMobilePortrait
                            ? {
                                gap: '0.5ch',
                                marginBottom: '0.5ch',
                              }
                            : null),
                        }}
                      >
                        <div
                          className={cn(
                            'bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0',
                            isPhoneNetwork
                              ? (showMobilePortrait ? 'w-[22px] h-[22px]' : 'w-9 h-9')
                              : 'w-12 h-12'
                          )}
                          style={
                            isPhoneNetwork && (layoutEdit || isIpadNetwork)
                              ? {
                                  width: `${Math.round((showMobilePortrait ? 22 : 36) * boxUiScale)}px`,
                                  height: `${Math.round((showMobilePortrait ? 22 : 36) * boxUiScale)}px`,
                                }
                              : undefined
                          }
                        >
                          {Icon ? (
                            <Icon
                              className={cn(
                                'text-green-600',
                                isPhoneNetwork
                                  ? (showMobilePortrait ? 'w-[16px] h-[16px]' : 'w-5 h-5')
                                  : 'w-6 h-6'
                              )}
                              style={
                                isPhoneNetwork && (layoutEdit || isIpadNetwork)
                                  ? {
                                      width: `${Math.round((showMobilePortrait ? 16 : 20) * boxUiScale)}px`,
                                      height: `${Math.round((showMobilePortrait ? 16 : 20) * boxUiScale)}px`,
                                    }
                                  : undefined
                              }
                            />
                          ) : (
                            <Globe
                              className={cn(
                                'text-green-600',
                                isPhoneNetwork
                                  ? (showMobilePortrait ? 'w-[16px] h-[16px]' : 'w-5 h-5')
                                  : 'w-6 h-6'
                              )}
                              style={
                                isPhoneNetwork && (layoutEdit || isIpadNetwork)
                                  ? {
                                      width: `${Math.round((showMobilePortrait ? 16 : 20) * boxUiScale)}px`,
                                      height: `${Math.round((showMobilePortrait ? 16 : 20) * boxUiScale)}px`,
                                    }
                                  : undefined
                              }
                            />
                          )}
                        </div>
                        <h3
                          className={cn('m-0 font-semibold text-navy-900 leading-tight flex-1', isEnglishDesktopCard ? 'leading-snug' : '')}
                          style={({
                            fontSize: `${Math.max(
                              12,
                              Math.round(
                                (isPhoneNetwork ? (showMobilePortrait ? 22 : 18) : (isEnglishDesktopCard ? 20 : 22)) *
                                  effectiveTextScale +
                                  (layoutEdit && isPhoneNetwork ? layoutFontDeltaPx : 0)
                              )
                            )}px`,
                            lineHeight: isPhoneNetwork ? (showMobilePortrait ? 1.08 : 1.15) : undefined,
                          } as any)}
                        >
                          {partner.name}
                        </h3>
                      </div>
                      <p
                        className={cn('m-0 text-gray-700 leading-relaxed', isEnglishDesktopCard ? 'leading-snug' : '')}
                        style={({
                          fontSize: `${Math.max(
                            11,
                            Math.round(
                              (isPhoneNetwork ? (showMobilePortrait ? 17 : 15) : (isEnglishDesktopCard ? 15 : 18)) *
                                effectiveTextScale +
                                (layoutEdit && isPhoneNetwork ? layoutFontDeltaPx : 0)
                            )
                          )}px`,
                          lineHeight: isPhoneNetwork ? (showMobilePortrait ? 1.18 : 1.2) : undefined,
                        } as any)}
                      >
                        {partner.desc}
                      </p>

                      {/* layout=edit：右下角缩放把手（拖动可改 w/h） */}
                      {layoutEdit && isPhoneNetwork ? (
                        <div
                          onPointerDown={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            try {
                              ;(e.currentTarget as any).setPointerCapture?.(e.pointerId)
                            } catch {}
                            setLayoutSelectedIndex(index)
                            setLayoutInteracting(true)
                            const rect = phoneLayoutRects[index]
                            if (!rect) return
                            layoutResizeRef.current = {
                              index,
                              pointerId: e.pointerId,
                              startClientX: e.clientX,
                              startClientY: e.clientY,
                              startW: rect.w,
                              startH: rect.h,
                            }
                          }}
                          onPointerMove={(e) => {
                            e.preventDefault()
                            const cur = layoutResizeRef.current
                            if (!cur) return
                            if (cur.index !== index) return
                            if (cur.pointerId !== e.pointerId) return
                            const dx = layoutCanvasDelta(e.clientX - cur.startClientX)
                            const dy = layoutCanvasDelta(e.clientY - cur.startClientY)
                            const minW = 220
                            const maxW = 640
                            const minH = 110
                            const maxH = 420
                            setLayoutEditRects((prev) => {
                              if (!Array.isArray(prev) || prev.length !== partners.length) return prev
                              const next = prev.slice()
                              const r0 = next[index]
                              if (!r0) return prev
                              const nw = Math.max(minW, Math.min(maxW, cur.startW + dx))
                              const nh = Math.max(minH, Math.min(maxH, cur.startH + dy))
                              next[index] = { ...r0, w: nw, h: nh }
                              setLayoutJsonText(JSON.stringify(next, null, 2))
                              return next
                            })
                          }}
                          onPointerUp={(e) => {
                            const cur = layoutResizeRef.current
                            if (!cur) return
                            if (cur.pointerId !== e.pointerId) return
                            layoutResizeRef.current = null
                            setLayoutInteracting(false)
                          }}
                          onPointerCancel={(e) => {
                            const cur = layoutResizeRef.current
                            if (!cur) return
                            if (cur.pointerId !== e.pointerId) return
                            layoutResizeRef.current = null
                            setLayoutInteracting(false)
                          }}
                          style={{
                            position: 'absolute',
                            right: 6,
                            bottom: 6,
                            width: 26,
                            height: 26,
                            borderRadius: 8,
                            border: '1px solid rgba(79,70,229,0.55)',
                            background: 'rgba(79,70,229,0.16)',
                            boxShadow: '0 6px 18px rgba(0,0,0,0.18)',
                            cursor: 'nwse-resize',
                            touchAction: 'none',
                          }}
                          aria-label="Resize"
                        />
                      ) : null}

                      {/* 仅手机端：苏州工业园区卡片右下角提供“小程序入口” */}
                      {isSuzhouMiniProgram ? (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginTop: showMobilePortrait ? 2 : 4,
                          }}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              const raw = partner.link
                              if (!raw) return
                              tryOpenWeChatMiniProgram({
                                rawLink: raw,
                                confirmText: t('qichu.partners.miniProgramConfirm'),
                                fallbackText: t('qichu.partners.miniProgramFallback'),
                              })
                            }}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              padding: 0,
                              margin: 0,
                              color: '#16a34a',
                              fontSize: showMobilePortrait ? 12 : 11,
                              textDecoration: 'underline',
                              cursor: 'pointer',
                              pointerEvents: 'auto',
                            }}
                            aria-label={suzhouCtaLabel}
                          >
                            {suzhouCtaLabel}
                          </button>
                        </div>
                      ) : null}
                    </div>
                  )

                  return (
                    <div
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
                      {(layoutEdit || showMobilePortrait) ? (
                        <div
                          role={layoutEdit ? undefined : "button"}
                          tabIndex={layoutEdit ? undefined : 0}
                          className="block focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded-xl"
                          onClick={
                            layoutEdit
                              ? undefined
                              : () => {
                                  setMobilePartnerModal({
                                    index,
                                    name: partner.name,
                                    desc: partner.desc,
                                    link: partner.link || undefined,
                                  })
                                }
                          }
                          onKeyDown={
                            layoutEdit
                              ? undefined
                              : (e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault()
                                    setMobilePartnerModal({
                                      index,
                                      name: partner.name,
                                      desc: partner.desc,
                                      link: partner.link || undefined,
                                    })
                                  }
                                }
                          }
                          onPointerDown={
                            layoutEdit
                              ? (e) => {
                                  e.preventDefault()
                                  try {
                                    ;(e.currentTarget as any).setPointerCapture?.(e.pointerId)
                                  } catch {}
                                  const rect = phoneLayoutRects[index]
                                  if (!rect) return
                                  setLayoutSelectedIndex(index)
                                  setLayoutInteracting(true)
                                  layoutDragRef.current = {
                                    index,
                                    pointerId: e.pointerId,
                                    startClientX: e.clientX,
                                    startClientY: e.clientY,
                                    startX: rect.x,
                                    startY: rect.y,
                                  }
                                }
                              : undefined
                          }
                          onPointerMove={
                            layoutEdit
                              ? (e) => {
                                  e.preventDefault()
                                  const cur = layoutDragRef.current
                                  if (!cur) return
                                  if (cur.index !== index) return
                                  if (cur.pointerId !== e.pointerId) return
                                  const dx = layoutCanvasDelta(e.clientX - cur.startClientX)
                                  const dy = layoutCanvasDelta(e.clientY - cur.startClientY)
                                  setLayoutEditRects((prev) => {
                                    if (!Array.isArray(prev) || prev.length === 0) return prev
                                    const next = prev.slice()
                                    const r0 = next[cur.index]
                                    if (!r0) return prev
                                    next[cur.index] = { ...r0, x: cur.startX + dx, y: cur.startY + dy }
                                    setLayoutJsonText(JSON.stringify(next, null, 2))
                                    return next
                                  })
                                }
                              : undefined
                          }
                          onPointerUp={
                            layoutEdit
                              ? (e) => {
                                  const cur = layoutDragRef.current
                                  if (!cur) return
                                  if (cur.pointerId !== e.pointerId) return
                                  layoutDragRef.current = null
                                  setLayoutInteracting(false)
                                }
                              : undefined
                          }
                          onPointerCancel={
                            layoutEdit
                              ? (e) => {
                                  const cur = layoutDragRef.current
                                  if (!cur) return
                                  if (cur.pointerId !== e.pointerId) return
                                  layoutDragRef.current = null
                                  setLayoutInteracting(false)
                                }
                              : undefined
                          }
                          style={layoutEdit ? { touchAction: 'none', WebkitUserSelect: 'none', userSelect: 'none' } : undefined}
                        >
                          {cardContent}
                        </div>
                      ) : (
                        <div
                          role="button"
                          tabIndex={0}
                          className="block focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded-xl"
                          onClick={() => {
                            setMobilePartnerModal({
                              index,
                              name: partner.name,
                              desc: partner.desc,
                              link: partner.link || undefined,
                            })
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              setMobilePartnerModal({
                                index,
                                name: partner.name,
                                desc: partner.desc,
                                link: partner.link || undefined,
                              })
                            }
                          }}
                        >
                          {cardContent}
                        </div>
                      )}
                    </div>
                  )
                })}
                </div>
                </div>
              </div>
            </div>
          </div>

          <div className={cn("hidden lg:block", (isIpadNetwork || layoutEdit) ? "!hidden" : "")}>
            <>
              {/* 黑白世界地图背景 - 白框，相对于绿框居中 */}
              <div
                key={`map-${renderKey}`}
                ref={desktopWhiteBoxRef}
                className="white-box-container hover:scale-110 transition-transform duration-300"
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: 'calc(100% - 40px)',
                  height: mobilePortraitMapHeight || redBoxHeight,
                  transform: showMobilePortrait && isNetworkExpanded
                    ? 'translate(-50%, -50%) scale(2)'
                    : (showIpadPortrait
                      ? `translate(-50%, -50%) scale(${ipadPortraitScale})`
                      : (showIpadLandscape || isDesktop
                        ? `translate(-50%, -50%) scale(${yellowBoxScale * 1.2})`
                        : 'translate(-50%, -50%)')),
                  zIndex: showMobilePortrait && isNetworkExpanded ? 200 : 1,
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
                  if (typeof window !== 'undefined') {
                    sessionStorage.setItem('network-expanded', String(newExpanded))
                  }
                  if (desktopWhiteBoxRef.current) {
                    desktopWhiteBoxRef.current.style.zIndex = newExpanded ? '200' : '1'
                  }
                } : undefined}
              >
                <img
                  src="/imgs/worldmap.svg"
                  alt="世界地图"
                  style={{ width: '100%', height: '100%', objectFit: 'fill', display: 'block' }}
                />
              </div>

              {/* 网络图内容容器 - 黄框，直接相对于绿框定位 */}
              <motion.div
                key={`network-${renderKey}`}
                ref={desktopNetworkRef}
                className="yellow-network-container"
                initial="visible"
                animate={shouldAnimate ? 'visible' : 'visible'}
                variants={containerVariants}
                style={{
                  width: `${containerWidth}px`,
                  height: `${containerHeight}px`,
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  margin: '0',
                  transform: showMobilePortrait
                    ? `translate(-50%, -50%) scale(${(mobileFitScale || 0.22) * (isNetworkExpanded ? 1.8 : 1)})`
                    : (showMobileLandscape
                      ? `translate(-50%, -50%) scale(${(mobileFitScale || 0.22) * 1.05})`
                      : (showIpadPortrait
                        ? `translate(-50%, -50%) scale(${yellowBoxScale * ipadPortraitScale})`
                        : (showIpadLandscape || isDesktop
                          ? `translate(-50%, -50%) scale(${yellowBoxScale * ipadPortraitScale * 1.2})`
                          : `translate(-50%, -50%) scale(${yellowBoxScale})`))),
                  transformOrigin: 'center center',
                  zIndex: showMobilePortrait && isNetworkExpanded ? 201 : 2,
                  pointerEvents: 'none',
                  // iPad 横屏英文版：底部文字更长，卡片可能超出容器高度；
                  // 这里放开裁切，避免底部被切掉（仅限此模式，其他不动）。
                  overflow: (showIpadLandscape && language === 'en') ? 'visible' : 'hidden',
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
                    let x = centerX
                    let y = centerY
                    if (isEnglishDesktopNetwork) {
                      const r = englishDesktopResolvedLayout[index]
                      x = r ? Math.round(r.x * 100) / 100 : centerX
                      y = r ? Math.round(r.y * 100) / 100 : centerY
                    } else {
                      const angleDeg = angleOffsets[index] - 90
                      const radians = angleDeg * (Math.PI / 180)
                      let lineRadius = baseRadius
                      if (index === 0 || index === 6 || index === 7) lineRadius = baseRadius * 0.85
                      else if (index === 8) lineRadius = baseRadius * 0.92
                      x = Math.round((centerX + lineRadius * Math.cos(radians)) * 100) / 100
                      y = Math.round((centerY + lineRadius * Math.sin(radians)) * 100) / 100
                    }
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
                    width: `${isPhoneNetwork ? phoneCenterSize : 288}px`,
                    height: `${isPhoneNetwork ? phoneCenterSize : 288}px`,
                    marginLeft: `-${(isPhoneNetwork ? phoneCenterSize : 288) / 2}px`,
                    marginTop: `-${(isPhoneNetwork ? phoneCenterSize : 288) / 2}px`,
                    zIndex: 10,
                    boxSizing: 'border-box',
                    pointerEvents: 'auto'
                  }}
                  variants={centerVariants}
                >
                  <div
                    className={cn(
                      'bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-2xl border-4 border-white transition-transform duration-300',
                      isPhoneNetwork ? '' : 'hover:scale-110'
                    )}
                    style={{
                      width: `${isPhoneNetwork ? phoneCenterSize : 288}px`,
                      height: `${isPhoneNetwork ? phoneCenterSize : 288}px`,
                    }}
                  >
                    <div className="text-center text-white">
                      <div className={cn('font-bold mb-1', isPhoneNetwork ? 'text-3xl' : 'text-4xl')}>Bourn</div>
                      <div className={cn('font-bold', isPhoneNetwork ? 'text-3xl' : 'text-4xl')}>Mark</div>
                    </div>
                  </div>
                </motion.div>

                {/* 合作伙伴卡片 */}
                {partners.map((partner: Partner, index: number) => {
                  const Icon = partnerIcons[index % partnerIcons.length]
                  const isEnglishDesktopCard = isEnglishDesktopNetwork
                  let x = centerX
                  let y = centerY
                  let finalCardWidth = cardWidth
                  let finalCardHeight = cardHeight
                  let cardOffsetX = 0

                  if (isEnglishDesktopNetwork) {
                    const rect = englishDesktopResolvedLayout[index]
                    x = rect ? Math.round(rect.x * 100) / 100 : centerX
                    y = rect ? Math.round(rect.y * 100) / 100 : centerY
                    finalCardWidth = rect ? rect.w : cardWidth
                    finalCardHeight = rect ? rect.h : cardHeight
                    cardOffsetX = 0
                  } else {
                    const angleDeg = angleOffsets[index] - 90
                    const radians = angleDeg * (Math.PI / 180)
                    let finalRadius = baseRadius
                    if (index === 0 || index === 6 || index === 7) finalRadius = baseRadius * 0.85
                    else if (index === 8) finalRadius = baseRadius * 0.92
                    x = Math.round((centerX + finalRadius * Math.cos(radians)) * 100) / 100
                    y = Math.round((centerY + finalRadius * Math.sin(radians)) * 100) / 100
                    if (index === 1) x += 120
                    else if (index === 8) { x -= 40; y -= 30 }
                    else if (index === 0) { y -= 10; x += 30 }
                    else if (index === 6) { y -= 10; x -= 20 }
                    else if (index === 7) x -= 20
                    else if (index === 4) { y += 20; x += 60 }
                    else if (index === 3) y -= 20

                    if (index === 2) { finalCardWidth = 320 + 50; cardOffsetX = (finalCardWidth - cardWidth) / 2 - 20 }
                    else if (index === 4) { finalCardWidth = 320 + 40; cardOffsetX = (finalCardWidth - cardWidth) / 2 }
                    else if (index === 3) { finalCardWidth = 320 + 20; cardOffsetX = (finalCardWidth - cardWidth) / 2 - 20 }
                    else if (index === 8) { finalCardWidth = cardWidth + 50; cardOffsetX = -70 }
                    else if (index === 7) { finalCardWidth = cardWidth + 50; cardOffsetX = -50 }
                    else if (index === 0) { finalCardWidth = cardWidth + 110; cardOffsetX = -10 }
                    else if (index === 6) { finalCardWidth = cardWidth + 60; cardOffsetX = -60 }
                    else if (index === 1) { finalCardWidth = cardWidth + 90; cardOffsetX = 30 }
                    else if (index === 5) { finalCardWidth = cardWidth + 80; cardOffsetX = -80 }
                  }

                  const cardContent = (
                    <motion.div
                      variants={cardVariants}
                      whileHover={{ scale: 1.05, y: -5 } as any}
                      className={cn('bg-white rounded-xl shadow-lg border-2 border-gray-100 cursor-pointer', isEnglishDesktopCard ? 'p-4' : 'p-5')}
                      style={{ width: `${finalCardWidth}px`, minHeight: `${finalCardHeight}px` }}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <motion.div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0" whileHover={{ scale: 1.2, rotate: 5 }}>
                          {Icon ? <Icon className="w-6 h-6 text-green-600" /> : <Globe className="w-6 h-6 text-green-600" />}
                        </motion.div>
                        <h3 className={cn('font-semibold text-navy-900 leading-tight flex-1', isEnglishDesktopCard ? 'leading-snug' : '')} style={({ fontSize: isEnglishDesktopCard ? '20px' : '22px' } as any)}>
                          {partner.name}
                        </h3>
                      </div>
                      <p className={cn('text-gray-700 leading-relaxed', isEnglishDesktopCard ? 'leading-snug' : '')} style={({ fontSize: isEnglishDesktopCard ? '15px' : '18px' } as any)}>
                        {partner.desc}
                      </p>
                    </motion.div>
                  )

                  return (
                    <motion.div
                      key={partner.name}
                      className="absolute"
                      style={{ left: `${x + cardOffsetX}px`, top: `${y}px`, transform: 'translate(-50%, -50%)', zIndex: 5, pointerEvents: 'auto' }}
                    >
                      <div
                        role="button"
                        tabIndex={0}
                        className="block focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded-xl"
                        onClick={() => {
                          if (layoutEdit) return
                          setMobilePartnerModal({
                            index,
                            name: partner.name,
                            desc: partner.desc,
                            link: partner.link || undefined,
                          })
                        }}
                        onKeyDown={(e) => {
                          if (layoutEdit) return
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            setMobilePartnerModal({
                              index,
                              name: partner.name,
                              desc: partner.desc,
                              link: partner.link || undefined,
                            })
                          }
                        }}
                      >
                        {cardContent}
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            </>
          </div>

        </section>


        <section
          id="cases"
          className="section-padding"
          style={{
            marginTop: '0px',
            position: 'relative',
            zIndex: 10,
            // 手机竖版：把 section 自身的左右 padding 也压到最小（否则会被全局 section-padding 强制 8px）
            paddingLeft: isNarrowPortrait ? '0px' : undefined,
            paddingRight: isNarrowPortrait ? '0px' : undefined,
            outline: probe ? '4px solid #00ffff' : undefined,
            outlineOffset: probe ? '-4px' : undefined,
          }}
        >
          {/* 手机竖版：避免 container-custom 额外 padding 让卡片整体离边缘过远；这里改为自行控制 padding */}
          <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-8 text-left sm:text-center">{t('qichu.cases.title')}</h2>

            {/* 横向滚动容器 */}
            <div className="relative">
              <div className="overflow-x-auto scroll-smooth pb-2 md:pb-4 scrollbar-hide">
                <div className="flex gap-3 md:gap-6 min-w-max">
                  {projects.map((project, index) => {
                    // 从案例展示页面获取对应的图片和日期
                    const projectId = project.id || `project-${index}`
                    const projectData: ProjectData = {
                      id: projectId,
                      date: caseDates[projectId] || '—',
                      image:
                        projectId === 'suzhou-industrial-park'
                          ? '/imgs/qichu/suzhougongyeyuan.jpeg'
                          : (caseImages[projectId as keyof typeof caseImages] ||
                              'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'),
                    }

                    const CardWrapper: React.ElementType = project.href ? Link : 'div'
                    const cardWrapperProps = project.href
                      ? { href: project.href }
                      : { role: 'article', 'aria-label': project.title }

                    return (
                      <CardWrapper
                        key={`${projectData.id}-${project.title}`}
                        {...cardWrapperProps}
                        className="group bg-white/80 backdrop-blur-sm rounded-none sm:rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 md:hover:-translate-y-2 flex-shrink-0 w-[280px] md:w-[380px]"
                      >
                        {/* 图片区：固定高度，内部用 absolute -inset 出血，确保真正贴边 */}
                        <div className="relative overflow-hidden h-64">
                          {/* 手机端更强出血；sm 以上稍微收一点，贴近桌面效果 */}
                          <div className="absolute -inset-[8px] sm:-inset-[3px] qichu-case-image m-0 p-0">
                            <Image
                              src={projectData.image}
                              alt={project.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              sizes="380px"
                              // 本地 /public/imgs 图片：绕过 next/image 优化器，避免个别 JPEG 在移动端优化失败导致不显示
                              unoptimized={projectData.image.startsWith('/imgs/')}
                            />
                          </div>
                          <div className="absolute top-2 right-2 md:top-4 md:right-4">
                            <span className="bg-green-600 text-white px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium">
                              企业服务
                            </span>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-1 md:mb-3">
                            <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            <span>{projectData.date}</span>
                          </div>
                          <h3 className="text-base md:text-lg lg:text-xl font-semibold text-navy-900 mb-1 md:mb-2 group-hover:text-navy-600 transition-colors duration-200">
                            {project.title}
                          </h3>
                          <p className="text-gray-700 text-xs md:text-sm leading-relaxed line-clamp-2">
                            {project.result}
                          </p>
                        </div>
                      </CardWrapper>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom text-center px-4 md:px-0">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">{t('qichu.cta.title')}</h2>
            <p className="text-sm md:text-base text-gray-200 max-w-2xl mx-auto mb-5 md:mb-6 leading-relaxed">
              {t('qichu.cta.description')}
            </p>
            <a href="/#contact" className="btn-primary inline-flex items-center gap-2 text-sm md:text-base px-6 md:px-8 py-2.5 md:py-3">
              {t('qichu.cta.button')}
            </a>
          </div>
        </section>

        {/* 点击合作伙伴方块 → 放大弹窗（所有版本；layout=edit 例外） */}
        {!layoutEdit && mobilePartnerModal ? (
          <div
            onClick={() => setMobilePartnerModal(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(0,0,0,0.62)',
              padding: 'max(env(safe-area-inset-top), 16px) 14px max(env(safe-area-inset-bottom), 16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: 'min(92vw, 520px)',
                maxHeight: '82vh',
                overflow: 'auto',
                borderRadius: 16,
                background: 'rgba(255,255,255,0.96)',
                border: '1px solid rgba(16,185,129,0.35)',
                boxShadow: '0 18px 60px rgba(0,0,0,0.45)',
                padding: '16px 16px 14px',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#16a34a', marginBottom: 6 }}>
                    {language === 'ja' ? 'パートナー' : language === 'en' ? 'Partner' : '合作伙伴'}
                  </div>
                  <div style={{ fontSize: 24, lineHeight: 1.15, fontWeight: 800, color: '#0f172a' }}>
                    {mobilePartnerModal.name}
                  </div>
                </div>
                <button
                  type="button"
                  aria-label={language === 'ja' ? '閉じる' : language === 'en' ? 'Close' : '关闭'}
                  onClick={() => setMobilePartnerModal(null)}
                  style={{
                    flexShrink: 0,
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    border: '1px solid rgba(15, 23, 42, 0.16)',
                    background: 'rgba(255,255,255,0.9)',
                    color: '#0f172a',
                    fontSize: 18,
                    lineHeight: '34px',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ marginTop: 10, fontSize: 17, lineHeight: 1.35, color: '#374151' }}>
                {mobilePartnerModal.desc}
              </div>

              {typeof mobilePartnerModal.link === 'string' && mobilePartnerModal.link.trim() ? (
                <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const raw = mobilePartnerModal.link
                      if (!raw) return
                      const normalized = normalizeWeChatMiniProgramLink(raw)
                      if (normalized.startsWith('小程序://')) {
                        tryOpenWeChatMiniProgram({
                          rawLink: raw,
                          confirmText: t('qichu.partners.miniProgramConfirm'),
                          fallbackText: t('qichu.partners.miniProgramFallback'),
                        })
                      } else if (typeof window !== 'undefined') {
                        window.open(normalized, '_blank', 'noopener,noreferrer')
                      }
                    }}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(16,185,129,0.35)',
                      borderRadius: 999,
                      padding: '8px 12px',
                      color: '#16a34a',
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    {(() => {
                      const isSuzhou =
                        typeof mobilePartnerModal.link === 'string' &&
                        mobilePartnerModal.link.includes('苏州工业园区东京商务中心')
                      if (isSuzhou) {
                        return language === 'ja' ? 'ミニプログラムへ' : language === 'en' ? 'Open mini program' : '点击进入小程序'
                      }
                      return language === 'ja' ? 'リンクを開く' : language === 'en' ? 'Open link' : '打开链接'
                    })()}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </PageLayout>
  )
}


