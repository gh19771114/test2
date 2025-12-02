import PageLayout from '@/components/PageLayout'
import { Calendar, ArrowLeft, Newspaper } from 'lucide-react'
import Link from 'next/link'
import { latestNews } from '@/lib/knowledge'

export default function NewsListPage() {
  // 按时间排序，最新的在前
  const sortedNews = [...latestNews].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return (
    <PageLayout>
      <div className="min-h-screen">
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
            
            <div className="flex items-center gap-3 mb-4">
              <Newspaper className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900">
                最新资讯
              </h1>
            </div>
            
            <p className="text-lg text-gray-600 max-w-3xl">
              实时关注日本房产市场动态，获取最新投资资讯和政策解读
            </p>
          </div>
        </section>

        {/* 新闻列表 */}
        <section className="section-padding">
          <div className="container-custom max-w-5xl">
            <div className="space-y-4">
              {sortedNews.map((news) => (
                <Link
                  key={news.slug}
                  href={`/news/${news.slug}`}
                  className="block rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 p-6 hover:shadow-lg hover:border-navy-300 transition-all duration-200 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-3 h-3 rounded-full bg-navy-500 mt-2 group-hover:bg-navy-700 transition-colors"></div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-navy-900 mb-2 group-hover:text-navy-700 transition-colors">
                        {news.title}
                      </h2>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <time dateTime={news.date}>{news.date}</time>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-navy-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowLeft className="w-5 h-5 rotate-180" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* 返回按钮 */}
            <div className="mt-12 pt-8 border-t border-gray-300">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-navy-700 hover:text-navy-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>返回首页</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}


