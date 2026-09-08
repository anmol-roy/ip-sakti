'use client'

import { Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useI18n } from '@/components/providers/i18n-provider'

export function SearchButton() {
  const { t } = useI18n()

  return (
    <>
      <button
        type="button"
        title={t('header.searchHint')}
        className="hidden h-9 w-full max-w-md items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 text-sm text-muted-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring sm:flex"
      >
        <Search className="size-4 shrink-0" aria-hidden="true" />
        <span className="truncate">{t('header.search')}</span>
        <kbd className="ml-auto hidden rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground md:inline">
          ⌘K
        </kbd>
      </button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={t('header.search')}
        title={t('header.searchHint')}
        className="sm:hidden"
      >
        <Search className="size-4" aria-hidden="true" />
      </Button>
    </>
  )
}
