'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { Heart, Target, Users, Award } from 'lucide-react'

const Philosophy = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const values = [
    {
      icon: Users,
      title: '中日桥梁',
      description: '根植日本、服务华语市场，搭建中日企业与投资者之间透明顺畅的沟通与合作渠道。',
    },
    {
      icon: Target,
      title: '城市更新',
      description: '关注城市更新与资产运营价值，用精细化管理推动社区与资产的长期成长。',
    },
    {
      icon: Heart,
      title: '诚信专业',
      description: '以诚信、合规与专业判断为底线，长期守护客户与伙伴的信任与成果。',
    },
    {
      icon: Award,
      title: '资源整合',
      description: '跨文化、跨领域整合多方资源，推动中日企业交流合作与创新业务的共同发展。',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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

  return (
    <section id="philosophy" className="relative section-padding scroll-mt-32">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-6 text-navy-900 drop-shadow-sm inline-block bg-white/90 px-6 py-3 rounded-lg shadow-md">
            我们的理念
          </motion.h2>
          <motion.div variants={itemVariants} className="max-w-4xl mx-auto bg-white/95 rounded-2xl p-8 md:p-10 shadow-xl border border-gray-100">
            <p className="text-lg md:text-xl text-slate-700 leading-relaxed mb-8 text-balance">
              我们深耕日本市场，致力于用专业与诚信搭建中日合作的桥梁。从不动产到企业投资，我们坚持以长期价值为导向，将城市更新、资产运营与商务整合紧密结合，为客户与伙伴创造可持续的成长空间。
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto"></div>
          </motion.div>
        </motion.div>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {values.map((value) => (
            <motion.div
              key={value.title}
              variants={itemVariants}
              className="text-center group bg-white rounded-2xl p-8 border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 text-navy-800 rounded-full mb-6 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <value.icon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-navy-900">{value.title}</h3>
              <p className="text-slate-800 leading-relaxed text-balance font-medium">{value.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16"
        >
          <div className="bg-white text-navy-900 rounded-2xl p-8 md:p-12 shadow-2xl border border-blue-100 space-y-6 text-center mx-auto max-w-4xl">
            <h3 className="text-2xl md:text-3xl font-bold">我们的使命</h3>
            <p className="text-lg leading-relaxed text-slate-700 text-balance">
              「通过跨文化协作，让中日商务与不动产服务互相成就。」我们以透明沟通、专业判断与数字化管理，帮助客户稳健拓展在日业务，同时推动合作伙伴在新生态中实现价值递增。
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="bg-blue-50 rounded-xl px-5 py-4 border border-blue-100 shadow-sm">
                <p className="font-semibold text-navy-800 mb-2">长期价值</p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  审慎配置资产、强化风险控制，以可持续收益与品牌影响力回应客户期待。
                </p>
              </div>
              <div className="bg-purple-50 rounded-xl px-5 py-4 border border-purple-100 shadow-sm">
                <p className="font-semibold text-navy-800 mb-2">协同网络</p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  整合金融、法律、政府与行业伙伴资源，打造开放共享的跨境服务平台。
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Philosophy

