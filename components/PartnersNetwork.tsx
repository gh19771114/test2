'use client'

import Image from 'next/image'
import { Building2, Users, Briefcase, Landmark, Globe } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

const partners = [
  {
    name: '日本大型金融机构',
    desc: '提供企业开户、资金结算与财务顾问服务，为新设法人提供本地金融支持。',
    icon: null,
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
    wide: true,
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
    wide: true,
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

type Partner = {
  name: string
  desc: string
  icon: string | null
  wide?: boolean
  link?: string
}

type PartnerIcon = typeof Building2 | typeof Users | typeof Briefcase | typeof Globe | typeof Landmark

export default function PartnersNetwork() {
  const ref = useRef(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  
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
        console.warn('sessionStorage not available:', error)
      }
    }
    
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
        console.warn('sessionStorage not available:', error)
        setHasAnimated(true)
      }
    }
  }, [isInView, hasAnimated, isMounted])
  
  const shouldAnimate = true
  const containerWidth = 1800
  const containerHeight = 1200
  const mapContainerHeight = 600
  const centerX = containerWidth / 2
  const centerY = containerHeight / 2
  const cardWidth = 240
  const cardHeight = 150
  const maxCardWidth = 360
  const maxCardHeight = 170
  const cardDiagonal = Math.sqrt(maxCardWidth * maxCardWidth + maxCardHeight * maxCardHeight) / 2
  const padding = 40
  const maxRadius = Math.min(
    (containerWidth / 2) - cardDiagonal - padding,
    (containerHeight / 2) - cardDiagonal - padding
  )
  const numCards = partners.length
  const angleStep = 360 / numCards
  const minCardDistance = cardDiagonal * 2 + 20
  const requiredRadius = minCardDistance / (2 * Math.sin((angleStep * Math.PI / 180) / 2))
  const baseRadius = Math.min(maxRadius - 10, requiredRadius)
  
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

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        pointerEvents: 'auto',
        overflow: 'hidden',
        zIndex: 1,
      }}
    >
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
          backgroundColor: 'rgba(255, 165, 0, 0.1)'
        }}
      >
        <Image
          src="/imgs/worldmap.svg"
          alt="世界地图"
          width={containerWidth}
          height={mapContainerHeight}
          style={{
            width: '100%',
            height: '50%',
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain'
          }}
          priority={false}
        />
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

      <motion.div
        ref={ref}
        initial="visible"
        animate={shouldAnimate ? 'visible' : 'visible'}
        variants={containerVariants}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          margin: '0 auto',
          backgroundColor: 'rgba(128, 0, 128, 0.1)',
          border: '2px dashed purple'
        }}
      >
        {/* 动画连接线 */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" 
          style={{ zIndex: 1 }}
          viewBox={`0 0 ${containerWidth} ${containerHeight}`}
        >
          {partners.map((_, index) => {
            const angleDeg = angleOffsets[index] - 90
            const radians = angleDeg * (Math.PI / 180)
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
        <div
          className="absolute"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            pointerEvents: 'auto',
          }}
        >
          <motion.div
            style={{
              width: 'clamp(84px, 10vw, 144px)',
              height: 'clamp(84px, 10vw, 144px)',
              boxSizing: 'border-box',
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
        </div>

        {/* 合作伙伴卡片 - 带动画 */}
        {partners.map((partner, index) => {
          const Icon = partnerIcons[index % partnerIcons.length]
          const angleDeg = angleOffsets[index] - 90
          const radians = angleDeg * (Math.PI / 180)
          
          let finalRadius = baseRadius
          if (partner.name === '日本大型金融机构' || partner.name === '大型保证公司' || partner.name === '日本大型装修公司') {
            finalRadius = baseRadius * 0.85
          } else if (partner.name === '日本大型保险公司') {
            finalRadius = baseRadius * 0.92
          }
          
          let x = Math.round((centerX + finalRadius * Math.cos(radians)) * 100) / 100
          let y = Math.round((centerY + finalRadius * Math.sin(radians)) * 100) / 100
          
          if (partner.name === '在日中国企业协会') {
            x += 100
            x += 20
          } else if (partner.name === '日本大型保险公司') {
            x -= 40
            y -= 30
          } else if (partner.name === '日本大型金融机构') {
            y -= 10
            x += 30
          } else if (partner.name === '大型保证公司') {
            y -= 10
            x -= 20
          } else if (partner.name === '日本大型装修公司') {
            x -= 20
          } else if (partner.name === 'Jetro 日本贸易振兴协会') {
            y += 20
            x += 60
          } else if (partner.name === '综合法律与会计事务所') {
            y -= 20
          }
          
          let finalCardWidth = cardWidth
          let cardOffsetX = 0
          
          if (partner.name === '全日本中国企业协会联合会') {
            finalCardWidth = 320 + 50
            cardOffsetX = (finalCardWidth - cardWidth) / 2 - 20
          } else if (partner.name === 'Jetro 日本贸易振兴协会') {
            finalCardWidth = 320 + 40
            cardOffsetX = (finalCardWidth - cardWidth) / 2
          } else if (partner.name === '综合法律与会计事务所') {
            finalCardWidth = 320 + 20
            cardOffsetX = (finalCardWidth - cardWidth) / 2 - 20
          } else if (partner.name === '日本大型保险公司') {
            finalCardWidth = cardWidth + 50
            cardOffsetX = -70
          } else if (partner.name === '日本大型装修公司') {
            finalCardWidth = cardWidth + 50
            cardOffsetX = -50
          } else if (partner.name === '日本大型金融机构') {
            finalCardWidth = cardWidth + 110
            cardOffsetX = -10
          } else if (partner.name === '大型保证公司') {
            finalCardWidth = cardWidth + 60
            cardOffsetX = -60
          } else if (partner.name === '在日中国企业协会') {
            finalCardWidth = cardWidth + 90
            cardOffsetX = 30
          } else if (partner.name === '苏州工业园区') {
            finalCardWidth = cardWidth + 80
            cardOffsetX = -80
          }
          
          const cardContent = (
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white rounded-xl p-5 shadow-lg border-2 border-gray-100 cursor-pointer"
              style={{
                width: `${(finalCardWidth / containerWidth) * 100}%`,
                minHeight: `${(cardHeight / containerHeight) * 100}%`,
              }}
            >
              <div className="flex items-start gap-3 mb-3">
                <motion.div
                  className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                >
                  {Icon ? <Icon className="w-6 h-6 text-green-600" /> : <Globe className="w-6 h-6 text-green-600" />}
                </motion.div>
                <h3 className="font-semibold text-navy-900 leading-tight" style={{ fontSize: 'clamp(14px, 1.3vw, 22px)' }}>
                  {partner.name}
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed" style={{ fontSize: 'clamp(12px, 1.1vw, 18px)' }}>
                {partner.desc}
              </p>
            </motion.div>
          )

          return (
            <motion.div
              key={partner.name}
              className="absolute"
              style={{
                left: `${((x + cardOffsetX) / containerWidth) * 100}%`,
                top: `${(y / containerHeight) * 100}%`,
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
  )
}














