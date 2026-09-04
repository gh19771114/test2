import type { Metadata } from 'next'
import FeePropertyDetail from '@/components/FeePropertyDetail'

const title = 'グレイス四谷 4F | BOURN MARK'
const description = '曙橋駅徒歩1分。専有面積11.43㎡、1R、4階、賃貸中。販売価格1,300万円（税込）、仲介手数料あり。'
const image = '/imgs/maimai/grace-yotsuya-exterior.jpg'

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, images: [image] },
  twitter: { card: 'summary_large_image', title, description, images: [image] },
}

export default function PropertyPage() {
  return <FeePropertyDetail propertyId="grace-yotsuya-4f" imagePrefix="grace-yotsuya" />
}
