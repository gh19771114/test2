'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef, useMemo } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function CompanyHistoryPage() {
  const { t } = useLanguage()
  
  const milestones = useMemo(() => [
  {
    year: t('company.history.milestones.milestone1.year'),
    title: t('company.history.milestones.milestone1.title'),
    description: t('company.history.milestones.milestone1.description'),
    image: {
      src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: t('company.history.milestones.milestone1.imageAlt'),
    },
  },
  {
    year: t('company.history.milestones.milestone2.year'),
    title: t('company.history.milestones.milestone2.title'),
    description: t('company.history.milestones.milestone2.description'),
    image: {
      src: 'https://images.unsplash.com/photo-1467043237213-65f2da53396f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: t('company.history.milestones.milestone2.imageAlt'),
    },
  },
  {
    year: t('company.history.milestones.milestone3.year'),
    title: t('company.history.milestones.milestone3.title'),
    description: t('company.history.milestones.milestone3.description'),
    image: {
      src: 'https://images.unsplash.com/photo-1499916078039-922301b0eb9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: t('company.history.milestones.milestone3.imageAlt'),
    },
  },
  {
    year: t('company.history.milestones.milestone4.year'),
    title: t('company.history.milestones.milestone4.title'),
    description: t('company.history.milestones.milestone4.description'),
    image: {
      src: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: t('company.history.milestones.milestone4.imageAlt'),
    },
  },
  {
    year: t('company.history.milestones.milestone5.year'),
    title: t('company.history.milestones.milestone5.title'),
    description: t('company.history.milestones.milestone5.description'),
    image: {
      src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: t('company.history.milestones.milestone5.imageAlt'),
    },
  },
  {
    year: t('company.history.milestones.milestone6.year'),
    title: t('company.history.milestones.milestone6.title'),
    description: t('company.history.milestones.milestone6.description'),
    image: {
      src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      alt: t('company.history.milestones.milestone6.imageAlt'),
    },
  },
  {
    year: t('company.history.milestones.milestone7.year'),
    title: t('company.history.milestones.milestone7.title'),
    description: t('company.history.milestones.milestone7.description'),
    image: {
      src: 'https://images.unsplash.com/photo-1467043237213-65f2da53396f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      alt: t('company.history.milestones.milestone7.imageAlt'),
    },
  },
  {
    year: t('company.history.milestones.milestone8.year'),
    title: t('company.history.milestones.milestone8.title'),
    description: t('company.history.milestones.milestone8.description'),
    image: {
      src: 'https://images.unsplash.com/photo-1505798577917-a65157d3320a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: t('company.history.milestones.milestone8.imageAlt'),
    },
  },
  {
    year: t('company.history.milestones.milestone9.year'),
    title: t('company.history.milestones.milestone9.title'),
    description: t('company.history.milestones.milestone9.description'),
    image: {
      src: 'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: t('company.history.milestones.milestone9.imageAlt'),
    },
  },
  {
    year: t('company.history.milestones.milestone10.year'),
    title: t('company.history.milestones.milestone10.title'),
    description: t('company.history.milestones.milestone10.description'),
    image: {
      src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: t('company.history.milestones.milestone10.imageAlt'),
    },
  },
  {
    year: t('company.history.milestones.milestone11.year'),
    title: t('company.history.milestones.milestone11.title'),
    description: t('company.history.milestones.milestone11.description'),
    image: {
      src: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: t('company.history.milestones.milestone11.imageAlt'),
    },
  },
  ], [t])

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

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <PageLayout>
        <section className="relative pt-28 pb-16 bg-gradient-to-br from-teal-800 via-teal-700 to-navy-800 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=60"
            alt={t('company.history.title')}
            fill
            className="object-cover opacity-30"
            priority
            quality={60}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-teal-900/80 to-navy-900/60"></div>
        </div>
        <div className="relative z-10 container-custom">
          <p className="text-sm text-teal-300 font-semibold mb-4">{t('company.history.subtitle')}</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">{t('company.history.title')}</h1>
          <p className="text-lg text-gray-200 max-w-4xl leading-relaxed text-balance">
            {t('company.history.description')}
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
