'use client'

import { Menu } from '@base-ui/react/menu'
import { Check, ChevronDown, Globe } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/components/providers/i18n-provider'
import { locales, localeNames } from '@/i18n/config'

export function LanguageSelector() {
  const { locale, setLocale, t } = useI18n()

  return (
    <Menu.Root>
      <Menu.Trigger
        render={<Button variant="ghost" size="sm" aria-label={t('header.language')} />}
      >
        <Globe className="size-4" aria-hidden="true" />
        <span className="hidden lg:inline">{localeNames[locale].native}</span>
        <ChevronDown className="size-3.5 opacity-60" aria-hidden="true" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner side="bottom" align="end" sideOffset={8} className="z-50">
          <Menu.Popup
            className={cn(
              'min-w-56 rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md outline-none',
              'origin-[var(--transform-origin)] transition-[transform,opacity] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0',
            )}
          >
            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
              {t('language.label')}
            </div>
            {locales.map((code) => (
              <Menu.Item
                key={code}
                onClick={() => setLocale(code)}
                className={cn(
                  'flex cursor-pointer items-center justify-between gap-3 rounded-md px-2 py-1.5 text-sm outline-none select-none',
                  'data-[highlighted]:bg-muted data-[highlighted]:text-foreground',
                )}
              >
                <span>{localeNames[code].native}</span>
                {locale === code && (
                  <Check className="size-4 text-primary" aria-hidden="true" />
                )}
              </Menu.Item>
            ))}
            <div className="mx-1 my-1 h-px bg-border" role="separator" />
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              {t('language.comingSoon')}
            </div>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}
