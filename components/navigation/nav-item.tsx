'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Tooltip } from '@/components/ui/tooltip'

export function NavItem({
  href,
  icon: Icon,
  label,
  collapsed = false,
  onNavigate,
}: {
  href: string
  icon: LucideIcon
  label: string
  collapsed?: boolean
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)

  const link = (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? 'page' : undefined}
      title={collapsed ? undefined : label}
      className={cn(
        'group relative flex h-9 items-center gap-3 rounded-md px-3 text-sm font-medium outline-none transition-colors',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-sidebar',
        collapsed && 'justify-center px-0',
        isActive
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'absolute left-0 h-5 w-0.5 rounded-full bg-sidebar-primary transition-opacity',
          isActive ? 'opacity-100' : 'opacity-0',
        )}
      />
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  )

  return (
    <Tooltip content={label} side="right" disabled={!collapsed}>
      {link}
    </Tooltip>
  )
}
