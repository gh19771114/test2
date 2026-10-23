import { notFound, redirect } from 'next/navigation'
import { getNewsBySlug, getAllNewsSlugs } from '@/lib/knowledge'
import NewsDetailClient from './NewsDetailClient'

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const news = getNewsBySlug(slug)
  if (!news) notFound()
  if (news.href) redirect(news.href)
  return <NewsDetailClient news={news} />
}

export async function generateStaticParams() {
  const slugs = getAllNewsSlugs()
  return slugs.map((slug) => ({ slug }))
}


