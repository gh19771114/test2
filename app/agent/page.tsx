'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import { FileText, Mail } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const PDF_CORPORATE = '/imgs/申込書_事業用_法人.pdf'
const PDF_INDIVIDUAL = '/imgs/申込書_事業用_個人.pdf'

export default function AgentPage() {
  const { t } = useLanguage()
  return (
    <PageLayout>
      <section className="relative pt-20 md:pt-28 pb-8 md:pb-16 bg-gradient-to-br from-blue-800 via-blue-700 to-navy-800 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt={t('agency.title')}
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-navy-900/60" />
        </div>
        <div className="relative z-10 container-custom px-4">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-6 drop-shadow-lg">
            {t('agency.title')}
          </h1>
        </div>
      </section>

      <section className="relative pt-6 md:pt-16 pb-6 md:pb-16">
        <div className="absolute inset-0 bg-white z-[5]" />
        <div className="container-custom relative z-10 px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10">
            <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
              {t('agency.description')}
            </p>
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-5 h-5 text-navy-600 flex-shrink-0" aria-hidden />
              <span className="text-sm font-medium text-gray-600">{t('agency.emailLabel')}</span>
            </div>
            <a
              href={`mailto:${t('agency.email')}`}
              className="text-lg md:text-xl font-semibold text-navy-700 hover:text-blue-600 underline underline-offset-2 break-all"
            >
              {t('agency.email')}
            </a>
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-600 mb-3">{t('agency.downloadTitle')}</p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={PDF_CORPORATE}
                  download
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-navy-600 text-white font-semibold border border-navy-700 shadow-md hover:bg-blue-600 hover:border-blue-500 transition-colors"
                >
                  <FileText className="w-5 h-5" aria-hidden />
                  {t('agency.btnCorporate')}
                </a>
                <a
                  href={PDF_INDIVIDUAL}
                  download
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-navy-600 text-white font-semibold border border-navy-700 shadow-md hover:bg-blue-600 hover:border-blue-500 transition-colors"
                >
                  <FileText className="w-5 h-5" aria-hidden />
                  {t('agency.btnIndividual')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
