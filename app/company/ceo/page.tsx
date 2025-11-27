'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import { useState } from 'react'
import ceoPortrait1 from '@/imgs/ceo3.png'
import ceoPortrait2 from '@/imgs/ceo2.png'

const profileHighlights = [
  { label: '出生', value: '1975 年 9 月，中国桂林' },
  { label: '学历', value: '1996 年毕业于桂林工学院' },
  { label: '早期经历', value: ['曾任职于中国银行桂林分行', '1997 年赴日留学'] },
  { label: '专业资格', value: '1999 年取得日本宅地建物取引士资格' },
  { label: '职业历程', value: ['2000 年加入株式会社 minimini', '2009 年创立株式会社川雨流痕（原社名：株式会社暖灯）'] },
  { label: '现任职务', value: '川雨流痕股份有限公司 代表董事社长' },
  { label: '社会职务', value: '中国企业协会常务理事、资产资源整合委员会主任' },
  { label: '媒体报道', value: '曾获《财界》《周刊大楼经营》《日经新闻》与 NHK《クローズアップ現代》等媒体专题报道' },
]

const messageParagraphs = [
  '1997 年，我怀抱创业理想从中国来到日本，以不动产业务为起点，于 2009 年成立了本公司。伴随着时代的更迭，我们经历了从业务快速搭建到不断深耕的过程，业务拓展范围涵盖租赁、管理、买卖、投资等领域，并在经营规模、运营实绩和服务能力等方面取得长足进步。',
  '在专注业务发展的同时，我们也不断反思企业存在的意义，回归“企业应为社会之公器”的基本理念。我来到日本后始终坚守的信念——“搭建中日友好的桥梁”——在这段历程中得以实践。我深知改善中日关系任重道远，并非只靠口号即可实现，但我愿意投入时间，通过商业活动为中日友好贡献绵薄之力。',
  '长期以来，我们通过不动产业务与中日经济领域的企业携手，与卓越经营者一道，积极推进构筑大中华经济圈。未来，我们将正式开展投资业务，并在强化核心的物业管理业务的同时，大力推进 IT 开发应用，推动数字化、智能化转型，提升管理与服务能力，培育新的业务增长点，力求拓展更广阔的业务版图。',
]

const tabs: Array<{ id: 'profile' | 'message'; label: string }> = [
  { id: 'profile', label: '社长介绍' },
  { id: 'message', label: '社长寄语' },
]

export default function CompanyCeoPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'message'>('profile')

  return (
    <PageLayout>
      <section className="relative pt-28 pb-20 bg-gradient-to-br from-amber-800 via-amber-700 to-navy-800 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="社长介绍"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/80 to-navy-900/60"></div>
        </div>
        <div className="relative z-10 container-custom text-center md:text-left">
            <p className="text-sm text-amber-300 font-semibold mb-4">President Message</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">社长介绍</h1>
            <p className="mt-4 text-base md:text-lg text-gray-200 max-w-3xl">
              通过跨文化的视角与专业实务经验，Bourn Mark 代表董事社长桂小川带领团队深耕日本不动产市场，持续搭建中日商务合作的桥梁。
            </p>
            <div className="mt-10 w-full max-w-3xl mx-auto md:mx-0 rounded-2xl overflow-hidden border border-white/40 bg-white  grid grid-cols-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full px-6 py-3 text-sm md:text-lg font-semibold transition-all ${
                      isActive
                        ? 'bg-white text-navy-800 shadow-lg'
                        : 'text-navy-900/85 hover:bg-white/15 hover:text-navy-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {activeTab === 'profile' ? (
          <section className="relative section-padding">
          
          <div className="container-custom grid gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] items-start">
              <div className="relative w-full max-w-sm mx-auto lg:mx-0 aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                <Image src={ceoPortrait2} alt="桂小川肖像" fill className="object-cover" sizes="(min-width: 1024px) 28vw, 80vw" />
              </div>
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-10 space-y-8">
                <div className="space-y-6">
                  <h2 className="text-4xl md:text-5xl font-bold text-navy-800 mb-6">桂小川</h2>
                  <div className="space-y-5">
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                      自 2009 年创立 Bourn Mark 以来，以跨文化视角与专业实务经验带领团队深耕日本不动产市场，致力于搭建中日商务合作的桥梁，推动资产运营、企业落地与投资业务的协同发展。
                    </p>
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                      将企业定位于&ldquo;根植日本、连接中日&rdquo;，以扎实的租赁管理、资产增值与企业服务经验，持续扩展公司的业务版图，并通过长期主义的经营理念，打造兼具国际视野与本地执行力的服务体系。
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {profileHighlights.map((item) => (
                    <div key={item.label} className="bg-gray-50 rounded-2xl px-5 py-4 border border-gray-100 shadow-sm">
                      <p className="text-sm font-semibold text-indigo-600 mb-1">{item.label}</p>
                      {Array.isArray(item.value) ? (
                        <div className="space-y-1">
                          {item.value.map((line, index) => (
                            <p key={index} className="text-gray-700 leading-relaxed">{line}</p>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-700 leading-relaxed text-balance">{item.value}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="relative min-h-[90vh] bg-[#f3eadf]" style={{ background: '#f3eadf' }}>
            <div className="absolute inset-0 flex justify-center" style={{ paddingLeft: '8%' }}>
              <div className="relative w-full max-w-[1120px] h-[90vh] overflow-hidden">
                <Image
                  src={ceoPortrait1}
                  alt="桂小川人物照片"
                  fill
                  className="object-contain object-bottom"
                  priority={false}
                  sizes="100vw"
                />
              </div>
            </div>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#f2e7da] via-[#f2e7da]/82 to-transparent"></div>
              <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[#f4ecde] via-[#f4ecde]/80 to-transparent"></div>
            </div>
            <div className="container-custom relative z-10 flex items-start md:items-center justify-start py-16 md:py-20" style={{ paddingLeft: 'calc(1rem + 8%)' }}>
              <div className="max-w-[620px] text-slate-900 space-y-6">
                <div>
                  <p className="text-xl tracking-[0.35em] text-slate-700">董事长寄语</p>
                  <p className="text-sm uppercase tracking-[0.4em] text-slate-500 mt-2">Message From President</p>
                </div>
                <div className="space-y-5 text-[1.05rem] leading-relaxed">
                  {messageParagraphs.map((paragraph) => (
                    <p key={paragraph} className="text-balance">
                      {paragraph}
                    </p>
                  ))}
                </div>
                <div className="pt-4">
                  <p className="text-base text-slate-600">董事长 / President</p>
                  <p className="text-2xl font-semibold text-navy-800 mt-2 tracking-wide">桂 小川</p>
                </div>
              </div>
            </div>
          </section>
        )}
    </PageLayout>
  )
}

