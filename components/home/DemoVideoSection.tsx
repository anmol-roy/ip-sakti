'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import { useI18n } from '@/components/providers/i18n-provider'

export function DemoVideoSection() {
  const { t } = useI18n()
  const [clicked, setClicked] = useState(false)

  return (
    <section className="border-b border-border px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {t('home.demo.heading')}
          </h2>
          <p className="mt-2 text-muted-foreground">{t('home.demo.body')}</p>
        </div>
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-card shadow-md">
          <div className="flex h-full flex-col items-center justify-center gap-4 bg-muted/20">
            <button
              type="button"
              aria-label={t('home.demo.play')}
              onClick={() => setClicked(true)}
              className="flex size-16 items-center justify-center rounded-full border-2 border-primary bg-background text-primary shadow transition-all hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Play className="size-7 translate-x-0.5" />
            </button>
            <p className="text-sm font-medium text-foreground">{t('home.demo.label')}</p>
            {clicked && (
              <p className="text-xs text-muted-foreground">{t('home.demo.placeholder')}</p>
            )}
            <p className="absolute bottom-4 px-4 text-center text-xs italic text-muted-foreground/60">
              {t('home.demo.placeholder')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
