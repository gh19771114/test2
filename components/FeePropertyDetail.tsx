'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Building2, Clock, Train } from 'lucide-react'
import PageLayout from '@/components/PageLayout'
import MaimaiPhotosMap from '@/components/MaimaiPhotosMap'
import { useLanguage } from '@/contexts/LanguageContext'

type Detail = {
  title: string
  description: string
  address: string
  price: string
  priceLabel: string
  taxIncluded: string
  area: string
  areaNote: string
  type: string
  status: string
  station: string
  stationNote: string
  floorPlanLabel: string
  locationMapLabel: string
  overviewRows: [string, string][]
  highlightsTitle: string
  highlights: { title: string; description: string }[]
  notes: string[]
}

export default function FeePropertyDetail({ propertyId, imagePrefix, mapImage }: {
  propertyId: string
  imagePrefix: string
  mapImage?: string
}) {
  const { t } = useLanguage()
  const p = t(`maimai.propertyDetail.properties.${propertyId}`, { returnObjects: true }) as Detail
  const labels = t('maimai.propertyDetail.labels', { returnObjects: true }) as Record<string, string>
  const exterior = `/imgs/maimai/${imagePrefix}-exterior.jpg`
  const backLink = (
    <Link href="/maimai" className="inline-flex items-center gap-2 rounded-lg bg-white/80 px-4 py-2 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-white hover:text-slate-900">
      <ArrowLeft className="h-4 w-4" />{t('maimai.propertyDetail.backToPrevious')}
    </Link>
  )

  return (
    <PageLayout>
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <section className="relative overflow-hidden bg-gradient-to-br from-sky-100 via-slate-50 to-emerald-100 pt-28 pb-16">
          <div className="container-custom">
            <div className="mx-auto mb-6 max-w-6xl">{backLink}</div>
            <div className="mx-auto max-w-6xl lg:flex lg:items-center lg:gap-10">
              <div className="min-w-0 flex-1">
                <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-sky-700">{t('maimai.propertyDetail.subtitle')}</p>
                <span className="mb-4 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">{t('maimai.properties.withFee')}</span>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">{p.title}</h1>
                <p className="mt-4 text-sm leading-relaxed text-slate-700">{p.description}</p>
                <dl className="mt-6 grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
                  {[
                    [labels.area, p.area, p.areaNote],
                    [labels.type, p.type, p.status],
                    [labels.nearestStation, p.station, p.stationNote],
                    [p.priceLabel, p.price, p.taxIncluded],
                  ].map(([label, value, note]) => (
                    <div key={label} className="rounded-xl bg-white/80 p-4 shadow-sm">
                      <dt className="text-slate-500">{label}</dt>
                      <dd className="mt-1 font-semibold">{value}<span className="mt-1 block text-[11px] font-normal text-slate-500">{note}</span></dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="mt-8 flex justify-center lg:mt-0 lg:w-80 lg:shrink-0">
                <div className="relative h-80 w-full max-w-sm overflow-hidden rounded-3xl bg-slate-900/5 shadow-lg">
                  <Image src={exterior} alt={`${p.title} ${labels.exterior}`} fill className="object-cover" sizes="(min-width: 1024px) 320px, 384px" priority />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent" />
                  <p className="absolute bottom-3 left-4 text-xs font-semibold text-white">{labels.appearance}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <MaimaiPhotosMap
          photosTitle={t('maimai.propertyDetail.photos')}
          mapTitle={t('maimai.propertyDetail.mapTitle')}
          address={p.address}
          images={[
            { src: exterior, alt: `${p.title} ${labels.exterior}`, fit: 'contain' },
            { src: `/imgs/maimai/${imagePrefix}-floorplan.png`, alt: `${p.title} ${p.floorPlanLabel}`, fit: 'contain' },
            { src: mapImage ?? `/imgs/maimai/${imagePrefix}-map.jpg`, alt: p.locationMapLabel, fit: 'contain' },
          ]}
        />

        <section className="mx-auto mt-6 max-w-6xl px-4 pb-14">
          <div className="grid gap-10 lg:grid-cols-[2fr,1.2fr]">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold">{t('maimai.propertyDetail.overview')}</h2>
              <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm">
                <table className="w-full border-separate border-spacing-0 text-xs">
                  <tbody>{p.overviewRows.map(([label, value]) => (
                    <tr key={label} className="align-top">
                      <th scope="row" className="w-28 border-b border-slate-100 bg-slate-50 px-4 py-3 text-left font-medium text-slate-500 sm:w-36">{label}</th>
                      <td className="whitespace-pre-line border-b border-slate-100 px-4 py-3 leading-relaxed">{value}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              <h2 className="mt-8 text-lg font-semibold">{p.highlightsTitle}</h2>
              <div className="mt-4 grid gap-4 text-xs md:grid-cols-2">
                {p.highlights.map((point, index) => {
                  const Icon = index === 0 ? Train : Building2
                  return <div key={point.title} className="rounded-2xl bg-white p-4 shadow-sm">
                    <div className="mb-2 flex items-center gap-2"><Icon className="h-4 w-4 shrink-0 text-sky-600" /><h3 className="text-sm font-semibold">{point.title}</h3></div>
                    <p className="mt-2 leading-relaxed text-slate-700">{point.description}</p>
                  </div>
                })}
              </div>
            </div>
            <aside>
              <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 p-5 text-xs text-amber-900">
                <div className="mb-3 flex items-center gap-2"><Clock className="h-5 w-5 text-amber-700" /><h2 className="text-sm font-semibold">{t('maimai.propertyDetail.notes')}</h2></div>
                <ul className="list-disc space-y-3 pl-4 leading-relaxed">{p.notes.map(note => <li key={note}>{note}</li>)}</ul>
              </div>
            </aside>
          </div>
        </section>
        <section className="bg-white py-12"><div className="flex justify-center">{backLink}</div></section>
      </main>
    </PageLayout>
  )
}
