'use client'

import PageLayout from '@/components/PageLayout'
import Image from 'next/image'
import { Youtube, Video, ExternalLink } from 'lucide-react'

const snsPlatforms = [
  {
    name: 'YouTube',
    icon: Youtube,
    color: 'bg-[#FF0000]',
    href: '#',
    embedUrl: '',
    description: '观看我们的YouTube视频内容',
  },
  {
    name: '抖音',
    icon: Video,
    color: 'bg-gradient-to-br from-gray-900 via-black to-[#050505]',
    href: '#',
    embedUrl: '',
    description: '浏览我们的抖音视频',
  },
  {
    name: '小红书',
    icon: Video,
    color: 'bg-[#FF2442]',
    href: '#',
    embedUrl: '',
    description: '查看我们的小红书内容',
  },
  {
    name: '微信视频号',
    icon: Video,
    color: 'bg-[#07C160]',
    href: '#',
    embedUrl: '',
    description: '关注我们的微信视频号',
  },
  {
    name: 'Line Voom',
    icon: Video,
    color: 'bg-[#00B900]',
    href: '#',
    embedUrl: '',
    description: '查看我们的Line Voom视频',
  },
  {
    name: 'Facebook',
    icon: Video,
    color: 'bg-[#1877F2]',
    href: '#',
    embedUrl: '',
    description: '浏览我们的Facebook视频',
  },
]

export default function CompanySNSPage() {
  return (
    <PageLayout>
      <section className="relative pt-28 pb-16 bg-gradient-to-br from-pink-800 via-pink-700 to-navy-800 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="企业SNS"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-pink-900/80 to-navy-900/60"></div>
        </div>
        <div className="relative z-10 container-custom">
          <p className="text-sm text-pink-300 font-semibold mb-4">Company SNS</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">企业SNS</h1>
          <p className="text-lg text-gray-200 max-w-3xl leading-relaxed">
            关注我们的社交媒体平台，获取最新的企业动态、行业资讯和视频内容。
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          {/* 视频播放区域 */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">最新视频</h2>
            <div className="max-w-4xl mx-auto">
              <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="企业视频"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              </div>
              <p className="text-center text-gray-200 mt-4 text-sm">
                点击播放按钮观看我们的最新视频内容
              </p>
            </div>
          </div>

          {/* 社交媒体平台 */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">关注我们的社交媒体</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {snsPlatforms.map((platform) => {
              const Icon = platform.icon
              return (
                <a
                  key={platform.name}
                  href={platform.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-20 h-20 ${platform.color} rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-navy-900 mb-2">{platform.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{platform.description}</p>
                    <div className="flex items-center gap-2 text-blue-600 font-medium group-hover:text-blue-700">
                      <span>访问平台</span>
                      <ExternalLink size={16} />
                    </div>
                  </div>
                </a>
              )
            })}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

