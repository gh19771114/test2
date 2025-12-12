'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Building2, Train, TrendingUp, Shield, Clock, ArrowLeft } from 'lucide-react'

export default function LionsHigashiGinza2FPage() {
  return (
    <PageLayout>
      <main className="min-h-screen bg-slate-50 text-slate-900">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-amber-100 via-slate-50 to-sky-100 pt-28 pb-16">
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
                <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-amber-700">
                  不动产投资用 房源介绍
                </p>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                  ライオンズマンション東銀座 2F（201号室）
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-slate-700">
                  位于东京核心商务与商圈——银座与筑地之间的角地商铺/事务所区画。
                  以晴海通为主要动线，步行即可抵达多条地铁线路，
                  兼具<strong>高可见度</strong>与<strong>便捷通勤性</strong>的投资标的。
                </p>

                <dl className="mt-6 grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
                  <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                    <dt className="text-slate-500">专有面积</dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      约 127.6 m²
                      <span className="block text-[11px] text-slate-500">（约 38.6 坪）</span>
                    </dd>
                  </div>
                  <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                    <dt className="text-slate-500">用途</dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      店铺・事务所
                      <span className="block text-[11px] text-slate-500">开放式楼层</span>
                    </dd>
                  </div>
                  <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                    <dt className="text-slate-500">最近车站</dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      日比谷线「筑地」站 步行3–5分
                      <span className="block text-[11px] text-slate-500">
                        「东银座」「筑地市场」也在步行范围内
                      </span>
                    </dd>
                  </div>
                  <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                    <dt className="text-slate-500">参考租金水平</dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      约118〜130万日元/月
                      <span className="block text-[11px] text-amber-600">
                        ※基于过往募集信息／请确认现况条件
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>

              {/* 右侧图片 */}
              <div className="mt-8 flex-1 justify-center lg:flex">
                <div className="relative h-64 w-full max-w-sm overflow-hidden rounded-3xl bg-slate-900/5 shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt="ライオンズマンション東銀座外观"
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
                    src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="建筑物外观"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-64 overflow-hidden rounded-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="周边环境"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-64 overflow-hidden rounded-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="内装图片"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 物业概要 */}
        <section className="mx-auto mt-6 max-w-6xl px-4 pb-14">
          <div className="grid gap-10 lg:grid-cols-[2fr,1.2fr]">
            {/* 左侧：详情 */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900">房源概要</h2>
              <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm">
                <table className="w-full border-separate border-spacing-0 text-xs">
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <th className="w-32 bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        所在地
                      </th>
                      <td className="px-4 py-3">
                        东京都中央区筑地4丁目12-2
                        <span className="ml-1 text-[11px] text-slate-500">ライオンズマンション東銀座</span>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100 align-top">
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        交通访问
                      </th>
                      <td className="px-4 py-3">
                        <ul className="space-y-1">
                          <li>东京地铁日比谷线「筑地」站 步行约3–5分</li>
                          <li>东京地铁日比谷线・都营浅草线「东银座」站 步行约5–7分</li>
                          <li>都营大江户线「筑地市场」站 步行约5–8分</li>
                          <li>东京地铁有乐町线「新富町」站 步行约11分</li>
                          <li>都营大江户线「胜どき」站 步行约13分</li>
                          <li>东京地铁银座线「银座」站 步行约13分</li>
                        </ul>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        结构・规模
                      </th>
                      <td className="px-4 py-3">
                        钢筋混凝土结构（SRC、部分S） 地上12层・地下1层／1986年竣工
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        对应区划
                      </th>
                      <td className="px-4 py-3">
                        2层 201号室（店铺・事务所区划／开放式楼层）
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        专有面积
                      </th>
                      <td className="px-4 py-3">
                        约 127.6 m²（约 38.6 坪）
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        参考租金
                      </th>
                      <td className="px-4 py-3">
                        根据过往的募集信息，
                        <span className="font-semibold">约118〜130万日元／月（含共益费）</span>
                        左右。
                        <span className="ml-1 text-[11px] text-amber-700">
                          ※请务必确认最新的条件・出售价格。
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        用途设想
                      </th>
                      <td className="px-4 py-3">
                        利用路面可见性和交通便利性的
                        <span className="font-medium">
                          物贩店铺・展示厅・诊所・沙龙・办公室
                        </span>
                        等适合的灵活平面。
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 投资亮点 */}
              <h2 className="mt-10 text-lg font-semibold text-slate-900">投资・运营要点</h2>
              <div className="mt-4 grid gap-4 text-xs md:grid-cols-2">
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-amber-600" />
                    <h3 className="text-sm font-semibold text-slate-900">银座区域附近的稀有角地区划</h3>
                  </div>
                  <p className="mt-2 leading-relaxed text-slate-700">
                    位于晴海通沿线・筑地本愿寺对面的地段，从步道可见性高的位置。
                    在享受银座・东银座区域的集客力的同时，租金水平平衡的房源。
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <Train className="h-4 w-4 text-blue-600" />
                    <h3 className="text-sm font-semibold text-slate-900">可利用6条以上路线的多重访问</h3>
                  </div>
                  <p className="mt-2 leading-relaxed text-slate-700">
                    「筑地」「东银座」「筑地市场」「新富町」「银座」等多个车站都在步行范围内。
                    不仅方便员工通勤，对来店客户来说也是容易理解的位置。
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-green-600" />
                    <h3 className="text-sm font-semibold text-slate-900">单层大空间布局自由</h3>
                  </div>
                  <p className="mt-2 leading-relaxed text-slate-700">
                    约38.6坪接近整形的开放式楼层，展示厅・办公室・学校等
                    多用途的布局提案成为可能。
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    <h3 className="text-sm font-semibold text-slate-900">容易预期稳定租赁需求的区域</h3>
                  </div>
                  <p className="mt-2 leading-relaxed text-slate-700">
                    银座・筑地市场・汐留等周边办公室・商业区域的需求容易预期，
                    作为长期持有型投资用不动产也容易考虑的房源。
                  </p>
                </div>
              </div>

              {/* 周边设施 */}
              <h2 className="mt-10 text-lg font-semibold text-slate-900">周边设施・环境</h2>
              <div className="mt-4 grid gap-4 text-xs md:grid-cols-3">
                <div className="rounded-xl bg-gradient-to-br from-blue-50 to-white p-4 shadow-sm">
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">商业设施</h3>
                  <ul className="space-y-1 text-slate-700">
                    <li>・银座三越・松屋银座</li>
                    <li>・筑地场外市场</li>
                    <li>・各种专门店・餐厅</li>
                  </ul>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-green-50 to-white p-4 shadow-sm">
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">文化・观光</h3>
                  <ul className="space-y-1 text-slate-700">
                    <li>・筑地本愿寺</li>
                    <li>・银座・筑地区域观光景点</li>
                    <li>・各种美术馆・画廊</li>
                  </ul>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-amber-50 to-white p-4 shadow-sm">
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">办公室・商务</h3>
                  <ul className="space-y-1 text-slate-700">
                    <li>・银座・东银座办公室街</li>
                    <li>・汐留・新桥商务区域</li>
                    <li>・大手町・丸之内区域</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 右侧：位置与地图说明 */}
            <aside className="space-y-6">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-amber-600" />
                  <h3 className="text-sm font-semibold text-slate-900">位置</h3>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-700">
                  面向晴海通，对面是筑地本愿寺的区域。
                  平日白天有上班族、购物客、观光客的热闹，
                  夜间变为安静的街景，是有节奏感的位置。
                </p>
                <ul className="mt-3 space-y-1 text-xs text-slate-700">
                  <li>・银座区域… 地铁约4分</li>
                  <li>・大手町区域… 地铁约10分</li>
                  <li>・羽田机场方向… 都营浅草线・京急线访问良好</li>
                </ul>
              </div>

              <div className="rounded-2xl bg-slate-900 p-5 text-xs text-slate-100">
                <div className="mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-amber-400" />
                  <h3 className="text-sm font-semibold">目标客户</h3>
                </div>
                <ul className="mt-3 space-y-1">
                  <li>・想在银座区域设立据点的专业事务所</li>
                  <li>・重视路面性的餐饮・物贩・展示厅等租户</li>
                  <li>・海外投资者对东京中心部收益不动产的取得</li>
                </ul>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 p-5 text-xs text-amber-900">
                <div className="mb-3 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-700" />
                  <h3 className="text-sm font-semibold">注意事项</h3>
                </div>
                <p className="mt-2 leading-relaxed">
                  本页面的租金・条件是基于过往公开信息的参考值。
                  实际的募集条件・买卖价格・各项费用等，请务必确认最新资料和
                  管理公司・中介公司的介绍。
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
