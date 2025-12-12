'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Building2, Train, Home, Shield, Clock, Users, TrendingUp, ArrowLeft } from 'lucide-react'

export default function LMNishiHachioji3_707Page() {
  return (
    <PageLayout>
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-100 via-slate-50 to-amber-100 pt-28 pb-16">
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
                <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-indigo-700">
                  不动产投资用 房源介绍
                </p>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                  ライオンズマンション西八王子第3 707号室
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-slate-700">
                  JR中央线「西八王子」站步行范围内的ライオンズ品牌区分公寓。
                  707号室是南向・约18.2m²的1K住戸，学生・单身社会人向的稳定租赁需求可以预期的一室。
                </p>

                <dl className="mt-6 grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
                  <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                    <dt className="text-slate-500">专有面积</dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      18.2 m²
                      <span className="block text-[11px] text-slate-500">1K・南向</span>
                    </dd>
                  </div>
                  <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                    <dt className="text-slate-500">AI预测租金</dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      约3.6〜4.2万日元／月
                      <span className="block text-[11px] text-amber-600">
                        ※在线预测值／实际租金需确认
                      </span>
                    </dd>
                  </div>
                  <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                    <dt className="text-slate-500">AI预测价格</dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      约429〜560万日元
                      <span className="block text-[11px] text-amber-600">
                        ※作为参考记载
                      </span>
                    </dd>
                  </div>
                  <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                    <dt className="text-slate-500">最近车站</dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      西八王子站 步行11〜13分
                      <span className="block text-[11px] text-slate-500">
                        八王子・京王八王子也可利用
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-8 flex-1 justify-center lg:flex">
                <div className="relative h-64 w-full max-w-sm overflow-hidden rounded-3xl bg-slate-900/5 shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt="ライオンズマンション西八王子第3外观"
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

        <section className="mx-auto mt-6 max-w-6xl px-4 pb-14 text-xs">
          <div className="grid gap-10 lg:grid-cols-[2fr,1.2fr]">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">房源概要</h2>
              <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm">
                <table className="w-full border-separate border-spacing-0">
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <th className="w-32 bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        所在地
                      </th>
                      <td className="px-4 py-3">
                        东京都八王子市八木町3-15 ライオンズマンション西八王子第3
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100 align-top">
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        交通
                      </th>
                      <td className="px-4 py-3">
                        <ul className="space-y-1">
                          <li>JR中央线「西八王子」站 步行11〜13分</li>
                          <li>JR中央线「八王子」站 步行24分</li>
                          <li>京王线「京王八王子」站 步行27分</li>
                        </ul>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        结构・规模
                      </th>
                      <td className="px-4 py-3">
                        钢筋混凝土结构 地上10层建／总户数81户／1990年竣工
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        设备・特征
                      </th>
                      <td className="px-4 py-3">
                        自动锁／宅配箱／24小时垃圾出可／防盗摄像头／
                        2沿线利用可 等
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="mt-8 text-lg font-semibold text-slate-900">投资・运营要点</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-indigo-600" />
                    <h3 className="text-sm font-semibold text-slate-900">容易触及的价格带的ライオンズ品牌</h3>
                  </div>
                  <p className="mt-2 leading-relaxed text-slate-700">
                    约500万日元前后的取得价格预期的紧凑区分。
                    品牌力高的「ライオンズ」系列，作为长期保有投资的入口也容易考虑的房源。
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4 text-amber-600" />
                    <h3 className="text-sm font-semibold text-slate-900">学生・单身社会人向的稳定需求</h3>
                  </div>
                  <p className="mt-2 leading-relaxed text-slate-700">
                    八王子区域大学・专门学校多，单身者向1K的租赁需求稳定的点也有魅力。
                  </p>
                </div>
              </div>

              {/* 周边设施 */}
              <h2 className="mt-10 text-lg font-semibold text-slate-900">周边设施・环境</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-white p-4 shadow-sm">
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">生活设施</h3>
                  <ul className="space-y-1 text-slate-700">
                    <li>・便利店</li>
                    <li>・超市</li>
                    <li>・药妆店</li>
                    <li>・各种餐饮店</li>
                  </ul>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-amber-50 to-white p-4 shadow-sm">
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">教育・文化</h3>
                  <ul className="space-y-1 text-slate-700">
                    <li>・各种大学・专门学校</li>
                    <li>・图书馆</li>
                    <li>・公园</li>
                  </ul>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-purple-50 to-white p-4 shadow-sm">
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">交通・访问</h3>
                  <ul className="space-y-1 text-slate-700">
                    <li>・到新宿站约45分</li>
                    <li>・到东京站约55分</li>
                    <li>・中央线沿线各站</li>
                  </ul>
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-2xl bg-white p-5 text-xs shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-indigo-600" />
                  <h3 className="text-sm font-semibold text-slate-900">位置</h3>
                </div>
                <p className="mt-2 leading-relaxed text-slate-700">
                  甲州街道稍微进入的住宅街位置，便利店和餐饮店也在步行范围内。
                  都心访问与本地生活环境的双方都可以享受的位置。
                </p>
              </div>

              <div className="rounded-2xl bg-slate-900 p-5 text-xs text-slate-100">
                <div className="mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-indigo-400" />
                  <h3 className="text-sm font-semibold">目标客户</h3>
                </div>
                <ul className="mt-3 space-y-1">
                  <li>・寻求初次区分投资的个人投资者</li>
                  <li>・学生・单身社会人向的租赁需求</li>
                  <li>・重视品牌力的长期持有型投资</li>
                </ul>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 p-5 text-xs text-amber-900">
                <div className="mb-3 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-700" />
                  <h3 className="text-sm font-semibold">注意事项</h3>
                </div>
                <p className="mt-2 leading-relaxed">
                  本页面记载的AI预测价格・租金是参考信息。
                  实际买卖价格・租金条件，请务必确认估价书・租金表等最新资料。
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
