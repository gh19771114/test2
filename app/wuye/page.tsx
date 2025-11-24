'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import Link from 'next/link'
import { ClipboardCheck, DollarSign, Wrench, Shield, TrendingUp, Users, Calendar, MapPin } from 'lucide-react'

const managementHighlights = [
  {
    title: '租赁管理',
    details: ['租客筛选与背景调查', '合同签署与租金调整策略', '入住退房手续与验房报告'],
    link: '/wuye/zulin',
    icon: ClipboardCheck,
  },
  {
    title: '收支与税务',
    details: ['每月租金收取与催缴', '资产报表与税务建议', '多货币结算与跨境汇款支持'],
    link: '/wuye/shouzhi',
    icon: DollarSign,
  },
  {
    title: '修缮维护',
    details: ['24 小时应急维修', '定期检查与耗材更换', '装修升级与项目管理'],
    link: '/wuye/xiushan',
    icon: Wrench,
  },
  {
    title: '资产增值',
    details: ['租金交涉', '大规模修缮', '相关附加收益'],
    link: '/wuye/zengzhi',
    icon: TrendingUp,
  },
  {
    title: '入住者服务',
    details: ['入住欢迎与生活指南', '中文/日文客服与投诉响应', '居住期间日常支援协调'],
    link: '/wuye/ruzhu',
    icon: Users,
  },
  {
    title: '相关保险',
    details: ['火灾险与地震险配置', '租金补偿险与责任险', '理赔协助与续保提醒'],
    link: '/wuye/baoxian',
    icon: Shield,
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
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-navy-900/60"></div>
          </div>
          <div className="relative z-10 container-custom">
            <p className="text-sm text-blue-300 font-semibold mb-4">物业管理 Property Management</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">全托管物业管理服务</h1>
            <p className="text-lg text-gray-200 max-w-3xl leading-relaxed">
              针对在日本持有房产的个人与机构业主，提供租赁运营、财务报表、维修维护及保险配置等全方位托管服务，让您身处海外也能实时掌控资产状况，享受省心收益。
            </p>
          </div>
        </section>

      <section id="tenant-services" className="section-padding">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-navy-700 mb-6">服务内容</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {managementHighlights.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.title} href={item.link} className="block">
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-navy-700">{item.title}</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {item.details.map((detail) => (
                        <li key={detail} className="flex items-start gap-2 leading-relaxed">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-navy-700 mb-6">管理房产</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {managedProperties.map((property) => (
              <Link key={property.id} href={`/cases/${property.id}`} className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
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
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-bold text-navy-700 mb-4">需要我们接管您的在日资产吗？</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6 leading-relaxed">
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


