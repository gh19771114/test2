'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { encyclopediaEntries, latestNews } from '@/lib/knowledge'
import Image from 'next/image'
import Link from 'next/link'

const Insights = () => {
  const newsList = useMemo(() => latestNews, [])
  const encyclopedia = useMemo(() => encyclopediaEntries, [])

  const blockVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section className="relative section-padding">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            variants={blockVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="rounded-3xl bg-gradient-to-br from-white/80 via-white/80 to-gray-100/80 backdrop-blur-sm shadow-xl border border-gray-100 p-8 flex flex-col"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2 md:gap-0">
              <h3 className="text-2xl font-bold text-navy-700 whitespace-nowrap">最新资讯</h3>
              <span className="text-sm text-gray-500">实时关注日本房产动态</span>
            </div>
            <div className="relative overflow-y-auto rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" style={{ maxHeight: '400px' }}>
              <div className="animate-vertical-scroll hover:[animation-play-state:paused]">
                {[...newsList, ...newsList].map((item, index) => (
                  <Link
                    key={`${item.title}-${index}`}
                    href={`/news/${item.slug}`}
                    className="flex items-start gap-3 px-6 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <span className="mt-1 h-2 w-2 rounded-full bg-navy-500 flex-shrink-0"></span>
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium hover:text-navy-700 transition-colors">{item.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={blockVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="rounded-3xl bg-gradient-to-br from-white/80 via-white/80 to-gray-100/80 backdrop-blur-sm shadow-xl border border-gray-100 p-8 flex flex-col"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2 md:gap-0">
              <h3 className="text-2xl font-bold text-navy-700 whitespace-nowrap">日本房产投资百科</h3>
              <span className="text-sm text-gray-500">系统解读投资要点</span>
            </div>
            <div className="relative overflow-y-auto rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" style={{ maxHeight: '400px' }}>
              <div className="animate-vertical-scroll hover:[animation-play-state:paused]">
                {[...encyclopedia, ...encyclopedia].map((item, index) => (
                  <Link
                    key={`${item.title}-${index}`}
                    href={`/encyclopedia/${item.slug}`}
                    className="block px-6 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <p className="text-gray-800 font-medium mb-1 hover:text-navy-700 transition-colors">{item.title}</p>
                    <span className="inline-flex items-center px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                      {item.tag}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Insights

