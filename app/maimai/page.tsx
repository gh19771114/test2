'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import Link from 'next/link'
import { Building2, TrendingUp, Award, FileText, ArrowRight, ArrowDown, CheckCircle2, X, Calculator } from 'lucide-react'

const mainCurrencyOptions = [
  { code: 'JPY', label: '日元' },
  { code: 'USD', label: '美元' },
  { code: 'CNY', label: '人民币' },
  { code: 'TWD', label: '新台币' },
  { code: 'HKD', label: '港币' },
]

const otherCurrencyOptions = [
  { code: 'MOP', label: '澳门元' },
  { code: 'EUR', label: '欧元' },
  { code: 'GBP', label: '英镑' },
  { code: 'AUD', label: '澳元' },
  { code: 'KRW', label: '韩元' },
  { code: 'CAD', label: '加拿大元' },
  { code: 'NZD', label: '新西兰元' },
]

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

const currencyLabels: Record<string, string> = {
  JPY: '日元',
  USD: '美元',
  CNY: '人民币',
  TWD: '新台币',
  HKD: '港币',
  MOP: '澳门元',
  EUR: '欧元',
  GBP: '英镑',
  AUD: '澳元',
  KRW: '韩元',
  CAD: '加拿大元',
  NZD: '新西兰元',
}

const propertiesNoFee = [
  {
    title: 'ライオンズマンション東銀座2F',
    price: '42,680万日元',
    area: '127.6㎡',
    type: '店舗・事務所',
    location: '東京都中央区築地',
    feature: '免中介费',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    href: '/maimai/lions-higashiginza-2f'
  },
  {
    title: '新中野駅上プラザ3楼',
    price: '5,200万日元',
    area: '52㎡',
    type: '1LDK',
    location: '東京都中野区本町',
    feature: '免中介费',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    href: '/maimai/shin-nakano-ekijou-plaza-304'
  },
]

const propertiesWithFee = [
  {
    title: 'パティオ杉並 2楼',
    price: '1,050万日元',
    area: '19.2㎡',
    type: '1R',
    location: '东京都杉并区堀之内',
    feature: '需中介费',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    href: '/maimai/patio-suginami-203'
  },
  {
    title: 'セントヒルズ椎名町 4楼',
    price: '1,050万日元',
    area: '—',
    type: '—',
    location: '东京都丰岛区长崎',
    feature: '需中介费',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    href: '/maimai/cent-hills-shiinamachi-405'
  },
  {
    title: 'パレ・ドール相模原 8楼',
    price: '420万日元',
    area: '—',
    type: '1R',
    location: '神奈川县相模原市',
    feature: '需中介费',
    image: 'https://images.unsplash.com/photo-1560449752-91594c95c0ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    href: '/maimai/pale-dor-sagamihara-808'
  },
  {
    title: '日神パレス竹ノ塚 5楼',
    price: '700万日元',
    area: '—',
    type: '1R/1K',
    location: '东京都足立区伊兴',
    feature: '需中介费',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    href: '/maimai/nichishin-palace-takenotsuka-509'
  },
  {
    title: 'セザール高島平 2楼',
    price: '1,200万日元',
    area: '50〜52㎡',
    type: '2〜3LDK',
    location: '东京都板桥区德丸',
    feature: '需中介费',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    href: '/maimai/cesar-takashimadaira-206'
  },
  {
    title: '美和プラザ高井戸 1楼',
    price: '990万日元',
    area: '—',
    type: '1K×3戸',
    location: '东京都杉并区上高井戸',
    feature: '需中介费',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    href: '/maimai/miwa-plaza-takaido-101'
  },
  {
    title: 'LM西八王子第3 7楼',
    price: '480万日元',
    area: '18.2㎡',
    type: '1K',
    location: '东京都八王子市八木町',
    feature: '需中介费',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    href: '/maimai/lm-nishihachioji-3-707'
  },
  {
    title: 'スカイコート生田 2楼',
    price: '430万日元',
    area: '约17㎡',
    type: '1K',
    location: '神奈川县川崎市多摩区',
    feature: '需中介费',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    href: '/maimai/sky-court-ikuta-202'
  },
]

