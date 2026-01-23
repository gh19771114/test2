'use client'

import React, { useMemo } from 'react'

type Props = {
  size?: number
  maxDeg?: number
  durationSec?: number
  gapDeg?: number
  className?: string
}

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function ringSegPath(cx: number, cy: number, rOut: number, rIn: number, a0: number, a1: number) {
  const p0 = polar(cx, cy, rOut, a0)
  const p1 = polar(cx, cy, rOut, a1)
  const p2 = polar(cx, cy, rIn, a1)
  const p3 = polar(cx, cy, rIn, a0)
  const large = a1 - a0 > 180 ? 1 : 0
  return [
    `M ${p0.x.toFixed(2)} ${p0.y.toFixed(2)}`,
    `A ${rOut} ${rOut} 0 ${large} 1 ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`,
    `L ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`,
    `A ${rIn} ${rIn} 0 ${large} 0 ${p3.x.toFixed(2)} ${p3.y.toFixed(2)}`,
    'Z',
  ].join(' ')
}

function arcPath(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p0 = polar(cx, cy, r, a0)
  const p1 = polar(cx, cy, r, a1)
  const large = a1 - a0 > 180 ? 1 : 0
  return `M ${p0.x.toFixed(2)} ${p0.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`
}

export default function RentNegotiationRing({
  size = 420,
  maxDeg = 15,
  durationSec = 3.6,
  gapDeg = 6,
  className,
}: Props) {
  const labels = ['市场调查', '大规模修缮', '相关附加收益'] as const
  const centersDeg = [90, 210, 330] as const

  const outerR = 88
  const innerR = 62
  const segSpan = 120

  const segStyle = [
    { c1: '#88E6FF', c2: '#1D6FA5', fill: 'rgba(29,111,165,.30)' },
    { c1: '#FF7AD9', c2: '#5A189A', fill: 'rgba(90,24,154,.30)' },
    { c1: '#B7FFC8', c2: '#2D6A4F', fill: 'rgba(45,106,79,.30)' },
  ] as const

  const segs = useMemo(() => {
    return centersDeg.map((cdeg, i) => {
      const a0 = cdeg - segSpan / 2 + gapDeg / 2
      const a1 = cdeg + segSpan / 2 - gapDeg / 2

      const d = ringSegPath(100, 100, outerR, innerR, a0, a1)

      const gp0 = polar(100, 100, outerR, a0)
      const gp1 = polar(100, 100, outerR, a1)

      const mid = (a0 + a1) / 2
      const labelR = innerR + (outerR - innerR) * 0.45
      const pos = polar(100, 100, labelR, mid)

      const hi = arcPath(100, 100, outerR - 4, a0 + 10, a1 - 18)

      return { i, a0, a1, d, gp0, gp1, pos, hi }
    })
  }, [gapDeg])

  return (
    <div className={className} style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" width="100%" height="100%" aria-label="租金交涉流程环">
        <defs>
          <filter id="glassBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {segs.map((s) => (
            <linearGradient
              key={`g-${s.i}`}
              id={`segGrad${s.i}`}
              gradientUnits="userSpaceOnUse"
              x1={s.gp0.x}
              y1={s.gp0.y}
              x2={s.gp1.x}
              y2={s.gp1.y}
            >
              <stop offset="0%" stopColor={segStyle[s.i].c1} stopOpacity={1} />
              <stop offset="100%" stopColor={segStyle[s.i].c2} stopOpacity={1} />
            </linearGradient>
          ))}
        </defs>

        <style>{`
          .sway{
            transform-origin: 50% 50%;
            animation: sway ${durationSec}s ease-in-out infinite;
            will-change: transform;
            filter: drop-shadow(0 0 12px rgba(255,255,255,.08));
          }
          @keyframes sway{
            0%   { transform: rotate(${-maxDeg}deg); }
            50%  { transform: rotate(${maxDeg}deg); }
            100% { transform: rotate(${-maxDeg}deg); }
          }
          @media (prefers-reduced-motion: reduce){
            .sway{ animation:none; }
          }
        `}</style>

        <circle cx="100" cy="100" r="92" fill="transparent" stroke="rgba(255,255,255,.06)" strokeWidth="12" />

        <g className="sway">
          {segs.map((s) => {
            const label = labels[s.i]
            return (
              <g key={s.i}>
                <path
                  d={s.d}
                  fill={segStyle[s.i].fill}
                  stroke={`url(#segGrad${s.i})`}
                  strokeWidth={2.4}
                  strokeLinejoin="round"
                />

                <path
                  d={s.hi}
                  fill="transparent"
                  stroke="rgba(255,255,255,.22)"
                  strokeWidth={3}
                  strokeLinecap="round"
                  filter="url(#glassBlur)"
                />

                <path d={s.d} fill="transparent" stroke="rgba(255,255,255,.14)" strokeWidth={1} />

                {label === '相关附加收益' ? (
                  <text x={s.pos.x} y={s.pos.y} fill="#fff" fontSize={11.5} textAnchor="middle" dominantBaseline="middle">
                    <tspan x={s.pos.x} dy={-2}>
                      相关附加
                    </tspan>
                    <tspan x={s.pos.x} dy={14}>
                      收益
                    </tspan>
                  </text>
                ) : (
                  <text x={s.pos.x} y={s.pos.y} fill="#fff" fontSize={11.5} textAnchor="middle" dominantBaseline="middle">
                    {label}
                  </text>
                )}
              </g>
            )
          })}

          <circle cx="100" cy="100" r="62" fill="transparent" stroke="rgba(255,255,255,.55)" strokeWidth="2" />
          <circle cx="100" cy="100" r="88" fill="transparent" stroke="rgba(255,255,255,.12)" strokeWidth="2" />
        </g>

        <circle cx="100" cy="100" r="50" fill="rgba(0,0,0,.22)" stroke="rgba(255,255,255,.9)" strokeWidth="2" />
        <text x="100" y="100" fill="#fff" fontSize="18" fontWeight="700" textAnchor="middle" dominantBaseline="middle">
          租金交涉
        </text>
      </svg>
    </div>
  )
}

