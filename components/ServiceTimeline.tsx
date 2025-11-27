'use client'

interface TimelineItem {
  time: string
  title: string
  description: string
}

interface ServiceTimelineProps {
  items: TimelineItem[]
}

export default function ServiceTimeline({ items }: ServiceTimelineProps) {
  return (
    <div className="relative">
      <div className="absolute left-6 top-0 bottom-0 hidden md:block">
        <div className="w-0.5 h-full bg-gradient-to-b from-blue-200 via-blue-300 to-blue-400"></div>
      </div>
      <div className="space-y-8">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <div key={index} className="relative flex items-start gap-6">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg border-4 border-white z-10">
                  <span className="text-sm font-bold">{index + 1}</span>
                </div>
                {!isLast && (
                  <div className="mt-2 w-0.5 flex-1 bg-gradient-to-b from-blue-300 to-blue-400"></div>
                )}
              </div>
              <div className="flex-1 pb-8">
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="text-lg font-bold text-blue-600">{item.time}</span>
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}







