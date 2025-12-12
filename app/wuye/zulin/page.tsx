'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import ServiceTimeline from '@/components/ServiceTimeline'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ClipboardCheck, Users, FileCheck, Key, TrendingUp, CheckCircle2, Clock, Building2, Sparkles, ArrowRight } from 'lucide-react'

const timelineItems = [
  {
    time: '24小时内',
    title: '租客筛选与背景调查',
    description: '租客提交承租申请后，我们将在24小时内完成对租客提供信息的真伪验证和社会信用调查。同时联系保证公司申请担保，确保租客资质符合要求。',
  },
  {
    time: '1周内',
    title: '办理入住手续',
    description: '完成所有入住手续的办理，包括合同签署、押金收取、钥匙交接等。通知租客具体入住日期，确保流程顺畅。',
  },
  {
    time: '最快2周',
    title: '完成入住',
    description: '从申请到入住，最快可在2周内完成整个流程，让租客尽快入住，同时确保所有手续合规完整。',
  },
  {
    time: '契约到期前2个月',
    title: '契约更新',
    description: '在契约到期前2个月的时间联系租客，准备相关手续。提前沟通续约意向，协商租金调整，确保续约流程顺畅进行。',
  },
  {
    time: '收到解约通知24小时内',
    title: '解约',
    description: '在收到解约通知的24小时之内开始相关手续办理。确定房间的修缮等工作，确保尽快着手招租工作，减少空置时间，最大化资产收益。',
  },
]

const stats = [
  { value: '96%+', label: '平均入住率', icon: TrendingUp },
  { value: '24h', label: '快速响应', icon: Clock },
  { value: '2周', label: '最快入住时间', icon: CheckCircle2 },
  { value: '1000+', label: '管理房产', icon: Building2 },
]

const services = [
  {
    title: '租客筛选与背景调查',
    icon: Users,
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: '严格的租客筛选流程，确保房产安全',
    items: [
      '身份信息验证',
      '信用记录调查',
      '收入证明审核',
      '保证公司担保申请',
    ],
    color: 'from-blue-500 to-blue-600',
  },
  {
    title: '合同签署与租金调整',
    icon: FileCheck,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: '专业的合同管理与租金优化服务',
    items: [
      '租赁合同起草与签署',
      '押金与首月租金收取',
      '租金调整策略制定',
      '续约协商与处理',
    ],
    color: 'from-green-500 to-green-600',
  },
  {
    title: '入住退房手续',
    icon: Key,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: '完善的入住退房流程管理',
    items: [
      '入住前房屋检查',
      '钥匙交接与设备说明',
      '退房时验房报告',
      '押金结算与返还',
    ],
    color: 'from-purple-500 to-purple-600',
  },
]

const processSteps = [
  {
    step: '01',
    title: '租客申请',
    description: '租客提交承租申请，我们立即开始审核流程，确保快速响应。',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  {
    step: '02',
    title: '背景调查',
    description: '24小时内完成身份验证、信用调查和保证公司担保申请。',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  {
    step: '03',
    title: '合同签署',
    description: '完成合同起草、签署和押金收取，确保所有手续合规。',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  {
    step: '04',
    title: '入住交接',
    description: '进行房屋检查、钥匙交接和设备说明，确保租客顺利入住。',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
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

export default function ZulinPage() {
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
        <section ref={heroRef} className="relative pt-28 pb-20 md:pb-24 bg-gradient-to-br from-blue-800 via-blue-700 to-navy-800 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
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
              <p className="text-sm text-blue-300 font-semibold drop-shadow-md">Rental Management</p>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 drop-shadow-lg">租赁管理服务</h1>
            <p className="text-lg text-gray-200 max-w-3xl leading-relaxed mb-8 drop-shadow-md">
              提供从租客筛选、合同签署到入住退房的全流程管理服务，确保您的房产快速出租并持续产生稳定收益。
            </p>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4"
            >
              <div className="flex items-center gap-2 text-blue-200">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm">24小时快速响应</span>
              </div>
              <div className="flex items-center gap-2 text-blue-200">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm">96%+平均入住率</span>
              </div>
              <div className="flex items-center gap-2 text-blue-200">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm">最快2周完成入住</span>
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
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 hover:border-blue-500/50 transition-all duration-300 text-center group"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
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
                <Sparkles className="w-6 h-6 text-blue-500" />
                <p className="text-sm text-blue-400 font-semibold">Our Services</p>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">专业服务内容</h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                全方位的租赁管理服务，从租客筛选到退房交接，全程专业支持
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
                  className="group relative bg-gray-50/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
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
                <ClipboardCheck className="w-6 h-6 text-blue-400" />
                <p className="text-sm text-blue-300 font-semibold">Our Process</p>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">服务流程</h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                从租客申请到入住交接，四步流程确保快速高效完成
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
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-navy-900/40"></div>
                      <div className="absolute top-4 left-4">
                        <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                          <span className="text-2xl font-bold text-white">{step.step}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <span className="text-lg font-bold text-white">{step.step}</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white">{step.title}</h3>
                    </div>
                    <p className="text-lg text-gray-300 leading-relaxed">{step.description}</p>
                    {index < processSteps.length - 1 && (
                      <div className="mt-6 flex items-center gap-2 text-blue-400">
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
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
