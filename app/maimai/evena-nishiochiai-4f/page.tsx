import type { Metadata } from 'next'
import FeePropertyDetail from '@/components/FeePropertyDetail'

const title = 'エヴェナール西落合 4F | BOURN MARK'
const description = '落合南長崎駅徒歩9分。16.52㎡の1R、現況賃貸中。資料記載の表面利回りは7.08%です。 販売価格1,000万円、仲介手数料あり。'
const image = '/imgs/maimai/evena-nishiochiai-exterior.jpg'

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, images: [image] },
  twitter: { card: 'summary_large_image', title, description, images: [image] },
}

export default function PropertyPage() {
  return <FeePropertyDetail propertyId="evena-nishiochiai-4f" imagePrefix="evena-nishiochiai" />
}
