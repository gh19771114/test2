'use client'

import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react'
import PageLayout from '@/components/PageLayout'
import Image from 'next/image'

const KAIYAKU_FORM_URL =
  'https://storage.googleapis.com/bournmark_hp_assets/articles/kaiyaku.pdf'
const HERO_DESCRIPTION =
  '填写以下信息并提交，会自动生成日文版解约通知书的PDF文件。\n如有疑问，请联系物业管理团队（03-6661-1848）。'

// 这里的字段结构要和我们生成 PDF 时用的一致
type TerminationForm = {
  // 物件信息
  propertyName: string        // 物件名
  roomNumber: string          // 部屋番号
  propertyAddress: string     // 物件所在地
  contractHolder: string      // 契約者名

  // 日付类
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
  accountType: string // 口座種別（可输入或选择）
  accountNumber: string       // 口座番号
  accountHolder: string       // 名義人

  // 解約理由（单选）
  reason: '' | '進学' | '就職' | '転勤' | '自宅購入' | '帰国' | '家賃金額' | '契約期間満了' | 'その他'  // 解約理由
  reasonOtherText: string     // その他（ ）内容（当reason为その他时必填）

  // 転居先
  newAddress: string          // 転居先住所
  newBuildingAndRoom: string  // 建物名・号室

  // 电话
  phoneCountryCode: string     // 国际电话区号（默认：+81 日本）
  phoneNumber: string         // 電話番号

  // 署名（PDF右下 氏名）
  signerName: string
}

const initialForm: TerminationForm = {
  propertyName: '',
  roomNumber: '',
  propertyAddress: '',
  contractHolder: '',
  cancelDate: '',
  moveOutDate: '',
  inspectionDateTime: '',

  bicycleParking: '無',

  mailbox1Direction: '左',
  mailbox1Turns: '',
  mailbox1Number: '',
  mailbox2Direction: '左',
  mailbox2Turns: '',
  mailbox2Number: '',

  carParking: '無',

  autoLock: '無',
  autoLockKeyType: '',
  autoLockDial: '',

  bikeSpace: '無',

  deliveryBox: '無',
  deliveryBoxType: '',
  deliveryBoxNumber: '',

  bankName: '',
  bankBranch: '',
  accountType: '',
  accountNumber: '',
  accountHolder: '',

  // 解约理由（单选）
  reason: '',
  reasonOtherText: '',

  newAddress: '',
  newBuildingAndRoom: '',

  phoneCountryCode: '+81', // 默认日本
  phoneNumber: '',

  signerName: '',
}

