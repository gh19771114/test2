import { notFound } from 'next/navigation'
import PageLayout from '@/components/PageLayout'
import { ArrowLeft, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { getEncyclopediaBySlug, getAllEncyclopediaSlugs } from '@/lib/knowledge'
import EncyclopediaContent from '@/components/EncyclopediaContent'
import EncyclopediaDetailClient from './EncyclopediaDetailClient'

export default async function EncyclopediaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const entry = getEncyclopediaBySlug(slug)

  if (!entry) {
    notFound()
  }

  return <EncyclopediaDetailClient entry={entry} />
}

// 生成静态路径
export async function generateStaticParams() {
  const slugs = getAllEncyclopediaSlugs()
  return slugs.map((slug) => ({
    slug: slug,
  }))
}
