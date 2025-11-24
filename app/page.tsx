import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import FloatingActions from '@/components/FloatingActions'

// 使用动态导入优化性能，禁用SSR避免重复加载
const Insights = dynamic(() => import('@/components/Insights'), {
  ssr: false,
  loading: () => <div className="section-padding text-center text-gray-500 min-h-[300px] flex items-center justify-center">正在加载资讯...</div>
})
const Services = dynamic(() => import('@/components/Services'), { 
  ssr: false,
  loading: () => <div className="section-padding text-center text-gray-500 min-h-[400px] flex items-center justify-center">加载中...</div> 
})
const Works = dynamic(() => import('@/components/Works'), { 
  ssr: false,
  loading: () => <div className="section-padding text-center text-gray-500 min-h-[400px] flex items-center justify-center">加载中...</div> 
})
const Contact = dynamic(() => import('@/components/Contact'), { 
  ssr: false,
  loading: () => <div className="section-padding text-center text-gray-500 min-h-[400px] flex items-center justify-center">加载中...</div> 
})
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false })

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Insights />
      <Services />
      <Works />
      <Contact />
      <Footer />
      <FloatingActions />
    </main>
  )
}
