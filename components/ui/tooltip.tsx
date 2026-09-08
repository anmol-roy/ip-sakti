'use client'

import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip'
import type { ReactElement, ReactNode } from 'react'

import { cn } from '@/lib/utils'

export function TooltipProvider({
  children,
  delay = 200,
}: {
  children: ReactNode
  delay?: number
}) {
  return (
    <TooltipPrimitive.Provider delay={delay}>{children}</TooltipPrimitive.Provider>
  )
}

export function Tooltip({
  children,
  content,
  side = 'right',
  sideOffset = 10,
  disabled = false,
}: {
  children: ReactElement
  content: ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  sideOffset?: number
  disabled?: boolean
}) {
  if (disabled) {
    return children
  }

  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger render={children} />
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Positioner side={side} sideOffset={sideOffset}>
          <TooltipPrimitive.Popup
            className={cn(
              'z-50 rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs font-medium text-popover-foreground shadow-md',
              'origin-[var(--transform-origin)] transition-[transform,opacity] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0',
            )}
          >
            {content}
          </TooltipPrimitive.Popup>
        </TooltipPrimitive.Positioner>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
}
