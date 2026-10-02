import type { Metadata } from 'next'
import { HeroSection } from '@/components/home/HeroSection'
import { CapabilitiesSection } from '@/components/home/CapabilitiesSection'
import { HowItWorksSection } from '@/components/home/HowItWorksSection'
import { ArchitectureSection } from '@/components/home/ArchitectureSection'
import { DemoVideoSection } from '@/components/home/DemoVideoSection'
import { TrustCtaSection } from '@/components/home/TrustCtaSection'
import { FooterSection } from '@/components/home/FooterSection'

export const metadata: Metadata = {
  title: 'Home - Anvashai',
  description: 'Evidence-first, multilingual AI assistant for intellectual property and regulatory guidance in Ayurveda.',
}

export default function HomePage() {
  return (
    <main className="flex-1">
      <HeroSection />
      <CapabilitiesSection />
      <HowItWorksSection />
      <ArchitectureSection />
      <DemoVideoSection />
      <TrustCtaSection />
      <FooterSection />
    </main>
  )
}
