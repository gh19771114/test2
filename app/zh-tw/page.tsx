import HomePage from '@/components/home/HomePage'
import { buildHomeMetadata } from '@/lib/i18n-home-seo'

export const metadata = buildHomeMetadata('zh-tw')

export default function ZhTwHomePage() {
  return <HomePage homeLocale="zh-tw" />
}
