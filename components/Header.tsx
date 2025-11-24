'use client'

import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Menu, X, Globe2, Check, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import logo from '@/imgs/横向logo1-无背景-preview.png'
import { usePathname, useRouter } from 'next/navigation'

const languages = [
  { label: '简体中文', code: 'zh-CN', flag: '🇨🇳' },
  { label: '繁體中文（台灣）', code: 'zh-TW', flag: '🇹🇼' },
  { label: '繁體中文（香港）', code: 'zh-HK', flag: '🇭🇰' },
  { label: '日本語', code: 'ja-JP', flag: '🇯🇵' },
  { label: 'English', code: 'en', flag: '🇺🇸' },
]

type NavChild = {
  name: string
  href: string
  subChildren?: NavChild[]
}

type NavItem = {
  key: string
  name: string
  href?: string
  children?: NavChild[]
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0])
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null)
  const [hoveredChild, setHoveredChild] = useState<string | null>(null)

  const languageMenuRef = useRef<HTMLDivElement>(null)
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const scrollToHash = (hash: string) => {
    if (!hash) return
    const targetId = hash.startsWith('#') ? hash.substring(1) : hash
    const element = document.getElementById(targetId)
    if (element) {
      const headerOffset = 104 // approx. header height with padding
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      const offsetPosition = elementPosition - headerOffset
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setIsLanguageOpen(false)
      }
      if (openDropdown) {
        const ref = dropdownRefs.current[openDropdown]
        if (ref && !ref.contains(event.target as Node)) {
          setOpenDropdown(null)
        }
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [openDropdown, isLanguageOpen])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (pathname === '/') {
      const pendingHash = sessionStorage.getItem('pendingHash')
      const currentHash = window.location.hash ? window.location.hash.substring(1) : ''
      const hashToScroll = pendingHash || currentHash
      if (hashToScroll) {
        setTimeout(() => {
          scrollToHash(hashToScroll)
          if (pendingHash) sessionStorage.removeItem('pendingHash')
        }, 100)
      }
    }
  }, [pathname])

  const handleLanguageSelect = (language: typeof languages[number]) => {
    setSelectedLanguage(language)
    setIsLanguageOpen(false)
  }

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#')) {
      event.preventDefault()
      const hash = href.split('#')[1]
      if (pathname === '/') {
        scrollToHash(hash)
      } else {
        sessionStorage.setItem('pendingHash', hash)
        router.push(href)
      }
      return
    }
  }

  const navigation: NavItem[] = [
    {
      key: 'business',
      name: '业务介绍',
      children: [
        {
          name: '买卖中介',
          href: '/maimai',
          subChildren: [
            { name: '销售中房产', href: '/maimai' },
            { name: '日本房产买卖交易流程', href: '/maimai#process' },
            { name: '交易费用一览', href: '/maimai#fees' },
            { name: '房产实用工具', href: '/maimai#tools' },
          ],
        },
        {
          name: '物业管理',
          href: '/wuye',
          subChildren: [
            { name: '租赁管理', href: '/wuye/zulin' },
            { name: '收支与税务', href: '/wuye/shouzhi' },
            { name: '修缮维护', href: '/wuye/xiushan' },
            { name: '资产增值', href: '/wuye/zengzhi' },
            { name: '入住者服务', href: '/wuye/ruzhu' },
            { name: '相关保险', href: '/wuye/baoxian' },
          ],
        },
        {
          name: '企业出海助力',
          href: '/qichu',
          subChildren: [
            { name: '服务介绍', href: '/qichu' },
            { name: '相关服务', href: '/qichu#services' },
            { name: '合作伙伴网络', href: '/qichu#partners' },
            { name: '成功案例', href: '/qichu#cases' },
          ],
        },
        { name: '投资相关', href: '/touzi' },
      ],
    },
    { key: 'cases', name: '案例展示', href: '/cases' },
    {
      key: 'company',
      name: '企业介绍',
      children: [
        { name: '企业概要', href: '/company/overview' },
        { name: '企业沿革', href: '/company/history' },
        { name: '企业理念', href: '/company/philosophy' },
        { name: '社长介绍', href: '/company/ceo' },
      ],
    },
    { key: 'tenant', name: '租客专用', href: '/tenant' },
    { key: 'contact', name: '联系我们', href: '/#contact' },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm"
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-shrink-0 flex items-center"
          >
            <a href="/" aria-label="Bourn Mark" className="flex items-center h-full">
              <Image
                src={logo}
                alt="Bourn Mark 标志"
                priority
                className="h-10 sm:h-12 lg:h-14 w-auto object-contain"
                width={200}
                height={60}
              />
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
            {navigation.map((item, index) => {
              if (item.children) {
                return (
                  <motion.div
                    key={item.key}
                    className="relative"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    ref={(node) => {
                      if (node) {
                        dropdownRefs.current[item.key] = node
                      }
                    }}
                  >
                    <button
                      onClick={() => setOpenDropdown((prev) => (prev === item.key ? null : item.key))}
                      className={`flex items-center gap-1 text-sm xl:text-base text-gray-700 font-medium transition-colors duration-200 px-2 py-1 ${
                        openDropdown === item.key ? 'text-navy-700' : 'hover:text-navy-700'
                      }`}
                    >
                      {item.name}
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${openDropdown === item.key ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <AnimatePresence>
                      {openDropdown === item.key && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-visible z-50"
                          onMouseLeave={() => {
                            hoverTimeoutRef.current = setTimeout(() => {
                              setHoveredChild(null)
                            }, 200)
                          }}
                        >
                          {item.children.map((child) => (
                            <div
                              key={child.name}
                              className="relative group"
                              onMouseEnter={() => {
                                if (hoverTimeoutRef.current) {
                                  clearTimeout(hoverTimeoutRef.current)
                                  hoverTimeoutRef.current = null
                                }
                                if (child.subChildren) {
                                  setHoveredChild(child.name)
                                }
                              }}
                              onMouseLeave={() => {
                                // 延迟关闭，给用户时间移动到子菜单
                                hoverTimeoutRef.current = setTimeout(() => {
                                  setHoveredChild(null)
                                }, 150)
                              }}
                            >
                              <a
                                href={child.href}
                                className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={(e) => {
                                  if (!child.subChildren) {
                                    handleNavClick(e, child.href)
                                    setOpenDropdown(null)
                                  }
                                  // 如果有子菜单，允许点击主链接，但不会阻止默认行为
                                }}
                              >
                                <span>{child.name}</span>
                                {child.subChildren && (
                                  <span aria-hidden className="text-gray-400">›</span>
                                )}
                              </a>
                              {child.subChildren && (
                                <AnimatePresence>
                                  {hoveredChild === child.name && (
                                    <motion.div
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      exit={{ opacity: 0, x: -10 }}
                                      transition={{ duration: 0.2 }}
                                      className="absolute left-full top-0 ml-1 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden z-[60] min-w-[224px]"
                                      onMouseEnter={() => {
                                        if (hoverTimeoutRef.current) {
                                          clearTimeout(hoverTimeoutRef.current)
                                          hoverTimeoutRef.current = null
                                        }
                                        setHoveredChild(child.name)
                                      }}
                                      onMouseLeave={() => {
                                        hoverTimeoutRef.current = setTimeout(() => {
                                          setHoveredChild(null)
                                        }, 150)
                                      }}
                                      style={{ willChange: 'transform' }}
                                    >
                                      {child.subChildren.map((subChild) => (
                                        <a
                                          key={subChild.name}
                                          href={subChild.href}
                                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                          onClick={(e) => {
                                            handleNavClick(e, subChild.href)
                                            setOpenDropdown(null)
                                            setHoveredChild(null)
                                          }}
                                        >
                                          {subChild.name}
                                        </a>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              )}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              }

              if (!item.href) return null

              return (
                <motion.a
                  key={item.key}
                  href={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="text-sm xl:text-base text-gray-700 hover:text-navy-700 font-medium transition-colors duration-200 relative group px-2 py-1"
                  onClick={(e) => handleNavClick(e, item.href!)}
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-2 right-2 h-0.5 bg-navy-700 transition-all duration-200 group-hover:w-full w-0"></span>
                </motion.a>
              )
            })}
            <div className="relative ml-2" ref={languageMenuRef}>
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center gap-1.5 xl:gap-2 px-2 xl:px-3 py-1.5 xl:py-2 text-gray-700 hover:text-navy-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <span className="text-base xl:text-lg">{selectedLanguage.flag}</span>
                <span className="text-xs xl:text-sm font-medium hidden xl:inline">{selectedLanguage.label}</span>
                <Globe2 size={16} className="xl:w-[18px] xl:h-[18px]" />
              </button>
              <AnimatePresence>
                {isLanguageOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        className={`w-full text-left px-4 py-3 flex items-center gap-3 text-sm ${lang.code === selectedLanguage.code ? 'bg-navy-50 text-navy-700' : 'text-gray-700 hover:bg-gray-50'}`}
                        onClick={() => handleLanguageSelect(lang)}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="font-medium flex-1">{lang.label}</span>
                        {lang.code === selectedLanguage.code && <Check size={16} className="text-navy-600" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Mobile menu button */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-navy-700 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white border-t border-gray-200"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item, index) => {
                  if (item.children) {
                    const expanded = expandedMobile === item.key
                    return (
                      <motion.div
                        key={item.key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="border border-gray-100 rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() => setExpandedMobile((prev) => (prev === item.key ? null : item.key))}
                          className="w-full flex items-center justify-between px-3 py-2 text-base font-medium text-gray-700 bg-white"
                        >
                          <span>{item.name}</span>
                          <ChevronDown
                            size={18}
                            className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {expanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="bg-gray-50"
                            >
                              {item.children.map((child) => (
                                <a
                                  key={child.name}
                                  href={child.href}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  onClick={(e) => {
                                    handleNavClick(e, child.href)
                                    setIsMenuOpen(false)
                                    setExpandedMobile(null)
                                  }}
                                >
                                  {child.name}
                                </a>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  }

                  if (!item.href) return null

                  return (
                    <motion.a
                      key={item.key}
                      href={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-navy-700 hover:bg-gray-50 rounded-md transition-colors duration-200"
                      onClick={(e) => {
                        handleNavClick(e, item.href!)
                        setIsMenuOpen(false)
                      }}
                    >
                      {item.name}
                    </motion.a>
                  )
                })}
                <div className="border-t border-gray-200 pt-3">
                  {languages.map((lang, index) => (
                    <motion.button
                      key={lang.code}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-base rounded-md transition-colors duration-200 ${lang.code === selectedLanguage.code ? 'bg-navy-50 text-navy-700' : 'text-gray-700 hover:text-navy-700 hover:bg-gray-50'}`}
                      onClick={() => {
                        handleLanguageSelect(lang)
                        setIsMenuOpen(false)
                        setExpandedMobile(null)
                        setOpenDropdown(null)
                      }}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span className="flex-1 text-left">{lang.label}</span>
                      {lang.code === selectedLanguage.code && <Check size={16} className="text-navy-600" />}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

export default Header

