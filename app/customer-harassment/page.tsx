import type { Metadata } from 'next'
import PageLayout from '@/components/PageLayout'

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
      <article lang="ja" className="bg-white px-4 pb-16 pt-32 sm:px-6 md:pb-24 md:pt-40">
        <div className="mx-auto max-w-4xl">
          <header className="border-b border-gray-200 pb-8 md:pb-10">
            <h1 className="text-2xl font-semibold leading-relaxed text-navy-900 sm:text-3xl md:text-4xl md:leading-relaxed">
              {title}
            </h1>
          </header>

          <div className="space-y-10 pt-10 text-base leading-loose text-gray-700 md:space-y-12">
            <section aria-labelledby="basic-policy">
              <h2 id="basic-policy" className="mb-5 text-xl font-semibold text-navy-800 md:text-2xl">
                1．基本方針
              </h2>
              <div className="space-y-5">
                <p>当社は、お客様から寄せられるご意見・ご要望に真摯に耳を傾け、誠実かつ適切な対応を通じて、より良いサービスの提供に努めております。</p>
                <p>一方で、暴言、威圧的な言動、過度な要求、長時間にわたる拘束、従業員の人格を否定する言動など、社会通念上相当な範囲を超える行為については、従業員の尊厳と就業環境を守るため、カスタマーハラスメントとして組織的に対応いたします。</p>
                <p>当社は、従業員が安心して働ける環境を確保するとともに、お客様との健全で良好な関係を維持し、公正で質の高いサービスの提供に取り組んでまいります。</p>
              </div>
            </section>

            <section aria-labelledby="response">
              <h2 id="response" className="mb-5 text-xl font-semibold text-navy-800 md:text-2xl">
                2．カスタマーハラスメントへの対応
              </h2>
              <div className="space-y-5">
                <p>当社は、カスタマーハラスメントに該当する行為が認められた場合、合理的かつ公正な解決に向けて対応するとともに、必要に応じて、対応の中断・お断り、警察や弁護士等の外部専門機関への相談など、適切な措置を講じます。</p>
                <p>なお、正当なご意見やご要望については、これまでどおり真摯に受け止め、誠実な対応に努めてまいります。</p>
              </div>
            </section>

            <section aria-labelledby="call-recording">
              <h2 id="call-recording" className="mb-5 text-xl font-semibold text-navy-800 md:text-2xl">
                3．電話通話の録音について
              </h2>
              <div className="space-y-5">
                <p>当社では、お問い合わせ内容の正確な把握、対応品質の向上およびカスタマーハラスメントの防止を目的として、電話での通話を録音しております。</p>
                <p>録音データは、利用目的に沿って適切に管理し、個人情報の保護に配慮したうえで取り扱います。</p>
                <p>皆様のご理解とご協力を賜りますよう、お願い申し上げます。</p>
              </div>
            </section>

            <p>今後も、お客様と従業員双方の人権を尊重し、信頼される企業を目指してまいります。</p>

            <div className="space-y-2 border-t border-gray-200 pt-8 text-right">
              <p>株式会社ボーンマーク</p>
              <p>制定日：<time dateTime="2026-10-23">2026年10月23日</time></p>
            </div>
          </div>
        </div>
      </article>
    </PageLayout>
  )
}
