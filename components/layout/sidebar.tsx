'use client'

import { cn } from '@/lib/utils'
import { Brand } from '@/components/layout/brand'
import { NavItem } from '@/components/navigation/nav-item'
import { navItems } from '@/components/navigation/nav-config'
import { useI18n } from '@/components/providers/i18n-provider'

export function Sidebar({ collapsed }: { collapsed: boolean }) {
  const { t } = useI18n()

  return (
    <aside
      data-collapsed={collapsed}
      className={cn(
        'hidden shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 ease-out md:flex',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      <div
        className={cn(
          'flex h-14 items-center border-b border-sidebar-border',
          collapsed ? 'justify-center px-0' : 'px-4',
        )}
      >
        <Brand showText={!collapsed} />
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
            collapsed={collapsed}
          />
        ))}
      </nav>
      <div
        className={cn(
          'border-t border-sidebar-border p-3',
          collapsed && 'px-2',
        )}
      >
        <p
          className={cn(
            'truncate text-[11px] leading-tight text-muted-foreground',
            collapsed && 'text-center',
          )}
        >
          {collapsed ? t('app.name') : t('app.tagline')}
        </p>
      </div>
    </aside>
  )
}
