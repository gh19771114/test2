'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import ServiceTimeline from '@/components/ServiceTimeline'
import { Users } from 'lucide-react'

const timelineItems = [
  {
    time: '入住前1周',
    title: '入住欢迎准备',
    description: '提前准备入住欢迎包，包括生活指南、周边设施介绍、紧急联系方式等资料，确保租客顺利入住。',
  },
  {
    time: '入住当天',
    title: '入住指引',
    description: '现场进行入住指引，介绍房屋设施使用方法、垃圾分类规则、周边生活设施等，解答租客疑问。',
  },
  {
    time: '入住后48小时内',
    title: '入住确认回访',
    description: '入住后48小时内进行电话或邮件回访，确认租客是否适应，是否有需要协助的事项。',
  },
  {
    time: '持续服务',
    title: '日常支援',
    description: '提供中文/日文双语客服，及时响应租客投诉和咨询，协调解决居住期间的各种问题。',
  },
]

export default function RuzhuPage() {
  return (
    <PageLayout>
      <div className="relative" style={{
        background: 'linear-gradient(135deg, #4a5568 0%, #2d3748 50%, #1a202c 100%)',
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.04) 2px, rgba(255, 255, 255, 0.04) 4px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255, 255, 255, 0.04) 2px, rgba(255, 255, 255, 0.04) 4px), radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.12) 0%, transparent 50%)'
      }}>
        <section className="relative pt-28 pb-16 bg-gradient-to-br from-teal-800 via-teal-700 to-navy-800 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="入住者服务"
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-teal-900/80 to-navy-900/60"></div>
          </div>
          <div className="relative z-10 container-custom">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8 text-teal-300" />
              <p className="text-sm text-teal-300 font-semibold">入住者服务 Tenant Services</p>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">入住者服务</h1>
            <p className="text-lg text-gray-200 max-w-3xl leading-relaxed">
              为租客提供贴心的入住服务和持续的生活支援，确保租客居住体验，提高续租率和满意度。
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
                <h3 className="text-lg font-semibold text-navy-700 mb-3">入住欢迎与生活指南</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-500 flex-shrink-0"></span>
                    <span>入住欢迎包</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-500 flex-shrink-0"></span>
                    <span>生活指南手册</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-500 flex-shrink-0"></span>
                    <span>周边设施介绍</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-navy-700 mb-3">中文/日文客服与投诉响应</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-500 flex-shrink-0"></span>
                    <span>双语客服支持</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-500 flex-shrink-0"></span>
                    <span>快速投诉响应</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-500 flex-shrink-0"></span>
                    <span>问题协调解决</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-navy-700 mb-3">居住期间日常支援协调</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-500 flex-shrink-0"></span>
                    <span>定期关怀回访</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-500 flex-shrink-0"></span>
                    <span>生活咨询协助</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-500 flex-shrink-0"></span>
                    <span>社区活动组织</span>
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




