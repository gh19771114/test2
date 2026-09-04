import type { Metadata } from 'next'
import FeePropertyDetail from '@/components/FeePropertyDetail'

const title = 'エクセリア世田谷上町 6F | BOURN MARK'
const description = '上町駅徒歩2分。専有面積18.56㎡、1K、6階、空室。販売価格1,540万円（税込）、仲介手数料あり。'
const image = '/imgs/maimai/exceria-setagaya-kamimachi-exterior.jpg'

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, images: [image] },
  twitter: { card: 'summary_large_image', title, description, images: [image] },
}

export default function PropertyPage() {
  return <FeePropertyDetail propertyId="exceria-setagaya-kamimachi-6f" imagePrefix="exceria-setagaya-kamimachi" mapImage="/imgs/maimai/exceria-setagaya-kamimachi-map-marked.jpg" />
}
