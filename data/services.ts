// data/services.ts

import { Building2, ClipboardCheck, Globe2, TrendingUp } from 'lucide-react'

export const services = [
  {
    icon: Building2,
    title: '买卖中介',
    description:
      '针对住宅、公寓、整栋楼宇及商用物业提供全流程购置与出售服务，助您高效匹配优质项目。',
    features: ['严选投资房源', '一对一顾问陪同', '税务与贷款协调', '交割与法律支持'],
    link: '/maimai',
  },
  {
    icon: ClipboardCheck,
    title: '物业管理',
    description:
      '面向在日资产及海外业主的托管服务，包括租赁管理、收支统计、内装修缮、税务申报，确保资产稳健运营。',
    features: ['租客筛选与签约', '租金收取与账目透明', '定期巡检与应急维修', '保险与税费协办'],
    link: '/wuye',
  },
  {
    icon: Globe2,
    title: '企业出海助力',
    description:
      '为有意拓展日本市场的企业提供落地策略、伙伴对接与项目执行支持，快速适配当地商业环境。',
    features: ['市场调研与选址', '合作伙伴对接', '注册与合规办理', '宣传与品牌本地化'],
    link: '/qichu',
  },
  {
    icon: TrendingUp,
    title: '资产投资运营',
    description:
      'Bourn Mark 长期持有优质不动产与创新企业股权，展示自有资本运营成果，供业务伙伴了解集团实力。',
    features: ['企业自有资产展示', '长期稳健运营体系', '跨城市投资布局', '不对外提供投资募集'],
    link: '/touzi',
  },
]


