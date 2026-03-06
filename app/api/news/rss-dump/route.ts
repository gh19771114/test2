import { NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'

const LANGS = ['zh', 'zh-TW', 'zh-HK', 'ja', 'en'] as const
const SUMMARY_MAX = 400

function toId(link: string): string {
  return Buffer.from(link, 'utf-8').toString('base64url')
}

type SnapshotItem = {
  title: string
  link: string
  date: string
  source: string
}

type Snapshot = {
  items: SnapshotItem[]
  fetchedAt: string
}

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const maxDuration = 120
export const runtime = 'nodejs'

function stripHtml(html: string): string {
  const noScript = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '')
  const text = noScript.replace(/<[^>]+>/g, ' ')
  return text.replace(/\s+/g, ' ').trim()
}

/** 从正文提取一段概括文案：优先取首段（按双换行或句号断句），最多 SUMMARY_MAX 字 */
function extractSummary(text: string, maxLen: number): string {
  const t = (text || '').trim()
  if (!t) return ''
  const paragraph = t.split(/\s*[\n\r]{2,}\s*/)[0]?.trim() || t
  const oneLine = paragraph.replace(/\s+/g, ' ')
  if (oneLine.length <= maxLen) return oneLine
  const truncated = oneLine.slice(0, maxLen)
  const lastPeriod = truncated.lastIndexOf('。') || truncated.lastIndexOf('.') || truncated.lastIndexOf('、')
  if (lastPeriod > maxLen * 0.5) return truncated.slice(0, lastPeriod + 1)
  return truncated + '…'
}

export async function GET() {
  try {
    const snapshotPath = path.join(process.cwd(), 'data', 'rssSnapshot.json')
    const raw = await readFile(snapshotPath, 'utf8')
    const snapshot: Snapshot = JSON.parse(raw)

    const items = snapshot.items ?? []
    const maxItems = 20
    const maxTextChars = 12000
    const limited = items.slice(0, maxItems)

    const results: Array<
      SnapshotItem & {
        text?: string
        fetchedAt: string
      }
    > = []

    for (const item of limited) {
      try {
        const res = await fetch(item.link, {
          redirect: 'follow',
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml',
          },
        })
        if (!res.ok) {
          results.push({ ...item, fetchedAt: new Date().toISOString() })
          continue
        }
        const html = await res.text()
        const fullText = stripHtml(html)
        const text = fullText.length > maxTextChars ? fullText.slice(0, maxTextChars) + '…' : fullText
        results.push({
          ...item,
          text,
          fetchedAt: new Date().toISOString(),
        })
      } catch {
        results.push({ ...item, fetchedAt: new Date().toISOString() })
      }
    }

    const out = {
      fetchedAt: new Date().toISOString(),
      items: results,
    }

    const outPath = path.join(process.cwd(), 'data', 'rssArticles.json')
    await writeFile(outPath, JSON.stringify(out, null, 2), 'utf8')

    // 同步写入 rssTranslations.json（种子：各语言暂用原文），便于详情页与列表多语言展示；合并已有翻译避免覆盖
    const dataDir = path.join(process.cwd(), 'data')
    let existing: Record<string, { title: Record<string, string>; summary: Record<string, string> }> = {}
    try {
      const rawExisting = await readFile(path.join(dataDir, 'rssTranslations.json'), 'utf8')
      existing = JSON.parse(rawExisting)
    } catch {
      // 文件不存在或无效则从空对象开始
    }
    for (const item of results) {
      const id = toId(item.link)
      const summary = extractSummary(item.text ?? '', SUMMARY_MAX)
      const titleMap: Record<string, string> = {}
      const summaryMap: Record<string, string> = {}
      for (const lang of LANGS) {
        titleMap[lang] = item.title
        summaryMap[lang] = summary
      }
      existing[id] = { title: titleMap, summary: summaryMap }
    }
    await writeFile(path.join(dataDir, 'rssTranslations.json'), JSON.stringify(existing, null, 2), 'utf8')

    return NextResponse.json({ ok: true, count: results.length })
  } catch (e) {
    console.error('rss-dump error', e)
    return NextResponse.json({ ok: false, error: 'rss-dump failed' }, { status: 500 })
  }
}

