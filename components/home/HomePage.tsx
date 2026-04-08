import dynamic from 'next/dynamic'
import PageLayout from '@/components/PageLayout'
import SiteTitleBar from '@/components/SiteTitleBar'
import Hero from '@/components/Hero'
import Insights from '@/components/Insights'
import Contact from '@/components/Contact'
import { homeWebPageJsonLd, type HomeLocale } from '@/lib/i18n-home-seo'
import { HomePageContentProvider } from '@/contexts/HomePageContentContext'

const Services = dynamic(() => import('@/components/Services'), {
  loading: () => <div className="min-h-[600px]" />,
  ssr: true,
})

const Works = dynamic(() => import('@/components/Works'), {
  loading: () => <div className="min-h-[600px]" />,
  ssr: true,
})

type Props = { homeLocale: HomeLocale }

export default function HomePage({ homeLocale }: Props) {
  const jsonLd = homeWebPageJsonLd(homeLocale)
  return (
    <HomePageContentProvider homeLocale={homeLocale}>
      <PageLayout topBanner={<SiteTitleBar />}>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Hero />
        <Insights />
        <Services />
        <Works />
        <Contact />
      </PageLayout>
    </HomePageContentProvider>
  )
}
