'use client'

import Link from 'next/link'
import { ArrowRight, Database, FileSearch, Shield, UserCheck, Users } from 'lucide-react'
import { useI18n } from '@/components/providers/i18n-provider'
import { Button } from '@/components/ui/button'

const trustItems = [
  { icon: <Database className="size-5" />,  tk: 'sourceTitle', bk: 'sourceBody' },
  { icon: <FileSearch className="size-5" />, tk: 'traceTitle',  bk: 'traceBody' },
  { icon: <Shield className="size-5" />,     tk: 'safeTitle',   bk: 'safeBody' },
  { icon: <UserCheck className="size-5" />,  tk: 'humanTitle',  bk: 'humanBody' },
]

export function TrustCtaSection() {
  const { t } = useI18n()

  return (
    <section className="border-b border-border bg-muted/30 px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">

        {/* trust heading */}
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {t('home.trust.heading')}
          </h2>
        </div>

        {/* trust cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map(({ icon, tk, bk }) => (
            <div key={tk} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {icon}
              </div>
              <h3 className="text-sm font-semibold text-foreground">{t(`home.trust.${tk}`)}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{t(`home.trust.${bk}`)}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 flex flex-col items-center gap-4 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Users className="size-7" />
          </div>
          <h2 className="text-xl font-bold text-foreground md:text-2xl">
            {t('home.review.headingLine1')} {t('home.review.headingLine2')}
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">{t('home.review.body')}</p>
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            <Button asChild size="lg" className="gap-2">
              <Link href="/ask">
                {t('home.final.ctaAsk')}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/review">{t('home.review.cta')}</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground/60">{t('home.final.body')}</p>
        </div>

      </div>
    </section>
  )
}
