'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import Link from 'next/link'
import { Building2, Users, Briefcase, Landmark, Globe, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

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
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  // 使用固定宽度，确保中心点位置一致
  const containerWidth = 1800
  const containerHeight = 1200
  // 中心点（容器正中心）
  const centerX = containerWidth / 2
  const centerY = containerHeight / 2
  // 卡片尺寸
  const cardWidth = 240
  const cardHeight = 150
  // 计算安全半径：确保卡片不会超出容器
  // 卡片中心到边缘的距离 = 卡片对角线的一半 + 一些边距
  // 考虑最宽的卡片（320px）
  const maxCardWidth = 320
  const cardDiagonal = Math.sqrt(maxCardWidth * maxCardWidth + cardHeight * cardHeight) / 2
  const padding = 20 // 进一步减少边距，让图形更紧凑
  const maxRadius = Math.min(
    (containerWidth / 2) - cardDiagonal - padding,
    (containerHeight / 2) - cardDiagonal - padding
  )
  const baseRadius = maxRadius - 5 // 进一步减少余量
  
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
    hidden: { opacity: 0 },
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
      style={{ 
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '1200px',
        position: 'relative'
      }}
    >
      <div
        style={{
          position: 'relative',
          width: `${containerWidth}px`,
          height: `${containerHeight}px`,
          marginLeft: '-28px' // 居中后再向左偏移28px
        }}
      >
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
          style={{ 
            width: '100%',
            height: '100%',
            position: 'relative'
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
            boxSizing: 'border-box'
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
          
          const x = Math.round((centerX + finalRadius * Math.cos(radians)) * 100) / 100
          const y = Math.round((centerY + finalRadius * Math.sin(radians)) * 100) / 100
          
          // 为特定合作伙伴设置特殊宽度
          let finalCardWidth = cardWidth
          let cardOffsetX = 0
          
          if (partner.name === '全日本中国企业协会联合会') {
            // 向左扩大，标题不换行
            finalCardWidth = 320 // 增加宽度
            cardOffsetX = -(finalCardWidth - cardWidth) / 2 // 向左偏移，保持中心点不变
          } else if (partner.name === 'Jetro 日本贸易振兴协会') {
            // 向右扩大，标题不换行
            finalCardWidth = 320 // 增加宽度
            cardOffsetX = (finalCardWidth - cardWidth) / 2 // 向右偏移，保持中心点不变
          } else if (partner.name === '综合法律与会计事务所') {
            // 向右扩大，标题不换行
            finalCardWidth = 320 // 增加宽度
            cardOffsetX = (finalCardWidth - cardWidth) / 2 // 向右偏移，保持中心点不变
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
                <h3 className="text-base font-semibold text-navy-900 leading-tight flex-1">{partner.name}</h3>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">{partner.desc}</p>
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
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 to-navy-900/60"></div>
          </div>
          <div className="relative z-10 container-custom">
            <p className="text-sm text-green-300 font-semibold mb-4">Corporate Expansion</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">企业出海助力与落地服务</h1>
            <p className="text-lg text-gray-200 max-w-3xl leading-relaxed">
              面向计划进入日本市场的企业，提供市场进入策略、合作伙伴对接、合规办理及品牌本地化支持，帮助团队快速搭建在地运营体系，降低文化与制度差异带来的挑战。
            </p>
          </div>
        </section>

      <section id="services" className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">相关服务</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              为企业提供全方位的落地支持服务，从选址到运营，一站式解决方案
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {relatedServices.map((service, index) => {
              const Icon = partnerIcons[index] ?? Globe
              return (
                <div
                  key={service.name}
                  className="group bg-gradient-to-br from-white to-green-50/50 backdrop-blur-sm border-2 border-green-100 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-green-300"
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

      <section id="partners" className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-4">
            <h2 className="text-3xl font-bold text-white mb-4">合作伙伴网络</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              我们与日本各领域的专业机构建立了紧密的合作关系，为企业提供全方位的支持服务
            </p>
          </div>
          
          {/* 移动端：简单网格布局 */}
          <div className="md:hidden grid grid-cols-1 gap-6">
            {partners.map((partner, index) => {
              const Icon = partnerIcons[index % partnerIcons.length]
              const cardContent = (
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
                  <div className="flex items-start gap-4 mb-4">
                    {partner.icon ? (
                      <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <Image src={partner.icon} alt={partner.name} width={56} height={56} className="object-cover rounded-xl" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        {Icon ? <Icon className="w-7 h-7 text-green-600" /> : <Globe className="w-7 h-7 text-green-600" />}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-navy-900 leading-tight mb-2">{partner.name}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{partner.desc}</p>
                </div>
              )
              
              return partner.link ? (
                <a
                  key={partner.name}
                  href={partner.link}
                  className="block focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded-2xl"
                >
                  {cardContent}
                </a>
              ) : (
                <div key={partner.name}>{cardContent}</div>
              )
            })}
          </div>
        </div>
        
        {/* 桌面端：优化的中心辐射式网络布局 - 放在标题文字正下方，移出container-custom确保能真正居中 */}
        <div className="hidden md:block w-full" style={{ marginTop: '-80px' }}>
          <PartnersNetwork partners={partners} partnerIcons={partnerIcons} />
        </div>
      </section>

      <section id="cases" className="section-padding">
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


