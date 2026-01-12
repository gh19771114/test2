'use client'

import { useState, useEffect, useRef, ReactNode } from 'react'

interface ResponsiveScaleWrapperProps {
  children: ReactNode
  baseWidth?: number
  minScale?: number
  enableMobile?: boolean
  className?: string
}

/**
 * 响应式缩放包装组件
 * 根据屏幕宽度计算缩放比例，确保内容在不同设备上完整呈现
 */
export default function ResponsiveScaleWrapper({
  children,
  baseWidth = 1280,
  minScale = 0.5,
  enableMobile = false,
  className = ''
}: ResponsiveScaleWrapperProps) {
  const [scale, setScale] = useState<number>(1)
  const [windowWidth, setWindowWidth] = useState<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const calculateScale = () => {
      if (typeof window === 'undefined') return

      const width = window.innerWidth
      setWindowWidth(width)

      // 移动端（< 640px）不使用缩放，使用正常响应式布局
      if (!enableMobile && width < 640) {
        setScale(1)
        return
      }

      // 根据不同屏幕尺寸设置缩放比例
      let newScale = 1
      if (width < 640) {
        // 手机竖屏 (< 640px)
        newScale = enableMobile ? Math.max(width / baseWidth, minScale) : 1
      } else if (width < 768) {
        // 手机横屏 / 小平板 (640px - 768px)
        const availableWidth = width - 64 // 考虑padding
        newScale = Math.min(availableWidth / baseWidth, 1)
        newScale = Math.max(newScale, 0.6)
      } else if (width < 1024) {
        // 平板 (768px - 1024px)
        const availableWidth = width - 64
        newScale = Math.min(availableWidth / baseWidth, 1)
        newScale = Math.max(newScale, 0.7)
      } else if (width < 1280) {
        // 小桌面 (1024px - 1280px)
        const availableWidth = width - 64
        newScale = Math.min(availableWidth / baseWidth, 1)
        newScale = Math.max(newScale, 0.8)
      } else {
        // 大桌面 (>= 1280px)
        newScale = 1
      }

      setScale(newScale)
    }

    calculateScale()
    window.addEventListener('resize', calculateScale)

    return () => {
      window.removeEventListener('resize', calculateScale)
    }
  }, [baseWidth, minScale, enableMobile])

  return (
    <div 
      ref={containerRef}
      className={`w-full flex justify-center ${className}`}
      style={{
        minHeight: scale < 1 ? 'auto' : 'auto'
      }}
    >
      <div
        style={{
          transform: scale < 1 && windowWidth >= 640 ? `scale(${scale})` : 'none',
          transformOrigin: 'center top',
          transition: 'transform 0.3s ease-out',
          marginBottom: scale < 1 && windowWidth >= 640 ? `${(1 - scale) * 100}px` : '0',
          width: '100%',
          maxWidth: `${baseWidth}px`
        }}
      >
        {children}
      </div>
    </div>
  )
}









