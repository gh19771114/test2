'use client'

import PageLayout from '@/components/PageLayout'
import { Calendar, ArrowLeft, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { NewsItem } from '@/lib/knowledge'
import { getJapanRealEstateNewsById } from '@/data/japanRealEstateNews'

export default function NewsDetailClient({ news }: { news: NewsItem }) {
  const { t } = useLanguage()

  // 房地产单条：从数据渲染标题、正文、出处、原文链接（标题支持多语言）
  if (news.realEstateId) {
    const item = getJapanRealEstateNewsById(news.realEstateId)
    if (!item) return null
    const localizedTitle = t(`news.realEstate.${item.id}.title`, { defaultValue: item.title })
    const localizedSummary = t(`news.realEstate.${item.id}.summary`, { defaultValue: '' })
    return (
      <PageLayout>
        <article className="min-h-screen">
          <section className="relative md:pt-28 md:pb-16 bg-gradient-to-br from-blue-50 to-white" style={{ paddingTop: '5rem', paddingBottom: '1rem' }}>
            <div className="container-custom" style={{ paddingTop: '1rem' }}>
              <Link href="/news" className="inline-flex items-center gap-2 text-navy-700 hover:text-navy-900 md:mb-6 transition-colors" style={{ marginBottom: '0.75rem' }}>
                <ArrowLeft className="w-4 h-4" />
                <span>{t('news.backToHome')}</span>
              </Link>
              <div className="flex items-center gap-3 text-sm text-gray-600 md:mb-3" style={{ marginBottom: '0.5rem' }}>
                <Calendar className="w-4 h-4" />
                <time dateTime={item.date}>{item.date}</time>
                <span>{item.source}</span>
              </div>
              <h1 className="text-3xl font-bold text-navy-900 md:mb-6 news-title" style={{ marginBottom: '0.75rem' }}>
                {localizedTitle}
              </h1>
            </div>
          </section>
          <section className="section-padding bg-white" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
            <div className="container-custom max-w-4xl">
              <div className="prose prose-lg max-w-none text-gray-800">
                {localizedSummary && (
                  <p className="mb-4 leading-relaxed">{localizedSummary}</p>
                )}
                <div className="whitespace-pre-line leading-relaxed">{item.body}</div>
                {item.images && item.images.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    {item.images.map((src, idx) => (
                      <a key={idx} href={src} target="_blank" rel="noopener noreferrer" className="block relative w-48 h-32 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" className="w-full h-full object-cover" />
                      </a>
                    ))}
                  </div>
                )}
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-6 text-blue-600 hover:text-blue-800 font-medium">
                  <ExternalLink className="w-4 h-4" />
                  {t('news.readOriginal', { defaultValue: '阅读原文' })}
                </a>
              </div>
              <div className="md:mt-12 md:pt-8 border-t border-gray-200" style={{ marginTop: '1rem', paddingTop: '1rem' }}>
                <Link href="/news" className="inline-flex items-center gap-2 text-navy-700 hover:text-navy-900 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t('news.backToHome')}</span>
                </Link>
              </div>
            </div>
          </section>
        </article>
      </PageLayout>
    )
  }

  // 获取分类标识
  const getCategoryLabel = (news: NewsItem) => {
    if (news.category) {
      // 如果category是"公司活动"，需要翻译
      if (news.category === '公司活动') {
        return t('news.category.companyActivity')
      }
      if (news.category === '通知') {
        return t('news.category.notice')
      }
      return news.category
    }
    if (news.isNotice) {
      return t('news.category.notice')
    }
    return t('news.category.news')
  }

  const isSaikaiPage = news.slug === 'president-attends-saikai-awards-2025'
  
  return (
    <PageLayout>
        <article className={`min-h-screen ${isSaikaiPage ? 'saikai-awards-page' : ''}`}>
        {/* 头部 */}
        <section className="relative md:pt-28 md:pb-16 bg-gradient-to-br from-blue-50 to-white" style={{ paddingTop: '5rem', paddingBottom: '1rem' }}>
          <div className="container-custom" style={{ paddingTop: '1rem' }}>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-navy-700 hover:text-navy-900 md:mb-6 transition-colors"
              style={{ marginBottom: '0.75rem' }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('news.backToHome')}</span>
            </Link>
            
            <div className="flex items-center gap-3 text-sm text-gray-600 md:mb-3" style={{ marginBottom: '0.5rem' }}>
              <Calendar className="w-4 h-4" />
              <time dateTime={news.date}>{news.date}</time>
            </div>
            
            {/* 分类标识 - 放在标题上方 */}
            <div className="md:mb-3" style={{ marginBottom: '0.5rem' }}>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                news.category === '公司活动' ? 'bg-green-100 text-green-700 border border-green-300' :
                news.isNotice || news.category === '通知' ? 'bg-red-100 text-red-700 border border-red-300' :
                'bg-blue-100 text-blue-700 border border-blue-300'
              }`}>
                {getCategoryLabel(news)}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-navy-900 md:mb-6 news-title" style={{ marginBottom: '0.75rem' }}>
              {t(`news.items.${news.slug}.title`, { defaultValue: news.slug })}
            </h1>
            
            {/* 标题图片 */}
            {(news.headerImage || (news.image && !news.contentImage)) && (
              <div className={`mt-6 md:mt-8 rounded-2xl overflow-hidden shadow-lg ${isSaikaiPage ? 'saikai-header-image' : ''}`}>
                <div className={`relative w-full h-64 md:h-96 lg:h-[500px] ${isSaikaiPage ? 'saikai-header-image-container' : ''}`}>
                  <Image
                    src={news.headerImage || news.image || '/imgs/background.png'}
                    alt={t(`news.items.${news.slug}.title`, { defaultValue: news.slug })}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 1200px, (min-width: 768px) 800px, 100vw"
                    priority
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 内容 */}
        <section className="section-padding bg-white" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
          <div className="container-custom max-w-4xl">
            <div className="prose prose-lg max-w-none text-gray-800 prose-p:text-gray-800 prose-headings:text-navy-900">
              {(() => {
                const content: string = String(
                  t(`news.items.${news.slug}.content`, { defaultValue: '' })
                )
                // 将内容按双换行符分割成段落
                const paragraphs = content.split('\n\n').filter(p => p.trim())
                const hasContentImage = news.contentImage || (!news.headerImage && !news.contentImage && news.image)
                
                // 如果有正文图片，图片和文字内容布局
                // 手机版：图片在左，第一段在右，第二段及以后在下（全宽）
                // 其他版本：图片在左，所有文字在右（原布局）
                if (hasContentImage && paragraphs.length > 0) {
                  const firstParagraph = paragraphs[0]
                  const remainingParagraphs = paragraphs.slice(1)
                  const allContent = paragraphs.join('\n\n')
                  
                  return (
                    <>
                      {/* 手机版布局：图片在左，第一段在右，第二段在下 */}
                      <div className="news-content-mobile-layout mt-6">
                        {/* 第一行：图片在左，第一段在右 */}
                        <div className="flex flex-col md:flex-row gap-4 md:gap-5">
                          {/* 正文图片 */}
                          {news.contentImage && (
                            <div className="flex-shrink-0 w-full md:w-[32%] lg:w-[28%]">
                              <div className="rounded-lg overflow-hidden shadow-lg bg-gray-100">
                                <Image
                                  src={news.contentImage}
                                  alt={t(`news.items.${news.slug}.title`, { defaultValue: news.slug })}
                                  width={280}
                                  height={210}
                                  className="w-full h-auto object-contain"
                                  sizes="(min-width: 1024px) 280px, (min-width: 768px) 32vw, 100vw"
                                />
                              </div>
                            </div>
                          )}
                          
                          {/* 兼容旧格式 */}
                          {!news.headerImage && !news.contentImage && news.image && (
                            <div className="flex-shrink-0 w-full md:w-[32%] lg:w-[28%]">
                              <div className="rounded-lg overflow-hidden shadow-lg bg-gray-100">
                                {news.image && news.image.includes('facebook.com') ? (
                                  <img
                                    src={news.image}
                                    alt={t(`news.items.${news.slug}.title`, { defaultValue: news.slug })}
                                    className="w-full h-auto object-contain"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement
                                      target.src = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                                    }}
                                  />
                                ) : (
                                  <Image
                                    src={news.image}
                                    alt={t(`news.items.${news.slug}.title`, { defaultValue: news.slug })}
                                    width={280}
                                    height={210}
                                    className="w-full h-auto object-contain"
                                    sizes="(min-width: 1024px) 280px, (min-width: 768px) 32vw, 100vw"
                                  />
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* 第一段文字 - 手机版在右侧，其他版本隐藏（使用桌面版布局） */}
                          <div className="flex-1 text-gray-800 leading-relaxed text-lg md:text-xl news-content-first-paragraph">
                            <p>
                              {firstParagraph.split('\n').map((line, lineIndex) => (
                                <span key={lineIndex}>
                                  {lineIndex > 0 && <br />}
                                  {line}
                                </span>
                              ))}
                            </p>
                          </div>
                        </div>
                        
                        {/* 第二段及以后 - 手机版全宽显示在下边 */}
                        {remainingParagraphs.length > 0 && (
                          <div className="mt-6 text-gray-800 leading-relaxed text-lg md:text-xl news-content-remaining-paragraphs">
                            {remainingParagraphs.map((paragraph, index) => (
                              <p key={index} className={index > 0 ? 'mt-6' : ''}>
                                {paragraph.split('\n').map((line, lineIndex) => (
                                  <span key={lineIndex}>
                                    {lineIndex > 0 && <br />}
                                    {line}
                                  </span>
                                ))}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* 桌面版布局：图片在左，所有文字在右（原布局） */}
                      <div className="news-content-desktop-layout hidden md:flex flex-row gap-4 md:gap-5 mt-6">
                        {/* 正文图片 */}
                        {news.contentImage && (
                          <div className="flex-shrink-0 w-[32%] lg:w-[28%]">
                            <div className="rounded-lg overflow-hidden shadow-lg bg-gray-100">
                              <Image
                                src={news.contentImage}
                                alt={t(`news.items.${news.slug}.title`, { defaultValue: news.slug })}
                                width={350}
                                height={263}
                                className="w-full h-auto object-contain"
                                sizes="(min-width: 1024px) 280px, (min-width: 768px) 32vw, 100vw"
                              />
                            </div>
                          </div>
                        )}
                        
                        {/* 兼容旧格式 */}
                        {!news.headerImage && !news.contentImage && news.image && (
                          <div className="flex-shrink-0 w-[32%] lg:w-[28%]">
                            <div className="rounded-lg overflow-hidden shadow-lg bg-gray-100">
                              {news.image && news.image.includes('facebook.com') ? (
                                <img
                                  src={news.image}
                                  alt={t(`news.items.${news.slug}.title`, { defaultValue: news.slug })}
                                  className="w-full h-auto object-contain"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.src = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                                  }}
                                />
                              ) : (
                                <Image
                                  src={news.image}
                                  alt={t(`news.items.${news.slug}.title`, { defaultValue: news.slug })}
                                  width={350}
                                  height={263}
                                  className="w-full h-auto object-contain"
                                  sizes="(min-width: 1024px) 280px, (min-width: 768px) 32vw, 100vw"
                                />
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* 所有文字内容 */}
                        <div className="flex-1 text-gray-800 leading-relaxed text-lg md:text-xl">
                          {allContent.split('\n\n').map((paragraph, index) => (
                            <p key={index} className={index > 0 ? 'mt-6' : ''}>
                              {paragraph.split('\n').map((line, lineIndex) => (
                                <span key={lineIndex}>
                                  {lineIndex > 0 && <br />}
                                  {line}
                                </span>
                              ))}
                            </p>
                          ))}
                        </div>
                      </div>
                    </>
                  )
                }
                
                
                // 没有正文图片，直接显示完整内容
                const isCompanyNameChangeNotice = news.slug === '2021-06-01-company-name-change-notice'
                // 仅对“旧社名/新社名/代表”三行段落显示 logo，排除“银行账户名称”段落，避免出现两个 logo
                const COMPANY_NAME_BLOCK_MARKERS = [
                  '株式会社ウォームライト',
                  '株式会社暖灯',
                  '株式會社暖燈',
                  'Warm Light',
                  '株式会社ボーンマーク',
                  '株式會社ボーンマーク',
                  'Bourn Mark',
                  '代表取締役',
                  '代表董事',
                  'Representative Director',
                ]
                const isBankAccountBlock = (p: string) =>
                  p.includes('口座名義') ||
                  p.includes('口座名義が') ||
                  p.includes('账户名称') ||
                  p.includes('帳戶名義') ||
                  (p.includes('Account name') && p.includes('株式会社'))
                const isCompanyNameBlock = (p: string) =>
                  isCompanyNameChangeNotice &&
                  !isBankAccountBlock(p) &&
                  COMPANY_NAME_BLOCK_MARKERS.filter((m) => p.includes(m)).length >= 3

                return (
                  <div className="text-gray-800 leading-relaxed text-lg md:text-xl">
                    {content.split('\n\n').map((paragraph, index) => {
                      if (isCompanyNameBlock(paragraph)) {
                        return (
                          <p key={index} className={index > 0 ? 'mt-6' : ''}>
                            {paragraph.split('\n').map((line, lineIndex) => (
                              <span key={lineIndex}>
                                {lineIndex > 0 && <br />}
                                {line}
                              </span>
                            ))}
                          </p>
                        )
                      }
                      return (
                        <p key={index} className={index > 0 ? 'mt-6' : ''}>
                          {paragraph.split('\n').map((line, lineIndex) => (
                            <span key={lineIndex}>
                              {lineIndex > 0 && <br />}
                              {line}
                            </span>
                          ))}
                        </p>
                      )
                    })}
                    {isCompanyNameChangeNotice && (
                      <div className="mt-8 flex justify-start">
                        <div className="rounded-lg overflow-hidden shadow-md bg-white/10 w-80 sm:w-[26rem] md:w-[32rem] max-w-full">
                          <Image
                            src="/imgs/logo2.jpg"
                            alt={t(`news.items.${news.slug}.title`, { defaultValue: news.slug })}
                            width={512}
                            height={768}
                            className="w-full h-auto object-contain"
                            sizes="(min-width: 768px) 512px, (min-width: 640px) 416px, 320px"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>

            {/* 返回按钮 */}
            <div className="md:mt-12 md:pt-8 border-t border-gray-400" style={{ marginTop: '1rem', paddingTop: '1rem' }}>
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-gray-200 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('news.backToHome')}</span>
              </Link>
            </div>
          </div>
        </section>
        </article>
    </PageLayout>
  )
}

