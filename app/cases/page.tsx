'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import PageLayout from '@/components/PageLayout'
import { Calendar, MapPin, Tag, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { caseIds, caseDates, caseImages, caseCategoryGroups } from '@/lib/casesData'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
}

export default function CasesPage() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // 构建案例数据（使用翻译）
  const cases = useMemo(() => {
    return caseIds.map((id) => {
      const detail = t(`cases.details.${id}`, { returnObjects: true }) as any
      return {
        id,
        date: caseDates[id],
        type: detail?.type || '',
        categoryGroup: caseCategoryGroups[id],
        title: detail?.title || '',
        location: detail?.location || '',
        category: detail?.category || '',
        image: caseImages[id],
        description: detail?.description || '',
      }
    })
  }, [t])

  // 筛选案例
  const filteredCases = useMemo(() => {
    if (selectedCategory === 'all') {
      return cases
    }
    return cases.filter((caseItem) => caseItem.categoryGroup === selectedCategory)
  }, [cases, selectedCategory])

  // 滚动函数
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <PageLayout>
        <div className="relative min-h-screen cases-page">
          {/* Hero Section */}
        <section className="relative pt-28 pb-16 bg-gradient-to-br from-cyan-800 via-cyan-700 to-navy-800 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="案例展示"
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/80 to-navy-900/60"></div>
          </div>
          <div className="relative z-10 container-custom">
            <p className="text-sm text-cyan-300 font-semibold mb-4 drop-shadow-md">Case Studies</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 drop-shadow-lg">{t('cases.page.title')}</h1>
            <p className="text-lg text-gray-200 max-w-3xl leading-relaxed drop-shadow-md">
              {t('cases.page.subtitle')}
            </p>
          </div>
        </section>

        {/* Filter Menu */}
        <section className="relative section-padding border-b border-gray-200">
          
          <div className="container-custom relative z-10">
            <div className="flex flex-wrap items-center gap-4">
              {[
                { id: 'all', key: 'all' },
                { id: 'maimai', key: 'maimai' },
                { id: 'wuye', key: 'wuye' },
                { id: 'qichu', key: 'qichu' },
                { id: 'touzi', key: 'touzi' },
              ].map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t(`cases.page.filters.${category.key}`)}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Horizontal Scrolling Cases */}
        <section className="relative section-padding">
          <div className="container-custom relative z-10">
            <div className="relative">
              {/* 左滚动按钮 */}
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hidden md:flex items-center justify-center"
                aria-label={t('cases.page.scrollLeft')}
              >
                <ChevronLeft size={24} className="text-navy-900" />
              </button>

              {/* 右滚动按钮 */}
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hidden md:flex items-center justify-center"
                aria-label={t('cases.page.scrollRight')}
              >
                <ChevronRight size={24} className="text-navy-900" />
              </button>

              {/* 横向滚动容器 */}
              <div
                ref={scrollRef}
                className="overflow-x-auto scroll-smooth pb-4 scrollbar-hide"
              >
                <motion.div
                  ref={ref}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                  variants={containerVariants}
                  className="flex gap-6 min-w-max"
                  style={{ width: 'max-content' }}
                >
                  {filteredCases.map((caseItem) => (
                    <motion.div
                      key={caseItem.id}
                      variants={itemVariants}
                      className="group bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg flex-shrink-0 cases-card"
                      style={{ width: '380px' }}
                    >
                      <div className="relative overflow-hidden">
                        <div className="relative w-full h-64 cases-card-media">
                          <Image
                            src={caseItem.image}
                            alt={caseItem.title}
                            fill
                            className="object-cover"
                            sizes="380px"
                            unoptimized={caseItem.image.startsWith('/imgs/')}
                          />
                        </div>
                        <div className="absolute top-4 right-4">
                          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {caseItem.type}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 cases-card-body">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3 cases-card-meta">
                          <Calendar size={16} />
                          <span>{caseItem.date}</span>
                        </div>
                        <Link href={`/cases/${caseItem.id}`}>
                          <h3 className="text-xl font-semibold text-navy-900 mb-2 hover:text-blue-600 transition-colors cases-card-title">
                            {caseItem.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-2 text-sm text-gray-700 mb-3 cases-card-location">
                          <MapPin size={16} />
                          <span>{caseItem.location}</span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed line-clamp-2 cases-card-desc">
                          {caseItem.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </section>
        </div>
    </PageLayout>
  )
}

