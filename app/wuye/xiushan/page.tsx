'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import ServiceTimeline from '@/components/ServiceTimeline'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Wrench, AlertCircle, Settings, Hammer, Clock, CheckCircle2, Users, Building2, Sparkles, ArrowRight } from 'lucide-react'

const timelineItems = [
  {
    time: '居住物件24小时以内/商用物件最短5个工作日以内',
    title: '应急维修响应',
    description: '接到租客报修后，24小时内安排维修人员上门检查，紧急情况（如漏水、断电等）及时响应。',
  },
  {
    time: '3-5个工作日',
    title: '维修方案确定',
    description: '根据检查结果，制定维修方案并报价，经业主确认后安排施工。',
  },
  {
    time: '1-2周内',
    title: '维修完成',
    description: '完成维修工作，进行质量验收，确保问题彻底解决。',
  },
]

const stats = [
  { value: '24h', label: '应急响应', icon: Clock },
  { value: '100%', label: '质量保证', icon: CheckCircle2 },
  { value: '专业', label: '维修团队', icon: Users },
  { value: '及时', label: '响应速度', icon: AlertCircle },
]

const services = [
  {
    title: '24小时应急维修',
    icon: AlertCircle,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: '快速响应紧急维修需求，确保租客安全',
    items: [
      '紧急情况快速响应',
      '专业维修团队',
      '维修质量保证',
      '24小时待命服务',
    ],
    color: 'from-orange-500 to-orange-600',
  },
  {
    title: '定期检查与耗材更换',
    icon: Settings,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: '预防性维护，延长设备使用寿命',
    items: [
      '设备耗材更换',
      '预防性维护',
      '定期检查报告',
      '设备状态监控',
    ],
    color: 'from-blue-500 to-blue-600',
  },
  {
    title: '退租装修与施工管理',
    icon: Hammer,
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: '专业的装修施工管理服务',
    items: [
      '装修方案设计',
      '施工进度管理',
      '质量验收',
      '成本控制优化',
    ],
    color: 'from-purple-500 to-purple-600',
  },
]

const processSteps = [
  {
    step: '01',
    title: '报修响应',
    description: '接到租客报修后，24小时内安排维修人员上门检查，紧急情况及时响应。',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  {
    step: '02',
    title: '方案确定',
    description: '根据检查结果，制定维修方案并报价，经业主确认后安排施工。',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  {
    step: '03',
    title: '维修完成',
    description: '完成维修工作，进行质量验收，确保问题彻底解决。',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
]

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

export default function XiushanPage() {
  const heroRef = useRef(null)
  const statsRef = useRef(null)
  const servicesRef = useRef(null)
  const processRef = useRef(null)
  
  const isHeroInView = useInView(heroRef, { once: true })
  const isStatsInView = useInView(statsRef, { once: true, margin: '-100px' })
  const isServicesInView = useInView(servicesRef, { once: true, margin: '-100px' })
  const isProcessInView = useInView(processRef, { once: true, margin: '-100px' })

  return (
    <PageLayout>
      <div className="relative">
        {/* Hero Section */}
        <section ref={heroRef} className="relative pt-28 pb-20 md:pb-24 bg-gradient-to-br from-orange-800 via-orange-700 to-navy-800 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="修缮维护"
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-orange-900/80 to-navy-900/60"></div>
            {/* 装饰性元素 */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-orange-400/20 rounded-full blur-3xl"></div>
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
                <Wrench className="w-8 h-8 text-orange-300" />
              </motion.div>
              <p className="text-sm text-orange-300 font-semibold drop-shadow-md">Maintenance & Repair</p>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 drop-shadow-lg">修缮维护服务</h1>
            <p className="text-lg text-gray-200 max-w-3xl leading-relaxed mb-8 drop-shadow-md">
              提供24小时应急维修、定期检查与耗材更换、装修升级等全方位维护服务，确保房产保持良好状态。
            </p>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4"
            >
              <div className="flex items-center gap-2 text-orange-200">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm">24小时应急响应</span>
              </div>
              <div className="flex items-center gap-2 text-orange-200">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm">专业维修团队</span>
              </div>
              <div className="flex items-center gap-2 text-orange-200">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm">100%质量保证</span>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section ref={statsRef} className="section-padding bg-gradient-to-b from-gray-900 to-navy-900">
          <div className="container-custom">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isStatsInView ? 'visible' : 'hidden'}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 hover:border-orange-500/50 transition-all duration-300 text-center group"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-gray-300">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section ref={servicesRef} className="section-padding">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isServicesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-orange-500" />
                <p className="text-sm text-orange-400 font-semibold">Our Services</p>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">专业服务内容</h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                全方位的修缮维护服务，从应急维修到定期维护，确保房产保持最佳状态
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isServicesInView ? 'visible' : 'hidden'}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group relative bg-gray-50/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200 hover:border-orange-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-60 group-hover:opacity-80 transition-opacity duration-300`}></div>
                    <div className="absolute top-4 left-4">
                      <div className="w-14 h-14 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <service.icon className={`w-7 h-7 bg-gradient-to-br ${service.color} bg-clip-text text-transparent`} style={{ filter: 'none' }} />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1">{service.title}</h3>
                      <p className="text-sm text-white/90">{service.description}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-3">
                      {service.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-3">
                          <div className={`mt-1 w-2 h-2 rounded-full bg-gradient-to-br ${service.color} flex-shrink-0`}></div>
                          <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
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
              initial={{ opacity: 0, y: 30 }}
              animate={isProcessInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 mb-4">
                <Wrench className="w-6 h-6 text-orange-400" />
                <p className="text-sm text-orange-300 font-semibold">Our Process</p>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">服务流程</h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                从报修响应到维修完成，三步流程确保问题快速解决
              </p>
            </motion.div>

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
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-900/40 to-navy-900/40"></div>
                      <div className="absolute top-4 left-4">
                        <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                          <span className="text-2xl font-bold text-white">{step.step}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                        <span className="text-lg font-bold text-white">{step.step}</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white">{step.title}</h3>
                    </div>
                    <p className="text-lg text-gray-300 leading-relaxed">{step.description}</p>
                    {index < processSteps.length - 1 && (
                      <div className="mt-6 flex items-center gap-2 text-orange-400">
                        <ArrowRight className="w-5 h-5" />
                        <span className="text-sm font-medium">下一步</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="section-padding">
          <div className="container-custom max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">服务流程时间线</h2>
            <ServiceTimeline items={timelineItems} />
            <p className="text-sm text-gray-400 text-center mt-6">*具体时间会根据情况不同有所变动</p>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
