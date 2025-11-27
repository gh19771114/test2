'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import { TrendingUp } from 'lucide-react'

export default function ZengzhiPage() {
  return (
    <PageLayout>
      <div className="relative">
        <section className="relative pt-28 pb-16 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="资产增值"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="relative z-10 container-custom">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-8 h-8 text-purple-300" />
              <p className="text-sm text-purple-300 font-semibold">Asset Appreciation</p>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">资产增值服务</h1>
            <p className="text-lg text-gray-200 max-w-3xl leading-relaxed">
              通过租金优化、大规模修缮和附加收益开发，持续提升您的房产价值和投资回报率。
            </p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">服务内容</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-navy-700 mb-3">市场调查</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-purple-500 flex-shrink-0"></span>
                    <span>周边市场租金水平分析</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-purple-500 flex-shrink-0"></span>
                    <span>区域房产价值评估</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-purple-500 flex-shrink-0"></span>
                    <span>竞争物业调研</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-navy-700 mb-3">企业咨询</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-purple-500 flex-shrink-0"></span>
                    <span>资产增值策略规划</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-purple-500 flex-shrink-0"></span>
                    <span>投资回报率优化建议</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-purple-500 flex-shrink-0"></span>
                    <span>长期资产管理方案</span>
                  </li>
                </ul>
              </div>
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
                    <span>自动贩卖机设置</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-purple-500 flex-shrink-0"></span>
                    <span>信号塔设置</span>
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

