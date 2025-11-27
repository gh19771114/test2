'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageLayout from '@/components/PageLayout'
import Image from 'next/image'

// 注意：这里的结构要和「主申请页面」里的 TerminationForm 保持一致
type TerminationForm = {
  // 物件信息
  propertyName: string        // 物件名
  roomNumber: string          // 部屋番号
  propertyAddress: string     // 物件所在地
  contractHolder: string      // 契約者名

  // 日程
  cancelDate: string          // 解約日
  moveOutDate: string         // 退去予定日
  inspectionDateTime: string  // 立会希望日時（datetime-local格式）

  // 使用駐輪場 有・無
  bicycleParking: '有' | '無'

  // メールボックスの開け方 ( 左 / 右 )＿回＿番 ・ ( 左 / 右 )＿回＿番
  mailbox1Direction: '左' | '右'
  mailbox1Turns: string
  mailbox1Number: string
  mailbox2Direction: '左' | '右'
  mailbox2Turns: string
  mailbox2Number: string

  // 使用駐車場 有・無
  carParking: '有' | '無'

  // オートロック 有 （ 鍵式 ・ ダイヤル：＿ ） ・ 無
  autoLock: '有' | '無'
  autoLockKeyType: '' | '鍵式' | 'ダイヤル'
  autoLockDial: string

  // 使用バイク置場 有 ・ 無
  bikeSpace: '有' | '無'

  // 宅配ボックス 有 （ 鍵式 ・ カード式 ・ 番号： ） ・ 無
  deliveryBox: '有' | '無'
  deliveryBoxType: '' | '鍵式' | 'カード式'
  deliveryBoxNumber: string

  // 返金口座
  bankName: string            // 銀行
  bankBranch: string          // 支店
  accountType: '普通' | '当座' | '' // 口座種別
  accountNumber: string       // 口座番号
  accountHolder: string       // 名義人

  // 解約理由（单选）
  reason: '' | '進学' | '就職' | '転勤' | '自宅購入' | '帰国' | '家賃金額' | '契約期間満了' | 'その他'  // 解約理由
  reasonOtherText: string     // その他内容（当reason为その他时）

  // 転居先
  newAddress: string          // 転居先住所
  newBuildingAndRoom: string  // 建物名・号室

  // 电话
  phoneCountryCode: string     // 国际电话区号
  phoneNumber: string         // 電話番号

  // 签名
  signerName: string          // 氏名（PDF右下）
}

