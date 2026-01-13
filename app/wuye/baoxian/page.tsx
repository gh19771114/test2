'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useMemo } from 'react'
import { Shield, Clock, Sparkles } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

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

export default function BaoxianPage() {
  const { t } = useLanguage()
  const heroRef = useRef(null)
  const servicesRef = useRef(null)
  
  const isHeroInView = useInView(heroRef, { once: true })
  const isServicesInView = useInView(servicesRef, { once: true, margin: '-100px' })
  
  const services = useMemo(() => {
    const baseServices = [
      {
        title: t('wuye.baoxian.services.service1.title'),
        icon: Shield,
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: t('wuye.baoxian.services.service1.description'),
        items: (t('wuye.baoxian.services.service1.items', { returnObjects: true }) as string[]) || [],
        timeline: {
          time: t('wuye.baoxian.timeline.item1.time'),
          title: t('wuye.baoxian.timeline.item1.title'),
          description: t('wuye.baoxian.timeline.item1.description'),
        },
        color: 'from-red-500 to-red-600',
      },
      {
        title: t('wuye.baoxian.services.service2.title'),
        icon: Shield,
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: t('wuye.baoxian.services.service2.description'),
        items: (t('wuye.baoxian.services.service2.items', { returnObjects: true }) as string[]) || [],
        timeline: {
          time: t('wuye.baoxian.timeline.item4.time'),
          title: t('wuye.baoxian.timeline.item4.title'),
          description: t('wuye.baoxian.timeline.item4.description'),
        },
        color: 'from-orange-500 to-orange-600',
      },
    ]
    return baseServices
  }, [t])

  return (
    <PageLayout>
      <div className="relative">
        {/* Hero Section */}
        <section ref={heroRef} className="relative pt-28 pb-20 md:pb-24 bg-gradient-to-br from-red-800 via-red-700 to-navy-800 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt={t('wuye.baoxian.title')}
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/80 to-navy-900/60"></div>
            {/* 装饰性元素 */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-red-400/20 rounded-full blur-3xl"></div>
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
                <Shield className="w-8 h-8 text-red-300" />
              </motion.div>
              <p className="text-sm text-red-300 font-semibold drop-shadow-md">{t('wuye.baoxian.subtitle')}</p>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 drop-shadow-lg">{t('wuye.baoxian.title')}</h1>
            <p className="text-lg text-gray-200 max-w-3xl leading-relaxed drop-shadow-md">
              {t('wuye.baoxian.description')}
            </p>
          </motion.div>
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
                <Sparkles className="w-6 h-6 text-red-500" />
                <p className="text-sm text-red-400 font-semibold">{t('wuye.services.title')}</p>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('wuye.services.title')}</h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                {t('wuye.baoxian.description')}
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isServicesInView ? 'visible' : 'hidden'}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group relative bg-gray-50/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200 hover:border-red-300 transition-all duration-300 hover:shadow-2xl"
                >
                  <div className="flex flex-col">
                    <div className="relative w-full h-32 overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(min-width: 768px) 50vw, 100vw"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-60 group-hover:opacity-80 transition-opacity duration-300`}></div>
                    </div>
                    <div className="flex-1 p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                      <ul className="space-y-2 mb-4">
                        {service.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-3">
                            <div className={`mt-1 w-2 h-2 rounded-full bg-gradient-to-br ${service.color} flex-shrink-0`}></div>
                            <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                      {service.timeline && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-xs font-semibold text-gray-500">{service.timeline.time}</span>
                          </div>
                          <h4 className="text-sm font-semibold text-gray-800 mb-1">{service.timeline.title}</h4>
                          <p className="text-xs text-gray-600 leading-relaxed">{service.timeline.description}</p>
                        </div>
                      )}
                    </div>
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
