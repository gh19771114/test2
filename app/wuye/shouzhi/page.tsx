'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import ServiceTimeline from '@/components/ServiceTimeline'
import { DollarSign } from 'lucide-react'

const timelineItems = [
  {
    time: '每月1-5日',
    title: '租金收取',
    description: '每月定期向租客收取租金，如遇延迟将及时进行催缴，确保租金按时到账。',
  },
  {
    time: '每月10日前',
    title: '财务报表生成',
    description: '完成当月收支统计，生成详细的财务报表，包括租金收入、各项支出明细等，并通过邮件或系统发送给业主。',
  },
  {
    time: '每月15日前',
    title: '税务处理',
    description: '根据财务报表提供税务建议，协助处理相关税务申报，确保合规运营。',
  },
  {
    time: '按需处理',
    title: '跨境汇款',
    description: '支持多货币结算与跨境汇款，根据业主需求将租金收入汇至指定账户。',
  },
]

export default function ShouzhiPage() {
  return (
    <PageLayout>
      <div className="relative">
        <section className="relative pt-28 pb-16 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="收支与税务"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="relative z-10 container-custom">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="w-8 h-8 text-green-300" />
              <p className="text-sm text-green-300 font-semibold">Finance & Tax</p>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">收支与税务管理</h1>
            <p className="text-lg text-gray-200 max-w-3xl leading-relaxed">
              提供透明的财务管理和专业的税务服务，让您随时掌握资产运营状况，确保合规经营。
            </p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">服务流程时间线</h2>
            <ServiceTimeline items={timelineItems} />
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">服务内容</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-navy-700 mb-3">每月租金收取与催缴</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0"></span>
                    <span>定期租金收取</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0"></span>
                    <span>延迟租金催缴</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0"></span>
                    <span>租金到账确认</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-navy-700 mb-3">资产报表与税务建议</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0"></span>
                    <span>月度收支报表</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0"></span>
                    <span>年度财务总结</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0"></span>
                    <span>税务优化建议</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-navy-700 mb-3">多货币结算与跨境汇款</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0"></span>
                    <span>日元/人民币/美元结算</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0"></span>
                    <span>跨境汇款服务</span>
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

