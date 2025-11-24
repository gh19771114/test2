'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import Link from 'next/link'
import { investmentProperties } from '../propertyData'

export default function TouziCasesPage() {
  return (
    <PageLayout>
      <div className="bg-gray-50 min-h-screen">
        <section className="relative pt-28 pb-16 bg-gradient-to-br from-blue-800 via-blue-600 to-navy-800 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1529429617124-aee5f4aa70b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="企业持有资产"
              fill
              className="object-cover opacity-25"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-navy-900/60"></div>
          </div>
          <div className="relative z-10 container-custom">
            <p className="text-sm text-blue-200 font-semibold mb-4">Bourn Mark Asset Portfolio</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">企业持有资产案例</h1>
            <p className="text-lg text-gray-100 max-w-3xl leading-relaxed">
              以下项目均为 Bourn Mark 长期持有并自主管理的物业资产，展示我们在不同城市的投资布局与运营经验。
            </p>
          </div>
        </section>

        <section className="relative section-padding">
          <div className="absolute inset-0 -z-10">
            <Image
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="案例背景"
              fill
              className="object-cover"
              priority={false}
            />
            <div className="absolute inset-0 bg-navy-900/80 backdrop-blur-sm" />
          </div>
          <div className="container-custom relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {investmentProperties.map((item) => (
                <Link
                  key={item.slug}
                  href={`/touzi/properties/${item.slug}`}
                  className="group block rounded-3xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-xl transition-transform duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="relative h-52">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 90vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent"></div>
                    <div className="absolute bottom-4 left-5 right-5 text-white">
                      <p className="text-sm text-white/80 mb-1">{item.location}</p>
                      <h2 className="text-xl font-semibold leading-snug">{item.title}</h2>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{item.type}</span>
                      <span className="font-semibold text-blue-600">{item.price}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{item.description}</p>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:translate-x-1 transition-transform">
                      查看详情
                      <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}


