'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Database,
  FileSearch,
  Shield,
  UserCheck,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { useI18n } from '@/components/providers/i18n-provider'
import { Button } from '@/components/ui/button'

const trustItems: { Icon: LucideIcon; tk: string; bk: string }[] = [
  { Icon: Database,  tk: 'sourceTitle', bk: 'sourceBody' },
  { Icon: FileSearch, tk: 'traceTitle', bk: 'traceBody' },
  { Icon: Shield,    tk: 'safeTitle',   bk: 'safeBody' },
  { Icon: UserCheck, tk: 'humanTitle',  bk: 'humanBody' },
]

export function TrustCtaSection() {
  const { t } = useI18n()

  return (
    <section className="border-b border-border bg-muted/30 px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">

        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {t('home.trust.heading')}
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map(({ Icon, tk, bk }) => (
            <div key={tk} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{t(`home.trust.${tk}`)}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{t(`home.trust.${bk}`)}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Users className="size-7" aria-hidden />
          </div>
          <h2 className="text-xl font-bold text-foreground md:text-2xl">
            {t('home.review.headingLine1')} {t('home.review.headingLine2')}
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">{t('home.review.body')}</p>
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            <Button render={<Link href="/ask" />} size="lg" className="gap-2">
              {t('home.final.ctaAsk')}
              <ArrowRight className="size-4" aria-hidden />
            </Button>
            <Button render={<Link href="/review" />} variant="outline" size="lg">
              {t('home.review.cta')}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground/60">{t('home.final.body')}</p>
        </div>

      </div>
    </section>
  )
}
