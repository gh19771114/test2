'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import Link from 'next/link'
import { Phone, CreditCard, FileText, Shield, Wrench } from 'lucide-react'

export default function TenantPage() {
  return (
    <PageLayout>
      <section className="relative pt-28 pb-16 bg-gradient-to-br from-orange-800 via-orange-700 to-navy-800 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="租客专用"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900/80 to-navy-900/60"></div>
        </div>
        <div className="relative z-10 container-custom">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">租客专用</h1>
          <p className="text-lg text-gray-200 max-w-3xl leading-relaxed">
            欢迎使用我们的租客服务。如果您是我们的租客，可以通过以下方式联系我们。
          </p>
        </div>
      </section>
        
        <section className="relative pt-16 pb-16">
          
          <div className="container-custom relative z-10">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-navy-700" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-navy-900 mb-2">紧急报修</h2>
                <p className="text-gray-700 leading-relaxed">24小时紧急报修热线：0120-559-989</p>
              </div>
            </div>
            
            <div className="border-l-4 border-green-500 pl-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-navy-900 mb-2">租金缴纳</h2>
                <p className="text-gray-700 leading-relaxed">请通过银行转账或在线支付方式缴纳租金。</p>
                <p className="text-gray-700 leading-relaxed mt-2">租金缴纳咨询专线：03-6661-7745</p>
              </div>
            </div>
            
            <div className="border-l-4 border-yellow-500 pl-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-navy-900 mb-2">更新 &amp; 保险</h2>
                <p className="text-gray-700 leading-relaxed">租约更新、火灾保险续保等问题，请致电：</p>
                <p className="text-gray-700 leading-relaxed mt-2">03-6661-2588</p>
              </div>
            </div>

            <div className="border-l-4 border-purple-500 pl-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Wrench className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-navy-900 mb-2">日常维修</h2>
                <p className="text-gray-700 leading-relaxed">如涉及设备保养、日常维修，请联系：</p>
                <p className="text-gray-700 leading-relaxed mt-2">03-6661-1848</p>
              </div>
            </div>

            <div className="border-l-4 border-navy-500 pl-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-navy-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-navy-900" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-navy-900 mb-2">解约申请</h2>
                <p className="text-gray-700 leading-relaxed">如需办理退租，请填写在线表单，我们会自动生成解约文件并发送至管理团队。</p>
                <Link
                  href="/tenant/kaiyaku"
                  className="inline-flex items-center gap-2 text-navy-700 hover:text-blue-700 mt-3 font-medium"
                >
                  前往解约申请表
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
              </div>
            </div>
          </div>
        </section>
    </PageLayout>
  )
}

