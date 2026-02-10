'use client'

import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react'
import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import SignaturePad from '@/components/SignaturePad'
import { HelpCircle } from 'lucide-react'
import { looksLikeJapaneseKaiyakuData, convertFromJapaneseToInternal, type KaiyakuInternalForm } from '@/lib/kaiyakuConvertClient'

// 下载用 PDF（需放在 public/ 下才能被网页访问）
const KAIYAKU_FORM_URL = '/imgs/解約通知書.pdf'

// 这里的字段结构要和我们生成 PDF 时用的一致（内部值：语言无关）
// emailConfirm 仅用于前端校验，不提交到 API、不写入 sessionStorage
type TerminationForm = KaiyakuInternalForm & { emailConfirm?: string }

const initialForm: TerminationForm = {
  propertyName: '',
  roomNumber: '',
  propertyAddress: '',
  contractHolder: '',
  cancelDate: '',
  moveOutDate: '',
  inspectionDateTime: '',

  bicycleParking: 'no',

  mailbox1Direction: 'left',
  mailbox1Turns: '',
  mailbox1Number: '',
  mailbox2Direction: 'left',
  mailbox2Turns: '',
  mailbox2Number: '',

  carParking: 'no',

  autoLock: 'no',
  autoLockKeyType: '',
  autoLockDial: '',

  bikeSpace: 'no',

  deliveryBox: 'no',
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
  email: '',
  emailConfirm: '',
  signatureDataUrl: '',

  signerName: '',
}

// NOTE: 已改为“预览页按当前语言显示”，这里只在读取旧缓存（曾保存为日文）时做兼容转换

