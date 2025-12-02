import PageLayout from '@/components/PageLayout'
import { ArrowLeft, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { encyclopediaEntries } from '@/lib/knowledge'

export default function EncyclopediaListPage() {
  // 按标签分组
  const groupedByTag = encyclopediaEntries.reduce((acc, entry) => {
    if (!acc[entry.tag]) {
      acc[entry.tag] = []
    }
    acc[entry.tag].push(entry)
    return acc
  }, {} as Record<string, typeof encyclopediaEntries>)

  const tags = Object.keys(groupedByTag)

  return (
    <PageLayout>
      <div className="min-h-screen">
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
              <BookOpen className="w-8 h-8 text-green-600" />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900">
                日本房产投资百科
              </h1>
            </div>
            
            <p className="text-lg text-gray-600 max-w-3xl">
              系统解读日本房产投资要点，从基础流程到税务优化，全面掌握投资知识
            </p>
          </div>
        </section>

        {/* 百科列表 */}
        <section className="section-padding">
          <div className="container-custom max-w-5xl">
            <div className="space-y-8">
              {tags.map((tag) => (
                <div key={tag}>
                  <h2 className="text-2xl font-bold text-navy-900 mb-4 pb-2 border-b border-gray-300">
                    {tag}
                  </h2>
                  <div className="space-y-3">
                    {groupedByTag[tag].map((entry) => (
                      <Link
                        key={entry.slug}
                        href={`/encyclopedia/${entry.slug}`}
                        className="block rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 p-6 hover:shadow-lg hover:border-green-300 transition-all duration-200 group"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-navy-900 mb-2 group-hover:text-navy-700 transition-colors">
                              {entry.title}
                            </h3>
                            <span className="inline-flex items-center px-3 py-1 text-xs rounded-full bg-green-50 text-green-700 border border-green-200">
                              {entry.tag}
                            </span>
                          </div>
                          <div className="flex-shrink-0 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowLeft className="w-5 h-5 rotate-180" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
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


