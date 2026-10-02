import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Chats - Anvashai',
  description: 'View and manage your research conversations with Sahayak.',
}

export default function ChatsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
