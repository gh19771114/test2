'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import ServiceTimeline from '@/components/ServiceTimeline'
import { Shield } from 'lucide-react'

const timelineItems = [
  {
    time: '房产交接时',
    title: '保险需求评估',
    description: '在接管房产时，评估房产状况和风险，确定需要配置的保险类型和保额。',
  },
  {
    time: '1周内',
    title: '保险方案制定',
    description: '根据评估结果，制定保险配置方案，包括火灾险、地震险、租金补偿险等，并向业主说明。',
  },
  {
    time: '2周内',
    title: '保险办理完成',
    description: '完成所有保险的申请和办理手续，确保房产得到全面保障。',
  },
  {
    time: '每年续保前',
    title: '续保提醒与协助',
    description: '在保险到期前提前提醒业主，协助办理续保手续，确保保障不中断。',
  },
  {
    time: '出险时',
    title: '理赔协助',
    description: '如发生保险事故，及时协助业主进行理赔申请，确保快速获得赔偿。',
  },
]

export default function BaoxianPage() {
  return (
    <PageLayout>
      <div className="relative" style={{
        background: 'linear-gradient(135deg, #4a5568 0%, #2d3748 50%, #1a202c 100%)',
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.04) 2px, rgba(255, 255, 255, 0.04) 4px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255, 255, 255, 0.04) 2px, rgba(255, 255, 255, 0.04) 4px), radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.12) 0%, transparent 50%)'
      }}>
        <section className="relative pt-28 pb-16 bg-gradient-to-br from-red-800 via-red-700 to-navy-800 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="相关保险"
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/80 to-navy-900/60"></div>
          </div>
          <div className="relative z-10 container-custom">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-red-300" />
              <p className="text-sm text-red-300 font-semibold">相关保险 Insurance</p>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">相关保险服务</h1>
            <p className="text-lg text-gray-200 max-w-3xl leading-relaxed">
              为您的房产配置全面的保险保障，包括火灾险、地震险、租金补偿险等，确保资产安全无忧。
            </p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-navy-700 mb-8 text-center">服务流程时间线</h2>
            <ServiceTimeline items={timelineItems} />
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-navy-700 mb-6">服务内容</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-navy-700 mb-3">火灾险与地震险配置</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                    <span>火灾保险</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                    <span>地震保险</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                    <span>保额优化建议</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-navy-700 mb-3">租金补偿险与责任险</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                    <span>租金补偿保险</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                    <span>业主责任保险</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                    <span>综合保障方案</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-navy-700 mb-3">理赔协助与续保提醒</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                    <span>理赔申请协助</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                    <span>续保提醒服务</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                    <span>保险方案优化</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}




