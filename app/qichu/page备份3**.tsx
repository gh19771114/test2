'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import Link from 'next/link'
import { Building2, Users, Briefcase, Landmark, Globe, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

const relatedServices = [
  {
    name: '商业地产租赁',
    desc: '提供东京周边地区商铺、写字楼、工厂、仓库等各种商业地产的租赁服务。',
  },
  {
    name: '室内软装',
    desc: '根据品牌定位提供室内软装设计、陈设与执行，打造统一的空间体验。',
  },
  {
    name: '办公设备采购及设置',
    desc: '整合IT设备、办公家具等采购渠道，负责配送、安装与调试。',
  },
  {
    name: '企业相关活动承办',
    desc: '开业典礼、展会设置等商务活动的策划与现场执行支持。',
  },
  {
    name: '广告宣传策划',
    desc: '整合线上线下媒体资源，制定品牌本地化宣传与推广方案。',
  },
]

const partners = [
  {
    name: '日本大型金融机构',
    desc: '提供企业开户、资金结算与财务顾问服务，为新设法人提供本地金融支持。',
    icon: null, // 使用默认图标
  },
  {
    name: '在日中国企业协会',
    desc: '连接在日华人企业资源，提供政策解读、活动交流与会员支持。',
    icon: null,
  },
  {
    name: '全日本中国企业协会联合会',
    desc: '协调各地区中国商会资源，提供跨区域商务联动与渠道拓展。',
    icon: null,
    wide: true, // 标记为需要更宽的卡片
  },
  {
    name: '综合法律与会计事务所',
    desc: '覆盖公司注册、税务规划、劳动法规与知识产权保护的一站式方案。',
    icon: null,
  },
  {
    name: 'Jetro 日本贸易振兴协会',
    desc: '提供市场情报、补贴申报、展会对接等官方资源，协助企业落地日本市场。',
    icon: null,
    wide: true, // 标记为需要更宽的卡片
  },
  {
    name: '苏州工业园区',
    desc: '对接江浙优质企业在日发展，提供跨国设点、商务活动与招商服务。',
    link: '#小程序://苏州工业园区东京商务中心/6pgYUElzfmOA17s',
    icon: null,
  },
  {
    name: '大型保证公司',
    desc: '拥有32家日本保证公司的相关业务代理权。',
    icon: null,
  },
  {
    name: '日本大型装修公司',
    desc: '承接各种室内装修业务。',
    icon: null,
  },
  {
    name: '日本大型保险公司',
    desc: '承办小额短期、火灾、地震等各种保险业务。',
    icon: null,
  },
]

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

// 合作伙伴网络组件（带动画）
function PartnersNetwork({ partners, partnerIcons }: { partners: Partner[], partnerIcons: PartnerIcon[] }) {
  const ref = useRef(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const networkContainerRef = useRef<HTMLDivElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [deviceType, setDeviceType] = useState<'desktop' | 'ipad-landscape' | 'ipad-portrait' | 'mobile-portrait'>('desktop')
  const [mapScale, setMapScale] = useState(1)
  const [networkScale, setNetworkScale] = useState(1)
  
  // 根据父容器className检测设备类型
  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return
    
    const findParentWithClass = (element: HTMLElement | null): string | null => {
      if (!element) return null
      if (element.classList.contains('desktop-partners-network')) return 'desktop'
      if (element.classList.contains('ipad-landscape-partners')) return 'ipad-landscape'
      if (element.classList.contains('ipad-portrait-partners')) return 'ipad-portrait'
      if (element.classList.contains('mobile-portrait-partners')) return 'mobile-portrait'
      return findParentWithClass(element.parentElement)
    }
    
    const checkDevice = () => {
      const parent = containerRef.current?.parentElement
      const detected = findParentWithClass(parent || null)
      if (detected) {
        setDeviceType(detected as any)
      } else {
        // 备用检测：根据窗口尺寸
        const width = window.innerWidth
        const height = window.innerHeight
        const isPortrait = height > width
        // 确保设备类型检测正确
        if (width <= 767 && isPortrait) {
          setDeviceType('mobile-portrait')
        } else if (width >= 768 && width <= 1023 && isPortrait) {
          setDeviceType('ipad-portrait')
        } else if (width >= 768 && width <= 1023 && !isPortrait) {
          setDeviceType('ipad-landscape')
        } else if (width > 1023) {
          setDeviceType('desktop')
        } else {
          // 默认情况：根据宽度判断
          setDeviceType(width > 1023 ? 'desktop' : 'mobile-portrait')
        }
      }
    }
    
    checkDevice()
    // 延迟检查，确保DOM已渲染
    setTimeout(checkDevice, 100)
    setTimeout(checkDevice, 300)
    window.addEventListener('resize', checkDevice)
    
    return () => {
      window.removeEventListener('resize', checkDevice)
    }
  }, [])
  
  // 根据设备类型设置top值
  // 桌面端：红框top=10px，蓝框top=20px，两者高度相同，底端对齐
  // 其他版本：使用固定像素值，确保内容可见
  const isDesktop = deviceType === 'desktop'
  const redBoxTop = isDesktop ? '10px' : '20px' // 桌面版：10px；其他版本：20px
  const blueBoxTop = isDesktop ? '20px' : '20px' // 桌面版：20px；其他版本：20px
  // 桌面端：红框和蓝框高度相同，底端对齐
  // 其他版本：使用固定高度，确保内容可见（父容器minHeight是1200px）
  const redBoxHeight = isDesktop ? 'calc(200% - 1500px)' : '1180px' // 桌面版：calc(200% - 1500px)；其他版本：1180px（固定高度）
  const blueBoxHeight = isDesktop ? 'calc(200% - 1500px)' : '1180px' // 桌面版：calc(200% - 1500px)；其他版本：1180px（固定高度）
  
  // 桌面版：计算缩放比例，使内容充满容器
  useEffect(() => {
    if (deviceType !== 'desktop' || typeof window === 'undefined') {
      setMapScale(1)
      setNetworkScale(1)
      return
    }
    
    const calculateScales = () => {
      // 计算地图缩放比例
      if (mapContainerRef.current) {
        const mapContainerRect = mapContainerRef.current.getBoundingClientRect()
        const mapContainerWidth = mapContainerRect.width
        const mapContainerHeight = mapContainerRect.height
        
        // 地图原始尺寸：1800 x 600
        const mapOriginalWidth = 1800
        const mapOriginalHeight = 600
        
        // 计算缩放比例，使地图充满容器（保持宽高比）
        const scaleX = mapContainerWidth / mapOriginalWidth
        const scaleY = mapContainerHeight / mapOriginalHeight
        const mapScaleValue = Math.max(scaleX, scaleY) // 取较大值以充满容器
        
        setMapScale(mapScaleValue)
      }
      
      // 计算网络图缩放比例
      if (networkContainerRef.current) {
        const networkContainerRect = networkContainerRef.current.getBoundingClientRect()
        const networkContainerWidth = networkContainerRect.width
        const networkContainerHeight = networkContainerRect.height
        
        // 网络图原始尺寸：1800 x 1200
        const networkOriginalWidth = 1800
        const networkOriginalHeight = 1200
        
        // 计算缩放比例，使网络图充满容器（保持宽高比）
        const scaleX = networkContainerWidth / networkOriginalWidth
        const scaleY = networkContainerHeight / networkOriginalHeight
        const networkScaleValue = Math.max(scaleX, scaleY) // 取较大值以充满容器
        
        setNetworkScale(networkScaleValue)
      }
    }
    
    calculateScales()
    
    // 延迟计算，确保DOM已渲染
    const timeout1 = setTimeout(calculateScales, 100)
    const timeout2 = setTimeout(calculateScales, 300)
    const timeout3 = setTimeout(calculateScales, 500)
    
    window.addEventListener('resize', calculateScales)
    
    return () => {
      clearTimeout(timeout1)
      clearTimeout(timeout2)
      clearTimeout(timeout3)
      window.removeEventListener('resize', calculateScales)
    }
  }, [deviceType])
  
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
  const containerHeight = 1200
  // 地图容器高度（缩小为一半）
  const mapContainerHeight = 600
  // 中心点（容器正中心）
  const centerX = containerWidth / 2
  const centerY = containerHeight / 2
  // 卡片尺寸
  const cardWidth = 240
  const cardHeight = 150
  // 计算安全半径：确保卡片不会超出容器
  // 卡片中心到边缘的距离 = 卡片对角线的一半 + 一些边距
  // 考虑最宽的卡片（放大后360px）和高度（放大后170px）
  const maxCardWidth = 360 // 放大后的最大宽度
  const maxCardHeight = 170 // 放大后的高度
  const cardDiagonal = Math.sqrt(maxCardWidth * maxCardWidth + maxCardHeight * maxCardHeight) / 2
  const padding = 40 // 增加边距，避免卡片互相遮挡
  const maxRadius = Math.min(
    (containerWidth / 2) - cardDiagonal - padding,
    (containerHeight / 2) - cardDiagonal - padding
  )
  // 计算相邻卡片所需的最小半径，确保不遮挡
  // 9个卡片，每个间隔40度，需要确保相邻卡片中心距离 > 卡片对角线 + margin
  const numCards = partners.length
  const angleStep = 360 / numCards // 40度
  const minCardDistance = cardDiagonal * 2 + 20 // 卡片对角线 + 边距（减少到20以适配容器）
  const requiredRadius = minCardDistance / (2 * Math.sin((angleStep * Math.PI / 180) / 2))
  // 如果所需半径超出容器，使用最大可用半径，并调整卡片间距
  const baseRadius = Math.min(maxRadius - 10, requiredRadius)
  
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

  return (
    <div 
      ref={containerRef}
      style={{ 
        width: '100%',
        minHeight: '1200px', // 所有版本使用固定最小高度，确保内容可见
        position: 'relative',
        pointerEvents: 'none',
        visibility: 'visible',
        opacity: 1,
        display: 'block',
        overflow: 'visible',
        zIndex: 1
      }}
    >
      {/* 地图容器边框 - 红框 */}
      <div
        ref={mapContainerRef}
        className="map-container-border"
        style={{
          position: 'absolute',
          left: 0,
          top: redBoxTop,
          right: 0,
          bottom: 'auto', // 使用height控制，不从bottom控制
          width: '100%', // 占满父容器宽度，与绿框对齐
          height: redBoxHeight, // 从下方缩短700px
          zIndex: 0,
          border: '3px solid red',
          boxSizing: 'border-box',
          pointerEvents: 'none',
          backgroundColor: 'rgba(255, 0, 0, 0.1)', // 红框容器 - 浅红色背景
          overflow: 'hidden' // 防止内容溢出
        }}
      >
        {/* 红框中心点 */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '12px',
            height: '12px',
            marginLeft: '-6px',
            marginTop: '-6px',
            borderRadius: '50%',
            backgroundColor: 'red',
            border: '2px solid white',
            zIndex: 1000,
            pointerEvents: 'none'
          }}
        />
      </div>
      
      {/* 黑白世界地图背景 */}
      <div
        className="map-container-background"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          opacity: 0.15,
          filter: 'grayscale(100%) brightness(0.8)',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 165, 0, 0.1)', // 地图背景容器 - 浅橙色背景
          overflow: 'hidden' // 防止内容溢出
        }}
      >
        <div
          style={{
            width: `${containerWidth}px`,
            height: `${mapContainerHeight}px`,
            transform: deviceType === 'desktop' ? `scale(${mapScale})` : 'scale(1)',
            transformOrigin: 'center center',
            transition: 'transform 0.3s ease'
          }}
        >
          <Image
            src="/imgs/worldmap.svg"
            alt="世界地图"
            width={containerWidth}
            height={mapContainerHeight}
            style={{
              width: `${containerWidth}px`,
              height: `${mapContainerHeight}px`,
              objectFit: 'contain'
            }}
            priority={false}
          />
        </div>
        {/* 地图中心点 */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '20px',
            height: '20px',
            marginLeft: '-10px',
            marginTop: '-10px',
            borderRadius: '50%',
            backgroundColor: 'white',
            border: '2px solid #333',
            zIndex: 1000,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#333'
          }}
        >
          地
        </div>
      </div>

      <div
        ref={networkContainerRef}
        className="network-container-border"
        style={{
          position: 'absolute',
          left: 0,
          top: blueBoxTop,
          right: 0,
          bottom: 'auto', // 使用height控制，不从bottom控制
          width: '100%',
          height: blueBoxHeight, // 从下方缩短700px
          marginLeft: 0,
          marginTop: 0,
          zIndex: 1,
          border: '3px solid blue',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 255, 0.1)', // 蓝框容器 - 浅蓝色背景
          overflow: 'hidden' // 防止内容溢出
        }}
      >
        {/* 蓝框中心点 */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '12px',
            height: '12px',
            marginLeft: '-6px',
            marginTop: '-6px',
            borderRadius: '50%',
            backgroundColor: 'blue',
            border: '2px solid white',
            zIndex: 1000,
            pointerEvents: 'none',
            boxSizing: 'border-box',
            flexShrink: 0,
            flexGrow: 0
          }}
        />
        <motion.div
          ref={ref}
          initial="visible"
          animate={shouldAnimate ? 'visible' : 'visible'}
          variants={containerVariants}
          style={{ 
            width: `${containerWidth}px`,
            height: `${containerHeight}px`,
            position: 'relative',
            margin: isDesktop ? '0 auto -150px auto' : '0 auto', // 桌面版向上移动150px；其他版本：居中显示
            backgroundColor: 'rgba(128, 0, 128, 0.1)', // 网络图内容容器 - 浅紫色背景
            border: '2px dashed purple', // 紫色虚线边框
            transform: isDesktop ? `scale(${networkScale}) translateY(-150px)` : 'scale(1)', // 桌面版：缩放并向上移动150px；其他版本：正常显示
            transformOrigin: 'center center',
            transition: 'transform 0.3s ease'
          }}
        >
        {/* 动画连接线 */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none" 
          style={{ zIndex: 1 }}
          width={containerWidth}
          height={containerHeight}
        >
          {partners.map((_, index) => {
            // 从顶部（-90度）开始，顺时针分布
            const angleDeg = angleOffsets[index] - 90
            const radians = angleDeg * (Math.PI / 180)
            // 使用与卡片相同的半径计算逻辑
            const partner = partners[index]
            let lineRadius = baseRadius
            if (partner.name === '日本大型金融机构' || partner.name === '大型保证公司' || partner.name === '日本大型装修公司') {
              lineRadius = baseRadius * 0.85
            } else if (partner.name === '日本大型保险公司') {
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
            width: '144px',
            height: '144px',
            marginLeft: '-72px',
            marginTop: '-72px',
            zIndex: 10,
            boxSizing: 'border-box',
            pointerEvents: 'auto'
          }}
          variants={centerVariants}
        >
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-full w-36 h-36 flex items-center justify-center shadow-2xl border-4 border-white hover:scale-110 transition-transform duration-300">
            <div className="text-center text-white">
              <div className="text-2xl font-bold mb-1">Bourn</div>
              <div className="text-2xl font-bold">Mark</div>
            </div>
          </div>
        </motion.div>

        {/* 合作伙伴卡片 - 带动画 */}
        {partners.map((partner, index) => {
          const Icon = partnerIcons[index % partnerIcons.length]
          // 从顶部（-90度）开始，顺时针分布
          const angleDeg = angleOffsets[index] - 90
          const radians = angleDeg * (Math.PI / 180)
          
          // 为特定合作伙伴设置特殊半径，让它们更靠近中心
          let finalRadius = baseRadius
          if (partner.name === '日本大型金融机构' || partner.name === '大型保证公司' || partner.name === '日本大型装修公司') {
            // 这些卡片较小，可以更靠近中心
            finalRadius = baseRadius * 0.85
          } else if (partner.name === '日本大型保险公司') {
            // 日本大型保险公司使用稍大的半径，避免遮挡日本大型金融机构
            finalRadius = baseRadius * 0.92
          }
          
          let x = Math.round((centerX + finalRadius * Math.cos(radians)) * 100) / 100
          let y = Math.round((centerY + finalRadius * Math.sin(radians)) * 100) / 100
          
          // 为特定合作伙伴添加位置偏移
          if (partner.name === '在日中国企业协会') {
            x += 100 // 向右移动100px
            x += 20 // 再向右移动20px
          } else if (partner.name === '日本大型保险公司') {
            x -= 40 // 向左移动40px（从50px改为40px，向右移动了10px）
            y -= 30 // 向上移动30px
          } else if (partner.name === '日本大型金融机构') {
            y -= 10 // 向上移动10px
            x += 30 // 向右移动30px
          } else if (partner.name === '大型保证公司') {
            y -= 10 // 向上移动10px
            x -= 20 // 向左移动20px
          } else if (partner.name === '日本大型装修公司') {
            x -= 20 // 向左移动20px
          } else if (partner.name === 'Jetro 日本贸易振兴协会') {
            y += 20 // 向下移动20px
            x += 60 // 向右移动60px
          } else if (partner.name === '综合法律与会计事务所') {
            y -= 20 // 向上移动20px
          }
          
          // 为特定合作伙伴设置特殊宽度和拉宽方向
          let finalCardWidth = cardWidth
          let cardOffsetX = 0
          
          if (partner.name === '全日本中国企业协会联合会') {
            // 向左拉宽20px（从350px改为370px，但向左拉宽意味着左边扩展20px）
            finalCardWidth = 320 + 50 // 原320px + 50px = 370px（30px向右 + 20px向左，实际总宽度增加50px）
            cardOffsetX = (finalCardWidth - cardWidth) / 2 - 20 // 向左偏移20px，实现向左拉宽
          } else if (partner.name === 'Jetro 日本贸易振兴协会') {
            // 向右拉宽40px
            finalCardWidth = 320 + 40 // 320px + 40px = 360px
            cardOffsetX = (finalCardWidth - cardWidth) / 2 // 向右偏移，保持中心点不变，向右拉宽40px
          } else if (partner.name === '综合法律与会计事务所') {
            // 向左拉宽20px
            finalCardWidth = 320 + 20 // 320px + 20px = 340px
            cardOffsetX = (finalCardWidth - cardWidth) / 2 - 20 // 向左偏移20px，实现向左拉宽
          } else if (partner.name === '日本大型保险公司') {
            // 向左拉宽50px（30px + 20px，宽度增加50px，左边扩展50px），然后向左移动20px
            finalCardWidth = cardWidth + 50 // 240 + 50 = 290px
            cardOffsetX = -70 // 向左偏移70px（-50拉宽 + -20移动）
          } else if (partner.name === '日本大型装修公司') {
            // 向左拉宽50px（30px + 20px，宽度增加50px，左边扩展50px）
            finalCardWidth = cardWidth + 50 // 240 + 50 = 290px
            cardOffsetX = -50 // 向左偏移50px，实现向左拉宽（再向左拉宽20px）
          } else if (partner.name === '日本大型金融机构') {
            // 向左拉宽10px，向右拉宽100px（60px + 40px，总宽度增加110px，左边扩展10px，右边扩展100px），然后向左移动40px，再向右移动30px
            finalCardWidth = cardWidth + 110 // 240 + 110 = 350px
            cardOffsetX = -10 // 向左移动10px（从-40变成-10，向右移动了30px）
          } else if (partner.name === '大型保证公司') {
            // 向左拉宽40px，向左移动20px，然后向右拉宽20px
            finalCardWidth = cardWidth + 60 // 240 + 60 = 300px（40px向左 + 20px向右）
            cardOffsetX = -60 // 向左偏移60px（-40拉宽 + -20移动），向右拉宽20px
          } else if (partner.name === '在日中国企业协会') {
            // 向右拉宽90px（30px + 30px + 30px，宽度增加90px，右边扩展90px）
            finalCardWidth = cardWidth + 90 // 240 + 90 = 330px
            cardOffsetX = 30 // 向右偏移30px，实现向右拉宽（再向右拉宽30px）
          } else if (partner.name === '苏州工业园区') {
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
        {/* 网络图中心点 */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '20px',
            height: '20px',
            marginLeft: '-10px',
            marginTop: '-10px',
            borderRadius: '50%',
            backgroundColor: 'white',
            border: '2px solid #333',
            zIndex: 1000,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#333'
          }}
        >
          网
        </div>
        </motion.div>
      </div>
    </div>
  )
}

const projects = [
  {
    title: '金山 WPS 日本子公司设立服务',
    result: '协助完成法人登记、签约日本大型不动产公司设立办公室，并搭建本地财务与招聘体系。',
  },
  {
    title: '小米日本分公司设立咨询服务',
    result: '提供市场进入策略与合规咨询，统筹办公选址、品牌本地化及通路合作伙伴对接。',
  },
]

export default function QiChuPage() {
  const [showMobilePortrait, setShowMobilePortrait] = useState(false)
  const [showIpadPortrait, setShowIpadPortrait] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  
  // --- Partners infographic (fixed canvas + scale, NO clipping/overlap) ---
  const PARTNERS_BASE_W = 1800
  const PARTNERS_BASE_H = 1200
  const PARTNERS_EXTRA_BOTTOM = 260 // 给底部卡片/阴影留余量，避免压到下一个区块

  const partnersStageRef = useRef<HTMLDivElement>(null)
  const [partnersScale, setPartnersScale] = useState(1)

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
      
      // 桌面版：宽度 > 1023 或者 (宽度 >= 768 且横屏)
      const desktop = width > 1023 || (width >= 768 && !isPortrait)
      setIsDesktop(desktop)
    }

    // 立即执行一次
    checkViewport()
    
    // 延迟执行多次，确保在DOM渲染后
    const timeoutId1 = setTimeout(checkViewport, 100)
    const timeoutId2 = setTimeout(checkViewport, 300)
    const timeoutId3 = setTimeout(checkViewport, 500)
    
    window.addEventListener('resize', checkViewport)
    window.addEventListener('orientationchange', checkViewport)
    
    return () => {
      clearTimeout(timeoutId1)
      clearTimeout(timeoutId2)
      clearTimeout(timeoutId3)
      window.removeEventListener('resize', checkViewport)
      window.removeEventListener('orientationchange', checkViewport)
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
          <div className="relative z-10 container-custom">
            <p className="text-sm text-green-300 font-semibold mb-4 drop-shadow-md">Corporate Expansion</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 drop-shadow-lg">企业出海助力与落地服务</h1>
            <p className="text-lg text-gray-200 max-w-3xl leading-relaxed drop-shadow-md">
              面向计划进入日本市场的企业，提供市场进入策略、合作伙伴对接、合规办理及品牌本地化支持，帮助团队快速搭建在地运营体系，降低文化与制度差异带来的挑战。
            </p>
          </div>
        </section>

      <section id="services" className="section-padding" style={{ position: 'relative', zIndex: 10 }}>
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">相关服务</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              为企业提供全方位的落地支持服务，从选址到运营，一站式解决方案
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 relative z-10">
            {relatedServices.map((service, index) => {
              const Icon = partnerIcons[index] ?? Globe
              return (
                <div
                  key={service.name}
                  className="group bg-gradient-to-br from-white to-green-50/50 backdrop-blur-sm border-2 border-green-100 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-green-300 relative z-10"
                  style={{ pointerEvents: 'auto' }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-navy-700 mb-2 group-hover:text-green-600 transition-colors">{service.name}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{service.desc}</p>
                  <div className="mt-4 pt-4 border-t border-green-100">
                    <span className="text-green-600 text-sm font-medium group-hover:underline">了解更多 →</span>
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* 额外的服务说明 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-green-200/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  专业团队支持
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  拥有丰富经验的本地化团队，熟悉日本商业环境与法规，为您提供专业指导
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  一站式服务
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  从市场调研到落地运营，全程陪伴式服务，减少沟通成本，提高执行效率
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
  id="partners"
  className="section-padding partners-section"
  style={{
    position: 'relative',
    zIndex: 10,
    paddingTop: '50px',
    paddingBottom: isDesktop ? '8px' : '60px', // 桌面版paddingBottom
    minHeight: isDesktop ? '1000px' : '1300px', // 桌面版：1000px；其他版本：1300px（确保有足够高度显示内容：1200px内容+100px余量）
    maxHeight: isDesktop ? '1000px' : 'none', // 桌面版限制最大高度为1000px
    height: isDesktop ? '1000px' : '1300px', // 桌面版：1000px；其他版本：1300px（固定高度确保内容可见）
    border: '3px solid green',
    boxSizing: 'border-box',
    overflow: isDesktop ? 'hidden' : 'visible', // 桌面版隐藏溢出内容；其他版本：visible（允许内容显示）
  }}
>
  <div className="container-custom" style={{ overflow: 'visible' }}>
    <div className="text-center mb-4">
      <h2 className="text-3xl font-bold text-white mb-4">合作伙伴网络</h2>
      <p className="text-gray-300 max-w-2xl mx-auto">
        我们与日本各领域的专业机构建立了紧密的合作关系，为企业提供全方位的支持服务
      </p>
    </div>
  </div>

  {/* ✅ 所有端统一：网络图等比缩放；父容器按缩放后的真实高度占位，绝不允许被遮挡 */}
  <div
    ref={partnersStageRef}
    style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingTop: '10px',
      paddingBottom: '10px',
    }}
  >
    <div
      style={{
        width: `${partnersScaledW}px`,
        height: `${partnersScaledH}px`,
        position: 'relative',
      }}
    >
      <div
        style={{
          width: `${PARTNERS_BASE_W}px`,
          height: `${PARTNERS_BASE_H}px`,
          transform: `scale(${partnersScale})`,
          transformOrigin: 'top left',
        }}
      >
        <PartnersNetwork partners={partners} partnerIcons={partnerIcons} />
      </div>
    </div>
  </div>
</section>

      <section id="cases" className="section-padding" style={{ marginTop: '0px', position: 'relative', zIndex: 10, border: '3px solid orange', boxSizing: 'border-box' }}>
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">成功案例</h2>
          
          {/* 横向滚动容器 */}
          <div className="relative">
            <div className="overflow-x-auto scroll-smooth pb-4 scrollbar-hide">
              <div className="flex gap-6 min-w-max">
                {projects.map((project, index) => {
                  // 从案例展示页面获取对应的图片和日期
                  const projectData = {
                    '金山 WPS 日本子公司设立服务': {
                      id: 'kingsoft-wps-japan',
                      date: '2024/11/15',
                      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    },
                    '小米日本分公司设立咨询服务': {
                      id: 'xiaomi-japan-consulting',
                      date: '2024/09/20',
                      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    },
                  }[project.title] || {
                    id: `project-${index}`,
                    date: '2024/01/01',
                    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                  }

                  return (
                    <Link
                      key={project.title}
                      href={`/cases/${projectData.id}`}
                      className="group bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex-shrink-0"
                      style={{ width: '380px' }}
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

                      <div className="p-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                          <Calendar size={16} />
                          <span>{projectData.date}</span>
                        </div>
                        <h3 className="text-xl font-semibold text-navy-900 mb-2 group-hover:text-navy-600 transition-colors duration-200">
                          {project.title}
                        </h3>
                        <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                          {project.result}
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-bold text-white mb-4">计划拓展日本业务？</h2>
          <p className="text-gray-200 max-w-2xl mx-auto mb-6 leading-relaxed">
            告诉我们您的行业、预算与时间安排，我们将提供市场评估、落地路线与伙伴资源建议，为您构建可持续的在日业务体系。
          </p>
          <a href="/#contact" className="btn-primary inline-flex items-center gap-2">
            获取专属方案
          </a>
        </div>
      </section>
      </div>
    </PageLayout>
  )
}


