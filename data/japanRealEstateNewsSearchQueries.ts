/**
 * 日本房地产相关新闻 — 优化后的搜索词表
 * 用于定期（如每月）检索「近三个月」内、可能影响地价/房价的报道，减少遗漏。
 * 使用方式：在搜索引擎中依次或分批执行下列查询，将结果中有价值的报道加入 japanRealEstateNews.ts。
 */

/** 单条搜索建议：查询文案 + 说明 */
export interface SearchQueryItem {
  /** 在 Google / Bing 等使用的搜索词 */
  query: string
  /** 简要说明，便于判断是否已覆盖 */
  note: string
}

/** 按主题分组的搜索词（日文优先，辅以英文） */
export const searchQueriesByTopic: Record<string, SearchQueryItem[]> = {
  /** 地价·公示·基准地价 */
  地价与公示: [
    { query: '公示地価 基準地価 発表 2025 2026', note: '官方地价公布' },
    { query: '地価 上昇 全国 東京 大阪', note: '地价走势' },
    { query: '国土交通省 地価 公示', note: '国交省口径' },
  ],

  /** 住宅·マンション价格与市场 */
  住宅与マンション: [
    { query: 'マンション 価格 新築 中古 東京 首都圏', note: '公寓价格' },
    { query: '新築マンション 平均価格 発表 月次', note: '新筑均价月报' },
    { query: '中古マンション 価格 1億円 東京', note: '中古高价/纪录' },
    { query: 'Japan condo price Tokyo record 2025 2026', note: '英文东京公寓纪录' },
  ],

  /** 建设成本·开发·再开发（易遗漏，需单独覆盖） */
  建设与开发: [
    { query: '建設費 高騰 不動産 開発', note: '建设费上涨' },
    { query: '都市再開発 中止 見直し プロジェクト', note: '再开发项目中止' },
    { query: '東洋経済 不動産 建設', note: '东洋经济 不动产/建设' },
    { query: '建築費 上昇 ゼネコン 見積もり', note: '建筑费与报价' },
  ],

  /** 金利·住宅ローン·日银 */
  金利与政策: [
    { query: '住宅ローン 金利 引き上げ 固定 変動', note: '房贷利率' },
    { query: '日銀 利上げ 政策金利 0.75', note: '央行加息' },
    { query: 'BOJ interest rate Japan real estate', note: '英文日银与不动产' },
  ],

  /** 投资·REIT·外资 */
  投资与REIT: [
    { query: 'J-REIT 取得 売却 物件 2025 2026', note: 'J-REIT 取得/处置' },
    { query: '不動産 投資 外国人 規制', note: '外资与规制' },
    { query: 'Japan real estate foreign investment', note: '英文外资' },
  ],

  /** 按媒体 site 检索（减少漏掉特定媒体） */
  主要媒体站内: [
    { query: 'site:toyokeizai.net 不動産', note: '东洋经济 不动产' },
    { query: 'site:toyokeizai.net 建設 地価', note: '东洋经济 建设/地价' },
    { query: 'site:nikkei.com 不動産 マンション', note: '日经 不动产' },
    { query: 'site:reuters.com Japan real estate', note: 'Reuters 日本不动产' },
    { query: 'site:mainichi.jp マンション 地価', note: '每日新闻' },
    { query: 'site:nhk.or.jp マンション 地価 住宅', note: 'NHK' },
    { query: 'site:yomiuri.co.jp 不動産', note: '读卖' },
    { query: 'site:suumo.jp マンション 価格 動向', note: 'SUUMO' },
  ],

  /** 时间限定（近三个月） */
  近期时间词: [
    { query: '不動産 ニュース 2026年1月 2月', note: '当月/上月' },
    { query: '不動産 ニュース 2025年11月 12月', note: '前两月' },
  ],
}

/** 扁平化后的全部搜索词（便于顺序执行或脚本遍历） */
export const allSearchQueries: SearchQueryItem[] = Object.values(
  searchQueriesByTopic
).flat()

// ========== Google News RSS 抓取 ==========
// 使用方式：GET /api/news/google-rss 会请求下列 RSS 地址，解析后返回近三个月内的条目（标题、链接、日期、出处）

const RSS_BASE = 'https://news.google.com/rss/search'
const RSS_PARAMS = 'hl=ja&gl=JP&ceid=JP:ja'

/** 用于 RSS 的搜索词（会做 encodeURIComponent 后拼进 URL） */
export const googleNewsRssQueries: string[] = [
  '日本 不動産',
  '地価 マンション 東京',
  '建設費 不動産 都市再開発',
]

/** 生成单条 Google News RSS 地址 */
export function getGoogleNewsRssUrl(query: string): string {
  return `${RSS_BASE}?q=${encodeURIComponent(query)}&${RSS_PARAMS}`
}
