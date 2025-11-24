import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import PageLayout from '@/components/PageLayout'
import { investmentProperties } from '../../propertyData'

interface PropertyPageProps {
  params: { slug: string }
}

export default function InvestmentPropertyPage({ params }: PropertyPageProps) {
  const property = investmentProperties.find((item) => item.slug === params.slug)

  if (!property) {
    return notFound()
  }

  return (
    <PageLayout>
      <section className="relative pt-28 pb-16 bg-gradient-to-br from-navy-800 via-blue-800 to-purple-800 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={property.image}
            alt={property.title}
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-navy-900/85 via-navy-900/60 to-blue-900/70" />
        </div>
        <div className="relative z-10 container-custom text-white">
          <p className="text-sm uppercase tracking-[0.4em] text-white/70 mb-3">Investment Property</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 max-w-3xl leading-tight">
            {property.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
            <span>项目位置：{property.location}</span>
            <span>资产类型：{property.type}</span>
            <span>参考价格：{property.price}</span>
          </div>
        </div>
      </section>

      <section className="relative section-padding">
        <div className="absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="房产详情背景"
            fill
            className="object-cover"
            priority={false}
          />
          <div className="absolute inset-0 bg-navy-900/80 backdrop-blur-sm" />
        </div>
        <div className="container-custom relative z-10 grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-12">
          <div className="space-y-8">
            <article className="prose prose-slate max-w-none">
              <h2 className="text-2xl font-bold text-navy-700">项目概览</h2>
              <p className="text-gray-700 leading-relaxed">
                {property.description}
              </p>
            </article>

            <div>
              <h3 className="text-xl font-semibold text-navy-700 mb-4">投资亮点</h3>
              <div className="space-y-3">
                {property.highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm text-blue-900"
                  >
                    {highlight}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-navy-700 mb-3">我们可以提供的支持</h3>
              <ul className="space-y-2 text-gray-600 text-sm leading-relaxed">
                <li>· 专属顾问陪同尽调、估值与收益模型搭建</li>
                <li>· 协助办理融资、税务、法人登记等全链条手续</li>
                <li>· 提供租赁运营、物业管理与退出策略规划</li>
              </ul>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-gray-100 bg-gray-50 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-navy-700 mb-3">预约深度咨询</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                联系我们的投资顾问，获取完整的财务模型、现金流预测与尽调报告样本。
              </p>
              <a href="/#contact" className="btn-primary inline-flex items-center justify-center w-full">
                安排项目说明
              </a>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-navy-700 mb-3">返回投资列表</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                浏览当前的投资机会，挑选最符合您资产配置需求的项目。
              </p>
              <Link
                href="/touzi"
                className="inline-flex items-center justify-center w-full rounded-lg border border-blue-200 px-4 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50"
              >
                返回投资相关页面
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </PageLayout>
  )
}



