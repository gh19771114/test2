import { NextResponse } from 'next/server'
import { fetchRssItems } from '@/lib/newsRss'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const items = await fetchRssItems()
  return NextResponse.json({
    items: items.slice(0, 80),
    fetchedAt: new Date().toISOString(),
  })
}
