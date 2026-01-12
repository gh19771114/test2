'use client'

import { useState, useEffect, useRef } from 'react'
import { Mail, Phone, MapPin, Printer, Send, Copy, Check, Edit, CheckCircle } from 'lucide-react'
import ReCAPTCHA from 'react-google-recaptcha'
import { useLanguage } from '@/contexts/LanguageContext'

const Contact = () => {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    email: '',
    message: ''
  })
  const [copied, setCopied] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitResult, setSubmitResult] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const [isMobilePortrait, setIsMobilePortrait] = useState(false)

  // 检测是否为手机竖版
  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkMobilePortrait = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const isPortrait = height > width
      setIsMobilePortrait(width <= 767 && isPortrait)
    }

    checkMobilePortrait()
    window.addEventListener('resize', checkMobilePortrait)
    window.addEventListener('orientationchange', checkMobilePortrait)

    return () => {
      window.removeEventListener('resize', checkMobilePortrait)
      window.removeEventListener('orientationchange', checkMobilePortrait)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // 先显示确认界面，不直接发送
    setShowConfirm(true)
    setSubmitResult(null)
  }

  const handleConfirmSend = async () => {
    // 验证 reCAPTCHA
    if (!recaptchaToken) {
      setSubmitResult('请完成机器人验证')
      if (recaptchaRef.current) {
        recaptchaRef.current.reset()
      }
      return
    }

    // 先验证 reCAPTCHA token
    const verifyRes = await fetch('/api/verify-recaptcha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: recaptchaToken }),
    })

    const verifyData = await verifyRes.json()
    if (!verifyData.success) {
      setSubmitResult('机器人验证失败，请重试')
      if (recaptchaRef.current) {
        recaptchaRef.current.reset()
      }
      setRecaptchaToken(null)
      return
    }

    setLoading(true)
    setSubmitResult(null)

    try {
      // 提交到 Pages Router API: /api/send-form
      // 字段：name (必填), email (必填), message (必填), company (可选)
      const res = await fetch('/api/send-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          ...(formData.company && { company: formData.company }), // 可选字段
        }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || '发送失败')
      }

      const data = await res.json()
      setSubmitResult(data.message || '信息已提交，我们会尽快与您联系。')
      setShowConfirm(false)

      // 清空表单和 reCAPTCHA
      setFormData({
        company: '',
        name: '',
        email: '',
        message: ''
      })
      setRecaptchaToken(null)
      if (recaptchaRef.current) {
        recaptchaRef.current.reset()
      }
    } catch (err: any) {
      console.error(err)
      setSubmitResult(err.message || '提交失败，请稍后重试。')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    // 直接返回编辑状态
    setShowConfirm(false)
    setSubmitResult(null)
    setRecaptchaToken(null)
    if (recaptchaRef.current) {
      recaptchaRef.current.reset()
    }
  }

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleEmailClick = () => {
    window.location.href = 'mailto:info@bournmark.jp'
  }

  const handlePhoneClick = () => {
    window.location.href = 'tel:+81366617745'
  }

  const handleAddressClick = () => {
    const address = encodeURIComponent('東京都中央区日本橋人形町1-2-12 Bourn Mark Ningyocho BLD. 2F')
    // 检测移动设备 - 使用 typeof window 检查确保在客户端执行
    if (typeof window !== 'undefined') {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      if (isMobile) {
        // 移动设备使用原生地图应用
        window.location.href = `https://maps.google.com/maps?q=${address}`
      } else {
        // 桌面端在新窗口打开
        window.open(`https://maps.google.com/maps?q=${address}`, '_blank')
      }
    }
  }

  const handleFaxClick = () => {
    window.location.href = 'mailto:info@bournmark.jp?subject=发送传真&body=请附上传真内容或相关文件，我们的顾问会尽快回复。'
  }

  const contactInfo = [
    {
      icon: Mail,
      title: '电子邮箱',
      content: 'info@bournmark.jp',
      description: '我们将在 24 小时内回复您的咨询',
      noWrap: true
    },
    {
      icon: Phone,
      title: '联系电话',
      content: '03-6661-7745',
      description: '工作日 10:00-18:00'
    },
    {
      icon: Printer,
      title: '传真',
      content: '03-6661-7744',
      description: ''
    },
    {
      icon: MapPin,
      title: '公司地址',
      contentLines: ['東京都中央区日本橋人形町1-2-12', 'Bourn Mark Ningyocho BLD. 2F'],
      description: ''
    }
  ]

  return (
    <section id="contact" className="relative section-padding scroll-mt-32">
      <div className="container-custom">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-white">
            {t('home.contact.title')}
          </h2>
          <p className="text-sm md:text-lg text-gray-200 max-w-2xl mx-auto px-4">
            {t('home.contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 lg:items-stretch">
          {/* Contact Form */}
          <div className={`${isMobilePortrait ? 'bg-white/80 backdrop-blur-sm shadow-2xl border-0 max-w-[95%] mx-auto' : 'bg-white/80 backdrop-blur-sm shadow-2xl'} rounded-2xl p-6 md:p-8 flex flex-col h-full`}>
            {!showConfirm ? (
              <>
                <h3 className={`text-xl md:text-2xl font-semibold text-navy-700 mb-4 md:mb-6 ${isMobilePortrait ? 'text-center mt-4 md:mt-0' : ''}`}>
                  {t('home.contact.formTitle')}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6" suppressHydrationWarning>
                  <div className={isMobilePortrait ? 'flex flex-col items-center' : ''}>
                    <label htmlFor="company" className={`block text-sm font-medium text-gray-700 mb-2 ${isMobilePortrait ? 'w-[90%]' : 'w-full'}`}>
                      {t('home.contact.companyName')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                      className={`${isMobilePortrait ? 'w-[90%]' : 'w-full'} px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-colors duration-200`}
                      placeholder="如：东京蓝海股份有限公司"
                      suppressHydrationWarning
                    />
                  </div>

                  <div className={isMobilePortrait ? 'flex flex-col items-center' : ''}>
                    <label htmlFor="name" className={`block text-sm font-medium text-gray-700 mb-2 ${isMobilePortrait ? 'w-[90%]' : 'w-full'}`}>
                      {t('home.contact.name')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={`${isMobilePortrait ? 'w-[90%]' : 'w-full'} px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-colors duration-200`}
                      placeholder="请输入姓名"
                      suppressHydrationWarning
                    />
                  </div>

                  <div className={isMobilePortrait ? 'flex flex-col items-center' : ''}>
                    <label htmlFor="email" className={`block text-sm font-medium text-gray-700 mb-2 ${isMobilePortrait ? 'w-[90%]' : 'w-full'}`}>
                      {t('home.contact.email')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`${isMobilePortrait ? 'w-[90%]' : 'w-full'} px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-colors duration-200`}
                      placeholder="example@company.com"
                      suppressHydrationWarning
                    />
                  </div>

                  <div className={isMobilePortrait ? 'flex flex-col items-center w-full' : ''}>
                    <label htmlFor="message" className={`block text-sm font-medium text-gray-700 mb-2 ${isMobilePortrait ? 'w-[90%]' : 'w-full'}`}>
                      {t('home.contact.message')} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className={`${isMobilePortrait ? 'w-[90%]' : 'w-full'} px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-colors duration-200 resize-none`}
                      placeholder="请描述您的需求或希望了解的服务内容"
                      suppressHydrationWarning
                      style={isMobilePortrait ? { width: '90%' } : {}}
                    />
                  </div>

                  <div className="space-y-4 mt-auto">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-primary text-lg py-4 inline-flex items-center justify-center gap-2 hover:scale-105 transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      提交信息
                      <Send size={20} />
                    </button>
                    {submitResult && (
                      <p className={`text-sm text-center ${submitResult.includes('失败') ? 'text-red-600' : 'text-green-600'}`}>
                        {submitResult}
                      </p>
                    )}
                    {!submitResult && (
                      <p className="text-sm text-gray-500 text-center">
                        提交后，我们将在一个工作日内与您确认需求并安排专属顾问。
                      </p>
                    )}
                  </div>
                </form>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-semibold text-navy-700 mb-6">
                  确认信息
                </h3>
                <div className="space-y-6 flex-1">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800">
                      请确认以下信息无误后点击"发送"。如需修改，请点击"修改"按钮。
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="border-b border-gray-200 pb-4">
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        公司名称
                      </label>
                      <p className="text-base text-navy-700 font-medium">
                        {formData.company || '未填写'}
                      </p>
                    </div>

                    <div className="border-b border-gray-200 pb-4">
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        联系人姓名
                      </label>
                      <p className="text-base text-navy-700 font-medium">
                        {formData.name}
                      </p>
                    </div>

                    <div className="border-b border-gray-200 pb-4">
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        邮箱地址
                      </label>
                      <p className="text-base text-navy-700 font-medium">
                        {formData.email}
                      </p>
                    </div>

                    <div className="border-b border-gray-200 pb-4">
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        {t('home.contact.message')}
                      </label>
                      <p className="text-base text-navy-700 whitespace-pre-wrap">
                        {formData.message}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mt-8 pt-6 border-t border-gray-200">
                    <div className="flex justify-center">
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                        onChange={(token) => setRecaptchaToken(token)}
                        onExpired={() => setRecaptchaToken(null)}
                        onError={() => setRecaptchaToken(null)}
                      />
                    </div>
                    <button
                      onClick={handleConfirmSend}
                      disabled={loading || !recaptchaToken}
                      className="w-full btn-primary text-lg py-4 inline-flex items-center justify-center gap-2 hover:scale-105 transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? '发送中...' : '确认发送'}
                      {!loading && <CheckCircle size={20} />}
                    </button>
                    <button
                      onClick={handleEdit}
                      disabled={loading}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-lg py-4 inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      修改信息
                      <Edit size={20} />
                    </button>
                    {submitResult && (
                      <p className={`text-sm text-center ${submitResult.includes('失败') ? 'text-red-600' : 'text-green-600'}`}>
                        {submitResult}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Contact Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 h-full flex flex-col shadow-2xl">
            <h3 className={`text-xl md:text-2xl font-semibold text-navy-700 mb-4 md:mb-6 ${isMobilePortrait ? 'text-center mt-4 md:mt-0' : ''}`}>
              联系方式
            </h3>

            <div className={`${isMobilePortrait ? 'space-y-1' : 'space-y-3 md:space-y-4 lg:space-y-6'} flex-1`}>
              {contactInfo.map((info, index) => {
                const copyKey = info.title === '电子邮箱' ? 'email' : info.title === '联系电话' ? 'phone' : info.title === '传真' ? 'fax' : info.title === '公司地址' ? 'address' : ''
                const isCopied = copied === copyKey

                const copyValue = info.contentLines ? info.contentLines.join(' ') : info.content

                // 判断是否为地址项，在移动端需要特殊布局
                const isAddress = info.title === '公司地址'

                // 手机竖版：整个卡片可点击跳转（邮件、电话、传真、地址）
                const handleCardClick = () => {
                  if (!isMobilePortrait) return

                  if (info.title === '电子邮箱') {
                    handleEmailClick()
                  } else if (info.title === '联系电话') {
                    handlePhoneClick()
                  } else if (info.title === '传真') {
                    handleFaxClick()
                  } else if (info.title === '公司地址') {
                    handleAddressClick()
                  }
                }

                return (
                  <div
                    key={info.title}
                    onClick={handleCardClick}
                    className={`${isMobilePortrait ? 'py-1 px-2' : 'p-4 md:p-6'} bg-white/80 backdrop-blur-sm rounded-xl ${isMobilePortrait ? 'border-0 max-w-[95%] mx-auto' : 'border border-gray-100'} hover:shadow-md transition-shadow duration-200 flex flex-col md:flex-row md:items-start md:space-x-4 relative ${
                      isMobilePortrait ? 'cursor-pointer' : ''
                    }`}
                    style={{ overflow: 'visible' }}
                  >
                    {/* 手机竖版：顶部横向布局 - icon(左) + 标题(中) + 复制按钮(右) */}
                    {isMobilePortrait ? (
                      <div className="flex items-center mb-0.5 w-full relative" style={{ gap: '6px' }}>
                        {/* Icon - 左侧，缩小 */}
                        <div
                          className="w-8 h-8 bg-navy-100 rounded-full flex items-center justify-center"
                          style={{ flexShrink: 0 }}
                        >
                          <info.icon className="w-4 h-4 text-navy-700" />
                        </div>
                        {/* 标题 - 居中 */}
                        <h4 className="text-base font-semibold text-navy-700 flex-1 text-center absolute left-1/2 transform -translate-x-1/2" style={{ minWidth: 0 }}>
                          {info.title}
                        </h4>
                        {/* 复制按钮 - 右侧对齐 */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCopy(copyValue ?? '', copyKey)
                            }}
                          className="text-gray-500 hover:text-gray-700 transition-colors absolute flex-shrink-0"
                            style={{ 
                            right: '-200px',
                            width: '32px',
                            height: '32px',
                              padding: '0',
                              margin: '0',
                              border: 'none',
                              backgroundColor: 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              boxSizing: 'border-box'
                            }}
                            title="复制"
                          >
                            {isCopied ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
                          </button>
                      </div>
                    ) : (
                      <>
                        {/* 桌面版：复制按钮 - 保持原样 */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCopy(copyValue ?? '', copyKey)
                          }}
                          className="text-gray-500 hover:text-gray-700 transition-colors z-10 absolute"
                          style={{
                            right: '1.5rem',
                            top: '1.5rem',
                          }}
                          title="复制"
                        >
                          {isCopied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                        </button>
                        {/* Icon - 桌面版左侧 */}
                        <div className="flex-shrink-0 flex justify-start mb-0">
                          <div
                            className="w-12 h-12 bg-navy-100 rounded-full flex items-center justify-center"
                          >
                            <info.icon className="w-6 h-6 text-navy-700" />
                          </div>
                        </div>
                      </>
                    )}
                    {/* 内容区域 - 手机版左对齐，桌面版右侧 */}
                    <div className="flex-1 min-w-0 text-left relative" style={{ overflow: 'visible' }}>
                      {/* 桌面版标题 */}
                      {!isMobilePortrait && (
                        <div className="flex items-baseline mb-2">
                          <h4 className="text-base md:text-lg font-semibold text-navy-700">
                            {info.title}
                          </h4>
                        </div>
                      )}
                      {info.content && (
                        <p className={`${isMobilePortrait ? 'text-xs mb-0.5' : 'text-sm md:text-base mb-1'} text-navy-600 font-medium`}>
                          {info.content}
                        </p>
                      )}
                      {info.contentLines && (
                        <div 
                          className={`text-navy-600 font-medium ${isMobilePortrait ? 'mb-0.5' : 'mb-1'} ${isAddress && isMobilePortrait ? 'flex flex-col gap-0.5' : ''}`}
                        >
                          {isAddress && isMobilePortrait ? (
                            // 手机版地址：强制2行显示，文字缩小
                            <>
                              <p className="text-xs leading-tight">{info.contentLines[0]}</p>
                              <p className="text-xs leading-tight">{info.contentLines[1]}</p>
                            </>
                          ) : (
                            // 桌面版：正常显示
                            info.contentLines.map((line) => (
                              <p key={line} className="text-sm md:text-base break-words">{line}</p>
                            ))
                          )}
                        </div>
                      )}
                      {info.description && (
                        <p 
                          className={`text-xs md:text-sm text-gray-500 mt-1 ${(info as any).noWrap ? 'description-nowrap' : ''}`}
                          style={(info as any).noWrap ? { 
                            whiteSpace: 'nowrap' as const
                          } : {}}
                        >
                          {info.description}
                        </p>
                      )}
                      {/* 桌面版：显示操作按钮 */}
                      {!isMobilePortrait && (
                        <div className="flex gap-2 flex-shrink-0 flex-wrap mt-2">
                          {info.title === '电子邮箱' && (
                            <button
                              onClick={handleEmailClick}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              发送邮件
                            </button>
                          )}
                          {info.title === '联系电话' && (
                            <button
                              onClick={handlePhoneClick}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              拨打电话
                            </button>
                          )}
                          {info.title === '公司地址' && (
                            <button
                              onClick={handleAddressClick}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              打开地图
                            </button>
                          )}
                          {info.title === '传真' && (
                            <button
                              onClick={handleFaxClick}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              发送传真
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="mt-12">
          <div className="relative w-full overflow-hidden rounded-3xl border border-white/30 shadow-2xl">
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent('東京都中央区日本橋人形町1-2-12 Bourn Mark Ningyocho BLD. 2F')}&output=embed&hl=ja&z=17`}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
              title="公司位置地图"
              suppressHydrationWarning
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact

