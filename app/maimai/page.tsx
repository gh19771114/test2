'use client'

import { useEffect, useMemo, useState } from 'react'
import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import { Building2, TrendingUp, Award, FileText, ArrowRight, CheckCircle2 } from 'lucide-react'

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
    title: '东京港区·塔楼海景公寓',
    price: '8,800万円',
    area: '65㎡',
    type: '2LDK',
    location: '港区六本木',
    feature: '免中介费',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    title: '大阪梅田·精品公寓',
    price: '5,200万円',
    area: '52㎡',
    type: '1LDK',
    location: '大阪市北区',
    feature: '免中介费',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    title: '京都·传统町屋改造',
    price: '6,500万円',
    area: '85㎡',
    type: '3LDK',
    location: '京都市中京区',
    feature: '免中介费',
    image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    title: '横滨·湾岸高层公寓',
    price: '7,200万円',
    area: '58㎡',
    type: '2LDK',
    location: '横滨市港北区',
    feature: '免中介费',
    image: 'https://images.unsplash.com/photo-1574362848149-11496d93a8c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
]

const propertiesWithFee = [
  {
    title: '东京涩谷·商业用地',
    price: '12,500万円',
    area: '120㎡',
    type: '商业用地',
    location: '涩谷区',
    feature: '需中介费',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    title: '名古屋·整栋公寓',
    price: '15,800万円',
    area: '200㎡',
    type: '整栋',
    location: '名古屋市中区',
    feature: '需中介费',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    title: '福冈·投资用公寓',
    price: '9,500万円',
    area: '95㎡',
    type: '投资用',
    location: '福冈市中央区',
    feature: '需中介费',
    image: 'https://images.unsplash.com/photo-1560449752-91594c95c0ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    title: '札幌·度假别墅',
    price: '6,800万円',
    area: '150㎡',
    type: '别墅',
    location: '札幌市南区',
    feature: '需中介费',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
  const formattedNumber = formatter.format(rounded)
  const label = currencyLabels[currency] ?? currency
  if (currency === 'JPY') {
    return `${formattedNumber}${label}`
  }
  return `约${formattedNumber}${label}`
}

const splitStepDetails = (text: string) => {
  return text
    .split(/[，、,]/)
    .map((segment) => segment.trim())
    .filter(Boolean)
}

export default function MaiMaiPage() {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('JPY')
  const [rates, setRates] = useState<Record<string, number>>({ JPY: 1 })
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [isLoadingRates, setIsLoadingRates] = useState<boolean>(false)
  const [rateError, setRateError] = useState<string | null>(null)

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
      <div className="relative">
        {/* Hero Section with Background Image */}
        <section className="relative pt-28 pb-16 bg-gradient-to-br from-navy-800 via-navy-700 to-blue-800 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="日本房产"
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-navy-900/80 to-blue-900/60"></div>
          </div>
          <div className="relative z-10 container-custom">
            <p className="text-sm text-blue-300 font-semibold mb-4">买卖中介 Buying & Selling</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">日本房产买卖中介服务</h1>
            <p className="text-lg text-gray-200 max-w-3xl leading-relaxed">
              为个人及机构投资者提供从项目筛选、尽职调查、融资方案到交割与交付的全流程服务，结合本地资源网络和法律团队，为您争取更优价格与更低风险。
            </p>
          </div>
        </section>

        {/* 正在销售的房产 - 免中介费 */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-navy-700">销售中房产</h2>
              <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  {mainCurrencyOptions.map((option) => (
                    <button
                      key={option.code}
                      onClick={() => setSelectedCurrency(option.code)}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                        selectedCurrency === option.code
                          ? 'bg-navy-700 text-white border-navy-700 shadow-lg'
                          : 'border-gray-200 text-gray-600 hover:border-navy-500 hover:text-navy-600'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">其他</span>
                    <select
                      value={isOtherCurrencySelected ? selectedCurrency : ''}
                      onChange={(event) => {
                        const value = event.target.value
                        if (value) {
                          setSelectedCurrency(value)
                        }
                      }}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 bg-white"
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
                <div className="text-sm text-gray-500">
                  {rateError ? rateError : isLoadingRates ? '汇率更新中…' : lastUpdated ? `汇率更新时间：${lastUpdated}` : '汇率以日元为基准实时换算'}
                </div>
              </div>
            </div>
            <div className="mb-8 bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
              <h3 className="text-xl font-semibold text-green-600 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                免中介费房源
              </h3>
              <div className="overflow-x-auto pb-4 -mx-2 px-2">
                <div className="flex gap-6 min-w-max">
                  {propertiesNoFee.map((property, index) => (
                    <div key={index} className="flex-shrink-0 w-80 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <div className="relative h-48 bg-gray-200">
                        <Image
                          src={property.image}
                          alt={property.title}
                          fill
                          className="object-cover"
                          sizes="320px"
                        />
                        <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {property.feature}
                        </div>
                      </div>
                      <div className="p-5">
                        <h4 className="text-lg font-semibold text-navy-700 mb-2">{property.title}</h4>
                        <p className="text-2xl font-bold text-blue-600 mb-1">{currencyDisplay(property.price)}</p>
                        {selectedCurrency !== 'JPY' && (
                          <p className="text-xs text-gray-500 mb-2">日元价格：{property.price}</p>
                        )}
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            {property.area}
                          </span>
                          <span>{property.type}</span>
                          <span>{property.location}</span>
                        </div>
                        <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium">
                          查看详情
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 需中介费房源 */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg mt-6">
              <h3 className="text-xl font-semibold text-orange-600 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                需中介费房源
              </h3>
              <div className="overflow-x-auto pb-4 -mx-2 px-2">
                <div className="flex gap-6 min-w-max">
                  {propertiesWithFee.map((property, index) => (
                    <div key={index} className="flex-shrink-0 w-80 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <div className="relative h-48 bg-gray-200">
                        <Image
                          src={property.image}
                          alt={property.title}
                          fill
                          className="object-cover"
                          sizes="320px"
                        />
                        <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {property.feature}
                        </div>
                      </div>
                      <div className="p-5">
                        <h4 className="text-lg font-semibold text-navy-700 mb-2">{property.title}</h4>
                        <p className="text-2xl font-bold text-blue-600 mb-1">{currencyDisplay(property.price)}</p>
                        {selectedCurrency !== 'JPY' && (
                          <p className="text-xs text-gray-500 mb-2">日元价格：{property.price}</p>
                        )}
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            {property.area}
                          </span>
                          <span>{property.type}</span>
                          <span>{property.location}</span>
                        </div>
                        <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium">
                          查看详情
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 日本房产买卖交易流程 */}
        <section className="section-padding">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl font-bold text-navy-700 mb-8 text-center">日本房产买卖交易流程</h2>
            <div className="max-w-6xl mx-auto">
              <div className="hidden lg:block bg白 rounded-3xl p-8 border-2 border-blue-100 shadow-xl">
                <div className="grid grid-cols-4 gap-8">
                  {transactionSteps.map((item) => (
                    <div key={item.step} className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center border-2 border-blue-200 min-h-[260px] flex flex-col">
                      <div className="text-4xl mb-4">{item.icon}</div>
                      <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold shadow-md">
                        {item.step}
                      </div>
                      <h3 className="text-lg font-bold text-navy-700 mb-4 whitespace-nowrap">{item.title}</h3>
                      <div className="space-y-2 text-sm text-gray-600 leading-relaxed text-left">
                        {splitStepDetails(item.desc).map((detail) => (
                          <div key={detail} className="flex items-start gap-2">
                            <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:hidden bg-white rounded-3xl p-6 border-2 border-blue-100 shadow-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {transactionSteps.map((item) => (
                    <div key={item.step} className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-5 shadow-md text-center border-2 border-blue-200">
                      <div className="text-3xl mb-3">{item.icon}</div>
                      <div className="w-10 h-10 bg-blue-600 text白 rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                        {item.step}
                      </div>
                      <h3 className="text-base font-bold text-navy-700 mb-3 whitespace-nowrap">{item.title}</h3>
                      <div className="space-y-2 text-sm text-gray-600 leading-relaxed text-left">
                        {splitStepDetails(item.desc).map((detail) => (
                          <div key={detail} className="flex items-start gap-2">
                            <span className="mt-1 block h-1 w-1 rounded-full bg-blue-400"></span>
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 交易费用一览 */}
        <section className="section-padding">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl font-bold text-navy-700 mb-8 text-center">交易费用一览</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto bg-white rounded-2xl p-6 md:p-8 border-2 border-gray-200 shadow-lg">
              {/* 买房费用 */}
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100 shadow-md">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
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
                      <p className="text-sm md:text-base font-medium text-blue-600 ml-4 text-right whitespace-nowrap">{fee.rate}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 卖房费用 */}
              <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 border border-green-100 shadow-md">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
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
            </div>
          </div>
        </section>

        {/* 房产实用工具 */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-navy-700 mb-4">房产实用工具</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                快速计算房贷月供与租金收益，辅助您的投资决策
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 房贷计算器 */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-navy-700">房贷月供计算</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      贷款金额（日元）
                    </label>
                    <input
                      type="number"
                      placeholder="例如：50000000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      年利率（%）
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      defaultValue="2.5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      贷款年限（年）
                    </label>
                    <input
                      type="number"
                      defaultValue="35"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">月供金额</p>
                    <p className="text-3xl font-bold text-blue-600">
                      请输入贷款信息进行计算
                    </p>
                  </div>
                </div>
              </div>

              {/* 租金收益计算器 */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-navy-700">租金收益计算</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      房产价格（日元）
                    </label>
                    <input
                      type="number"
                      placeholder="例如：50000000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      年化收益率（%）
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      defaultValue="5.0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-gray-600 mb-1">年租金收入</p>
                      <p className="text-3xl font-bold text-green-600">
                        请输入房产信息进行计算
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">月租金收入</p>
                      <p className="text-2xl font-bold text-gray-700">
                        请输入房产信息进行计算
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 近期交易房产 & 年度交易额段落已移除 */}
      </div>
    </PageLayout>
  )
}
