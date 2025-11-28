'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Mail, Phone, MapPin, Printer, Send, Copy, Check, Edit, CheckCircle } from 'lucide-react'

const Contact = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
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
      
      // 清空表单
      setFormData({
        company: '',
        name: '',
        email: '',
        message: ''
      })
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
      description: '我们将在 24 小时内回复您的咨询'
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <section id="contact" className="relative section-padding scroll-mt-32">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold mb-4 text-white"
          >
            联系我们
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg text-gray-200 max-w-2xl mx-auto"
          >
            无论您关注个人房产投资、资产托管还是企业拓展，只需留下需求，我们的顾问会尽快与您取得联系。
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:items-stretch">
          {/* Contact Form */}
          <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl flex flex-col h-full"
          >
            {!showConfirm ? (
              <>
                <h3 className="text-2xl font-semibold text-navy-700 mb-6">
                  留言表单
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6" suppressHydrationWarning>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  公司名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-colors duration-200"
                  placeholder="如：东京蓝海股份有限公司"
                  suppressHydrationWarning
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  联系人姓名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-colors duration-200"
                  placeholder="请输入姓名"
                  suppressHydrationWarning
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  邮箱地址 <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-colors duration-200"
                  placeholder="example@company.com"
                  suppressHydrationWarning
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  项目需求 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-colors duration-200 resize-none"
                  placeholder="请描述您的需求或希望了解的服务内容"
                  suppressHydrationWarning
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
                        项目需求
                      </label>
                      <p className="text-base text-navy-700 whitespace-pre-wrap">
                        {formData.message}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={handleConfirmSend}
                      disabled={loading}
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
          </motion.div>

          {/* Contact Information */}
          <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 h-full flex flex-col shadow-2xl"
          >
            <h3 className="text-2xl font-semibold text-navy-700 mb-6">
              联系方式
            </h3>

            <motion.div variants={containerVariants} className="space-y-6 flex-1">
              {contactInfo.map((info, index) => {
                const copyKey = info.title === '电子邮箱' ? 'email' : info.title === '联系电话' ? 'phone' : info.title === '传真' ? 'fax' : info.title === '公司地址' ? 'address' : ''
                const isCopied = copied === copyKey
                
                const copyValue = info.contentLines ? info.contentLines.join(' ') : info.content

                // 判断是否为地址项，在移动端需要特殊布局
                const isAddress = info.title === '公司地址'
                
                return (
                  <motion.div
                    key={info.title}
                    variants={itemVariants}
                    className="p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200 flex items-start space-x-4"
                  >
                    <div className="flex-shrink-0">
                      <motion.div
                        className="w-12 h-12 bg-navy-100 rounded-full flex items-center justify-center"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <info.icon className="w-6 h-6 text-navy-700" />
                      </motion.div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-lg font-semibold text-navy-700">
                          {info.title}
                        </h4>
                        <div className="flex gap-2">
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
                          <button
                            onClick={() => handleCopy(copyValue ?? '', copyKey)}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                            title="复制"
                          >
                            {isCopied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                          </button>
                        </div>
                      </div>
                      {info.content && (
                        <p className="text-navy-600 font-medium mb-1">
                          {info.content}
                        </p>
                      )}
                      {info.contentLines && (
                        <div className="text-navy-600 font-medium mb-1 space-y-1">
                          {info.contentLines.map((line) => (
                            <p key={line} className="break-words">{line}</p>
                          ))}
                        </div>
                      )}
                      {info.description && (
                        <p className="text-sm text-gray-500">
                          {info.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12"
        >
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
        </motion.div>
      </div>
    </section>
  )
}

export default Contact

