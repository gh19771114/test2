'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState, useMemo } from 'react'
import PageLayout from '@/components/PageLayout'
import { Calendar, MapPin, Tag, ArrowLeft, Building2, DollarSign, TrendingUp } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

// 金属光泽灰色背景样式
const metallicGrayStyle = {
  background: 'linear-gradient(135deg, #4a5568 0%, #2d3748 50%, #1a202c 100%)',
  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.04) 2px, rgba(255, 255, 255, 0.04) 4px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255, 255, 255, 0.04) 2px, rgba(255, 255, 255, 0.04) 4px), radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.12) 0%, transparent 50%)'
}

// 案例详情数据类型
type CaseDetail = {
  date: string
  type: string
  title: string
  location: string
  category: string
  image: string
  description: string
  details: string[]
  highlights: Array<{ label: string; value: string }>
}

// 案例详情数据
const caseDetails: Record<string, CaseDetail> = {
  'grand-maison-asakusa-1302': {
    date: '2025/08/25',
    type: '销售',
    title: 'グランドメゾン浅草花川戸13F',
    location: '东京都台东区浅草花川戸',
    category: '高级公寓',
    image: '/imgs/Grand Maison Asakusa Hanakawado.jpeg',
    description: '成功完成浅草花川戸高级公寓单元的销售交易，为客户提供专业的销售服务。',
    details: [
      '成功完成销售交易，交易日期：2025年8月25日',
      '为客户提供专业的销售咨询和交易服务',
      '地理位置优越，步行至浅草寺仅需5分钟',
      '周边交通便利，多条地铁线路可达',
      '顺利完成所有交易手续，客户满意度高',
    ],
    highlights: [
      { label: '建筑面积', value: '约65㎡' },
      { label: '房间布局', value: '2LDK' },
      { label: '建筑年份', value: '2018年' },
      { label: '楼层', value: '13层' },
    ],
  },
  'park-tower-nishishinjuku-101-201': {
    date: '2025/09/25',
    type: '销售',
    title: 'パークタワー西新宿施設棟1F',
    location: '东京都新宿区西新宿',
    category: '商业设施',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: '成功完成西新宿核心地段商业设施两个单元的销售交易。',
    details: [
      '成功完成销售交易，交易日期：2025年9月25日',
      '包含1F两个单元，总面积约200㎡',
      '为客户提供专业的商业设施销售服务',
      '位于新宿核心商业区，商业价值高',
      '顺利完成所有交易手续，获得客户认可',
    ],
    highlights: [
      { label: '总面积', value: '约200㎡' },
      { label: '单元数', value: '2个单元' },
      { label: '建筑年份', value: '2015年' },
      { label: '用途', value: '商业设施' },
    ],
  },
  'my-castle-yoyogi-1203': {
    date: '2025/05/16',
    type: '销售',
    title: 'マイキャスル代々木12F',
    location: '东京都涩谷区代代木',
    category: '公寓',
    image: '/imgs/My Castle Yoyogi.jpeg',
    description: '成功完成代代木地区优质公寓单元的销售交易。',
    details: [
      '成功完成销售交易，交易日期：2025年5月16日',
      '为客户提供专业的公寓销售服务',
      '代代木地区优质地段，居住环境优越',
      '周边有代代木公园，环境优美',
      '顺利完成所有交易手续，客户满意度高',
    ],
    highlights: [
      { label: '建筑面积', value: '约55㎡' },
      { label: '房间布局', value: '1LDK' },
      { label: '建筑年份', value: '2020年' },
      { label: '楼层', value: '12层' },
    ],
  },
  'shinjuku-daikan-plaza-a-201': {
    date: '2025/10/23',
    type: '资产购入',
    title: '新宿ダイカンプラザA館2F',
    location: '东京都新宿区',
    category: '商业设施',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: '公司成功购入新宿核心商业区商业设施资产。',
    details: [
      '公司资产购入，购入日期：2025年10月23日',
      '新宿核心商业区，商业价值极高',
      '人流量大，商业氛围浓厚',
      '交通便利，多条地铁线路可达',
      '作为公司持有资产进行长期运营管理',
    ],
    highlights: [
      { label: '建筑面积', value: '约150㎡' },
      { label: '建筑年份', value: '2017年' },
      { label: '楼层', value: '2层' },
      { label: '用途', value: '商业设施' },
    ],
  },
  'abc-hall-management': {
    date: '2025/10/23',
    type: '管理房产',
    title: 'THE ROPPONGI TOKYO CLUB RESIDENCE',
    location: '东京都',
    category: '管理房产',
    image: '/imgs/managed-properties/mp-03.jpeg',
    description: '管理房产展示（图片来源：管理房产列表）。',
    details: [
      '本页面用于展示管理房产卡片内容。',
      '如需更多项目详情，请联系我们的顾问。',
    ],
    highlights: [
      { label: '展示类型', value: '管理房产' },
      { label: '图片', value: '本地资源' },
    ],
  },
  'kingsoft-wps-japan': {
    date: '2024/11/15',
    type: '企业服务',
    title: '金山 WPS 日本子公司设立服务',
    location: '东京都',
    category: '企业出海',
    image: '/imgs/WPS.jpeg',
    description: '协助完成法人登记、签约日本大型不动产公司设立办公室，并搭建本地财务与招聘体系。',
    details: [
      '成功完成金山 WPS 日本子公司的设立服务',
      '协助完成法人登记手续，确保合规设立',
      '签约日本大型不动产公司，成功设立办公室',
      '搭建本地财务体系，建立完善的财务管理流程',
      '建立招聘体系，协助组建本地团队',
      '提供持续的企业出海支持服务',
    ],
    highlights: [
      { label: '服务类型', value: '企业设立' },
      { label: '服务内容', value: '法人登记、办公室设立、财务体系、招聘体系' },
      { label: '服务周期', value: '持续支持' },
      { label: '服务团队', value: '专业团队' },
    ],
  },
  'shibuya-luxury-apartment': {
    date: '2024/03/15',
    type: '管理房产',
    title: 'TheLOG日本橋',
    location: '东京都',
    category: '管理房产',
    image: '/imgs/managed-properties/mp-04.jpeg',
    description: '管理房产展示（图片来源：管理房产列表）。',
    details: [
      '本页面用于展示管理房产卡片内容。',
      '如需更多项目详情，请联系我们的顾问。',
    ],
    highlights: [
      { label: '展示类型', value: '管理房产' },
      { label: '图片', value: '本地资源' },
    ],
  },
  'yokohama-waterfront-complex': {
    date: '2024/06/20',
    type: '管理房产',
    title: 'ザ・パークハウス西新宿タワー60',
    location: '东京都',
    category: '管理房产',
    image: '/imgs/managed-properties/mp-09.jpeg',
    description: '管理房产展示（图片来源：管理房产列表）。',
    details: [
      '本页面用于展示管理房产卡片内容。',
      '如需更多项目详情，请联系我们的顾问。',
    ],
    highlights: [
      { label: '展示类型', value: '管理房产' },
      { label: '图片', value: '本地资源' },
    ],
  },
  'nagoya-student-apartment': {
    date: '2024/09/10',
    type: '管理房产',
    title: '勝どきザ・タワー',
    location: '东京都',
    category: '管理房产',
    image: '/imgs/managed-properties/mp-18.jpeg',
    description: '管理房产展示（图片来源：管理房产列表）。',
    details: [
      '本页面用于展示管理房产卡片内容。',
      '如需更多项目详情，请联系我们的顾问。',
    ],
    highlights: [
      { label: '展示类型', value: '管理房产' },
      { label: '图片', value: '本地资源' },
    ],
  },
}

