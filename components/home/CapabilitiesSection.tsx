'use client'

import { FileText, Leaf, Beaker, Shield, Scale, Globe } from 'lucide-react'
import { useI18n } from '@/components/providers/i18n-provider'

const items = [
  { icon: <FileText className="size-5" />,  tk: 'patentTitle',      bk: 'patentBody' },
  { icon: <Leaf className="size-5" />,       tk: 'tkTitle',          bk: 'tkBody' },
  { icon: <Beaker className="size-5" />,     tk: 'formulationTitle', bk: 'formulationBody' },
  { icon: <Shield className="size-5" />,     tk: 'absTitle',         bk: 'absBody' },
  { icon: <Scale className="size-5" />,      tk: 'lawTitle',         bk: 'lawBody' },
  { icon: <Globe className="size-5" />,      tk: 'multiTitle',       bk: 'multiBody' },
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
          {items.map(({ icon, tk, bk }) => (
            <div
              key={tk}
              className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {icon}
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
