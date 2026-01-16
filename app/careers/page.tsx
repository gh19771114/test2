'use client'

import { useState } from 'react'
import PageLayout from '@/components/PageLayout'
import { useLanguage } from '@/contexts/LanguageContext'
import { MapPin, Clock, Briefcase, X, Heart } from 'lucide-react'

export default function CareersPage() {
  const { t } = useLanguage()
  const positions = t('careers.positions', { returnObjects: true }) as any[]
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null)

  return (
    <PageLayout>
      <section className="relative section-padding">
        <div className="container-custom">
          <div className="text-center py-12 md:py-20">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('careers.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-12">
              {t('careers.subtitle')}
            </p>
          </div>

          {positions && positions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {positions.map((position, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedPosition(index)}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 cursor-pointer hover:shadow-xl hover:border-indigo-300 transition-all duration-300 group"
                >
                  <div className="mb-4">
                    <h2 className="text-xl md:text-2xl font-bold text-navy-800 mb-4 group-hover:text-indigo-600 transition-colors">
                      {position.title}
                    </h2>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-indigo-600 flex-shrink-0" />
                        <span className="line-clamp-1">{position.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-indigo-600 flex-shrink-0" />
                        <span>{position.workType}</span>
                      </div>
                      {position.salary && (
                        <div className="flex items-center gap-2">
                          <Briefcase size={16} className="text-indigo-600 flex-shrink-0" />
                          <span>{position.salary}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {position.summary && (
                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-3 mb-4">
                      {position.summary}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-indigo-600 font-semibold text-sm">
                      {t('careers.viewDetails')}
                    </span>
                    <span className="text-indigo-600 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl md:text-2xl text-gray-200">
                {t('careers.noPositions')}
              </p>
            </div>
          )}

          {/* 招聘详情弹窗 */}
          {selectedPosition !== null && positions && positions[selectedPosition] && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 overflow-y-auto"
              onClick={() => setSelectedPosition(null)}
            >
              <div
                className="bg-white rounded-2xl p-6 md:p-8 max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-y-auto my-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold text-navy-800 mb-4">
                      {positions[selectedPosition].title}
                    </h2>
                    <div className="flex flex-wrap gap-4 text-sm md:text-base text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin size={18} className="text-indigo-600" />
                        <span>{positions[selectedPosition].location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={18} className="text-indigo-600" />
                        <span>{positions[selectedPosition].workType}</span>
                      </div>
                      {positions[selectedPosition].salary && (
                        <div className="flex items-center gap-2">
                          <Briefcase size={18} className="text-indigo-600" />
                          <span>{positions[selectedPosition].salary}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPosition(null)}
                    className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="关闭"
                  >
                    <X size={24} className="text-gray-500" />
                  </button>
                </div>

                {positions[selectedPosition].description && (
                  <div className="mb-6">
                    <h3 className="text-lg md:text-xl font-semibold text-navy-700 mb-3">
                      {t('careers.jobDescription')}
                    </h3>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {positions[selectedPosition].description}
                    </div>
                  </div>
                )}

                {positions[selectedPosition].responsibilities && positions[selectedPosition].responsibilities.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg md:text-xl font-semibold text-navy-700 mb-3">
                      {t('careers.responsibilities')}
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      {positions[selectedPosition].responsibilities.map((resp: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-indigo-600 mt-1">•</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {positions[selectedPosition].requirements && positions[selectedPosition].requirements.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg md:text-xl font-semibold text-navy-700 mb-3">
                      {t('careers.requirements')}
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      {positions[selectedPosition].requirements.map((req: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-indigo-600 mt-1">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {positions[selectedPosition].benefits && positions[selectedPosition].benefits.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg md:text-xl font-semibold text-navy-700 mb-3 flex items-center gap-2">
                      <Heart size={20} className="text-red-500" />
                      {t('careers.benefits')}
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      {positions[selectedPosition].benefits.map((benefit: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-indigo-600 mt-1">•</span>
                          <span className="leading-relaxed">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {positions[selectedPosition].contact && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-gray-700 mb-2">
                      <strong>{t('careers.howToApply')}:</strong>
                    </p>
                    <p className="text-gray-600">{positions[selectedPosition].contact}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  )
}


