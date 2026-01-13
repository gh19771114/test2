// ============================================
// 日期提取规则（重要！）
// ============================================
// 当从网页提取新闻日期时，遵循以下规则：
// 1. 如果网页只显示"月/日"格式（如"12/1"），没有年份：
//    - 默认使用当前年份（new Date().getFullYear()）
//    - 不要假设是去年或未来年份
// 2. 检查版权信息中的年份（如"© 2025"）作为参考
// 3. 检查新闻内容中的时间线索（如"明年1月"、"今年"等）
// 4. 如果日期是未来日期（超过今天），检查是否是时区问题或错误
// 5. 日期格式统一使用：'YYYY-MM-DD'（如'2025-12-01'）
//
// 示例：
// - 网页显示"12/1(月) 5:00配信" + 版权"© 2025" → 日期应为'2025-12-01'
// - 网页显示"1/15" + 当前年份2025 → 日期应为'2025-01-15'
// ============================================

// 生成 slug 的工具函数
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\u4e00-\u9fa5a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// 日期验证函数：确保日期格式正确且合理
export function validateNewsDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const currentYear = now.getFullYear()
  
  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    console.warn(`无效的日期格式: ${dateString}`)
    // 如果日期无效，返回当前日期
    return now.toISOString().split('T')[0]
  }
  
  // 检查日期是否在未来（超过今天+1天，可能是错误）
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  if (date > tomorrow) {
    console.warn(`日期在未来，可能错误: ${dateString}`)
  }
  
  // 检查年份是否合理（不应早于2020年，不应超过当前年份+1年）
  const year = date.getFullYear()
  if (year < 2020 || year > currentYear + 1) {
    console.warn(`年份不合理: ${year}，当前年份: ${currentYear}`)
  }
  
  return dateString
}

// 从网页日期字符串提取标准日期格式
// 输入示例："12/1(月) 5:00配信" 或 "12/1"
// 输出："YYYY-MM-DD"
export function extractDateFromWebString(dateStr: string, copyrightYear?: number): string {
  const currentYear = copyrightYear || new Date().getFullYear()
  
  // 提取月/日（格式：12/1 或 1/15）
  const match = dateStr.match(/(\d{1,2})\/(\d{1,2})/)
  if (!match) {
    console.warn(`无法从字符串提取日期: ${dateStr}`)
    return new Date().toISOString().split('T')[0]
  }
  
  const month = parseInt(match[1], 10)
  const day = parseInt(match[2], 10)
  
  // 构建完整日期
  const date = new Date(currentYear, month - 1, day)
  
  // 验证日期是否有效
  if (date.getMonth() !== month - 1 || date.getDate() !== day) {
    console.warn(`无效的日期: ${month}/${day}/${currentYear}`)
    return new Date().toISOString().split('T')[0]
  }
  
  return date.toISOString().split('T')[0]
}

// 最新资讯数据类型
export type NewsItem = {
  date: string
  slug: string
  isPinned?: boolean
  isNotice?: boolean
  category?: string
  image?: string
  headerImage?: string
  contentImage?: string
}

