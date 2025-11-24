'use client'

import PageLayout from '@/components/PageLayout'
import Philosophy from '@/components/Philosophy'
import Image from 'next/image'

export default function CompanyPhilosophyPage() {
  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-slate-100 via-white to-white" style={{ background: 'linear-gradient(to bottom, #f1f5f9, #ffffff, #ffffff)' }}>
        <section className="relative pt-28 pb-16 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="企业理念"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
          <div className="relative z-10 container-custom space-y-4">
            <p className="text-sm text-blue-200 font-semibold">Corporate Philosophy</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">企业理念</h1>
            <p className="text-lg text-slate-100 max-w-4xl leading-relaxed text-balance">
              Bourn Mark 根植日本、服务中日。我们在不动产、企业服务与资本运营之间寻找长期平衡，以诚信、专业与跨文化理解为核心，持续推进城市更新、资产运营与商务合作的共赢。我们以诚挚的态度陪伴客户走过每一个阶段，让资产、企业与团队在日本不断成长，并持续为地区发展注入活力。
            </p>
          </div>
        </section>

        <Philosophy />
      </div>
    </PageLayout>
  )
}

