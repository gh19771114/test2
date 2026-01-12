export type InvestmentProperty = {
  title: string
  location: string
  image: string | null
}

export const investmentProperties: InvestmentProperty[] = [
  {
    title: '本社ビル',
    location: '中央区日本橋',
    image: '/imgs/hongxia.png',
  },
  {
    title: '新宿ダイカンプラザ',
    location: '新宿西口 徒歩1分',
    image: '/imgs/kura.png',
  },
  {
    title: 'ノア渋谷',
    location: '渋谷区',
    image: null, // 没有照片
  },
  {
    title: '日興パレス南麻布',
    location: '港区南麻布',
    image: '/imgs/hiragamachi.png',
  },
  {
    title: 'ライオンズマンション平河町',
    location: '千代田区平河町',
    image: '/imgs/minamiazabu.png',
  },
  {
    title: 'Helte株式会社',
    location: 'IT企業・最大株主',
    image: '/imgs/helte LOGO.png',
  },
]



