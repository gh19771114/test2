import { NextResponse } from 'next/server'
import { getLatestNews } from '@/lib/knowledge'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/** 最新资讯仅返回静态条目，RSS 与房地产单条已从列表移除 */
export async function GET() {
  const items = getLatestNews()
  return NextResponse.json({ items })
}
