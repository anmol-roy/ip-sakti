import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Review - Anvashai',
  description: 'Review and analyze intellectual property documents and regulatory guidance.',
}

export default function ReviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
