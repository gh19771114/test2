import type { Metadata } from 'next'
import FeePropertyDetail from '@/components/FeePropertyDetail'

const title = 'コマツエイト曲本 2F | BOURN MARK'
const description = '西浦和駅徒歩13分。85.68㎡の3LDK、現況賃貸中。資料記載の表面利回りは6.41%です。 販売価格2,300万円、仲介手数料あり。'
const image = '/imgs/maimai/komatsu-eight-magumoto-exterior.jpg'

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, images: [image] },
  twitter: { card: 'summary_large_image', title, description, images: [image] },
}

export default function PropertyPage() {
  return <FeePropertyDetail propertyId="komatsu-eight-magumoto-2f" imagePrefix="komatsu-eight-magumoto" />
}
