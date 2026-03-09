'use client'

import { useLanguage } from '@/contexts/LanguageContext'

/** 页首上方一行：完整站点标题，供 SEO，低调展示；固定在最顶部 */
const TITLE_BAR_HEIGHT = '28px'

export default function SiteTitleBar() {
  const { t } = useLanguage()
  return (
    <div
      className="fixed top-0 left-0 right-0 z-[10001] w-full bg-navy-900/90 text-center py-1.5 px-4 flex items-center justify-center"
      style={{ height: TITLE_BAR_HEIGHT, minHeight: TITLE_BAR_HEIGHT }}
    >
      <p className="text-xs text-white/50 truncate max-w-full" aria-label={t('hero.pageTitle')}>
        {t('hero.pageTitle')}
      </p>
    </div>
  )
}

export { TITLE_BAR_HEIGHT }
