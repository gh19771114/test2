import { NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'

const LANGS = ['zh', 'zh-TW', 'zh-HK', 'ja', 'en'] as const
const SUMMARY_MAX = 280

function toId(link: string): string {
  return Buffer.from(link, 'utf-8').toString('base64url')
}

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'data')
    let items: { title: string; link: string; text?: string }[] = []

    try {
      const articlesPath = path.join(dataDir, 'rssArticles.json')
      const raw = await readFile(articlesPath, 'utf8')
      const data = JSON.parse(raw)
      items = (data.items ?? []).map((i: { title: string; link: string; text?: string }) => ({
        title: i.title ?? '',
        link: i.link ?? '',
        text: typeof i.text === 'string' ? i.text : '',
      }))
    } catch {
      try {
        const snapPath = path.join(dataDir, 'rssSnapshot.json')
        const raw = await readFile(snapPath, 'utf8')
        const snap = JSON.parse(raw)
        items = (snap.items ?? []).map((i: { title: string; link: string }) => ({
          title: i.title ?? '',
          link: i.link ?? '',
          text: '',
        }))
      } catch {
        return NextResponse.json({ ok: false, error: 'no rssArticles.json or rssSnapshot.json' }, { status: 400 })
      }
    }

    const translations: Record<string, { title: Record<string, string>; summary: Record<string, string> }> = {}
    for (const item of items) {
      const id = toId(item.link)
      const summary = (item.text ?? '').slice(0, SUMMARY_MAX).trim()
      const titleMap: Record<string, string> = {}
      const summaryMap: Record<string, string> = {}
      for (const lang of LANGS) {
        titleMap[lang] = item.title
        summaryMap[lang] = summary
      }
      translations[id] = { title: titleMap, summary: summaryMap }
    }

    const outPath = path.join(dataDir, 'rssTranslations.json')
    await writeFile(outPath, JSON.stringify(translations, null, 2), 'utf8')
    return NextResponse.json({ ok: true, count: Object.keys(translations).length })
  } catch (e) {
    console.error('rss-seed-translations error', e)
    return NextResponse.json({ ok: false, error: 'seed failed' }, { status: 500 })
  }
}
