'use client'

import { useMemo } from 'react'
import { Heart, Target, Users, Award } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const Philosophy = () => {
  const { t } = useLanguage()

  const missionParagraphs = useMemo(() => {
    const raw = String(t('company.philosophy.mission.description') || '')
    return raw
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
  }, [t])

  const values = useMemo(() => [
    {
      icon: Users,
      title: t('company.philosophy.values.value1.title'),
      description: t('company.philosophy.values.value1.description'),
    },
    {
      icon: Target,
      title: t('company.philosophy.values.value2.title'),
      description: t('company.philosophy.values.value2.description'),
    },
    {
      icon: Heart,
      title: t('company.philosophy.values.value3.title'),
      description: t('company.philosophy.values.value3.description'),
    },
    {
      icon: Award,
      title: t('company.philosophy.values.value4.title'),
      description: t('company.philosophy.values.value4.description'),
      },
  ], [t])

  return (
    <section id="philosophy" className="relative section-padding scroll-mt-32">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-navy-900 drop-shadow-sm inline-block bg-white/90 px-6 py-3 rounded-lg shadow-md">
            {t('company.philosophy.ourPhilosophy.title')}
          </h2>
          <div className="max-w-4xl mx-auto bg-white/95 rounded-2xl p-8 md:p-10 shadow-xl border border-gray-100">
            <p className="text-lg md:text-xl text-slate-700 leading-relaxed mb-8 text-balance">
              {t('company.philosophy.ourPhilosophy.description')}
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value) => (
            <div
              key={value.title}
              className="text-center group bg-white rounded-2xl p-8 border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 text-navy-800 rounded-full mb-6 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <value.icon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-navy-900">{value.title}</h3>
              <p className="text-slate-800 leading-relaxed text-balance font-medium">{value.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <div className="bg-white text-navy-900 rounded-2xl p-8 md:p-12 shadow-2xl border border-blue-100 space-y-6 mx-auto max-w-4xl">
            <h3 className="text-2xl md:text-3xl font-bold text-center">
              {t('company.philosophy.mission.title')}
            </h3>
            <div className="text-left space-y-4">
              {missionParagraphs.map((p, idx) => (
                <p key={idx} className="text-lg leading-relaxed text-slate-700">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Philosophy

