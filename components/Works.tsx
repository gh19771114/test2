'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ExternalLink, Play } from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'

const Works = () => {
  const { t } = useLanguage()
  const [visibleCount, setVisibleCount] = useState(6) // 初始只显示6个案例

  // 使用 useMemo 缓存数据，避免每次渲染都重新创建
  const works = useMemo(() => [
    {
      id: 'grand-maison-asakusa-1302',
      title: 'グランドメゾン浅草花川戸13楼',
      date: '2025/08/25',
      type: '销售',
      category: '高级公寓',
      image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      description: '成功完成浅草花川戸高级公寓单元的销售交易，为客户提供专业的销售服务。'
    },
    {
      id: 'park-tower-nishishinjuku-101-201',
      title: 'パークタワー西新宿施設棟1楼',
      date: '2025/09/25',
      type: '销售',
      category: '商业设施',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      description: '成功完成西新宿核心地段商业设施两个单元的销售交易。'
    },
    {
      id: 'my-castle-yoyogi-1203',
      title: 'マイキャスル代々木12楼',
      date: '2025/05/16',
      type: '销售',
      category: '公寓',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      description: '成功完成代代木地区优质公寓单元的销售交易。'
    },
    {
      id: 'shinjuku-daikan-plaza-a-201',
      title: '新宿ダイカンプラザA館2楼',
      date: '2025/10/23',
      type: '资产购入',
      category: '商业设施',
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      description: '公司成功购入新宿核心商业区商业设施资产。'
    },
    {
      id: 'abc-hall-management',
      title: 'ABC館管理委托',
      date: '2025/10/23',
      type: '管理委托',
      category: '物业管理',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      description: '成功接受ABC館的物业管理委托，开始提供全方位的资产管理服务。'
    },
    {
      id: 'kingsoft-wps-japan',
      title: '金山 WPS 日本子公司设立服务',
      date: '2024/11/15',
      type: '企业服务',
      category: '企业出海',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      description: '协助完成法人登记、签约日本大型不动产公司设立办公室，并搭建本地财务与招聘体系。'
    },
    {
      id: 'shibuya-luxury-apartment',
      title: '东京涩谷高端公寓',
      date: '2024/03/15',
      type: '管理委托',
      category: '高级公寓',
      image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      description: '入住率 96%，通过数字化管理系统将维修响应时间缩短至 12 小时内。'
    },
    {
      id: 'yokohama-waterfront-complex',
      title: '横滨海滨综合体',
      date: '2024/06/20',
      type: '管理委托',
      category: '商业综合体',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      description: '通过分区管理与租客重组，商业租金提升 18%。'
    },
    {
      id: 'nagoya-student-apartment',
      title: '名古屋学生公寓',
      date: '2024/09/10',
      type: '管理委托',
      category: '学生公寓',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      description: '引入智能门禁与租客社群运营，每年续约率保持在 92%。'
    }
  ], [])

  // 首页只显示6个案例，不再滚动加载更多

  // 只渲染可见的案例
  const visibleWorks = useMemo(() => works.slice(0, visibleCount), [works, visibleCount])

  return (
    <section id="works" className="relative section-padding scroll-mt-32">
      <div className="container-custom">
        <div className="text-center mb-16">
          <Link
            href="/cases"
            className="text-3xl md:text-4xl font-bold text-white mb-4 hover:text-gray-200 transition-colors cursor-pointer inline-block"
            suppressHydrationWarning
          >
            {t('home.works.title')}
          </Link>
          <p 
            className="text-lg text-gray-200 max-w-2xl mx-auto"
            suppressHydrationWarning
          >
            {t('home.works.subtitle')}
          </p>
        </div>

        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleWorks.map((work, index) => (
            <div
              key={work.id}
              className="group relative bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg"
            >
              <div className="relative overflow-hidden">
                <div className="relative w-full h-64">
                  <Image
                    src={work.image}
                    alt={work.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    priority={index < 3} // 只对前3张图片使用优先级加载
                    loading={index < 3 ? undefined : "lazy"} // 后面的图片懒加载
                    quality={75} // 优化图片质量
                  />
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-navy-700 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {work.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {work.type}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <span>{work.date}</span>
                </div>
                <h3 className="text-xl font-semibold text-navy-700 mb-2">
                  {work.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {work.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 移动端：横向滑动形式 */}
        <div className="md:hidden overflow-x-auto pb-4 scrollbar-hide" style={{ 
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch'
        }}>
          <div className="flex gap-4 px-4" style={{ minWidth: 'max-content' }}>
            {visibleWorks.map((work, index) => (
              <div
                key={work.id}
                className="flex-shrink-0 w-[320px]"
                style={{ scrollSnapAlign: 'center' }}
              >
                <div className="group relative bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg h-full">
                  <div className="relative overflow-hidden">
                    <div className="relative w-full h-48">
                      <Image
                        src={work.image}
                        alt={work.title}
                        fill
                        className="object-cover"
                        sizes="320px"
                        loading={index < 3 ? undefined : "lazy"}
                        quality={75}
                      />
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-navy-700 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {work.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {work.type}
                      </span>
                    </div>
                  </div>
                  
                  <div className="md:p-6" style={{ padding: '0.125rem' }}>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <span>{work.date}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-navy-700 mb-2 line-clamp-2">
                      {work.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {work.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <Link
            href="/cases"
            className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2 hover:scale-105 transform transition-all duration-200"
            suppressHydrationWarning
          >
            {t('home.works.viewMore')}
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Works

