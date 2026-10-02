import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Analysis - Anvashai',
  description: 'Analyze Ayurvedic formulations for intellectual property and regulatory compliance.',
}

export default function AnalysisLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
