'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { TrendingUp, Search, Briefcase, Hand, Hammer, Coins, BarChart3, Building2, Target, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react'

export default function ZengzhiPage() {
  const heroRef = useRef(null)
  const statsRef = useRef(null)
  const servicesRef = useRef(null)
  const processRef = useRef(null)
  const casesRef = useRef(null)
  
  const isHeroInView = useInView(heroRef, { once: true })
  const isStatsInView = useInView(statsRef, { once: true, margin: '-100px' })
  const isServicesInView = useInView(servicesRef, { once: true, margin: '-100px' })
  const isProcessInView = useInView(processRef, { once: true, margin: '-100px' })
  const isCasesInView = useInView(casesRef, { once: true, margin: '-100px' })

  const stats = [
    { value: '25%+', label: '平均租金提升率', icon: TrendingUp },
    { value: '500+', label: '成功案例', icon: CheckCircle2 },
    { value: '98%', label: '客户满意度', icon: Target },
    { value: '15年', label: '行业经验', icon: Building2 },
  ]

  const services = [
    {
      title: '市场调查',
      icon: Search,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: '深入分析市场趋势，为资产增值提供数据支持',
      items: [
        '周边市场租金水平分析',
        '区域房产价值评估',
        '竞争物业调研',
        '市场趋势预测',
      ],
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: '企业咨询',
      icon: Briefcase,
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: '专业团队提供全方位资产增值策略规划',
      items: [
        '资产增值策略规划',
        '投资回报率优化建议',
        '长期资产管理方案',
        '风险评估与应对',
      ],
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: '租金交涉',
      icon: Hand,
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: '基于市场数据的专业租金调整服务',
      items: [
        '市场租金分析',
        '租金调整策略',
        '租客协商',
        '合同条款优化',
      ],
      color: 'from-green-500 to-green-600',
    },
    {
      title: '大规模修缮',
      icon: Hammer,
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: '提升物业价值的大型修缮与改造工程',
      items: [
        '修缮方案设计',
        '施工管理',
        '价值提升评估',
        '成本控制优化',
      ],
      color: 'from-orange-500 to-orange-600',
    },
    {
      title: '相关附加收益',
      icon: Coins,
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: '开发多元化收益来源，最大化资产回报',
      items: [
        '自动贩卖机设置',
        '信号塔设置',
        '其他收益来源',
        '收益优化方案',
      ],
      color: 'from-amber-500 to-amber-600',
    },
  ]

  const processSteps = [
    {
      step: '01',
      title: '需求分析',
      description: '深入了解您的资产现状和增值目标，制定个性化方案',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    },
    {
      step: '02',
      title: '市场调研',
      description: '全面分析区域市场数据，识别增值机会和潜在风险',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    },
    {
      step: '03',
      title: '方案制定',
      description: '基于专业分析，制定详细的资产增值实施计划',
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    },
    {
      step: '04',
      title: '执行实施',
      description: '专业团队全程跟进，确保方案高效落地执行',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    },
    {
      step: '05',
      title: '效果评估',
      description: '定期评估增值效果，持续优化资产管理策略',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    },
  ]

  const successCases = [
    {
      title: '新宿商业大厦租金优化项目',
      location: '东京都新宿区',
      result: '租金提升 32%',
      description: '通过市场分析和专业交涉，成功将商业大厦平均租金提升32%，年收益增加约2.5亿日元',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: '租金交涉',
    },
    {
      title: '涩谷高级公寓大规模修缮',
      location: '东京都涩谷区',
      result: '资产价值提升 28%',
      description: '完成全面修缮改造，提升物业品质，资产估值提升28%，租金收益率显著改善',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: '大规模修缮',
    },
    {
      title: '池袋综合设施附加收益开发',
      location: '东京都丰岛区',
      result: '附加收益增加 45%',
      description: '通过设置自动贩卖机、信号塔等设施，成功开发多元化收益来源，年附加收益增加45%',
      image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: '附加收益',
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

  return (
    <PageLayout>
      <div className="relative">
        {/* Hero Section */}
        <section ref={heroRef} className="relative pt-28 pb-20 md:pb-24 bg-gradient-to-br from-purple-800 via-purple-700 to-navy-800 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="资产增值"
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 to-navy-900/60"></div>
            {/* 装饰性元素 */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl"></div>
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
                <TrendingUp className="w-8 h-8 text-purple-300" />
              </motion.div>
              <p className="text-sm text-purple-300 font-semibold">Asset Appreciation</p>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              资产增值服务
            </h1>
            <p className="text-lg text-gray-200 max-w-3xl leading-relaxed mb-8">
              通过租金优化、大规模修缮和附加收益开发，持续提升您的房产价值和投资回报率。专业团队，数据驱动，为您创造长期价值。
            </p>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4"
            >
              <div className="flex items-center gap-2 text-purple-200">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm">15年行业经验</span>
              </div>
              <div className="flex items-center gap-2 text-purple-200">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm">500+成功案例</span>
              </div>
              <div className="flex items-center gap-2 text-purple-200">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm">平均租金提升25%+</span>
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
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-300 text-center group"
                >
                  <div className="flex justify-center mb-4">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${stat.icon === TrendingUp ? 'from-blue-500 to-blue-600' : stat.icon === CheckCircle2 ? 'from-green-500 to-green-600' : stat.icon === Target ? 'from-purple-500 to-purple-600' : 'from-amber-500 to-amber-600'} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
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
                <Sparkles className="w-6 h-6 text-purple-500" />
                <p className="text-sm text-purple-400 font-semibold">Our Services</p>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">专业服务内容</h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                全方位资产增值解决方案，从市场分析到执行落地，全程专业支持
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
                  className="group relative bg-gray-50/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
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
                      <div className={`w-14 h-14 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
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
                <BarChart3 className="w-6 h-6 text-purple-400" />
                <p className="text-sm text-purple-300 font-semibold">Our Process</p>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">服务流程</h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                从需求分析到效果评估，五步流程确保资产增值方案高效执行
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
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-navy-900/40"></div>
                      <div className="absolute top-4 left-4">
                        <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                          <span className="text-2xl font-bold text-white">{step.step}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                        <span className="text-lg font-bold text-white">{step.step}</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white">{step.title}</h3>
                    </div>
                    <p className="text-lg text-gray-300 leading-relaxed">{step.description}</p>
                    {index < processSteps.length - 1 && (
                      <div className="mt-6 flex items-center gap-2 text-purple-400">
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

        {/* Success Cases Section */}
        <section ref={casesRef} className="section-padding">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isCasesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 mb-4">
                <Target className="w-6 h-6 text-purple-500" />
                <p className="text-sm text-purple-400 font-semibold">Success Cases</p>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">成功案例</h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                真实案例展示我们的专业能力和服务成果
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isCasesInView ? 'visible' : 'hidden'}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {successCases.map((caseItem, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group relative bg-gray-50/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={caseItem.image}
                      alt={caseItem.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 to-navy-900/60 group-hover:opacity-80 transition-opacity duration-300"></div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-purple-500/90 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
                        {caseItem.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-lg font-bold text-white mb-1">{caseItem.title}</h3>
                      <p className="text-sm text-white/90">{caseItem.location}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="text-lg font-bold text-green-600">{caseItem.result}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{caseItem.description}</p>
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
