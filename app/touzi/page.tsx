'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import Link from 'next/link'
import { TrendingUp, Rocket, Building2, Briefcase } from 'lucide-react'
import { investmentProperties } from './propertyData'

export default function TouZiPage() {
  return (
    <PageLayout>
      <div className="relative">
        {/* Hero Section with Background Image */}
        <section className="relative pt-28 pb-16 bg-gradient-to-br from-purple-800 via-blue-800 to-navy-800 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="资产投资运营"
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 to-navy-900/60"></div>
          </div>
          <div className="relative z-10 container-custom">
            <p className="text-sm text-purple-300 font-semibold mb-4">资产投资运营 Asset Investment</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">Bourn Mark 资产投资运营</h1>
            <p className="text-lg text-gray-200 max-w-3xl leading-relaxed">
              Bourn Mark 长期投入自有资本于优良资产的投资与运营。本页旨在展示既有投资项目与管理实力，相关信息仅供业务介绍之用，不面向客户提供任何资产投资或募集服务。
            </p>
          </div>
        </section>

        {/* 不动产投资 */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-navy-700">不动产投资资产</h2>
              </div>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                依托东京、关西与北海道等核心城市的市场洞察，我们以自有资金投资稀缺型物业，并由内部团队统筹运营，确保资产稳健成长。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-navy-700 mb-3">精选投资标的</h3>
                  <p className="text-gray-600 leading-relaxed">聚焦城市核心物业、特色资产与高成长区域，实现长期持有与收益再投入。</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-navy-700 mb-3">风险评估与回报分析</h3>
                  <p className="text-gray-600 leading-relaxed">集团投研中心定期审视现金流、租客结构与市场波动，维持资产组合的健康度。</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-navy-700 mb-3">资产管理服务</h3>
                  <p className="text-gray-600 leading-relaxed">自建物业管理体系与合作伙伴网络，统一监管营运、改装与增值计划。</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl p-8 md:p-10 border border-blue-100 shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-navy-700 mb-2">企业持有</h3>
                    <p className="text-gray-600">呈现 Bourn Mark 在日本各地持有并长期运营的物业资产，所有项目均由内部团队自主管理。</p>
                  </div>
                  <a
                    href="/touzi/cases"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    查看更多买卖案例
                    <span aria-hidden>→</span>
                  </a>
                </div>

                <div className="relative">
                  <div className="overflow-x-auto pb-4">
                    <div className="flex gap-6 min-w-max">
                      {investmentProperties.map((item) => (
                        <Link
                          key={item.slug}
                          href={`/touzi/properties/${item.slug}`}
                          className="group relative w-80 md:w-96 rounded-2xl bg-white shadow-md border border-blue-100 hover:border-blue-300 transition-all duration-300 overflow-hidden"
                        >
                          <div className="relative h-56">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 40vw, 80vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                            <div className="absolute bottom-3 left-4 right-4 text-white">
                              <p className="text-sm text-white/80 mb-1">{item.location}</p>
                              <h4 className="text-lg font-semibold leading-snug">{item.title}</h4>
                            </div>
                          </div>
                          <div className="p-5 space-y-2">
                            <p className="text-sm text-blue-600 font-semibold">{item.price}</p>
                            <p className="text-sm text-gray-500">{item.type}</p>
                            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{item.description}</p>
                            <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:translate-x-1 transition-transform">
                              了解详情
                              <span aria-hidden>→</span>
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 初创企业投资 */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <Rocket className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold text-navy-700">初创企业投资</h2>
              </div>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                所投资的创新企业以数字化、文化创意与跨境服务为重点，借助集团资源协助其在日本市场迅速站稳脚跟。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-navy-700 mb-3">早期项目筛选</h3>
                  <p className="text-gray-600 leading-relaxed">联合创投伙伴与行业专家设立评审机制，从市场痛点与成长潜力双重维度挑选投资标的。</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-navy-700 mb-3">资金与资源对接</h3>
                  <p className="text-gray-600 leading-relaxed">注入资金的同时，提供品牌、本地渠道、人才等多维资源协同，助力业务落地扩张。</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-navy-700 mb-3">成长辅导与退出支持</h3>
                  <p className="text-gray-600 leading-relaxed">通过阶段性里程碑设定与治理结构升级，陪伴团队完成下一轮融资或战略退出。</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}

