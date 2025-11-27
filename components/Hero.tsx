'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { heroContent } from '@/data/hero'

// 背景视频只在客户端加载
const VideoPlayer = dynamic(() => import('./VideoPlayer'), {
  ssr: false,
})

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.18,
      },
    },
  }

  const lineVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.75,
        ease: [0.33, 1, 0.68, 1],
      },
    },
  }

  const paragraphVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        delay: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <VideoPlayer />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
      </div>

      <div className="relative z-10 w-full">
        <div className="container-custom flex flex-col items-start justify-center min-h-screen py-24">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-3xl"
          >
            <motion.div
              variants={containerVariants}
              className="space-y-6 bg-black/35 md:bg-black/25 backdrop-blur-sm rounded-3xl px-6 py-8 md:px-10 md:py-10 shadow-lg border border-white/10"
            >
              <motion.h1 className="font-display text-left text-4xl md:text-5xl lg:text-6xl font-semibold md:font-bold leading-tight text-white">
                {heroContent.headlineLines.map((line, index) => (
                  <motion.span
                    key={line}
                    variants={lineVariants}
                    className={`block ${
                      index === heroContent.headlineLines.length - 1
                        ? 'text-blue-200/95 tracking-widest mt-1 md:mt-2'
                        : 'text-white/95'
                    }`}
                  >
                    {line}
                  </motion.span>
                ))}
              </motion.h1>

              <motion.p
                variants={paragraphVariants}
                className="text-left text-base md:text-xl text-white/85 leading-relaxed md:leading-relaxed"
              >
                {heroContent.subtext}
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
