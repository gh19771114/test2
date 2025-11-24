"use client";

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'

export default function PrivacyPage() {
  return (
    <PageLayout>
      <div className="bg-gray-50">
        <section className="relative pt-28 pb-16 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="隐私政策"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-navy-900/85 via-navy-800/80 to-indigo-900/75" />
          </div>
          <div className="relative z-10 container-custom text-white">
            <p className="text-sm uppercase tracking-[0.3em] text-white/70 mb-3">PRIVACY POLICY</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6">隐私权保护方针</h1>
            <p className="max-w-3xl text-white/80 text-lg leading-relaxed">
              我们遵循日本《个人信息保护法》与相关行业指引，通过严格的管理体系妥善保护客户与合作伙伴的所有信息。本政策说明我们如何收集、使用与管理个人信息，以及客户可享有的权利。
            </p>
          </div>
        </section>
        <section className="section-padding">
          <div className="container-custom max-w-5xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-100 p-10 space-y-8">
            <h2 className="text-2xl font-semibold text-navy-700">关于本公司的个人信息保护方针</h2>
            <p className="text-gray-600 leading-relaxed">
              除去本公司另外规定的，关于业务上获取的客户、交易方等可识别确定个人的信息（以下称作「个人信息」）的获取，按下述规定的「个人信息保护方针」进行保护。
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-navy-700 mb-3">【关于个人信息的获取】</h3>
                <p className="text-gray-600 leading-relaxed">
                  将通过合法和公正的手段获取个人信息。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-navy-700 mb-3">【关于个人信息的使用】</h3>
                <p className="text-gray-600 leading-relaxed mb-3">
                  尽量确定并明示获取的个人信息的使用目的。将在使用目的的范围内使用个人信息，由根据具体业务而拥有权限的人在业务所需范围内进行。本公司使用个人信息的场合，将尽量确定并明示使用目的等必要事项。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-navy-700 mb-3">【关于向第三方开示、提供个人信息】</h3>
                <p className="text-gray-600 leading-relaxed mb-3">
                  除去以下的场合，不会在没有得到您本人同意的情况下，向第三方开示、提供个人信息。
                </p>
                <ul className="space-y-2 text-gray-600 pl-5">
                  <li>(1) 不能识别个人状态（统计资料等）而开示、提供的场合</li>
                  <li>(2) 业务所需范围内，开示、提供给业务委托方的场合</li>
                  <li>(3) 因公司合并、分割、营业转让或其他事由，公司业务被继承的场合</li>
                  <li>(4) 法令等要求开示、提供的场合</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-navy-700 mb-3">【关于个人信息的管理】</h3>
                <p className="text-gray-600 leading-relaxed">
                  为了防止个人信息的非法访问、遗失、篡改、泄漏等，将采取适当的安全对策。委托处理个人信息的场合，将采取所需措施，和委托方缔结适当的，包括安全管理措施内容的合同等。规定个人信息获取相关规定，踏实实行的同时，进行持续改善。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-navy-700 mb-3">【关于个人信息的开示、订正、停用等】</h3>
                <p className="text-gray-600 leading-relaxed">
                  若有关于自己个人信息的开示、订正、停用等要求，会在确认是您本人的基础上进行应对。另外，通过「咨询表」接受个人信息相关咨询。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-navy-700 mb-3">【法令等的遵守】</h3>
                <p className="text-gray-600 leading-relaxed">
                  遵守个人信息获取相关法令及其他规范的同时，致力于持续重新评估和改善本个人信息保护方针的内容。
                </p>
              </div>
            </div>

            <div className="text-gray-600 leading-relaxed space-y-2">
              <p>2021年6月1日</p>
              <p>川雨流痕股份有限公司</p>
              <p>董事长　桂 小川</p>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
