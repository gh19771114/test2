'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { ExternalLink, Play } from 'lucide-react'
import Image from 'next/image'

const Works = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const works = [
    {
      id: 'grand-maison-asakusa-1302',
      title: 'グランドメゾン浅草花川戸1302',
      date: '2025/08/25',
      type: '销售',
      category: '高级公寓',
      image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      description: '成功完成浅草花川戸高级公寓单元的销售交易，为客户提供专业的销售服务。'
    },
    {
      id: 'park-tower-nishishinjuku-101-201',
      title: 'パークタワー西新宿施設棟101、201',
      date: '2025/09/25',
      type: '销售',
      category: '商业设施',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      description: '成功完成西新宿核心地段商业设施两个单元的销售交易。'
    },
    {
      id: 'my-castle-yoyogi-1203',
      title: 'マイキャスル代々木1203',
      date: '2025/05/16',
      type: '销售',
      category: '公寓',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      description: '成功完成代代木地区优质公寓单元的销售交易。'
    },
    {
      id: 'grand-palace-minamiazabu-901',
      title: 'グランパレス南麻布901',
      date: '2025/06/27',
      type: '资产购入',
      category: '高级公寓',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      description: '公司成功购入南麻布地区高端公寓资产。'
    },
    {
      id: 'shinjuku-daikan-plaza-a-201',
      title: '新宿ダイカンプラザA館201',
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
      id: 'xiaomi-japan-consulting',
      title: '小米日本分公司设立咨询服务',
      date: '2024/09/20',
      type: '企业服务',
      category: '企业出海',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      description: '提供市场进入策略与合规咨询，统筹办公选址、品牌本地化及通路合作伙伴对接。'
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
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
    <section id="works" className="relative section-padding scroll-mt-32">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.a
            href="/cases"
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-white mb-4 hover:text-gray-200 transition-colors cursor-pointer inline-block"
          >
            案例展示
          </motion.a>
          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-200 max-w-2xl mx-auto"
          >
            以下是我们已成功完成的真实案例，涵盖房产销售、购入及物业管理等各类业务。
          </motion.p>
        </motion.div>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {works.map((work, index) => (
            <motion.div
              key={work.id}
              variants={itemVariants}
              className="group relative bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              style={{ contentVisibility: index > 5 ? 'auto' : undefined }}
            >
              <Link href={`/cases/${work.id}`}>
                <div className="relative overflow-hidden">
                  <div className="relative w-full h-64">
                    <Image
                      src={work.image}
                      alt={work.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      priority={index < 3} // 只对前3张图片使用优先级加载
                      loading={index < 3 ? undefined : "lazy"} // 后面的图片懒加载
                      quality={75} // 降低图片质量以加快加载
                    />
                  </div>
                  <div className="absolute inset-0 bg-navy-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex space-x-4">
                      <div className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors duration-200">
                        <ExternalLink size={20} />
                      </div>
                    </div>
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
                  <h3 className="text-xl font-semibold text-navy-700 mb-2 group-hover:text-navy-600 transition-colors duration-200">
                    {work.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {work.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <Link
            href="/cases"
            className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2 hover:scale-105 transform transition-all duration-200"
          >
            查看更多案例
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default Works

