/**
 * 近期不动产动向解读页 — 图表与文案数据
 * 基于新闻研判整理，用于 /news/real-estate-outlook
 */

/** 地价/公寓：以 2024上 为基准 0%，后续为较基准的涨幅（%），便于看图看出变化 */
export const landPriceTrend = [
  { label: '2024上', risePercent: 0 },
  { label: '2024下', risePercent: 6 },
  { label: '2025上', risePercent: 13 },
  { label: '2025下', risePercent: 20 },
  { label: '2026初', risePercent: 28 },
]

/** 市场热度（机会）：名称、程度、一句说明 */
export const marketOpportunities = [
  { name: '都心优质资产需求', level: '高' as const, desc: '核心区住宅与商业需求坚挺，地价连涨' },
  { name: '外资流入意愿', level: '高' as const, desc: '海外资金持续看好日本不动产，基金与机构买入' },
]

/** 风险与压力：名称、程度、一句说明 */
export const marketRisks = [
  { name: '建设成本压力', level: '高' as const, desc: '建材与人工上涨，令和型建设费高腾' },
  { name: '再开发延期/中止', level: '高' as const, desc: '名古屋・博多・津田沼等多地项目白纸化' },
  { name: '塔楼/投机过热担忧', level: '中' as const, desc: '部分转卖困难、价格回调个案增加' },
]

/** 资金面示意（相对比例），用于饼图 */
export const fundingSources = [
  { name: '银行不动产融资', value: 42, desc: '9年ぶり高水準', color: '#3b82f6' },
  { name: '外资/基金', value: 28, desc: '日本買い継続', color: '#10b981' },
  { name: 'J-REIT・机构', value: 20, desc: '安定運用', color: '#f59e0b' },
  { name: '个人/其他', value: 10, desc: 'NISA等', color: '#8b5cf6' },
]

/** 未来1–3年预期要点 */
export const outlookPoints = [
  { title: '核心区价格', desc: '东京及主要都市优质资产维持高位或缓涨', trend: 'up' as const },
  { title: '供给节奏', desc: '新建大型再开发放缓，改修・存量活用增加', trend: 'neutral' as const },
  { title: '二线・老旧', desc: '部分塔楼与老旧物件存在价格回调与出清风险', trend: 'down' as const },
  { title: '政策与规制', desc: '外国人购房全面严控概率低，敏感地带监管或加强', trend: 'neutral' as const },
]
