import type { Metadata } from 'next'
import FeePropertyDetail from '@/components/FeePropertyDetail'

const title = 'クラールハイト三宿Ⅱ | BOURN MARK'
const description = '三軒茶屋駅徒歩9分。552.88㎡の一棟店舗・事務所、現況賃貸中。資料記載の表面利回りは3.8%です。 販売価格10億600万円、仲介手数料あり。'
const image = '/imgs/maimai/klarheit-mishuku-ii-exterior.jpg'

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, images: [image] },
  twitter: { card: 'summary_large_image', title, description, images: [image] },
}

export default function PropertyPage() {
  return <FeePropertyDetail propertyId="klarheit-mishuku-ii" imagePrefix="klarheit-mishuku-ii" />
}
