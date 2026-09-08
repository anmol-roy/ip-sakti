'use client'

import { Menu, PanelLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Brand } from '@/components/layout/brand'
import { SearchButton } from '@/components/navigation/search-button'
import { LanguageSelector } from '@/components/navigation/language-selector'
import { UserProfileButton } from '@/components/auth/user-profile-button'
import { useI18n } from '@/components/providers/i18n-provider'

export function Header({
  collapsed,
  onToggleSidebar,
  onOpenMobile,
}: {
  collapsed: boolean
  onToggleSidebar: () => void
  onOpenMobile: () => void
}) {
  const { t } = useI18n()

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-3 md:px-4">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onOpenMobile}
        aria-label={t('header.openMenu')}
      >
        <Menu className="size-4" aria-hidden="true" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="hidden md:inline-flex"
        onClick={onToggleSidebar}
        aria-label={t('header.toggleSidebar')}
        aria-pressed={collapsed}
      >
        <PanelLeft className="size-4" aria-hidden="true" />
      </Button>

      <div className="md:hidden">
        <Brand showText />
      </div>

      <div className="flex flex-1 justify-center px-1 sm:px-2">
        <SearchButton />
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <LanguageSelector />
        <UserProfileButton />
      </div>
    </header>
  )
}