const recentDeals = [
  {
    title: '东京港区·高层海景公寓',
    price: '成交价：1.28 亿日元',
    highlight: '年租金回报 5.6%',
    detail: '全程代办贷款审批与税务规划，4 周内完成交割。',
  },
  {
    title: '大阪梅田·精品商铺',
    price: '成交价：2.36 亿日元',
    highlight: '租期 8 年稳定租约',
    detail: '协助客户重谈租赁条件，新增 12% 营业提成。',
  },
  {
    title: '京都祇园·町屋民宿',
    price: '成交价：7,150 万日元',
    highlight: '民宿许可与运营方案同步交付',
    detail: '提供装修设计与合规咨询，预计年收益 8.2%。',
  },
]

const stats = [
  { label: '2023 年度交易额', value: '86.4 亿日元' },
  { label: '服务客户', value: '312 组' },
  { label: '平均交割周期', value: '28 天' },
  { label: '贷款获批率', value: '92%' },
]

const transactionSteps = [
  { step: 1, title: '需求咨询', desc: '了解您的投资目标、预算与偏好', icon: '📞' },
  { step: 2, title: '房源筛选', desc: '根据条件匹配优质项目，提供详细资料', icon: '🔍' },
  { step: 3, title: '实地看房', desc: '安排看房，陪同讲解周边环境与投资价值', icon: '🏠' },
  { step: 4, title: '价格谈判', desc: '协助价格交涉，争取最优交易条件', icon: '💼' },
  { step: 5, title: '签约准备', desc: '准备合同文件，进行法律审查与风险评估', icon: '📝' },
  { step: 6, title: '贷款申请', desc: '协助申请房贷，协调银行审批流程', icon: '💰' },
  { step: 7, title: '交割手续', desc: '办理产权登记、税费缴纳与钥匙交接', icon: '🔑' },
  { step: 8, title: '后续服务', desc: '提供物业管理、税务规划等持续支持', icon: '✅' },
]

const buyingFees = [
  { item: '中介手续费', rate: '成交价 × 3% + 6万日元', note: '（含消费税）' },
  { item: '不动产取得税', rate: '固定资产税评价额 × 3%', note: '（住宅用地为1.5%）' },
  { item: '登记费用', rate: '约 10-20万日元', note: '（根据房产价格）' },
  { item: '司法书士费', rate: '约 5-15万日元', note: '（登记手续代办费）' },
  { item: '印花税', rate: '根据合同金额', note: '（1万日元-48万日元）' },
  { item: '贷款相关费用', rate: '约 20-50万日元', note: '（银行手续费等）' },
  { item: '火灾地震保险', rate: '约 5-15万日元/年', note: '（首年费用）' },
]

const sellingFees = [
  { item: '中介手续费', rate: '成交价 × 3% + 6万日元', note: '（含消费税）' },
  { item: '固定资产税', rate: '按持有期间比例', note: '（年度税额按比例计算）' },
  { item: '源泉征收税', rate: '成交价 × 10.21%', note: '（非居住者需缴纳）' },
  { item: '所得税/住民税', rate: '根据持有期间', note: '（长期持有可享受优惠）' },
  { item: '登记费用', rate: '约 10-20万日元', note: '（注销登记等）' },
  { item: '其他杂费', rate: '约 5-10万日元', note: '（各种证明书等）' },
]

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

const formatCurrencyValue = (amount: number, currency: string) => {
  const locale = currencyLocales[currency] ?? 'zh-CN'
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  const rounded = Math.round(amount)
  const label = currencyLabels[currency] ?? currency
  
  if (currency === 'JPY') {
    // 日元价格转换为"万日元"格式
    const man = rounded / 10_000
    if (man >= 1) {
      const formattedMan = formatter.format(man)
      return `${formattedMan}万${label}`
    } else {
      // 如果小于1万，直接显示日元
      const formattedNumber = formatter.format(rounded)
      return `${formattedNumber}${label}`
    }
  }
  
  const formattedNumber = formatter.format(rounded)
  return `约${formattedNumber}${label}`
}

