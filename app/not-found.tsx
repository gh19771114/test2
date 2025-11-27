import Link from 'next/link'
import PageLayout from '@/components/PageLayout'

export default function NotFound() {
  return (
    <PageLayout>
      <div className="container-custom py-20 text-center">
        <h1 className="text-3xl font-bold text-navy-900 mb-4">页面未找到</h1>
        <p className="text-gray-700 mb-6">抱歉，您访问的页面不存在。</p>
        <Link href="/" className="btn-primary inline-flex items-center gap-2">
          返回首页
        </Link>
      </div>
    </PageLayout>
  )
}







