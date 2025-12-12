'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Building2, Train, TrendingUp, Shield, Clock, ArrowLeft } from 'lucide-react'

export default function PalaisDorSagamihara808Page() {
  return (
    <PageLayout>
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <section className="relative overflow-hidden bg-gradient-to-br from-sky-100 via-slate-50 to-indigo-100 pt-28 pb-16">
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
                  パレ・ドール相模原 808号室
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-slate-700">
                  JR横滨线「相模原」站步行8〜9分，站北侧的住宅街建的投资用公寓。
                  808号室作为上阶层住戸，可期待采光和眺望的1R类型预期住戸。
                </p>

                <dl className="mt-6 grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
                  <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                    <dt className="text-slate-500">专有面积</dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      ○○ m²
                      <span className="block text-[11px] text-amber-600">
                        ※请输入登记簿・图纸数值
                      </span>
                    </dd>
                  </div>
                  <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                    <dt className="text-slate-500">户型</dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      1R 预期
                      <span className="block text-[11px] text-slate-500">
                        ※请确认实际户型类型后修正
                      </span>
                    </dd>
                  </div>
                  <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                    <dt className="text-slate-500">最近车站</dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      相模原站 步行8〜9分
                      <span className="block text-[11px] text-slate-500">
                        横滨线到町田・横滨方向
                      </span>
                    </dd>
                  </div>
                  <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                    <dt className="text-slate-500">预期收益率</dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      ○○％
                      <span className="block text-[11px] text-amber-600">
                        ※价格・租金确定后算出
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-8 flex-1 justify-center lg:flex">
                <div className="relative h-64 w-full max-w-sm overflow-hidden rounded-3xl bg-slate-900/5 shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1560449752-91594c95c0ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt="パレ・ドール相模原外观"
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

        {/* 图片画廊 */}
        <section className="bg-white py-12">
          <div className="container-custom">
            <div className="mx-auto max-w-6xl">
              <h2 className="mb-6 text-xl font-semibold text-slate-900">房源照片</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="relative h-64 overflow-hidden rounded-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1560449752-91594c95c0ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="建筑物外观"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-64 overflow-hidden rounded-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="周边环境"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-64 overflow-hidden rounded-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="内装图片"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-6 max-w-6xl px-4 pb-14">
          <div className="grid gap-10 lg:grid-cols-[2fr,1.2fr]">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">房源概要</h2>
              <div className="mt-4 overflow-hidden rounded-2xl bg-white text-xs shadow-sm">
                <table className="w-full border-separate border-spacing-0">
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <th className="w-32 bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        所在地
                      </th>
                      <td className="px-4 py-3">
                        神奈川县相模原市中央区相模原6丁目 パレ・ドール相模原
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100 align-top">
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        交通
                      </th>
                      <td className="px-4 py-3">
                        <ul className="space-y-1">
                          <li>JR横滨线「相模原」站 步行8〜9分</li>
                          <li>JR横滨线「矢部」站 步行21分</li>
                        </ul>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        结构・规模
                      </th>
                      <td className="px-4 py-3">
                        钢筋混凝土结构 地上9层・地下1层建／总户数71户／1993年7月竣工
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        设备・特征
                      </th>
                      <td className="px-4 py-3">
                        外壁瓷砖贴面／电梯／停车场有／公营水道 等
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="mt-8 text-lg font-semibold text-slate-900">投资・运营要点</h2>
              <div className="mt-4 grid gap-4 text-xs md:grid-cols-2">
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <Train className="h-4 w-4 text-sky-600" />
                    <h3 className="text-sm font-semibold text-slate-900">站步行10分范围内的紧凑1R</h3>
                  </div>
                  <p className="mt-2 leading-relaxed text-slate-700">
                    横滨线沿线・相模原站步行范围内的单间需求可以吸收的位置。
                    单身者向的稳定租赁需求可以期待。
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-indigo-600" />
                    <h3 className="text-sm font-semibold text-slate-900">上阶层独有的采光・眺望</h3>
                  </div>
                  <p className="mt-2 leading-relaxed text-slate-700">
                    8层部分的住戸，可以眺望低层住宅街的眺望・日照条件有魅力。
                    作为募集时的照片・宣传要点容易差异化的要素。
                  </p>
                </div>
              </div>

              {/* 周边设施 */}
              <h2 className="mt-10 text-lg font-semibold text-slate-900">周边设施・环境</h2>
              <div className="mt-4 grid gap-4 text-xs md:grid-cols-3">
                <div className="rounded-xl bg-gradient-to-br from-sky-50 to-white p-4 shadow-sm">
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">生活设施</h3>
                  <ul className="space-y-1 text-slate-700">
                    <li>・超市</li>
                    <li>・便利店</li>
                    <li>・药妆店</li>
                    <li>・各种餐饮店</li>
                  </ul>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-white p-4 shadow-sm">
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">交通・访问</h3>
                  <ul className="space-y-1 text-slate-700">
                    <li>・到町田站约15分</li>
                    <li>・到横滨站约30分</li>
                    <li>・到新宿站约50分</li>
                  </ul>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-purple-50 to-white p-4 shadow-sm">
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">教育・文化</h3>
                  <ul className="space-y-1 text-slate-700">
                    <li>・各种学校</li>
                    <li>・公园</li>
                    <li>・图书馆</li>
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
                  站周边的商业设施与周边住宅街的安静平衡的区域。
                  便利店・餐饮店・超市等，租赁入住者需要的设施齐全。
                </p>
              </div>

              <div className="rounded-2xl bg-slate-900 p-5 text-xs text-slate-100">
                <div className="mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-indigo-400" />
                  <h3 className="text-sm font-semibold">目标客户</h3>
                </div>
                <ul className="mt-3 space-y-1">
                  <li>・在相模原・町田区域工作的单身者</li>
                  <li>・重视采光・眺望的长期持有型投资</li>
                  <li>・寻求紧凑单间的初次投资者</li>
                </ul>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 p-5 text-xs text-amber-900">
                <div className="mb-3 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-700" />
                  <h3 className="text-sm font-semibold">注意事项</h3>
                </div>
                <p className="mt-2 leading-relaxed">
                  808号室的专有面积・租金・共益费等条件，请务必根据最新的募集资料・
                  管理公司的信息输入・修正。
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
