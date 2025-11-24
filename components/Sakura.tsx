'use client'

import { useMemo } from 'react'

type Petal = {
  left: number
  delay: number
  duration: number
  size: number
  drift: number
  rotate: number
  top: number
  swayFactor: number
  rotateFactor: number
  swayAmp: number
  depth: number
}

const Sakura = ({ count = 20 }: { count?: number }) => {
  const petals = useMemo<Petal[]>(() => {
    const arr: Petal[] = []
    for (let i = 0; i < count; i++) {
      arr.push({
        left: Math.random() * 100,              // viewport width %
        delay: Math.random() * 5,                // s
        duration: 8 + Math.random() * 10,       // 8-18s 更自然
        size: 10 + Math.random() * 16,          // 10-26px
        drift: (Math.random() * 50) - 25,       // -25 ~ 25 px 水平漂移
        rotate: Math.random() * 360,
        top: 5 + Math.random() * 25,            // 初始顶部偏移（vh）
        swayFactor: 0.7 + Math.random() * 0.8,  // 0.7x ~ 1.5x 摆动速度
        rotateFactor: 0.8 + Math.random() * 1.2, // 0.8x ~ 2.0x 旋转速度
        swayAmp: (Math.random() * 28 + 12) * (Math.random() > 0.5 ? 1 : -1), // 左右最大位移
        depth: (Math.random() * 120) - 60,
      })
    }
    return arr
  }, [count])

  return (
    <div className="pointer-events-none fixed inset-0 z-[45] overflow-hidden sakura-stage">
      {petals.map((p, idx) => (
        <span
          key={idx}
          className="sakura-wrap"
          style={{
            left: `${p.left}vw`,
            top: `-${p.top}vh`,
            animationDelay: `${p.delay}s`,
            // @ts-ignore
            ['--drift' as any]: `${p.drift}px`,
            // @ts-ignore
            ['--fall-duration' as any]: `${p.duration}s`,
          }}
        >
          <span
            className="sakura-sway"
            style={{
              // @ts-ignore
              ['--swayAmp' as any]: `${p.swayAmp}px`,
              animationDelay: `${p.delay / 2}s`,
              // @ts-ignore
              ['--sway-duration' as any]: `${p.duration * p.swayFactor}s`,
            }}
          >
            <span
              className="sakura-tilt"
              style={{
                animationDelay: `${p.delay / 3}s`,
                // @ts-ignore
                ['--tilt-duration' as any]: `${p.duration * p.rotateFactor}s`,
                // @ts-ignore
                ['--depth' as any]: `${p.depth}px`,
              }}
            >
              <span
                className="sakura-petal"
                style={{
                  animationDelay: `0s, ${p.delay / 2}s`,
                  // @ts-ignore
                  ['--spin-duration' as any]: `${p.duration * 0.6}s`,
                  // @ts-ignore
                  ['--fade-duration' as any]: `${p.duration * 0.9}s`,
                  width: `${p.size}px`,
                  height: `${p.size * 0.8}px`,
                }}
              />
            </span>
          </span>
        </span>
      ))}
    </div>
  )
}

export default Sakura