export default function TerminationPreviewPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<TerminationForm | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitResult, setSubmitResult] = useState<string | null>(null)

  useEffect(() => {
    // 从 sessionStorage 读取主页面保存的表单数据
    const storedData = sessionStorage.getItem('terminationFormData')
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData)
        setFormData(parsed)
      } catch (e) {
        console.error('Failed to parse form data:', e)
        router.push('/tenant/kaiyaku')
      }
    } else {
      // 没有数据就返回主申请页
      router.push('/tenant/kaiyaku')
    }
  }, [router])

  const handleConfirm = async () => {
    if (!formData) return

    setLoading(true)
    setSubmitResult(null)

    try {
      // 提交到生成 PDF + 发邮件的 API（你后端那边用 Playwright 的 route）
      const res = await fetch('/api/kaiyaku', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      let data: any = {}
      try {
        const text = await res.text()
        if (text) data = JSON.parse(text)
      } catch (parseError) {
        console.error('无法解析响应:', parseError)
        data = { error: `服务器响应错误 (${res.status})` }
      }

      if (!res.ok) {
        const errorMsg =
          data.error || data.details || `HTTP ${res.status}: ${res.statusText}`
        console.error('API 错误:', {
          status: res.status,
          statusText: res.statusText,
          data,
        })
        setSubmitResult(`提交失败：${errorMsg}`)
        return
      }

      setSubmitResult(
        data.message ||
          '解约申请已提交。系统将生成日文PDF解約通知書并发送至管理公司。'
      )

      // 提交成功后清掉缓存
      sessionStorage.removeItem('terminationFormData')
    } catch (err: any) {
      console.error('提交错误:', err)
      const errorMsg = err.message || '网络错误或服务器无响应'
      setSubmitResult(
        `提交失败：${errorMsg}。请检查网络连接后重试，或联系客服。`
      )
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

  // 把解约理由整理成一行文字，和 PDF 里类似
  const reasons = formData.reason === 'その他' 
    ? `■その他（${formData.reasonOtherText || ''}）`
    : formData.reason 
    ? `■${formData.reason}`
    : '（未选择）'

  // 邮箱开锁方式一行
  const mailboxLine = buildMailboxLine(formData)

  // オートロック显示内容
  const autoLockLine = buildAutoLockLine(formData)

  // 宅配ボックス显示内容
  const deliveryBoxLine = buildDeliveryBoxLine(formData)

  return (
    <PageLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* 顶部 Hero */}
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
            <p className="text-sm text-yellow-200 font-semibold mb-4">
              Tenant Support
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              内容确认
            </h1>
            <p className="text-lg text-gray-100 max-w-3xl leading-relaxed">
              请确认以下信息无误后提交申请。提交后系统将根据这些内容生成日文版解約通知書PDF。
            </p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom">
            {/* 预览内容 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-6 max-w-4xl mx-auto">
              {/* 顶部标题 */}
              <div>
                <h2 className="text-2xl font-semibold text-navy-700">
                  解约内容确认
                </h2>
              </div>

              {/* 预览表格，结构尽量贴近 PDF */}
              <div className="border border-gray-200 rounded-xl overflow-hidden text-sm text-gray-800">
                {/* 一、物件信息 */}
                <div className="bg-gray-50 px-4 py-2 font-semibold border-b border-gray-200">
                  一、物件信息
                </div>
                <table className="w-full border-t border-gray-200">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <th className="w-32 bg-gray-50 px-3 py-2 text-left align-top">
                        物件名
                      </th>
                      <td className="px-3 py-2">{formData.propertyName}</td>
                      <th className="w-32 bg-gray-50 px-3 py-2 text-left align-top">
                        部屋番号
                      </th>
                      <td className="px-3 py-2">{formData.roomNumber}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="bg-gray-50 px-3 py-2 text-left align-top">
                        物件所在地
                      </th>
                      <td className="px-3 py-2" colSpan={3}>
                        {formData.propertyAddress}
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-gray-50 px-3 py-2 text-left align-top">
                        契約者名
                      </th>
                      <td className="px-3 py-2" colSpan={3}>
                        {formData.contractHolder}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* 二、日程 */}
                <div className="bg-gray-50 px-4 py-2 font-semibold border-y border-gray-200 mt-4">
                  二、日程
                </div>
                <table className="w-full border-t border-gray-200">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <th className="bg-gray-50 px-3 py-2 text-left align-top w-32">
                        解約日
                      </th>
                      <td className="px-3 py-2">
                        {formatDateForPreview(formData.cancelDate)}
                      </td>
                      <th className="bg-gray-50 px-3 py-2 text-left align-top w-32">
                        退去予定日
                      </th>
                      <td className="px-3 py-2">
                        {formatDateForPreview(formData.moveOutDate)}
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-gray-50 px-3 py-2 text-left align-top">
                        立会希望日時
                      </th>
                      <td className="px-3 py-2" colSpan={3}>
                        {formatInspectionDateTime(formData.inspectionDateTime)}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* 三、施設利用状況 */}
                <div className="bg-gray-50 px-4 py-2 font-semibold border-y border-gray-200 mt-4">
                  三、施設利用状況
                </div>
                <table className="w-full border-t border-gray-200">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <th className="bg-gray-50 px-3 py-2 text-left align-top w-40">
                        使用駐輪場
                      </th>
                      <td className="px-3 py-2">
                        {ynLine(formData.bicycleParking)}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="bg-gray-50 px-3 py-2 text-left align-top">
                        メールボックスの開け方
                      </th>
                      <td className="px-3 py-2">{mailboxLine}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="bg-gray-50 px-3 py-2 text-left align-top">
                        使用駐車場
                      </th>
                      <td className="px-3 py-2">
                        {ynLine(formData.carParking)}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="bg-gray-50 px-3 py-2 text-left align-top">
                        オートロック
                      </th>
                      <td className="px-3 py-2">{autoLockLine}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="bg-gray-50 px-3 py-2 text-left align-top">
                        使用バイク置場
                      </th>
                      <td className="px-3 py-2">
                        {ynLine(formData.bikeSpace)}
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-gray-50 px-3 py-2 text-left align-top">
                        宅配ボックス
                      </th>
                      <td className="px-3 py-2">{deliveryBoxLine}</td>
                    </tr>
                  </tbody>
                </table>

                {/* 四、返金口座 */}
                <div className="bg-gray-50 px-4 py-2 font-semibold border-y border-gray-200 mt-4">
                  四、返金账户
                </div>
                <table className="w-full border-t border-gray-200">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <th className="bg-gray-50 px-3 py-2 text-left align-top w-32">
                        銀行
                      </th>
                      <td className="px-3 py-2">
                        {formData.bankName || '（未填写）'}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="bg-gray-50 px-3 py-2 text-left align-top">
                        支店
                      </th>
                      <td className="px-3 py-2">
                        {formData.bankBranch || '（未填写）'}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="bg-gray-50 px-3 py-2 text-left align-top">
                        口座種別
                      </th>
                      <td className="px-3 py-2">
                        {formData.accountType
                          ? formData.accountType
                          : '（未选择）'}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="bg-gray-50 px-3 py-2 text-left align-top">
                        口座番号
                      </th>
                      <td className="px-3 py-2">
                        {formData.accountNumber || '（未填写）'}
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-gray-50 px-3 py-2 text-left align-top">
                        名義人
                      </th>
                      <td className="px-3 py-2">
                        {formData.accountHolder || '（未填写）'}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* 五、解約理由 & 転居先 */}
                <div className="bg-gray-50 px-4 py-2 font-semibold border-y border-gray-200 mt-4">
                  五、解約理由・転居先
                </div>
                <table className="w-full border-t border-gray-200">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <th className="bg-gray-50 px-3 py-2 text-left align-top w-32">
                        解約理由
                      </th>
                      <td className="px-3 py-2">
                        {reasons || '（未选择）'}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="bg-gray-50 px-3 py-2 text-left align-top">
                        転居先住所
                      </th>
                      <td className="px-3 py-2">
                        {formData.newAddress || '未定'}
                        <div className="text-xs text-gray-500 mt-2">
                          ※ 如未定，请在解约立会时务必告知。
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-gray-50 px-3 py-2 text-left align-top">
                        建物名・号室
                      </th>
                      <td className="px-3 py-2">
                        {formData.newBuildingAndRoom || '（未填写）'}
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-gray-50 px-3 py-2 text-left align-top">
                        电话
                      </th>
                      <td className="px-3 py-2">
                        {formData.phoneNumber 
                          ? `${formData.phoneCountryCode || '+81'} ${formData.phoneNumber}`
                          : '（未填写）'}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* 签名（氏名） */}
                <div className="px-4 py-4 flex justify-end text-sm">
                  <div>
                    氏名：
                    <span className="inline-block min-w-[8rem] border-b border-gray-300 text-center">
                      {formData.signerName || formData.contractHolder}
                    </span>
                  </div>
                </div>
              </div>

              {/* 按钮 + 提示 */}
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
                <div
                  className={`p-4 rounded-lg ${
                    submitResult.includes('失败')
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : 'bg-green-50 text-green-600 border border-green-200'
                  }`}
                >
                  <p className="text-sm text-center">{submitResult}</p>
                </div>
              )}
              {!submitResult && (
                <p className="text-sm text-gray-500">
                  提交后，系统会根据以上内容生成日文解約通知書PDF，并发送到管理公司指定邮箱。建议您另行保存一份截图或打印件备查。
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}

/** —— 一些小工具函数 —— */

// 把 yyyy-mm-dd 格式，简单显示成 yyyy年mm月dd日（空就原样）
function formatDateForPreview(value: string) {
  if (!value) return '（未填写）'
  const [y, m, d] = value.split('-')
  if (!y || !m || !d) return value
  return `${y}年${m}月${d}日`
}

function formatInspectionDateTime(dateTime?: string) {
  if (!dateTime) return '（未填写）'
  // datetime-local格式：YYYY-MM-DDTHH:mm
  const [datePart, timePart] = dateTime.split('T')
  if (!datePart) return dateTime
  
  const [y, m, d] = datePart.split('-')
  if (!y || !m || !d) return dateTime
  
  const parts: string[] = [`${y}年${m}月${d}日`]
  if (timePart) {
    const [hour, minute] = timePart.split(':')
    if (hour) parts.push(`${hour}時`)
    if (minute) parts.push(`${minute}分`)
  }
  return parts.join('')
}

function ynLine(v: '有' | '無') {
  return v === '有' ? '■有　□無' : '□有　■無'
}

function buildMailboxLine(data: TerminationForm) {
  const part1 = `(${data.mailbox1Direction}) ${data.mailbox1Turns || '＿'}回${
    data.mailbox1Number || '＿'
  }番`
  const part2 = `(${data.mailbox2Direction}) ${data.mailbox2Turns || '＿'}回${
    data.mailbox2Number || '＿'
  }番`
  return `${part1} ・ ${part2}`
}

function buildAutoLockLine(data: TerminationForm) {
  if (data.autoLock === '無') {
    return '□有　□鍵式　□ダイヤル（　　　　　）　■無'
  }
  const keyType =
    data.autoLockKeyType === '鍵式'
      ? '■鍵式　□ダイヤル（　　　　　）'
      : data.autoLockKeyType === 'ダイヤル'
      ? `□鍵式　■ダイヤル（${data.autoLockDial || '　　　　　'}）`
      : '□鍵式　□ダイヤル（　　　　　）'
  return `■有　${keyType}　□無`
}

function buildDeliveryBoxLine(data: TerminationForm) {
  if (data.deliveryBox === '無') {
    return '□有　□鍵式　□カード式　番号：（　　　　　）　■無'
  }
  const type =
    data.deliveryBoxType === '鍵式'
      ? '■鍵式　□カード式'
      : data.deliveryBoxType === 'カード式'
      ? '□鍵式　■カード式'
      : '□鍵式　□カード式'
  const num = data.deliveryBoxNumber || '　　　　　'
  return `■有　${type}　番号：（${num}）　□無`
}

