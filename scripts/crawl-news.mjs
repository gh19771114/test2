#!/usr/bin/env node
/**
 * 一键完成：第一步（抓取列表）+ 第二步（抓正文并概括）+ 第四步（自动翻译多语言）
 * 使用前请先在本机启动开发服务器：pnpm run dev
 * 然后执行：pnpm run crawl-news  或  node scripts/crawl-news.mjs
 */

import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BASE = process.env.CRAWL_BASE_URL || 'http://localhost:3000'
const DATA_DIR = path.join(__dirname, '..', 'data')
const DELAY_MS = 1100
const TARGET_LANGS = ['zh', 'en', 'zh-TW', 'zh-HK']

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function toMyMemoryLang(lang) {
  if (lang === 'zh' || lang === 'zh-CN') return 'zh'
  if (lang === 'zh-TW' || lang === 'zh-HK') return 'zh-TW'
  return lang
}

async function translate(text, fromLang, toLang) {
  const t = (text || '').trim()
  if (!t || fromLang === toLang) return t
  const target = toMyMemoryLang(toLang)
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(t)}&langpair=${fromLang}|${target}`
    const res = await fetch(url)
    if (!res.ok) return t
    const data = await res.json()
    const out = data?.responseData?.translatedText?.trim()
    return out || t
  } catch {
    return t
  }
}

async function main() {
  console.log('正在执行第一步：抓取近三个月日本房地产新闻列表…')
  const res1 = await fetch(`${BASE}/api/news/google-rss-screened`)
  if (!res1.ok) {
    console.error('第一步失败:', res1.status, res1.statusText)
    process.exit(1)
  }
  const data1 = await res1.json()
  const count1 = data1.items?.length ?? 0
  console.log('第一步完成，共', count1, '条。写入 data/rssSnapshot.json')

  console.log('等待 2 秒后执行第二步…')
  await sleep(2000)

  console.log('正在执行第二步：逐条抓正文并概括、写入多语言种子…')
  const res2 = await fetch(`${BASE}/api/news/rss-dump`)
  if (!res2.ok) {
    console.error('第二步失败:', res2.status, res2.statusText)
    process.exit(1)
  }
  const data2 = await res2.json()
  const count2 = data2.count ?? 0
  console.log('第二步完成，处理', count2, '条。')

  console.log('正在执行第四步：自动翻译为简中、英、繁中（台/港）…')
  const filePath = path.join(DATA_DIR, 'rssTranslations.json')
  let trans
  try {
    trans = JSON.parse(await readFile(filePath, 'utf8'))
  } catch (e) {
    console.warn('无法读取 rssTranslations.json，跳过第四步。', e.message)
    trans = {}
  }
  const ids = Object.keys(trans)
  let done = 0
  for (const id of ids) {
    const item = trans[id]
    if (!item || !item.title || !item.summary) continue
    const titleJa = (item.title.ja || item.title.en || Object.values(item.title)[0] || '').trim()
    const summaryJa = (item.summary.ja || item.summary.en || Object.values(item.summary)[0] || '').trim()
    for (const lang of TARGET_LANGS) {
      if (titleJa) {
        item.title[lang] = await translate(titleJa, 'ja', lang)
        await sleep(DELAY_MS)
      }
      if (summaryJa && summaryJa.length > 5) {
        item.summary[lang] = await translate(summaryJa, 'ja', lang)
        await sleep(DELAY_MS)
      }
    }
    trans[id] = item
    done++
    if (done % 5 === 0) console.log('  已翻译', done, '/', ids.length, '条')
  }
  await writeFile(filePath, JSON.stringify(trans, null, 2), 'utf8')
  console.log('第四步完成，已更新 data/rssTranslations.json。')

  console.log('')
  console.log('第三步（列表与详情页）已自动使用上述数据，打开站点「最新资讯」即可查看。')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
