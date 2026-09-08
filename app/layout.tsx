import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { I18nProvider } from '@/components/providers/i18n-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'IP-SAKTI Sahayak',
  description:
    'Evidence-first, multilingual AI assistant for intellectual property and regulatory guidance in Ayurveda, across national and international regimes.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ClerkProvider
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
          appearance={{
            variables: {
              colorPrimary: '#1f7a6b',
              borderRadius: '0.625rem',
            },
          }}
        >
          <I18nProvider>{children}</I18nProvider>
        </ClerkProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
