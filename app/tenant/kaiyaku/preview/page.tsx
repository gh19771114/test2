'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageLayout from '@/components/PageLayout'
import Image from 'next/image'

const KAIYAKU_FORM_URL = 'https://storage.googleapis.com/bournmark_hp_assets/articles/kaiyaku.pdf'

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

export default function TerminationPreviewPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<TerminationForm | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitResult, setSubmitResult] = useState<string | null>(null)

  useEffect(() => {
    // 从 sessionStorage 读取表单数据
    const storedData = sessionStorage.getItem('terminationFormData')
    if (storedData) {
      try {
        setFormData(JSON.parse(storedData))
      } catch (e) {
        console.error('Failed to parse form data:', e)
        router.push('/tenant/kaiyaku')
      }
    } else {
      // 如果没有数据，返回表单页面
      router.push('/tenant/kaiyaku')
    }
  }, [router])

  const buildPreview = (data: TerminationForm) => {
    // 自动生成解约通知日期（当前日期）
    const today = new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    return [
      `姓名：${data.name}`,
      `联系地址：${data.address}`,
      `建筑名称：${data.building}`,
      `房间号：${data.room}`,
      `联系电话：${data.phone}`,
      `解约日期（通知日）：${today}`,
      `预计退房日期：${data.moveOutDate}`,
      `解约原因：${data.reason}`,
      '收款银行信息：',
      `  银行名称：${data.bankName}`,
      `  分行名称：${data.bankBranch}`,
      `  账户类别：${data.bankType}`,
      `  账号：${data.bankNumber}`,
      `  户名：${data.bankHolder}`,
    ]
  }

  const handleConfirm = async () => {
    if (!formData) return

    setLoading(true)
    setSubmitResult(null)

    try {
      const res = await fetch('/api/send-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: 'termination',
          ...formData,
        }),
      })

      // 尝试解析 JSON 响应
      let data: any = {}
      try {
        const text = await res.text()
        if (text) {
          data = JSON.parse(text)
        }
      } catch (parseError) {
        console.error('无法解析响应:', parseError)
        data = { error: `服务器响应错误 (${res.status})` }
      }

      if (!res.ok) {
        // 显示服务器返回的详细错误信息
        const errorMsg = data.error || data.details || `HTTP ${res.status}: ${res.statusText}`
        console.error('API 错误:', {
          status: res.status,
          statusText: res.statusText,
          data: data,
        })
        setSubmitResult(`提交失败：${errorMsg}`)
        return
      }

      setSubmitResult(data.message || '解约申请已提交，我们会尽快与您联系。')

      // 清除 sessionStorage
      sessionStorage.removeItem('terminationFormData')

      // 打开PDF表格（可选）
      window.open(KAIYAKU_FORM_URL, '_blank')
    } catch (err: any) {
      console.error('提交错误:', err)
      // 显示更详细的错误信息
      const errorMsg = err.message || '网络错误或服务器无响应'
      setSubmitResult(`提交失败：${errorMsg}。请检查网络连接后重试，或联系客服。`)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.push('/tenant/kaiyaku')
  }

  if (!formData) {
    return (
      <PageLayout>
        <div className="bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">正在加载...</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  const previewLines = buildPreview(formData)

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
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">内容确认</h1>
            <p className="text-lg text-gray-100 max-w-3xl leading-relaxed">
              请确认以下信息无误后提交申请
            </p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-6 lg:col-span-2">
              <h2 className="text-2xl font-semibold text-navy-700 mb-6">内容确认</h2>
              
              <div className="bg-gray-50 rounded-xl p-6 space-y-3 text-sm text-gray-700 border border-gray-200">
                {previewLines.map((line, index) => (
                  <p key={index} className={line.startsWith('  ') ? 'pl-4' : ''}>
                    {line}
                  </p>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between pt-4">
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="btn-primary w-full sm:w-auto px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '提交中...' : '确认提交'}
                </button>
                <button
                  onClick={handleBack}
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  返回修改
                </button>
              </div>

              {submitResult && (
                <div className={`p-4 rounded-lg ${submitResult.includes('失败') ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
                  <p className="text-sm text-center">{submitResult}</p>
                </div>
              )}
              {!submitResult && (
                <p className="text-sm text-gray-500">确认无误后，我们会生成PDF并发送邮件。建议同时打印或下载解约申请表存档。</p>
              )}
            </div>

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

