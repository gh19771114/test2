'use client'

import { useMemo, useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: any) => string
      reset?: (widgetId?: string) => void
      remove?: (widgetId?: string) => void
    }
  }
}

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
  const { t } = useLanguage()
  const router = useRouter()
  const [formData, setFormData] = useState<TerminationForm | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitResult, setSubmitResult] = useState<string | null>(null)

  // anti-bot: optional Cloudflare Turnstile (shared with homepage contact form)
  const turnstileSiteKey = useMemo(
    () => process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '',
    []
  )
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [turnstileStatus, setTurnstileStatus] = useState<
    'idle' | 'loading' | 'ready' | 'error'
  >('idle')
  const [turnstileError, setTurnstileError] = useState<string | null>(null)
  const [turnstileRetry, setTurnstileRetry] = useState(0)
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null)
  const turnstileWidgetIdRef = useRef<string | null>(null)

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

  // Render Turnstile only if site key configured
  useEffect(() => {
    if (!turnstileSiteKey) return
    if (!turnstileContainerRef.current) return

    let cancelled = false
    setTurnstileStatus('loading')
    setTurnstileError(null)

    const ensureScript = () =>
      new Promise<void>((resolve, reject) => {
        if (window.turnstile) return resolve()
        const existing = document.querySelector<HTMLScriptElement>(
          'script[data-turnstile="true"]'
        )
        if (existing) {
          existing.addEventListener('load', () => resolve(), { once: true })
          existing.addEventListener(
            'error',
            () => reject(new Error('turnstile script load failed')),
            { once: true }
          )
          return
        }
        const script = document.createElement('script')
        script.src =
          'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
        script.async = true
        script.defer = true
        script.dataset.turnstile = 'true'
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('turnstile script load failed'))
        document.head.appendChild(script)
      })

    const render = async () => {
      try {
        await ensureScript()
        if (cancelled) return
        if (!window.turnstile || !turnstileContainerRef.current) {
          setTurnstileStatus('error')
          setTurnstileError('验证组件初始化失败（turnstile 未注入）。')
          return
        }

        // Avoid duplicate widgets
        turnstileContainerRef.current.innerHTML = ''
        setTurnstileToken(null)

        // Wait one frame to ensure layout is ready (some environments render blank otherwise)
        await new Promise<void>((r) => requestAnimationFrame(() => r()))

        const widgetId = window.turnstile.render(turnstileContainerRef.current, {
          sitekey: turnstileSiteKey,
          theme: 'light',
          callback: (token: string) => {
            setTurnstileToken(token)
            setTurnstileStatus('ready')
            setTurnstileError(null)
          },
          'expired-callback': () => {
            setTurnstileToken(null)
            setTurnstileStatus('ready')
          },
          'error-callback': () => {
            setTurnstileToken(null)
            setTurnstileStatus('error')
            setTurnstileError('验证组件加载失败（可能被广告拦截/网络拦截）。')
          },
        })
        turnstileWidgetIdRef.current = widgetId

        // Detect blank render: if still empty after a short delay, treat as error
        setTimeout(() => {
          if (cancelled) return
          const el = turnstileContainerRef.current
          if (!el) return
          const hasContent =
            el.childElementCount > 0 || (el.textContent || '').trim().length > 0
          if (!hasContent) {
            setTurnstileStatus('error')
            setTurnstileError(
              '验证区域渲染为空白（可能被浏览器插件拦截或网络拦截）。请关闭广告拦截/隐私拦截后重试，或更换网络。'
            )
          } else {
            setTurnstileStatus('ready')
          }
        }, 300)
      } catch (e: any) {
        setTurnstileStatus('error')
        setTurnstileError(
          e?.message ||
            '验证脚本加载失败（可能被广告拦截/网络拦截），请刷新或点击重试。'
        )
      }
    }

    render()

    return () => {
      cancelled = true
      const widgetId = turnstileWidgetIdRef.current
      if (widgetId && window.turnstile?.remove) {
        try {
          window.turnstile.remove(widgetId)
        } catch {
          // ignore
        }
      }
      turnstileWidgetIdRef.current = null
      setTurnstileToken(null)
    }
  }, [turnstileSiteKey, turnstileRetry])

  const handleConfirm = async () => {
    if (!formData) return

    try {
      if (turnstileSiteKey && !turnstileToken) {
        setSubmitResult(
          turnstileStatus === 'error'
            ? `机器人验证组件未成功加载：${turnstileError || '请刷新页面或关闭广告拦截后重试。'}`
            : '请先完成机器人验证后再提交。'
        )
        return
      }

      setLoading(true)
      setSubmitResult(null)
      // 提交到生成 PDF + 发邮件的 API（你后端那边用 Playwright 的 route）
      const res = await fetch('/api/kaiyaku', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ...(turnstileToken ? { turnstileToken } : {}),
        }),
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
        setSubmitResult(t('tenant.kaiyaku.preview.submitFailed', { error: errorMsg }))
        return
      }

      setSubmitResult(
        data.message || t('tenant.kaiyaku.preview.submitSuccess')
      )

      // 提交成功后清掉缓存
      sessionStorage.removeItem('terminationFormData')
      setTurnstileToken(null)
    } catch (err: any) {
      console.error('提交错误:', err)
      const errorMsg = err.message || t('tenant.kaiyaku.preview.networkError')
      setSubmitResult(
        t('tenant.kaiyaku.preview.submitFailedRetry', { error: errorMsg })
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
            <p className="text-gray-600">{t('tenant.kaiyaku.preview.loading')}</p>
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
              alt={t('tenant.kaiyaku.preview.alt')}
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/70 to-orange-900/60"></div>
          </div>
          <div className="relative z-10 container-custom">
            <p className="text-sm text-yellow-200 font-semibold mb-4">
              {t('tenant.kaiyaku.subtitle')}
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              {t('tenant.kaiyaku.preview.title')}
            </h1>
            <p className="text-lg text-gray-100 max-w-3xl leading-relaxed">
              {t('tenant.kaiyaku.preview.description')}
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
                  {t('tenant.kaiyaku.preview.contentTitle')}
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
              <div className="flex flex-col gap-4 pt-4">
                {turnstileSiteKey && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <div ref={turnstileContainerRef} style={{ minHeight: 72 }} />
                    {turnstileStatus === 'loading' && (
                      <p className="text-xs text-gray-500 mt-2">
                        正在加载机器人验证…
                      </p>
                    )}
                    {turnstileStatus === 'error' && (
                      <div className="mt-2 flex flex-col gap-2">
                        <p className="text-xs text-red-600">
                          {turnstileError ||
                            '机器人验证加载失败，请刷新或关闭广告拦截后重试。'}
                        </p>
                        <button
                          type="button"
                          onClick={() => setTurnstileRetry((v) => v + 1)}
                          className="self-start text-xs px-3 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-100 transition"
                        >
                          重试加载验证
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Powered by Cloudflare Turnstile
                    </p>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                  <button
                    onClick={handleConfirm}
                    disabled={loading}
                    className="btn-primary w-full sm:w-auto px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? t('tenant.kaiyaku.preview.submitting') : t('tenant.kaiyaku.preview.confirmSubmit')}
                  </button>
                  <button
                    onClick={handleBack}
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    返回修改
                  </button>
                </div>
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
                  {t('tenant.kaiyaku.preview.note')}
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

