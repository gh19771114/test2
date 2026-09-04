import type { Metadata } from 'next'
import FeePropertyDetail from '@/components/FeePropertyDetail'

const title = 'スカイコート向ヶ丘遊園 4F | BOURN MARK'
const description = '向ヶ丘遊園駅徒歩9分。16.24㎡の1K、現況賃貸中。資料記載の表面利回りは8%です。 販売価格750万円、仲介手数料あり。'
const image = '/imgs/maimai/sky-court-mukogaoka-yuen-exterior.jpg'

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, images: [image] },
  twitter: { card: 'summary_large_image', title, description, images: [image] },
}

export default function PropertyPage() {
  return <FeePropertyDetail propertyId="sky-court-mukogaoka-yuen-4f" imagePrefix="sky-court-mukogaoka-yuen" />
}
