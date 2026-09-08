'use client'

import { useI18n } from '@/components/providers/i18n-provider'
import { navItems, type NavKey } from '@/components/navigation/nav-config'

export function PagePlaceholder({ pageKey }: { pageKey: NavKey }) {
  const { t } = useI18n()
  const item = navItems.find((entry) => entry.key === pageKey)
  const Icon = item?.icon

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10 md:px-8 md:py-14">
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-foreground"
        >
          {Icon ? <Icon className="size-5" /> : null}
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            {t(`pages.${pageKey}.title`)}
          </h1>
          <p className="text-sm text-muted-foreground">{t('common.phaseNote')}</p>
        </div>
      </div>
      <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
        {t(`pages.${pageKey}.description`)}
      </p>
    </div>
  )
}
