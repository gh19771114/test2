'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Train, Shield, Clock, TrendingUp, ArrowLeft } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function MiwaPlazaTakaido1FPortfolioPage() {
  const { t } = useLanguage()
  const p = t('maimai.propertyDetail.properties.miwa-plaza-takaido-101', { returnObjects: true }) as any
  const labels = t('maimai.propertyDetail.labels', { returnObjects: true }) as any
  const categories = t('maimai.propertyDetail.categories', { returnObjects: true }) as any
  
  return (
    <PageLayout>
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <section className="relative overflow-hidden bg-gradient-to-br from-sky-100 via-slate-50 to-rose-100 pt-28 pb-16">
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
                <p className="mt-4 text-sm leading-relaxed text-slate-700">
                  {p.description}
                </p>

                <dl className="mt-6 grid grid-cols-1 gap-4 text-xs sm:grid-cols-3">
                  <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                    <dt className="text-slate-500">{labels.type}</dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      {p.type}
                      <span className="block text-[11px] text-slate-500">
                        {p.typeNote}
                      </span>
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
                    <dt className="text-slate-500">{labels.structure}</dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      {p.structure}
                      <span className="block text-[11px] text-slate-500">
                        {p.structureNote}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-8 flex-1 justify-center lg:flex">
                <div className="relative h-64 w-full max-w-sm overflow-hidden rounded-3xl bg-slate-900/5 shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt={p.imageAlt || p.title || labels.appearance}
                    fill
                    className="object-cover"
                    priority
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

        <section className="bg-white py-12">
          <div className="container-custom">
            <div className="mx-auto max-w-6xl">
              <h2 className="mb-6 text-xl font-semibold text-slate-900">{t('maimai.propertyDetail.photos')}</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="relative h-64 overflow-hidden rounded-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt={labels.exterior || labels.appearance || p.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-64 overflow-hidden rounded-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1560449752-91594c95c0ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt={labels.surroundings}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-64 overflow-hidden rounded-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt={labels.interior}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-6 max-w-6xl px-4 pb-14 text-xs">
          <div className="grid gap-10 lg:grid-cols-[2fr,1.2fr]">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{t('maimai.propertyDetail.overview')}</h2>
              <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm">
                <table className="w-full border-separate border-spacing-0">
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <th className="w-32 bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        {labels.address}
                      </th>
                      <td className="px-4 py-3">
                        {p.address} {p.buildingName}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100 align-top">
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        {labels.transport}
                      </th>
                      <td className="px-4 py-3">
                        <ul className="space-y-1">
                          <li>{p.access1}</li>
                          <li>{p.access2}</li>
                        </ul>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        {labels.structure}
                      </th>
                      <td className="px-4 py-3">
                        {p.structure}／{p.structureNote}
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

              <h2 className="mt-8 text-lg font-semibold text-slate-900">
                {t('maimai.propertyDetail.investmentPortfolio')}
              </h2>
              <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm">
                <table className="w-full border-separate border-spacing-0">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] text-slate-500">
                      <th className="px-4 py-2 text-left">{t('maimai.propertyDetail.tableHeaders.roomNumber')}</th>
                      <th className="px-4 py-2 text-left">{t('maimai.propertyDetail.tableHeaders.floor')}</th>
                      <th className="px-4 py-2 text-left">{labels.type}</th>
                      <th className="px-4 py-2 text-left">{labels.area}</th>
                      <th className="px-4 py-2 text-left">{t('maimai.propertyDetail.tableHeaders.expectedRent')}</th>
                      <th className="px-4 py-2 text-left">{t('maimai.propertyDetail.tableHeaders.notes')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-slate-100">
                      <td className="px-4 py-2 font-semibold text-slate-900">101</td>
                      <td className="px-4 py-2">{t('maimai.propertyDetail.floor1')}</td>
                      <td className="px-4 py-2">1K</td>
                      <td className="px-4 py-2">
                        {p.room101Area}
                        <span className="ml-1 text-[11px] text-amber-600">
                          {p.room101AreaNote}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {p.room101Rent}
                        <span className="ml-1 text-[11px] text-amber-600">
                          {p.room101RentNote}
                        </span>
                      </td>
                      <td className="px-4 py-2">{p.room101Note}</td>
                    </tr>
                    <tr className="border-t border-slate-100">
                      <td className="px-4 py-2 font-semibold text-slate-900">104</td>
                      <td className="px-4 py-2">{t('maimai.propertyDetail.floor1')}</td>
                      <td className="px-4 py-2">1K</td>
                      <td className="px-4 py-2">
                        {p.room104Area}
                        <span className="ml-1 text-[11px] text-amber-600">
                          {p.room104AreaNote}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {p.room104Rent}
                        <span className="ml-1 text-[11px] text-amber-600">
                          {p.room104RentNote}
                        </span>
                      </td>
                      <td className="px-4 py-2">{p.room104Note}</td>
                    </tr>
                    <tr className="border-t border-slate-100">
                      <td className="px-4 py-2 font-semibold text-slate-900">106</td>
                      <td className="px-4 py-2">{t('maimai.propertyDetail.floor1')}</td>
                      <td className="px-4 py-2">1K</td>
                      <td className="px-4 py-2">
                        {p.room106Area}
                        <span className="ml-1 text-[11px] text-amber-600">
                          {p.room106AreaNote}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {p.room106Rent}
                        <span className="ml-1 text-[11px] text-amber-600">
                          {p.room106RentNote}
                        </span>
                      </td>
                      <td className="px-4 py-2">{p.room106Note}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="mt-8 text-lg font-semibold text-slate-900">{t('maimai.propertyDetail.investmentPoints')}</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-white p-4 text-xs shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-sky-600" />
                    <h3 className="text-sm font-semibold text-slate-900">{p.point1Title}</h3>
                  </div>
                  <p className="mt-2 leading-relaxed text-slate-700">
                    {p.point1Desc}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 text-xs shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <Train className="h-4 w-4 text-rose-600" />
                    <h3 className="text-sm font-semibold text-slate-900">{p.point2Title}</h3>
                  </div>
                  <p className="mt-2 leading-relaxed text-slate-700">
                    {p.point2Desc}
                  </p>
                </div>
              </div>

              <h2 className="mt-10 text-lg font-semibold text-slate-900">{t('maimai.propertyDetail.surroundings')}</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="rounded-xl bg-gradient-to-br from-sky-50 to-white p-4 shadow-sm">
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">{categories.life}</h3>
                  <ul className="space-y-1 text-slate-700">
                    <li>・{p.life1}</li>
                    <li>・{p.life2}</li>
                    <li>・{p.life3}</li>
                    <li>・{p.life4}</li>
                  </ul>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-rose-50 to-white p-4 shadow-sm">
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">{categories.education}</h3>
                  <ul className="space-y-1 text-slate-700">
                    <li>・{p.education1}</li>
                    <li>・{p.education2}</li>
                    <li>・{p.education3}</li>
                  </ul>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-purple-50 to-white p-4 shadow-sm">
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">{categories.transport}</h3>
                  <ul className="space-y-1 text-slate-700">
                    <li>・{p.transport1}</li>
                    <li>・{p.transport2}</li>
                    <li>・{p.transport3}</li>
                  </ul>
                </div>
              </div>
            </div>

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
