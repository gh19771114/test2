import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/** RSS 新闻详情已从最新资讯移除，统一返回 404 */
export default async function RssNewsPage() {
  notFound()
}
