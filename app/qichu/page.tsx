'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import { Building2, Users, Briefcase, Landmark, Globe } from 'lucide-react'

const relatedServices = [
  {
    name: '商业地产租赁',
    desc: '提供东京周边地区商铺、写字楼、工厂、仓库等各种商业地产的租赁服务。',
  },
  {
    name: '室内软装',
    desc: '根据品牌定位提供室内软装设计、陈设与执行，打造统一的空间体验。',
  },
  {
    name: '办公设备采购及设置',
    desc: '整合IT设备、办公家具等采购渠道，负责配送、安装与调试。',
  },
  {
    name: '企业相关活动承办',
    desc: '开业典礼、展会设置等商务活动的策划与现场执行支持。',
  },
  {
    name: '广告宣传策划',
    desc: '整合线上线下媒体资源，制定品牌本地化宣传与推广方案。',
  },
]

const partners = [
  {
    name: '日本大型金融机构',
    desc: '提供企业开户、资金结算与财务顾问服务，为新设法人提供本地金融支持。',
  },
  {
    name: '在日中国企业协会',
    desc: '连接在日华人企业资源，提供政策解读、活动交流与会员支持。',
  },
  {
    name: '全日本中国企业协会联合会',
    desc: '协调各地区中国商会资源，提供跨区域商务联动与渠道拓展。',
  },
  {
    name: '综合法律与会计事务所',
    desc: '覆盖公司注册、税务规划、劳动法规与知识产权保护的一站式方案。',
  },
  {
    name: 'Jetro 日本贸易振兴协会',
    desc: '提供市场情报、补贴申报、展会对接等官方资源，协助企业落地日本市场。',
  },
  {
    name: '苏州工业园区东京商务中心',
    desc: '对接江浙优质企业在日发展，提供跨国设点、商务活动与招商服务。',
    link: '#小程序://苏州工业园区东京商务中心/6pgYUElzfmOA17s',
  },
  {
    name: '大型保证公司',
    desc: '拥有32家日本保证公司的相关业务代理权。',
  },
  {
    name: '日本大型装修公司',
    desc: '承接各种室内装修业务。',
  },
  {
    name: '日本大型保险公司',
    desc: '承办小额短期、火灾、地震等各种保险业务。',
  },
]

const partnerIcons = [Building2, Users, Briefcase, Globe, Landmark]

const projects = [
  {
    title: '金山 WPS 日本子公司设立服务',
    result: '协助完成法人登记、签约日本大型不动产公司设立办公室，并搭建本地财务与招聘体系。',
  },
  {
    title: '小米日本分公司设立咨询服务',
    result: '提供市场进入策略与合规咨询，统筹办公选址、品牌本地化及通路合作伙伴对接。',
  },
]

export default function QiChuPage() {
  return (
    <PageLayout>
      <div className="relative">
        {/* Hero Section with Background Image */}
        <section className="relative pt-28 pb-16 bg-gradient-to-br from-green-800 via-green-700 to-navy-800 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="企业出海"
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 to-navy-900/60"></div>
          </div>
          <div className="relative z-10 container-custom">
            <p className="text-sm text-green-300 font-semibold mb-4">企业出海助力 Corporate Expansion</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">企业出海助力与落地服务</h1>
            <p className="text-lg text-gray-200 max-w-3xl leading-relaxed">
              面向计划进入日本市场的企业，提供市场进入策略、合作伙伴对接、合规办理及品牌本地化支持，帮助团队快速搭建在地运营体系，降低文化与制度差异带来的挑战。
            </p>
          </div>
        </section>

      <section id="services" className="section-padding">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-navy-700 mb-6">相关服务</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedServices.map((service, index) => {
              const Icon = partnerIcons[index] ?? Globe
              return (
                <div
                  key={service.name}
                  className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-transform duration-200 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Icon className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-navy-700">{service.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{service.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="partners" className="section-padding">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-navy-700 mb-6">合作伙伴网络</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {partners.map((partner, index) => {
              const Icon = partnerIcons[index]
              const cardContent = (
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      {Icon ? <Icon className="w-6 h-6 text-green-600" /> : <Globe className="w-6 h-6 text-green-600" />}
                    </div>
                    <h3 className="text-lg font-semibold text-navy-700">{partner.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{partner.desc}</p>
                </div>
              )

              if (partner.link) {
                return (
                  <a
                    key={partner.name}
                    href={partner.link}
                    className="block focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded-2xl"
                  >
                    {cardContent}
                  </a>
                )
              }

              return (
                <div key={partner.name}>
                  {cardContent}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="cases" className="section-padding">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-navy-700 mb-6">成功案例</h2>
          <div className="space-y-6">
            {projects.map((project) => (
              <div key={project.title} className="rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-100 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-navy-700 mb-2">{project.title}</h3>
                <p className="text-sm text-gray-600">{project.result}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-bold text-navy-700 mb-4">计划拓展日本业务？</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6 leading-relaxed">
            告诉我们您的行业、预算与时间安排，我们将提供市场评估、落地路线与伙伴资源建议，为您构建可持续的在日业务体系。
          </p>
          <a href="/#contact" className="btn-primary inline-flex items-center gap-2">
            获取专属方案
          </a>
        </div>
      </section>
      </div>
    </PageLayout>
  )
}


