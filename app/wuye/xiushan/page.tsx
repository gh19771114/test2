'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import ServiceTimeline from '@/components/ServiceTimeline'
import { Wrench } from 'lucide-react'

const timelineItems = [
  {
    time: '24小时内',
    title: '应急维修响应',
    description: '接到租客报修后，24小时内安排维修人员上门检查，紧急情况（如漏水、断电等）2小时内响应。',
  },
  {
    time: '3-5个工作日',
    title: '维修方案确定',
    description: '根据检查结果，制定维修方案并报价，经业主确认后安排施工。',
  },
  {
    time: '1-2周内',
    title: '维修完成',
    description: '完成维修工作，进行质量验收，确保问题彻底解决。',
  },
]

export default function XiushanPage() {
  return (
    <PageLayout>
      <div className="relative">
        <section className="relative pt-28 pb-16 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="修缮维护"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="relative z-10 container-custom">
            <div className="flex items-center gap-3 mb-4">
              <Wrench className="w-8 h-8 text-orange-300" />
              <p className="text-sm text-orange-300 font-semibold">Maintenance & Repair</p>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">修缮维护服务</h1>
            <p className="text-lg text-gray-200 max-w-3xl leading-relaxed">
              提供24小时应急维修、定期检查与耗材更换、装修升级等全方位维护服务，确保房产保持良好状态。
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
                <h3 className="text-lg font-semibold text-navy-700 mb-3">24小时应急维修</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-orange-500 flex-shrink-0"></span>
                    <span>紧急情况快速响应</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-orange-500 flex-shrink-0"></span>
                    <span>专业维修团队</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-orange-500 flex-shrink-0"></span>
                    <span>维修质量保证</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-navy-700 mb-3">定期检查与耗材更换</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-orange-500 flex-shrink-0"></span>
                    <span>设备耗材更换</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-orange-500 flex-shrink-0"></span>
                    <span>预防性维护</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-navy-700 mb-3">装修升级与项目管理</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-orange-500 flex-shrink-0"></span>
                    <span>装修方案设计</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-orange-500 flex-shrink-0"></span>
                    <span>施工进度管理</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-orange-500 flex-shrink-0"></span>
                    <span>质量验收</span>
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

