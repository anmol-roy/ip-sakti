'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'

import { TooltipProvider } from '@/components/ui/tooltip'
import { Sidebar } from '@/components/layout/sidebar'
import { MobileSidebar } from '@/components/layout/mobile-sidebar'
import { Header } from '@/components/layout/header'

const STORAGE_KEY = 'ipsakti.sidebar'

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setCollapsed(stored === 'collapsed')
    }
  }, [])

  const toggleSidebar = useCallback(() => {
    setCollapsed((current) => {
      const next = !current
      window.localStorage.setItem(STORAGE_KEY, next ? 'collapsed' : 'expanded')
      return next
    })
  }, [])

  return (
    <TooltipProvider>
      <div className="flex h-svh w-full overflow-hidden bg-background">
        <Sidebar collapsed={collapsed} />
        <MobileSidebar open={mobileOpen} onOpenChange={setMobileOpen} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header
            collapsed={collapsed}
            onToggleSidebar={toggleSidebar}
            onOpenMobile={() => setMobileOpen(true)}
          />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  )
}
