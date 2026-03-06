'use client'

import React, { useRef, useEffect, useState, useMemo } from 'react'
import PageLayout from '@/components/PageLayout'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import {
  ArrowLeft,
  TrendingUp,
  Building2,
  AlertTriangle,
  MapPin,
  BarChart3,
  Activity,
  Landmark,
  Home,
  HardHat,
  Users,
  Target,
  TrendingDown,
  Minus,
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  landPriceTrend as landPriceTrendData,
  marketOpportunities as marketOpportunitiesData,
  marketRisks as marketRisksData,
  fundingSources as fundingSourcesData,
  outlookPoints as outlookPointsData,
} from '@/data/realEstateOutlookData'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
}

/** 数字递增动效 */
function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (!isInView) return
    let start = 0
    const duration = 800
    const startTime = performance.now()
    const tick = (now: number) => {
      const elapsed = now - startTime
      const t = Math.min(elapsed / duration, 1)
      const eased = 1 - (1 - t) * (1 - t)
      setDisplay(Math.round(start + (value - start) * eased))
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [isInView, value])
  return <span ref={ref}>{display}{suffix}</span>
}

/** 地价与公寓：半宽柱状图，柱子紧挨、无多余横缝 */
const LAND_CHART_Y_MAX = 30
const BAR_AREA_HEIGHT = 140

