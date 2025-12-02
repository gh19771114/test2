import { notFound } from 'next/navigation'
import PageLayout from '@/components/PageLayout'
import { ArrowLeft, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { getEncyclopediaBySlug, getAllEncyclopediaSlugs } from '@/lib/knowledge'
import EncyclopediaContent from '@/components/EncyclopediaContent'

export default async function EncyclopediaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const entry = getEncyclopediaBySlug(slug)

  if (!entry) {
    notFound()
  }

  return (
    <PageLayout>
      <article className="min-h-screen">
        {/* 头部 */}
        <section className="relative pt-28 pb-16 bg-gradient-to-br from-green-50 to-white">
          <div className="container-custom">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-navy-700 hover:text-navy-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回首页</span>
            </Link>
            
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-5 h-5 text-green-600" />
              <span className="inline-flex items-center px-3 py-1 text-sm rounded-full bg-green-100 text-green-700 border border-green-200">
                {entry.tag}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 mb-6">
              {entry.title}
            </h1>
          </div>
        </section>

        {/* 内容 */}
        <section className="section-padding">
          <div className="container-custom max-w-4xl">
            <EncyclopediaContent 
              content={entry.content} 
              charts={entry.charts as any}
            />

            {/* 返回按钮 */}
            <div className="mt-12 pt-8 border-t border-gray-400">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-gray-200 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>返回首页</span>
              </Link>
            </div>
          </div>
        </section>
      </article>
    </PageLayout>
  )
}

// 生成静态路径
export async function generateStaticParams() {
  const slugs = getAllEncyclopediaSlugs()
  return slugs.map((slug) => ({
    slug: slug,
  }))
}
