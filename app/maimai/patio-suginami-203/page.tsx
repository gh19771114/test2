'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Building2, Train, Home, Shield, Clock, ArrowLeft } from 'lucide-react'

export default function PatioSuginami203Page() {
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
                  パティオ杉並 203号室
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-slate-700">
                  东京地铁丸之内线「方南町」站步行6分的紧凑单间。
                  位于居住需求稳定的杉并区堀之内区域，
                  适合初次区分投资的<strong>紧凑投资用公寓</strong>。
                </p>

                <dl className="mt-6 grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
                  <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                    <dt className="text-slate-500">专有面积</dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      约19.2 m²
                      <span className="block text-[11px] text-slate-500">单间（洋室6帖）</span>
                    </dd>
                  </div>
                  <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                    <dt className="text-slate-500">户型</dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      1R
                      <span className="block text-[11px] text-slate-500">
                        单身者向紧凑型
                      </span>
                    </dd>
                  </div>
                  <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                    <dt className="text-slate-500">最近车站</dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      方南町站 步行6分
                      <span className="block text-[11px] text-slate-500">
                        丸之内线支线到新宿・东京方向
                      </span>
                    </dd>
                  </div>
                  <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                    <dt className="text-slate-500">参考租金水平</dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      约5.5万日元／月
                      <span className="block text-[11px] text-amber-600">
                        ※基于过往募集例／现况条件需确认
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>

              {/* 右侧外观图 */}
              <div className="mt-8 flex-1 justify-center lg:flex">
                <div className="relative h-64 w-full max-w-sm overflow-hidden rounded-3xl bg-slate-900/5 shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt="パティオ杉並外观"
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

        {/* 概要 */}
        <section className="mx-auto mt-6 max-w-6xl px-4 pb-14">
          <div className="grid gap-10 lg:grid-cols-[2fr,1.2fr]">
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
                        东京都杉并区堀之内2丁目11-4 パティオ杉並
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100 align-top">
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        交通
                      </th>
                      <td className="px-4 py-3">
                        <ul className="space-y-1">
                          <li>东京地铁丸之内线「方南町」站 步行6分</li>
                          <li>东京地铁丸之内线「中野富士见町」站 步行17分</li>
                        </ul>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        结构・规模
                      </th>
                      <td className="px-4 py-3">
                        钢筋混凝土结构 地上5层建／1992年1月竣工・总户数31户
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        对应住戸
                      </th>
                      <td className="px-4 py-3">
                        2层 203号室／1R（洋室约6帖）／专有面积 约19.2m²
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-500">
                        设备・特征
                      </th>
                      <td className="px-4 py-3">
                        地板／衣柜／室内洗衣机放置场／空调／
                        阳台／自动锁／电梯／互联网对应 等
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 投资亮点 */}
              <h2 className="mt-8 text-lg font-semibold text-slate-900">投资・运营要点</h2>
              <div className="mt-4 grid gap-4 text-xs md:grid-cols-2">
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <Home className="h-4 w-4 text-sky-600" />
                    <h3 className="text-sm font-semibold text-slate-900">适合初次区分投资的价格带</h3>
                  </div>
                  <p className="mt-2 leading-relaxed text-slate-700">
                    约20m²前后的单间，取得价格・租金水平都容易触及，
                    是区分公寓投资的「第1件」容易选择的尺寸感。
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <Train className="h-4 w-4 text-emerald-600" />
                    <h3 className="text-sm font-semibold text-slate-900">丸之内线沿线的稳定租赁需求</h3>
                  </div>
                  <p className="mt-2 leading-relaxed text-slate-700">
                    到新宿・东京方向的通勤需求高的丸之内线沿线。
                    方南町区域作为住宅街有安静的氛围，同时都心访问的便利性使单身者需求稳定的区域。
                  </p>
                </div>
              </div>

              {/* 周边设施 */}
              <h2 className="mt-10 text-lg font-semibold text-slate-900">周边设施・环境</h2>
              <div className="mt-4 grid gap-4 text-xs md:grid-cols-3">
                <div className="rounded-xl bg-gradient-to-br from-sky-50 to-white p-4 shadow-sm">
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">生活设施</h3>
                  <ul className="space-y-1 text-slate-700">
                    <li>・便利店</li>
                    <li>・超市</li>
                    <li>・各种餐饮店</li>
                  </ul>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm">
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">教育・文化</h3>
                  <ul className="space-y-1 text-slate-700">
                    <li>・各种学校</li>
                    <li>・公园</li>
                    <li>・图书馆</li>
                  </ul>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-purple-50 to-white p-4 shadow-sm">
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">交通・访问</h3>
                  <ul className="space-y-1 text-slate-700">
                    <li>・新宿站约15分</li>
                    <li>・东京站约25分</li>
                    <li>・丸之内线沿线各站</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 右侧：位置与注意事项 */}
            <aside className="space-y-6">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-sky-600" />
                  <h3 className="text-sm font-semibold text-slate-900">位置</h3>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-700">
                  位于环七通稍微进入的住宅街，周边有便利店和超市、
                  餐饮店等日常便利设施齐全。是安静住环境与生活便利性并立的位置。
                </p>
              </div>

              <div className="rounded-2xl bg-slate-900 p-5 text-xs text-slate-100">
                <div className="mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-sky-400" />
                  <h3 className="text-sm font-semibold">目标客户</h3>
                </div>
                <ul className="mt-3 space-y-1">
                  <li>・寻求初次区分投资的个人投资者</li>
                  <li>・重视稳定租赁收益的长期持有型投资</li>
                  <li>・丸之内线沿线通勤的单身者</li>
                </ul>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 p-5 text-xs text-amber-900">
                <div className="mb-3 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-700" />
                  <h3 className="text-sm font-semibold">注意事项</h3>
                </div>
                <p className="mt-2 leading-relaxed">
                  本页面的租金・条件是基于过往募集事例的参考信息。
                  实际的销售价格・预期租金・管理费等，请根据最新的租金表・重要事项说明书确认。
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
