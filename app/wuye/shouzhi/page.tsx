'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import ServiceTimeline from '@/components/ServiceTimeline'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { DollarSign, FileText, Calculator, TrendingUp, CheckCircle2, Clock, BarChart3, Sparkles, ArrowRight } from 'lucide-react'

const timelineItems = [
  {
    time: '每月月底',
    title: '租金收取',
    description: '每月月底为止收取租金，租金的处理也是月底为止。如遇延迟将及时进行催缴，确保租金按时到账。',
  },
  {
    time: '每月20日',
    title: '财务报表制作',
    description: '每月20日制作完成并发送。完成当月收支统计，制作详细的财务报表，包括租金收入、各项支出明细等，并通过邮件或系统发送给业主。',
  },
  {
    time: '按决算月/12月',
    title: '税务处理',
    description: '法人和个人是分开的。法人是按照决算月，个人是12月开始做手续。根据财务报表提供税务建议，协助处理相关税务申报，确保合规运营。',
  },
]

const stats = [
  { value: '每月20日', label: '报表发送', icon: Clock },
  { value: '100%', label: '透明度', icon: CheckCircle2 },
  { value: '实时', label: '财务监控', icon: BarChart3 },
  { value: '专业', label: '税务服务', icon: Calculator },
]

const services = [
  {
    title: '每月租金收取与催缴',
    icon: DollarSign,
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: '及时收取租金，确保资金流稳定',
    items: [
      '定期租金收取',
      '延迟租金催缴',
      '租金到账确认',
      '资金流向追踪',
    ],
    color: 'from-green-500 to-green-600',
  },
  {
    title: '资产报表与税务建议',
    icon: FileText,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: '详细的财务报表和专业的税务优化建议',
    items: [
      '月度收支报表',
      '年度财务总结',
      '税务优化建议',
      '合规性检查',
    ],
    color: 'from-blue-500 to-blue-600',
  },
  {
    title: '税务申报与处理',
    icon: Calculator,
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: '专业的税务服务，确保合规运营',
    items: [
      '法人税务处理',
      '个人税务处理',
      '税务申报协助',
      '税务咨询支持',
    ],
    color: 'from-purple-500 to-purple-600',
  },
]

const processSteps = [
  {
    step: '01',
    title: '租金收取',
    description: '每月月底为止收取租金，确保资金及时到账，如遇延迟及时催缴。',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  {
    step: '02',
    title: '财务报表制作',
    description: '每月20日制作完成并发送详细的财务报表，包括收支明细和资金流向。',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  {
    step: '03',
    title: '税务处理',
    description: '根据财务报表提供税务建议，协助处理法人或个人税务申报，确保合规运营。',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
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

export default function ShouzhiPage() {
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
        <section ref={heroRef} className="relative pt-28 pb-20 md:pb-24 bg-gradient-to-br from-green-800 via-green-700 to-navy-800 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="收支与税务"
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 to-navy-900/60"></div>
            {/* 装饰性元素 */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-green-400/20 rounded-full blur-3xl"></div>
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
                <DollarSign className="w-8 h-8 text-green-300" />
              </motion.div>
              <p className="text-sm text-green-300 font-semibold drop-shadow-md">Finance & Tax</p>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 drop-shadow-lg">收支与税务管理</h1>
            <p className="text-lg text-gray-200 max-w-3xl leading-relaxed mb-8 drop-shadow-md">
              提供透明的财务管理和专业的税务服务，让您随时掌握资产运营状况，确保合规经营。
            </p>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4"
            >
              <div className="flex items-center gap-2 text-green-200">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm">每月20日发送报表</span>
              </div>
              <div className="flex items-center gap-2 text-green-200">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm">100%财务透明度</span>
              </div>
              <div className="flex items-center gap-2 text-green-200">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm">专业税务服务</span>
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
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 hover:border-green-500/50 transition-all duration-300 text-center group"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-green-300 transition-colors">
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
                <Sparkles className="w-6 h-6 text-green-500" />
                <p className="text-sm text-green-400 font-semibold">Our Services</p>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">专业服务内容</h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                全方位的财务管理和税务服务，确保资产运营透明合规
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
                  className="group relative bg-gray-50/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200 hover:border-green-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
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
                <BarChart3 className="w-6 h-6 text-green-400" />
                <p className="text-sm text-green-300 font-semibold">Our Process</p>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">服务流程</h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                从租金收取到税务处理，三步流程确保财务管理高效透明
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
                      <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 to-navy-900/40"></div>
                      <div className="absolute top-4 left-4">
                        <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                          <span className="text-2xl font-bold text-white">{step.step}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                        <span className="text-lg font-bold text-white">{step.step}</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white">{step.title}</h3>
                    </div>
                    <p className="text-lg text-gray-300 leading-relaxed">{step.description}</p>
                    {index < processSteps.length - 1 && (
                      <div className="mt-6 flex items-center gap-2 text-green-400">
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
