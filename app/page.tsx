// app/page.tsx

import PageLayout from '@/components/PageLayout'
import Hero from '@/components/Hero'
import Insights from '@/components/Insights'
import Services from '@/components/Services'
import Works from '@/components/Works'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <PageLayout>
      <Hero />
      <Insights />
      <Services />
      <Works />
      <Contact />
    </PageLayout>
  )
}
