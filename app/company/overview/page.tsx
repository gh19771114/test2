'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import headquarterImage from '@/imgs/本社图片-无背景-preview.png'

const professionalTeam = [
  { title: '日本不动产交易士', count: '7名' },
  { title: '租赁不动产经营管理士', count: '4名' },
  { title: '公寓楼管理士', count: '1名' },
  { title: 'Financial Planner 3级', count: '1名' },
  { title: 'Financial Planner 2级', count: '1名' },
]

const partnerNetwork = [
  { title: '外部顾问', count: '1名' },
  { title: '顾问律师事务所', count: '2所' },
  { title: '合作税理士事务所', count: '7所' },
  { title: '合作银行', count: '10家' },
  { title: '合作司法书士事务所', count: '2所' },
  { title: '战略合作伙伴', count: '1所' },
  { title: '不动产投资鉴定事务所', count: '4所' },
]

const corporateProfile = [
  { label: '公司名', value: '川雨流痕股份有限公司（Bourn Mark CO., LTD.）' },
  { label: '成立日期', value: '2009 年 6 月 1 日' },
  { label: '法人代表', value: '桂 小川' },
  { label: '资本金', value: '2,500 万日元' },
  { label: '总部地址', value: '東京都中央区日本橋人形町1-2-12 Bourn Mark Ningyocho BLD. 2F' },
  { label: '子公司', value: '株式会社イボルブ' },
  {
    label: '业务内容',
    value: '国际不动产业务・物业管理业务・不动产租赁业务・企业投资业务',
  },
  {
    label: '加盟团体',
    value: '公益财团法人 全日本不动产协会、公益财团法人 保证协会、在日中国企业协会、全日本中国企业协会联合会',
  },
  {
    label: '资格认证',
    value: '宅地建物取引业免许・賃貸住宅管理业者登记・古物营业许可等',
  },
]

const financialPartners = [
  { name: '三井住友银行', branch: '人形町支行', abbr: 'SMBC', color: 'bg-green-600' },
  { name: '三菱UFJ银行', branch: '日暮里支行', abbr: 'MUFG', color: 'bg-red-600' },
  { name: '瑞穗银行', branch: '新桥支行', abbr: 'MIZUHO', color: 'bg-blue-600' },
  { name: '绮罗星银行', branch: '新宿支行', abbr: 'KIRA', color: 'bg-purple-500' },
  { name: '东日本银行', branch: '东日本桥支行', abbr: 'HIGASHI', color: 'bg-cyan-600' },
  { name: '关西未来银行', branch: '东京支行', abbr: 'KMB', color: 'bg-emerald-600' },
  { name: '东京信用金库', branch: '日本桥支行', abbr: 'TOSHI', color: 'bg-orange-500' },
  { name: '巢鸭信用金库', branch: '西日暮里支行', abbr: 'SUGAMO', color: 'bg-amber-600' },
]

export default function CompanyOverviewPage() {
  return (
    <PageLayout>
      <div className="relative">
        <section className="relative pt-28 pb-16 bg-gradient-to-br from-navy-800 via-blue-800 to-purple-800 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="企业概要"
              fill
              className="object-cover opacity-30"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-navy-900/80 to-blue-900/60"></div>
          </div>
          <div className="relative z-10 container-custom space-y-4">
            <p className="text-sm text-blue-200 font-semibold">Company Profile</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">企业概要</h1>
            <div className="max-w-4xl space-y-4 text-gray-100 text-lg leading-relaxed">
              <p>
                川雨流痕股份有限公司（Bourn Mark CO., LTD.）扎根东京中央区日本桥人形町，毗邻多条地铁与商务枢纽，具备覆盖首都圈乃至日本全国的服务能力。
              </p>
              <p>
                我们整合不动产运营、企业落地与自有投资经验，凭借多语种专业团队与数字化管理体系，为跨境客户提供透明、高效、长周期的综合解决方案。
              </p>
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom">
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-10 items-stretch">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10">
                <h2 className="text-2xl font-bold text-navy-700 mb-6">公司概况一览</h2>
                <div className="space-y-4">
                  {corporateProfile.map((item) => (
                    <div key={item.label} className="bg-gray-50 rounded-2xl px-5 py-4 border border-gray-100">
                      <p className="text-sm font-semibold text-blue-600 tracking-wide mb-1">{item.label}</p>
                      <p className="text-gray-700 leading-relaxed text-balance">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl border border-blue-100 shadow-xl min-h-[260px] xl:min-h-full">
                <Image
                  src={headquarterImage}
                  alt="公司总部外观"
                  fill
                  className="object-contain xl:object-cover"
                  priority={false}
                  sizes="(min-width: 1280px) 40vw, 80vw"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/25 via-black/15 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold text-navy-700 mb-6">专业团队</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {professionalTeam.map((item) => (
                    <div key={item.title} className="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3">
                      <span className="text-gray-700 font-medium">{item.title}</span>
                      <span className="text-blue-600 font-semibold">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold text-navy-700 mb-6">合作伙伴</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {partnerNetwork.map((item) => (
                    <div key={item.title} className="flex items-center justify-between bg-green-50 rounded-xl px-4 py-3">
                      <span className="text-gray-700 font-medium">{item.title}</span>
                      <span className="text-green-600 font-semibold">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom max-w-6xl">
            <div className="bg-gray-50 rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100">
              <h2 className="text-2xl md:text-3xl font-bold text-navy-700 mb-6 text-center">主要合作金融机构</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {financialPartners.map((bank) => (
                  <div key={bank.name} className="flex items-center gap-4 bg-white rounded-xl px-5 py-4 border border-gray-100 shadow-sm">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xs font-semibold ${bank.color}`}>
                      {bank.abbr}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 font-semibold text-sm md:text-base">{bank.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{bank.branch}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}

