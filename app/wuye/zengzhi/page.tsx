'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useMemo } from 'react'
import { TrendingUp, Search, Briefcase, Hand, Hammer, Coins, BarChart3, Building2, Target, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ZengzhiPage() {
  const { t } = useLanguage()
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

  // 从多语言文件读取数据
  const stats = useMemo(() => [
    { value: t('wuye.zengzhi.stats.rentIncrease.value'), label: t('wuye.zengzhi.stats.rentIncrease.label'), icon: TrendingUp },
    { value: t('wuye.zengzhi.stats.successCases.value'), label: t('wuye.zengzhi.stats.successCases.label'), icon: CheckCircle2 },
    { value: t('wuye.zengzhi.stats.satisfaction.value'), label: t('wuye.zengzhi.stats.satisfaction.label'), icon: Target },
    { value: t('wuye.zengzhi.stats.experience.value'), label: t('wuye.zengzhi.stats.experience.label'), icon: Building2 },
  ], [t])

  const services = useMemo(() => [
    {
      title: t('wuye.zengzhi.services.service1.title'),
      icon: Search,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: t('wuye.zengzhi.services.service1.description'),
      items: (t('wuye.zengzhi.services.service1.items', { returnObjects: true }) as string[]) || [],
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: t('wuye.zengzhi.services.service2.title'),
      icon: Hand,
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: t('wuye.zengzhi.services.service2.description'),
      items: (t('wuye.zengzhi.services.service2.items', { returnObjects: true }) as string[]) || [],
      color: 'from-green-500 to-green-600',
    },
    {
      title: t('wuye.zengzhi.services.service3.title'),
      icon: Hammer,
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: t('wuye.zengzhi.services.service3.description'),
      items: (t('wuye.zengzhi.services.service3.items', { returnObjects: true }) as string[]) || [],
      color: 'from-orange-500 to-orange-600',
    },
    {
      title: t('wuye.zengzhi.services.service4.title'),
      icon: Coins,
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: t('wuye.zengzhi.services.service4.description'),
      items: (t('wuye.zengzhi.services.service4.items', { returnObjects: true }) as string[]) || [],
      color: 'from-amber-500 to-amber-600',
    },
  ], [t])

  const processSteps = useMemo(() => [
    {
      step: '01',
      title: t('wuye.zengzhi.process.step1.title'),
      description: t('wuye.zengzhi.process.step1.description'),
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    },
    {
      step: '02',
      title: t('wuye.zengzhi.process.step2.title'),
      description: t('wuye.zengzhi.process.step2.description'),
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    },
    {
      step: '03',
      title: t('wuye.zengzhi.process.step3.title'),
      description: t('wuye.zengzhi.process.step3.description'),
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    },
    {
      step: '04',
      title: t('wuye.zengzhi.process.step4.title'),
      description: t('wuye.zengzhi.process.step4.description'),
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    },
    {
      step: '05',
      title: t('wuye.zengzhi.process.step5.title'),
      description: t('wuye.zengzhi.process.step5.description'),
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    },
  ], [t])

  const successCases = useMemo(() => [
    {
      title: t('wuye.zengzhi.cases.case1.title'),
      location: t('wuye.zengzhi.cases.case1.location'),
      result: t('wuye.zengzhi.cases.case1.result'),
      description: t('wuye.zengzhi.cases.case1.description'),
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: t('wuye.zengzhi.cases.case1.category'),
    },
    {
      title: t('wuye.zengzhi.cases.case2.title'),
      location: t('wuye.zengzhi.cases.case2.location'),
      result: t('wuye.zengzhi.cases.case2.result'),
      description: t('wuye.zengzhi.cases.case2.description'),
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: t('wuye.zengzhi.cases.case2.category'),
    },
    {
      title: t('wuye.zengzhi.cases.case3.title'),
      location: t('wuye.zengzhi.cases.case3.location'),
      result: t('wuye.zengzhi.cases.case3.result'),
      description: t('wuye.zengzhi.cases.case3.description'),
      image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: t('wuye.zengzhi.cases.case3.category'),
    },
  ], [t])

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
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('wuye.services.title')}</h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                {t('wuye.zengzhi.description')}
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isServicesInView ? 'visible' : 'hidden'}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
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
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white mb-1">{service.title}</h3>
                      <p className="text-base text-white/90">{service.description}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-3">
                      {service.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-3">
                          <div className={`mt-1.5 w-2.5 h-2.5 rounded-full bg-gradient-to-br ${service.color} flex-shrink-0`}></div>
                          <span className="text-base text-gray-700 leading-relaxed">{item}</span>
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
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('wuye.zengzhi.cases.title')}</h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                {t('wuye.zengzhi.cases.subtitle')}
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
