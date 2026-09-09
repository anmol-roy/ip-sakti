'use client'

import { useI18n } from '@/components/providers/i18n-provider'

interface PagePlaceholderProps {
  pageKey: 'ask' | 'chats' | 'analysis' | 'sources' | 'review'
}

export function PagePlaceholder({ pageKey }: PagePlaceholderProps) {
  const { t } = useI18n()

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
      <h1 className="text-xl font-semibold text-foreground">
        {t(`pages.${pageKey}.title`)}
      </h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        {t(`pages.${pageKey}.description`)}
      </p>
      <span className="mt-2 rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
        {t('common.phaseNote')}
      </span>
    </div>
  )
}
