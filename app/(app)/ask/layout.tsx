import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ask - Anvashai',
  description: 'Ask questions about intellectual property, regulatory guidance, and Ayurveda formulations.',
}

export default function AskLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
