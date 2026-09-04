import type { Metadata } from 'next'
import FeePropertyDetail from '@/components/FeePropertyDetail'

const title = 'グローリア初穂大塚 2F | BOURN MARK'
const description = '大塚駅徒歩10分。16.22㎡の1R、現況賃貸中。資料記載の表面利回りは6.46%です。 販売価格1,150万円、仲介手数料あり。'
const image = '/imgs/maimai/gloria-hatsuho-otsuka-exterior.jpg'

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, images: [image] },
  twitter: { card: 'summary_large_image', title, description, images: [image] },
}

export default function PropertyPage() {
  return <FeePropertyDetail propertyId="gloria-hatsuho-otsuka-2f" imagePrefix="gloria-hatsuho-otsuka" />
}
