'use client'

import { useEffect, useRef, useState, useMemo, type MouseEvent } from 'react'
import { Menu, X, Globe2, Check, ChevronDown, Monitor } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import logo from '@/imgs/横向logo1-无背景-preview.png'
import { usePathname, useRouter } from 'next/navigation'
import { useLanguage, type Language } from '@/contexts/LanguageContext'

// 使用 Unicode 转义序列确保在所有系统上都能正确显示
const languages = [
  { label: '简体中文', code: 'zh-CN', flag: '\u{1F1E8}\u{1F1F3}' }, // 🇨🇳
  { label: '繁體中文（台灣）', code: 'zh-TW', flag: '\u{1F1F9}\u{1F1FC}' }, // 🇹🇼
  { label: '繁體中文（香港）', code: 'zh-HK', flag: '\u{1F1ED}\u{1F1F0}' }, // 🇭🇰
  { label: '日本語', code: 'ja-JP', flag: '\u{1F1EF}\u{1F1F5}' }, // 🇯🇵
  { label: 'English', code: 'en', flag: '\u{1F1FA}\u{1F1F8}' }, // 🇺🇸
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
  const { language, setLanguage, t } = useLanguage()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null)
  const [expandedMobileChild, setExpandedMobileChild] = useState<string | null>(null)
  const [hoveredChild, setHoveredChild] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  
  // 组件挂载后标记为已挂载
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  // 根据当前语言找到对应的language对象
  // 在客户端挂载前，始终使用中文，避免 hydration 不匹配
  const selectedLanguage = languages.find(lang => {
    if (!isMounted) {
      // 服务器端和客户端首次渲染时，都使用中文
      return lang.code === 'zh-CN'
    }
    if (language === 'zh') return lang.code === 'zh-CN'
    if (language === 'zh-TW') return lang.code === 'zh-TW'
    if (language === 'zh-HK') return lang.code === 'zh-HK'
    if (language === 'ja') return lang.code === 'ja-JP'
    if (language === 'en') return lang.code === 'en'
    return lang.code === 'zh-CN'
  }) || languages[0]

  const languageMenuRef = useRef<HTMLDivElement>(null)
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const scrollToHash = (hash: string, behavior: ScrollBehavior = 'smooth') => {
    if (!hash) return
    const targetId = hash.startsWith('#') ? hash.substring(1) : hash
    const element = document.getElementById(targetId)
    if (element) {
      const headerOffset = 104 // approx. header height with padding
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      const offsetPosition = elementPosition - headerOffset
      window.scrollTo({ top: offsetPosition, behavior })
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      const target = event.target as Node
      if (languageMenuRef.current && !languageMenuRef.current.contains(target)) {
        setIsLanguageOpen(false)
      }
      if (openDropdown) {
        const ref = dropdownRefs.current[openDropdown]
        if (ref && !ref.contains(target)) {
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
          // 从其他页面跳回首页：取消中间“下拉/滚动动画”，直接定位到锚点
          scrollToHash(hashToScroll, 'auto')
          if (pendingHash) sessionStorage.removeItem('pendingHash')
        }, 100)
      }
    }
  }, [pathname])

  // 清除 hoverTimeoutRef，防止卸载后仍调用 setState
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  // 当主下拉菜单关闭时，清除子菜单状态
  useEffect(() => {
    if (!openDropdown) {
      setHoveredChild(null)
    }
  }, [openDropdown])
  
  // 当手机端一级折叠关闭时，清除二级/三级展开状态
  useEffect(() => {
    if (!expandedMobile) {
      setExpandedMobileChild(null)
    }
  }, [expandedMobile])

  const handleLanguageSelect = (lang: typeof languages[number]) => {
    // 将语言代码转换为Language类型
    let langCode: Language = 'zh'
    if (lang.code === 'zh-CN') langCode = 'zh'
    else if (lang.code === 'zh-TW') langCode = 'zh-TW'
    else if (lang.code === 'zh-HK') langCode = 'zh-HK'
    else if (lang.code === 'ja-JP') langCode = 'ja'
    else if (lang.code === 'en') langCode = 'en'
    
    setLanguage(langCode)
    setIsLanguageOpen(false)
  }

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#')) {
      event.preventDefault()
      const hash = href.split('#')[1]
      if (pathname === '/') {
        // 首页内点击：保持原有 smooth（仅“从其他页面跳回首页”取消动画）
        scrollToHash(hash, 'smooth')
      } else {
        sessionStorage.setItem('pendingHash', hash)
        router.push(href)
      }
      return
    }
  }

  const navigation: NavItem[] = useMemo(() => [
    {
      key: 'business',
      name: t('navigation.business'),
      children: [
        {
          name: t('navigation.maimai'),
          href: '/maimai',
          subChildren: [
            { name: t('navigation.maimaiSub.sales'), href: '/maimai' },
            { name: t('navigation.maimaiSub.process'), href: '/maimai#process' },
            { name: t('navigation.maimaiSub.fees'), href: '/maimai#fees' },
            { name: t('navigation.maimaiSub.tools'), href: '/maimai#tools' },
          ],
        },
        {
          name: t('navigation.wuye'),
          href: '/wuye',
          subChildren: [
            { name: t('navigation.wuyeSub.zulin'), href: '/wuye/zulin' },
            { name: t('navigation.wuyeSub.shouzhi'), href: '/wuye/shouzhi' },
            { name: t('navigation.wuyeSub.xiushan'), href: '/wuye/xiushan' },
            { name: t('navigation.wuyeSub.zengzhi'), href: '/wuye/zengzhi' },
            { name: t('navigation.wuyeSub.ruzhu'), href: '/wuye/ruzhu' },
            { name: t('navigation.wuyeSub.baoxian'), href: '/wuye/baoxian' },
          ],
        },
        {
          name: t('navigation.qichu'),
          href: '/qichu',
          subChildren: [
            { name: t('navigation.qichuSub.intro'), href: '/qichu' },
            { name: t('navigation.qichuSub.services'), href: '/qichu#services' },
            { name: t('navigation.qichuSub.partners'), href: '/qichu#partners' },
            { name: t('navigation.qichuSub.cases'), href: '/qichu#cases' },
          ],
        },
        { name: t('navigation.touzi'), href: '/touzi' },
      ],
    },
    { key: 'cases', name: t('navigation.cases'), href: '/cases' },
    {
      key: 'company',
      name: t('navigation.company'),
      children: [
        { name: t('navigation.companySub.overview'), href: '/company/overview' },
        { name: t('navigation.companySub.history'), href: '/company/history' },
        { name: t('navigation.companySub.philosophy'), href: '/company/philosophy' },
        { name: t('navigation.companySub.ceo'), href: '/company/ceo' },
        { name: t('navigation.companySub.sns'), href: '/company/sns' },
      ],
    },
    { key: 'careers', name: t('navigation.careers'), href: '/careers' },
    { key: 'tenant', name: t('navigation.tenant'), href: '/tenant' },
    { key: 'contact', name: t('navigation.contact'), href: '/#contact' },
  ], [t])

  return (
    <motion.header className="fixed top-0 left-0 right-0 z-[10000] bg-white shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
          {/* Logo */}
          <motion.div className="flex-shrink-0 flex items-center">
            <a href="/" aria-label="Bourn Mark" className="flex items-center h-full">
              <Image
                src={logo}
                alt="Bourn Mark"
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
                    ref={(node) => {
                      if (node) {
                        dropdownRefs.current[item.key] = node
                      }
                    }}
                    onMouseEnter={() => {
                      // 当鼠标进入整个菜单区域时，确保下拉菜单打开
                      if (openDropdown !== item.key) {
                        setOpenDropdown(item.key)
                      }
                      // 清除任何待关闭的定时器
                      if (hoverTimeoutRef.current) {
                        clearTimeout(hoverTimeoutRef.current)
                        hoverTimeoutRef.current = null
                      }
                    }}
                    onMouseLeave={() => {
                      // 延迟关闭，给用户时间移动到子菜单
                      hoverTimeoutRef.current = setTimeout(() => {
                        setOpenDropdown(null)
                        setHoveredChild(null)
                      }, 400)
                    }}
                  >
                    <button
                      onMouseEnter={() => {
                        // 鼠标进入按钮时，打开下拉菜单
                        setOpenDropdown(item.key)
                        // 清除任何待关闭的定时器
                        if (hoverTimeoutRef.current) {
                          clearTimeout(hoverTimeoutRef.current)
                          hoverTimeoutRef.current = null
                        }
                      }}
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
                          className="absolute right-0 mt-1 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-visible z-[10000]"
                          onMouseEnter={() => {
                            // 清除任何待关闭的定时器
                            if (hoverTimeoutRef.current) {
                              clearTimeout(hoverTimeoutRef.current)
                              hoverTimeoutRef.current = null
                            }
                          }}
                          onMouseLeave={() => {
                            // 延迟关闭，给用户时间移动到子菜单
                            hoverTimeoutRef.current = setTimeout(() => {
                              setHoveredChild(null)
                            }, 400)
                          }}
                        >
                          {item.children.map((child, childIndex) => (
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
                                } else {
                                  // 当鼠标进入没有子菜单的项时，立即关闭其他子菜单
                                  setHoveredChild(null)
                                }
                              }}
                              onMouseLeave={() => {
                                // 延迟关闭，给用户时间移动到子菜单
                                hoverTimeoutRef.current = setTimeout(() => {
                                  setHoveredChild(null)
                                }, 400)
                              }}
                            >
                              <a
                                href={child.href}
                                className={`flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 focus:bg-slate-200 focus:outline-none transition-colors ${
                                  childIndex === 0 ? 'rounded-t-xl' : ''
                                } ${
                                  childIndex === (item.children?.length ?? 0) - 1 ? 'rounded-b-xl' : ''
                                }`}
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
                                      className="absolute left-full top-0 ml-1 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden z-[10001] min-w-[224px]"
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
                                        }, 400)
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
                                          <span className={subChild.href === '/wuye/zengzhi' ? 'nav-rainbow-flash' : ''}>
                                            {subChild.name}
                                          </span>
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
                  className="text-sm xl:text-base text-gray-700 hover:text-navy-700 font-medium transition-colors duration-200 relative group px-2 py-1"
                  onClick={(e) => handleNavClick(e, item.href!)}
                  onMouseEnter={() => {
                    // 当鼠标进入没有下拉菜单的项时，关闭所有下拉菜单
                    if (openDropdown) {
                      setOpenDropdown(null)
                      setHoveredChild(null)
                    }
                    // 清除任何待关闭的定时器
                    if (hoverTimeoutRef.current) {
                      clearTimeout(hoverTimeoutRef.current)
                      hoverTimeoutRef.current = null
                    }
                  }}
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-2 right-2 h-0.5 bg-navy-700 transition-all duration-200 group-hover:w-full w-0"></span>
                </motion.a>
              )
            })}
            <div className="relative ml-2" ref={languageMenuRef}>
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                onMouseEnter={() => {
                  // 当鼠标进入语言选择按钮时，关闭所有下拉菜单
                  if (openDropdown) {
                    setOpenDropdown(null)
                    setHoveredChild(null)
                  }
                  // 清除任何待关闭的定时器
                  if (hoverTimeoutRef.current) {
                    clearTimeout(hoverTimeoutRef.current)
                    hoverTimeoutRef.current = null
                  }
                }}
                className="flex items-center gap-1.5 xl:gap-2 px-2 xl:px-3 py-1.5 xl:py-2 text-gray-700 hover:text-navy-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <span className="text-base xl:text-lg flag-emoji" suppressHydrationWarning>{selectedLanguage.flag}</span>
                <span className="text-xs xl:text-sm font-medium hidden xl:inline" suppressHydrationWarning>{selectedLanguage.label}</span>
                <Globe2 size={16} className="xl:w-[18px] xl:h-[18px]" />
              </button>
              <AnimatePresence>
                {isLanguageOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-[10000]"
                  >
                    {languages.map((lang, index) => (
                      <button
                        key={lang.code}
                        className={`w-full text-left px-4 py-3 flex items-center gap-3 text-sm transition-colors ${
                          lang.code === selectedLanguage.code
                            ? `bg-slate-200 text-gray-800 ${
                                index === 0 ? 'rounded-t-xl' : ''
                              } ${
                                index === languages.length - 1 ? 'rounded-b-xl' : ''
                              }`
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => handleLanguageSelect(lang)}
                      >
                        <span className="text-lg flag-emoji">{lang.flag}</span>
                        <span className="font-medium flex-1">{lang.label}</span>
                        {lang.code === selectedLanguage.code && <Check size={16} className="text-gray-700" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Mobile menu button */}
          <motion.button
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
              className="lg:hidden bg-white border-t border-gray-200"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
                {navigation.map((item, index) => {
                  if (item.children) {
                    const expanded = expandedMobile === item.key
                    return (
                      <motion.div
                        key={item.key}
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
                              className="bg-gray-50"
                            >
                              {item.children.map((child) => {
                                const childKey = `${item.key}:${child.href}`
                                const childExpanded = expandedMobileChild === childKey
                                const hasThird = Array.isArray(child.subChildren) && child.subChildren.length > 0

                                if (!hasThird) {
                                  return (
                                    <a
                                      key={child.name}
                                      href={child.href}
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                      onClick={(e) => {
                                        handleNavClick(e, child.href)
                                        setIsMenuOpen(false)
                                        setExpandedMobile(null)
                                        setExpandedMobileChild(null)
                                      }}
                                    >
                                      {child.name}
                                    </a>
                                  )
                                }

                                return (
                                  <div key={child.name} className="border-t border-gray-100 first:border-t-0">
                                    <div className="flex items-stretch">
                                      <a
                                        href={child.href}
                                        className="flex-1 px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                                        onClick={(e) => {
                                          handleNavClick(e, child.href)
                                          setIsMenuOpen(false)
                                          setExpandedMobile(null)
                                          setExpandedMobileChild(null)
                                        }}
                                      >
                                        {child.name}
                                      </a>
                                      <button
                                        type="button"
                                        aria-label={`展开 ${child.name} 的子菜单`}
                                        className="px-3 py-2 text-gray-700 hover:bg-gray-100"
                                        onClick={() => {
                                          setExpandedMobileChild((prev) => (prev === childKey ? null : childKey))
                                        }}
                                      >
                                        <ChevronDown
                                          size={16}
                                          className={`transition-transform duration-200 ${childExpanded ? 'rotate-180' : ''}`}
                                        />
                                      </button>
                                    </div>
                                    <AnimatePresence initial={false}>
                                      {childExpanded && (
                                        <motion.div className="pb-1">
                                          {child.subChildren!.map((subChild) => (
                                            <a
                                              key={subChild.name}
                                              href={subChild.href}
                                              className="block pl-8 pr-4 py-2 text-[13px] text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                                              onClick={(e) => {
                                                handleNavClick(e, subChild.href)
                                                setIsMenuOpen(false)
                                                setExpandedMobile(null)
                                                setExpandedMobileChild(null)
                                              }}
                                            >
                                              <span className={subChild.href === '/wuye/zengzhi' ? 'nav-rainbow-flash' : ''}>
                                                {subChild.name}
                                              </span>
                                            </a>
                                          ))}
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                )
                              })}
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
                {/* 切换到PC版按钮 */}
                <div className="border-t border-gray-200 pt-3 pb-2">
                  <button
                    onClick={() => {
                      // 设置viewport为desktop宽度
                      const viewport = document.querySelector('meta[name="viewport"]')
                      if (viewport) {
                        viewport.setAttribute('content', 'width=1280')
                      }
                      setIsMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-base font-medium text-navy-700 bg-navy-50 hover:bg-navy-100 rounded-md transition-colors duration-200"
                  >
                    <Monitor size={20} />
                    <span>切换到PC版</span>
                  </button>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  {languages.map((lang, index) => (
                    <motion.button
                      key={lang.code}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-base rounded-md transition-colors duration-200 ${lang.code === selectedLanguage.code ? 'bg-navy-50 text-navy-700' : 'text-gray-700 hover:text-navy-700 hover:bg-gray-50'}`}
                      onClick={() => {
                        handleLanguageSelect(lang)
                        setIsMenuOpen(false)
                        setExpandedMobile(null)
                        setExpandedMobileChild(null)
                        setOpenDropdown(null)
                      }}
                    >
                      <span className="text-xl flag-emoji">{lang.flag}</span>
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
