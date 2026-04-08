import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { resolveRootRedirectTarget } from '@/lib/home-root-redirect'

/**
 * 根路径 `/` 仅作分流：不写首页内容、不承担首页 SEO。
 * 优先级：cookie NEXT_LOCALE → Accept-Language → 默认 `/jp`（项目无 IP 地理库，不实现 IP 判断）。
 */
export default async function RootPage() {
  const h = await headers()
  const target = resolveRootRedirectTarget(h.get('cookie'), h.get('accept-language'))
  redirect(target)
}
