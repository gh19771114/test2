'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import ServiceTimeline from '@/components/ServiceTimeline'
import { ClipboardCheck } from 'lucide-react'

const timelineItems = [
  {
    time: '24小时内',
    title: '租客筛选与背景调查',
    description: '租客提交承租申请后，我们将在24小时内完成对租客提供信息的真伪验证和社会信用调查。同时联系保证公司申请担保，确保租客资质符合要求。',
  },
  {
    time: '1周内',
    title: '办理入住手续',
    description: '完成所有入住手续的办理，包括合同签署、押金收取、钥匙交接等。通知租客具体入住日期，确保流程顺畅。',
  },
  {
    time: '最快2周',
    title: '完成入住',
    description: '从申请到入住，最快可在2周内完成整个流程，让租客尽快入住，同时确保所有手续合规完整。',
  },
  {
    time: '契约到期前2个月',
    title: '契约更新',
    description: '在契约到期前2个月的时间联系租客，准备相关手续。提前沟通续约意向，协商租金调整，确保续约流程顺畅进行。',
  },
  {
    time: '收到解约通知24小时内',
    title: '解约',
    description: '在收到解约通知的24小时之内开始相关手续办理。确定房间的修缮等工作，确保尽快着手招租工作，减少空置时间，最大化资产收益。',
  },
]

export default function ZulinPage() {
  return (
    <PageLayout>
      <div className="relative" style={{
        background: 'linear-gradient(135deg, #4a5568 0%, #2d3748 50%, #1a202c 100%)',
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.04) 2px, rgba(255, 255, 255, 0.04) 4px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255, 255, 255, 0.04) 2px, rgba(255, 255, 255, 0.04) 4px), radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.12) 0%, transparent 50%)'
      }}>
        <section className="relative pt-28 pb-16 bg-gradient-to-br from-blue-800 via-blue-700 to-navy-800 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="租赁管理"
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-navy-900/60"></div>
          </div>
          <div className="relative z-10 container-custom">
            <div className="flex items-center gap-3 mb-4">
              <ClipboardCheck className="w-8 h-8 text-blue-300" />
              <p className="text-sm text-blue-300 font-semibold">租赁管理 Rental Management</p>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">租赁管理服务</h1>
            <p className="text-lg text-gray-200 max-w-3xl leading-relaxed">
              提供从租客筛选、合同签署到入住退房的全流程管理服务，确保您的房产快速出租并持续产生稳定收益。
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
                <h3 className="text-lg font-semibold text-navy-700 mb-3">租客筛选与背景调查</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                    <span>身份信息验证</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                    <span>信用记录调查</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                    <span>收入证明审核</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                    <span>保证公司担保申请</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-navy-700 mb-3">合同签署与租金调整</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                    <span>租赁合同起草与签署</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                    <span>押金与首月租金收取</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                    <span>租金调整策略制定</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                    <span>续约协商与处理</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-navy-700 mb-3">入住退房手续</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                    <span>入住前房屋检查</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                    <span>钥匙交接与设备说明</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                    <span>退房时验房报告</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                    <span>押金结算与返还</span>
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

