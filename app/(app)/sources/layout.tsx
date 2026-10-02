import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sources - Anvashai',
  description: 'Browse and manage your knowledge sources and references.',
}

export default function SourcesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
