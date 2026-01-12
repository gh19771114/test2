'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import Link from 'next/link'
import { ClipboardCheck, DollarSign, Wrench, Shield, TrendingUp, Users, Calendar, MapPin, Search, Briefcase, Hand, Hammer, Coins, Building2 } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useMemo } from 'react'

export default function WuYePage() {
  const { t } = useLanguage()

  const regularServices = useMemo(() => [
    {
      title: t('wuye.services.regular.zulin'),
      link: '/wuye/zulin',
      icon: ClipboardCheck,
    },
    {
      title: t('wuye.services.regular.shouzhi'),
      link: '/wuye/shouzhi',
      icon: DollarSign,
    },
    {
      title: t('wuye.services.regular.xiushan'),
      link: '/wuye/xiushan',
      icon: Wrench,
    },
    {
      title: t('wuye.services.regular.ruzhu'),
      link: '/wuye/ruzhu',
      icon: Users,
    },
    {
      title: t('wuye.services.regular.baoxian'),
      link: '/wuye/baoxian',
      icon: Shield,
    },
  ], [t])

  const assetAppreciationServices = useMemo(() => [
    {
      title: t('wuye.services.appreciation.marketResearch'),
      link: '/wuye/zengzhi',
      icon: Search,
    },
    {
      title: t('wuye.services.appreciation.consulting'),
      link: '/wuye/zengzhi',
      icon: Briefcase,
    },
    {
      title: t('wuye.services.appreciation.rentNegotiation'),
      link: '/wuye/zengzhi',
      icon: Hand,
    },
    {
      title: t('wuye.services.appreciation.majorRepair'),
      link: '/wuye/zengzhi',
      icon: Hammer,
    },
    {
      title: t('wuye.services.appreciation.additionalIncome'),
      link: '/wuye/zengzhi',
      icon: Coins,
    },
  ], [t])

  const managedProperties = useMemo(() => [
    {
      id: 'shibuya-luxury-apartment',
      date: '2024/03/15',
      type: t('wuye.properties.type'),
      title: t('wuye.properties.property1.title'),
      location: t('wuye.properties.property1.location'),
      category: t('wuye.properties.property1.category'),
      image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      description: t('wuye.properties.property1.description'),
    },
    {
      id: 'yokohama-waterfront-complex',
      date: '2024/06/20',
      type: t('wuye.properties.type'),
      title: t('wuye.properties.property2.title'),
      location: t('wuye.properties.property2.location'),
      category: t('wuye.properties.property2.category'),
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      description: t('wuye.properties.property2.description'),
    },
    {
      id: 'nagoya-student-apartment',
      date: '2024/09/10',
      type: t('wuye.properties.type'),
      title: t('wuye.properties.property3.title'),
      location: t('wuye.properties.property3.location'),
      category: t('wuye.properties.property3.category'),
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      description: t('wuye.properties.property3.description'),
    },
  ], [t])
  return (
    <PageLayout>
      <div className="relative">
          {/* Hero Section with Background Image */}
          <section className="relative pt-28 pb-16 bg-gradient-to-br from-blue-800 via-blue-700 to-navy-800 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt={t('wuye.title')}
              fill
              className="object-cover opacity-30"
              priority
            />
          </div>
          <div className="relative z-10 container-custom">
            <p className="text-sm text-blue-300 font-semibold mb-4">{t('wuye.subtitle')}</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">{t('wuye.title')}</h1>
            <p className="text-lg text-gray-200 max-w-3xl leading-relaxed">
              {t('wuye.description')}
            </p>
          </div>
        </section>

      <section id="tenant-services" className="section-padding">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-white mb-8">{t('wuye.services.title')}</h2>
          
          {/* 左右两个大方块 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 常规服务 - 左侧大方块 */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 md:p-10 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl md:text-3xl font-bold text-navy-700 mb-8 text-center">{t('wuye.services.regularTitle')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {regularServices.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link key={item.title} href={item.link} className="block">
                      <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Icon className="w-6 h-6 text-blue-600" />
                          </div>
                          <h4 className="text-base font-semibold text-navy-700">{item.title}</h4>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* 专业资产增值服务 - 右侧大方块 */}
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-3xl p-8 md:p-10 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl md:text-3xl font-bold text-navy-700 mb-8 text-center">{t('wuye.services.appreciationTitle')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assetAppreciationServices.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link key={item.title} href={item.link} className="block">
                      <div className="bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Icon className="w-6 h-6 text-purple-600" />
                          </div>
                          <h4 className="text-base font-semibold text-navy-700">{item.title}</h4>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-white mb-6">{t('wuye.properties.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {managedProperties.map((property) => (
              <div key={property.id} className="group bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg transition-all duration-300 wuye-property-card">
                <div className="relative overflow-hidden">
                  <div className="relative w-full wuye-property-image">
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    />
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-navy-700 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {property.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {property.type}
                    </span>
                  </div>
                </div>

                <div className="wuye-property-content">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Calendar size={16} />
                    <span>{property.date}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-navy-700 mb-2 wuye-property-title">
                    {property.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <MapPin size={16} />
                    <span>{property.location}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 wuye-property-description">
                    {property.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 统计信息 */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border-2 border-blue-200 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-navy-900 mb-1">
                    <span>1,300</span><span className="ml-2">{t('wuye.stats.units')}</span>
                  </h3>
                  <p className="text-base md:text-lg text-gray-700 font-medium">{t('wuye.stats.totalProperties')}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 border-2 border-green-200 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-3xl font-bold">¥</span>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-navy-900 mb-1">
                    <span>{t('wuye.stats.amountValue')}</span><span className="ml-2">{t('wuye.stats.yen')}</span>
                  </h3>
                  <p className="text-base md:text-lg text-gray-700 font-medium">{t('wuye.stats.totalAssets')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-bold text-white mb-4">{t('wuye.cta.title')}</h2>
          <p className="text-gray-200 max-w-2xl mx-auto mb-6 leading-relaxed">
            {t('wuye.cta.description')}
          </p>
          <a href="/#contact" className="btn-primary inline-flex items-center gap-2">
            {t('wuye.cta.button')}
          </a>
        </div>
      </section>
      </div>
    </PageLayout>
  )
}

