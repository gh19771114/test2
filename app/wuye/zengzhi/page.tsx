'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import ServiceTimeline from '@/components/ServiceTimeline'
import { TrendingUp } from 'lucide-react'

const timelineItems = [
  {
    time: '每月评估',
    title: '租金市场分析',
    description: '每月对周边市场租金水平进行评估分析，识别租金调整机会，制定优化策略。',
  },
  {
    time: '1-2个月',
    title: '租金交涉',
    description: '与租客进行租金调整协商，根据市场情况和租客情况制定合理的调整方案。',
  },
  {
    time: '3-6个月',
    title: '大规模修缮规划',
    description: '评估房产状况，制定大规模修缮计划，提升房产价值和租金收益潜力。',
  },
  {
    time: '持续进行',
    title: '附加收益开发',
    description: '探索停车位、广告位等附加收益来源，最大化资产收益。',
  },
]

export default function ZengzhiPage() {
  return (
    <PageLayout>
      <div className="relative" style={{
        background: 'linear-gradient(135deg, #4a5568 0%, #2d3748 50%, #1a202c 100%)',
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.04) 2px, rgba(255, 255, 255, 0.04) 4px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255, 255, 255, 0.04) 2px, rgba(255, 255, 255, 0.04) 4px), radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.12) 0%, transparent 50%)'
      }}>
        <section className="relative pt-28 pb-16 bg-gradient-to-br from-purple-800 via-purple-700 to-navy-800 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="资产增值"
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 to-navy-900/60"></div>
          </div>
          <div className="relative z-10 container-custom">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-8 h-8 text-purple-300" />
              <p className="text-sm text-purple-300 font-semibold">资产增值 Asset Appreciation</p>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">资产增值服务</h1>
            <p className="text-lg text-gray-200 max-w-3xl leading-relaxed">
              通过租金优化、大规模修缮和附加收益开发，持续提升您的房产价值和投资回报率。
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
                <h3 className="text-lg font-semibold text-navy-700 mb-3">租金交涉</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-purple-500 flex-shrink-0"></span>
                    <span>市场租金分析</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-purple-500 flex-shrink-0"></span>
                    <span>租金调整策略</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-purple-500 flex-shrink-0"></span>
                    <span>租客协商</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-navy-700 mb-3">大规模修缮</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-purple-500 flex-shrink-0"></span>
                    <span>修缮方案设计</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-purple-500 flex-shrink-0"></span>
                    <span>施工管理</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-purple-500 flex-shrink-0"></span>
                    <span>价值提升评估</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-navy-700 mb-3">相关附加收益</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-purple-500 flex-shrink-0"></span>
                    <span>停车位租赁</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-purple-500 flex-shrink-0"></span>
                    <span>广告位开发</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-purple-500 flex-shrink-0"></span>
                    <span>其他收益来源</span>
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




