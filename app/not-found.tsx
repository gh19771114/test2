'use client'

import Link from 'next/link'
import PageLayout from '@/components/PageLayout'
import { useLanguage } from '@/contexts/LanguageContext'

export default function NotFound() {
  const { t } = useLanguage()
  
  return (
    <PageLayout>
      <div className="container-custom py-20 text-center">
        <h1 className="text-3xl font-bold text-navy-900 mb-4">{t('notFound.title')}</h1>
        <p className="text-gray-700 mb-6">{t('notFound.description')}</p>
        <Link href="/" className="btn-primary inline-flex items-center gap-2">
          {t('notFound.backToHome')}
        </Link>
      </div>
    </PageLayout>
  )
}







