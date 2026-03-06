import { NextResponse } from 'next/server'
import { fetchRssItems, screenRssItemsWithPaywall } from '@/lib/newsRss'
import { writeFile } from 'fs/promises'
import path from 'path'

function toId(link: string): string {
  return Buffer.from(link, 'utf-8').toString('base64url')
}

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const maxDuration = 60

export async function GET() {
  const items = await fetchRssItems()
  const screened = await screenRssItemsWithPaywall(items, { maxPaywallChecks: 15 })
  const limited = screened.slice(0, 50)
  const fetchedAt = new Date().toISOString()

  const withId = limited.map((item) => ({ ...item, id: toId(item.link) }))

  try {
    const filePath = path.join(process.cwd(), 'data', 'rssSnapshot.json')
    await writeFile(
      filePath,
      JSON.stringify(
        {
          items: limited,
          fetchedAt,
        },
        null,
        2
      ),
      'utf8'
    )
  } catch (e) {
    console.error('Failed to write RSS snapshot:', e)
  }

  return NextResponse.json({
    items: withId,
    fetchedAt,
  })
}
