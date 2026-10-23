import type { Metadata } from 'next'
import PageLayout from '@/components/PageLayout'
import Image from 'next/image'

const title = 'カスタマーハラスメントに対する基本方針'
const description = '株式会社ボーンマークのカスタマーハラスメントに対する基本方針、対応および電話通話の録音について。'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/customer-harassment' },
  openGraph: {
    title,
    description,
    url: '/customer-harassment',
    locale: 'ja_JP',
  },
}

export default function CustomerHarassmentPage() {
  return (
    <PageLayout>
      <article lang="ja" className="bg-gray-50">
        <section className="relative pt-28 pb-16 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt={title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-navy-900/85 via-navy-800/80 to-indigo-900/75" />
          </div>
          <div className="relative z-10 container-custom text-white">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6">{title}</h1>
          </div>
        </section>
        <section className="section-padding">
          <div className="container-custom max-w-5xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-100 p-10 space-y-8">
            <h2 className="text-2xl font-semibold text-navy-700">カスタマーハラスメントに対する基本方針について</h2>
            <div className="space-y-6">
            <section aria-labelledby="basic-policy">
              <h3 id="basic-policy" className="text-lg font-semibold text-navy-700 mb-3">
                1．基本方針
              </h3>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>当社は、お客様から寄せられるご意見・ご要望に真摯に耳を傾け、誠実かつ適切な対応を通じて、より良いサービスの提供に努めております。</p>
                <p>一方で、暴言、威圧的な言動、過度な要求、長時間にわたる拘束、従業員の人格を否定する言動など、社会通念上相当な範囲を超える行為については、従業員の尊厳と就業環境を守るため、カスタマーハラスメントとして組織的に対応いたします。</p>
                <p>当社は、従業員が安心して働ける環境を確保するとともに、お客様との健全で良好な関係を維持し、公正で質の高いサービスの提供に取り組んでまいります。</p>
              </div>
            </section>

            <section aria-labelledby="response">
              <h3 id="response" className="text-lg font-semibold text-navy-700 mb-3">
                2．カスタマーハラスメントへの対応
              </h3>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>当社は、カスタマーハラスメントに該当する行為が認められた場合、合理的かつ公正な解決に向けて対応するとともに、必要に応じて、対応の中断・お断り、警察や弁護士等の外部専門機関への相談など、適切な措置を講じます。</p>
                <p>なお、正当なご意見やご要望については、これまでどおり真摯に受け止め、誠実な対応に努めてまいります。</p>
              </div>
            </section>

            <section aria-labelledby="call-recording">
              <h3 id="call-recording" className="text-lg font-semibold text-navy-700 mb-3">
                3．電話通話の録音について
              </h3>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>当社では、お問い合わせ内容の正確な把握、対応品質の向上およびカスタマーハラスメントの防止を目的として、電話での通話を録音しております。</p>
                <p>録音データは、利用目的に沿って適切に管理し、個人情報の保護に配慮したうえで取り扱います。</p>
                <p>皆様のご理解とご協力を賜りますよう、お願い申し上げます。</p>
              </div>
            </section>
            </div>

            <p className="text-gray-600 leading-relaxed">今後も、お客様と従業員双方の人権を尊重し、信頼される企業を目指してまいります。</p>

            <div className="text-gray-600 leading-relaxed space-y-2">
              <p>株式会社ボーンマーク</p>
              <p>制定日：<time dateTime="2026-10-23">2026年10月23日</time></p>
            </div>
          </div>
        </section>
      </article>
    </PageLayout>
  )
}
