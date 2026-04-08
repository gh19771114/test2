/**
 * 五语言首页路径 → LanguageContext 语种（无 React 依赖，供 Provider 与 localStorage 逻辑共用）
 */
export function getHomeLanguageFromPathname(pathname: string): string | null {
  const raw = pathname.split('?')[0] || '/'
  const p = raw === '/' ? '/' : raw.replace(/\/+$/, '') || '/'
  const map: Record<string, string> = {
    '/jp': 'ja',
    '/en': 'en',
    '/zh-cn': 'zh',
    '/zh-tw': 'zh-TW',
    '/zh-hk': 'zh-HK',
  }
  return map[p] ?? null
}