export default function CaseDetailPage() {
  const { t } = useLanguage()
  const params = useParams()
  const slug = params?.slug as string | undefined
  
  // 使用翻译数据
  const caseItem = useMemo(() => {
    if (!slug) return undefined
    const baseCase = caseDetails[slug]
    if (!baseCase) return undefined
    
    // 尝试从翻译文件中获取翻译
    try {
      const translatedCase = {
        ...baseCase,
        type: t(`cases.details.${slug}.type`, { returnObjects: false }) || baseCase.type,
        title: t(`cases.details.${slug}.title`, { returnObjects: false }) || baseCase.title,
        location: t(`cases.details.${slug}.location`, { returnObjects: false }) || baseCase.location,
        category: t(`cases.details.${slug}.category`, { returnObjects: false }) || baseCase.category,
        description: t(`cases.details.${slug}.description`, { returnObjects: false }) || baseCase.description,
        details: (() => {
          const translated = t(`cases.details.${slug}.details`, { returnObjects: true })
          return Array.isArray(translated) ? translated : (Array.isArray(baseCase.details) ? baseCase.details : [])
        })(),
        highlights: (() => {
          const translated = t(`cases.details.${slug}.highlights`, { returnObjects: true })
          return Array.isArray(translated) ? translated : (Array.isArray(baseCase.highlights) ? baseCase.highlights : [])
        })(),
      }
      return translatedCase
    } catch {
      return baseCase
    }
  }, [slug, t])
  
  // 所有 Hooks 必须在早期返回之前调用
  const [mapCoordinates, setMapCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [mapLoading, setMapLoading] = useState(true)

  // 自动搜索地址获取坐标
  useEffect(() => {
    const caseType = typeof caseItem?.type === 'string' ? caseItem.type : ''
    if ((caseType === '销售' || caseType === 'Sale' || caseType === '売却') && caseItem?.location) {
      const searchAddress = async () => {
        try {
          // 使用 OpenStreetMap Nominatim API 搜索地址
          const searchQuery = caseItem.location.includes('东京') 
            ? caseItem.location 
            : `${caseItem.location}, 东京, 日本`
          const encodedAddress = encodeURIComponent(searchQuery)
          
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'Bourn Mark Website'
              }
            }
          )
          
          if (response.ok) {
            const data = await response.json()
            if (data && data.length > 0) {
              const lat = parseFloat(data[0].lat)
              const lng = parseFloat(data[0].lon)
              setMapCoordinates({ lat, lng })
            }
          }
        } catch (error) {
          console.error('地址搜索失败:', error)
        } finally {
          setMapLoading(false)
        }
      }
      
      // 延迟搜索以避免频繁请求
      const timer = setTimeout(() => {
        searchAddress()
      }, 500)
      
      return () => clearTimeout(timer)
    } else {
      setMapLoading(false)
    }
  }, [caseItem])

  // 早期返回必须在所有 Hooks 之后
  if (!slug) {
    return (
      <PageLayout>
        <div className="container-custom py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{t('cases.notFound.title')}</h1>
          <p className="text-gray-600 mb-6">{t('cases.notFound.message')}</p>
          <Link href="/cases" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t('cases.notFound.back')}
          </Link>
        </div>
      </PageLayout>
    )
  }

  if (!caseItem) {
    return (
      <PageLayout>
        <div className="container-custom py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{t('cases.notFound.title')}</h1>
          <p className="text-gray-600 mb-6">{t('cases.notFound.message')}</p>
          <Link href="/cases" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t('cases.notFound.back')}
          </Link>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="relative min-h-screen">
        {/* Hero Section */}
        <section className="relative pt-28 pb-16 bg-gradient-to-br from-blue-700 via-blue-600 to-navy-700 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={caseItem.image}
              alt={caseItem.title}
              fill
              className="object-cover opacity-30"
              priority
              unoptimized={caseItem.image.startsWith('/imgs/')}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 to-navy-900/60"></div>
          </div>
          <div className="relative z-10 container-custom">
            <Link
              href="/cases"
              className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>{t('cases.detail.backToList')}</span>
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                {caseItem.type}
              </span>
              <span className="bg-white/20 text-white px-4 py-1 rounded-full text-sm font-medium">
                {caseItem.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {caseItem.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-100">
              <div className="flex items-center gap-2">
                <Calendar size={20} />
                <span>{caseItem.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={20} />
                <span>{caseItem.location}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="section-padding">
          <div className="container-custom max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Image */}
                <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={caseItem.image}
                    alt={caseItem.title}
                    fill
                    className="object-cover"
                    priority
                    unoptimized={caseItem.image.startsWith('/imgs/')}
                  />
                </div>

                {/* Description */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-navy-700 mb-4">{t('cases.detail.overview')}</h2>
                  <p className="text-gray-700 leading-relaxed text-lg">{caseItem.description}</p>
                </div>

                {/* Details */}
                {Array.isArray(caseItem.details) && caseItem.details.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-navy-700 mb-6">{t('cases.detail.details')}</h2>
                    <ul className="space-y-4">
                      {caseItem.details.map((detail: string, index: number) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                          <p className="text-gray-700 leading-relaxed">{detail}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Map Section - Only for Sales Cases */}
                {(caseItem.type === '销售' || caseItem.type === 'Sale' || caseItem.type === '売却') && caseItem.location && (
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-navy-700 mb-4">{t('cases.detail.location')}</h2>
                    <p className="text-gray-600 mb-4">{t('cases.detail.locationDescription')}</p>
                    <div className="relative w-full h-96 rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                      {mapLoading ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-gray-500">正在加载地图...</div>
                        </div>
                      ) : mapCoordinates ? (
                        <a
                          href={`https://www.google.com/maps?q=${mapCoordinates.lat},${mapCoordinates.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full h-full relative group"
                        >
                          <iframe
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapCoordinates.lng - 0.005},${mapCoordinates.lat - 0.005},${mapCoordinates.lng + 0.005},${mapCoordinates.lat + 0.005}&layer=mapnik&marker=${mapCoordinates.lat},${mapCoordinates.lng}`}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title={`${caseItem.title} ${t('cases.detail.map')}`}
                            className="pointer-events-none group-hover:opacity-90 transition-opacity"
                          ></iframe>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center pointer-events-none">
                            <div className="bg-white/90 px-4 py-2 rounded-lg text-sm font-medium text-navy-700 opacity-0 group-hover:opacity-100 transition-opacity">
                              {t('cases.detail.clickToViewMap')}
                            </div>
                          </div>
                        </a>
                      ) : (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(caseItem.location + ', 东京, 日本')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full h-full relative group"
                        >
                          <div className="flex items-center justify-center h-full bg-gray-50">
                            <div className="text-center">
                              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-600 mb-2">{caseItem.location}</p>
                              <p className="text-sm text-gray-500">{t('cases.detail.clickToViewGoogleMap')}</p>
                            </div>
                          </div>
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-3 text-center">
                      {caseItem.location}
                    </p>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Highlights */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-navy-700 mb-4">{t('cases.detail.highlights')}</h3>
                  <div className="space-y-4">
                    {caseItem.highlights.map((highlight: { label: string; value: string }, index: number) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                        <span className="text-gray-600">{highlight.label}</span>
                        <span className="text-navy-700 font-semibold">{highlight.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-br from-blue-600 to-navy-700 rounded-2xl shadow-lg p-6 text-white">
                  <h3 className="text-xl font-bold mb-4">{t('cases.detail.cta.title')}</h3>
                  <p className="text-blue-100 mb-6">
                    {t('cases.detail.cta.description')}
                  </p>
                  <Link
                    href="/#contact"
                    className="block w-full bg-white text-blue-600 text-center font-semibold py-3 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    {t('cases.detail.cta.button')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}

