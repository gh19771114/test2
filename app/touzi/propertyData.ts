export type InvestmentProperty = {
  slug: string
  title: string
  location: string
  image: string
  price: string
  type: string
  description: string
  highlights: string[]
}

export const investmentProperties: InvestmentProperty[] = [
  {
    slug: 'tokyo-bay-tower',
    title: '东京湾区·海景塔楼',
    location: '东京都港区',
    image: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    price: '约 18.6 亿日元',
    type: '甲级写字楼 + 服务式公寓',
    description:
      '位于东京湾再开发核心区域，面向国际金融机构与跨国企业的综合体项目。项目由甲级写字楼与高端服务式公寓组成，租赁需求稳定，享有滨水景观与完善交通网络。',
    highlights: [
      '年化租金收益目标 5.1% · 租约平均期限 7 年',
      '港区·品川·羽田三节点交通圈，适合跨国团队驻扎',
      '可提供一站式法人登记、税务与生活配套落地服务',
    ],
  },
  {
    slug: 'kyoto-townhouse',
    title: '京都祇园·町屋复合式资产',
    location: '京都市东山区',
    image: 'https://images.unsplash.com/photo-1523419409543-0c1df022bdd4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    price: '约 6,800 万日元',
    type: '传统町屋 · 文化商用物业',
    description:
      '保存完好的京都町屋，内装结合现代机能与传统木构，适合作为精品旅宿、文化体验馆或茶席空间。项目提供运营团队与民宿许可申请支援。',
    highlights: [
      ' 目标入住率 78% · 平均房价 48,000 日元/夜',
      '已完成耐震补强与消防改造，合规运营无后顾之忧',
      '行走 3 分钟到八坂神社，坐拥祇园黄金人流',
    ],
  },
  {
    slug: 'sapporo-ski-residence',
    title: '北海道·滑雪度假公寓',
    location: '虾夷札幌 · 二世古连线',
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cd2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    price: '约 9,200 万日元',
    type: '滑雪酒店式公寓',
    description:
      '连接札幌市区与二世古滑雪场的度假公寓，冬季滑雪、夏季避暑，全年高入住率。配有业主自用与委托运营双模式，可灵活切换资产策略。',
    highlights: [
      '滑雪季入住率 92%，淡季由长住客与企业培训填补',
      '含租赁运营与收益分配管理合约，年度净收益目标 5.8%',
      '可代办温泉使用许可与物业管理，提供多语种住客服务',
    ],
  },
]



