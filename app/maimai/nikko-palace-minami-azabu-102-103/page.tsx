import type { Metadata } from 'next'
import NikkoPalaceMinamiAzabuClient from './NikkoPalaceMinamiAzabuClient'

const title = '日興パレス南麻布 102・103号室 | BOURN MARK'
const description = '広尾駅徒歩4分、南麻布五丁目のオーナーチェンジ店舗。専有面積301.50㎡、販売価格13億2,000万円（税込）。'
const image = '/imgs/maimai/nikko-palace-minami-azabu-exterior.jpeg'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: [image],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [image],
  },
}

export default function NikkoPalaceMinamiAzabuPage() {
  return <NikkoPalaceMinamiAzabuClient />
}
