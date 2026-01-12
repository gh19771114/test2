export type InvestmentProperty = {
  titleKey: string
  locationKey: string
  image: string | null
}

export const investmentProperties: InvestmentProperty[] = [
  {
    titleKey: 'company.overview.assets.property1.title',
    locationKey: 'company.overview.assets.property1.location',
    image: '/imgs/honsha.png',
  },
  {
    titleKey: 'company.overview.assets.property2.title',
    locationKey: 'company.overview.assets.property2.location',
    image: '/imgs/kura.png',
  },
  {
    titleKey: 'company.overview.assets.property3.title',
    locationKey: 'company.overview.assets.property3.location',
    image: null, // 没有照片
  },
  {
    titleKey: 'company.overview.assets.property4.title',
    locationKey: 'company.overview.assets.property4.location',
    image: '/imgs/hiragamachi.png',
  },
  {
    titleKey: 'company.overview.assets.property5.title',
    locationKey: 'company.overview.assets.property5.location',
    image: '/imgs/minamiazabu.png',
  },
  {
    titleKey: 'company.overview.assets.property6.title',
    locationKey: 'company.overview.assets.property6.location',
    image: '/imgs/helte LOGO.png',
  },
]



