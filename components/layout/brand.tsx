'use client'

import { ShieldCheck } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useI18n } from '@/components/providers/i18n-provider'

export function Brand({
  showText = true,
  className,
}: {
  showText?: boolean
  className?: string
}) {
  const { t } = useI18n()

  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <span
        aria-hidden="true"
        className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground"
      >
        <ShieldCheck className="size-4" />
      </span>
      {showText ? (
        <span className="flex min-w-0 flex-col leading-none">
          <span className="truncate text-sm font-semibold tracking-tight">
            {t('app.name')}
          </span>
        </span>
      ) : (
        <span className="sr-only">{t('app.name')}</span>
      )}
    </span>
  )
}
