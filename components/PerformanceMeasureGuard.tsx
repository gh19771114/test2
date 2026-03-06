'use client'

import { useEffect } from 'react'

/**
 * Next.js 16 + Turbopack 在测量异步服务端组件时可能触发
 * "Failed to execute 'measure' on 'Performance': '...' cannot have a negative time stamp"。
 * 在客户端对 performance.measure 做防护，遇到该错误时返回虚拟条目并静默忽略，避免页面报错。
 */
export function PerformanceMeasureGuard() {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.performance?.measure) return
    const orig = window.performance.measure.bind(window.performance)
    const dummy = (name: string): PerformanceMeasure =>
      ({ name, duration: 0, startTime: 0, entryType: 'measure' } as PerformanceMeasure)
    window.performance.measure = function (
      name: string,
      startOrMeasureOptions?: string | PerformanceMeasureOptions,
      endMark?: string
    ): PerformanceMeasure {
      try {
        return orig(
          name,
          startOrMeasureOptions as string,
          endMark
        )
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        if (msg.includes('negative time stamp') || msg.includes('negative timestamp')) {
          return dummy(name)
        }
        throw e
      }
    }
  }, [])
  return null
}
