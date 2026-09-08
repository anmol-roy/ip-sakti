'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

import { Brand } from '@/components/layout/brand'
import { useI18n } from '@/components/providers/i18n-provider'

export function AuthScreen({
  titleKey,
  subtitleKey,
  children,
}: {
  titleKey: string
  subtitleKey: string
  children: ReactNode
}) {
  const { t } = useI18n()

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-8 bg-background px-4 py-12">
      <div className="flex flex-col items-center gap-3 text-center">
        <Brand showText />
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            {t(titleKey)}
          </h1>
          <p className="max-w-xs text-sm text-muted-foreground">{t(subtitleKey)}</p>
        </div>
      </div>
      {children}
      <Link
        href="/"
        className="text-sm text-muted-foreground underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:text-foreground"
      >
        {t('auth.backHome')}
      </Link>
    </main>
  )
}
