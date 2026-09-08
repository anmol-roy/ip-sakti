'use client'

import { Dialog } from '@base-ui/react/dialog'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Brand } from '@/components/layout/brand'
import { NavItem } from '@/components/navigation/nav-item'
import { navItems } from '@/components/navigation/nav-config'
import { useI18n } from '@/components/providers/i18n-provider'

export function MobileSidebar({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useI18n()

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop
          className={cn(
            'fixed inset-0 z-50 bg-black/50 transition-opacity duration-200 md:hidden',
            'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0',
          )}
        />
        <Dialog.Popup
          className={cn(
            'fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-xl outline-none transition-transform duration-200 ease-out md:hidden',
            'data-[starting-style]:-translate-x-full data-[ending-style]:-translate-x-full',
          )}
        >
          <Dialog.Title className="sr-only">{t('sidebar.navigation')}</Dialog.Title>
          <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
            <Brand showText />
            <Dialog.Close
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t('header.closeMenu')}
                />
              }
            >
              <X className="size-4" aria-hidden="true" />
            </Dialog.Close>
          </div>
          <nav
            aria-label={t('sidebar.navigation')}
            className="flex flex-1 flex-col gap-1 overflow-y-auto p-2"
          >
            {navItems.map((item) => (
              <NavItem
                key={item.key}
                href={item.href}
                icon={item.icon}
                label={t(item.labelKey)}
                onNavigate={() => onOpenChange(false)}
              />
            ))}
          </nav>
          <div className="border-t border-sidebar-border p-4">
            <p className="text-[11px] leading-tight text-muted-foreground">
              {t('app.tagline')}
            </p>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
