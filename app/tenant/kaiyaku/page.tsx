'use client'

import { useState, type ChangeEvent, type FormEvent } from 'react'
import PageLayout from '@/components/PageLayout'
import Image from 'next/image'

const KAIYAKU_FORM_URL = 'https://storage.googleapis.com/bournmark_hp_assets/articles/kaiyaku.pdf'
const HERO_DESCRIPTION = '填写以下信息并提交，会自动生成解约申请表。如有疑问，请联系物业管理团队（03-6661-1848）。'

type TerminationForm = {
  name: string
  address: string
  building: string
  room: string
  phone: string
  reason: string
  moveOutDate: string
  bankName: string
  bankBranch: string
  bankType: string
  bankNumber: string
  bankHolder: string
}

const initialForm: TerminationForm = {
  name: '',
  address: '',
  building: '',
  room: '',
  phone: '',
  reason: '',
  moveOutDate: '',
  bankName: '',
  bankBranch: '',
  bankType: '',
  bankNumber: '',
  bankHolder: '',
}

export default function TenantTerminationPage() {
  const [formData, setFormData] = useState<TerminationForm>(initialForm)

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    // 将表单数据保存到 sessionStorage，然后跳转到预览页面
    sessionStorage.setItem('terminationFormData', JSON.stringify(formData))
    window.location.href = '/tenant/kaiyaku/preview'
  }

  const resetForm = () => {
    setFormData(initialForm)
  }

  return (
    <PageLayout>
      <div className="bg-gray-50 min-h-screen">
        <section className="relative pt-28 pb-16 bg-gradient-to-br from-red-700 via-orange-600 to-yellow-500 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="解约申请"
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/70 to-orange-900/60"></div>
          </div>
          <div className="relative z-10 container-custom">
            <p className="text-sm text-yellow-200 font-semibold mb-4">Tenant Support</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">退租解约申请</h1>
            <p className="text-lg text-gray-100 max-w-3xl leading-relaxed">
              {HERO_DESCRIPTION}
            </p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom grid grid-cols-1 lg:grid-cols-3 gap-10">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-6 lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">姓名</label>
                  <input id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent" placeholder="请输入姓名" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="phone">电话</label>
                  <input id="phone" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent" placeholder="请输入电话号码" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="address">地址</label>
                <input id="address" name="address" value={formData.address} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent" placeholder="请输入联络地址" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="building">建筑名称</label>
                  <input id="building" name="building" value={formData.building} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent" placeholder="例如：Bourn Mark Ningyocho" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="room">房间号</label>
                  <input id="room" name="room" value={formData.room} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent" placeholder="例如：502" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="moveOutDate">预计退房日期</label>
                <input id="moveOutDate" name="moveOutDate" type="date" value={formData.moveOutDate} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent" />
                <p className="text-xs text-gray-500 mt-1">解约通知日期将自动设置为提交申请的日期</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="reason">解约原因</label>
                <textarea id="reason" name="reason" value={formData.reason} onChange={handleChange} rows={4} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent" placeholder="请简要说明解约原因" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="bankName">银行名称</label>
                  <input id="bankName" name="bankName" value={formData.bankName} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent" placeholder="例如：三菱UFJ银行" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="bankBranch">分行名称</label>
                  <input id="bankBranch" name="bankBranch" value={formData.bankBranch} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent" placeholder="请输入分行名称" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="bankType">账户类别</label>
                  <input id="bankType" name="bankType" value={formData.bankType} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent" placeholder="例如：普通・当座" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="bankNumber">银行账号</label>
                  <input id="bankNumber" name="bankNumber" value={formData.bankNumber} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent" placeholder="请输入账号" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="bankHolder">账户名义</label>
                <input id="bankHolder" name="bankHolder" value={formData.bankHolder} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent" placeholder="请输入账户名义" />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between pt-2">
                <button 
                  type="submit" 
                  className="btn-primary w-full sm:w-auto px-8 py-3"
                >
                  提交申请
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full sm:w-auto px-8 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition"
                >
                  重置表单
                </button>
              </div>

              <p className="text-sm text-gray-500">提交后，将进入内容确认页面，确认无误后我们会生成PDF并发送邮件。</p>
            </form>

            <aside className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-navy-700 mb-2">解约表格下载</h2>
                <p className="text-gray-600 leading-relaxed mb-4">请在填写后下载官方表格并签名保存。</p>
                <a
                  href={KAIYAKU_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-navy-700 text-white hover:bg-navy-800 transition"
                >
                  下载解约申请表（PDF）
                </a>
              </div>


              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 text-sm text-yellow-800 space-y-3">
                <p className="font-semibold">退房注意事项（请务必配合办理）</p>
                <ul className="space-y-2">
                  <li>1. 电、水、燃气请在退房日当天办理解约，以便安排当日设备检查。</li>
                  <li>2. 搬离时请勿在室内、阳台、走廊等区域留下垃圾或废弃物。大件垃圾请咨询区役所处理方法，若有残留将收取处理费用。</li>
                  <li>3. 若保险或水电等仍需继续使用，请联系保单所载保险公司办理地址变更；如需解约，请自行致电完成手续。</li>
                  <li>4. 若因个人原因无法在解约日前完成退房或现场确认，可能产生续约费用，请务必注意时间安排。</li>
                  <li>5. 退房现场确认的日期将由专员稍后电话联系，如需变更请直接与其沟通，现场确认当日请务必准时。</li>
                  <li>6. 对于退房时因故意、过失或不当使用造成的损耗与损伤，相关复原费用需由承租人承担。</li>
                </ul>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
