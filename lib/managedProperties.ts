import type { Language } from '@/contexts/LanguageContext'

export type ManagedPropertyCard = {
  id: string
  image: string // public path
  jpTitle: string
  enTitle: string
}

export const managedPropertyCards: ManagedPropertyCard[] = [
  { id: 'mp-01', image: '/imgs/managed-properties/mp-01.jpeg', jpTitle: 'AERBIN AKASAKAビル', enTitle: 'AERBIN AKASAKA Building' },
  { id: 'mp-02', image: '/imgs/managed-properties/mp-02.jpeg', jpTitle: 'ITK鍋横ビル', enTitle: 'ITK Nabeyoko Building' },
  { id: 'mp-03', image: '/imgs/managed-properties/mp-03.jpeg', jpTitle: 'THE ROPPONGI TOKYO CLUB RESIDENCE', enTitle: 'THE ROPPONGI TOKYO CLUB RESIDENCE' },
  { id: 'mp-04', image: '/imgs/managed-properties/mp-04.jpeg', jpTitle: 'TheLOG日本橋', enTitle: 'The LOG Nihonbashi' },
  { id: 'mp-05', image: '/imgs/managed-properties/mp-05.jpg', jpTitle: 'TheLOG日本橋1', enTitle: 'The LOG Nihonbashi 1' },
  { id: 'mp-06', image: '/imgs/managed-properties/mp-06.jpeg', jpTitle: 'YHSビル', enTitle: 'YHS Building' },
  { id: 'mp-07', image: '/imgs/managed-properties/mp-07.jpeg', jpTitle: 'アムロゼッタ駒込', enTitle: 'Amrozetta Komagome' },
  { id: 'mp-08', image: '/imgs/managed-properties/mp-08.jpeg', jpTitle: 'オープンレジデンシア麻布六本木', enTitle: 'Open Residencia Azabu Roppongi' },
  { id: 'mp-09', image: '/imgs/managed-properties/mp-09.jpeg', jpTitle: 'ザ・パークハウス西新宿タワー60', enTitle: 'The Parkhouse Nishi-Shinjuku Tower 60' },
  { id: 'mp-10', image: '/imgs/managed-properties/mp-10.jpeg', jpTitle: 'パークコート神宮北参道ザタワー', enTitle: 'Park Court Jingu-Kita Sando The Tower' },
  { id: 'mp-11', image: '/imgs/managed-properties/mp-11.jpeg', jpTitle: 'パークコート赤坂ザタワー', enTitle: 'Park Court Akasaka The Tower' },
  { id: 'mp-12', image: '/imgs/managed-properties/mp-12.jpeg', jpTitle: 'パークコート千代田四番町', enTitle: 'Park Court Chiyoda Yonbancho' },
  { id: 'mp-13', image: '/imgs/managed-properties/mp-13.jpeg', jpTitle: 'プロス森下', enTitle: 'Pros Morishita' },
  { id: 'mp-14', image: '/imgs/managed-properties/mp-14.jpeg', jpTitle: 'ホリーズ日本橋', enTitle: 'Hollies Nihonbashi' },
  { id: 'mp-15', image: '/imgs/managed-properties/mp-15.jpeg', jpTitle: 'メゾン赤坂', enTitle: 'Maison Akasaka' },
  { id: 'mp-16', image: '/imgs/managed-properties/mp-16.webp', jpTitle: 'メゾン赤坂5', enTitle: 'Maison Akasaka 5' },
  { id: 'mp-17', image: '/imgs/managed-properties/mp-17.jpeg', jpTitle: 'メゾン赤坂6', enTitle: 'Maison Akasaka 6' },
  { id: 'mp-18', image: '/imgs/managed-properties/mp-18.jpeg', jpTitle: '勝どきザ・タワー', enTitle: 'Kachidoki The Tower' },
  { id: 'mp-19', image: '/imgs/managed-properties/mp-19.jpeg', jpTitle: '勝どきビュータワー', enTitle: 'Kachidoki View Tower' },
  { id: 'mp-20', image: '/imgs/managed-properties/mp-20.jpeg', jpTitle: '新橋ウエストビル', enTitle: 'Shinbashi West Building' },
]

// 从“管理房产”列表中排除的卡片（按需求）
export const excludedManagedPropertyIds = new Set<ManagedPropertyCard['id']>([
  'mp-05', // TheLOG日本橋1
  'mp-16', // メゾン赤坂5
  'mp-17', // メゾン赤坂6
])

export const activeManagedPropertyCards: ManagedPropertyCard[] = managedPropertyCards.filter(
  (c) => !excludedManagedPropertyIds.has(c.id)
)

export function getManagedPropertyTitle(card: ManagedPropertyCard, language: Language): string {
  return language === 'en' ? card.enTitle : card.jpTitle
}

// 首页“成功案例”里替换“管理委托”用的 3 张卡片（可按需求随时调整）
export const featuredManagedPropertyCards: ManagedPropertyCard[] = [
  managedPropertyCards[2],  // mp-03
  managedPropertyCards[8],  // mp-09
  managedPropertyCards[17], // mp-18
]

