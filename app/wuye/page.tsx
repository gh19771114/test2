'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import Link from 'next/link'
import { ClipboardCheck, DollarSign, Wrench, Shield, TrendingUp, Users, Calendar, MapPin, Search, Briefcase, Hand, Hammer, Coins, Building2 } from 'lucide-react'

const regularServices = [
  {
    title: '租赁管理',
    link: '/wuye/zulin',
    icon: ClipboardCheck,
  },
  {
    title: '收支与税务',
    link: '/wuye/shouzhi',
    icon: DollarSign,
  },
  {
    title: '修缮维护',
    link: '/wuye/xiushan',
    icon: Wrench,
  },
  {
    title: '入住者服务',
    link: '/wuye/ruzhu',
    icon: Users,
  },
  {
    title: '相关保险',
    link: '/wuye/baoxian',
    icon: Shield,
  },
]

const assetAppreciationServices = [
  {
    title: '市场调查',
    link: '/wuye/zengzhi',
    icon: Search,
  },
  {
    title: '企业咨询',
    link: '/wuye/zengzhi',
    icon: Briefcase,
  },
  {
    title: '租金交涉',
    link: '/wuye/zengzhi',
    icon: Hand,
  },
  {
    title: '大规模修缮',
    link: '/wuye/zengzhi',
    icon: Hammer,
  },
  {
    title: '相关附加收益',
    link: '/wuye/zengzhi',
    icon: Coins,
  },
]

const managedProperties = [
  {
    id: 'shibuya-luxury-apartment',
    date: '2024/03/15',
    type: '管理委托',
    title: '东京涩谷高端公寓',
    location: '东京都涩谷区',
    category: '高级公寓',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: '入住率 96%，通过数字化管理系统将维修响应时间缩短至 12 小时内。',
  },
  {
    id: 'yokohama-waterfront-complex',
    date: '2024/06/20',
    type: '管理委托',
    title: '横滨海滨综合体',
    location: '神奈川县横滨市',
    category: '商业综合体',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: '通过分区管理与租客重组，商业租金提升 18%。',
  },
  {
    id: 'nagoya-student-apartment',
    date: '2024/09/10',
    type: '管理委托',
    title: '名古屋学生公寓',
    location: '爱知县名古屋市',
    category: '学生公寓',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: '引入智能门禁与租客社群运营，每年续约率保持在 92%。',
  },
]

export default function WuYePage() {
  return (
    <PageLayout>
      <div className="relative">
        {/* Hero Section with Background Image */}
        <section className="relative pt-28 pb-16 bg-gradient-to-br from-blue-800 via-blue-700 to-navy-800 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="物业管理"
              fill
              className="object-cover opacity-30"
              priority
            />
          </div>
          <div className="relative z-10 container-custom">
            <p className="text-sm text-blue-300 font-semibold mb-4">Property Management</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">全方位物业管理服务</h1>
            <p className="text-lg text-gray-200 max-w-3xl leading-relaxed">
              为在日本持有房产的个人与机构业主提供全流程托管服务，不仅涵盖日常租赁管理、财务税务与维修维护，更专注于通过专业的资产增值策略和租金增长交涉，持续提升您的房产价值与投资回报率，让资产稳健成长。
            </p>
          </div>
        </section>

      <section id="tenant-services" className="section-padding">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-white mb-8">服务内容</h2>
          
          {/* 左右两个大方块 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 常规服务 - 左侧大方块 */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 md:p-10 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl md:text-3xl font-bold text-navy-700 mb-8 text-center">常规服务</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {regularServices.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link key={item.title} href={item.link} className="block">
                      <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Icon className="w-6 h-6 text-blue-600" />
                          </div>
                          <h4 className="text-base font-semibold text-navy-700">{item.title}</h4>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* 专业资产增值服务 - 右侧大方块 */}
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-3xl p-8 md:p-10 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl md:text-3xl font-bold text-navy-700 mb-8 text-center">专业资产增值服务</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assetAppreciationServices.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link key={item.title} href={item.link} className="block">
                      <div className="bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Icon className="w-6 h-6 text-purple-600" />
                          </div>
                          <h4 className="text-base font-semibold text-navy-700">{item.title}</h4>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-white mb-6">管理房产</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {managedProperties.map((property) => (
              <Link key={property.id} href={`/cases/${property.id}`} className="group bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="relative overflow-hidden">
                  <div className="relative w-full h-64">
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    />
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-navy-700 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {property.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {property.type}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Calendar size={16} />
                    <span>{property.date}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-navy-700 mb-2 group-hover:text-navy-600 transition-colors duration-200">
                    {property.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <MapPin size={16} />
                    <span>{property.location}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                    {property.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* 统计信息 */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border-2 border-blue-200 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-navy-900 mb-1">
                    <span>1,300</span><span className="ml-2">户</span>
                  </h3>
                  <p className="text-base md:text-lg text-gray-700 font-medium">管理房产总数</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 border-2 border-green-200 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-3xl font-bold">¥</span>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-navy-900 mb-1">
                    <span>約800億</span><span className="ml-2">日元</span>
                  </h3>
                  <p className="text-base md:text-lg text-gray-700 font-medium">管理资产总额</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-bold text-white mb-4">需要我们接管您的在日资产吗？</h2>
          <p className="text-gray-200 max-w-2xl mx-auto mb-6 leading-relaxed">
            无论您在日本拥有单套公寓、整栋楼宇或组合资产，Bourn Mark 都能提供灵活的托管方案与透明的财务报告。
          </p>
          <a href="/#contact" className="btn-primary inline-flex items-center gap-2">
            联系顾问
          </a>
        </div>
      </section>
      </div>
    </PageLayout>
  )
}

