'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import PageLayout from '@/components/PageLayout'
import { Calendar, MapPin, Tag, ChevronLeft, ChevronRight } from 'lucide-react'

// 案例数据
const cases = [
  // 买卖中介
  {
    id: 'grand-maison-asakusa-1302',
    date: '2025/08/25',
    type: '销售',
    categoryGroup: '买卖中介',
    title: 'グランドメゾン浅草花川戸1302',
    location: '东京都台东区浅草',
    category: '高级公寓',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: '成功完成浅草花川戸高级公寓单元的销售交易，为客户提供专业的销售服务。',
  },
  {
    id: 'park-tower-nishishinjuku-101-201',
    date: '2025/09/25',
    type: '销售',
    categoryGroup: '买卖中介',
    title: 'パークタワー西新宿施設棟101、201',
    location: '东京都新宿区西新宿',
    category: '商业设施',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: '成功完成西新宿核心地段商业设施两个单元的销售交易。',
  },
  {
    id: 'my-castle-yoyogi-1203',
    date: '2025/05/16',
    type: '销售',
    categoryGroup: '买卖中介',
    title: 'マイキャスル代々木1203',
    location: '东京都涩谷区代代木',
    category: '公寓',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: '成功完成代代木地区优质公寓单元的销售交易。',
  },
  // 物业管理
  {
    id: 'abc-hall-management',
    date: '2025/10/23',
    type: '管理委托',
    categoryGroup: '物业管理',
    title: 'ABC館管理委托',
    location: '东京都',
    category: '物业管理',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: '成功接受ABC館的物业管理委托，开始提供全方位的资产管理服务。',
  },
  {
    id: 'shibuya-luxury-apartment',
    date: '2024/03/15',
    type: '管理委托',
    categoryGroup: '物业管理',
    title: '东京涩谷高端公寓',
    location: '东京都涩谷区',
    category: '高级公寓',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: '入住率 96%，通过数字化管理系统将维修响应时间缩短至 12 小时内。',
  },
  {
    id: 'yokohama-waterfront-complex',
    date: '2024/06/20',
    type: '管理委托',
    categoryGroup: '物业管理',
    title: '横滨海滨综合体',
    location: '神奈川县横滨市',
    category: '商业综合体',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: '通过分区管理与租客重组，商业租金提升 18%。',
  },
  {
    id: 'nagoya-student-apartment',
    date: '2024/09/10',
    type: '管理委托',
    categoryGroup: '物业管理',
    title: '名古屋学生公寓',
    location: '爱知县名古屋市',
    category: '学生公寓',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: '引入智能门禁与租客社群运营，每年续约率保持在 92%。',
  },
  // 企业出海助力
  {
    id: 'kingsoft-wps-japan',
    date: '2024/11/15',
    type: '企业服务',
    categoryGroup: '企业出海助力',
    title: '金山 WPS 日本子公司设立服务',
    location: '东京都',
    category: '企业出海',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: '协助完成法人登记、签约日本大型不动产公司设立办公室，并搭建本地财务与招聘体系。',
  },
  {
    id: 'xiaomi-japan-consulting',
    date: '2024/09/20',
    type: '企业服务',
    categoryGroup: '企业出海助力',
    title: '小米日本分公司设立咨询服务',
    location: '东京都',
    category: '企业出海',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: '提供市场进入策略与合规咨询，统筹办公选址、品牌本地化及通路合作伙伴对接。',
  },
  // 资产投资
  {
    id: 'grand-palace-minamiazabu-901',
    date: '2025/06/27',
    type: '资产购入',
    categoryGroup: '资产投资',
    title: 'グランパレス南麻布901',
    location: '东京都港区南麻布',
    category: '高级公寓',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: '公司成功购入南麻布地区高端公寓资产。',
  },
  {
    id: 'shinjuku-daikan-plaza-a-201',
    date: '2025/10/23',
    type: '资产购入',
    categoryGroup: '资产投资',
    title: '新宿ダイカンプラザA館201',
    location: '东京都新宿区',
    category: '商业设施',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: '公司成功购入新宿核心商业区商业设施资产。',
  },
]

// 分类配置
const categoryGroups = [
  { id: '买卖中介', name: '买卖中介', order: 1 },
  { id: '物业管理', name: '物业管理', order: 2 },
  { id: '企业出海助力', name: '企业出海助力', order: 3 },
  { id: '资产投资', name: '资产投资', order: 4 },
]

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
  const ref = useRef(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [selectedCategory, setSelectedCategory] = useState<string>('全部案例')

  // 筛选案例
  const filteredCases = selectedCategory === '全部案例' 
    ? cases 
    : cases.filter((caseItem) => caseItem.categoryGroup === selectedCategory)

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
      <div className="relative min-h-screen">
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
            <p className="text-sm text-cyan-300 font-semibold mb-4">Case Studies</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">案例展示</h1>
            <p className="text-lg text-gray-200 max-w-3xl leading-relaxed">
              以下是我们已成功完成的真实案例，涵盖房产销售、购入及物业管理等各类业务，为客户提供专业、高效的服务。
            </p>
          </div>
        </section>

        {/* Filter Menu */}
        <section className="relative section-padding border-b border-gray-200">
          
          <div className="container-custom relative z-10">
            <div className="flex flex-wrap items-center gap-4">
              {['全部案例', '买卖中介', '物业管理', '企业出海助力', '资产投资'].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
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
                aria-label="向左滚动"
              >
                <ChevronLeft size={24} className="text-navy-900" />
              </button>

              {/* 右滚动按钮 */}
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hidden md:flex items-center justify-center"
                aria-label="向右滚动"
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
                      className="group bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex-shrink-0"
                      style={{ width: '380px' }}
                    >
                      <Link href={`/cases/${caseItem.id}`}>
                        <div className="relative overflow-hidden">
                          <div className="relative w-full h-64">
                            <Image
                              src={caseItem.image}
                              alt={caseItem.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              sizes="380px"
                            />
                          </div>
                          <div className="absolute top-4 right-4">
                            <span className="bg-blue-600 text-navy-900 px-3 py-1 rounded-full text-sm font-medium">
                              {caseItem.type}
                            </span>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                            <Calendar size={16} />
                            <span>{caseItem.date}</span>
                          </div>
                          <h3 className="text-xl font-semibold text-navy-900 mb-2 group-hover:text-navy-600 transition-colors duration-200">
                            {caseItem.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-700 mb-3">
                            <MapPin size={16} />
                            <span>{caseItem.location}</span>
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                            {caseItem.description}
                          </p>
                        </div>
                      </Link>
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

