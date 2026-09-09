'use client'

import { FileText, Leaf, Beaker, Shield, Scale, Globe, type LucideIcon } from 'lucide-react'
import { useI18n } from '@/components/providers/i18n-provider'

const items: { Icon: LucideIcon; tk: string; bk: string }[] = [
  { Icon: FileText,  tk: 'patentTitle',      bk: 'patentBody' },
  { Icon: Leaf,      tk: 'tkTitle',          bk: 'tkBody' },
  { Icon: Beaker,    tk: 'formulationTitle', bk: 'formulationBody' },
  { Icon: Shield,    tk: 'absTitle',         bk: 'absBody' },
  { Icon: Scale,     tk: 'lawTitle',         bk: 'lawBody' },
  { Icon: Globe,     tk: 'multiTitle',       bk: 'multiBody' },
]

export function CapabilitiesSection() {
  const { t } = useI18n()

  return (
    <section className="border-b border-border bg-muted/30 px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {t('home.capabilities.heading')}
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ Icon, tk, bk }) => (
            <div
              key={tk}
              className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-foreground">{t(`home.capabilities.${tk}`)}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{t(`home.capabilities.${bk}`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
