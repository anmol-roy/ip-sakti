'use client'

import { AlertCircle, RefreshCw, X } from 'lucide-react'
import { Button } from './button'

interface ErrorDisplayProps {
  error: string
  onRetry?: () => void
  onDismiss?: () => void
  showRetry?: boolean
  className?: string
}

export function ErrorDisplay({
  error,
  onRetry,
  onDismiss,
  showRetry = true,
  className = ''
}: ErrorDisplayProps) {
  return (
    <div className={`rounded-lg border border-destructive/50 bg-destructive/10 p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className="size-5 text-destructive shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-destructive">Error occurred</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          
          {showRetry && onRetry && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="gap-2"
              >
                <RefreshCw className="size-4" />
                Retry
              </Button>
            </div>
          )}
        </div>
        
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-muted-foreground hover:text-destructive transition-colors"
            aria-label="Dismiss error"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    </div>
  )
}
