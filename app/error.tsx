'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import PageLayout from '@/components/PageLayout'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <PageLayout>
      <div className="container-custom py-20 text-center">
        <h1 className="text-3xl font-bold text-navy-900 mb-4">出现错误</h1>
        <p className="text-gray-700 mb-6">抱歉，页面加载时出现了问题。</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="btn-primary"
          >
            重试
          </button>
          <Link href="/" className="btn-secondary">
            返回首页
          </Link>
        </div>
      </div>
    </PageLayout>
  )
}







