'use client'

import PageLayout from '@/components/PageLayout'
import Philosophy from '@/components/Philosophy'
import Image from 'next/image'
export default function CompanyPhilosophyPage() {
  return (
    <PageLayout>
      <div className="relative">
        <section className="relative pt-28 pb-16 bg-gradient-to-br from-indigo-800 via-indigo-700 to-navy-800 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="企业理念"
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 to-navy-900/60"></div>
          </div>
          <div className="relative z-10 container-custom space-y-4">
            <p className="text-sm text-indigo-100 font-semibold drop-shadow-md">Corporate Philosophy</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">企业理念</h1>
            <p className="text-lg text-gray-50 max-w-4xl leading-relaxed text-balance drop-shadow-md">
              Bourn Mark 根植日本、服务中日。我们在不动产、企业服务与资本运营之间寻找长期平衡，以诚信、专业与跨文化理解为核心，持续推进城市更新、资产运营与商务合作的共赢。我们以诚挚的态度陪伴客户走过每一个阶段，让资产、企业与团队在日本不断成长，并持续为地区发展注入活力。
            </p>
          </div>
        </section>

        <Philosophy />
      </div>
    </PageLayout>
  )
}

