'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { encyclopediaEntries, latestNews } from '@/lib/knowledge'
import Image from 'next/image'

const Insights = () => {
  const newsList = useMemo(() => latestNews, [])
  const encyclopedia = useMemo(() => encyclopediaEntries, [])

  const blockVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section className="relative section-padding">
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="资讯背景"
          fill
          className="object-cover"
          priority={false}
        />
        <div className="absolute inset-0 bg-navy-900/80 backdrop-blur-sm" />
      </div>
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            variants={blockVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="rounded-3xl bg-gradient-to-br from-white via-white to-gray-100 shadow-xl border border-gray-100 p-8 flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-navy-700">最新资讯</h3>
              <span className="text-sm text-gray-500">实时关注日本房产动态</span>
            </div>
            <div className="relative overflow-y-auto rounded-2xl border border-gray-100 bg-white flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" style={{ maxHeight: '400px' }}>
              <div className="animate-vertical-scroll hover:[animation-play-state:paused]">
                {[...newsList, ...newsList].map((item, index) => (
                  <div key={`${item.title}-${index}`} className="flex items-start gap-3 px-6 py-4 border-b border-gray-50">
                    <span className="mt-1 h-2 w-2 rounded-full bg-navy-500"></span>
                    <div>
                      <p className="text-gray-800 font-medium">{item.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={blockVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="rounded-3xl bg-gradient-to-br from-white via-white to-gray-100 shadow-xl border border-gray-100 p-8 flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-navy-700">日本房产投资百科</h3>
              <span className="text-sm text-gray-500">系统解读投资要点</span>
            </div>
            <div className="relative overflow-y-auto rounded-2xl border border-gray-100 bg-white flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" style={{ maxHeight: '400px' }}>
              <div className="animate-vertical-scroll hover:[animation-play-state:paused]">
                {[...encyclopedia, ...encyclopedia].map((item, index) => (
                  <div key={`${item.title}-${index}`} className="px-6 py-4 border-b border-gray-50">
                    <p className="text-gray-800 font-medium mb-1">{item.title}</p>
                    <span className="inline-flex items-center px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                      {item.tag}
                    </span>
                  </div>
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