// 最新资讯数据
// 注意：title 和 content 现在通过翻译文件提供，使用翻译键：news.items.{slug}.title 和 news.items.{slug}.content
export const latestNews: NewsItem[] = [
  {
    date: '2026-01-07',
    slug: 'president-attends-saikai-awards-2025',
    isPinned: false,
    isNotice: false,
    category: '公司活动',
    image: '/imgs/saikai-awards-header.jpg',
    headerImage: '/imgs/saikai-awards-header.jpg',
    contentImage: '/imgs/saikai-awards-content.jpg',
  },
  {
    date: '2025-12-16',
    slug: 'president-lecture-meikai-university',
    isPinned: false,
    isNotice: false,
    category: '公司活动',
    image: '/imgs/20151216-1.jpg',
  },
  {
    date: '2025-12-20',
    slug: '2025-year-end-holiday-notice',
    isPinned: true,
    isNotice: true,
    category: '通知',
  },
  {
    date: '2025-11-05',
    slug: 'japan-government-strengthens-foreign-buyer-regulation',
  },
  {
    date: '2025-12-01',
    slug: 'foreigner-real-estate-ownership-database-2027',
  },
  {
    date: '2025-01-15',
    slug: 'tokyo-23-wards-new-apartment-price-record',
  },
  {
    date: '2025-01-08',
    slug: 'japan-real-estate-investment-record-foreign-capital',
  },
  {
    date: '2024-12-20',
    slug: 'japan-land-price-increase-34-year-high',
  },
  {
    date: '2024-12-10',
    slug: 'japan-mortgage-rate-historic-low-0-45',
  },
  {
    date: '2024-11-25',
    slug: 'osaka-new-apartment-supply-expo-effect',
  },
  {
    date: '2024-11-12',
    slug: 'fukuoka-high-rental-yield-tech-industry',
  },
  {
    date: '2025-11-27',
    slug: 'tokyo-23-wards-foreign-buyer-ratio-taiwan-dominant',
  },
  {
    date: '2025-10-15',
    slug: 'japanese-support-foreign-buyer-regulation-developer-restrictions',
  },
  {
    date: '2025-10-20',
    slug: 'foreign-speculation-tokyo-price-surge-government-investigation',
  },
  {
    date: '2025-07-15',
    slug: 'foreign-capital-accelerates-japan-real-estate-government-concern',
  },
  {
    date: '2025-10-18',
    slug: 'japan-real-estate-attracts-investors-commercial-accommodation',
  },
  {
    date: '2025-09-15',
    slug: 'japan-real-estate-investment-growth-domestic-foreign',
  },
  {
    date: '2025-08-10',
    slug: 'tokyo-prime-location-price-surge-foreign-ownership-limits',
  },
  {
    date: '2025-05-30',
    slug: 'foreign-buyers-japan-too-easy-controversy',
  },
  {
    date: '2025-07-20',
    slug: 'chinese-wealthy-japan-real-estate-market-reaction',
  },
]

