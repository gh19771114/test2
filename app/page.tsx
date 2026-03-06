// app/page.tsx

import dynamic from 'next/dynamic'
import PageLayout from '@/components/PageLayout'
import Hero from '@/components/Hero'
import Insights from '@/components/Insights'
import Contact from '@/components/Contact'

// 动态导入，延迟加载非关键组件
const Services = dynamic(() => import('@/components/Services'), {
  loading: () => <div className="min-h-[600px]" />, // 占位符，避免布局跳动
  ssr: true
})

const Works = dynamic(() => import('@/components/Works'), {
  loading: () => <div className="min-h-[600px]" />, // 占位符，避免布局跳动
  ssr: true
})

// 首页 WebPage 结构化数据：明确关联 Organization，利于「搜电话号码找到公司官网」
const homepageWebPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://bournmark.com/#webpage',
  url: 'https://bournmark.com',
  name: '株式会社ボーンマーク Bourn Mark - 日本不动产买卖与物业管理',
  mainEntity: { '@id': 'https://bournmark.com/#organization' },
}

export default function Home() {
  return (
    <PageLayout>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageWebPageJsonLd) }}
      />
      <Hero />
      <Insights />
      <Services />
      <Works />
      <Contact />
    </PageLayout>
  )
}