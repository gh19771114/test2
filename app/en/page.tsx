import HomePage from '@/components/home/HomePage'
import { buildHomeMetadata } from '@/lib/i18n-home-seo'

export const metadata = buildHomeMetadata('en')

export default function EnHomePage() {
  return <HomePage homeLocale="en" />
}
