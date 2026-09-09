'use client'

import { useI18n } from '@/components/providers/i18n-provider'

const steps = [
  { num: '01', tk: 'step1Title', bk: 'step1Body' },
  { num: '02', tk: 'step2Title', bk: 'step2Body' },
  { num: '03', tk: 'step3Title', bk: 'step3Body' },
  { num: '04', tk: 'step4Title', bk: 'step4Body' },
]

export function HowItWorksSection() {
  const { t } = useI18n()

  return (
    <section id="how-it-works" className="border-b border-border px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {t('home.how.heading')}
          </h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ num, tk, bk }) => (
            <div key={num} className="flex flex-col gap-3">
              <div className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="text-base font-bold">{num}</span>
              </div>
              <h3 className="text-base font-semibold text-foreground">{t(`home.how.${tk}`)}</h3>
              <p className="text-sm text-muted-foreground">{t(`home.how.${bk}`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
