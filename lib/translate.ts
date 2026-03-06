/**
 * 免费翻译（MyMemory，无需 API Key；有每日字数限制）
 * 用于 RSS 新闻标题与摘要的多语言填充
 */

const MYMEMORY_BASE = 'https://api.mymemory.translated.net/get'
const DELAY_MS = 1200

const langPair: Record<string, string> = {
  zh: 'zh',
  'zh-TW': 'zh-TW',
  'zh-HK': 'zh-HK',
  en: 'en',
  ja: 'ja',
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

/** 将日文（或原文）翻译成目标语言，失败时返回原文 */
export async function translateText(
  text: string,
  fromLang: string,
  toLang: string
): Promise<string> {
  const t = (text || '').trim()
  if (!t || fromLang === toLang) return t

  const from = langPair[fromLang] || fromLang
  const to = langPair[toLang] || toLang
  if (from === to) return t

  try {
    const url = `${MYMEMORY_BASE}?q=${encodeURIComponent(t)}&langpair=${from}|${to}`
    const res = await fetch(url, { next: { revalidate: 0 } })
    if (!res.ok) return t
    const data = (await res.json()) as { responseData?: { translatedText?: string } }
    const out = data.responseData?.translatedText?.trim()
    return out || t
  } catch {
    return t
  }
}

/** 带延时的批量翻译，避免触发限流 */
export async function translateWithDelay(
  text: string,
  fromLang: string,
  toLang: string
): Promise<string> {
  const result = await translateText(text, fromLang, toLang)
  await sleep(DELAY_MS)
  return result
}
