'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import Link from 'next/link'
import { Building2, TrendingUp, Award, FileText, ArrowRight, ArrowDown, CheckCircle2, X, Calculator } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const currencyLocales: Record<string, string> = {
  JPY: 'ja-JP',
  USD: 'en-US',
  CNY: 'zh-CN',
  TWD: 'zh-TW',
  HKD: 'zh-HK',
  MOP: 'zh-MO',
  EUR: 'de-DE',
  GBP: 'en-GB',
  AUD: 'en-AU',
  KRW: 'ko-KR',
  CAD: 'en-CA',
  NZD: 'en-NZ',
}

const parsePriceToYen = (price: string): number | null => {
  if (!price) return null
  const normalized = price.replace(/[,\s]/g, '')
  let yen = 0
  const okuMatch = normalized.match(/([0-9]+(?:\.[0-9]+)?)億/)
  if (okuMatch) {
    yen += parseFloat(okuMatch[1]) * 100_000_000
  }
  const manMatch = normalized.match(/([0-9]+(?:\.[0-9]+)?)万/)
  if (manMatch) {
    yen += parseFloat(manMatch[1]) * 10_000
  }
  if (yen === 0) {
    const digitMatch = normalized.match(/([0-9]+(?:\.[0-9]+)?)/)
    if (digitMatch) {
      yen = parseFloat(digitMatch[1])
    }
  }
  return Number.isFinite(yen) ? yen : null
}


