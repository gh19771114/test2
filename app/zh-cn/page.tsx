import HomePage from '@/components/home/HomePage'
import { buildHomeMetadata } from '@/lib/i18n-home-seo'

export const metadata = buildHomeMetadata('zh-cn')

export default function ZhCnHomePage() {
  return <HomePage homeLocale="zh-cn" />
}
