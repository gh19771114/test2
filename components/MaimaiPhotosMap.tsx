'use client'

import Image from 'next/image'

export type MaimaiPhoto = {
  src: string
  alt: string
}

type Props = {
  photosTitle: string
  mapTitle: string
  images: [MaimaiPhoto, MaimaiPhoto]
  address: string
}

export default function MaimaiPhotosMap({ photosTitle, mapTitle, images, address }: Props) {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`

  return (
    <section className="bg-white py-12">
      <div className="container-custom">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-xl font-semibold text-slate-900">{photosTitle}</h2>
            <span className="text-xs text-slate-500">{mapTitle}</span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="relative h-56 overflow-hidden rounded-2xl bg-slate-900/5 sm:h-64">
                <Image src={images[0].src} alt={images[0].alt} fill className="object-cover" />
              </div>
              <div className="relative h-56 overflow-hidden rounded-2xl bg-slate-900/5 sm:h-64">
                <Image src={images[1].src} alt={images[1].alt} fill className="object-cover" />
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
              <div className="px-4 py-3 text-xs font-semibold text-slate-700 border-b border-slate-200 bg-white">
                {address}
              </div>
              <div className="relative h-64 sm:h-72 lg:h-full min-h-[280px]">
                <iframe
                  title={mapTitle}
                  src={mapSrc}
                  className="absolute inset-0 h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

