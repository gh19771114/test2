import type { Metadata } from 'next'
import FeePropertyDetail from '@/components/FeePropertyDetail'

const title = 'ザ・パークハウス西新宿タワー60 52F | BOURN MARK'
const description = '西新宿五丁目駅徒歩8分。89.86㎡の3LDK、現況賃貸中。資料記載の表面利回りは2.6%です。 販売価格24,461万円、仲介手数料あり。'
const image = '/imgs/maimai/parkhouse-nishi-shinjuku-tower60-exterior.jpg'

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, images: [image] },
  twitter: { card: 'summary_large_image', title, description, images: [image] },
}

export default function PropertyPage() {
  return <FeePropertyDetail propertyId="parkhouse-nishi-shinjuku-tower60-52f" imagePrefix="parkhouse-nishi-shinjuku-tower60" />
}
