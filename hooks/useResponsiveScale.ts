'use client'

import { useState, useEffect, useRef } from 'react'

/**
 * 响应式缩放Hook
 * 根据屏幕宽度计算缩放比例，确保内容在不同设备上完整呈现
 * @param baseWidth 基准宽度（桌面版设计宽度，默认1280px）
 * @param minScale 最小缩放比例（默认0.5）
 * @param enableMobile 是否在移动端启用缩放（默认false，移动端使用正常响应式布局）
 */
export function useResponsiveScale(
  baseWidth: number = 1280,
  minScale: number = 0.5,
  enableMobile: boolean = false
) {
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
        newScale = Math.max(newScale, minScale)
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

  return { scale, windowWidth, containerRef }
}









