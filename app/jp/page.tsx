import HomePage from '@/components/home/HomePage'
import { buildHomeMetadata } from '@/lib/i18n-home-seo'

export const metadata = buildHomeMetadata('ja')

export default function JpHomePage() {
  return <HomePage homeLocale="ja" />
}