export default function MaiMaiPage() {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('JPY')
  const [rates, setRates] = useState<Record<string, number>>({ JPY: 1 })
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [isLoadingRates, setIsLoadingRates] = useState<boolean>(false)
  const [rateError, setRateError] = useState<string | null>(null)
  
  // 右侧工具菜单状态
  const [isToolsOpen, setIsToolsOpen] = useState<boolean>(false)
  
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
  
  // 计算房贷月供
  useEffect(() => {
    if (loanAmount && interestRate && loanYears) {
      const principal = parseFloat(loanAmount)
      const rate = parseFloat(interestRate) / 100 / 12
      const months = parseFloat(loanYears) * 12
      
      if (principal > 0 && rate > 0 && months > 0) {
        const payment = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1)
        setMonthlyPayment(Math.round(payment).toLocaleString('ja-JP') + ' 日元')
      } else {
        setMonthlyPayment('请输入贷款信息进行计算')
      }
    } else {
      setMonthlyPayment('请输入贷款信息进行计算')
    }
  }, [loanAmount, interestRate, loanYears])
  
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
      
      if (!isIPad) {
        // 其他设备使用sticky定位
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
        setAnnualRent(annual.toLocaleString('ja-JP') + ' 日元')
        setMonthlyRent(monthly.toLocaleString('ja-JP') + ' 日元')
      } else {
        setAnnualRent('请输入房产信息进行计算')
        setMonthlyRent('请输入房产信息进行计算')
      }
    } else {
      setAnnualRent('请输入房产信息进行计算')
      setMonthlyRent('请输入房产信息进行计算')
    }
  }, [propertyPrice, yieldRate])
  
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
          throw new Error('汇率服务暂时不可用')
        }
        const data = await response.json()
        const fetchedRates: Record<string, number> = { ...data.rates, JPY: 1 }
        const updated = new Date(data.time_last_update_unix * 1000).toLocaleString('zh-CN')
        setRates(fetchedRates)
        setLastUpdated(updated)
        localStorage.setItem('fx-rates-jpy', JSON.stringify({ timestamp: Date.now(), rates: fetchedRates, updated }))
      } catch (error) {
        console.error(error)
        setRateError('汇率更新失败，请稍后重试。价格以日元为准。')
      } finally {
        setIsLoadingRates(false)
      }
    }

    loadRates()
  }, [])
  

  const isOtherCurrencySelected = useMemo(
    () => otherCurrencyOptions.some((currency) => currency.code === selectedCurrency),
    [selectedCurrency]
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
            alt="买卖中介"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 to-navy-900/60"></div>
        </div>
        <div className="relative z-10 container-custom">
          <p className="text-sm text-emerald-300 font-semibold mb-4 drop-shadow-md">Buying & Selling</p>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-6 whitespace-nowrap drop-shadow-lg">日本房产买卖中介服务</h1>
          <p className="text-lg text-gray-200 max-w-3xl leading-relaxed drop-shadow-md">
            为个人及机构投资者提供从项目筛选、尽职调查、融资方案到交割与交付的全流程服务，结合本地资源网络和法律团队，为您争取更优价格与更低风险。
          </p>
        </div>
      </section>

        {/* 正在销售的房产 - 免中介费 */}
        <section ref={currencySectionRef} className="relative section-padding">
          
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
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white whitespace-nowrap">销售中房产</h2>
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
                      <span className="text-sm text-white">其他</span>
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
                        <option value="">请选择</option>
                        {otherCurrencyOptions.map((option) => (
                          <option key={option.code} value={option.code}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="text-sm text-gray-200">
                    {rateError ? rateError : isLoadingRates ? '汇率更新中…' : lastUpdated ? `汇率更新时间：${lastUpdated}` : '汇率以日元为基准实时换算'}
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
              <h3 className="text-xl font-semibold text-green-600 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                免中介费房源
              </h3>
              <div className="overflow-x-auto pb-4 -mx-2 px-2">
                <div className="flex gap-6 min-w-max">
                  {propertiesNoFee.map((property, index) => (
                    property.href ? (
                      <Link
                        key={index}
                        href={property.href}
                        className="flex-shrink-0 w-80 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer block group flex flex-col"
                      >
                        <div className="relative h-48 bg-gray-200">
                          <Image
                            src={property.image}
                            alt={property.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="320px"
                          />
                          <div className="absolute top-3 right-3 bg-green-500 text-navy-900 px-3 py-1 rounded-full text-xs font-semibold">
                            {property.feature}
                          </div>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                          <h4 className="text-lg font-semibold text-navy-900 mb-2 group-hover:text-blue-700 transition-colors">{property.title}</h4>
                          <p className="text-2xl font-bold text-navy-700 mb-1">{currencyDisplay(property.price)}</p>
                          {selectedCurrency !== 'JPY' && (
                            <p className="text-xs text-gray-500 mb-2">日元价格：{property.price}</p>
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
                            查看详情
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <div key={index} className="flex-shrink-0 w-80 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                        <div className="relative h-48 bg-gray-200">
                          <Image
                            src={property.image}
                            alt={property.title}
                            fill
                            className="object-cover"
                            sizes="320px"
                          />
                          <div className="absolute top-3 right-3 bg-green-500 text-navy-900 px-3 py-1 rounded-full text-xs font-semibold">
                            {property.feature}
                          </div>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                          <h4 className="text-lg font-semibold text-navy-900 mb-2">{property.title}</h4>
                          <p className="text-2xl font-bold text-navy-700 mb-1">{currencyDisplay(property.price)}</p>
                          {selectedCurrency !== 'JPY' && (
                            <p className="text-xs text-gray-500 mb-2">日元价格：{property.price}</p>
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
                            查看详情
                          </button>
                        </div>
                      </div>
                    )
                  ))}
                  {/* Coming Soon 卡片 */}
                  <div className="flex-shrink-0 w-80 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-400 mb-2">Coming Soon</div>
                        <div className="text-sm text-gray-500">新物件準備中</div>
                      </div>
                      <div className="absolute top-3 right-3 bg-gray-400 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        準備中
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h4 className="text-lg font-semibold text-gray-400 mb-2">新物件情報</h4>
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
                        準備中
                      </button>
                    </div>
                  </div>
                  {/* Coming Soon 卡片 2 */}
                  <div className="flex-shrink-0 w-80 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-400 mb-2">Coming Soon</div>
                        <div className="text-sm text-gray-500">新物件準備中</div>
                      </div>
                      <div className="absolute top-3 right-3 bg-gray-400 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        準備中
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h4 className="text-lg font-semibold text-gray-400 mb-2">新物件情報</h4>
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
                        準備中
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 需中介费房源 */}
            <div ref={propertiesWithFeeRef} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg mt-6">
              <h3 className="text-xl font-semibold text-orange-600 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                需中介费房源
              </h3>
              <div className="overflow-x-auto pb-4 -mx-2 px-2">
                <div className="flex gap-6 min-w-max">
                  {propertiesWithFee.map((property, index) => (
                    property.href ? (
                      <Link
                        key={index}
                        href={property.href}
                        className="flex-shrink-0 w-80 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer block group flex flex-col"
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
                        <div className="p-5 flex flex-col flex-1">
                          <h4 className="text-lg font-semibold text-navy-900 mb-2 group-hover:text-blue-700 transition-colors">{property.title}</h4>
                          <p className="text-2xl font-bold text-navy-700 mb-1">{currencyDisplay(property.price)}</p>
                          {selectedCurrency !== 'JPY' && (
                            <p className="text-xs text-gray-500 mb-2">日元价格：{property.price}</p>
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
                            查看详情
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <div key={index} className="flex-shrink-0 w-80 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
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
                        <div className="p-5 flex flex-col flex-1">
                          <h4 className="text-lg font-semibold text-navy-900 mb-2">{property.title}</h4>
                          <p className="text-2xl font-bold text-navy-700 mb-1">{currencyDisplay(property.price)}</p>
                          {selectedCurrency !== 'JPY' && (
                            <p className="text-xs text-gray-500 mb-2">日元价格：{property.price}</p>
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
                            查看详情
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
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-12 text-center whitespace-nowrap">日本房产买卖交易流程</h2>
            
            {/* 桌面端：横向一排布局，确保整行显示 */}
            <div className="hidden lg:flex items-center justify-center pb-8 w-full overflow-hidden">
              <div className="flex items-center flex-nowrap w-full" style={{ maxWidth: 'calc(100vw - 4rem)', gap: '-2px' }}>
                {transactionSteps.map((item) => (
                  <div key={item.step} className="flex-shrink-0" style={{ width: 'calc((100% - 0px) / 8)', marginRight: '-2px' }}>
                    {/* 步骤卡片 */}
                    <div className="relative group h-full">
                      {/* 钝角箭头背景 - 更高设计，紧密排列 */}
                      <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 text-white px-6 py-16 h-full shadow-lg hover:shadow-xl transition-all duration-300 overflow-visible"
                        style={{
                          clipPath: 'polygon(0 0, calc(100% - 32px) 0, 100% 50%, calc(100% - 32px) 100%, 0 100%, 32px 50%)',
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
                          <div className="text-5xl mb-2 mt-8">{item.icon}</div>
                          {/* 标题 */}
                          <h3 className="text-sm md:text-base font-bold leading-tight px-2 mt-2 whitespace-nowrap">{item.title}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 移动端：垂直排列布局，箭头向下（桌面端箭头顺时针旋转90度） */}
            <div className="lg:hidden pb-4">
              <div className="flex flex-col items-center gap-0">
                {transactionSteps.map((item, index) => (
                  <div key={item.step} className="w-full max-w-sm">
                    {/* 步骤卡片 - 桌面端箭头顺时针旋转90度：从右箭头变成下箭头 */}
                    <div className="relative group">
                      <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 text-white px-6 py-16 w-full shadow-lg hover:shadow-xl transition-all duration-300 overflow-visible"
                        style={{
                          clipPath: index < transactionSteps.length - 1 
                            // 桌面端：polygon(0 0, calc(100% - 32px) 0, 100% 50%, calc(100% - 32px) 100%, 0 100%, 32px 50%)
                            // 顺时针旋转90度：原右箭头(→)变成下箭头(↓)
                            // 顶部凹进：50% 32px（对应原左边凹进 32px 50%）
                            // 底部凸出：50% 100%（对应原右边凸出 100% 50%）
                            ? 'polygon(50% 32px, 0 0, 0 calc(100% - 32px), 50% 100%, 100% calc(100% - 32px), 100% 0)'
                            // 最后一个：没有底部箭头，但保留顶部凹进（接收上一个的底部凸出）
                            // 从左上角开始，顺时针：0 0 -> 50% 32px（凹进点）-> 100% 0 -> 100% 100% -> 0 100% -> 回到起点
                            : 'polygon(0 0, 50% 32px, 100% 0, 100% 100%, 0 100%)',
                        }}>
                        <div className="flex flex-col items-center text-center h-full justify-center relative">
                          {/* 步骤数字 - 居中在图标上方 */}
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                            <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-blue-500">
                              <span className="text-blue-700 font-extrabold text-base">{item.step}</span>
                            </div>
                          </div>
                          {/* 图标 - 使用圆形背景，避免被clipPath裁剪 */}
                          <div className="text-4xl mb-2 mt-8 w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">{item.icon}</div>
                          {/* 标题 */}
                          <h3 className="text-sm md:text-base font-bold leading-tight px-2 mt-2 whitespace-nowrap">{item.title}</h3>
                          {/* 描述 */}
                          <p className="text-xs md:text-sm text-blue-100 mt-2 px-2 line-clamp-2">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 交易费用一览 */}
        <section className="relative section-padding">
          
          <div className="container-custom relative z-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-8 text-center whitespace-nowrap">交易费用一览</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border-2 border-gray-200 shadow-lg">
              {/* 买房费用 */}
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100 shadow-md">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-navy-900" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-navy-700">买房费用</h3>
                </div>
                <div className="space-y-4">
                  {buyingFees.map((fee, index) => (
                    <div key={index} className="flex justify-between items-start pb-3 border-b border-gray-200 last:border-0">
                      <div className="flex-1">
                        <p className="text-base md:text-lg font-semibold text-gray-800">{fee.item}</p>
                        <p className="text-sm md:text-base text-gray-500 mt-1">{fee.note}</p>
                      </div>
                      <p className="text-sm md:text-base font-medium text-navy-700 ml-4 text-right whitespace-nowrap">{fee.rate}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 卖房费用 */}
              <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 border border-green-100 shadow-md">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-navy-900" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-navy-700">卖房费用</h3>
                </div>
                <div className="space-y-4">
                  {sellingFees.map((fee, index) => (
                    <div key={index} className="flex justify-between items-start pb-3 border-b border-gray-200 last:border-0">
                      <div className="flex-1">
                        <p className="text-base md:text-lg font-semibold text-gray-800">{fee.item}</p>
                        <p className="text-sm md:text-base text-gray-500 mt-1">{fee.note}</p>
                      </div>
                      <p className="text-sm md:text-base font-medium text-green-600 ml-4 text-right whitespace-nowrap">{fee.rate}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* 提示文字 */}
              <div className="lg:col-span-2">
                <p className="text-sm md:text-base text-gray-600 text-left mt-4">
                  ※上述金额仅供参考。具体交易金额根据实际情况会有所变动。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 近期交易房产 & 年度交易额段落已移除 */}
        
        {/* 右侧工具菜单 */}
        <>
          {/* 触发按钮 */}
          <button
            onClick={() => setIsToolsOpen(!isToolsOpen)}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-navy-700 hover:bg-navy-800 text-white px-4 py-6 rounded-l-2xl shadow-2xl transition-all duration-300 flex items-center gap-2 group tools-button-landscape"
            aria-label="打开工具菜单"
          >
            <Calculator className="w-6 h-6" />
            <span className="hidden md:block text-sm font-medium whitespace-nowrap">实用工具</span>
          </button>
          
          {/* 滑出菜单 */}
          <div
            className={`fixed right-0 top-0 h-full w-full md:w-[480px] bg-white shadow-2xl z-[60] transition-transform duration-300 ease-in-out ${
              isToolsOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="h-full overflow-y-auto">
              {/* 菜单头部 */}
              <div className="sticky top-0 bg-navy-700 text-white p-6 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-1 whitespace-nowrap">房产实用工具</h2>
                  <p className="text-sm text-gray-200">快速计算房贷月供与租金收益</p>
                </div>
                <button
                  onClick={() => setIsToolsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="关闭菜单"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* 工具内容 */}
              <div className="p-6 space-y-6">
                {/* 房贷计算器 */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-navy-700" />
                    </div>
                    <h3 className="text-xl font-bold text-white">房贷月供计算</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        贷款金额（日元）
                      </label>
                      <input
                        type="number"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                        placeholder="例如：50000000"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        suppressHydrationWarning
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        年利率（%）
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
                        贷款年限（年）
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
                      <p className="text-sm text-gray-700 mb-1">月供金额</p>
                      <p className="text-2xl font-bold text-navy-700">
                        {monthlyPayment}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 租金收益计算器 */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white">租金收益计算</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        房产价格（日元）
                      </label>
                      <input
                        type="number"
                        value={propertyPrice}
                        onChange={(e) => setPropertyPrice(e.target.value)}
                        placeholder="例如：50000000"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        suppressHydrationWarning
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        年化收益率（%）
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
                        <p className="text-sm text-gray-700 mb-1">年租金收入</p>
                        <p className="text-2xl font-bold text-green-600">
                          {annualRent}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700 mb-1">月租金收入</p>
                        <p className="text-xl font-bold text-gray-700">
                          {monthlyRent}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 汇率转换工具 */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">汇率转换</h3>
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
                          placeholder="输入金额"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                        aria-label="交换货币"
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
                          placeholder="转换结果"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                        <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                          <p className="text-sm text-gray-700 mb-1">当前汇率</p>
                          <p className="text-sm text-gray-600">
                            1 {currencyLabels[fromCurrency]} = {formatRate(rateValue)} {currencyLabels[toCurrency]}
                          </p>
                          <div className="mt-2 text-xs text-gray-500">
                            {rateError ? rateError : isLoadingRates ? '汇率更新中…' : lastUpdated ? `更新时间：${lastUpdated}` : '汇率以日元为基准实时换算'}
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
              className="fixed inset-0 bg-black/50 z-[55] transition-opacity duration-300"
              onClick={() => setIsToolsOpen(false)}
            />
          )}
        </>
    </PageLayout>
  )
}

