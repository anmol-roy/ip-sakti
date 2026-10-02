import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chat - Anvashai',
  description: 'Continue your research conversation with Sahayak.',
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
