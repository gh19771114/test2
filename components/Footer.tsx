'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useMemo } from 'react'
import { Mail, Phone, MapPin, Printer, Smartphone } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const Footer = () => {
  const { t } = useLanguage()
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkDesktop = () => {
      if (typeof window !== 'undefined') {
        setIsDesktop(window.innerWidth >= 1024) // lg breakpoint
      }
    }
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  const handleEmailClick = () => {
    window.location.href = 'mailto:info@bournmark.jp'
  }

  const handlePhoneClick = () => {
    window.location.href = 'tel:+81366617745'
  }

  const handleAddressClick = () => {
    const address = encodeURIComponent(t('footer.address.mapQuery'))
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (isMobile) {
      window.location.href = `https://maps.google.com/maps?q=${address}`
    } else {
      window.open(`https://maps.google.com/maps?q=${address}`, '_blank')
    }
  }

  const [showQRModal, setShowQRModal] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const socialLinks = [
    { 
      type: 'youtube', 
      href: 'https://www.youtube.com/@bournmark', 
      label: 'YouTube', 
      bg: 'bg-[#FF0000]', 
      hover: 'hover:bg-[#d40000]',
      qrImage: null
    },
    { 
      type: 'douyin', 
      href: 'https://v.douyin.com/qgZX22LW6SM/', 
      label: '抖音', 
      bg: 'bg-gradient-to-br from-gray-900 via-black to-[#050505]', 
      hover: 'hover:from-gray-800 hover:via-black hover:to-black',
      qrImage: null,
    },
    { 
      type: 'xiaohongshu', 
      href: 'https://xhslink.com/m/28skxkhb9X0', 
      label: '小红书', 
      bg: 'bg-[#FF2442]', 
      hover: 'hover:bg-[#d81c35]',
      qrImage: null
    },
    { 
      type: 'facebook', 
      href: 'https://www.facebook.com/bournmarkjapan/', 
      label: 'Facebook', 
      bg: 'bg-[#1877F2]', 
      hover: 'hover:bg-[#0e5fcc]',
      qrImage: null
    },
    { 
      type: 'wechat', 
      href: '#', // 改为 #，点击时显示二维码弹窗
      label: '微信视频号', 
      bg: 'bg-[#07C160]', 
      hover: 'hover:bg-[#059a4d]',
      qrImage: '/imgs/gongzhonghaoQR.JPG',
      onClick: (e: React.MouseEvent) => {
        // 所有设备都显示二维码弹窗
        e.preventDefault()
        setShowQRModal('wechat')
      }
    },
    { 
      type: 'line', 
      href: 'https://line.me/ti/p/ErxgTcaKMx', 
      label: 'Line', 
      bg: 'bg-[#00B900]', 
      hover: 'hover:bg-[#009400]',
      qrImage: null
    }
  ]

  const renderSocialIcon = (type: string) => {
    switch (type) {
      case 'youtube':
        return (
          <svg className="w-11 h-11 md:w-9 md:h-9 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        )
      case 'douyin':
        return (
          <svg className="w-11 h-11 md:w-9 md:h-9 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
          </svg>
        )
      case 'xiaohongshu':
        return (
          <svg className="w-11 h-11 md:w-9 md:h-9 flex-shrink-0" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 29,0.33332825 C 13.959937,3.4666748 1.5356731,15.204498 0,31 -1.586103,47.314209 0,64.597672 0,81 v 102 c 0,18.76035 -4.7369685,44.19888 7.3333335,60 C 20.372129,260.06897 44.156731,256 63,256 h 111 35 c 5.78276,0 12.33244,0.84741 18,-0.33333 15.0401,-3.13336 27.46432,-14.87115 29,-30.66667 1.58612,-16.31419 0,-33.59769 0,-50 V 73 C 256,54.239685 260.73697,28.801102 248.66667,13 235.62787,-4.0689697 211.84329,0 193,0 H 82 47 C 41.217228,0 34.667561,-0.84741211 29,0.33332825 M 120,91 l -7,19 h 12 l -10,24 9,1 c -0.98794,2.68155 -2.31718,7.73317 -4.33334,9.83334 C 118.18945,146.3721 115.92654,146 114,146 c -4.35942,0 -13.16798,1.80539 -15.5,-3 -1.069664,-2.20416 0.465553,-4.98451 1.333336,-7 1.813624,-4.21228 4.222554,-8.51549 5.166664,-13 -2.17548,0 -4.92464,0.42967 -7,-0.33333 -7.778526,-2.85974 0.874031,-15.36435 2.66666,-19.66667 1.25875,-3.020981 2.75652,-9.584732 5.5,-11.5 C 110.01874,88.810822 115.88325,90.674988 120,91 m -79,63 c 2.750713,0 6.837379,0.81721 8.5,-2 1.769028,-2.99753 0.5,-9.58963 0.5,-13 V 106 C 50,102.90659 48.438198,93.464493 51.166668,91.5 53.41069,89.884308 62.832935,90.226166 63.833332,93 65.47065,97.539825 64,105.16241 64,110 v 32 c 0,5.48389 0.949112,11.8645 -1.333332,17 -2.177158,4.89861 -12.303417,9.27243 -17.333336,5.5 C 43.120155,162.84012 41.545292,156.59013 41,154 M 193,91 v 5 c 3.72887,0 8.4108,-0.763367 12,0.333328 11.97635,3.659424 11,15.422502 11,25.666672 1.99706,0 4.04419,-0.15562 6,0.33333 11.49335,2.87334 10,14.36401 10,23.66667 0,4.95615 0.93086,10.82184 -2.33333,15 -3.59567,4.60246 -9.48195,4 -14.66667,4 -1.6116,0 -4.26318,0.51051 -5.66667,-0.5 -2.62326,-1.88875 -3.78159,-7.50485 -4.33333,-10.5 3.28711,0 9.2179,1.12517 11.83333,-1.33334 C 219.9164,149.76859 218.65411,138.43454 215,136.5 c -1.93661,-1.02527 -4.88672,-0.5 -7,-0.5 h -15 v 29 h -14 v -29 h -14 v -14 h 14 v -12 h -9 V 96 h 9 v -5 h 14 m -32,5 v 14 h -8 v 42 h 13 v 13 H 120 L 125.33334,152.5 138,152 v -42 h -8 V 96 h 31 m 57,14 c 0,-2.84204 -0.51608,-6.25871 0.33333,-9 3.34434,-10.793121 19.61577,-2.093994 11.5,6.83333 -0.92279,1.01507 -2.54419,1.51106 -3.83333,1.83334 C 223.43948,110.30679 220.61993,110 218,110 M 41,110 36.833332,147 30,159 24,143 27,110 h 14 m 46,0 3,33 -6,15 h -2 c -5.366936,-8.49765 -6.053299,-17.26251 -7,-27 -0.672195,-6.91406 -2,-14.04004 -2,-21 h 14 m 106,0 v 12 h 9 v -12 h -9 m -75,42 -5,13 H 91 L 96.333336,151.5 104,151.66666 Z" fill="white" />
          </svg>
        )
      case 'facebook':
        return (
          <svg className="w-11 h-11 md:w-9 md:h-9 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        )
      case 'wechat':
        return (
          <svg className="w-11 h-11 md:w-9 md:h-9 flex-shrink-0" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="77" fill="white"/>
            <path d="m402 369c23-17 38-42 38-70 0-51-50-92-111-92s-110 41-110 92 49 92 110 92c13 0 25-2 36-5 4-1 8 0 9 1l25 14c3 2 6 0 5-4l-6-22c0-3 2-5 4-6m-110-85a15 15 0 1 1 0-29 15 15 0 0 1 0 29m74 0a15 15 0 1 1 0-29 15 15 0 0 1 0 29" fill="#00c70a"/>
            <path d="m205 105c-73 0-132 50-132 111 0 33 17 63 45 83 3 2 5 5 4 10l-7 24c-1 5 3 7 6 6l30-17c3-2 7-3 11-2 26 8 48 6 51 6-24-84 59-132 123-128-10-52-65-93-131-93m-44 93a18 18 0 1 1 0-35 18 18 0 0 1 0 35m89 0a18 18 0 1 1 0-35 18 18 0 0 1 0 35" fill="#00c70a"/>
          </svg>
        )
      case 'line':
        return (
          <svg className="w-11 h-11 md:w-9 md:h-9 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.086.766.062 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
          </svg>
        )
      default:
        return <span className="text-base md:text-lg text-white">SNS</span>
    }
  }

  const quickLinks = useMemo(() => [
    { name: t('navigation.business'), href: '/#services' },
    { name: t('navigation.cases'), href: '/#works' },
    { name: t('navigation.company'), href: '/company/overview' },
    { name: t('navigation.tenant'), href: '/tenant' },
    { name: t('navigation.contact'), href: '/#contact' }
  ], [t])

  const services = useMemo(() => [
    { name: t('navigation.maimai'), href: '/maimai' },
    { name: t('navigation.wuye'), href: '/wuye' },
    { name: t('navigation.touzi'), href: '/touzi' },
    { name: t('navigation.qichu'), href: '/qichu' }
  ], [t])

  return (
    <footer className="bg-navy-900 text-white relative z-[9999]">
      <div className="container-custom px-4 md:px-6 lg:px-8 w-full">
        {/* Main Footer Content */}
        <div className="py-8 md:py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 w-full">
            {/* Company Info */}
            <motion.div className="lg:col-span-1">
              <div>
                <h4 className="text-xl md:text-lg font-semibold mb-4">{t('footer.followUs')}</h4>
                <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      onClick={social.onClick}
                      className={`group w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl ${social.bg} ${social.hover} flex items-center justify-center transition-all duration-200 text-white shadow-xl hover:-translate-y-1`}
                      aria-label={social.label}
                      title={social.label}
                    >
                      {renderSocialIcon(social.type)}
                    </motion.a>
                  ))}
                </div>
              </div>
              <p className="text-base md:text-sm text-gray-300 leading-relaxed">
                {t('footer.companyInfo')}
              </p>
            </motion.div>

            {/* 手机竖版：站点导航 + 服务项目并列；其他端保持原 4 列布局 */}
            <div className="footer-links-pair">
            {/* Quick Links */}
              <motion.div>
                <h4 className="text-xl md:text-lg font-semibold mb-4">{t('footer.quickLinks')}</h4>
              <ul className="space-y-3">
                  {quickLinks.map((link) => (
                  <motion.li
                    key={link.name}
                  >
                    <a
                      href={link.href}
                      className="text-base md:text-sm text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Services */}
              <motion.div>
                <h4 className="text-xl md:text-lg font-semibold mb-4">{t('footer.services')}</h4>
              <ul className="space-y-3">
                  {services.map((service) => (
                  <motion.li
                    key={service.name}
                  >
                    <a
                      href={service.href}
                      className="text-base md:text-sm text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {service.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            </div>

            {/* Contact Info */}
            <motion.div>
              <h4 className="text-xl md:text-lg font-semibold mb-4">{t('footer.contactInfo')}</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail size={22} className="md:w-5 md:h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-base md:text-sm text-gray-300">info@bournmark.jp</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone size={22} className="md:w-5 md:h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-base md:text-sm text-gray-300">03-6661-7745</p>
                    <p className="text-base md:text-sm text-gray-400">{t('footer.workingHours')}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Printer size={22} className="md:w-5 md:h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-base md:text-sm text-gray-300">03-6661-7744</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin size={22} className="md:w-5 md:h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-base md:text-sm text-gray-300">{t('footer.address.line1')}</p>
                    <p className="text-base md:text-sm text-gray-400">{t('footer.address.line2')}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Footer */}
        <motion.div className="border-t border-navy-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              {t('footer.copyright')}
            </p>
            <div className="flex items-center space-x-6 text-sm footer-bottom-actions">
              <a href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">
                {t('footer.privacyPolicy')}
              </a>
              {/* 切换到移动版按钮 - 仅在桌面端显示 */}
              <button
                onClick={() => {
                  const viewport = document.querySelector('meta[name="viewport"]')
                  if (viewport) {
                    viewport.setAttribute('content', 'width=device-width, initial-scale=1')
                  }
                }}
                className="hidden lg:flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                <Smartphone size={16} />
                <span>{t('footer.mobileVersion')}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <div 
          className="fixed inset-0 bg-black/70 z-[99999] flex items-center justify-center p-4"
          onClick={() => setShowQRModal(null)}
        >
          <div 
            className="bg-white rounded-2xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                微信公众号二维码
              </h3>
              <button
                onClick={() => setShowQRModal(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="flex justify-center">
              <img 
                src="/imgs/gongzhonghaoQR.JPG"
                alt="微信公众号二维码"
                className="w-full h-auto rounded-lg"
              />
            </div>
            <p className="text-center text-gray-600 mt-4 text-sm">
              请使用微信扫描二维码
            </p>
          </div>
        </div>
      )}
    </footer>
  )
}

export default Footer
