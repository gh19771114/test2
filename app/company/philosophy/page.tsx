'use client'

import PageLayout from '@/components/PageLayout'
import Philosophy from '@/components/Philosophy'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'

export default function CompanyPhilosophyPage() {
  const { t } = useLanguage()
  return (
    <PageLayout>
        <div className="relative">
        <section className="relative pt-28 pb-16 bg-gradient-to-br from-indigo-800 via-indigo-700 to-navy-800 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt={t('company.philosophy.title')}
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 to-navy-900/60"></div>
          </div>
          <div className="relative z-10 container-custom space-y-4">
            <p className="text-sm text-indigo-100 font-semibold drop-shadow-md">{t('company.philosophy.subtitle')}</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">{t('company.philosophy.title')}</h1>
            <p className="text-lg text-gray-50 max-w-4xl leading-relaxed text-balance drop-shadow-md">
              {t('company.philosophy.description')}
            </p>
          </div>
        </section>

        <Philosophy />
        </div>
    </PageLayout>
  )
}

