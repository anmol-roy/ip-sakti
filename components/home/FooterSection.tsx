'use client'

import Link from 'next/link'
import { useI18n } from '@/components/providers/i18n-provider'

export function FooterSection() {
  const { t } = useI18n()

  return (
    <footer className="border-t border-border bg-background px-4 py-12 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">

          {/* brand */}
          <div className="flex flex-col gap-2 sm:col-span-2 md:col-span-1">
            <p className="text-base font-bold text-foreground">{t('app.name')}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">{t('home.footer.description')}</p>
          </div>

          {/* product */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground">
              {t('home.footer.product')}
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/ask"      className="transition-colors hover:text-foreground">{t('nav.ask')}</Link></li>
              <li><Link href="/chats"    className="transition-colors hover:text-foreground">{t('nav.chats')}</Link></li>
              <li><Link href="/analysis" className="transition-colors hover:text-foreground">{t('nav.analysis')}</Link></li>
            </ul>
          </div>

          {/* research */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground">
              {t('home.footer.research')}
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/sources" className="transition-colors hover:text-foreground">{t('nav.sources')}</Link></li>
              <li><Link href="/review"  className="transition-colors hover:text-foreground">{t('nav.review')}</Link></li>
            </ul>
          </div>

          {/* legal */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground">
              {t('home.footer.legal')}
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="transition-colors hover:text-foreground">{t('home.footer.privacy')}</Link></li>
              <li><Link href="#" className="transition-colors hover:text-foreground">{t('home.footer.terms')}</Link></li>
              <li><Link href="#" className="transition-colors hover:text-foreground">{t('home.footer.disclaimer')}</Link></li>
            </ul>
          </div>

        </div>

        {/* bottom bar */}
        <div className="mt-8 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">{t('home.footer.copyright')}</p>
          <p className="mt-1 text-xs text-muted-foreground/60">{t('home.footer.legalNote')}</p>
        </div>
      </div>
    </footer>
  )
}
