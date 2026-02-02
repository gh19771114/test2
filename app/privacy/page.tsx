"use client";

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'

export default function PrivacyPage() {
  const { t } = useLanguage()
  return (
    <PageLayout>
      <div className="bg-gray-50">
        <section className="relative pt-28 pb-16 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt={t('privacy.imageAlt')}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-navy-900/85 via-navy-800/80 to-indigo-900/75" />
          </div>
          <div className="relative z-10 container-custom text-white">
            <p className="text-sm uppercase tracking-[0.3em] text-white/70 mb-3">{t('privacy.subtitle')}</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6">{t('privacy.title')}</h1>
            <p className="max-w-3xl text-white/80 text-lg leading-relaxed">
              {t('privacy.intro')}
            </p>
          </div>
        </section>
        <section className="section-padding">
          <div className="container-custom max-w-5xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-100 p-10 space-y-8">
            <h2 className="text-2xl font-semibold text-navy-700">{t('privacy.sectionTitle')}</h2>
            <p className="text-gray-600 leading-relaxed">
              {t('privacy.sectionIntro')}
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-navy-700 mb-3">{t('privacy.obtainTitle')}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('privacy.obtainText')}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-navy-700 mb-3">{t('privacy.useTitle')}</h3>
                <p className="text-gray-600 leading-relaxed mb-3">
                  {t('privacy.useText')}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-navy-700 mb-3">{t('privacy.disclosureTitle')}</h3>
                <p className="text-gray-600 leading-relaxed mb-3">
                  {t('privacy.disclosureIntro')}
                </p>
                <ul className="space-y-2 text-gray-600 pl-5">
                  <li>{t('privacy.disclosure1')}</li>
                  <li>{t('privacy.disclosure2')}</li>
                  <li>{t('privacy.disclosure3')}</li>
                  <li>{t('privacy.disclosure4')}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-navy-700 mb-3">{t('privacy.managementTitle')}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('privacy.managementText')}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-navy-700 mb-3">{t('privacy.rightsTitle')}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('privacy.rightsText')}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-navy-700 mb-3">{t('privacy.complianceTitle')}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('privacy.complianceText')}
                </p>
              </div>
            </div>

            <div className="text-gray-600 leading-relaxed space-y-2">
              <p>{t('privacy.date')}</p>
              <p>{t('privacy.companyName')}</p>
              <p>{t('privacy.ceoName')}</p>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
