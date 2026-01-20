'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Building2, Train, Home, Shield, Clock, Users, ArrowLeft } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import MaimaiPhotosMap from '@/components/MaimaiPhotosMap'

export default function ShinNakanoPlaza304Page() {
  const { t } = useLanguage()
  const p = t('maimai.propertyDetail.properties.shin-nakano-ekijou-plaza-304', { returnObjects: true }) as any
  const labels = t('maimai.propertyDetail.labels', { returnObjects: true }) as any
  return (
    <PageLayout>
      <main className="min-h-screen bg-slate-50 text-slate-900">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-sky-100 via-slate-50 to-emerald-100 pt-28 pb-16">
          <div className="container-custom">
            <div className="mx-auto max-w-6xl">
              <Link
                href="/maimai"
                className="mb-6 inline-flex items-center gap-2 rounded-lg bg-white/80 px-4 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-white hover:text-slate-900 shadow-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('maimai.propertyDetail.backToPrevious')}
              </Link>
            </div>
            <div className="mx-auto max-w-6xl lg:flex lg:items-center lg:gap-10">
              <div className="flex-1">
                <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-sky-700">
                  {t('maimai.propertyDetail.subtitle')}
                </p>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                  {p.title}
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-slate-700" dangerouslySetInnerHTML={{ __html: p.description }} />

                <dl className="mt-6 grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
                  <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                    <dt className="text-slate-500">{labels.area}</dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      {p.area}
                      <span className="block text-[11px] text-slate-500">{t('maimai.propertyDetail.labels.approxPing', { ping: p.areaPing })}</span>
                    </dd>
                  </div>
                  <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                    <dt className="text-slate-500">{labels.type}</dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      {p.type}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                    <dt className="text-slate-500">{labels.nearestStation}</dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      {p.station}
                      <span className="block text-[11px] text-slate-500">
                        {p.stationNote}
                      </span>
                    </dd>
                  </div>
                  <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                    <dt className="text-slate-500">{labels.price}</dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      {p.price}
                      <span className="block text-[11px] text-sky-600">
                        {labels.expectedRent}{t('maimai.propertyDetail.labels.perMonth', { amount: p.expectedRent })}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>

              {/* 右侧视频 */}
              <div className="mt-8 flex-1 justify-center lg:flex">
                <div className="relative h-64 w-full max-w-sm overflow-hidden rounded-3xl bg-slate-900/5 shadow-lg">
                  <video
                    src="/movie/shinnagano.mp4"
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent" />
                  <div className="absolute bottom-3 left-4 text-xs text-slate-50 drop-shadow">
                    <p className="font-semibold">{labels.appearance}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <MaimaiPhotosMap
          photosTitle={t('maimai.propertyDetail.photos')}
          mapTitle={t('maimai.propertyDetail.mapTitle')}
          address={`${p.address || ''} ${p.buildingName || ''}`.trim()}
          images={[
            {
              src: '/imgs/maimai/shinnakanoekiue.jpeg',
              alt: labels.exterior || labels.appearance || p.title,
            },
            {
              src: '/imgs/maimai/305.png',
              alt: labels.surroundings || labels.appearance || p.title,
            },
          ]}
        />

        {/* 物业概要 */}
        <section className="mx-auto mt-6 max-w-6xl px-4 pb-14">
          <div className="grid gap-10 lg:grid-cols-[2fr,1.2fr]">
            {/* 左侧：详情 */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{t('maimai.propertyDetail.overview')}</h2>
              <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm">
                <table className="w-full border-separate border-spacing-0 text-xs">
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <th className="w-32 bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        {labels.address}
                      </th>
                      <td className="px-4 py-3">
                        {p.address}
                        <span className="ml-1 text-[11px] text-slate-500">{p.buildingName}</span>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100 align-top">
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        {labels.access}
                      </th>
                      <td className="px-4 py-3">
                        <ul className="space-y-1">
                          <li>{p.access1}</li>
                          <li>{p.access2}</li>
                          <li>{p.access3}</li>
                        </ul>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        {labels.structure}
                      </th>
                      <td className="px-4 py-3">
                        {p.structure}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        {labels.floor}
                      </th>
                      <td className="px-4 py-3">
                        {p.floorInfo}
                        <span className="ml-1 text-[11px] text-slate-500">
                          {labels.pleaseConfirm}
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        {labels.area}
                      </th>
                      <td className="px-4 py-3">
                        {p.area}（{t('maimai.propertyDetail.labels.approxPing', { ping: p.areaPing })}）
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        {labels.type}
                      </th>
                      <td className="px-4 py-3">
                        {p.type}
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        {labels.equipment}
                      </th>
                      <td className="px-4 py-3">
                        {p.equipmentInfo}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 投资亮点 */}
              <h2 className="mt-10 text-lg font-semibold text-slate-900">{t('maimai.propertyDetail.investmentPoints')}</h2>
              <div className="mt-4 grid gap-4 text-xs md:grid-cols-2">
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <Train className="h-4 w-4 text-sky-600" />
                    <h3 className="text-sm font-semibold text-slate-900">{p.point1Title}</h3>
                  </div>
                  <p className="mt-2 leading-relaxed text-slate-700">
                    {p.point1Desc}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    <h3 className="text-sm font-semibold text-slate-900">{p.point2Title}</h3>
                  </div>
                  <p className="mt-2 leading-relaxed text-slate-700">
                    {p.point2Desc}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <Home className="h-4 w-4 text-purple-600" />
                    <h3 className="text-sm font-semibold text-slate-900">{p.point3Title}</h3>
                  </div>
                  <p className="mt-2 leading-relaxed text-slate-700">
                    {p.point3Desc}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4 text-amber-600" />
                    <h3 className="text-sm font-semibold text-slate-900">{p.point4Title}</h3>
                  </div>
                  <p className="mt-2 leading-relaxed text-slate-700">
                    {p.point4Desc}
                  </p>
                </div>
              </div>

              {/* 周边设施 */}
              <h2 className="mt-10 text-lg font-semibold text-slate-900">{t('maimai.propertyDetail.surroundings')}</h2>
              <div className="mt-4 grid gap-4 text-xs md:grid-cols-3">
                <div className="rounded-xl bg-gradient-to-br from-sky-50 to-white p-4 shadow-sm">
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">{t('maimai.propertyDetail.categories.life')}</h3>
                  <ul className="space-y-1 text-slate-700">
                    <li>・{p.life1}</li>
                    <li>・{p.life2}</li>
                    <li>・{p.life3}</li>
                    <li>・{p.life4}</li>
                  </ul>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm">
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">{t('maimai.propertyDetail.categories.education')}</h3>
                  <ul className="space-y-1 text-slate-700">
                    <li>・{p.education1}</li>
                    <li>・{p.education2}</li>
                    <li>・{p.education3}</li>
                  </ul>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-purple-50 to-white p-4 shadow-sm">
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">{t('maimai.propertyDetail.categories.transport')}</h3>
                  <ul className="space-y-1 text-slate-700">
                    <li>・{p.transport1}</li>
                    <li>・{p.transport2}</li>
                    <li>・{p.transport3}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 右侧：注意事项 */}
            <aside className="space-y-6">
              <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 p-5 text-xs text-amber-900">
                <div className="mb-3 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-700" />
                  <h3 className="text-sm font-semibold">{labels.notes}</h3>
                </div>
                <p className="mt-2 leading-relaxed">
                  {p.notesText}
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section className="bg-white py-12">
          <div className="container-custom">
            <div className="mx-auto max-w-6xl flex justify-center">
              <Link
                href="/maimai"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-6 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 hover:text-slate-900 shadow-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('maimai.propertyDetail.backToPrevious')}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </PageLayout>
  )
}
