'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import Link from 'next/link'
import { Phone, CreditCard, FileText, Shield, Wrench } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function TenantPage() {
  const { t } = useLanguage()
  return (
    <PageLayout>
      <section className="relative pt-20 md:pt-28 pb-8 md:pb-16 bg-gradient-to-br from-blue-800 via-blue-700 to-navy-800 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt={t('tenant.title')}
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-navy-900/60"></div>
        </div>
        <div className="relative z-10 container-custom px-4">
          <p className="text-sm text-blue-300 font-semibold mb-2 md:mb-4 drop-shadow-md">{t('tenant.subtitle')}</p>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-6 drop-shadow-lg">{t('tenant.title')}</h1>
          <p className="text-base md:text-lg text-gray-200 max-w-3xl leading-relaxed drop-shadow-md">
            {t('tenant.description')}
          </p>
        </div>
      </section>
        
        <section className="relative pt-6 md:pt-16 pb-6 md:pb-16">
          <div className="absolute inset-0 bg-white z-[5]"></div>
          
          <div className="container-custom relative z-10 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-4 md:p-12">
              <div className="space-y-3 md:space-y-6">
                <div className="border-l-4 border-blue-500 pl-3 md:pl-6 flex items-start gap-2 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 md:w-6 md:h-6 text-navy-700" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-navy-900 mb-1 md:mb-2">{t('tenant.services.emergency.title')}</h2>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">{t('tenant.services.emergency.description')}</p>
              </div>
            </div>
            
            <div className="border-l-4 border-green-500 pl-3 md:pl-6 flex items-start gap-2 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-navy-900 mb-1 md:mb-2">{t('tenant.services.payment.title')}</h2>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">{t('tenant.services.payment.description')}</p>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed mt-1 md:mt-2">{t('tenant.services.payment.phone')}</p>
              </div>
            </div>
            
            <div className="border-l-4 border-yellow-500 pl-3 md:pl-6 flex items-start gap-2 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-navy-900 mb-1 md:mb-2">{t('tenant.services.renewal.title')}</h2>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">{t('tenant.services.renewal.description')}</p>
              </div>
            </div>

            <div className="border-l-4 border-purple-500 pl-3 md:pl-6 flex items-start gap-2 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Wrench className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-navy-900 mb-1 md:mb-2">{t('tenant.services.maintenance.title')}</h2>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">{t('tenant.services.maintenance.description')}</p>
              </div>
            </div>

            <div className="border-l-4 border-navy-500 pl-3 md:pl-6 flex items-start gap-2 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-navy-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 md:w-6 md:h-6 text-navy-900" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-navy-900 mb-1 md:mb-2">{t('tenant.services.termination.title')}</h2>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">{t('tenant.services.termination.description')}</p>
                <Link
                  href="/tenant/kaiyaku"
                  className="inline-flex items-center gap-2 mt-2 md:mt-3 font-semibold text-base md:text-lg rounded-lg px-5 py-3 bg-navy-600 text-white border border-navy-700 shadow-md hover:bg-blue-600 hover:border-blue-500 hover:shadow-lg active:bg-blue-700 transition-all duration-200"
                >
                  {t('tenant.services.termination.link')}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
              </div>
            </div>
          </div>
        </section>
    </PageLayout>
  )
}

