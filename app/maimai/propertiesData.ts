export type MaimaiPropertyCard = {
  title: string
  price: string
  area: string
  type: string
  location: string
  image: string
  href: string
  featureKey: 'maimai.properties.noFee' | 'maimai.properties.withFee'
}

export const maimaiPropertiesNoFee: MaimaiPropertyCard[] = [
  {
    title: 'ライオンズマンション東銀座2F',
    price: '42,680万日元',
    area: '127.6㎡',
    type: '店舗・事務所',
    location: '東京都中央区築地',
    image: '/imgs/Lions Mansion Higashi-Ginza.jpeg',
    href: '/maimai/lions-higashiginza-2f',
    featureKey: 'maimai.properties.noFee',
  },
  {
    title: '新中野駅上プラザ305号室',
    price: '2,100万日元',
    area: '23.92㎡',
    type: '1R',
    location: '東京都中野区本町',
    image: '/imgs/maimai/shinnakanoekiue.jpeg',
    href: '/maimai/shin-nakano-ekijou-plaza-305',
    featureKey: 'maimai.properties.noFee',
  },
  {
    title: '新中野駅上プラザ304号室',
    price: '5,600万日元',
    area: '71.73㎡',
    type: '2LDK',
    location: '東京都中野区本町',
    image: '/imgs/maimai/shinnakanoekiue.jpeg',
    href: '/maimai/shin-nakano-ekijou-plaza-304',
    featureKey: 'maimai.properties.noFee',
  },
]

export const maimaiPropertiesWithFee: MaimaiPropertyCard[] = [
  {
    title: 'パティオ杉並 2F',
    price: '1,050万日元',
    area: '19.2㎡',
    type: '1R',
    location: '东京都杉并区堀之内',
    image: '/imgs/maimai/Patio Suginami 2F.jpeg',
    href: '/maimai/patio-suginami-203',
    featureKey: 'maimai.properties.withFee',
  },
  {
    title: 'セントヒルズ椎名町 4F',
    price: '1,050万日元',
    area: '13.84㎡',
    type: '1R',
    location: '东京都丰岛区长崎',
    image: '/imgs/maimai/Saint Hills Shiinamachi 4F.jpeg',
    href: '/maimai/cent-hills-shiinamachi-405',
    featureKey: 'maimai.properties.withFee',
  },
  {
    title: "パレ・ドール相模原 8F",
    price: '420万日元',
    area: '16.29㎡',
    type: '1K',
    location: '神奈川县相模原市',
    image: "/imgs/maimai/Palais d'Or Sagamihara 8F.jpeg",
    href: '/maimai/pale-dor-sagamihara-808',
    featureKey: 'maimai.properties.withFee',
  },
  {
    title: '日神パレス竹ノ塚 5F',
    price: '700万日元',
    area: '18.09㎡',
    type: '1R',
    location: '东京都足立区伊兴',
    image: '/imgs/maimai/Nisshin Palace Takenotsuka 5f.jpeg',
    href: '/maimai/nichishin-palace-takenotsuka-509',
    featureKey: 'maimai.properties.withFee',
  },
  {
    title: 'セザール西高島平 2F',
    price: '1,200万日元',
    area: '27.13㎡',
    type: '2〜3LDK',
    location: '东京都板桥区德丸',
    image: '/imgs/Cesar Nishi Takashimadaira.jpeg',
    href: '/maimai/cesar-takashimadaira-206',
    featureKey: 'maimai.properties.withFee',
  },
  {
    title: '美和プラザ高井戸 1F',
    price: '990万日元',
    area: '—',
    type: '1K×3戸',
    location: '东京都杉并区上高井户',
    image: '/imgs/maimai/Miwa Plaza Takaido 1.jpeg',
    href: '/maimai/miwa-plaza-takaido-101',
    featureKey: 'maimai.properties.withFee',
  },
  {
    title: 'LM西八王子第3 7F',
    price: '480万日元',
    area: '18.2㎡',
    type: '1K',
    location: '东京都八王子市八木町',
    image: '/imgs/maimai/Lions Mansion Nishi Hachioji 3-1.jpeg',
    href: '/maimai/lm-nishihachioji-3-707',
    featureKey: 'maimai.properties.withFee',
  },
  {
    title: 'スカイコート生田 2F',
    price: '430万日元',
    area: '约17㎡',
    type: '1K',
    location: '神奈川县川崎市多摩区',
    image: '/imgs/maimai/Sky Court Ikuta.jpeg',
    href: '/maimai/sky-court-ikuta-202',
    featureKey: 'maimai.properties.withFee',
  },
]

export const maimaiAllPropertyCards: MaimaiPropertyCard[] = [
  ...maimaiPropertiesNoFee,
  ...maimaiPropertiesWithFee,
]

