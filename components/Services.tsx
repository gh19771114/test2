'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Building2, ClipboardCheck, Globe2, TrendingUp, Rocket } from 'lucide-react'
import Link from 'next/link'

const Services = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const services = [
    {
      icon: Building2,
      title: '买卖中介',
      description: '针对住宅、公寓、整栋楼宇及商用物业提供全流程购置与出售服务，助您高效匹配优质项目。',
      features: ['严选投资房源', '一对一顾问陪同', '税务与贷款协调', '交割与法律支持'],
      link: '/maimai'
    },
    {
      icon: ClipboardCheck,
      title: '物业管理',
      description: '面向在日资产及海外业主的托管服务，包括租赁管理、收支统计、内装修缮、税务申报，确保资产稳健运营。',
      features: ['租客筛选与签约', '租金收取与账目透明', '定期巡检与应急维修', '保险与税费协办'],
      link: '/wuye'
    },
    {
      icon: Globe2,
      title: '企业出海助力',
      description: '为有意拓展日本市场的企业提供落地策略、伙伴对接与项目执行支持，快速适配当地商业环境。',
      features: ['市场调研与选址', '合作伙伴对接', '注册与合规办理', '宣传与品牌本地化'],
      link: '/qichu'
    },
    {
      icon: TrendingUp,
      title: '资产投资运营',
      description: 'Bourn Mark 长期持有优质不动产与创新企业股权，展示自有资本运营成果，供业务伙伴了解集团实力。',
      features: ['企业自有资产展示', '长期稳健运营体系', '跨城市投资布局', '不对外提供投资募集'],
      link: '/touzi'
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <section 
      id="services" 
      className="relative section-padding scroll-mt-32"
      style={{
        backgroundColor: '#2d2d2d',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 25%, #3a3a3a 50%, #2d2d2d 75%, #1a1a1a 100%)',
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255, 255, 255, 0.08) 1px, rgba(255, 255, 255, 0.08) 2px), repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255, 255, 255, 0.08) 1px, rgba(255, 255, 255, 0.08) 2px), radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.15) 0%, transparent 40%), linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, transparent 50%)',
        boxShadow: 'inset 0 0 100px rgba(255, 255, 255, 0.15), inset 0 0 200px rgba(255, 255, 255, 0.08), 0 0 40px rgba(0, 0, 0, 0.5)'
      }}
    >
      <div className="container-custom relative z-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-navy-700 mb-4"
          >
            主要业务
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            从选房买卖到资产运营，再到企业落地，我们以一站式服务陪伴您在日本的每一步投资与发展。
          </motion.p>
        </motion.div>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {services.map((service, index) => (
            <Link key={service.title} href={service.link} className="block">
              <motion.div
                variants={itemVariants}
                className="rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2 cursor-pointer h-full"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-navy-100 to-blue-100 rounded-full mb-6 group-hover:from-navy-200 group-hover:to-blue-200 transition-all duration-300 shadow-md">
                    <service.icon className="w-8 h-8 text-navy-700" />
                  </div>
                  <h3 className="text-xl font-semibold text-navy-700 mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                  <ul className="text-sm text-gray-500 space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-navy-400 rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <a
            href="#contact"
            className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2 hover:scale-105 transform transition-all duration-200"
          >
            联系我们预约咨询
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default Services

