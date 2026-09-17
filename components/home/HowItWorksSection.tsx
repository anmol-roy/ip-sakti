'use client'

import { useI18n } from '@/components/providers/i18n-provider'

const steps = [
  { num: '01', tk: 'step1Title', bk: 'step1Body', icon: 'ask' },
  { num: '02', tk: 'step2Title', bk: 'step2Body', icon: 'understand' },
  { num: '03', tk: 'step3Title', bk: 'step3Body', icon: 'investigate' },
  { num: '04', tk: 'step4Title', bk: 'step4Body', icon: 'evidence' },
]

function StepIcon({ name }: { name: string }) {
  const baseClass = "size-6 stroke-[1.5]"
  switch (name) {
    case 'ask':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      )
    case 'understand':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <circle cx="11" cy="14" r="2" />
          <line x1="16" y1="18" x2="21" y2="18" />
          <line x1="16" y1="14" x2="21" y2="14" />
        </svg>
      )
    case 'investigate':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          <line x1="16" y1="14" x2="22" y2="20" />
          <circle cx="19" cy="17" r="2" />
        </svg>
      )
    case 'evidence':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M9 15l2 2 4-4" />
          <circle cx="12" cy="15" r="4" />
        </svg>
      )
    default:
      return null
  }
}

export function HowItWorksSection() {
  const { t } = useI18n()

  return (
    <section
      id="how-it-works"
      className="relative border-b border-border bg-background px-4 py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            OUR APPROACH
          </span>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            {t('home.how.heading')}
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            From your question to trusted evidence — a structured, transparent research process.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          
          {/* Desktop Connecting Line */}
          <div className="absolute left-0 right-0 top-[22px] hidden h-px bg-border lg:block" aria-hidden="true" />

          {steps.map(({ num, tk, bk, icon }, index) => (
            <div key={num} className="relative flex flex-col items-center">
              
              {/* Number Badge */}
              <div className="relative z-10 mb-6 flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm ring-8 ring-background">
                <span className="text-sm font-bold tracking-wider">{num}</span>
              </div>

              {/* Arrow Indicator (Desktop only, positioned between badges) */}
              {index < steps.length - 1 && (
                <div className="absolute left-[calc(50%+22px)] top-[16px] z-20 hidden text-muted-foreground/40 lg:block">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              )}

              {/* Card */}
              <div className="flex w-full flex-col items-center rounded-2xl border border-border/60 bg-card px-6 py-8 text-center transition-colors hover:bg-muted/30">
                <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <StepIcon name={icon} />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-foreground">
                  {t(`home.how.${tk}`)}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(`home.how.${bk}`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}