// 日本房产投资百科数据
export const encyclopediaEntries = [
  {
    title: '日本买房流程：签约、交割与注册须知',
    tag: '基础攻略',
    slug: 'japan-home-buying-process',
    content: `在日本购买房产需要遵循严格的流程，了解每个环节的要点至关重要。

[FLOW:0]

签约阶段需要准备的重要文件包括重要事项说明书、买卖合同以及土地登记簿副本。在签约时，需要仔细阅读重要事项说明书，确认物业的权属关系，并了解周边环境和设施。

交割前需要做好资金准备，包括首付款和税费等。同时需要完成贷款审批和保险购买。交割当日需要进行最终验房，支付尾款，并接收钥匙和相关文件。

交割完成后，需要向法务局提交所有权转移登记，缴纳登记许可税，并完成固定资产税申报。从签约到交割通常需要1至2个月时间，登记手续在交割后1至2周内完成。

[TABLE:0]`,
    charts: [
      {
        type: 'flow',
        title: '日本买房完整流程',
        data: {
          steps: [
            {
              title: '物业搜索与选房',
              description: '通过中介或网络平台寻找合适物业，实地看房，确认位置、周边环境、交通便利性等',
            },
            {
              title: '价格谈判与签约',
              description: '与卖方协商价格，签署买卖合同，支付定金（通常为房价的5-10%），仔细阅读重要事项说明书',
            },
            {
              title: '贷款申请（如需要）',
              description: '向银行提交贷款申请，准备收入证明、身份证明等材料，等待审批（通常1-2个月）',
            },
            {
              title: '资金准备与验房',
              description: '准备首付款、税费、中介费等资金，进行最终验房，确认物业状况',
            },
            {
              title: '交割与登记',
              description: '支付尾款，接收钥匙和相关文件，向法务局提交所有权转移登记（交割后1-2周完成）',
            },
          ],
        },
      },
      {
        type: 'table',
        title: '时间节点参考',
        data: {
          headers: ['阶段', '所需时间', '主要事项'],
          rows: [
            ['物业搜索', '1-3个月', '看房、比较、谈判'],
            ['签约到交割', '1-2个月', '贷款审批、资金准备、验房'],
            ['登记手续', '1-2周', '所有权转移登记、税费缴纳'],
            ['总计', '2-5个月', '从选房到完成登记'],
          ],
        },
      },
    ],
  },
  {
    title: '固定资产税与城市规划税如何计算',
    tag: '税务',
    slug: 'fixed-asset-tax-calculation',
    content: `固定资产税和城市规划税是日本房产持有期间需要缴纳的重要税费。

固定资产税以固定资产评估额为基准计算，标准税率为1.4%。评估额通常低于市场价，这是计算时需要注意的要点。新建住宅有减税措施，小规模住宅有特例，符合条件可申请减免。

[TABLE:0]

城市规划税同样以固定资产评估额为基准计算，税率上限为0.3%，由市町村政府征收。

[TABLE:1]

每年4至5月会收到纳税通知书，分4期缴纳，分别在6月、9月、12月和次年2月。可通过银行转账或便利店缴纳。

节税建议包括了解各种减免政策，合理利用折旧，以及咨询税务专业人士。`,
    charts: [
      {
        type: 'table',
        title: '固定资产税计算示例',
        data: {
          headers: ['项目', '说明', '示例'],
          rows: [
            ['市场价', '房产实际交易价格', '5,000万日元'],
            ['评估额', '通常为市场价的70%', '3,500万日元'],
            ['标准税率', '固定税率', '1.4%'],
            ['年税额', '评估额 × 税率', '49万日元'],
            ['新建住宅减税', '前3年减半征收', '前3年：24.5万日元/年'],
          ],
          caption: '以市场价5,000万日元的房产为例',
        },
      },
      {
        type: 'table',
        title: '纳税时间表',
        data: {
          headers: ['期数', '缴纳月份', '缴纳比例', '备注'],
          rows: [
            ['第1期', '6月', '25%', '纳税通知书4-5月送达'],
            ['第2期', '9月', '25%', '可通过银行转账'],
            ['第3期', '12月', '25%', '可通过便利店缴纳'],
            ['第4期', '次年2月', '25%', '逾期需缴纳滞纳金'],
          ],
        },
      },
    ],
  },
  {
    title: '租赁合同中的重要条款与常见风险',
    tag: '租赁管理',
    slug: 'rental-contract-important-clauses',
    content: `日本租赁合同条款复杂，了解关键条款和风险点对房东和租客都至关重要。

[TABLE:0]

租期通常为2年。续约条件需要明确续约程序和费用。解约通知需要提前通知，具体期限需在合同中明确。

日常维护属于租客责任范围，大型修缮属于房东责任范围。设备故障的责任划分需要在合同中明确。

[COMPARISON:0]

风险防范措施包括选择可靠的租客并进行背景调查，购买租赁保险，以及委托专业管理公司。`,
    charts: [
      {
        type: 'table',
        title: '租赁费用构成',
        data: {
          headers: ['费用项目', '金额标准', '说明'],
          rows: [
            ['月租金', '根据市场价确定', '每月固定支付'],
            ['押金', '1-2个月租金', '退租时扣除修缮费后返还'],
            ['礼金', '1-2个月租金（部分地区）', '一次性支付，不退'],
            ['中介费', '0.5-1个月租金', '签约时一次性支付'],
            ['火灾保险', '每年约1-2万日元', '通常由租客承担'],
          ],
        },
      },
      {
        type: 'comparison',
        title: '风险对比',
        data: {
          items: [
            {
              title: '房东风险',
              points: [
                '租客拖欠租金',
                '房屋损坏赔偿',
                '退租时原状恢复费用',
                '空置期损失',
              ],
            },
            {
              title: '租客风险',
              points: [
                '押金扣除争议',
                '租金上涨',
                '提前解约违约金',
                '设备故障维修责任',
              ],
            },
          ],
        },
      },
    ],
  },
  {
    title: '公寓管理费与修缮基金的组成',
    tag: '资产维护',
    slug: 'apartment-management-fee-composition',
    content: `了解公寓管理费和修缮基金的组成，有助于合理评估持有成本。

管理费的用途包括公共区域清洁维护、电梯和门禁等设备维护、管理公司费用以及公共设施使用费。通常按套内面积比例分摊，每月固定金额，但根据实际支出可能调整。

[TABLE:0]

修缮基金的用途包括建筑物大规模修缮、设备更新换代、抗震加固工程以及外壁涂装等。修缮基金的特点是长期积累资金，专款专用，根据修缮计划确定金额。

费用水平方面，管理费通常每月5,000至20,000日元每户，修缮基金通常每月3,000至15,000日元每户，具体根据建筑物规模和设施而定。

[TABLE:1]

注意事项包括了解修缮基金余额，关注修缮计划，以及评估长期持有成本。`,
    charts: [
      {
        type: 'table',
        title: '管理费用途明细',
        data: {
          headers: ['用途', '说明', '占比'],
          rows: [
            ['公共区域清洁', '走廊、楼梯、大厅等', '约30%'],
            ['设备维护', '电梯、门禁、监控等', '约25%'],
            ['管理公司费用', '专业管理服务', '约20%'],
            ['公共设施', '照明、水电等', '约15%'],
            ['其他费用', '保险、杂费等', '约10%'],
          ],
        },
      },
      {
        type: 'table',
        title: '费用水平参考（每户/月）',
        data: {
          headers: ['建筑物类型', '管理费', '修缮基金', '合计'],
          rows: [
            ['小型公寓（10-20户）', '5,000-10,000日元', '3,000-8,000日元', '8,000-18,000日元'],
            ['中型公寓（20-50户）', '8,000-15,000日元', '5,000-12,000日元', '13,000-27,000日元'],
            ['大型公寓（50户以上）', '12,000-20,000日元', '8,000-15,000日元', '20,000-35,000日元'],
          ],
          caption: '具体金额根据建筑物规模、设施、地理位置等因素而定',
        },
      },
    ],
  },
  {
    title: '非居住者如何在日本申请房贷（2025最新指南）',
    tag: '融资',
    slug: 'non-resident-mortgage-application-2025',
    content: `非居住者在日本申请房贷虽然条件相对严格，但2025年随着市场环境变化，申请途径更加多样化。

基本要求包括稳定的收入证明，年收入通常需300万日元以上，良好的信用记录，足够的首付款（通常30%至50%，部分银行可降至20%），以及日本银行账户。

[TABLE:0]

2025年新变化方面，部分银行放宽了对非居住者的审查标准，增加了针对海外投资者的专门产品，并支持多币种贷款，包括美元和人民币等。

主要银行包括三菱UFJ银行，针对高净值客户有专门产品；三井住友银行，支持海外收入证明；瑞穗银行，非居住者贷款审批率提升；以及绮罗星银行、东日本银行等地方银行。

部分外资银行提供更灵活的贷款条件，支持海外资产作为担保，利率可能相对较高但审批更快。

[TABLE:1]

申请流程包括咨询阶段，了解各银行产品并对比利率和条件；资料准备，包括收入证明、身份证明、资金来源证明等；初步审查，银行评估申请资格和贷款额度；正式申请，提交完整资料包括物业评估报告；审查与审批，通常需要1至3个月；以及签约与放款，完成贷款手续，资金到位。

[FLOW:0]

利率可能高于居住者，但2025年差距有所缩小。审批时间可能较长，建议提前准备。需要准备充分的资料，包括翻译件。建议咨询专业贷款顾问，选择最适合的产品。同时需要关注汇率变动对还款的影响。

数据来源：xijia.jp`,
    charts: [
      {
        type: 'table',
        title: '基本申请要求',
        data: {
          headers: ['要求项目', '标准', '备注'],
          rows: [
            ['年收入', '300万日元以上', '需提供稳定收入证明'],
            ['信用记录', '良好', '无不良信用记录'],
            ['首付款', '30-50%（部分银行20%）', '根据银行和条件而定'],
            ['日本银行账户', '必需', '用于还款'],
            ['身份证明', '有效护照等', '需翻译件'],
          ],
        },
      },
      {
        type: 'table',
        title: '2025年利率水平参考',
        data: {
          headers: ['贷款类型', '利率范围', '说明'],
          rows: [
            ['浮动利率', '0.5% - 1.2%', '根据银行和条件而定'],
            ['10年固定', '1.0% - 1.5%', '部分银行推出0.45%超低利率'],
            ['20年固定', '1.2% - 1.8%', '需满足特定条件'],
            ['35年固定', '1.5% - 2.0%', '长期稳定还款'],
          ],
        },
      },
      {
        type: 'flow',
        title: '申请流程',
        data: {
          steps: [
            {
              title: '咨询阶段',
              description: '了解各银行产品，对比利率和条件，选择最适合的银行',
            },
            {
              title: '资料准备',
              description: '准备收入证明、身份证明、资金来源证明等，需要翻译件',
            },
            {
              title: '初步审查',
              description: '银行评估申请资格和贷款额度，通常1-2周',
            },
            {
              title: '正式申请',
              description: '提交完整资料，包括物业评估报告',
            },
            {
              title: '审查与审批',
              description: '银行详细审查，通常需要1-3个月',
            },
            {
              title: '签约与放款',
              description: '完成贷款手续，资金到位',
            },
          ],
        },
      },
    ],
  },
  {
    title: '2025年日本房产投资税务优化策略',
    tag: '税务',
    slug: 'japan-property-tax-optimization-2025',
    content: `了解2025年日本房产投资的税务政策，合理规划可以显著降低持有成本。

固定资产税标准税率为1.4%，计算基础为固定资产评估额，通常为市场价的70%左右。新建住宅前3年减半征收。

[TABLE:0]

城市规划税税率上限为0.3%，征收对象为城市规划区域内的房产，用途为城市基础设施建设。

所得税采用累进税率，税率为5%至45%。扣除项目包括折旧、管理费、修缮费等。节税策略是合理利用折旧和费用扣除。

[TABLE:1]

2025年新政策方面，针对节能住宅的税收优惠扩大，抗震改造费用的扣除额度提升，长期持有物业的转让所得税优惠。

节税建议包括选择符合节能标准的物业，进行抗震改造以享受税收优惠，合理规划持有期限以利用长期持有优惠，以及咨询税务专业人士制定最优方案。`,
    charts: [
      {
        type: 'table',
        title: '主要税种一览',
        data: {
          headers: ['税种', '税率/计算基础', '特点'],
          rows: [
            ['固定资产税', '1.4%（评估额）', '评估额通常为市场价70%，新建住宅前3年减半'],
            ['城市规划税', '0.3%上限（评估额）', '仅城市规划区域内征收'],
            ['所得税', '5%-45%累进税率', '可扣除折旧、管理费、修缮费等'],
            ['转让所得税', '根据持有期限', '长期持有（5年以上）享受优惠'],
          ],
        },
      },
      {
        type: 'table',
        title: '2025年新政策优惠',
        data: {
          headers: ['政策', '优惠内容', '适用条件'],
          rows: [
            ['节能住宅', '税收优惠扩大', '符合节能标准的物业'],
            ['抗震改造', '扣除额度提升', '进行抗震改造的物业'],
            ['长期持有', '转让所得税优惠', '持有5年以上的物业'],
          ],
        },
      },
    ],
  },
]

// 根据 slug 获取资讯详情
export function getNewsBySlug(slug: string) {
  return latestNews.find(news => news.slug === slug)
}

// 根据 slug 获取百科详情
export function getEncyclopediaBySlug(slug: string) {
  const entry = encyclopediaEntries.find(entry => entry.slug === slug)
  return entry ? {
    ...entry,
    charts: entry.charts || []
  } : undefined
}

// 获取所有资讯 slug
export function getAllNewsSlugs() {
  return latestNews.map(news => news.slug)
}

// 获取所有百科 slug
export function getAllEncyclopediaSlugs() {
  return encyclopediaEntries.map(entry => entry.slug)
}