function LandPriceChart({
  data,
  yAxisNote,
  footer,
}: {
  data: { label: string; risePercent: number }[]
  yAxisNote: string
  footer: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  return (
    <div ref={ref} className="w-full">
      <p className="text-sm text-gray-600 mb-1.5 text-center">
        {yAxisNote}
      </p>
      <div className="flex gap-1">
        <div
          className="flex flex-col justify-between text-sm text-gray-500 pb-5 pt-0.5"
          style={{ height: BAR_AREA_HEIGHT }}
        >
          <span>30%</span>
          <span>15%</span>
          <span>0%</span>
        </div>
        <div className="flex-1 flex items-end gap-0.5" style={{ height: BAR_AREA_HEIGHT }}>
          {data.map((d, i) => {
            const barHeightPx = (d.risePercent / LAND_CHART_Y_MAX) * BAR_AREA_HEIGHT
            return (
              <motion.div
                key={d.label}
                className="flex flex-col items-center flex-1 min-w-0 h-full justify-end"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: i * 0.06 }}
              >
                <motion.div
                  className="w-full max-w-[28px] mx-auto rounded-t bg-gradient-to-t from-navy-600 to-blue-500"
                  initial={{ height: 0 }}
                  animate={isInView ? { height: Math.max(barHeightPx, 3) } : { height: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                  style={{ minHeight: 3 }}
                />
                <span className="text-sm text-gray-600 mt-0.5 font-medium truncate w-full text-center">{d.label}</span>
                <span className="text-sm font-semibold text-navy-700">{d.risePercent}%</span>
              </motion.div>
            )
          })}
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-1.5 text-center">
        {footer}
      </p>
    </div>
  )
}

/** 市场热度与风险：主要机会 | 主要风险 横向并排，字号适中便于阅读 */
function MarketDimensionsChart({
  opportunitiesTitle,
  risksTitle,
  opportunities,
  risks,
}: {
  opportunitiesTitle: string
  risksTitle: string
  opportunities: { name: string }[]
  risks: { name: string }[]
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  return (
    <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <motion.div
        className="rounded-lg bg-emerald-50/80 border border-emerald-100 p-4"
        initial={{ opacity: 0, y: 6 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <h3 className="text-base font-semibold text-emerald-800">{opportunitiesTitle}</h3>
        </div>
        <ul className="text-base text-gray-700 space-y-1">
          {opportunities.map((o) => (
            <li key={o.name}>· {o.name}</li>
          ))}
        </ul>
      </motion.div>
      <motion.div
        className="rounded-lg bg-amber-50/80 border border-amber-100 p-4"
        initial={{ opacity: 0, y: 6 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.06, duration: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <h3 className="text-base font-semibold text-amber-800">{risksTitle}</h3>
        </div>
        <ul className="text-base text-gray-700 space-y-1">
          {risks.map((r) => (
            <li key={r.name}>· {r.name}</li>
          ))}
        </ul>
      </motion.div>
    </div>
  )
}

/** 环形饼图路径计算（与首页 Services 一致：从 12 点顺时针） */
function getDonutPath(
  percentage: number,
  startAngleDeg: number,
  cx: number,
  cy: number,
  radius: number,
  innerRadius: number
) {
  const angle = (percentage / 100) * 360
  const endAngle = startAngleDeg + angle
  const startRad = ((startAngleDeg - 90) * Math.PI) / 180
  const endRad = ((endAngle - 90) * Math.PI) / 180
  const x1 = cx + radius * Math.cos(startRad)
  const y1 = cy + radius * Math.sin(startRad)
  const x2 = cx + radius * Math.cos(endRad)
  const y2 = cy + radius * Math.sin(endRad)
  const ix1 = cx + innerRadius * Math.cos(startRad)
  const iy1 = cy + innerRadius * Math.sin(startRad)
  const ix2 = cx + innerRadius * Math.cos(endRad)
  const iy2 = cy + innerRadius * Math.sin(endRad)
  const large = angle > 180 ? 1 : 0
  return `M ${ix1} ${iy1} L ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerRadius} ${innerRadius} 0 ${large} 0 ${ix1} ${iy1} Z`
}

/** 资金构成：饼图为主，说明文字放在对应扇区上（或引线拉出），与首页一致 */
function FundingChart({ sources }: { sources: { name: string; value: number; desc?: string; color: string }[] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const size = 280
  const cx = size / 2
  const cy = size / 2
  const radius = 110
  const innerRadius = 45
  const padding = 48
  let currentAngle = 0
  const segments = sources.map((s) => {
    const pct = s.value
    const angle = (pct / 100) * 360
    const startAngleDeg = currentAngle
    const midAngleDeg = currentAngle + angle / 2
    currentAngle += angle
    const path = getDonutPath(pct, startAngleDeg, cx, cy, radius, innerRadius)
    const midRad = ((midAngleDeg - 90) * Math.PI) / 180
    const textRadius = pct >= 30 ? (innerRadius + radius) * 0.55 : (innerRadius + radius) * 0.62
    const textX = cx + textRadius * Math.cos(midRad)
    const textY = cy + textRadius * Math.sin(midRad)
    const isSmall = pct < 18
    const lineOut = radius + 18
    const labelDist = lineOut + 32
    let labelX = cx + labelDist * Math.cos(midRad)
    let labelY = cy + labelDist * Math.sin(midRad)
    if (isSmall) {
      labelX = Math.max(padding, Math.min(size - padding, labelX))
      labelY = Math.max(padding, Math.min(size - padding, labelY))
    }
    const lineX = cx + (lineOut - 4) * Math.cos(midRad)
    const lineY = cy + (lineOut - 4) * Math.sin(midRad)
    const lineEndX = labelX - 22 * Math.cos(midRad)
    const lineEndY = labelY - 22 * Math.sin(midRad)
    return {
      ...s,
      path,
      textX,
      textY,
      isSmall,
      lineX: lineEndX,
      lineY: lineEndY,
      labelX,
      labelY,
    }
  })
  return (
    <div ref={ref} className="w-full flex justify-center">
      <svg
        width="280"
        height="280"
        viewBox={`0 0 ${size} ${size}`}
        className="drop-shadow-md max-w-full"
        aria-label="资金与投资者结构占比"
      >
        <circle cx={cx} cy={cy} r={innerRadius} fill="white" className="drop-shadow-sm" />
        {segments.map((seg, i) => (
          <g key={seg.name}>
            <motion.path
              d={seg.path}
              fill={seg.color}
              stroke="white"
              strokeWidth="3"
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.08 + i * 0.05, duration: 0.35 }}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            />
            {seg.isSmall ? (
              <>
                <line
                  x1={seg.textX}
                  y1={seg.textY}
                  x2={seg.lineX}
                  y2={seg.lineY}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-gray-400"
                />
                <motion.text
                  x={seg.labelX}
                  y={seg.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-medium pointer-events-none"
                  fill="#1e293b"
                  stroke="#fff"
                  strokeWidth="2"
                  paintOrder="stroke fill"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.2 + i * 0.05 }}
                >
                  <tspan x={seg.labelX} dy="-0.6em" display="block">{seg.value}%</tspan>
                  <tspan x={seg.labelX} dy="1.1em" display="block">{seg.name}</tspan>
                </motion.text>
              </>
            ) : (
              <motion.text
                x={seg.textX}
                y={seg.textY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="pointer-events-none"
                fill="#fff"
                stroke="rgba(0,0,0,0.75)"
                strokeWidth="2.5"
                paintOrder="stroke fill"
                style={{
                  fontSize: seg.value >= 35 ? 14 : seg.value >= 20 ? 12 : 11,
                  fontWeight: 600,
                }}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.15 + i * 0.05 }}
              >
                <tspan x={seg.textX} dy="-0.55em">{seg.value}%</tspan>
                <tspan x={seg.textX} dy="1.05em">{seg.name}</tspan>
              </motion.text>
            )}
          </g>
        ))}
      </svg>
    </div>
  )
}

export default function RealEstateOutlookPage() {
  const { t } = useLanguage()
  const landChartLabels = (t('outlook.landChart.labels', { returnObjects: true }) as string[]) || landPriceTrendData.map((d) => d.label)
  const landPriceTrend = useMemo(
    () => landPriceTrendData.map((d, i) => ({ ...d, label: landChartLabels[i] ?? d.label })),
    [landChartLabels]
  )
  const opportunitiesTrans = (t('outlook.opportunities', { returnObjects: true }) as { name: string }[]) || []
  const opportunities = useMemo(
    () => marketOpportunitiesData.map((o, i) => ({ ...o, name: opportunitiesTrans[i]?.name ?? o.name })),
    [opportunitiesTrans]
  )
  const risksTrans = (t('outlook.risks', { returnObjects: true }) as { name: string }[]) || []
  const risks = useMemo(
    () => marketRisksData.map((r, i) => ({ ...r, name: risksTrans[i]?.name ?? r.name })),
    [risksTrans]
  )
  const fundingTrans = (t('outlook.fundingSources', { returnObjects: true }) as { name: string; desc: string }[]) || []
  const fundingSources = useMemo(
    () =>
      fundingSourcesData.map((s, i) => ({
        ...s,
        name: fundingTrans[i]?.name ?? s.name,
        desc: fundingTrans[i]?.desc ?? s.desc,
      })),
    [fundingTrans]
  )
  const futurePointsTrans = (t('outlook.futurePoints', { returnObjects: true }) as { title: string; desc: string }[]) || []
  const outlookPoints = useMemo(
    () =>
      outlookPointsData.map((p, i) => ({
        ...p,
        title: futurePointsTrans[i]?.title ?? p.title,
        desc: futurePointsTrans[i]?.desc ?? p.desc,
      })),
    [futurePointsTrans]
  )

  return (
    <PageLayout>
      <div className="min-h-screen">
        {/* Hero */}
        <section className="relative pt-20 md:pt-24 pb-6 md:pb-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-navy-900 to-blue-900" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(59,130,246,0.25),transparent)]" />
          <div className="container-custom px-4 relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
            <div>
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('outlook.hero.backToNews')}</span>
              </Link>
              <motion.div
                className="flex items-center gap-2 text-white/90 mb-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <span className="text-sm font-medium">{t('outlook.hero.badge')}</span>
              </motion.div>
              <motion.h1
                className="text-2xl md:text-4xl font-bold text-white mb-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {t('outlook.hero.title')} {t('outlook.hero.subtitle')}
              </motion.h1>
              <motion.p
                className="text-lg md:text-xl text-white/90 max-w-2xl mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {t('outlook.hero.disclaimer')}
              </motion.p>
            </div>
            <motion.div
              className="relative w-full max-w-sm aspect-[4/3] rounded-xl overflow-hidden border border-white/20 shadow-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25, duration: 0.5 }}
            >
              <Image
                src="/outlook/hero-tokyo.png"
                alt={t('outlook.hero.heroImageAlt')}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 24rem"
                priority
              />
            </motion.div>
          </div>
        </section>

        {/* 正文区：两列排版，每块半宽横向并排；只减留白，字号保持 */}
        <div className="container-custom px-4 max-w-6xl py-3 md:py-5 space-y-3">
          {/* KPI 卡片 */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-3"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
          >
            <motion.div variants={item} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <span className="font-semibold text-navy-800 text-base">{t('outlook.kpi.landTrend')}</span>
              </div>
              <p className="text-2xl font-bold text-navy-900"><AnimatedNumber value={8} suffix={t('outlook.kpi.landTrendSuffix')} /> {t('outlook.kpi.landTrendValue')}</p>
              <p className="text-base text-gray-600 mt-0.5">{t('outlook.kpi.landTrendDesc')}</p>
            </motion.div>
            <motion.div variants={item} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-6 h-6 text-amber-600" />
                <span className="font-semibold text-navy-800 text-base">{t('outlook.kpi.bankFinance')}</span>
              </div>
              <p className="text-2xl font-bold text-navy-900"><AnimatedNumber value={9} suffix={t('outlook.kpi.bankFinanceSuffix')} /> {t('outlook.kpi.bankFinanceValue')}</p>
              <p className="text-base text-gray-600 mt-0.5">{t('outlook.kpi.bankFinanceDesc')}</p>
            </motion.div>
            <motion.div variants={item} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-6 h-6 text-rose-500" />
                <span className="font-semibold text-navy-800 text-base">{t('outlook.kpi.redev')}</span>
              </div>
              <p className="text-2xl font-bold text-navy-900">{t('outlook.kpi.redevValue')}</p>
              <p className="text-base text-gray-600 mt-0.5">{t('outlook.kpi.redevDesc')}</p>
            </motion.div>
          </motion.div>

          {/* 第一行：地价(左半) | 市场热度与风险(右半) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-xl bg-white border border-gray-200 p-3 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-navy-900">{t('outlook.landChart.title')}</h2>
              </div>
              <p className="text-base text-gray-600 mb-2">{t('outlook.landChart.desc')}</p>
              <LandPriceChart
                data={landPriceTrend}
                yAxisNote={t('outlook.landChart.yAxisNote')}
                footer={t('outlook.landChart.footer')}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-xl bg-white border border-gray-200 p-3 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-5 h-5 text-amber-600" />
                <h2 className="text-lg font-bold text-navy-900">{t('outlook.marketHeat.title')}</h2>
              </div>
              <p className="text-base text-gray-600 mb-2">{t('outlook.marketHeat.desc')}</p>
              <MarketDimensionsChart
                opportunitiesTitle={t('outlook.marketHeat.opportunitiesTitle')}
                risksTitle={t('outlook.marketHeat.risksTitle')}
                opportunities={opportunities}
                risks={risks}
              />
            </motion.div>
          </div>

          {/* 第二行：资金与投资者结构(左半) | 未来预期(右半) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-xl bg-white border border-gray-200 p-3 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-1">
                <Landmark className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-navy-900">{t('outlook.funding.title')}</h2>
              </div>
              <p className="text-base text-gray-600 mb-2">{t('outlook.funding.desc')}</p>
              <FundingChart sources={fundingSources} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-xl bg-white border border-gray-200 p-3 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-navy-600" />
                <h2 className="text-lg font-bold text-navy-900">{t('outlook.future.title')}</h2>
              </div>
              <div className="space-y-2">
                {outlookPoints.map((p, i) => (
                  <motion.div
                    key={p.title}
                    className="rounded-lg border border-gray-100 bg-gray-50/50 p-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      {p.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0" />}
                      {p.trend === 'down' && <TrendingDown className="w-4 h-4 text-amber-600 flex-shrink-0" />}
                      {p.trend === 'neutral' && <Minus className="w-4 h-4 text-gray-500 flex-shrink-0" />}
                      <span className="font-semibold text-navy-800 text-base">{p.title}</span>
                      {p.trend === 'up' && <span className="text-green-600 text-base">{t('outlook.future.trendUp')}</span>}
                      {p.trend === 'down' && <span className="text-amber-600 text-base">{t('outlook.future.trendDown')}</span>}
                      {p.trend === 'neutral' && <span className="text-gray-500 text-base">{t('outlook.future.trendNeutral')}</span>}
                    </div>
                    <p className="text-base text-gray-600 mt-1">{p.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* 解读正文：恢复之前排版 — 单列竖排、以文字为主 */}
          <motion.div
            className="space-y-6"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
          >
            <motion.div variants={item} className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Home className="w-5 h-5 text-navy-600" />
                <h2 className="text-2xl font-bold text-navy-900">{t('outlook.insights.priceTitle')}</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                {t('outlook.insights.priceBody')}
              </p>
            </motion.div>
            <motion.div variants={item} className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <HardHat className="w-5 h-5 text-amber-600" />
                <h2 className="text-2xl font-bold text-navy-900">{t('outlook.insights.buildTitle')}</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                {t('outlook.insights.buildBody')}
              </p>
            </motion.div>
            <motion.div variants={item} className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-violet-600" />
                <h2 className="text-2xl font-bold text-navy-900">{t('outlook.insights.foreignTitle')}</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                {t('outlook.insights.foreignBody')}
              </p>
            </motion.div>
            <motion.div variants={item} className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-navy-600" />
                <h2 className="text-2xl font-bold text-navy-900">{t('outlook.insights.regionTitle')}</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                {t('outlook.insights.regionBody')}
              </p>
            </motion.div>
          </motion.div>

          {/* 底部导航 */}
          <div className="pt-4 border-t border-gray-200 flex flex-wrap gap-4">
            <Link
              href="/news/real-estate-market"
              className="inline-flex items-center gap-2 text-base text-navy-700 hover:text-navy-900 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('outlook.nav.toNewsList')}
            </Link>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-base text-gray-600 hover:text-navy-800 transition-colors"
            >
              {t('outlook.nav.backToNews')}
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
