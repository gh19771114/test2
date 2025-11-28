'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Printer } from 'lucide-react'
import Image from 'next/image'
import xiaohongshuIcon from '@/imgs/xiaohongshu-seeklogo.svg'
import wechatIcon from '@/imgs/wechat_icon_130789.svg'

const Footer = () => {
  const handleEmailClick = () => {
    window.location.href = 'mailto:info@bournmark.jp'
  }

  const handlePhoneClick = () => {
    window.location.href = 'tel:+81366617745'
  }

  const handleAddressClick = () => {
    const address = encodeURIComponent('東京都中央区日本橋人形町1-2-12 Bourn Mark Ningyocho BLD. 2F')
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (isMobile) {
      window.location.href = `https://maps.google.com/maps?q=${address}`
    } else {
      window.open(`https://maps.google.com/maps?q=${address}`, '_blank')
    }
  }

  const socialLinks = [
    { type: 'youtube', href: '#', label: 'YouTube', bg: 'bg-[#FF0000]', hover: 'hover:bg-[#d40000]' },
    { type: 'douyin', href: '#', label: '抖音', bg: 'bg-gradient-to-br from-gray-900 via-black to-[#050505]', hover: 'hover:from-gray-800 hover:via-black hover:to-black' },
    { type: 'xiaohongshu', href: '#', label: '小红书', bg: 'bg-[#FF2442]', hover: 'hover:bg-[#d81c35]' },
    { type: 'facebook', href: '#', label: 'Facebook', bg: 'bg-[#1877F2]', hover: 'hover:bg-[#0e5fcc]' },
    { type: 'wechat', href: '#', label: '微信视频号', bg: 'bg-[#07C160]', hover: 'hover:bg-[#059a4d]' },
    { type: 'line', href: '#', label: 'Line Voom', bg: 'bg-[#00B900]', hover: 'hover:bg-[#009400]' }
  ]

  const renderSocialIcon = (type: string) => {
    switch (type) {
      case 'youtube':
        return (
          <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        )
      case 'douyin':
        return (
          <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
          </svg>
        )
      case 'xiaohongshu':
        return (
          <Image
            src={xiaohongshuIcon}
            alt="小红书"
            width={36}
            height={36}
            className="w-9 h-9"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        )
      case 'facebook':
        return (
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        )
      case 'wechat':
        return (
          <Image
            src={wechatIcon}
            alt="微信"
            width={42}
            height={42}
            className="w-[42px] h-[42px]"
          />
        )
      case 'line':
        return (
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.086.766.062 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
          </svg>
        )
      default:
        return <span className="text-lg text-white">SNS</span>
    }
  }

  const quickLinks = [
    { name: '业务介绍', href: '/#services' },
    { name: '案例展示', href: '/#works' },
    { name: '企业介绍', href: '/company/overview' },
    { name: '租客专用', href: '/tenant' },
    { name: '联系我们', href: '/#contact' }
  ]

  const services = [
    { name: '买卖中介', href: '/maimai' },
    { name: '物业管理', href: '/wuye' },
    { name: '投资相关', href: '/touzi' },
    { name: '企业出海助力', href: '/qichu' }
  ]

  return (
    <footer className="bg-navy-900 text-white">
      <div className="container-custom px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto pr-20 md:pr-24 lg:pr-8">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <div>
                <h4 className="text-lg font-semibold mb-4">关注我们</h4>
                <div className="grid grid-cols-3 gap-4 mb-6 sm:gap-5">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className={`group w-16 h-16 rounded-2xl ${social.bg} ${social.hover} flex items-center justify-center transition-all duration-200 text-white shadow-xl hover:-translate-y-1`}
                      aria-label={social.label}
                      title={social.label}
                    >
                      {renderSocialIcon(social.type)}
                    </motion.a>
                  ))}
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                深耕日本市场十余年，为个人投资者与企业客户提供买卖中介、物业管理与出海落地等一站式服务，帮助资产稳健增值。
              </p>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-4">站点导航</h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-4">服务项目</h4>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <motion.li
                    key={service.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <a
                      href={service.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {service.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-4">联系方式</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail size={20} className="text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300">info@bournmark.jp</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone size={20} className="text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300">03-6661-7745</p>
                    <p className="text-sm text-gray-400">工作日 10:00-18:00</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Printer size={20} className="text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300">03-6661-7744</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin size={20} className="text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300">東京都中央区日本橋人形町1-2-12</p>
                    <p className="text-sm text-gray-400">Bourn Mark Ningyocho BLD. 2F</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-navy-800 py-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 Bourn Mark Co., Ltd. 保留所有权利。
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">
                隐私政策
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                服务条款
              </a>
            </div>
          </div>
        </motion.div>
      </div>

    </footer>
  )
}

export default Footer
