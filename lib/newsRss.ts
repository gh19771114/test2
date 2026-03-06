import { getGoogleNewsRssUrl, googleNewsRssQueries } from '@/data/japanRealEstateNewsSearchQueries'

export type RssItem = { title: string; link: string; date: string; source: string }

function parseRssItems(xml: string): { title: string; link: string; pubDate: string; source: string }[] {
  const items: { title: string; link: string; pubDate: string; source: string }[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi
  let match = itemRegex.exec(xml)
  while (match) {
    const block = match[1]
    const titleMatch = /<title>([\s\S]*?)<\/title>/i.exec(block)
    const linkMatch = /<link>([\s\S]*?)<\/link>/i.exec(block)
    const pubDateMatch = /<pubDate>([\s\S]*?)<\/pubDate>/i.exec(block)
    const sourceMatch = /<source[^>]*>([\s\S]*?)<\/source>/i.exec(block)
    const title = titleMatch ? titleMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim() : ''
    const link = linkMatch ? linkMatch[1].trim() : ''
    const pubDate = pubDateMatch ? pubDateMatch[1].trim() : ''
    const source = sourceMatch ? sourceMatch[1].trim() : ''
    if (title && link) items.push({ title, link, pubDate, source })
    match = itemRegex.exec(xml)
  }
  return items
}

function parseRssDate(pubDate: string): string {
  if (!pubDate) return ''
  try {
    const d = new Date(pubDate)
    if (isNaN(d.getTime())) return ''
    return d.toISOString().slice(0, 10)
  } catch {
    return ''
  }
}

export async function fetchRssItems(): Promise<RssItem[]> {
  const threeMonthsAgo = new Date()
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
  const cutoff = threeMonthsAgo.getTime()
  const seen = new Set<string>()
  const results: RssItem[] = []

  for (const query of googleNewsRssQueries) {
    try {
      const url = getGoogleNewsRssUrl(query)
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NewsAggregator/1.0)' },
        next: { revalidate: 0 },
      })
      if (!res.ok) continue
      const xml = await res.text()
      const items = parseRssItems(xml)
      for (const item of items) {
        const dateStr = parseRssDate(item.pubDate)
        const t = new Date(dateStr).getTime()
        if (isNaN(t) || t < cutoff) continue
        const key = `${item.link}`
        if (seen.has(key)) continue
        seen.add(key)
        results.push({
          title: item.title,
          link: item.link,
          date: dateStr,
          source: item.source || 'Google News',
        })
      }
    } catch (e) {
      console.error('Google News RSS fetch error:', query, e)
    }
  }
  results.sort((a, b) => (b.date > a.date ? 1 : -1))
  return results
}

/** 仅排除：公司人事任命类新闻（如「東急不動産社長に田中辰明氏」）。
 * 不因来源或标题含「日本経済新聞」等就排除。 */
function isPersonnelAppointment(title: string): boolean {
  const t = (title || '').trim()
  if (t.length <= 18) return true
  if (/(社長|会長|委員長|部長|取締役|CEO|COO)\s*に\s*.+氏/i.test(t)) return true
  if (/に.+氏\s*[-|–—]/.test(t)) return true
  if (/人事\s*(異動|発表|任命|就任)|就任\s*の\s*お知らせ|退任\s*の\s*お知らせ/i.test(t)) return true
  return false
}

/** 排除：书籍试读、书评、书讯等非新闻（如「ためし読み」「本の話」）。 */
function isBookOrPromo(title: string): boolean {
  const t = (title || '').trim()
  if (/ためし読み|試し読み|試読/i.test(t)) return true
  if (/本の話\s*[-|–—]|[-|–—]\s*本の話/i.test(t)) return true
  if (/書評|書籍紹介|本の紹介|新刊紹介|読書/i.test(t)) return true
  if (/\|\s*ためし読み|\|\s*試し読み/i.test(t)) return true
  return false
}

/** 页面 HTML 中常见的付费/登录墙文案（日・英），命中则视为需登录或付费才能看全文 */
const PAYWALL_PATTERNS = [
  /会員限定|有料会員|記事の続きは(会員|購読)|ログインして読む|無料会員では読めません?|有料記事|プレミアム会員|この記事は会員限定|続きを読む.*会員|購読.*続き|サブスクリプション/i,
  /subscribe\s*(to\s*)?read|paywall|member\s*only|sign\s*in\s*to\s*read|log\s*in\s*to\s*read|premium\s*content|subscriber\s*only|registration\s*required/i,
  /登录.*阅读|订阅.*阅读|会员专享|付费阅读|开通.*继续|注册.*阅读/i,
]

/** 请求文章链接，根据页面内容判断是否疑似需登录/付费才能看全文。超时或失败时保留条目（不排除）。 */
export async function isLikelyPaywalled(url: string, timeoutMs = 3500): Promise<boolean> {
  try {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeoutMs)
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'ja,en;q=0.9',
      },
      next: { revalidate: 0 },
    })
    clearTimeout(id)
    if (!res.ok) return false
    const html = await res.text()
    const slice = html.slice(0, 8000) // 只检查前 8k 字符，减少误匹配正文
    return PAYWALL_PATTERNS.some((p) => p.test(slice))
  } catch {
    return false
  }
}

const CONCURRENCY = 3
const PAYWALL_CHECK_MAX = 40

/** 先按人事任命 + 书籍/试读类排除，再对前 N 条做付费墙检测（并发+超时），排除疑似需登录/付费的链接。 */
export async function screenRssItemsWithPaywall(
  items: RssItem[],
  options?: { maxPaywallChecks?: number }
): Promise<RssItem[]> {
  const afterPersonnel = items.filter(
    (item) =>
      !isPersonnelAppointment((item.title || '').trim()) && !isBookOrPromo((item.title || '').trim())
  )
  const toCheck = afterPersonnel.slice(0, options?.maxPaywallChecks ?? PAYWALL_CHECK_MAX)
  const rest = afterPersonnel.slice(toCheck.length)

  const run = async (batch: RssItem[]) => {
    const results = await Promise.all(
      batch.map(async (item) => {
        const paywalled = await isLikelyPaywalled(item.link)
        return paywalled ? null : item
      })
    )
    return results.filter((r): r is RssItem => r != null)
  }

  const batches: RssItem[][] = []
  for (let i = 0; i < toCheck.length; i += CONCURRENCY) {
    batches.push(toCheck.slice(i, i + CONCURRENCY))
  }
  const kept: RssItem[] = []
  for (let i = 0; i < batches.length; i++) {
    kept.push(...(await run(batches[i])))
    if (i < batches.length - 1) await new Promise((r) => setTimeout(r, 300))
  }
  return [...kept, ...rest]
}

export function screenRssItems(items: RssItem[]): RssItem[] {
  return items.filter(
    (item) =>
      !isPersonnelAppointment((item.title || '').trim()) && !isBookOrPromo((item.title || '').trim())
  )
}
