import { notFound } from 'next/navigation'
import PageLayout from '@/components/PageLayout'
import { Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { getNewsBySlug, getAllNewsSlugs } from '@/lib/knowledge'

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const news = getNewsBySlug(slug)

  if (!news) {
    notFound()
  }

  return (
    <PageLayout>
      <article className="min-h-screen">
        {/* 头部 */}
        <section className="relative pt-28 pb-16 bg-gradient-to-br from-blue-50 to-white">
          <div className="container-custom">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-navy-700 hover:text-navy-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回首页</span>
            </Link>
            
            <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
              <Calendar className="w-4 h-4" />
              <time dateTime={news.date}>{news.date}</time>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 mb-6">
              {news.title}
            </h1>
          </div>
        </section>

        {/* 内容 */}
        <section className="section-padding">
          <div className="container-custom max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-200 leading-relaxed whitespace-pre-line text-lg md:text-xl">
                {news.content}
              </div>
            </div>

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
  const slugs = getAllNewsSlugs()
  return slugs.map((slug) => ({
    slug: slug,
  }))
}