export default function TenantTerminationPage() {
  const [formData, setFormData] = useState<TerminationForm>(initialForm)

  // 获取今天的最小日期（用于日期输入框的min属性）
  const getTodayMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  // 获取明天的最小日期时间（用于datetime-local输入框的min属性，不能选择今天）
  const getTodayMinDateTime = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1) // 明天
    tomorrow.setHours(0, 0, 0, 0) // 设置为明天的00:00:00
    const year = tomorrow.getFullYear()
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0')
    const day = String(tomorrow.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}T00:00`
  }

  // 从sessionStorage恢复数据（当从预览页面返回时）
  useEffect(() => {
    const storedData = sessionStorage.getItem('terminationFormData')
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData)
        setFormData(parsed)
      } catch (e) {
        console.error('Failed to parse stored form data:', e)
      }
    }
  }, [])

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = event.target as HTMLInputElement

    // 处理单选按钮（解約理由）
    if (type === 'radio' && name === 'reason') {
      setFormData((prev) => ({
        ...prev,
        reason: value as TerminationForm['reason'],
        // 保留之前填写的その他内容，不清空
      }))
      return
    }

    // 处理复选框（其他字段）
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }))
      return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // 验证所有必填字段
    const requiredFields = [
      { name: 'propertyName', id: 'propertyName', label: '物件名' },
      { name: 'roomNumber', id: 'roomNumber', label: '部屋番号' },
      { name: 'propertyAddress', id: 'propertyAddress', label: '物件所在地' },
      { name: 'contractHolder', id: 'contractHolder', label: '契約者名' },
      { name: 'cancelDate', id: 'cancelDate', label: '解約日' },
      { name: 'moveOutDate', id: 'moveOutDate', label: '退去予定日' },
      { name: 'inspectionDateTime', id: 'inspectionDateTime', label: '立会希望日時' },
      { name: 'bankName', id: 'bankName', label: '銀行' },
      { name: 'bankBranch', id: 'bankBranch', label: '支店' },
      { name: 'accountType', id: 'accountType', label: '口座種別' },
      { name: 'accountNumber', id: 'accountNumber', label: '口座番号' },
      { name: 'accountHolder', id: 'accountHolder', label: '名義人' },
      { name: 'reason', id: 'reason', label: '解約理由', isRadio: true },
      { name: 'phoneNumber', id: 'phoneNumber', label: '电话' },
    ]

    // 检查每个必填字段
    for (const field of requiredFields) {
      let value: any = formData[field.name as keyof TerminationForm]
      
      // 如果是radio组，检查reason字段
      if (field.isRadio) {
        if (!formData.reason) {
          const firstRadio = document.querySelector('input[name="reason"]') as HTMLInputElement
          if (firstRadio) {
            firstRadio.focus()
            firstRadio.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
          alert(`请选择${field.label}`)
          return
        }
      } else {
        // 检查普通字段
        if (!value || (typeof value === 'string' && !value.trim())) {
          const element = document.getElementById(field.id)
          if (element) {
            element.focus()
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
          alert(`请填写${field.label}`)
          return
        }
      }
    }

    // 验证：如果选择"その他"，必须填写具体理由
    if (formData.reason === 'その他' && !formData.reasonOtherText.trim()) {
      const textarea = document.querySelector('textarea[name="reasonOtherText"]') as HTMLTextAreaElement
      if (textarea) {
        textarea.focus()
        textarea.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      alert('请填写"その他"的具体理由')
      return
    }

    // 验证日期：解約日、退去予定日、立会希望日時必须在今天之后
    const today = new Date()
    today.setHours(0, 0, 0, 0) // 设置为今天的00:00:00，用于日期比较

    // 验证解約日
    if (formData.cancelDate) {
      const cancelDate = new Date(formData.cancelDate)
      cancelDate.setHours(0, 0, 0, 0)
      if (cancelDate <= today) {
        const element = document.getElementById('cancelDate')
        if (element) {
          element.focus()
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
        alert('解約日必须晚于今天，请选择未来的日期')
        return
      }
    }

    // 验证退去予定日
    if (formData.moveOutDate) {
      const moveOutDate = new Date(formData.moveOutDate)
      moveOutDate.setHours(0, 0, 0, 0)
      if (moveOutDate <= today) {
        const element = document.getElementById('moveOutDate')
        if (element) {
          element.focus()
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
        alert('退去予定日必须晚于今天，请选择未来的日期')
        return
      }
    }

    // 验证立会希望日時（不能选择今天，必须选择明天及之后）
    if (formData.inspectionDateTime) {
      const inspectionDateTime = new Date(formData.inspectionDateTime)
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0) // 设置为明天的00:00:00
      
      if (inspectionDateTime < tomorrow) {
        const element = document.getElementById('inspectionDateTime')
        if (element) {
          element.focus()
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
        alert('立会希望日時不能选择今天，请选择明天及之后的日期和时间')
        return
      }
    }

    // 验证电话号码位数
    const phoneNumberDigits = formData.phoneNumber.replace(/\D/g, '') // 只保留数字
    const countryCode = formData.phoneCountryCode
    
    // 根据国家区号验证电话号码位数
    const phoneValidationRules: Record<string, { min: number; max: number; example: string }> = {
      '+81': { min: 10, max: 11, example: '09012345678' }, // 日本
      '+86': { min: 11, max: 11, example: '13800138000' }, // 中国
      '+1': { min: 10, max: 10, example: '1234567890' }, // 美国/加拿大
      '+44': { min: 10, max: 11, example: '2012345678' }, // 英国
      '+61': { min: 9, max: 10, example: '412345678' }, // 澳大利亚
      '+82': { min: 9, max: 11, example: '1012345678' }, // 韩国
      '+65': { min: 8, max: 8, example: '12345678' }, // 新加坡
      '+852': { min: 8, max: 8, example: '12345678' }, // 香港
      '+886': { min: 9, max: 10, example: '912345678' }, // 台湾
      '+33': { min: 9, max: 9, example: '123456789' }, // 法国
      '+49': { min: 10, max: 11, example: '1512345678' }, // 德国
      '+39': { min: 9, max: 10, example: '312345678' }, // 意大利
      '+34': { min: 9, max: 9, example: '612345678' }, // 西班牙
      '+7': { min: 10, max: 10, example: '9123456789' }, // 俄罗斯
      '+91': { min: 10, max: 10, example: '1234567890' }, // 印度
      '+55': { min: 10, max: 11, example: '11987654321' }, // 巴西
      '+52': { min: 10, max: 10, example: '5512345678' }, // 墨西哥
    }

    const rule = phoneValidationRules[countryCode]
    if (rule) {
      if (phoneNumberDigits.length < rule.min || phoneNumberDigits.length > rule.max) {
        const phoneInput = document.getElementById('phoneNumber')
        if (phoneInput) {
          phoneInput.focus()
          phoneInput.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
        const countryName = countryCode === '+81' ? '日本' : countryCode === '+86' ? '中国' : countryCode === '+1' ? '美国/加拿大' : '该国家'
        alert(`电话号码位数不正确。${countryName}电话号码应为${rule.min}${rule.min !== rule.max ? `-${rule.max}` : ''}位数字。\n示例：${rule.example}`)
        return
      }
    } else {
      // 对于未定义的国家，至少要求8位数字
      if (phoneNumberDigits.length < 8) {
        const phoneInput = document.getElementById('phoneNumber')
        if (phoneInput) {
          phoneInput.focus()
          phoneInput.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
        alert('电话号码位数不正确，请输入至少8位数字')
        return
      }
    }

    // 签名默认使用契約者名（点击发送即视为已签名）
    const dataToSave = {
      ...formData,
      signerName: formData.contractHolder,
    }

    // 将表单数据保存到 sessionStorage，然后跳转到预览页面
    sessionStorage.setItem('terminationFormData', JSON.stringify(dataToSave))
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
            <p className="text-sm text-yellow-200 font-semibold mb-4">
              Tenant Support
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              退租解约申请
            </h1>
            <p className="text-lg text-gray-100 max-w-3xl leading-relaxed whitespace-pre-line">
              {HERO_DESCRIPTION}
            </p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom grid grid-cols-1 lg:grid-cols-3 gap-10">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-8 lg:col-span-2"
            >
              {/* 物件信息 */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  一、物件信息
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-2"
                      htmlFor="propertyName"
                    >
                      物件名
                    </label>
                    <input
                      id="propertyName"
                      name="propertyName"
                      value={formData.propertyName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                      placeholder="例：ボーンマーク日本橋人形町"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-2"
                      htmlFor="roomNumber"
                    >
                      部屋番号
                    </label>
                    <input
                      id="roomNumber"
                      name="roomNumber"
                      value={formData.roomNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                      placeholder="例：502"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor="propertyAddress"
                  >
                    物件所在地
                  </label>
                  <input
                    id="propertyAddress"
                    name="propertyAddress"
                    value={formData.propertyAddress}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                    placeholder="请输入物件的完整地址（用于写入日文解约通知书）"
                  />
                </div>

                <div className="mt-5">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor="contractHolder"
                  >
                    契約者名
                  </label>
                  <input
                    id="contractHolder"
                    name="contractHolder"
                    value={formData.contractHolder}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                    placeholder="请填写与租赁合同一致的姓名"
                  />
                </div>
              </div>

              {/* 解约 / 退去日 / 立会 */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  二、日程安排
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-2"
                      htmlFor="cancelDate"
                    >
                      解约日
                    </label>
                    <input
                      id="cancelDate"
                      name="cancelDate"
                      type="date"
                      value={formData.cancelDate}
                      onChange={handleChange}
                      min={getTodayMinDate()}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-2"
                      htmlFor="moveOutDate"
                    >
                      退去予定日
                    </label>
                    <input
                      id="moveOutDate"
                      name="moveOutDate"
                      type="date"
                      value={formData.moveOutDate}
                      onChange={handleChange}
                      min={getTodayMinDate()}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mt-5">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor="inspectionDateTime"
                  >
                    立会希望日時
                    <br />
                    <span className="text-xs font-normal">※解約日まで</span>
                  </label>
                  <input
                    id="inspectionDateTime"
                    name="inspectionDateTime"
                    type="datetime-local"
                    value={formData.inspectionDateTime}
                    onChange={handleChange}
                    min={getTodayMinDateTime()}
                    className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    物业会根据您的希望时间与您确认最终的退房立会时间。
                  </p>
                </div>
              </div>

              {/* 设施使用情况 */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  三、设施使用情况
                </h2>

                {/* 使用駐輪場 */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    使用駐輪場
                  </p>
                  <div className="flex gap-4">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="bicycleParking"
                        value="有"
                        checked={formData.bicycleParking === '有'}
                        onChange={handleChange}
                      />
                      <span>有</span>
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="bicycleParking"
                        value="無"
                        checked={formData.bicycleParking === '無'}
                        onChange={handleChange}
                      />
                      <span>無</span>
                    </label>
                  </div>
                </div>

                {/* メールボックスの開け方 */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    メールボックスの開け方
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    请参考现有邮箱锁的设置：（左 / 右）〇回 〇番 × 2 组。
                  </p>
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="text-gray-600">第1组：</span>
                      <select
                        name="mailbox1Direction"
                        value={formData.mailbox1Direction}
                        onChange={handleChange}
                        className="border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="左">左</option>
                        <option value="右">右</option>
                      </select>
                      <span>方向</span>
                      <input
                        name="mailbox1Turns"
                        value={formData.mailbox1Turns}
                        onChange={handleChange}
                        className="w-16 px-2 py-1 border border-gray-300 rounded"
                        placeholder="回数"
                      />
                      <span>回</span>
                      <input
                        name="mailbox1Number"
                        value={formData.mailbox1Number}
                        onChange={handleChange}
                        className="w-20 px-2 py-1 border border-gray-300 rounded"
                        placeholder="番号"
                      />
                      <span>番</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="text-gray-600">第2组：</span>
                      <select
                        name="mailbox2Direction"
                        value={formData.mailbox2Direction}
                        onChange={handleChange}
                        className="border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="左">左</option>
                        <option value="右">右</option>
                      </select>
                      <span>方向</span>
                      <input
                        name="mailbox2Turns"
                        value={formData.mailbox2Turns}
                        onChange={handleChange}
                        className="w-16 px-2 py-1 border border-gray-300 rounded"
                        placeholder="回数"
                      />
                      <span>回</span>
                      <input
                        name="mailbox2Number"
                        value={formData.mailbox2Number}
                        onChange={handleChange}
                        className="w-20 px-2 py-1 border border-gray-300 rounded"
                        placeholder="番号"
                      />
                      <span>番</span>
                    </div>
                  </div>
                </div>

                {/* 使用駐車場 */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    使用駐車場
                  </p>
                  <div className="flex gap-4">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="carParking"
                        value="有"
                        checked={formData.carParking === '有'}
                        onChange={handleChange}
                      />
                      <span>有</span>
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="carParking"
                        value="無"
                        checked={formData.carParking === '無'}
                        onChange={handleChange}
                      />
                      <span>無</span>
                    </label>
                  </div>
                </div>

                {/* オートロック */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    オートロック
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex gap-4">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="radio"
                          name="autoLock"
                          value="有"
                          checked={formData.autoLock === '有'}
                          onChange={handleChange}
                        />
                        <span>有</span>
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="radio"
                          name="autoLock"
                          value="無"
                          checked={formData.autoLock === '無'}
                          onChange={(e) => {
                            // 选 无 时清空类型和密码
                            handleChange(e)
                            setFormData((prev) => ({
                              ...prev,
                              autoLockKeyType: '',
                              autoLockDial: '',
                            }))
                          }}
                        />
                        <span>無</span>
                      </label>
                    </div>

                    {formData.autoLock === '有' && (
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-gray-600">类型：</span>
                        <label className="inline-flex items-center gap-1">
                          <input
                            type="radio"
                            name="autoLockKeyType"
                            value="鍵式"
                            checked={formData.autoLockKeyType === '鍵式'}
                            onChange={handleChange}
                          />
                          <span>鍵式</span>
                        </label>
                        <label className="inline-flex items-center gap-1">
                          <input
                            type="radio"
                            name="autoLockKeyType"
                            value="ダイヤル"
                            checked={formData.autoLockKeyType === 'ダイヤル'}
                            onChange={handleChange}
                          />
                          <span>ダイヤル</span>
                        </label>
                        {formData.autoLockKeyType === 'ダイヤル' && (
                          <>
                            <span>番号：</span>
                            <input
                              name="autoLockDial"
                              value={formData.autoLockDial}
                              onChange={handleChange}
                              className="w-32 px-2 py-1 border border-gray-300 rounded"
                              placeholder="请填写当前设置的号码"
                            />
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* 使用バイク置場 */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    使用バイク置場
                  </p>
                  <div className="flex gap-4">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="bikeSpace"
                        value="有"
                        checked={formData.bikeSpace === '有'}
                        onChange={handleChange}
                      />
                      <span>有</span>
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="bikeSpace"
                        value="無"
                        checked={formData.bikeSpace === '無'}
                        onChange={handleChange}
                      />
                      <span>無</span>
                    </label>
                  </div>
                </div>

                {/* 宅配ボックス */}
                <div className="mb-2">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    宅配ボックス
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex gap-4">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="radio"
                          name="deliveryBox"
                          value="有"
                          checked={formData.deliveryBox === '有'}
                          onChange={handleChange}
                        />
                        <span>有</span>
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="radio"
                          name="deliveryBox"
                          value="無"
                          checked={formData.deliveryBox === '無'}
                          onChange={(e) => {
                            handleChange(e)
                            setFormData((prev) => ({
                              ...prev,
                              deliveryBoxType: '',
                              deliveryBoxNumber: '',
                            }))
                          }}
                        />
                        <span>無</span>
                      </label>
                    </div>
                    {formData.deliveryBox === '有' && (
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-gray-600">类型：</span>
                        <label className="inline-flex items-center gap-1">
                          <input
                            type="radio"
                            name="deliveryBoxType"
                            value="鍵式"
                            checked={formData.deliveryBoxType === '鍵式'}
                            onChange={handleChange}
                          />
                          <span>鍵式</span>
                        </label>
                        <label className="inline-flex items-center gap-1">
                          <input
                            type="radio"
                            name="deliveryBoxType"
                            value="カード式"
                            checked={formData.deliveryBoxType === 'カード式'}
                            onChange={handleChange}
                          />
                          <span>カード式</span>
                        </label>
                        <span>编号：</span>
                        <input
                          name="deliveryBoxNumber"
                          value={formData.deliveryBoxNumber}
                          onChange={handleChange}
                          className="w-32 px-2 py-1 border border-gray-300 rounded"
                          placeholder="快递柜号码"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 返金口座 */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  四、返金账户
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      銀行
                    </label>
                    <input
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                      placeholder="例：三菱UFJ銀行"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      支店
                    </label>
                    <input
                      name="bankBranch"
                      value={formData.bankBranch}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                      placeholder="请输入支店名称"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      口座種別
                    </label>
                    <input
                      name="accountType"
                      list="accountTypeOptions"
                      value={formData.accountType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                      placeholder="请选择或输入账户类型"
                    />
                    <datalist id="accountTypeOptions">
                      <option value="普通" />
                      <option value="当座" />
                      <option value="貯蓄" />
                      <option value="外貨" />
                    </datalist>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      口座番号
                    </label>
                    <input
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                      placeholder="请输入账号"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    名義人
                  </label>
                  <input
                    name="accountHolder"
                    value={formData.accountHolder}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                    placeholder="请输入账户名义（全角カタカナ或与银行登记一致的姓名）"
                  />
                </div>
              </div>

              {/* 解约理由 & 转居先 */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  五、解约理由 & 转居信息
                </h2>

                {/* 解約理由（复选框） */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    解約理由
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="reason"
                        value="進学"
                        checked={formData.reason === '進学'}
                        onChange={handleChange}
                        required
                      />
                      <span>進学</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="reason"
                        value="就職"
                        checked={formData.reason === '就職'}
                        onChange={handleChange}
                      />
                      <span>就職</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="reason"
                        value="転勤"
                        checked={formData.reason === '転勤'}
                        onChange={handleChange}
                      />
                      <span>転勤</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="reason"
                        value="自宅購入"
                        checked={formData.reason === '自宅購入'}
                        onChange={handleChange}
                      />
                      <span>自宅購入</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="reason"
                        value="帰国"
                        checked={formData.reason === '帰国'}
                        onChange={handleChange}
                      />
                      <span>帰国</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="reason"
                        value="家賃金額"
                        checked={formData.reason === '家賃金額'}
                        onChange={handleChange}
                      />
                      <span>家賃金額</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="reason"
                        value="契約期間満了"
                        checked={formData.reason === '契約期間満了'}
                        onChange={handleChange}
                      />
                      <span>契約期間満了</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="reason"
                        value="その他"
                        checked={formData.reason === 'その他'}
                        onChange={handleChange}
                      />
                      <span>その他</span>
                    </label>
                  </div>
                  {formData.reason === 'その他' && (
                    <div className="mt-3">
                      <textarea
                        name="reasonOtherText"
                        value={formData.reasonOtherText}
                        onChange={handleChange}
                        rows={2}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent text-sm"
                        placeholder="请输入其它具体理由"
                      />
                    </div>
                  )}
                </div>

                {/* 转居先 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    転居先住所
                  </label>
                  <input
                    name="newAddress"
                    value={formData.newAddress}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                    placeholder="如未定可暂时填写「未定」，但需在退房立会时告知"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    ※ 如未定，请在解约立会时务必告知。
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    建物名・号室
                  </label>
                  <input
                    name="newBuildingAndRoom"
                    value={formData.newBuildingAndRoom}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                    placeholder="例：〇〇マンション 101号室"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    电话
                  </label>
                  <div className="flex gap-2">
                    <select
                      id="phoneCountryCode"
                      name="phoneCountryCode"
                      value={formData.phoneCountryCode}
                      onChange={handleChange}
                      className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent bg-white"
                    >
                      <option value="+81">🇯🇵 +81 (日本)</option>
                      <option value="+86">🇨🇳 +86 (中国)</option>
                      <option value="+1">🇺🇸 +1 (美国/加拿大)</option>
                      <option value="+44">🇬🇧 +44 (英国)</option>
                      <option value="+61">🇦🇺 +61 (澳大利亚)</option>
                      <option value="+82">🇰🇷 +82 (韩国)</option>
                      <option value="+65">🇸🇬 +65 (新加坡)</option>
                      <option value="+852">🇭🇰 +852 (香港)</option>
                      <option value="+886">🇹🇼 +886 (台湾)</option>
                      <option value="+33">🇫🇷 +33 (法国)</option>
                      <option value="+49">🇩🇪 +49 (德国)</option>
                      <option value="+39">🇮🇹 +39 (意大利)</option>
                      <option value="+34">🇪🇸 +34 (西班牙)</option>
                      <option value="+7">🇷🇺 +7 (俄罗斯)</option>
                      <option value="+91">🇮🇳 +91 (印度)</option>
                      <option value="+55">🇧🇷 +55 (巴西)</option>
                      <option value="+52">🇲🇽 +52 (墨西哥)</option>
                      <option value="+81">其他</option>
                    </select>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                      placeholder="请输入电话号码（不含区号）"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.phoneCountryCode === '+81' && '日本电话号码格式：10-11位数字（例：09012345678）'}
                    {formData.phoneCountryCode === '+86' && '中国电话号码格式：11位数字（例：13800138000）'}
                    {formData.phoneCountryCode === '+1' && '美国/加拿大电话号码格式：10位数字（例：1234567890）'}
                    {formData.phoneCountryCode === '+44' && '英国电话号码格式：10-11位数字'}
                    {formData.phoneCountryCode === '+61' && '澳大利亚电话号码格式：9-10位数字'}
                    {formData.phoneCountryCode === '+82' && '韩国电话号码格式：9-11位数字'}
                    {formData.phoneCountryCode === '+65' && '新加坡电话号码格式：8位数字'}
                    {formData.phoneCountryCode === '+852' && '香港电话号码格式：8位数字'}
                    {formData.phoneCountryCode === '+886' && '台湾电话号码格式：9-10位数字'}
                    {!['+81', '+86', '+1', '+44', '+61', '+82', '+65', '+852', '+886'].includes(formData.phoneCountryCode) && '请输入正确的电话号码'}
                  </p>
                </div>

              </div>

              {/* 按钮 */}
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between pt-2">
                <button
                  type="submit"
                  className="btn-primary w-full sm:w-auto px-8 py-3"
                >
                  提交预览
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full sm:w-auto px-8 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition"
                >
                  重置表单
                </button>
              </div>

              <p className="text-sm text-gray-500">
                提交后，将进入内容确认页面。确认无误后系统会生成日文PDF（解約通知書）并发送到管理公司指定邮箱。
              </p>
            </form>

            {/* 右侧说明区域保持原样，只略微调整了一点文案 */}
            <aside className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-navy-700 mb-2">
                  解约表格下载
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  您也可以下载官方日文表格，手写填写后传真或邮寄。
                </p>
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
                  <li>
                    2.
                    搬离时请勿在室内、阳台、走廊等区域留下垃圾或废弃物。大件垃圾请咨询区役所处理方法，若有残留将收取处理费用。
                  </li>
                  <li>
                    3.
                    若保险或水电等仍需继续使用，请联系保单所载保险公司办理地址变更；如需解约，请自行致电完成手续。
                  </li>
                  <li>
                    4.
                    若因个人原因无法在解约日前完成退房或现场确认，可能产生续约费用，请务必注意时间安排。
                  </li>
                  <li>
                    5.
                    退房现场确认的日期将由专员稍后电话联系，如需变更请直接与其沟通，现场确认当日请务必准时。
                  </li>
                  <li>
                    6.
                    对于退房时因故意、过失或不当使用造成的损耗与损伤，相关复原费用需由承租人承担。
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
