import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

export type RssTranslationItem = {
  title: Record<string, string>
  summary: Record<string, string>
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'rssTranslations.json')
    const raw = await readFile(filePath, 'utf8')
    const data = JSON.parse(raw)
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({})
  }
}