export default function TenantTerminationPage() {
  const { t, language } = useLanguage()
  const [formData, setFormData] = useState<TerminationForm>(initialForm)
  const [isMounted, setIsMounted] = useState(false)
  const [signatureMissing, setSignatureMissing] = useState(false)
  const [helpKey, setHelpKey] = useState<null | 'cancelDate' | 'moveOutDate' | 'inspectionDateTime'>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

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
        if (looksLikeJapaneseKaiyakuData(parsed)) {
          setFormData(convertFromJapaneseToInternal(parsed))
        } else {
          setFormData(parsed)
        }
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
    // Clear any previous custom validity message (so browser tooltip feels "normal")
    ;(event.target as any)?.setCustomValidity?.('')

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

    const showInvalid = (
      el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null,
      message: string
    ) => {
      if (!el) return
      // Do NOT clear immediately after reportValidity().
      // Some browsers will fall back to their default message if we clear too fast.
      // We clear the message on user input change in handleChange().
      el.setCustomValidity(message)
      el.reportValidity()
      el.focus()
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

    // 验证所有必填字段
    const requiredFields = [
      { name: 'propertyName', id: 'propertyName', label: t('tenant.kaiyaku.fields.propertyName') },
      { name: 'roomNumber', id: 'roomNumber', label: t('tenant.kaiyaku.fields.roomNumber') },
      { name: 'propertyAddress', id: 'propertyAddress', label: t('tenant.kaiyaku.fields.propertyAddress') },
      { name: 'contractHolder', id: 'contractHolder', label: t('tenant.kaiyaku.fields.contractHolder') },
      { name: 'cancelDate', id: 'cancelDate', label: t('tenant.kaiyaku.fields.cancelDate') },
      { name: 'moveOutDate', id: 'moveOutDate', label: t('tenant.kaiyaku.fields.moveOutDate') },
      { name: 'inspectionDateTime', id: 'inspectionDateTime', label: t('tenant.kaiyaku.fields.inspectionDateTime') },
      { name: 'bankName', id: 'bankName', label: t('tenant.kaiyaku.fields.bankName') },
      { name: 'bankBranch', id: 'bankBranch', label: t('tenant.kaiyaku.fields.bankBranch') },
      { name: 'accountType', id: 'accountType', label: t('tenant.kaiyaku.fields.accountType') },
      { name: 'accountNumber', id: 'accountNumber', label: t('tenant.kaiyaku.fields.accountNumber') },
      { name: 'accountHolder', id: 'accountHolder', label: t('tenant.kaiyaku.fields.accountHolder') },
      { name: 'reason', id: 'reason', label: t('tenant.kaiyaku.fields.reason'), isRadio: true },
      { name: 'phoneNumber', id: 'phoneNumber', label: t('tenant.kaiyaku.fields.phoneNumber') },
      { name: 'email', id: 'email', label: t('tenant.kaiyaku.fields.email') },
      { name: 'signatureDataUrl', id: 'signaturePad', label: t('tenant.kaiyaku.fields.signature') },
    ]

    // 检查每个必填字段
    for (const field of requiredFields) {
      let value: any = formData[field.name as keyof TerminationForm]
      
      // 如果是radio组，检查reason字段
      if (field.isRadio) {
        if (!formData.reason) {
          const firstRadio = document.querySelector('input[name="reason"]') as HTMLInputElement
          showInvalid(
            firstRadio,
            t('tenant.kaiyaku.validation.pleaseSelect', { field: field.label })
          )
          return
        }
      } else {
        // 检查普通字段
        if (!value || (typeof value === 'string' && !value.trim())) {
          if (field.name === 'signatureDataUrl') {
            setSignatureMissing(true)
            const sig = document.getElementById('signaturePad')
            sig?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          } else {
            const element = document.getElementById(field.id) as
              | HTMLInputElement
              | HTMLSelectElement
              | HTMLTextAreaElement
              | null
            showInvalid(
              element,
              t('tenant.kaiyaku.validation.pleaseFill', { field: field.label })
            )
          }
          return
        }
      }
    }

    // 验证：两次邮箱必须一致
    const emailConfirmValue = (formData as TerminationForm).emailConfirm ?? ''
    if (formData.email.trim() !== emailConfirmValue.trim()) {
      const el = document.getElementById('emailConfirm') as HTMLInputElement | null
      showInvalid(el, t('tenant.kaiyaku.validation.emailMismatch'))
      return
    }

    // 验证：如果选择"その他"，必须填写具体理由
    if (formData.reason === 'other' && !formData.reasonOtherText.trim()) {
      const textarea = document.querySelector('textarea[name="reasonOtherText"]') as HTMLTextAreaElement
      showInvalid(textarea, t('tenant.kaiyaku.validation.pleaseFillOtherReason'))
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
        const element = document.getElementById('cancelDate') as HTMLInputElement | null
        showInvalid(element, t('tenant.kaiyaku.validation.cancelDateMustBeFuture'))
        return
      }
    }

    // 验证退去予定日
    if (formData.moveOutDate) {
      const moveOutDate = new Date(formData.moveOutDate)
      moveOutDate.setHours(0, 0, 0, 0)
      if (moveOutDate <= today) {
        const element = document.getElementById('moveOutDate') as HTMLInputElement | null
        showInvalid(element, t('tenant.kaiyaku.validation.moveOutDateMustBeFuture'))
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
        const element = document.getElementById('inspectionDateTime') as HTMLInputElement | null
        showInvalid(element, t('tenant.kaiyaku.validation.inspectionDateTimeMustBeFuture'))
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
        const phoneInput = document.getElementById('phoneNumber') as HTMLInputElement | null
        const countryName = countryCode === '+81' ? t('tenant.kaiyaku.phoneFormat.countries.japan') : 
                           countryCode === '+86' ? t('tenant.kaiyaku.phoneFormat.countries.china') : 
                           countryCode === '+1' ? t('tenant.kaiyaku.phoneFormat.countries.usCanada') : 
                           t('tenant.kaiyaku.phoneFormat.countries.other')
        showInvalid(phoneInput, t('tenant.kaiyaku.validation.phoneDigits', { 
          country: countryName, 
          min: rule.min, 
          max: rule.max !== rule.min ? `-${rule.max}` : '',
          example: rule.example 
        }))
        return
      }
    } else {
      // 对于未定义的国家，至少要求8位数字
      if (phoneNumberDigits.length < 8) {
        const phoneInput = document.getElementById('phoneNumber') as HTMLInputElement | null
        showInvalid(phoneInput, t('tenant.kaiyaku.validation.phoneMinDigits'))
        return
      }
    }

    // 预览页按当前语言展示，因此这里保存“内部值”（语言无关）；不保存 emailConfirm（仅前端校验用）
    const { emailConfirm: _ec, ...toStore } = formData as TerminationForm
    sessionStorage.setItem(
      'terminationFormData',
      JSON.stringify({
        ...toStore,
        signerName: formData.contractHolder,
      })
    )
    window.location.href = '/tenant/kaiyaku/preview'
  }

  const resetForm = () => {
    setFormData(initialForm)
  }

  return (
    <PageLayout>
      {/* 解约/退房/立会 说明弹窗 */}
      {helpKey && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50"
          onClick={() => setHelpKey(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-5 md:p-6 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm md:text-base text-gray-800 whitespace-pre-line leading-relaxed">
              {t(`tenant.kaiyaku.help.${helpKey}`)}
            </p>
            <button
              type="button"
              onClick={() => setHelpKey(null)}
              className="mt-4 w-full py-2.5 rounded-lg bg-navy-600 text-white font-medium hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-400"
            >
              {t('tenant.kaiyaku.help.close')}
            </button>
          </div>
        </div>
      )}
      <div className="bg-gray-50 min-h-screen">
        <section className="relative pt-20 md:pt-28 pb-8 md:pb-16 bg-gradient-to-br from-red-700 via-orange-600 to-yellow-500 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt={t('tenant.kaiyaku.title')}
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/70 to-orange-900/60"></div>
          </div>
          <div className="relative z-10 container-custom px-4">
            <p className="text-sm text-yellow-200 font-semibold mb-2 md:mb-4">
              {t('tenant.kaiyaku.subtitle')}
            </p>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-6">
              {t('tenant.kaiyaku.title')}
            </h1>
            <p className="text-base md:text-lg text-gray-100 max-w-3xl leading-relaxed whitespace-pre-line">
              {t('tenant.kaiyaku.description')}
            </p>
          </div>
        </section>

        <section className="py-4 md:py-16 px-2 md:px-4">
          <div className="max-w-7xl mx-auto px-2 md:px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-10">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-3 md:p-8 space-y-4 md:space-y-8 lg:col-span-2"
              suppressHydrationWarning
              noValidate
            >
              {/* 物件信息 */}
              <div>
                <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-2 md:mb-4">
                  {t('tenant.kaiyaku.sections.propertyInfo')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1 md:mb-2"
                      htmlFor="propertyName"
                    >
                      {t('tenant.kaiyaku.fields.propertyName')}
                    </label>
                    <input
                      id="propertyName"
                      name="propertyName"
                      value={formData.propertyName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                      placeholder={t('tenant.kaiyaku.placeholders.propertyName')}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1 md:mb-2"
                      htmlFor="roomNumber"
                    >
                      {t('tenant.kaiyaku.fields.roomNumber')}
                    </label>
                    <input
                      id="roomNumber"
                      name="roomNumber"
                      value={formData.roomNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                      placeholder={t('tenant.kaiyaku.placeholders.roomNumber')}
                    />
                  </div>
                </div>

                <div className="mt-3 md:mt-5">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1 md:mb-2"
                    htmlFor="propertyAddress"
                  >
                    {t('tenant.kaiyaku.fields.propertyAddress')}
                  </label>
                  <input
                    id="propertyAddress"
                    name="propertyAddress"
                    value={formData.propertyAddress}
                    onChange={handleChange}
                    required
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                    placeholder={t('tenant.kaiyaku.placeholders.propertyAddress')}
                  />
                </div>

                <div className="mt-3 md:mt-5">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1 md:mb-2"
                    htmlFor="contractHolder"
                  >
                    {t('tenant.kaiyaku.fields.contractHolder')}
                  </label>
                  <input
                    id="contractHolder"
                    name="contractHolder"
                    value={formData.contractHolder}
                    onChange={handleChange}
                    required
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                    placeholder={t('tenant.kaiyaku.placeholders.contractHolder')}
                  />
                </div>
              </div>

              {/* 解约 / 退去日 / 立会 */}
              <div>
                <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-2 md:mb-4">
                  {t('tenant.kaiyaku.sections.schedule')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1 md:mb-2 flex items-center gap-1"
                      htmlFor="cancelDate"
                    >
                      {t('tenant.kaiyaku.fields.cancelDate')}
                      <button
                        type="button"
                        onClick={() => setHelpKey('cancelDate')}
                        className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-gray-400 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-navy-400"
                        aria-label={t('tenant.kaiyaku.help.ariaLabel')}
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                    </label>
                    <input
                      id="cancelDate"
                      name="cancelDate"
                      type="date"
                      value={formData.cancelDate}
                      onChange={handleChange}
                      min={getTodayMinDate()}
                      required
                      className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1 md:mb-2 flex items-center gap-1"
                      htmlFor="moveOutDate"
                    >
                      {t('tenant.kaiyaku.fields.moveOutDate')}
                      <button
                        type="button"
                        onClick={() => setHelpKey('moveOutDate')}
                        className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-gray-400 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-navy-400"
                        aria-label={t('tenant.kaiyaku.help.ariaLabel')}
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                    </label>
                    <input
                      id="moveOutDate"
                      name="moveOutDate"
                      type="date"
                      value={formData.moveOutDate}
                      onChange={handleChange}
                      min={getTodayMinDate()}
                      required
                      className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mt-3 md:mt-5">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1 md:mb-2"
                    htmlFor="inspectionDateTime"
                  >
                    <span className="inline-flex items-center gap-1">
                      {t('tenant.kaiyaku.fields.inspectionDateTime')}
                      <button
                        type="button"
                        onClick={() => setHelpKey('inspectionDateTime')}
                        className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-gray-400 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-navy-400"
                        aria-label={t('tenant.kaiyaku.help.ariaLabel')}
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                    </span>
                    <br />
                    <span className="text-xs font-normal">{t('tenant.kaiyaku.notes.inspectionDateTime')}</span>
                  </label>
                  <input
                    id="inspectionDateTime"
                    name="inspectionDateTime"
                    type="datetime-local"
                    value={formData.inspectionDateTime}
                    onChange={handleChange}
                    min={getTodayMinDateTime()}
                    className="w-full max-w-md px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* 设施使用情况 */}
              <div>
                <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-2 md:mb-4">
                  {t('tenant.kaiyaku.sections.facilities')}
                </h2>

                {/* 使用駐輪場 */}
                <div className="mb-3 md:mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    {t('tenant.kaiyaku.labels.bicycleParking')}
                  </p>
                  <div className="flex gap-4">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="bicycleParking"
                        value="yes"
                        checked={formData.bicycleParking === 'yes'}
                        onChange={handleChange}
                      />
                      <span>{t('tenant.kaiyaku.options.yes')}</span>
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="bicycleParking"
                        value="no"
                        checked={formData.bicycleParking === 'no'}
                        onChange={handleChange}
                      />
                      <span>{t('tenant.kaiyaku.options.no')}</span>
                    </label>
                  </div>
                </div>

                {/* メールボックスの開け方 */}
                <div className="mb-3 md:mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    {t('tenant.kaiyaku.labels.mailbox')}
                  </p>
                  <p className="text-xs text-gray-500 mb-1 md:mb-2">
                    {t('tenant.kaiyaku.labels.mailboxNote')}
                  </p>
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="text-gray-600">{t('tenant.kaiyaku.labels.mailboxGroup1')}</span>
                      <select
                        name="mailbox1Direction"
                        value={formData.mailbox1Direction}
                        onChange={handleChange}
                        className="border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="left">{t('tenant.kaiyaku.options.left')}</option>
                        <option value="right">{t('tenant.kaiyaku.options.right')}</option>
                      </select>
                      <span>{t('tenant.kaiyaku.labels.direction')}</span>
                      <input
                        name="mailbox1Turns"
                        value={formData.mailbox1Turns}
                        onChange={handleChange}
                        className="w-16 px-2 py-1 border border-gray-300 rounded"
                        placeholder={t('tenant.kaiyaku.labels.turnsPlaceholder')}
                      />
                      <span>{t('tenant.kaiyaku.labels.turns')}</span>
                      <input
                        name="mailbox1Number"
                        value={formData.mailbox1Number}
                        onChange={handleChange}
                        className="w-20 px-2 py-1 border border-gray-300 rounded"
                        placeholder={t('tenant.kaiyaku.labels.numberPlaceholder')}
                      />
                      <span>{t('tenant.kaiyaku.labels.number')}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="text-gray-600">{t('tenant.kaiyaku.labels.mailboxGroup2')}</span>
                      <select
                        name="mailbox2Direction"
                        value={formData.mailbox2Direction}
                        onChange={handleChange}
                        className="border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="left">{t('tenant.kaiyaku.options.left')}</option>
                        <option value="right">{t('tenant.kaiyaku.options.right')}</option>
                      </select>
                      <span>{t('tenant.kaiyaku.labels.direction')}</span>
                      <input
                        name="mailbox2Turns"
                        value={formData.mailbox2Turns}
                        onChange={handleChange}
                        className="w-16 px-2 py-1 border border-gray-300 rounded"
                        placeholder={t('tenant.kaiyaku.labels.turnsPlaceholder')}
                      />
                      <span>{t('tenant.kaiyaku.labels.turns')}</span>
                      <input
                        name="mailbox2Number"
                        value={formData.mailbox2Number}
                        onChange={handleChange}
                        className="w-20 px-2 py-1 border border-gray-300 rounded"
                        placeholder={t('tenant.kaiyaku.labels.numberPlaceholder')}
                      />
                      <span>{t('tenant.kaiyaku.labels.number')}</span>
                    </div>
                  </div>
                </div>

                {/* 使用駐車場 */}
                <div className="mb-3 md:mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    {t('tenant.kaiyaku.labels.carParking')}
                  </p>
                  <div className="flex gap-3 md:gap-4">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="carParking"
                        value="yes"
                        checked={formData.carParking === 'yes'}
                        onChange={handleChange}
                      />
                      <span>{t('tenant.kaiyaku.options.yes')}</span>
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="carParking"
                        value="no"
                        checked={formData.carParking === 'no'}
                        onChange={handleChange}
                      />
                      <span>{t('tenant.kaiyaku.options.no')}</span>
                    </label>
                  </div>
                </div>

                {/* オートロック */}
                <div className="mb-3 md:mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    {t('tenant.kaiyaku.labels.autoLock')}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex gap-3 md:gap-4">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="radio"
                          name="autoLock"
                          value="yes"
                          checked={formData.autoLock === 'yes'}
                          onChange={handleChange}
                        />
                        <span>{t('tenant.kaiyaku.options.yes')}</span>
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="radio"
                          name="autoLock"
                          value="no"
                          checked={formData.autoLock === 'no'}
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
                        <span>{t('tenant.kaiyaku.options.no')}</span>
                      </label>
                    </div>

                    {formData.autoLock === 'yes' && (
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-gray-600">{t('tenant.kaiyaku.labels.autoLockType')}</span>
                        <label className="inline-flex items-center gap-1">
                          <input
                            type="radio"
                            name="autoLockKeyType"
                            value="keyType"
                            checked={formData.autoLockKeyType === 'keyType'}
                            onChange={handleChange}
                          />
                          <span>{t('tenant.kaiyaku.options.keyType')}</span>
                        </label>
                        <label className="inline-flex items-center gap-1">
                          <input
                            type="radio"
                            name="autoLockKeyType"
                            value="dial"
                            checked={formData.autoLockKeyType === 'dial'}
                            onChange={handleChange}
                          />
                          <span>{t('tenant.kaiyaku.options.dial')}</span>
                        </label>
                        {formData.autoLockKeyType === 'dial' && (
                          <>
                            <span>{t('tenant.kaiyaku.labels.autoLockNumber')}</span>
                            <input
                              name="autoLockDial"
                              value={formData.autoLockDial}
                              onChange={handleChange}
                              className="w-32 px-2 py-1 border border-gray-300 rounded"
                              placeholder={t('tenant.kaiyaku.placeholders.autoLockDial')}
                            />
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* 使用バイク置場 */}
                <div className="mb-3 md:mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    {t('tenant.kaiyaku.labels.bikeSpace')}
                  </p>
                  <div className="flex gap-3 md:gap-4">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="bikeSpace"
                        value="yes"
                        checked={formData.bikeSpace === 'yes'}
                        onChange={handleChange}
                      />
                      <span>{t('tenant.kaiyaku.options.yes')}</span>
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="bikeSpace"
                        value="no"
                        checked={formData.bikeSpace === 'no'}
                        onChange={handleChange}
                      />
                      <span>{t('tenant.kaiyaku.options.no')}</span>
                    </label>
                  </div>
                </div>

                {/* 宅配ボックス */}
                <div className="mb-2">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    {t('tenant.kaiyaku.labels.deliveryBox')}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex gap-4">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="radio"
                          name="deliveryBox"
                          value="yes"
                          checked={formData.deliveryBox === 'yes'}
                          onChange={handleChange}
                        />
                        <span>{t('tenant.kaiyaku.options.yes')}</span>
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="radio"
                          name="deliveryBox"
                          value="no"
                          checked={formData.deliveryBox === 'no'}
                          onChange={(e) => {
                            handleChange(e)
                            setFormData((prev) => ({
                              ...prev,
                              deliveryBoxType: '',
                              deliveryBoxNumber: '',
                            }))
                          }}
                        />
                        <span>{t('tenant.kaiyaku.options.no')}</span>
                      </label>
                    </div>
                    {formData.deliveryBox === 'yes' && (
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-gray-600">{t('tenant.kaiyaku.labels.deliveryBoxType')}</span>
                        <label className="inline-flex items-center gap-1">
                          <input
                            type="radio"
                            name="deliveryBoxType"
                            value="keyType"
                            checked={formData.deliveryBoxType === 'keyType'}
                            onChange={handleChange}
                          />
                          <span>{t('tenant.kaiyaku.options.keyType')}</span>
                        </label>
                        <label className="inline-flex items-center gap-1">
                          <input
                            type="radio"
                            name="deliveryBoxType"
                            value="cardType"
                            checked={formData.deliveryBoxType === 'cardType'}
                            onChange={handleChange}
                          />
                          <span>{t('tenant.kaiyaku.options.cardType')}</span>
                        </label>
                        <span>{t('tenant.kaiyaku.labels.deliveryBoxNumber')}</span>
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
                <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-2 md:mb-4">
                  {t('tenant.kaiyaku.sections.bankAccount')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                      {t('tenant.kaiyaku.fields.bankName')}
                    </label>
                    <input
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                      placeholder={t('tenant.kaiyaku.placeholders.bankName')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                      {t('tenant.kaiyaku.fields.bankBranch')}
                    </label>
                    <input
                      name="bankBranch"
                      value={formData.bankBranch}
                      onChange={handleChange}
                      required
                      className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                      placeholder={t('tenant.kaiyaku.placeholders.bankBranch')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 mt-3 md:mt-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                      {t('tenant.kaiyaku.fields.accountType')}
                    </label>
                    <input
                      name="accountType"
                      list="accountTypeOptions"
                      value={formData.accountType}
                      onChange={handleChange}
                      required
                      className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                      placeholder={t('tenant.kaiyaku.placeholders.accountType')}
                    />
                    <datalist id="accountTypeOptions">
                      {/* 避免 hydration mismatch：服务端/客户端首次渲染先保持一致（空列表），挂载后再根据语言填充 */}
                      {(isMounted
                        ? language === 'ja'
                          ? ['普通', '当座', '貯蓄', '外貨']
                          : language === 'en'
                          ? ['Savings', 'Checking', 'Deposit', 'Foreign currency']
                          : ['普通', '当座', '储蓄', '外币']
                        : []
                      ).map((v) => (
                        <option key={v} value={v} />
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                      {t('tenant.kaiyaku.fields.accountNumber')}
                    </label>
                    <input
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                      placeholder={t('tenant.kaiyaku.placeholders.accountNumber')}
                    />
                  </div>
                </div>

                <div className="mt-3 md:mt-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    {t('tenant.kaiyaku.fields.accountHolder')}
                  </label>
                  <input
                    name="accountHolder"
                    value={formData.accountHolder}
                    onChange={handleChange}
                    required
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                    placeholder={t('tenant.kaiyaku.placeholders.accountHolder')}
                  />
                </div>
              </div>

              {/* 解约理由 & 转居先 */}
              <div>
                <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-2 md:mb-4">
                  {t('tenant.kaiyaku.sections.reasonAndMove')}
                </h2>

                {/* 解約理由（复选框） */}
                <div className="mb-3 md:mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    {t('tenant.kaiyaku.labels.reason')}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="reason"
                        value="education"
                        checked={formData.reason === 'education'}
                        onChange={handleChange}
                        required
                      />
                      <span>{t('tenant.kaiyaku.reasons.進学')}</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="reason"
                        value="employment"
                        checked={formData.reason === 'employment'}
                        onChange={handleChange}
                      />
                      <span>{t('tenant.kaiyaku.reasons.就職')}</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="reason"
                        value="transfer"
                        checked={formData.reason === 'transfer'}
                        onChange={handleChange}
                      />
                      <span>{t('tenant.kaiyaku.reasons.転勤')}</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="reason"
                        value="homePurchase"
                        checked={formData.reason === 'homePurchase'}
                        onChange={handleChange}
                      />
                      <span>{t('tenant.kaiyaku.reasons.自宅購入')}</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="reason"
                        value="returnHome"
                        checked={formData.reason === 'returnHome'}
                        onChange={handleChange}
                      />
                      <span>{t('tenant.kaiyaku.reasons.帰国')}</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="reason"
                        value="rentAmount"
                        checked={formData.reason === 'rentAmount'}
                        onChange={handleChange}
                      />
                      <span>{t('tenant.kaiyaku.reasons.家賃金額')}</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="reason"
                        value="contractExpired"
                        checked={formData.reason === 'contractExpired'}
                        onChange={handleChange}
                      />
                      <span>{t('tenant.kaiyaku.reasons.契約期間満了')}</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="reason"
                        value="other"
                        checked={formData.reason === 'other'}
                        onChange={handleChange}
                      />
                      <span>{t('tenant.kaiyaku.reasons.その他')}</span>
                    </label>
                  </div>
                  {formData.reason === 'other' && (
                    <div className="mt-2 md:mt-3">
                      <textarea
                        name="reasonOtherText"
                        value={formData.reasonOtherText}
                        onChange={handleChange}
                        rows={2}
                        required
                        className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent text-sm"
                        placeholder={t('tenant.kaiyaku.placeholders.reasonOther')}
                      />
                    </div>
                  )}
                </div>

                {/* 转居先 */}
                <div className="mb-3 md:mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    {t('tenant.kaiyaku.labels.newAddress')}
                  </label>
                  <input
                    name="newAddress"
                    value={formData.newAddress}
                    onChange={handleChange}
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                    placeholder={t('tenant.kaiyaku.placeholders.newAddress')}
                  />
                  <p className="text-xs text-gray-500 mt-1 md:mt-2">
                    {t('tenant.kaiyaku.labels.newAddressNote')}
                  </p>
                </div>
                <div className="mb-3 md:mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    {t('tenant.kaiyaku.labels.newBuildingAndRoom')}
                  </label>
                  <input
                    name="newBuildingAndRoom"
                    value={formData.newBuildingAndRoom}
                    onChange={handleChange}
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                    placeholder={t('tenant.kaiyaku.placeholders.newBuildingAndRoom')}
                  />
                </div>

                <div className="mb-3 md:mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    {t('tenant.kaiyaku.labels.phone')}
                  </label>
                  <div className="flex gap-2 w-full">
                    <select
                      id="phoneCountryCode"
                      name="phoneCountryCode"
                      value={formData.phoneCountryCode}
                      onChange={handleChange}
                      className="px-2 md:px-3 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent bg-white text-sm md:text-base flex-shrink-0 min-w-0"
                      style={{ maxWidth: '45%' }}
                    >
                      <option value="+81">🇯🇵 +81 ({t('tenant.kaiyaku.phoneFormat.countries.japan')})</option>
                      <option value="+86">🇨🇳 +86 ({t('tenant.kaiyaku.phoneFormat.countries.china')})</option>
                      <option value="+1">🇺🇸 +1 ({t('tenant.kaiyaku.phoneFormat.countries.usCanada')})</option>
                      <option value="+44">🇬🇧 +44 ({t('tenant.kaiyaku.phoneFormat.countries.uk')})</option>
                      <option value="+61">🇦🇺 +61 ({t('tenant.kaiyaku.phoneFormat.countries.australia')})</option>
                      <option value="+82">🇰🇷 +82 ({t('tenant.kaiyaku.phoneFormat.countries.korea')})</option>
                      <option value="+65">🇸🇬 +65 ({t('tenant.kaiyaku.phoneFormat.countries.singapore')})</option>
                      <option value="+852">🇭🇰 +852 ({t('tenant.kaiyaku.phoneFormat.countries.hongkong')})</option>
                      <option value="+886">🇹🇼 +886 ({t('tenant.kaiyaku.phoneFormat.countries.taiwan')})</option>
                      <option value="+33">🇫🇷 +33 ({t('tenant.kaiyaku.phoneFormat.countries.france')})</option>
                      <option value="+49">🇩🇪 +49 ({t('tenant.kaiyaku.phoneFormat.countries.germany')})</option>
                      <option value="+39">🇮🇹 +39 ({t('tenant.kaiyaku.phoneFormat.countries.italy')})</option>
                      <option value="+34">🇪🇸 +34 ({t('tenant.kaiyaku.phoneFormat.countries.spain')})</option>
                      <option value="+7">🇷🇺 +7 ({t('tenant.kaiyaku.phoneFormat.countries.russia')})</option>
                      <option value="+91">🇮🇳 +91 ({t('tenant.kaiyaku.phoneFormat.countries.india')})</option>
                      <option value="+55">🇧🇷 +55 ({t('tenant.kaiyaku.phoneFormat.countries.brazil')})</option>
                      <option value="+52">🇲🇽 +52 ({t('tenant.kaiyaku.phoneFormat.countries.mexico')})</option>
                      <option value="+81">🇯🇵 +81 ({t('tenant.kaiyaku.phoneFormat.countries.japan')})</option>
                    </select>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                      className="flex-1 min-w-0 px-2 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent text-sm md:text-base"
                      placeholder={t('tenant.kaiyaku.placeholders.phoneNumber')}
                    />
                  </div>
                </div>

                <div className="mb-3 md:mb-4">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1 md:mb-2"
                    htmlFor="email"
                  >
                    {t('tenant.kaiyaku.fields.email')}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full max-w-md px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                    placeholder={t('tenant.kaiyaku.placeholders.email')}
                  />
                </div>

                <div className="mb-3 md:mb-4">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1 md:mb-2"
                    htmlFor="emailConfirm"
                  >
                    {t('tenant.kaiyaku.fields.emailConfirm')}
                  </label>
                  <input
                    id="emailConfirm"
                    name="emailConfirm"
                    type="email"
                    value={(formData as TerminationForm).emailConfirm ?? ''}
                    onChange={handleChange}
                    required
                    className="w-full max-w-md px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                    placeholder={t('tenant.kaiyaku.placeholders.emailConfirm')}
                  />
                </div>

                {/* 签名（必填） */}
                <div className="mb-3 md:mb-4" id="signaturePad">
                  <div className="flex items-center justify-between gap-3 mb-1 md:mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {t('tenant.kaiyaku.fields.signature')}
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          signatureDataUrl: '',
                        }))
                      }
                      className="text-xs px-3 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-100 transition"
                    >
                      {t('tenant.kaiyaku.signature.clear')}
                    </button>
                  </div>
                  <SignaturePad
                    value={formData.signatureDataUrl}
                    onChange={(dataUrl) => {
                      setFormData((prev) => ({
                        ...prev,
                        signatureDataUrl: dataUrl,
                      }))
                      if (dataUrl) setSignatureMissing(false)
                    }}
                    height={160}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t('tenant.kaiyaku.signature.hint')}
                  </p>
                  {signatureMissing && (
                    <p className="text-xs text-red-600 mt-1">
                      {t('tenant.kaiyaku.validation.pleaseFill', {
                        field: t('tenant.kaiyaku.fields.signature'),
                      })}
                    </p>
                  )}
                </div>

              </div>

              {/* 按钮 */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 sm:items-center sm:justify-between pt-2">
                <button
                  type="submit"
                  className="btn-primary w-full sm:w-auto px-8 py-3"
                >
                  {t('tenant.kaiyaku.buttons.submit')}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full sm:w-auto px-8 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition"
                >
                  {t('tenant.kaiyaku.buttons.reset')}
                </button>
              </div>

              <p className="text-sm text-gray-500 whitespace-pre-line">
                {t('tenant.kaiyaku.preview.note')}
              </p>
            </form>

            {/* 右侧说明区域保持原样，只略微调整了一点文案 */}
            <aside className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-navy-700 mb-2">
                  {t('tenant.kaiyaku.sidebar.downloadTitle')}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {t('tenant.kaiyaku.sidebar.downloadDescription')}
                </p>
                <a
                  href={KAIYAKU_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-navy-700 text-white hover:bg-navy-800 transition"
                >
                  {t('tenant.kaiyaku.sidebar.downloadButton')}
                </a>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 text-sm text-yellow-800 space-y-3">
                <p className="font-semibold">{t('tenant.kaiyaku.sidebar.noticeTitle')}</p>
                <ul className="space-y-2">
                  <li>{t('tenant.kaiyaku.sidebar.notice1')}</li>
                  <li>{t('tenant.kaiyaku.sidebar.notice2')}</li>
                  <li>{t('tenant.kaiyaku.sidebar.notice3')}</li>
                  <li>{t('tenant.kaiyaku.sidebar.notice4')}</li>
                  <li>{t('tenant.kaiyaku.sidebar.notice5')}</li>
                  <li>{t('tenant.kaiyaku.sidebar.notice6')}</li>
                  <li className="whitespace-pre-line">{t('tenant.kaiyaku.sidebar.notice7')}</li>
                </ul>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
