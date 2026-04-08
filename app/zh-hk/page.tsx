import HomePage from '@/components/home/HomePage'
import { buildHomeMetadata } from '@/lib/i18n-home-seo'

export const metadata = buildHomeMetadata('zh-hk')

export default function ZhHkHomePage() {
  return <HomePage homeLocale="zh-hk" />
}
