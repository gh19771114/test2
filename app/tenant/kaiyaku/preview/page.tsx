'use client'

import { useMemo, useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  convertToJapanesePayload,
  reasonKeyForI18n,
  looksLikeJapaneseKaiyakuData,
  convertFromJapaneseToInternal,
  type KaiyakuInternalForm,
} from '@/lib/kaiyakuConvertClient'

const TURNSTILE_DEBUG_TAG = 'kaiyaku-turnstile-debug@2026-01-27'

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: any) => string
      execute?: (widgetId?: string) => void
      reset?: (widgetId?: string) => void
      remove?: (widgetId?: string) => void
    }
  }
}

type TerminationForm = KaiyakuInternalForm

export default function TerminationPreviewPage() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const [formData, setFormData] = useState<TerminationForm | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitResult, setSubmitResult] = useState<string | null>(null)
  const [submitIsError, setSubmitIsError] = useState(false)

  const notProvided = t('tenant.kaiyaku.preview.notProvided')
  const notSelected = t('tenant.kaiyaku.preview.notSelected')
  const undecided = t('tenant.kaiyaku.preview.undecided')

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
  const [turnstileIsInvisible, setTurnstileIsInvisible] = useState(false)
  const [turnstileRetry, setTurnstileRetry] = useState(0)
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null)
  const turnstileWidgetIdRef = useRef<string | null>(null)
  const turnstileWaitersRef = useRef<Array<(token: string) => void>>([])

  // 只有当表单数据已加载，预览页渲染出验证容器后，才初始化 Turnstile
  const shouldInitTurnstile = !!turnstileSiteKey && !!formData

  useEffect(() => {
    // 从 sessionStorage 读取主页面保存的表单数据
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
        console.error('Failed to parse form data:', e)
        router.push('/tenant/kaiyaku')
      }
    } else {
      // 没有数据就返回主申请页
      router.push('/tenant/kaiyaku')
    }
  }, [router])

  // Render Turnstile only if site key configured (and formData is ready)
  useEffect(() => {
    if (!shouldInitTurnstile) return
    if (!turnstileContainerRef.current) return

    let cancelled = false
    setTurnstileStatus('loading')
    setTurnstileError(null)
    setTurnstileIsInvisible(false)

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
          appearance: 'always',
          size: 'flexible',
          callback: (token: string) => {
            setTurnstileToken(token)
            setTurnstileStatus('ready')
            setTurnstileError(null)
            // wake any pending waiters
            const waiters = turnstileWaitersRef.current.splice(0)
            waiters.forEach((fn) => fn(token))
          },
          'expired-callback': () => {
            setTurnstileToken(null)
            setTurnstileStatus('ready')
          },
          'error-callback': (code?: string) => {
            setTurnstileToken(null)
            setTurnstileStatus('error')
            // wake waiters (resolve empty token)
            const waiters = turnstileWaitersRef.current.splice(0)
            waiters.forEach((fn) => fn(''))
            setTurnstileError(
              t('tenant.kaiyaku.preview.turnstileErrorWithCode', {
                code: code || 'unknown',
              })
            )
          },
        })
        turnstileWidgetIdRef.current = widgetId

        // Detect "invisible" widgets: they may render 0x0 and never show UI.
        // NOTE: Turnstile uses *closed* shadow DOM, so we cannot query inner iframe.
        setTimeout(() => {
          if (cancelled) return
          const el = turnstileContainerRef.current
          if (!el) return
          const first = el.firstElementChild as HTMLElement | null
          const rect = first?.getBoundingClientRect()
          const sizeLooksInvisible = !!rect && rect.width < 40 && rect.height < 40

          if (sizeLooksInvisible) {
            setTurnstileIsInvisible(true)
            setTurnstileStatus('ready')
            return
          }

          // If Turnstile didn't inject any element at all, treat as render failure.
          if (el.childElementCount === 0) {
            setTurnstileStatus('error')
            setTurnstileError(t('tenant.kaiyaku.preview.turnstileRenderFailed'))
          } else {
            setTurnstileIsInvisible(false)
            setTurnstileStatus('ready')
          }
        }, 300)
      } catch (e: any) {
        setTurnstileStatus('error')
        setTurnstileError(
          e?.message ||
            t('tenant.kaiyaku.preview.turnstileScriptLoadFailed')
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
      setTurnstileIsInvisible(false)
    }
  }, [shouldInitTurnstile, turnstileRetry])

  const handleConfirm = async () => {
    if (!formData) return
    if (!formData.signatureDataUrl) {
      setSubmitIsError(true)
      setSubmitResult(
        t('tenant.kaiyaku.validation.pleaseFill', {
          field: t('tenant.kaiyaku.fields.signature'),
        })
      )
      return
    }

    try {
      if (turnstileSiteKey && !turnstileToken) {
        // If Turnstile is configured but token not available, try execute on-demand first.
        if (window.turnstile?.execute && turnstileWidgetIdRef.current) {
          setLoading(true)
          setSubmitIsError(false)
          setSubmitResult(t('tenant.kaiyaku.preview.turnstileVerifying'))

          try {
            window.turnstile.execute(turnstileWidgetIdRef.current)
          } catch {
            setLoading(false)
            setSubmitIsError(true)
            setSubmitResult(t('tenant.kaiyaku.preview.turnstileExecuteFailed'))
            return
          }

          const token = await new Promise<string>((resolve, reject) => {
            const timer = setTimeout(
              () => reject(new Error('timeout')),
              8000
            )
            turnstileWaitersRef.current.push((t) => {
              clearTimeout(timer)
              resolve(t)
            })
          }).catch(() => null)

          if (!token) {
            setLoading(false)
            setSubmitIsError(true)
            setSubmitResult(
              turnstileStatus === 'error'
                ? t('tenant.kaiyaku.preview.turnstileComponentLoadFailed', {
                    error: turnstileError || t('tenant.kaiyaku.preview.turnstileLoadFailed'),
                  })
                : t('tenant.kaiyaku.preview.turnstileTimeoutOrFailed')
            )
            return
          }
          // token now set via callback; continue submission below
          setSubmitResult(null)
        } else {
          setSubmitIsError(true)
          setSubmitResult(
            turnstileStatus === 'error'
              ? t('tenant.kaiyaku.preview.turnstileComponentLoadFailed', {
                  error: turnstileError || t('tenant.kaiyaku.preview.turnstileLoadFailed'),
                })
              : t('tenant.kaiyaku.preview.turnstilePleaseComplete')
          )
          return
        }
      }

      setLoading(true)
      setSubmitResult(null)
      setSubmitIsError(false)
      // 提交到生成 PDF + 发邮件的 API（你后端那边用 Playwright 的 route）
      const res = await fetch('/api/kaiyaku', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...convertToJapanesePayload(formData),
          ...(turnstileToken ? { turnstileToken } : {}),
        }),
      })

      let data: any = {}
      try {
        const text = await res.text()
        if (text) data = JSON.parse(text)
      } catch (parseError) {
        console.error('无法解析响应:', parseError)
        data = { error: t('tenant.kaiyaku.preview.serverResponseError', { status: res.status }) }
      }

      if (!res.ok) {
        const errorMsg =
          data.error || data.details || `HTTP ${res.status}: ${res.statusText}`
        console.error('API 错误:', {
          status: res.status,
          statusText: res.statusText,
          data,
        })
        setSubmitIsError(true)
        setSubmitResult(t('tenant.kaiyaku.preview.submitFailed', { error: errorMsg }))
        return
      }

      setSubmitIsError(false)
      setSubmitResult(
        data.message || t('tenant.kaiyaku.preview.submitSuccess')
      )

      // 提交成功后清掉缓存
      sessionStorage.removeItem('terminationFormData')
      setTurnstileToken(null)
    } catch (err: any) {
      console.error('提交错误:', err)
      const errorMsg = err.message || t('tenant.kaiyaku.preview.networkError')
      setSubmitIsError(true)
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
  const reasons = (() => {
    if (!formData.reason) return notSelected
    const key = reasonKeyForI18n(formData.reason)
    const label = key ? t(`tenant.kaiyaku.reasons.${key}`) : ''
    if (formData.reason === 'other') {
      return `■${label || t('tenant.kaiyaku.reasons.その他')}（${formData.reasonOtherText || ''}）`
    }
    return `■${label || ''}`
  })()

  // 邮箱开锁方式一行
  const mailboxLine = buildMailboxLine(formData, t)

  // オートロック显示内容
  const autoLockLine = buildAutoLockLine(formData, t)

  // 宅配ボックス显示内容
  const deliveryBoxLine = buildDeliveryBoxLine(formData, t)

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
                  {t('tenant.kaiyaku.sections.propertyInfo')}
                </div>
                <table className="w-full border-t border-gray-200">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <th className="w-32 bg-gray-50 px-3 py-2 text-left align-top">
                        {t('tenant.kaiyaku.fields.propertyName')}
                      </th>
                      <td className="px-3 py-2">{formData.propertyName}</td>
                      <th className="w-32 bg-gray-50 px-3 py-2 text-left align-top">
                        {t('tenant.kaiyaku.fields.roomNumber')}
                      </th>
                      <td className="px-3 py-2">{formData.roomNumber}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="bg-gray-50 px-3 py-2 text-left align-top">
                        {t('tenant.kaiyaku.fields.propertyAddress')}
                      </th>
                      <td className="px-3 py-2" colSpan={3}>
                        {formData.propertyAddress}
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-gray-50 px-3 py-2 text-left align-top">
                        {t('tenant.kaiyaku.fields.contractHolder')}
                      </th>
                      <td className="px-3 py-2" colSpan={3}>
                        {formData.contractHolder}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* 二、日程 */}
                <div className="bg-gray-50 px-4 py-2 font-semibold border-y border-gray-200 mt-4">
                  {t('tenant.kaiyaku.sections.schedule')}
                </div>
                <table className="w-full border-t border-gray-200">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <th className="bg-gray-50 px-3 py-2 text-left align-top w-32">
                        {t('tenant.kaiyaku.fields.cancelDate')}
                      </th>
                      <td className="px-3 py-2">
                        {formatDateForPreview(formData.cancelDate, notProvided, language)}
                      </td>
                      <th className="bg-gray-50 px-3 py-2 text-left align-top w-32">
                        {t('tenant.kaiyaku.fields.moveOutDate')}
                      </th>
                      <td className="px-3 py-2">
                        {formatDateForPreview(formData.moveOutDate, notProvided, language)}
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-gray-50 px-3 py-2 text-left align-top">
                        {t('tenant.kaiyaku.fields.inspectionDateTime')}
                      </th>
                      <td className="px-3 py-2" colSpan={3}>
                        {formatInspectionDateTime(formData.inspectionDateTime, notProvided, language)}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* 三、施設利用状況 */}
                <div className="bg-gray-50 px-4 py-2 font-semibold border-y border-gray-200 mt-4">
                  {t('tenant.kaiyaku.sections.facilities')}
                </div>
                <table className="w-full border-t border-gray-200">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <th className="bg-gray-50 px-3 py-2 text-left align-top w-40">
                        {t('tenant.kaiyaku.labels.bicycleParking')}
                      </th>
                      <td className="px-3 py-2">
                        {ynLine(
                          formData.bicycleParking,
                          t('tenant.kaiyaku.options.yes'),
                          t('tenant.kaiyaku.options.no')
                        )}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="bg-gray-50 px-3 py-2 text-left align-top">
                        {t('tenant.kaiyaku.labels.mailbox')}
                      </th>
                      <td className="px-3 py-2">{mailboxLine}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="bg-gray-50 px-3 py-2 text-left align-top">
                        {t('tenant.kaiyaku.labels.carParking')}
                      </th>
                      <td className="px-3 py-2">
                        {ynLine(
                          formData.carParking,
                          t('tenant.kaiyaku.options.yes'),
                          t('tenant.kaiyaku.options.no')
                        )}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="bg-gray-50 px-3 py-2 text-left align-top">
                        {t('tenant.kaiyaku.labels.autoLock')}
                      </th>
                      <td className="px-3 py-2">{autoLockLine}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="bg-gray-50 px-3 py-2 text-left align-top">
                        {t('tenant.kaiyaku.labels.bikeSpace')}
                      </th>
                      <td className="px-3 py-2">
                        {ynLine(
                          formData.bikeSpace,
                          t('tenant.kaiyaku.options.yes'),
                          t('tenant.kaiyaku.options.no')
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-gray-50 px-3 py-2 text-left align-top">
                        {t('tenant.kaiyaku.labels.deliveryBox')}
                      </th>
                      <td className="px-3 py-2">{deliveryBoxLine}</td>
                    </tr>
                  </tbody>
                </table>

                {/* 四、返金口座 */}
                <div className="bg-gray-50 px-4 py-2 font-semibold border-y border-gray-200 mt-4">
                  {t('tenant.kaiyaku.sections.bankAccount')}
                </div>
                <table className="w-full border-t border-gray-200">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <th className="bg-gray-50 px-3 py-2 text-left align-top w-32">
                        {t('tenant.kaiyaku.fields.bankName')}
                      </th>
                      <td className="px-3 py-2">
                        {formData.bankName || notProvided}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="bg-gray-50 px-3 py-2 text-left align-top">
                        {t('tenant.kaiyaku.fields.bankBranch')}
                      </th>
                      <td className="px-3 py-2">
                        {formData.bankBranch || notProvided}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="bg-gray-50 px-3 py-2 text-left align-top">
                        {t('tenant.kaiyaku.fields.accountType')}
                      </th>
                      <td className="px-3 py-2">
                        {formData.accountType
                          ? formData.accountType
                          : notSelected}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="bg-gray-50 px-3 py-2 text-left align-top">
                        {t('tenant.kaiyaku.fields.accountNumber')}
                      </th>
                      <td className="px-3 py-2">
                        {formData.accountNumber || notProvided}
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-gray-50 px-3 py-2 text-left align-top">
                        {t('tenant.kaiyaku.fields.accountHolder')}
                      </th>
                      <td className="px-3 py-2">
                        {formData.accountHolder || notProvided}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* 五、解約理由 & 転居先 */}
                <div className="bg-gray-50 px-4 py-2 font-semibold border-y border-gray-200 mt-4">
                  {t('tenant.kaiyaku.sections.reasonAndMove')}
                </div>
                <table className="w-full border-t border-gray-200">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <th className="bg-gray-50 px-3 py-2 text-left align-top w-32">
                        {t('tenant.kaiyaku.fields.reason')}
                      </th>
                      <td className="px-3 py-2">
                        {reasons || notSelected}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="bg-gray-50 px-3 py-2 text-left align-top">
                        {t('tenant.kaiyaku.labels.newAddress')}
                      </th>
                      <td className="px-3 py-2">
                        {formData.newAddress || undecided}
                        <div className="text-xs text-gray-500 mt-2">
                          {t('tenant.kaiyaku.labels.newAddressNote')}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-gray-50 px-3 py-2 text-left align-top">
                        {t('tenant.kaiyaku.labels.newBuildingAndRoom')}
                      </th>
                      <td className="px-3 py-2">
                        {formData.newBuildingAndRoom || notProvided}
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-gray-50 px-3 py-2 text-left align-top">
                        {t('tenant.kaiyaku.fields.phoneNumber')}
                      </th>
                      <td className="px-3 py-2">
                        {formData.phoneNumber
                          ? `${formData.phoneCountryCode || '+81'} ${formData.phoneNumber}`
                          : notProvided}
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-gray-50 px-3 py-2 text-left align-top">
                        {t('tenant.kaiyaku.fields.email')}
                      </th>
                      <td className="px-3 py-2">
                        {formData.email || notProvided}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* 签名（氏名） */}
                <div className="px-4 py-4 flex flex-col sm:flex-row sm:items-end sm:justify-end gap-3 text-sm">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-gray-700">{t('tenant.kaiyaku.labels.signerName')}：</span>
                    <span className="inline-block min-w-[8rem] border-b border-gray-300 text-center">
                      {formData.signerName || formData.contractHolder}
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-gray-700">{t('tenant.kaiyaku.fields.signature')}：</span>
                    {formData.signatureDataUrl ? (
                      <img
                        src={formData.signatureDataUrl}
                        alt={t('tenant.kaiyaku.fields.signature')}
                        className="h-12 w-44 border border-gray-300 rounded bg-white object-contain"
                      />
                    ) : (
                      <span className="text-gray-500">{notProvided}</span>
                    )}
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
                        {t('tenant.kaiyaku.preview.turnstileLoading')}
                      </p>
                    )}
                    {turnstileStatus === 'ready' && turnstileIsInvisible && (
                      <p className="text-xs text-gray-500 mt-2">
                        {t('tenant.kaiyaku.preview.turnstileInvisibleHint')}
                      </p>
                    )}
                    {turnstileStatus === 'error' && (
                      <div className="mt-2 flex flex-col gap-2">
                        <p className="text-xs text-red-600">
                          {turnstileError ||
                            t('tenant.kaiyaku.preview.turnstileLoadFailed')}
                        </p>
                        <button
                          type="button"
                          onClick={() => setTurnstileRetry((v) => v + 1)}
                          className="self-start text-xs px-3 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-100 transition"
                        >
                          {t('tenant.kaiyaku.preview.turnstileRetry')}
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      {t('tenant.kaiyaku.preview.turnstilePoweredBy')}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1 break-all">
                      {TURNSTILE_DEBUG_TAG} · status={turnstileStatus} · siteKey=
                      {turnstileSiteKey ? 'on' : 'off'} · widgetId=
                      {turnstileWidgetIdRef.current ? 'set' : 'none'} · token=
                      {turnstileToken ? 'set' : 'none'}
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
                    {t('tenant.kaiyaku.preview.backEdit')}
                  </button>
                </div>
              </div>

              {submitResult && (
                <div
                  className={`p-4 rounded-lg ${
                    submitIsError
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
function formatDateForPreview(value: string, fallback = '', language: string) {
  if (!value) return fallback
  const [y, m, d] = value.split('-')
  if (!y || !m || !d) return value
  if (language === 'en') return `${y}-${m}-${d}`
  return `${y}年${m}月${d}日`
}

function formatInspectionDateTime(dateTime?: string, fallback = '', language: string = 'zh') {
  if (!dateTime) return fallback
  // datetime-local格式：YYYY-MM-DDTHH:mm
  const [datePart, timePart] = dateTime.split('T')
  if (!datePart) return dateTime
  
  const [y, m, d] = datePart.split('-')
  if (!y || !m || !d) return dateTime
  
  if (language === 'en') {
    return timePart ? `${y}-${m}-${d} ${timePart}` : `${y}-${m}-${d}`
  }

  const parts: string[] = [`${y}年${m}月${d}日`]
  if (!timePart) return parts[0]
  const [hour, minute] = timePart.split(':')
  if (!hour && !minute) return parts[0]
  // CN/JA share this visual; language-specific PDF is handled server-side
  const hh = hour || '00'
  const mm = minute || '00'
  return `${parts[0]} ${hh}:${mm}`
}

function ynLine(v: 'yes' | 'no', yesLabel: string, noLabel: string) {
  return v === 'yes' ? `■${yesLabel}　□${noLabel}` : `□${yesLabel}　■${noLabel}`
}

function buildMailboxLine(
  data: TerminationForm,
  t: (key: string, vars?: any) => string
) {
  const left = t('tenant.kaiyaku.options.left')
  const right = t('tenant.kaiyaku.options.right')
  const turnsLabel = t('tenant.kaiyaku.labels.turns')
  const numberLabel = t('tenant.kaiyaku.labels.number')

  const dir1 = data.mailbox1Direction === 'left' ? left : right
  const dir2 = data.mailbox2Direction === 'left' ? left : right

  const part1 = `(${dir1}) ${data.mailbox1Turns || '＿'}${turnsLabel}${data.mailbox1Number || '＿'}${numberLabel}`
  const part2 = `(${dir2}) ${data.mailbox2Turns || '＿'}${turnsLabel}${data.mailbox2Number || '＿'}${numberLabel}`
  return `${part1} · ${part2}`
}

function buildAutoLockLine(
  data: TerminationForm,
  t: (key: string, vars?: any) => string
) {
  const yes = t('tenant.kaiyaku.options.yes')
  const no = t('tenant.kaiyaku.options.no')
  const keyTypeLabel = t('tenant.kaiyaku.options.keyType')
  const dialLabel = t('tenant.kaiyaku.options.dial')

  if (data.autoLock === 'no') {
    return `□${yes}　□${keyTypeLabel}　□${dialLabel}(${''.padEnd(10, ' ')})　■${no}`
  }

  const keyType =
    data.autoLockKeyType === 'keyType'
      ? `■${keyTypeLabel}　□${dialLabel}(${''.padEnd(10, ' ')})`
      : data.autoLockKeyType === 'dial'
      ? `□${keyTypeLabel}　■${dialLabel}(${data.autoLockDial || ''.padEnd(10, ' ')})`
      : `□${keyTypeLabel}　□${dialLabel}(${''.padEnd(10, ' ')})`
  return `■${yes}　${keyType}　□${no}`
}

function buildDeliveryBoxLine(
  data: TerminationForm,
  t: (key: string, vars?: any) => string
) {
  const yes = t('tenant.kaiyaku.options.yes')
  const no = t('tenant.kaiyaku.options.no')
  const keyTypeLabel = t('tenant.kaiyaku.options.keyType')
  const cardTypeLabel = t('tenant.kaiyaku.options.cardType')
  const numberLabel = t('tenant.kaiyaku.labels.deliveryBoxNumber')

  if (data.deliveryBox === 'no') {
    return `□${yes}　□${keyTypeLabel}　□${cardTypeLabel}　${numberLabel}(${''.padEnd(10, ' ')})　■${no}`
  }

  const type =
    data.deliveryBoxType === 'keyType'
      ? `■${keyTypeLabel}　□${cardTypeLabel}`
      : data.deliveryBoxType === 'cardType'
      ? `□${keyTypeLabel}　■${cardTypeLabel}`
      : `□${keyTypeLabel}　□${cardTypeLabel}`

  const num = data.deliveryBoxNumber || ''.padEnd(10, ' ')
  return `■${yes}　${type}　${numberLabel}(${num})　□${no}`
}

