'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Building2, Train, Home, Shield, Clock, Users, ArrowLeft } from 'lucide-react'

export default function ShinNakanoPlaza304Page() {
  return (
    <PageLayout>
      <main className="min-h-screen bg-slate-50 text-slate-900">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-sky-100 via-slate-50 to-emerald-100 pt-28 pb-16">
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
                  新中野駅上プラザ 304号室
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-slate-700">
                  位于东京地铁丸之内线「新中野」站正上方的站直结型公寓。
                  面向青梅街道的可见性高的建筑物，连接都心与中野区域的
                  <strong>紧凑投资用房源</strong>，是魅力的一室。
                </p>

                <dl className="mt-6 grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
                  <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                    <dt className="text-slate-500">专有面积</dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      约 52 m²
                      <span className="block text-[11px] text-slate-500">（约 15.7 坪）</span>
                    </dd>
                  </div>
                  <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                    <dt className="text-slate-500">户型</dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      1LDK
                      <span className="block text-[11px] text-slate-500">
                        居住兼事务所利用也可考虑（需确认）
                      </span>
                    </dd>
                  </div>
                  <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                    <dt className="text-slate-500">最近车站</dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      丸之内线「新中野」站 步行1分
                      <span className="block text-[11px] text-slate-500">
                        站2号出口直上・青梅街道沿线
                      </span>
                    </dd>
                  </div>
                  <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                    <dt className="text-slate-500">价格 / 预期租金</dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      5,200万日元
                      <span className="block text-[11px] text-sky-600">
                        预期租金：约8-10万日元/月
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>

              {/* 右侧图片 */}
              <div className="mt-8 flex-1 justify-center lg:flex">
                <div className="relative h-64 w-full max-w-sm overflow-hidden rounded-3xl bg-slate-900/5 shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt="新中野駅上プラザ外观"
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
                    src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
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
                        东京都中野区本町4丁目48-17
                        <span className="ml-1 text-[11px] text-slate-500">新中野駅上プラザ</span>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100 align-top">
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        交通访问
                      </th>
                      <td className="px-4 py-3">
                        <ul className="space-y-1">
                          <li>东京地铁丸之内线「新中野」站 步行1分（站2号出口直上）</li>
                          <li>JR中央线「中野」站 步行约12分</li>
                          <li>也可利用巴士（青梅街道沿线）</li>
                        </ul>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        结构・规模
                      </th>
                      <td className="px-4 py-3">
                        钢筋混凝土结构（SRC） 地上12层建／1974年6月竣工
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        对应区划
                      </th>
                      <td className="px-4 py-3">
                        3层 304号室（居住・事务所利用设想）
                        <span className="ml-1 text-[11px] text-slate-500">
                          ※请确认实际的用途区分・募集条件
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        专有面积
                      </th>
                      <td className="px-4 py-3">
                        约 52 m²（约 15.7 坪）
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        户型
                      </th>
                      <td className="px-4 py-3">
                        1LDK（客厅・餐厅・厨房・卧室）
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        设备・特征
                      </th>
                      <td className="px-4 py-3">
                        站直结／青梅街道沿线／电梯2部／个别空调／24小时使用可能／男女别厕所（共用部） 等
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
                    <Train className="h-4 w-4 text-sky-600" />
                    <h3 className="text-sm font-semibold text-slate-900">「站上」独有的压倒性便利性</h3>
                  </div>
                  <p className="mt-2 leading-relaxed text-slate-700">
                    位于新中野站2号出口的正上方，雨天也不易淋湿的动线。
                    可应对通勤・通学需求、远程办公据点、卫星办公室等广泛需求。
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    <h3 className="text-sm font-semibold text-slate-900">中野・新宿区域的访问良好</h3>
                  </div>
                  <p className="mt-2 leading-relaxed text-slate-700">
                    丸之内线可直达新宿・大手町方向。
                    中央线「中野」站也在步行范围内，覆盖都心部与住宅区域的位置。
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <Home className="h-4 w-4 text-purple-600" />
                    <h3 className="text-sm font-semibold text-slate-900">也适合居住兼事务所的灵活性</h3>
                  </div>
                  <p className="mt-2 leading-relaxed text-slate-700">
                    建筑物内其他号室也有居住・事务所利用的实例，
                    作为SOHO或小规模办公室的运营也容易考虑的房源。
                    （※请确认实际利用可否・管理规约・募集条件）
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4 text-amber-600" />
                    <h3 className="text-sm font-semibold text-slate-900">租赁需求稳定的生活便利区域</h3>
                  </div>
                  <p className="mt-2 leading-relaxed text-slate-700">
                    周边有餐饮店・超市・药妆店等日常生活便利的店铺聚集。
                    单身者・DINKS层・小规模事业者等可期待稳定的租赁需求。
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
                <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm">
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">教育・文化</h3>
                  <ul className="space-y-1 text-slate-700">
                    <li>・中野区立图书馆</li>
                    <li>・各种学校・学习塾</li>
                    <li>・体育设施</li>
                  </ul>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-purple-50 to-white p-4 shadow-sm">
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">交通・访问</h3>
                  <ul className="space-y-1 text-slate-700">
                    <li>・到新宿站约8分</li>
                    <li>・到大手町・东京站约15分</li>
                    <li>・中野站周边商业设施</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 右侧：位置与投资信息 */}
            <aside className="space-y-6">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-sky-600" />
                  <h3 className="text-sm font-semibold text-slate-900">位置</h3>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-700">
                  建在青梅街道沿线的站直结公寓。
                  到中野通或中野坂上方向也容易访问，
                  是生活便利性与商务便利性并立的位置。
                </p>
                <ul className="mt-3 space-y-1 text-xs text-slate-700">
                  <li>・到新宿站… 约8分（丸之内线利用）</li>
                  <li>・大手町・东京站方向… 丸之内线直达访问</li>
                  <li>・中野站周边… 步行＋中央线利用到都心各处</li>
                </ul>
                <p className="mt-3 text-[11px] text-slate-500">
                  ※所需时间是日中午常时的参考。不含换乘・等待时间。
                </p>
              </div>

              <div className="rounded-2xl bg-slate-900 p-5 text-xs text-slate-100">
                <div className="mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-sky-400" />
                  <h3 className="text-sm font-semibold">目标客户</h3>
                </div>
                <ul className="mt-3 space-y-1">
                  <li>・寻求都心近接区域自宅兼事务所的个人事业主</li>
                  <li>・初创企业或自由职业者的小规模办公室</li>
                  <li>・重视中长期租赁收益的个人投资者</li>
                </ul>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 p-5 text-xs text-amber-900">
                <div className="mb-3 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-700" />
                  <h3 className="text-sm font-semibold">注意事项</h3>
                </div>
                <p className="mt-2 leading-relaxed">
                  本页面是基于从公开信息可确认的建筑物概要制作的。
                  304号室的专有面积・户型・价格・管理费等条件在互联网上无法确认，
                  请根据现在的募集资料・重要事项说明书等，务必输入・修正数值。
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
