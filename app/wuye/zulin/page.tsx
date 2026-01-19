'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useMemo } from 'react'
import { ClipboardCheck, Users, FileCheck, Key, TrendingUp, CheckCircle2, Clock, Building2, Sparkles, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

// 这些数据将在组件内从多语言文件读取

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
}

export default function ZulinPage() {
  const { t } = useLanguage()
  const heroRef = useRef(null)
  const statsRef = useRef(null)
  const servicesRef = useRef(null)
  const processRef = useRef(null)
  
  const isHeroInView = useInView(heroRef, { once: true })
  const isStatsInView = useInView(statsRef, { once: true, margin: '-100px' })
  const isServicesInView = useInView(servicesRef, { once: true, margin: '-100px' })
  const isProcessInView = useInView(processRef, { once: true, margin: '-100px' })
  
  // 从多语言文件读取数据（时间线内容已整合到服务项目中）
  
  const stats = useMemo(() => [
    { value: t('wuye.zulin.stats.occupancyRate.value'), label: t('wuye.zulin.stats.occupancyRate.label'), icon: TrendingUp },
    { value: t('wuye.zulin.stats.quickMoveIn.value'), label: t('wuye.zulin.stats.quickMoveIn.label'), icon: CheckCircle2 },
    { value: t('wuye.zulin.stats.managedProperties.value'), label: t('wuye.zulin.stats.managedProperties.label'), icon: Building2 },
  ], [t])
  
  const services = useMemo(() => {
    const baseServices = [
      {
        title: t('wuye.zulin.services.service1.title'),
        icon: Users,
        image: '/imgs/wuye/real/zulin-service-1.jpg',
        description: t('wuye.zulin.services.service1.description'),
        items: (t('wuye.zulin.services.service1.items', { returnObjects: true }) as string[]) || [],
        timeline: {
          time: t('wuye.zulin.timeline.item1.time'),
          title: t('wuye.zulin.timeline.item1.title'),
          description: t('wuye.zulin.timeline.item1.description'),
        },
        color: 'from-blue-500 to-blue-600',
      },
      {
        title: t('wuye.zulin.services.service2.title'),
        icon: FileCheck,
        image: '/imgs/wuye/real/zulin-service-2.jpg',
        description: t('wuye.zulin.services.service2.description'),
        items: (t('wuye.zulin.services.service2.items', { returnObjects: true }) as string[]) || [],
        timeline: {
          time: t('wuye.zulin.timeline.item2.time'),
          title: t('wuye.zulin.timeline.item2.title'),
          description: t('wuye.zulin.timeline.item2.description'),
        },
        color: 'from-green-500 to-green-600',
      },
      {
        title: t('wuye.zulin.services.service3.title'),
        icon: Key,
        image: '/imgs/wuye/real/zulin-service-3.jpg',
        description: t('wuye.zulin.services.service3.description'),
        items: (t('wuye.zulin.services.service3.items', { returnObjects: true }) as string[]) || [],
        timeline: {
          time: t('wuye.zulin.timeline.item3.time'),
          title: t('wuye.zulin.timeline.item3.title'),
          description: t('wuye.zulin.timeline.item3.description'),
        },
        color: 'from-purple-500 to-purple-600',
      },
    ]
    return baseServices
  }, [t])
  
  const processSteps = useMemo(() => [
    {
      step: '01',
      title: t('wuye.zulin.process.step1.title'),
      description: t('wuye.zulin.process.step1.description'),
      image: '/imgs/wuye/real/zulin-process-1.jpg',
    },
    {
      step: '02',
      title: t('wuye.zulin.process.step2.title'),
      description: t('wuye.zulin.process.step2.description'),
      image: '/imgs/wuye/real/zulin-process-2.jpg',
    },
    {
      step: '03',
      title: t('wuye.zulin.process.step3.title'),
      description: t('wuye.zulin.process.step3.description'),
      image: '/imgs/wuye/real/zulin-process-3.jpg',
    },
    {
      step: '04',
      title: t('wuye.zulin.process.step4.title'),
      description: t('wuye.zulin.process.step4.description'),
      image: '/imgs/wuye/real/zulin-process-4.jpg',
    },
  ], [t])

  return (
    <PageLayout>
      <div className="relative wuye-subpage">
        {/* Hero Section */}
        <section ref={heroRef} className="relative pt-28 pb-20 md:pb-24 bg-gradient-to-br from-blue-800 via-blue-700 to-navy-800 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/imgs/wuye/real/zulin-hero.jpg"
              alt="租赁管理"
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-navy-900/60"></div>
            {/* 装饰性元素 */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-navy-400/20 rounded-full blur-3xl"></div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative z-10 container-custom"
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={isHeroInView ? { scale: 1, rotate: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <ClipboardCheck className="w-8 h-8 text-blue-300" />
              </motion.div>
              <p className="text-sm text-blue-300 font-semibold drop-shadow-md">{t('wuye.zulin.subtitle')}</p>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 drop-shadow-lg">{t('wuye.zulin.title')}</h1>
            <p className="text-lg text-gray-200 max-w-3xl leading-relaxed mb-8 drop-shadow-md">
              {t('wuye.zulin.description')}
            </p>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4"
            >
              <div className="flex items-center gap-2 text-blue-200">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm">{t('wuye.zulin.features.occupancyRate')}</span>
              </div>
              <div className="flex items-center gap-2 text-blue-200">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm">{t('wuye.zulin.features.quickMoveIn')}</span>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section ref={statsRef} className="section-padding bg-gradient-to-b from-gray-900 to-navy-900">
          <div className="container-custom px-0 sm:px-6 md:px-0">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isStatsInView ? 'visible' : 'hidden'}
              className="grid grid-cols-3 gap-1 sm:flex sm:flex-wrap sm:justify-center sm:gap-6 md:gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-2 sm:p-6 md:p-8 border border-white/10 hover:border-blue-500/50 transition-all duration-300 group w-full sm:w-auto sm:min-w-[200px] min-w-0 flex flex-col items-center justify-center text-center"
                >
                  <div className="flex justify-center mb-1 sm:mb-4">
                    <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-3xl md:text-4xl font-bold text-white mb-0.5 sm:mb-2 group-hover:text-blue-300 transition-colors whitespace-nowrap leading-tight">
                    {stat.value}
                  </div>
                  <div className="text-[12px] sm:text-sm md:text-base text-gray-300 whitespace-nowrap leading-tight tracking-tight">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section ref={servicesRef} className="section-padding">
          <div className="container-custom px-0 sm:px-6 md:px-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isServicesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                {t('wuye.zulin.description')}
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isServicesInView ? 'visible' : 'hidden'}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-8"
            >
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group relative bg-gray-50/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-2xl"
                >
                  <div className="flex flex-col">
                    <div className="relative w-full h-44 sm:h-32 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-60 group-hover:opacity-80 transition-opacity duration-300`}></div>
                    </div>
                    <div className="flex-1 p-2 sm:p-6 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 text-center">{service.title}</h3>
                      <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 leading-snug text-center">{service.description}</p>
                      <ul className="space-y-1 mb-3 sm:mb-4">
                      {service.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2">
                          <div className={`mt-1 w-2.5 h-2.5 rounded-full bg-gradient-to-br ${service.color} flex-shrink-0`}></div>
                          <span className="text-sm sm:text-base text-gray-800 leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                      {service.timeline && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-semibold text-gray-500 whitespace-nowrap">{service.timeline.time}</span>
                          </div>
                          <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-1 text-center">{service.timeline.title}</h4>
                          <p className="text-xs sm:text-sm text-gray-600 leading-snug text-center">{service.timeline.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Process Section */}
        <section ref={processRef} className="section-padding bg-gradient-to-b from-navy-900 to-gray-900">
          <div className="container-custom">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isProcessInView ? 'visible' : 'hidden'}
              className="space-y-8 md:space-y-12"
            >
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-12`}
                >
                  <div className="flex-1 w-full">
                    <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden border border-white/10">
                      <Image
                        src={step.image}
                        alt={step.title}
                        fill
                        className="object-cover"
                        sizes="(min-width: 768px) 50vw, 100vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-navy-900/40"></div>
                    </div>
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <span className="text-lg font-bold text-white">{String(parseInt(step.step, 10))}</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white">{step.title}</h3>
                    </div>
                    <p className="text-lg text-gray-300 leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

      </div>
    </PageLayout>
  )
}