export default function MaiMaiPage() {
  const { t } = useLanguage()
  const [selectedCurrency, setSelectedCurrency] = useState<string>('JPY')
  const [rates, setRates] = useState<Record<string, number>>({ JPY: 1 })
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [isLoadingRates, setIsLoadingRates] = useState<boolean>(false)
  const [rateError, setRateError] = useState<string | null>(null)
  
  // 右侧工具菜单状态
  const [isToolsOpen, setIsToolsOpen] = useState<boolean>(false)
  
  // 费用弹窗状态
  const [selectedFee, setSelectedFee] = useState<{item: string, rate: string, note: string, type: 'buy' | 'sell'} | null>(null)
  
  // 房贷计算器状态
  const [loanAmount, setLoanAmount] = useState<string>('')
  const [interestRate, setInterestRate] = useState<string>('2.5')
  const [loanYears, setLoanYears] = useState<string>('35')
  const [monthlyPayment, setMonthlyPayment] = useState<string>('')
  
  // 租金收益计算器状态
  const [propertyPrice, setPropertyPrice] = useState<string>('')
  const [yieldRate, setYieldRate] = useState<string>('5.0')
  const [annualRent, setAnnualRent] = useState<string>('')
  const [monthlyRent, setMonthlyRent] = useState<string>('')
  
  // 汇率转换工具状态
  const [fromCurrency, setFromCurrency] = useState<string>('JPY')
  const [toCurrency, setToCurrency] = useState<string>('USD')
  const [fromAmount, setFromAmount] = useState<string>('')
  const [toAmount, setToAmount] = useState<string>('')
  const [isConvertingFrom, setIsConvertingFrom] = useState<boolean>(true)
  
  // 汇率选择菜单ref和状态（用于iPad fixed定位）
  const currencyMenuRef = useRef<HTMLDivElement>(null)
  const currencySectionRef = useRef<HTMLElement>(null)
  const propertiesWithFeeRef = useRef<HTMLDivElement>(null)
  const transactionStepsRef = useRef<HTMLElement>(null)
  const [isCurrencyMenuFixed, setIsCurrencyMenuFixed] = useState<boolean>(false)
  
  // 响应式缩放状态
  const feesContainerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState<number>(1)
  const [windowWidth, setWindowWidth] = useState<number>(0)

  // 货币选项和标签
  const mainCurrencyOptions = useMemo(() => [
    { code: 'JPY', label: t('maimai.currency.JPY') },
    { code: 'USD', label: t('maimai.currency.USD') },
    { code: 'CNY', label: t('maimai.currency.CNY') },
    { code: 'TWD', label: t('maimai.currency.TWD') },
    { code: 'HKD', label: t('maimai.currency.HKD') },
  ], [t])

  const otherCurrencyOptions = useMemo(() => [
    { code: 'MOP', label: t('maimai.currency.MOP') },
    { code: 'EUR', label: t('maimai.currency.EUR') },
    { code: 'GBP', label: t('maimai.currency.GBP') },
    { code: 'AUD', label: t('maimai.currency.AUD') },
    { code: 'KRW', label: t('maimai.currency.KRW') },
    { code: 'CAD', label: t('maimai.currency.CAD') },
    { code: 'NZD', label: t('maimai.currency.NZD') },
  ], [t])

  const currencyLabels: Record<string, string> = useMemo(() => ({
    JPY: t('maimai.currency.JPY'),
    USD: t('maimai.currency.USD'),
    CNY: t('maimai.currency.CNY'),
    TWD: t('maimai.currency.TWD'),
    HKD: t('maimai.currency.HKD'),
    MOP: t('maimai.currency.MOP'),
    EUR: t('maimai.currency.EUR'),
    GBP: t('maimai.currency.GBP'),
    AUD: t('maimai.currency.AUD'),
    KRW: t('maimai.currency.KRW'),
    CAD: t('maimai.currency.CAD'),
    NZD: t('maimai.currency.NZD'),
  }), [t])

  const formatCurrencyValue = (amount: number, currency: string) => {
    const locale = currencyLocales[currency] ?? 'zh-CN'
    const formatter = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    const rounded = Math.round(amount)
    const label = currencyLabels[currency] ?? currency
    
    if (currency === 'JPY') {
      const man = rounded / 10_000
      if (man >= 1) {
        const formattedMan = formatter.format(man)
        return `${formattedMan}${t('maimai.currency.man')}${label}`
      } else {
        const formattedNumber = formatter.format(rounded)
        return `${formattedNumber}${label}`
      }
    }
    
    const formattedNumber = formatter.format(rounded)
    return `${t('maimai.currency.approx')}${formattedNumber}${label}`
  }

  const propertiesNoFee = useMemo(() => [
  {
    title: 'ライオンズマンション東銀座2F',
    price: '42,680万日元',
    area: '127.6㎡',
    type: '店舗・事務所',
    location: '東京都中央区築地',
      feature: t('maimai.properties.noFee'),
      image: '/imgs/Lions Mansion Higashi-Ginza.jpeg',
    href: '/maimai/lions-higashiginza-2f'
  },
  {
      title: '新中野駅上プラザ305号室',
      price: '2,100万日元',
      area: '23.92㎡',
      type: '1R',
    location: '東京都中野区本町',
      feature: t('maimai.properties.noFee'),
    image: '/imgs/maimai/shinnakanoekiue.jpeg',
    href: '/maimai/shin-nakano-ekijou-plaza-305'
  },
  {
      title: '新中野駅上プラザ304号室',
      price: '5,600万日元',
      area: '71.73㎡',
      type: '2LDK',
    location: '東京都中野区本町',
      feature: t('maimai.properties.noFee'),
    image: '/imgs/maimai/shinnakanoekiue.jpeg',
    href: '/maimai/shin-nakano-ekijou-plaza-304'
  },
  ], [t])

  const propertiesWithFee = useMemo(() => [
  {
      title: 'パティオ杉並 2F',
    price: '1,050万日元',
    area: '19.2㎡',
    type: '1R',
    location: '东京都杉并区堀之内',
      feature: t('maimai.properties.withFee'),
    image: '/imgs/maimai/Patio Suginami 2F.jpeg',
    href: '/maimai/patio-suginami-203'
  },
  {
      title: 'セントヒルズ椎名町 4F',
    price: '1,050万日元',
    area: '13.84㎡',
    type: '1R',
    location: '东京都丰岛区长崎',
      feature: t('maimai.properties.withFee'),
    image: '/imgs/maimai/Saint Hills Shiinamachi 4F.jpeg',
    href: '/maimai/cent-hills-shiinamachi-405'
  },
  {
      title: 'パレ・ドール相模原 8F',
    price: '420万日元',
    area: '16.29㎡',
    type: '1K',
    location: '神奈川县相模原市',
      feature: t('maimai.properties.withFee'),
    image: '/imgs/maimai/Palais d\'Or Sagamihara 8F.jpeg',
    href: '/maimai/pale-dor-sagamihara-808'
  },
  {
      title: '日神パレス竹ノ塚 5F',
    price: '700万日元',
    area: '18.09㎡',
    type: '1R',
    location: '东京都足立区伊兴',
      feature: t('maimai.properties.withFee'),
    image: '/imgs/maimai/Nisshin Palace Takenotsuka 5f.jpeg',
    href: '/maimai/nichishin-palace-takenotsuka-509'
  },
  {
      title: 'セザール西高島平 2F',
    price: '1,200万日元',
    area: '27.13㎡',
    type: '2〜3LDK',
    location: '东京都板桥区德丸',
      feature: t('maimai.properties.withFee'),
    image: '/imgs/Cesar Nishi Takashimadaira.jpeg',
    href: '/maimai/cesar-takashimadaira-206'
  },
  {
      title: '美和プラザ高井戸 1F',
    price: '990万日元',
    area: '—',
    type: '1K×3戸',
    location: '东京都杉并区上高井戸',
      feature: t('maimai.properties.withFee'),
    image: '/imgs/maimai/Miwa Plaza Takaido 1.jpeg',
    href: '/maimai/miwa-plaza-takaido-101'
  },
  {
      title: 'LM西八王子第3 7F',
    price: '480万日元',
    area: '18.2㎡',
    type: '1K',
    location: '东京都八王子市八木町',
      feature: t('maimai.properties.withFee'),
    image: '/imgs/maimai/Lions Mansion Nishi Hachioji 3-1.jpeg',
    href: '/maimai/lm-nishihachioji-3-707'
  },
  {
      title: 'スカイコート生田 2F',
    price: '430万日元',
    area: '约17㎡',
    type: '1K',
    location: '神奈川县川崎市多摩区',
      feature: t('maimai.properties.withFee'),
    image: '/imgs/maimai/Sky Court Ikuta.jpeg',
    href: '/maimai/sky-court-ikuta-202'
  },
  ], [t])

  const recentDeals = useMemo(() => [
  {
      title: t('maimai.deals.deal1.title'),
      price: t('maimai.deals.deal1.price'),
      highlight: t('maimai.deals.deal1.highlight'),
      detail: t('maimai.deals.deal1.detail'),
  },
  {
      title: t('maimai.deals.deal2.title'),
      price: t('maimai.deals.deal2.price'),
      highlight: t('maimai.deals.deal2.highlight'),
      detail: t('maimai.deals.deal2.detail'),
  },
  {
      title: t('maimai.deals.deal3.title'),
      price: t('maimai.deals.deal3.price'),
      highlight: t('maimai.deals.deal3.highlight'),
      detail: t('maimai.deals.deal3.detail'),
  },
  ], [t])

  const stats = useMemo(() => [
    { label: t('maimai.stats.transactionAmount'), value: t('maimai.stats.transactionAmountValue') },
    { label: t('maimai.stats.customers'), value: t('maimai.stats.customersValue') },
    { label: t('maimai.stats.avgCycle'), value: t('maimai.stats.avgCycleValue') },
    { label: t('maimai.stats.approvalRate'), value: t('maimai.stats.approvalRateValue') },
  ], [t])

  const transactionSteps = useMemo(() => [
    { step: 1, title: t('maimai.steps.step1.title'), desc: t('maimai.steps.step1.desc'), icon: '📞' },
    { step: 2, title: t('maimai.steps.step2.title'), desc: t('maimai.steps.step2.desc'), icon: '🔍' },
    { step: 3, title: t('maimai.steps.step3.title'), desc: t('maimai.steps.step3.desc'), icon: '🏠' },
    { step: 4, title: t('maimai.steps.step4.title'), desc: t('maimai.steps.step4.desc'), icon: '💼' },
    { step: 5, title: t('maimai.steps.step5.title'), desc: t('maimai.steps.step5.desc'), icon: '📝' },
    { step: 6, title: t('maimai.steps.step6.title'), desc: t('maimai.steps.step6.desc'), icon: '💰' },
    { step: 7, title: t('maimai.steps.step7.title'), desc: t('maimai.steps.step7.desc'), icon: '🔑' },
    { step: 8, title: t('maimai.steps.step8.title'), desc: t('maimai.steps.step8.desc'), icon: '✅' },
  ], [t])

  const buyingFees = useMemo(() => [
    { item: t('maimai.fees.buying.fee1.item'), rate: t('maimai.fees.buying.fee1.rate'), note: t('maimai.fees.buying.fee1.note') },
    { item: t('maimai.fees.buying.fee2.item'), rate: t('maimai.fees.buying.fee2.rate'), note: t('maimai.fees.buying.fee2.note') },
    { item: t('maimai.fees.buying.fee3.item'), rate: t('maimai.fees.buying.fee3.rate'), note: t('maimai.fees.buying.fee3.note') },
    { item: t('maimai.fees.buying.fee4.item'), rate: t('maimai.fees.buying.fee4.rate'), note: t('maimai.fees.buying.fee4.note') },
    { item: t('maimai.fees.buying.fee5.item'), rate: t('maimai.fees.buying.fee5.rate'), note: t('maimai.fees.buying.fee5.note') },
    { item: t('maimai.fees.buying.fee6.item'), rate: t('maimai.fees.buying.fee6.rate'), note: t('maimai.fees.buying.fee6.note') },
    { item: t('maimai.fees.buying.fee7.item'), rate: t('maimai.fees.buying.fee7.rate'), note: t('maimai.fees.buying.fee7.note') },
  ], [t])

  const sellingFees = useMemo(() => [
    { item: t('maimai.fees.selling.fee1.item'), rate: t('maimai.fees.selling.fee1.rate'), note: t('maimai.fees.selling.fee1.note') },
    { item: t('maimai.fees.selling.fee3.item'), rate: t('maimai.fees.selling.fee3.rate'), note: t('maimai.fees.selling.fee3.note') },
    { item: t('maimai.fees.selling.fee4.item'), rate: t('maimai.fees.selling.fee4.rate'), note: t('maimai.fees.selling.fee4.note') },
  ], [t])
  
  // 计算房贷月供
  useEffect(() => {
    if (loanAmount && interestRate && loanYears) {
      const principal = parseFloat(loanAmount)
      const rate = parseFloat(interestRate) / 100 / 12
      const months = parseFloat(loanYears) * 12
      
      if (principal > 0 && rate > 0 && months > 0) {
        const payment = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1)
        setMonthlyPayment(Math.round(payment).toLocaleString('ja-JP') + ' ' + t('maimai.currency.JPY'))
      } else {
        setMonthlyPayment(t('maimai.tools.loan.inputPrompt'))
      }
    } else {
      setMonthlyPayment(t('maimai.tools.loan.inputPrompt'))
    }
  }, [loanAmount, interestRate, loanYears, t])
  
  // iPad Safari 汇率选择菜单置顶处理 - 只在需中介费房源部分为止置顶
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    let scrollHandler: (() => void) | null = null
    let resizeHandler: (() => void) | null = null
    
    const checkAndSetFixed = () => {
      // 检测是否为iPad（包括横屏和竖屏）
      const width = window.innerWidth
      const height = window.innerHeight
      const isIPad = (width >= 768 && width <= 1024) || 
                     (height >= 768 && height <= 1024 && width >= 768)
      
      // 检测是否为手机竖版
      const isMobilePortrait = width <= 767 && height > width
      
      if (!isIPad || isMobilePortrait) {
        // 其他设备（包括手机竖版）使用sticky定位，不使用fixed避免跳动
        setIsCurrencyMenuFixed(false)
        if (scrollHandler) {
          window.removeEventListener('scroll', scrollHandler)
          scrollHandler = null
        }
        return
      }
      
      // iPad上需要根据滚动位置决定是否使用fixed定位
      scrollHandler = () => {
        if (!currencyMenuRef.current || !transactionStepsRef.current || !currencySectionRef.current) return
        
        const menu = currencyMenuRef.current
        const transactionStepsSection = transactionStepsRef.current
        const section = currencySectionRef.current
        const headerHeight = width >= 1024 ? 80 : 64
        
        // 获取日本房产买卖交易流程部分的顶部位置（置顶结束位置）
        const transactionStepsTop = transactionStepsSection.getBoundingClientRect().top + window.scrollY
        const currentScroll = window.scrollY
        const sectionTop = section.getBoundingClientRect().top + window.scrollY
        
        // 当section顶部滚动到header下方，且还没滚动到交易流程部分时，使用fixed定位
        // 置顶区域：从section开始到交易流程部分之前
        const shouldBeFixed = currentScroll >= sectionTop - headerHeight && 
                              currentScroll < transactionStepsTop - headerHeight - menu.offsetHeight
        
        // 使用useState的更新函数形式，避免依赖prev状态
        setIsCurrencyMenuFixed((prev) => {
          if (prev !== shouldBeFixed) {
            // 避免跳动：在切换前记录菜单的视觉位置
            if (shouldBeFixed && !prev) {
              // 从sticky切换到fixed时，记录当前sticky位置
              const menuRect = menu.getBoundingClientRect()
              const stickyTop = menuRect.top
              const targetTop = headerHeight
              
              // 如果位置已经正确，直接切换，不需要补偿
              if (Math.abs(stickyTop - targetTop) < 1) {
                return shouldBeFixed
              }
              
              // 需要补偿位置差时，先设置fixed状态
              // 然后在下一帧用margin-top补偿，再移除margin
              requestAnimationFrame(() => {
                if (currencyMenuRef.current) {
                  const offset = stickyTop - targetTop
                  currencyMenuRef.current.style.marginTop = `${-offset}px`
                  currencyMenuRef.current.style.transition = 'none'
                  // 立即移除margin，让fixed定位生效
                  requestAnimationFrame(() => {
                    if (currencyMenuRef.current) {
                      currencyMenuRef.current.style.marginTop = '0'
                      currencyMenuRef.current.style.transition = ''
                    }
                  })
                }
              })
            }
            return shouldBeFixed
          }
          return prev
        })
      }
      
      scrollHandler()
      window.addEventListener('scroll', scrollHandler, { passive: true })
    }
    
    resizeHandler = () => {
      checkAndSetFixed()
    }
    
    checkAndSetFixed()
    window.addEventListener('resize', resizeHandler)
    
    return () => {
      if (scrollHandler) {
        window.removeEventListener('scroll', scrollHandler)
      }
      if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler)
      }
    }
  }, [])
  
  // 计算租金收益
  useEffect(() => {
    if (propertyPrice && yieldRate) {
      const price = parseFloat(propertyPrice)
      const yieldPercent = parseFloat(yieldRate) / 100
      
      if (price > 0 && yieldPercent > 0) {
        const annual = Math.round(price * yieldPercent)
        const monthly = Math.round(annual / 12)
        setAnnualRent(annual.toLocaleString('ja-JP') + ' ' + t('maimai.currency.JPY'))
        setMonthlyRent(monthly.toLocaleString('ja-JP') + ' ' + t('maimai.currency.JPY'))
      } else {
        setAnnualRent(t('maimai.tools.rental.inputPrompt'))
        setMonthlyRent(t('maimai.tools.rental.inputPrompt'))
      }
    } else {
      setAnnualRent(t('maimai.tools.rental.inputPrompt'))
      setMonthlyRent(t('maimai.tools.rental.inputPrompt'))
    }
  }, [propertyPrice, yieldRate, t])
  
  // 计算响应式缩放比例
  useEffect(() => {
    const calculateScale = () => {
      if (typeof window === 'undefined') return
      
      const width = window.innerWidth
      setWindowWidth(width)
      
      // 基准宽度（桌面版设计宽度，考虑 max-w-5xl = 80rem = 1280px）
      const containerMaxWidth = 1280 // max-w-5xl
      const padding = 32 // px-8 = 2rem = 32px
      const availableWidth = width - (padding * 2)
      
      // 根据不同屏幕尺寸设置缩放比例
      let newScale = 1
      if (width < 640) {
        // 手机竖屏 (< 640px) - 单列布局，不需要缩放
        newScale = 1
      } else if (width < 768) {
        // 手机横屏 / 小平板 (640px - 768px)
        // 计算需要缩放的比例，确保内容完整显示
        newScale = Math.min(availableWidth / containerMaxWidth, 1)
        newScale = Math.max(newScale, 0.75)
      } else if (width < 1024) {
        // 平板 (768px - 1024px)
        newScale = Math.min(availableWidth / containerMaxWidth, 1)
        newScale = Math.max(newScale, 0.85)
      } else if (width < 1280) {
        // 小桌面 (1024px - 1280px)
        newScale = Math.min(availableWidth / containerMaxWidth, 1)
        newScale = Math.max(newScale, 0.9)
      } else {
        // 大桌面 (>= 1280px)
        newScale = 1
      }
      
      setScale(newScale)
    }
    
    calculateScale()
    const resizeObserver = new ResizeObserver(calculateScale)
    if (feesContainerRef.current) {
      resizeObserver.observe(feesContainerRef.current)
    }
    window.addEventListener('resize', calculateScale)
    
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', calculateScale)
    }
  }, [])
  
  // 汇率转换计算
  useEffect(() => {
    if (isConvertingFrom && fromAmount) {
      const amount = parseFloat(fromAmount)
      if (!isNaN(amount) && amount >= 0 && rates[fromCurrency] && rates[toCurrency]) {
        // 先转换为日元，再转换为目标货币
        const yenAmount = fromCurrency === 'JPY' ? amount : amount / rates[fromCurrency]
        const converted = toCurrency === 'JPY' ? yenAmount : yenAmount * rates[toCurrency]
        setToAmount(converted.toFixed(2))
      } else if (!fromAmount) {
        setToAmount('')
      }
    }
  }, [fromAmount, fromCurrency, toCurrency, rates, isConvertingFrom])
  
  useEffect(() => {
    if (!isConvertingFrom && toAmount) {
      const amount = parseFloat(toAmount)
      if (!isNaN(amount) && amount >= 0 && rates[fromCurrency] && rates[toCurrency]) {
        // 先转换为日元，再转换为源货币
        const yenAmount = toCurrency === 'JPY' ? amount : amount / rates[toCurrency]
        const converted = fromCurrency === 'JPY' ? yenAmount : yenAmount * rates[fromCurrency]
        setFromAmount(converted.toFixed(2))
      } else if (!toAmount) {
        setFromAmount('')
      }
    }
  }, [toAmount, fromCurrency, toCurrency, rates, isConvertingFrom])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const loadRates = async () => {
      try {
        setIsLoadingRates(true)
        setRateError(null)

        const cached = localStorage.getItem('fx-rates-jpy')
        if (cached) {
          const parsed = JSON.parse(cached) as { timestamp: number; rates: Record<string, number>; updated: string }
          if (Date.now() - parsed.timestamp < 60 * 60 * 1000) {
            setRates(parsed.rates)
            setLastUpdated(parsed.updated)
            setIsLoadingRates(false)
            return
          }
        }

        const response = await fetch('https://open.er-api.com/v6/latest/JPY')
        if (!response.ok) {
          throw new Error('Rate service unavailable')
        }
        const data = await response.json()
        const fetchedRates: Record<string, number> = { ...data.rates, JPY: 1 }
        const updated = new Date(data.time_last_update_unix * 1000).toLocaleString('zh-CN')
        setRates(fetchedRates)
        setLastUpdated(updated)
        localStorage.setItem('fx-rates-jpy', JSON.stringify({ timestamp: Date.now(), rates: fetchedRates, updated }))
      } catch (error) {
        console.error(error)
        setRateError(t('maimai.currency.rateUpdateFailed'))
      } finally {
        setIsLoadingRates(false)
      }
    }

    loadRates()
  }, [t])
  

  const isOtherCurrencySelected = useMemo(
    () => otherCurrencyOptions.some((currency) => currency.code === selectedCurrency),
    [selectedCurrency, otherCurrencyOptions]
  )

  const currencyDisplay = (price: string) => {
    const yen = parsePriceToYen(price)
    if (yen === null) return price
    const rate = rates[selectedCurrency]
    if (!rate) return '—'
    const converted = yen * rate
    return formatCurrencyValue(converted, selectedCurrency)
  }

  return (
    <PageLayout>
      <section className="relative pt-28 pb-16 bg-gradient-to-br from-emerald-800 via-emerald-700 to-navy-800 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt={t('maimai.title')}
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 to-navy-900/60"></div>
        </div>
        <div className="relative z-10 container-custom">
          <p className="text-sm text-emerald-300 font-semibold mb-4 drop-shadow-md">{t('maimai.subtitle')}</p>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-6 whitespace-nowrap drop-shadow-lg">{t('maimai.title')}</h1>
          <p className="text-lg text-gray-200 max-w-3xl leading-relaxed drop-shadow-md">
            {t('maimai.description')}
          </p>
        </div>
      </section>

        {/* 正在销售的房产 - 免中介费 */}
        <section ref={currencySectionRef} className="relative section-padding">
          {/* 背景装饰 */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-100/30 to-blue-100/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-navy-100/20 to-emerald-100/30 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
          </div>
          
          <div className="container-custom relative z-10">
            {/* 汇率选择菜单 - 固定置顶（桌面端和移动端都置顶，考虑Header高度） */}
            {/* iPad Safari 使用 fixed 定位，其他使用 sticky */}
            <div 
              ref={currencyMenuRef}
              className={`currency-sticky top-16 md:top-20 lg:top-20 bg-gradient-to-br from-emerald-800 via-emerald-700 to-navy-800 py-4 mb-6 shadow-lg backdrop-blur-sm transition-none ${
                isCurrencyMenuFixed ? 'fixed left-0 right-0 z-[60]' : 'sticky -mx-6 px-6 z-50'
              }`}
              style={isCurrencyMenuFixed ? {
                top: typeof window !== 'undefined' && window.innerWidth >= 1024 ? '80px' : '64px',
                width: '100%',
              } : {}}
            >
              <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${isCurrencyMenuFixed ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' : ''}`}>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white whitespace-nowrap">{t('maimai.properties.title')}</h2>
                <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {mainCurrencyOptions.map((option) => (
                      <button
                        key={option.code}
                        onClick={() => setSelectedCurrency(option.code)}
                        className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                          selectedCurrency === option.code
                            ? 'bg-navy-700 text-white border-navy-700 shadow-lg'
                            : 'border-gray-200 text-white hover:border-gray-300 hover:text-gray-100'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white">{t('maimai.currency.other')}</span>
                      <select
                        value={isOtherCurrencySelected ? selectedCurrency : ''}
                        onChange={(event) => {
                          const value = event.target.value
                          if (value) {
                            setSelectedCurrency(value)
                          }
                        }}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 bg-white"
                        suppressHydrationWarning
                      >
                        <option value="">{t('maimai.currency.select')}</option>
                        {otherCurrencyOptions.map((option) => (
                          <option key={option.code} value={option.code}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="text-sm text-gray-200">
                    {rateError ? rateError : isLoadingRates ? t('maimai.currency.updating') : lastUpdated ? `${t('maimai.currency.updateTime')}${lastUpdated}` : t('maimai.currency.baseNote')}
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg maimai-properties-panel maimai-properties-panel--no-fee">
              <h3 className="text-xl font-semibold text-green-600 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                {t('maimai.properties.noFeeTitle')}
              </h3>
              <div className="overflow-x-auto pb-4 -mx-2 px-2" id="maimai-properties-no-fee">
                <div className="flex gap-6 min-w-max">
                  {propertiesNoFee.map((property, index) => (
                    property.href ? (
                      <Link
                        key={index}
                        href={property.href}
                        className="flex-shrink-0 w-80 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer block group flex flex-col maimai-property-card"
                      >
                        <div className="relative h-48 bg-gray-200 overflow-hidden">
                          <Image
                            src={property.image}
                            alt={property.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="320px"
                            style={{ borderRadius: 0 }}
                          />
                          <div className="absolute top-3 right-3 bg-green-500 text-navy-900 px-3 py-1 rounded-full text-xs font-semibold">
                            {property.feature}
                          </div>
                        </div>
                        <div className="p-2 md:p-3 flex flex-col flex-1" style={{ padding: '1rem' }}>
                          <h4 className="text-lg font-semibold text-navy-900 mb-2 group-hover:text-blue-700 transition-colors">{property.title}</h4>
                          <p className="text-2xl font-bold text-navy-700 mb-1">{currencyDisplay(property.price)}</p>
                          {selectedCurrency !== 'JPY' && (
                            <p className="text-xs text-gray-500 mb-2">{t('maimai.properties.jpyPrice')}：{property.price}</p>
                          )}
                          <div className="flex flex-wrap gap-3 text-sm text-gray-700 mb-2">
                            <span className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              {property.area}
                            </span>
                            <span>{property.type}</span>
                          </div>
                          <div className="text-sm text-gray-700 mb-auto">
                            {property.location}
                          </div>
                          <div className="w-full mt-4 bg-blue-600 group-hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium text-center">
                            {t('maimai.properties.viewDetails')}
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <div key={index} className="flex-shrink-0 w-80 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col maimai-property-card">
                        <div className="relative h-48 bg-gray-200 overflow-hidden">
                          <Image
                            src={property.image}
                            alt={property.title}
                            fill
                            className="object-cover"
                            sizes="320px"
                            style={{ borderRadius: 0 }}
                          />
                          <div className="absolute top-3 right-3 bg-green-500 text-navy-900 px-3 py-1 rounded-full text-xs font-semibold">
                            {property.feature}
                          </div>
                        </div>
                        <div className="p-2 md:p-3 flex flex-col flex-1" style={{ padding: '1rem' }}>
                          <h4 className="text-lg font-semibold text-navy-900 mb-2">{property.title}</h4>
                          <p className="text-2xl font-bold text-navy-700 mb-1">{currencyDisplay(property.price)}</p>
                          {selectedCurrency !== 'JPY' && (
                            <p className="text-xs text-gray-500 mb-2">{t('maimai.properties.jpyPrice')}：{property.price}</p>
                          )}
                          <div className="flex flex-wrap gap-3 text-sm text-gray-700 mb-2">
                            <span className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              {property.area}
                            </span>
                            <span>{property.type}</span>
                          </div>
                          <div className="text-sm text-gray-700 mb-auto">
                            {property.location}
                          </div>
                          <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium">
                            {t('maimai.properties.viewDetails')}
                          </button>
                        </div>
                      </div>
                    )
                  ))}
                  {/* Coming Soon 卡片 */}
                  <div className="flex-shrink-0 w-80 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-400 mb-2">{t('maimai.properties.comingSoon')}</div>
                        <div className="text-sm text-gray-500">{t('maimai.properties.preparing')}</div>
                      </div>
                      <div className="absolute top-3 right-3 bg-gray-400 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {t('maimai.properties.inPreparation')}
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h4 className="text-lg font-semibold text-gray-400 mb-2">{t('maimai.properties.newPropertyInfo')}</h4>
                      <p className="text-2xl font-bold text-gray-400 mb-1">—</p>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-2">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          —
                        </span>
                        <span>—</span>
                      </div>
                      <div className="text-sm text-gray-400 mb-auto">
                        —
                      </div>
                      <button className="w-full mt-4 bg-gray-300 text-gray-500 px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium cursor-not-allowed" disabled>
                        {t('maimai.properties.inPreparation')}
                      </button>
                    </div>
                  </div>
                  {/* Coming Soon 卡片 2 */}
                  <div className="flex-shrink-0 w-80 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-400 mb-2">{t('maimai.properties.comingSoon')}</div>
                        <div className="text-sm text-gray-500">{t('maimai.properties.preparing')}</div>
                      </div>
                      <div className="absolute top-3 right-3 bg-gray-400 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {t('maimai.properties.inPreparation')}
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h4 className="text-lg font-semibold text-gray-400 mb-2">{t('maimai.properties.newPropertyInfo')}</h4>
                      <p className="text-2xl font-bold text-gray-400 mb-1">—</p>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-2">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          —
                        </span>
                        <span>—</span>
                      </div>
                      <div className="text-sm text-gray-400 mb-auto">
                        —
                      </div>
                      <button className="w-full mt-4 bg-gray-300 text-gray-500 px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium cursor-not-allowed" disabled>
                        {t('maimai.properties.inPreparation')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 需中介费房源 */}
            <div ref={propertiesWithFeeRef} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg mt-6 maimai-properties-panel maimai-properties-panel--with-fee">
              <h3 className="text-xl font-semibold text-orange-600 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {t('maimai.properties.withFeeTitle')}
              </h3>
              <div className="overflow-x-auto pb-4 -mx-2 px-2" id="maimai-properties-with-fee">
                <div className="flex gap-6 min-w-max">
                  {propertiesWithFee.map((property, index) => (
                    property.href ? (
                      <Link
                        key={index}
                        href={property.href}
                        className="flex-shrink-0 w-80 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer block group flex flex-col maimai-property-card"
                      >
                        <div className="relative h-48 bg-gray-200">
                          <Image
                            src={property.image}
                            alt={property.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="320px"
                          />
                          <div className="absolute top-3 right-3 bg-orange-500 text-navy-900 px-3 py-1 rounded-full text-xs font-semibold">
                            {property.feature}
                          </div>
                        </div>
                        <div className="p-2 md:p-3 flex flex-col flex-1">
                          <h4 className="text-lg font-semibold text-navy-900 mb-2 group-hover:text-blue-700 transition-colors">{property.title}</h4>
                          <p className="text-2xl font-bold text-navy-700 mb-1">{currencyDisplay(property.price)}</p>
                          {selectedCurrency !== 'JPY' && (
                            <p className="text-xs text-gray-500 mb-2">{t('maimai.properties.jpyPrice')}：{property.price}</p>
                          )}
                          <div className="flex flex-wrap gap-3 text-sm text-gray-700 mb-2">
                            <span className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              {property.area}
                            </span>
                            <span>{property.type}</span>
                          </div>
                          <div className="text-sm text-gray-700 mb-auto">
                            {property.location}
                          </div>
                          <div className="w-full mt-4 bg-blue-600 group-hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium text-center">
                            {t('maimai.properties.viewDetails')}
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <div key={index} className="flex-shrink-0 w-80 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col maimai-property-card">
                        <div className="relative h-48 bg-gray-200">
                          <Image
                            src={property.image}
                            alt={property.title}
                            fill
                            className="object-cover"
                            sizes="320px"
                          />
                          <div className="absolute top-3 right-3 bg-orange-500 text-navy-900 px-3 py-1 rounded-full text-xs font-semibold">
                            {property.feature}
                          </div>
                        </div>
                        <div className="p-2 md:p-3 flex flex-col flex-1">
                          <h4 className="text-lg font-semibold text-navy-900 mb-2">{property.title}</h4>
                          <p className="text-2xl font-bold text-navy-700 mb-1">{currencyDisplay(property.price)}</p>
                          {selectedCurrency !== 'JPY' && (
                            <p className="text-xs text-gray-500 mb-2">{t('maimai.properties.jpyPrice')}：{property.price}</p>
                          )}
                          <div className="flex flex-wrap gap-3 text-sm text-gray-700 mb-2">
                            <span className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              {property.area}
                            </span>
                            <span>{property.type}</span>
                          </div>
                          <div className="text-sm text-gray-700 mb-auto">
                            {property.location}
                          </div>
                          <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium">
                            {t('maimai.properties.viewDetails')}
                          </button>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 日本房产买卖交易流程 */}
        <section ref={transactionStepsRef} className="relative section-padding">
          <div className="container-custom relative z-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-12 text-center whitespace-nowrap">{t('maimai.process.title')}</h2>
            
            {/* 桌面端：横向一排布局，确保整行显示 */}
            <div className="hidden lg:flex items-center justify-center pb-8 w-full overflow-hidden">
              <div className="flex items-center flex-nowrap w-full" style={{ maxWidth: 'calc(100vw - 4rem)', gap: '-2px' }}>
                {transactionSteps.map((item) => (
                  <div key={item.step} className="flex-shrink-0" style={{ width: 'calc((100% - 0px) / 8)', marginRight: '-2px' }}>
                    {/* 步骤卡片 */}
                    <div className="relative group h-full">
                      {/* 钝角箭头背景 - 更高设计，紧密排列 */}
                      <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 text-white px-3 py-10 h-full shadow-lg hover:shadow-xl transition-all duration-300 overflow-visible"
                        style={{
                          clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 50%, calc(100% - 24px) 100%, 0 100%, 24px 50%)',
                          width: '100%',
                        }}>
                        <div className="flex flex-col items-center text-center h-full justify-center relative">
                          {/* 步骤数字 - 居中在图标上方，大幅向上移动，不遮挡图标 */}
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-blue-500">
                              <span className="text-blue-700 font-extrabold text-lg">{item.step}</span>
                            </div>
                          </div>
                          {/* 图标 */}
                          <div className="text-4xl mb-2 mt-6">{item.icon}</div>
                          {/* 标题 */}
                          <h3 className="text-xs md:text-sm font-bold leading-tight px-1 mt-1 whitespace-nowrap">{item.title}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 手机 & iPad 竖版：横向可滚动，蓝色箭头样式与桌面版一致 */}
            <div className="lg:hidden pb-4">
              <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
                <div className="flex items-center flex-nowrap min-w-max" style={{ gap: '-2px' }}>
                  {transactionSteps.map((item) => (
                    <div key={item.step} className="flex-shrink-0" style={{ width: 180, marginRight: '-2px' }}>
                      <div className="relative group h-full">
                        <div
                          className="relative bg-gradient-to-br from-blue-600 to-blue-700 text-white px-3 py-10 h-full shadow-lg hover:shadow-xl transition-all duration-300 overflow-visible"
                        style={{
                            clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 50%, calc(100% - 24px) 100%, 0 100%, 24px 50%)',
                            width: '100%',
                          }}
                        >
                        <div className="flex flex-col items-center text-center h-full justify-center relative">
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-blue-500">
                                <span className="text-blue-700 font-extrabold text-lg">{item.step}</span>
                            </div>
                          </div>
                            <div className="text-4xl mb-2 mt-6">{item.icon}</div>
                            <h3 className="text-sm font-bold leading-tight px-1 mt-1 whitespace-nowrap">{item.title}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 交易费用一览 */}
        <section id="fees" className="relative section-padding overflow-hidden fees-section-mobile">
          {/* 背景图片 */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt={t('maimai.fees.backgroundImageAlt')}
              fill
              className="object-cover opacity-15"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-navy-900/90 via-navy-800/85 to-navy-900/90"></div>
          </div>
          {/* 装饰元素 */}
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-emerald-500/20 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 border-2 border-blue-500/20 rounded-full"></div>
          <div className="absolute top-1/2 left-5 w-20 h-20 bg-emerald-500/10 rounded-lg transform rotate-45"></div>
          
          <div className="container-custom relative z-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 text-center whitespace-nowrap">{t('maimai.fees.title')}</h2>
            <p className="text-sm md:text-base text-gray-300 text-center mb-8 max-w-3xl mx-auto leading-relaxed" dangerouslySetInnerHTML={{ __html: t('maimai.fees.description') }} />
            <div 
              className="w-full flex justify-center"
            >
              <div 
                ref={feesContainerRef}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl w-full bg-white/80 backdrop-blur-sm rounded-2xl px-2 md:px-3 pt-2 md:pt-3 pb-2 md:pb-3 border-2 border-gray-200 shadow-lg"
                style={{
                  transform: scale < 1 && windowWidth >= 640 ? `scale(${scale})` : 'none',
                  transformOrigin: 'center top',
                  transition: 'transform 0.3s ease-out',
                  marginBottom: scale < 1 && windowWidth >= 640 ? `${(1 - scale) * 100}px` : '0'
                }}
              >
              {/* 买房费用 */}
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-2 md:p-3 border border-blue-100 shadow-md h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">{t('maimai.fees.buy')}</span>
                  </div>
                    <h3 className="text-xl md:text-2xl font-bold text-navy-700">{t('maimai.fees.buyingTitle')}</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {buyingFees.map((fee, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedFee({...fee, type: 'buy'})}
                      className="group relative bg-white rounded-xl px-2 py-2 border-2 border-blue-200 shadow-sm hover:shadow-lg hover:border-blue-400 hover:scale-105 transition-all duration-300 cursor-pointer text-left overflow-hidden"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors flex-shrink-0">
                          <span className="text-blue-600 text-xs font-bold">{index + 1}</span>
                        </div>
                        <p className="text-xs md:text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors truncate flex-1 min-w-0">{fee.item}</p>
                      </div>
                      <div className="text-right mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-blue-500 text-xs">{t('maimai.fees.clickToView')} →</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 卖房费用 */}
              <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-2 md:p-3 border border-green-100 shadow-md h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">{t('maimai.fees.sell')}</span>
                  </div>
                    <h3 className="text-xl md:text-2xl font-bold text-navy-700">{t('maimai.fees.sellingTitle')}</h3>
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="grid grid-cols-2 gap-3">
                    {sellingFees.map((fee, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedFee({...fee, type: 'sell'})}
                        className="group relative bg-white rounded-xl px-2 py-2 border-2 border-green-200 shadow-sm hover:shadow-lg hover:border-green-400 hover:scale-105 transition-all duration-300 cursor-pointer text-left overflow-hidden"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors flex-shrink-0">
                            <span className="text-green-600 text-xs font-bold">{index + 1}</span>
                          </div>
                          <p className="text-xs md:text-sm font-semibold text-gray-800 group-hover:text-green-700 transition-colors truncate flex-1 min-w-0">{fee.item}</p>
                        </div>
                        <div className="text-right mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-green-500 text-xs">{t('maimai.fees.clickToView')} →</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <p className="text-sm md:text-base text-gray-600 mt-4 pt-4 border-t border-gray-200 leading-relaxed" dangerouslySetInnerHTML={{ __html: t('maimai.fees.nonResidentNote') }} />
                </div>
              </div>
              <p className="text-sm md:text-base text-gray-600 -mt-1 pt-0 border-t border-gray-300 leading-relaxed text-center whitespace-nowrap">
                {t('maimai.fees.disclaimer')}
              </p>
            </div>
            </div>
          </div>
        </section>

        {/* 费用详情弹窗 */}
        {selectedFee && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99999] flex items-center justify-center p-4"
            onClick={() => setSelectedFee(null)}
          >
            <div 
              className={`bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl transform transition-all duration-300 scale-100 border-t-4 ${
                selectedFee.type === 'buy' ? 'border-blue-600' : 'border-green-600'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  selectedFee.type === 'buy' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  <span className={`text-3xl font-bold ${
                    selectedFee.type === 'buy' ? 'text-blue-600' : 'text-green-600'
                  }`}>
                    {selectedFee.type === 'buy' ? t('maimai.fees.buy') : t('maimai.fees.sell')}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800">{selectedFee.item}</h3>
                  <p className="text-sm text-gray-500">{selectedFee.type === 'buy' ? t('maimai.fees.buyingTitle') : t('maimai.fees.sellingTitle')}</p>
                </div>
              </div>
              
              <div className={`rounded-xl p-5 mb-6 ${
                selectedFee.type === 'buy' ? 'bg-blue-50' : 'bg-green-50'
              }`}>
                {selectedFee.item === t('maimai.fees.selling.fee3.item') ? (
                  <>
                    <p className="text-sm text-gray-500 mb-2">{t('maimai.fees.referenceAmount')}</p>
                    <p className={`text-xl md:text-2xl font-bold ${
                      selectedFee.type === 'buy' ? 'text-blue-700' : 'text-green-700'
                    }`}>
                      {t('maimai.fees.capitalGainsTax')}
                    </p>
                  </>
                ) : selectedFee.type === 'buy' ? (
                  <>
                    <p className="text-sm text-gray-500 mb-2">{t('maimai.fees.referenceAmount')}</p>
                    <p className="text-xl md:text-2xl font-bold text-blue-700">
                      {selectedFee.note}
                    </p>
                    <p className="text-sm text-gray-600 mt-3">{selectedFee.rate}</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-500 mb-2">{t('maimai.fees.referenceAmount')}</p>
                    <p className="text-xl md:text-2xl font-bold text-green-700">
                      {selectedFee.rate}
                    </p>
                    <p className="text-sm text-gray-600 mt-3">{selectedFee.note}</p>
                  </>
                )}
              </div>
              
              <button
                onClick={() => setSelectedFee(null)}
                className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-lg ${
                  selectedFee.type === 'buy' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                ← {t('maimai.fees.back')}
              </button>
            </div>
          </div>
        )}

        {/* 近期交易房产 & 年度交易额段落已移除 */}
        
        {/* 右侧工具菜单 */}
        <>
          {/* 触发按钮 */}
          <button
            onClick={() => setIsToolsOpen(!isToolsOpen)}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-navy-700 hover:bg-navy-800 text-white px-4 py-6 rounded-l-2xl shadow-2xl transition-all duration-300 flex items-center gap-2 group tools-button-landscape"
            aria-label={t('maimai.tools.openMenu')}
          >
            <Calculator className="w-6 h-6" />
            <span className="hidden md:block text-sm font-medium whitespace-nowrap">{t('maimai.tools.title')}</span>
          </button>
          
          {/* 滑出菜单 */}
          <div
            className={`fixed right-0 top-16 md:top-20 bottom-0 w-full md:w-[480px] bg-white shadow-2xl z-[99999] transition-transform duration-300 ease-in-out ${
              isToolsOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="h-full overflow-y-auto pb-20">
              {/* 菜单头部 */}
              <div className="sticky top-0 bg-navy-700 text-white p-6 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-1 whitespace-nowrap">{t('maimai.tools.title')}</h2>
                  <p className="text-sm text-gray-200">{t('maimai.tools.subtitle')}</p>
                </div>
                <button
                  onClick={() => setIsToolsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label={t('maimai.tools.closeMenu')}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* 工具内容 */}
              <div className="p-2 md:p-3 space-y-4">
                {/* 房贷计算器 */}
                <div className="bg-white rounded-2xl shadow-lg p-3 md:p-4 border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-navy-700" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{t('maimai.tools.loan.title')}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('maimai.tools.loan.amount')}
                      </label>
                      <input
                        type="number"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                        placeholder={t('maimai.tools.loan.placeholder')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        suppressHydrationWarning
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('maimai.tools.loan.interestRate')}
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        suppressHydrationWarning
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('maimai.tools.loan.years')}
                      </label>
                      <input
                        type="number"
                        value={loanYears}
                        onChange={(e) => setLoanYears(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        suppressHydrationWarning
                      />
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-gray-700 mb-1">{t('maimai.tools.loan.monthlyPayment')}</p>
                      <p className="text-2xl font-bold text-navy-700">
                        {monthlyPayment}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 租金收益计算器 */}
                <div className="bg-white rounded-2xl shadow-lg p-3 md:p-4 border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{t('maimai.tools.rental.title')}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('maimai.tools.rental.price')}
                      </label>
                      <input
                        type="number"
                        value={propertyPrice}
                        onChange={(e) => setPropertyPrice(e.target.value)}
                        placeholder={t('maimai.tools.rental.placeholder')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        suppressHydrationWarning
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('maimai.tools.rental.yieldRate')}
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={yieldRate}
                        onChange={(e) => setYieldRate(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        suppressHydrationWarning
                      />
                    </div>

                    <div className="mt-6 space-y-3">
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-gray-700 mb-1">{t('maimai.tools.rental.annualIncome')}</p>
                        <p className="text-2xl font-bold text-green-600">
                          {annualRent}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700 mb-1">{t('maimai.tools.rental.monthlyIncome')}</p>
                        <p className="text-xl font-bold text-gray-700">
                          {monthlyRent}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 汇率转换工具 */}
                <div className="bg-white rounded-2xl shadow-lg p-3 md:p-4 border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{t('maimai.tools.currency.title')}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {/* 上方输入框 - 源货币 */}
                    <div>
                      <div className="flex gap-2">
                        <select
                          value={fromCurrency}
                          onChange={(e) => {
                            setFromCurrency(e.target.value)
                            setIsConvertingFrom(true)
                          }}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                          suppressHydrationWarning
                        >
                          {[...mainCurrencyOptions, ...otherCurrencyOptions].map((option) => (
                            <option key={option.code} value={option.code}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          value={fromAmount}
                          onChange={(e) => {
                            setFromAmount(e.target.value)
                            setIsConvertingFrom(true)
                          }}
                          placeholder={t('maimai.tools.currency.inputAmount')}
                          className="flex-1 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-0 overflow-hidden"
                          suppressHydrationWarning
                        />
                      </div>
                    </div>

                    {/* 中间交换按钮 */}
                    <div className="flex justify-center">
                      <button
                        onClick={() => {
                          const tempCurrency = fromCurrency
                          const tempAmount = fromAmount
                          setFromCurrency(toCurrency)
                          setToCurrency(tempCurrency)
                          setFromAmount(toAmount)
                          setToAmount(tempAmount)
                          setIsConvertingFrom(true)
                        }}
                        className="p-2 bg-purple-100 hover:bg-purple-200 rounded-full transition-colors"
                        aria-label={t('maimai.tools.currency.swap')}
                      >
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                      </button>
                    </div>

                    {/* 下方输入框 - 目标货币 */}
                    <div>
                      <div className="flex gap-2">
                        <select
                          value={toCurrency}
                          onChange={(e) => {
                            setToCurrency(e.target.value)
                            setIsConvertingFrom(false)
                          }}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                          suppressHydrationWarning
                        >
                          {[...mainCurrencyOptions, ...otherCurrencyOptions].map((option) => (
                            <option key={option.code} value={option.code}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          value={toAmount}
                          onChange={(e) => {
                            setToAmount(e.target.value)
                            setIsConvertingFrom(false)
                          }}
                          placeholder={t('maimai.tools.currency.result')}
                          className="flex-1 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-0 overflow-hidden"
                          suppressHydrationWarning
                        />
                      </div>
                    </div>

                    {/* 汇率信息 */}
                    {fromCurrency !== toCurrency && rates[fromCurrency] && rates[toCurrency] && (() => {
                      // 计算1单位源货币对应的目标货币金额
                      let rateValue: number
                      if (fromCurrency === 'JPY') {
                        rateValue = rates[toCurrency]
                      } else if (toCurrency === 'JPY') {
                        rateValue = 1 / rates[fromCurrency]
                      } else {
                        rateValue = (1 / rates[fromCurrency]) * rates[toCurrency]
                      }
                      
                      // 格式化：保留小数点后3位有效数字（去除末尾的0）
                      const formatRate = (value: number): string => {
                        // 使用toFixed(6)确保精度，然后去除末尾的0
                        let formatted = value.toFixed(6)
                        // 去除末尾的0和小数点
                        formatted = formatted.replace(/\.?0+$/, '')
                        // 如果小数点后超过3位，截取前3位有效数字
                        if (formatted.includes('.')) {
                          const parts = formatted.split('.')
                          if (parts[1] && parts[1].length > 3) {
                            // 保留3位有效数字
                            const significant = parseFloat(formatted).toPrecision(3)
                            formatted = parseFloat(significant).toString()
                          }
                        }
                        return formatted
                      }
                      
                      return (
                        <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200 overflow-hidden">
                          <p className="text-sm text-gray-700 mb-1">{t('maimai.tools.currency.currentRate')}</p>
                          <p className="text-sm text-gray-600 break-words">
                            1 {currencyLabels[fromCurrency]} = {formatRate(rateValue)} {currencyLabels[toCurrency]}
                          </p>
                          <div className="mt-2 text-xs text-gray-500 break-words overflow-hidden">
                            {rateError ? rateError : isLoadingRates ? t('maimai.currency.updating') : lastUpdated ? `${t('maimai.currency.updateTimeLabel')}${lastUpdated}` : t('maimai.currency.baseNote')}
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 遮罩层 */}
          {isToolsOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-[99998] transition-opacity duration-300"
              onClick={() => setIsToolsOpen(false)}
            />
          )}
        </>
    </PageLayout>
  )
}

