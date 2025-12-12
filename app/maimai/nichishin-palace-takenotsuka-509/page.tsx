'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Building2, Train, Home, Shield, Clock, ArrowLeft } from 'lucide-react'

export default function NisshinPalaceTakenotsuka509Page() {
  return (
    <PageLayout>
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-100 via-slate-50 to-sky-100 pt-28 pb-16">
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
                <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-emerald-700">
                  不动产投资用 房源介绍
                </p>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                  日神パレス竹ノ塚 509号室（最上阶）
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-slate-700">
                  东武伊势崎线「竹ノ塚」站从步行6分前后，位于安静住宅街的单身者向公寓。
                  509号室作为最上阶住戸，采光和隐私性优秀的一室。
                </p>

                <dl className="mt-6 grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
                  <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                    <dt className="text-slate-500">专有面积</dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      ○○ m²
                      <span className="block text-[11px] text-amber-600">
                        ※请确认登记簿・图纸后输入
                      </span>
                    </dd>
                  </div>
                  <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                    <dt className="text-slate-500">户型</dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      1R / 1K 预期
                      <span className="block text-[11px] text-slate-500">
                        ※请输入实际户型
                      </span>
                    </dd>
                  </div>
                  <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                    <dt className="text-slate-500">最近车站</dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      竹ノ塚站 步行5〜7分
                      <span className="block text-[11px] text-slate-500">
                        天空树线的准急停车站
                      </span>
                    </dd>
                  </div>
                  <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                    <dt className="text-slate-500">预期租金</dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      ○○万日元／月
                      <span className="block text-[11px] text-amber-600">
                        ※基于邻近成交事例设定
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-8 flex-1 justify-center lg:flex">
                <div className="relative h-64 w-full max-w-sm overflow-hidden rounded-3xl bg-slate-900/5 shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt="日神パレス竹ノ塚外观"
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
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
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
                        东京都足立区伊兴4丁目 日神パレス竹ノ塚
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100 align-top">
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        交通
                      </th>
                      <td className="px-4 py-3">
                        <ul className="space-y-1">
                          <li>东武伊势崎线「竹ノ塚」站 步行5〜7分</li>
                          <li>日暮里舍人线「舍人公园」站 步行21分</li>
                          <li>同线「谷在家」站 步行27分</li>
                        </ul>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        结构・规模
                      </th>
                      <td className="px-4 py-3">
                        钢筋混凝土结构 地上5层建／总户数49户／1987年12月竣工
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        设备・特征
                      </th>
                      <td className="px-4 py-3">
                        宅配箱／自行车停车场／阳台／室内洗衣机放置场／空调／外壁瓷砖贴面 等
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="mt-8 text-lg font-semibold text-slate-900">投资・运营要点</h2>
              <div className="mt-4 grid gap-4 text-xs md:grid-cols-2">
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <Train className="h-4 w-4 text-emerald-600" />
                    <h3 className="text-sm font-semibold text-slate-900">天空树线沿线的单身需求</h3>
                  </div>
                  <p className="mt-2 leading-relaxed text-slate-700">
                    到北千住・浅草方向的访问良好，都心勤务的单身者需求可以预期的区域。
                    作为单间投资平衡的位置。
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <Home className="h-4 w-4 text-sky-600" />
                    <h3 className="text-sm font-semibold text-slate-900">宅配箱完备容易入住附着的设备</h3>
                  </div>
                  <p className="mt-2 leading-relaxed text-slate-700">
                    单身者需求高的宅配箱和互联网对应等，
                    租赁募集时容易宣传的设备齐全。
                  </p>
                </div>
              </div>

              {/* 周边设施 */}
              <h2 className="mt-10 text-lg font-semibold text-slate-900">周边设施・环境</h2>
              <div className="mt-4 grid gap-4 text-xs md:grid-cols-3">
                <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm">
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">生活设施</h3>
                  <ul className="space-y-1 text-slate-700">
                    <li>・超市</li>
                    <li>・便利店</li>
                    <li>・药妆店</li>
                    <li>・各种餐饮店</li>
                  </ul>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-sky-50 to-white p-4 shadow-sm">
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">交通・访问</h3>
                  <ul className="space-y-1 text-slate-700">
                    <li>・到北千住站约15分</li>
                    <li>・到浅草站约25分</li>
                    <li>・到上野站约30分</li>
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
                  <MapPin className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-sm font-semibold text-slate-900">位置</h3>
                </div>
                <p className="mt-2 leading-relaxed text-slate-700">
                  下町氛围残留的住宅街，同时站前有商业设施也齐全生活便利性高的区域。
                  学生・社会人都可以期待租赁需求。
                </p>
              </div>

              <div className="rounded-2xl bg-slate-900 p-5 text-xs text-slate-100">
                <div className="mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-emerald-400" />
                  <h3 className="text-sm font-semibold">目标客户</h3>
                </div>
                <ul className="mt-3 space-y-1">
                  <li>・在都心工作的单身者</li>
                  <li>・学生・社会人</li>
                  <li>・重视最上阶采光的投资者</li>
                </ul>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 p-5 text-xs text-amber-900">
                <div className="mb-3 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-700" />
                  <h3 className="text-sm font-semibold">注意事项</h3>
                </div>
                <p className="mt-2 leading-relaxed">
                  509号室的户型・面积・价格・租金等在互联网上无法确认，
                  请务必根据最新资料输入・修正。
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
