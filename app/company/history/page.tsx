'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const milestones = [
  {
    year: '2009.06',
    title: '公司成立',
    description: '川雨流痕股份有限公司（当时社名：株式会社暖灯）在东京成立，开启专注华语客户的日本不动产业务。',
    image: {
      src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: '初创阶段的办公环境',
    },
  },
  {
    year: '2010.01',
    title: '总部设立',
    description: '在东京都荒川区设立总公司，构建最初的租赁与买卖顾问团队，并同年 10 月开设日暮里站前店。',
    image: {
      src: 'https://images.unsplash.com/photo-1467043237213-65f2da53396f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: '东京城区街景',
    },
  },
  {
    year: '2012.01',
    title: '区域拓展',
    description: '川口店开业，服务圈扩大至埼玉及首都圈北部；同年 9 月正式进入台湾市场。',
    image: {
      src: 'https://images.unsplash.com/photo-1499916078039-922301b0eb9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: '跨区域交通枢纽',
    },
  },
  {
    year: '2015.03',
    title: '业务升级',
    description: '开拓不动产增值业务与国际不动产业务，拓展服务领域与市场范围。',
    image: {
      src: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: '现代城市商务楼宇',
    },
  },
  {
    year: '2015.08',
    title: '海外拓展',
    description: '在上海设立当地法人公司，进一步拓展中国市场，建立跨境业务网络。',
    image: {
      src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: '上海商务区',
    },
  },
  {
    year: '2015.12',
    title: '购入总部大楼',
    description: '购入自有总部办公大楼，确立公司在日本市场的稳固根基。',
    image: {
      src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      alt: '总部办公大楼',
    },
  },
  {
    year: '2016.03',
    title: '总部迁移',
    description: '总部迁至东京都中央区，进一步贴近日本桥金融商务区，夯实跨境业务据点。',
    image: {
      src: 'https://images.unsplash.com/photo-1467043237213-65f2da53396f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      alt: '日本桥金融区',
    },
  },
  {
    year: '2017.04',
    title: '资本强化',
    description: '公司注册资本增资至 2,500 万日元，并在 10 月推出首个自有公寓项目 "WARMLIGHT RESIDENCE"。',
    image: {
      src: 'https://images.unsplash.com/photo-1505798577917-a65157d3320a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: '现代公寓建筑',
    },
  },
  {
    year: '2018.02',
    title: '资产扩张',
    description: '收购 "京都乌丸六条酒店"，进入酒店与商用资产运营领域。',
    image: {
      src: 'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: '酒店大堂',
    },
  },
  {
    year: '2021.04',
    title: '战略协同',
    description: '与 Helte 公司展开业务及资本合作，结合数字化与社区运营优势。',
    image: {
      src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: '团队协作会议',
    },
  },
  {
    year: '2021.06',
    title: '品牌焕新',
    description: '公司正式更名为川雨流痕股份有限公司（Bourn Mark CO., LTD.），确立"根植日本、连接中日"的企业定位。',
    image: {
      src: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: '品牌发布活动',
    },
  },
]

// 单独的里程碑组件，用于懒加载
function MilestoneItem({ milestone, index, isLast }: { milestone: typeof milestones[0], index: number, isLast: boolean }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.4 }}
      className="relative py-6 md:py-8"
    >
      {/* 时间轴节点 - 不显示年份，只有圆点 */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg" style={{ boxShadow: '0 0 15px rgba(59, 130, 246, 0.8)' }}></div>
      </div>

      {/* 内容区域 - 文字在左边，图片在右边 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative">
        {/* 左侧：文字内容 */}
        <div className="md:pr-12 md:text-left">
          <div className="space-y-4">
            <div>
              <span className="text-2xl md:text-3xl font-bold text-navy-700 mb-2 block">{milestone.year}</span>
              <h3 className="text-xl md:text-2xl font-bold text-navy-900 mb-3">{milestone.title}</h3>
              <p className="text-gray-700 leading-relaxed text-base md:text-lg max-w-md">
                {milestone.description}
              </p>
            </div>
          </div>
        </div>

        {/* 中间时间轴（移动端显示） */}
        <div className="flex md:hidden items-center justify-center my-4">
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg" style={{ boxShadow: '0 0 15px rgba(59, 130, 246, 0.8)' }}></div>
            {!isLast && (
              <div className="mt-2 w-0.5 h-8 bg-gradient-to-b from-blue-400 to-blue-600"></div>
            )}
          </div>
        </div>

        {/* 右侧：图片 */}
        <div className="md:pl-12">
          <div className="relative w-full max-w-sm mx-auto rounded-lg overflow-hidden shadow-lg">
            <div className="relative aspect-video bg-gray-200">
              <Image
                src={milestone.image.src}
                alt={milestone.image.alt}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 400px, 100vw"
                loading={index < 2 ? "eager" : "lazy"}
                quality={75}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQADAD8AktJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
            </div>
          </div>
        </div>
      </div>

      {/* 连接线（桌面端，最后一项不显示） */}
      {!isLast && (
        <div className="hidden md:block absolute left-1/2 top-full transform -translate-x-1/2 z-10">
          <div className="w-0.5 h-8 bg-gradient-to-b from-blue-400 to-blue-600" style={{ boxShadow: '0 0 8px rgba(59, 130, 246, 0.4)' }}></div>
        </div>
      )}
    </motion.div>
  )
}

export default function CompanyHistoryPage() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <PageLayout>
      <section className="relative pt-28 pb-16 bg-gradient-to-br from-teal-800 via-teal-700 to-navy-800 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=60"
            alt="企业沿革"
            fill
            className="object-cover opacity-30"
            priority
            quality={60}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-teal-900/80 to-navy-900/60"></div>
        </div>
        <div className="relative z-10 container-custom">
          <p className="text-sm text-teal-300 font-semibold mb-4">Company History</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">企业沿革</h1>
          <p className="text-lg text-gray-200 max-w-4xl leading-relaxed text-balance">
            自 2009 年成立以来，Bourn Mark 持续深化日本不动产与跨境服务版图：从租赁买卖、资产增值到企业投资，与中日企业共同成长，构建扎实的城市运营与资本运作经验。
          </p>
        </div>
      </section>

        {/* Timeline Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-custom max-w-6xl mx-auto">
            <div className="relative">
              {/* 时间轴线 - 垂直居中，不显示年份 */}
              <div className="absolute left-1/2 top-0 bottom-0 hidden md:block transform -translate-x-1/2">
                <div className="w-0.5 h-full bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600" style={{ boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}></div>
              </div>
              
              <div className="space-y-0">
                {milestones.map((milestone, index) => (
                  <MilestoneItem
                    key={milestone.year}
                    milestone={milestone}
                    index={index}
                    isLast={index === milestones.length - 1}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
    </PageLayout>
  )
}
