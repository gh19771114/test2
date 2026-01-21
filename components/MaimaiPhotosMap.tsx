'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

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
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState<0 | 1>(0)

  const open = (idx: 0 | 1) => {
    setActiveIndex(idx)
    setIsOpen(true)
  }

  const close = () => setIsOpen(false)

  const prev = () => setActiveIndex((i) => (i === 0 ? 1 : 0))
  const next = () => setActiveIndex((i) => (i === 1 ? 0 : 1))

  useEffect(() => {
    if (!isOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

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
              <div
                className="relative h-56 overflow-hidden rounded-2xl bg-slate-900/5 sm:h-64 cursor-zoom-in"
                role="button"
                tabIndex={0}
                onClick={() => open(0)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ' ? open(0) : null)}
                aria-label={`Open photo: ${images[0].alt}`}
              >
                <Image src={images[0].src} alt={images[0].alt} fill className="object-cover" />
              </div>
              <div
                className="relative h-56 overflow-hidden rounded-2xl bg-slate-900/5 sm:h-64 cursor-zoom-in"
                role="button"
                tabIndex={0}
                onClick={() => open(1)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ' ? open(1) : null)}
                aria-label={`Open photo: ${images[1].alt}`}
              >
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

      {isOpen && (
        <div
          className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Photo preview"
          onClick={close}
        >
          <div
            className="relative w-full max-w-5xl h-[70vh] sm:h-[80vh] bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-3 right-3 z-10 rounded-full bg-black/60 text-white px-3 py-2 text-sm hover:bg-black/80"
              onClick={close}
              aria-label="Close"
            >
              ×
            </button>

            <button
              type="button"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/60 text-white px-3 py-2 text-sm hover:bg-black/80"
              onClick={prev}
              aria-label="Previous photo"
            >
              ‹
            </button>
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/60 text-white px-3 py-2 text-sm hover:bg-black/80"
              onClick={next}
              aria-label="Next photo"
            >
              ›
            </button>

            <div className="absolute inset-0">
              <Image
                src={images[activeIndex].src}
                alt={images[activeIndex].alt}
                fill
                className="object-contain"
                sizes="(min-width: 1024px) 1024px, 100vw"
                priority
              />
            </div>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {[0, 1].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i as 0 | 1)}
                  className={`h-2.5 w-2.5 rounded-full ${activeIndex === i ? 'bg-white' : 'bg-white/40'}`}
                  aria-label={`Go to photo ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

