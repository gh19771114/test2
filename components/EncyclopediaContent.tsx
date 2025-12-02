'use client'

import React from 'react'

interface TableData {
  headers: string[]
  rows: string[][]
  caption?: string
}

interface ChartData {
  type: 'table' | 'flow' | 'comparison'
  data: TableData | any
  title?: string
}

interface EncyclopediaContentProps {
  content: string
  charts?: ChartData[]
}

// 解析内容中的特殊标记，如 [TABLE:xxx] 或 [CHART:xxx]
function parseContent(content: string, charts?: ChartData[]): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  const lines = content.split('\n')
  let currentParagraph: string[] = []
  let chartIndex = 0

  const renderParagraph = (text: string) => {
    if (!text.trim()) return null
    return (
      <p key={`para-${parts.length}`} className="mb-4 text-gray-200 leading-relaxed">
        {text}
      </p>
    )
  }

  lines.forEach((line, index) => {
    // 检查是否是图表标记
    const chartMatch = line.match(/\[(TABLE|CHART|FLOW|COMPARISON):(\d+)\]/)
    if (chartMatch && charts) {
      // 先渲染当前段落
      if (currentParagraph.length > 0) {
        const paraText = currentParagraph.join('\n').trim()
        if (paraText) {
          parts.push(renderParagraph(paraText))
        }
        currentParagraph = []
      }

      // 渲染图表
      const chartType = chartMatch[1]
      const chartId = parseInt(chartMatch[2])
      const chart = charts[chartId]
      
      if (chart) {
        parts.push(
          <div key={`chart-${chartIndex++}`} className="my-8">
            {chart.title && (
              <h3 className="text-xl font-bold text-white mb-4">{chart.title}</h3>
            )}
            {chart.type === 'table' && chart.data && (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  {chart.data.caption && (
                    <caption className="text-sm text-gray-300 mb-2 text-left px-4 pt-4">
                      {chart.data.caption}
                    </caption>
                  )}
                  <thead>
                    <tr className="bg-white/10">
                      {chart.data.headers.map((header: string, i: number) => (
                        <th
                          key={i}
                          className="px-4 py-3 text-left text-sm font-semibold text-white border-b border-white/20"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {chart.data.rows.map((row: string[], i: number) => (
                      <tr
                        key={i}
                        className="border-b border-white/10 hover:bg-white/5 transition-colors"
                      >
                        {row.map((cell: string, j: number) => (
                          <td
                            key={j}
                            className="px-4 py-3 text-sm text-gray-200"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {chart.type === 'flow' && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
                <div className="space-y-6 relative">
                  {chart.data.steps?.map((step: any, i: number) => (
                    <div key={i} className="relative">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm z-10 relative">
                          {i + 1}
                        </div>
                        <div className="flex-1 pt-1">
                          <h4 className="text-white font-semibold mb-2 text-lg">{step.title}</h4>
                          <p className="text-gray-300 text-sm leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                      {i < chart.data.steps.length - 1 && (
                        <div className="absolute left-5 top-10 w-0.5 h-6 bg-green-500/50" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {chart.type === 'comparison' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {chart.data.items?.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4"
                  >
                    <h4 className="text-white font-semibold mb-2">{item.title}</h4>
                    <ul className="space-y-2">
                      {item.points?.map((point: string, j: number) => (
                        <li key={j} className="text-gray-300 text-sm flex items-start gap-2">
                          <span className="text-green-400 mt-1">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      }
    } else {
      // 检查是否是标题行（以##开头）
      if (line.trim().startsWith('##')) {
        // 先渲染当前段落
        if (currentParagraph.length > 0) {
          const paraText = currentParagraph.join('\n').trim()
          if (paraText) {
            parts.push(renderParagraph(paraText))
          }
          currentParagraph = []
        }
        // 渲染标题
        const titleText = line.replace(/^##+\s*/, '')
        const level = (line.match(/^##+/) || [''])[0].length
        const HeadingTag = `h${Math.min(level + 1, 6)}` as keyof JSX.IntrinsicElements
        parts.push(
          <HeadingTag
            key={`heading-${index}`}
            className={`text-white font-bold mb-4 mt-6 ${
              level === 1 ? 'text-2xl' : level === 2 ? 'text-xl' : 'text-lg'
            }`}
          >
            {titleText}
          </HeadingTag>
        )
      } else {
        currentParagraph.push(line)
      }
    }
  })

  // 渲染最后一段
  if (currentParagraph.length > 0) {
    const paraText = currentParagraph.join('\n').trim()
    if (paraText) {
      parts.push(renderParagraph(paraText))
    }
  }

  return parts
}

export default function EncyclopediaContent({ content, charts }: EncyclopediaContentProps) {
  return (
    <div className="prose prose-lg max-w-none">
      <div className="text-gray-200 leading-relaxed text-lg md:text-xl">
        {parseContent(content, charts)}
      </div>
    </div>
  )
}

