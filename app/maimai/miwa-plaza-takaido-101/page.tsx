'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Train, Shield, Clock, TrendingUp, ArrowLeft } from 'lucide-react'

export default function MiwaPlazaTakaido1FPortfolioPage() {
  return (
    <PageLayout>
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <section className="relative overflow-hidden bg-gradient-to-br from-sky-100 via-slate-50 to-rose-100 pt-28 pb-16">
          <div className="container-custom">
            <div className="mx-auto max-w-6xl">
              <Link
                href="/maimai"
                className="mb-6 inline-flex items-center gap-2 rounded-lg bg-white/80 px-4 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-white hover:text-slate-900 shadow-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                返回上一页
              </Link>
            </div>
            <div className="mx-auto max-w-6xl lg:flex lg:items-center lg:gap-10">
              <div className="flex-1">
                <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-sky-700">
                  不动产投资用 房源介绍
                </p>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                  美和プラザ高井戸 1层 101-104-106号室 投资组合
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-slate-700">
                  位于京王线「八幡山」「上北沢」站步行范围内的美和プラザ高井戸。
                  1层的3户（101-104-106号室）统一取得运营，预期用于投资的组合。
                </p>

                <dl className="mt-6 grid grid-cols-1 gap-4 text-xs sm:grid-cols-3">
                  <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                    <dt className="text-slate-500">房源类型</dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      1K×3户
                      <span className="block text-[11px] text-slate-500">
                        面向单身者
                      </span>
                    </dd>
                  </div>
                  <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                    <dt className="text-slate-500">最近车站</dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      八幡山站 步行8〜11分
                      <span className="block text-[11px] text-slate-500">
                        上北沢站也步行9分
                      </span>
                    </dd>
                  </div>
                  <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                    <dt className="text-slate-500">结构规模</dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      RC造4层建
                      <span className="block text-[11px] text-slate-500">
                        1986年6月竣工
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-8 flex-1 justify-center lg:flex">
                <div className="relative h-64 w-full max-w-sm overflow-hidden rounded-3xl bg-slate-900/5 shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt="美和プラザ高井戸外观"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent" />
                  <div className="absolute bottom-3 left-4 text-xs text-slate-50 drop-shadow">
                    <p className="font-semibold">外观图片</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-12">
          <div className="container-custom">
            <div className="mx-auto max-w-6xl">
              <h2 className="mb-6 text-xl font-semibold text-slate-900">房源照片</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="relative h-64 overflow-hidden rounded-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="建筑物外观"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-64 overflow-hidden rounded-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1560449752-91594c95c0ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="周边环境"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-64 overflow-hidden rounded-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="内装图片"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-6 max-w-6xl px-4 pb-14 text-xs">
          <div className="grid gap-10 lg:grid-cols-[2fr,1.2fr]">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">建筑物概要</h2>
              <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm">
                <table className="w-full border-separate border-spacing-0">
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <th className="w-32 bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        所在地
                      </th>
                      <td className="px-4 py-3">
                        东京都杉并区上高井戸3丁目1-16 美和プラザ高井戸
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100 align-top">
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        交通
                      </th>
                      <td className="px-4 py-3">
                        <ul className="space-y-1">
                          <li>京王线「八幡山」站 步行8〜11分</li>
                          <li>京王线「上北沢」站 步行9分</li>
                        </ul>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        结构规模
                      </th>
                      <td className="px-4 py-3">
                        钢筋混凝土结构4层建／1986年6月竣工
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        设备特征
                      </th>
                      <td className="px-4 py-3">
                        自动锁／宅配箱／电梯／阳台／
                        互联网接入／楼内垃圾放置场 等
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="mt-8 text-lg font-semibold text-slate-900">
                1层投资组合概要（101-104-106号室）
              </h2>
              <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm">
                <table className="w-full border-separate border-spacing-0">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] text-slate-500">
                      <th className="px-4 py-2 text-left">号室</th>
                      <th className="px-4 py-2 text-left">所在层</th>
                      <th className="px-4 py-2 text-left">户型</th>
                      <th className="px-4 py-2 text-left">专有面积</th>
                      <th className="px-4 py-2 text-left">预期租金</th>
                      <th className="px-4 py-2 text-left">备注</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-slate-100">
                      <td className="px-4 py-2 font-semibold text-slate-900">101</td>
                      <td className="px-4 py-2">1层</td>
                      <td className="px-4 py-2">1K</td>
                      <td className="px-4 py-2">
                        ○○ m²
                        <span className="ml-1 text-[11px] text-amber-600">
                          ※请输入图纸数值
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        ○○万日元／月
                        <span className="ml-1 text-[11px] text-amber-600">
                          ※请反映租金表
                        </span>
                      </td>
                      <td className="px-4 py-2">角落房间（预计）</td>
                    </tr>
                    <tr className="border-t border-slate-100">
                      <td className="px-4 py-2 font-semibold text-slate-900">104</td>
                      <td className="px-4 py-2">1层</td>
                      <td className="px-4 py-2">1K</td>
                      <td className="px-4 py-2">
                        ○○ m²
                        <span className="ml-1 text-[11px] text-amber-600">
                          ※请输入图纸数值
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        ○○万日元／月
                        <span className="ml-1 text-[11px] text-amber-600">
                          ※请反映租金表
                        </span>
                      </td>
                      <td className="px-4 py-2">中间房间</td>
                    </tr>
                    <tr className="border-t border-slate-100">
                      <td className="px-4 py-2 font-semibold text-slate-900">106</td>
                      <td className="px-4 py-2">1层</td>
                      <td className="px-4 py-2">1K</td>
                      <td className="px-4 py-2">
                        ○○ m²
                        <span className="ml-1 text-[11px] text-amber-600">
                          ※请输入图纸数值
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        ○○万日元／月
                        <span className="ml-1 text-[11px] text-amber-600">
                          ※请反映租金表
                        </span>
                      </td>
                      <td className="px-4 py-2">已有出租案例（1K）</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="mt-8 text-lg font-semibold text-slate-900">投资运营要点</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-white p-4 text-xs shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-sky-600" />
                    <h3 className="text-sm font-semibold text-slate-900">1栋内的分散投资可能</h3>
                  </div>
                  <p className="mt-2 leading-relaxed text-slate-700">
                    在同一公寓内持有1K户型3户，可以平摊空置风险，同时减少管理成本，实现高效运营。
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 text-xs shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <Train className="h-4 w-4 text-rose-600" />
                    <h3 className="text-sm font-semibold text-slate-900">京王线沿线的稳定单身需求</h3>
                  </div>
                  <p className="mt-2 leading-relaxed text-slate-700">
                    京王线沿线前往新宿方向交通便利，社会人和学生等单身者需求旺盛，
                    是适合长期持有1K户型的区域。
                  </p>
                </div>
              </div>

              <h2 className="mt-10 text-lg font-semibold text-slate-900">周边设施环境</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="rounded-xl bg-gradient-to-br from-sky-50 to-white p-4 shadow-sm">
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">生活设施</h3>
                  <ul className="space-y-1 text-slate-700">
                    <li>・便利店</li>
                    <li>・超市</li>
                    <li>・药妆店</li>
                    <li>・公园</li>
                  </ul>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-rose-50 to-white p-4 shadow-sm">
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">教育文化</h3>
                  <ul className="space-y-1 text-slate-700">
                    <li>・各种学校</li>
                    <li>・图书馆</li>
                    <li>・体育设施</li>
                  </ul>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-purple-50 to-white p-4 shadow-sm">
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">交通访问</h3>
                  <ul className="space-y-1 text-slate-700">
                    <li>・到新宿站约15分</li>
                    <li>・到涩谷站约20分</li>
                    <li>・京王线沿线各站</li>
                  </ul>
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-2xl bg-white p-5 text-xs shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-sky-600" />
                  <h3 className="text-sm font-semibold text-slate-900">位置</h3>
                </div>
                <p className="mt-2 leading-relaxed text-slate-700">
                  周边有便利店超市药妆店公园等齐全，
                  安静住宅街的氛围与日常便利性兼备的区域。
                </p>
              </div>

              <div className="rounded-2xl bg-slate-900 p-5 text-xs text-slate-100">
                <div className="mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-sky-400" />
                  <h3 className="text-sm font-semibold">目标客户</h3>
                </div>
                <ul className="mt-3 space-y-1">
                  <li>・寻求分散投资的个人投资者</li>
                  <li>・重视稳定租赁收益的长期持有型</li>
                  <li>・京王线沿线通勤的单身者</li>
                </ul>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 p-5 text-xs text-amber-900">
                <div className="mb-3 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-700" />
                  <h3 className="text-sm font-semibold">注意事项</h3>
                </div>
                <p className="mt-2 leading-relaxed">
                  101-104-106号室各自的面积、租金、管理费等，请务必根据最新租金表、租赁合同输入。
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section className="bg-white py-12">
          <div className="container-custom">
            <div className="mx-auto max-w-6xl flex justify-center">
              <Link
                href="/maimai"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-6 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 hover:text-slate-900 shadow-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                返回上一页
              </Link>
            </div>
          </div>
        </section>
      </main>
    </PageLayout>
  )
}
