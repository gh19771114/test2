'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import ServiceTimeline from '@/components/ServiceTimeline'
import { Shield } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useMemo } from 'react'

// 这些数据将在组件内从多语言文件读取
// 这些数据将在组件内从多语言文件读取

export default function BaoxianPage() {
  const { t } = useLanguage()
  
  const timelineItems = useMemo(() => [
  {
      time: t('wuye.baoxian.timeline.item1.time'),
      title: t('wuye.baoxian.timeline.item1.title'),
      description: t('wuye.baoxian.timeline.item1.description'),
  },
  {
      time: t('wuye.baoxian.timeline.item2.time'),
      title: t('wuye.baoxian.timeline.item2.title'),
      description: t('wuye.baoxian.timeline.item2.description'),
  },
  {
      time: t('wuye.baoxian.timeline.item3.time'),
      title: t('wuye.baoxian.timeline.item3.title'),
      description: t('wuye.baoxian.timeline.item3.description'),
  },
  {
      time: t('wuye.baoxian.timeline.item4.time'),
      title: t('wuye.baoxian.timeline.item4.title'),
      description: t('wuye.baoxian.timeline.item4.description'),
  },
  {
      time: t('wuye.baoxian.timeline.item5.time'),
      title: t('wuye.baoxian.timeline.item5.title'),
      description: t('wuye.baoxian.timeline.item5.description'),
    },
  ], [t])
  return (
    <PageLayout>
      <div className="relative">
        <section className="relative pt-28 pb-16 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt={t('wuye.baoxian.title')}
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/80 to-navy-900/60"></div>
          </div>
          <div className="relative z-10 container-custom">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-red-300" />
              <p className="text-sm text-red-300 font-semibold drop-shadow-md">{t('wuye.baoxian.subtitle')}</p>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 drop-shadow-lg">{t('wuye.baoxian.title')}</h1>
            <p className="text-lg text-gray-200 max-w-3xl leading-relaxed drop-shadow-md">
              {t('wuye.baoxian.description')}
            </p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">{t('wuye.services.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-navy-700 mb-3">{t('wuye.baoxian.services.service1.title')}</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  {(t('wuye.baoxian.services.service1.items', { returnObjects: true }) as string[]).map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                      <span>{item}</span>
                  </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-navy-700 mb-3">{t('wuye.baoxian.services.service2.title')}</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  {(t('wuye.baoxian.services.service2.items', { returnObjects: true }) as string[]).map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                      <span>{item}</span>
                  </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom max-w-4xl mx-auto">
            <ServiceTimeline items={timelineItems} />
          </div>
        </section>
      </div>
    </PageLayout>
  )
}

