import { notFound } from 'next/navigation'
import PageLayout from '@/components/PageLayout'
import { Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { getNewsBySlug, getAllNewsSlugs } from '@/lib/knowledge'
import NewsDetailClient from './NewsDetailClient'

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const news = getNewsBySlug(slug)

  if (!news) {
    notFound()
  }

  return <NewsDetailClient news={news} />
}

// 生成静态路径
export async function generateStaticParams() {
  const slugs = getAllNewsSlugs()
  return slugs.map((slug) => ({
    slug: slug,
  }))
}


