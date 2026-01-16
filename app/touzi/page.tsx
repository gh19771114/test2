'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import { TrendingUp, Building2, Briefcase } from 'lucide-react'
import { investmentProperties } from './propertyData'
import { useLanguage } from '@/contexts/LanguageContext'

export default function TouZiPage() {
  const { t } = useLanguage()
  return (
    <PageLayout>
      <section className="relative pt-28 pb-16 bg-gradient-to-br from-purple-800 via-purple-700 to-navy-800 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt={t('touzi.title')}
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 to-navy-900/60"></div>
        </div>
        <div className="relative z-10 container-custom">
          <p className="text-sm text-purple-300 font-semibold mb-4 drop-shadow-md">{t('touzi.subtitle')}</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 drop-shadow-lg">{t('touzi.title')}</h1>
          <p className="text-lg text-gray-200 max-w-3xl leading-relaxed drop-shadow-md">
            {t('touzi.description')}
          </p>
        </div>
      </section>

        {/* 不动产投资 */}
        <section className="section-padding">
          
          <div className="relative">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-navy-700" />
                </div>
                <h2 className="text-3xl font-bold text-white">{t('touzi.realEstateInvestment.title')}</h2>
              </div>
              <p className="text-lg text-gray-200 mb-8 leading-relaxed">
                {t('touzi.realEstateInvestment.description')}
              </p>

              <div className="rounded-3xl p-8 md:p-12 border border-blue-100 shadow-lg">
                <div className="overflow-x-auto">
                  <div className="flex gap-6 pb-4" style={{ minWidth: 'max-content' }}>
                  {investmentProperties.map((item, index) => (
                    <div
                      key={index}
                        className="group relative rounded-2xl bg-white/80 backdrop-blur-sm shadow-md border border-blue-100 hover:border-blue-300 transition-all duration-300 overflow-hidden flex-shrink-0"
                        style={{ width: '300px' }}
                    >
                      <div className="relative h-56 bg-gray-100 flex items-center justify-center">
                        {item.image ? (
                          <Image
                            src={item.image}
                              alt={t(item.titleKey)}
                            fill
                              className={item.image.includes('helte') ? "object-contain transition-transform duration-300 group-hover:scale-105 p-4" : "object-cover transition-transform duration-300 group-hover:scale-105"}
                              sizes="300px"
                          />
                        ) : (
                          <div className="text-gray-400 text-sm">No Photo</div>
                        )}
                      </div>
                      <div className="p-5">
                          <h4 className="text-lg font-semibold text-navy-900 mb-2">{t(item.titleKey)}</h4>
                          <p className="text-sm text-gray-600">{t(item.locationKey)}</p>
                        </div>
                      </div>
                    ))}
                    </div>
                </div>
              </div>
            </div></div>
          </div>
        </section>
    </PageLayout>
  )
}

