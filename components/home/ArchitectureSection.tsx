'use client'

import { useI18n } from '@/components/providers/i18n-provider'

// Left Column: Timeline Steps
const steps = [
  { num: '01', key: 'user', icon: 'user' },
  { num: '02', key: 'interface', icon: 'monitor' },
  { num: '03', key: 'understanding', icon: 'brain' },
  { num: '04', key: 'context', icon: 'globe' },
  { num: '05', key: 'orchestrator', icon: 'cpu' },
  { num: '06', key: 'sources', icon: 'database' },
  { num: '07', key: 'fusion', icon: 'git-merge' },
  { num: '08', key: 'validation', icon: 'check-circle' },
  { num: '09', key: 'answer', icon: 'file-text' },
  { num: '10', key: 'review', icon: 'users' },
]

// Right Column: Capability Cards
const capabilities = [
  { 
    key: 'noteRag', 
    icon: 'layers',
    color: 'bg-violet-500/5 dark:bg-violet-500/10 border-violet-200/50 dark:border-violet-800/50 text-violet-700 dark:text-violet-300' 
  },
  { 
    key: 'noteAgent', 
    icon: 'cpu',
    color: 'bg-blue-500/5 dark:bg-blue-500/10 border-blue-200/50 dark:border-blue-800/50 text-blue-700 dark:text-blue-300' 
  },
  { 
    key: 'noteMulti', 
    icon: 'globe',
    color: 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-200/50 dark:border-amber-800/50 text-amber-700 dark:text-amber-300' 
  },
  { 
    key: 'noteFusion', 
    icon: 'git-merge',
    color: 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-200/50 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300' 
  },
  { 
    key: 'noteCitation', 
    icon: 'shield-check',
    color: 'bg-rose-500/5 dark:bg-rose-500/10 border-rose-200/50 dark:border-rose-800/50 text-rose-700 dark:text-rose-300' 
  },
  { 
    key: 'noteHuman', 
    icon: 'users',
    color: 'bg-cyan-500/5 dark:bg-cyan-500/10 border-cyan-200/50 dark:border-cyan-800/50 text-cyan-700 dark:text-cyan-300' 
  },
]

function StepIcon({ name }: { name: string }) {
  const baseClass = "size-5 stroke-[1.5] shrink-0"
  switch (name) {
    case 'user': return <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    case 'monitor': return <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
    case 'brain': return <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a5 5 0 0 0-5 5v2a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5z"/><path d="M12 14a5 5 0 0 0-5 5v2a5 5 0 0 0 10 0v-2a5 5 0 0 0-5-5z"/></svg>
    case 'globe': return <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
    case 'cpu': return <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>
    case 'database': return <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
    case 'git-merge': return <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 0 9 9"/></svg>
    case 'check-circle': return <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    case 'file-text': return <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
    case 'users': return <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    case 'layers': return <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
    case 'shield-check': return <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
    default: return null
  }
}

export function ArchitectureSection() {
  const { t } = useI18n()

  return (
    <section className="border-b border-border bg-[#FAFAF8] px-4 py-20 md:px-8 md:py-28 dark:bg-background">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            OUR PROCESS
          </span>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            {t('home.architecture.heading')}
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            A structured, transparent workflow from your question to reliable, source-backed insights.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
          <div className="relative">
            <div className="absolute left-5 top-2 bottom-2 w-px bg-slate-200" aria-hidden="true" />

            <div className="space-y-4">
              {steps.map(({ num, key, icon }) => (
                <div key={key} className="relative pl-12">
                  <div className="absolute left-0 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-sm">
                    {num}
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex size-8 items-center justify-center rounded-md bg-slate-100 text-slate-600">
                        <StepIcon name={icon} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-slate-900">
                          {t(`home.architecture.${key}`)}
                        </div>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">
                          {t(`home.architecture.${key}Desc`) || 'System process step.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              SYSTEM CAPABILITIES
            </div>

            <div className="space-y-3">
              {capabilities.map(({ key, icon, color }) => (
                <div
                  key={key}
                  className={`rounded-2xl border p-4 ${color}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-8 items-center justify-center rounded-md bg-white/60 text-current shadow-sm">
                      <StepIcon name={icon} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-slate-900 dark:text-foreground">
                        {t(`home.architecture.${key}`)}
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-muted-foreground">
                        {t(`home.architecture.${key}Desc`) || 'Advanced system capability.'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}