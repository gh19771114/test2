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

export default function Home() {
  return (
    <PageLayout>
      <Hero />
      <Insights />
      <Services />
      <Works />
      <Contact />
    </PageLayout>
  )
}
