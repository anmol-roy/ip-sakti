'use client'

import { ChevronDown } from 'lucide-react'
import { useI18n } from '@/components/providers/i18n-provider'

const archNodes = [
  { key: 'user',          accent: false },
  { key: 'interface',     accent: false },
  { key: 'understanding', accent: false },
  { key: 'context',       accent: false },
  { key: 'orchestrator',  accent: false },
  { key: 'sources',       accent: false },
  { key: 'fusion',        accent: false },
  { key: 'validation',    accent: false },
  { key: 'answer',        accent: true  },
  { key: 'review',        accent: false },
]

const notes = [
  { nk: 'noteRag',      color: 'bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-900' },
  { nk: 'noteAgent',    color: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900' },
  { nk: 'noteMulti',    color: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900' },
  { nk: 'noteFusion',   color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900' },
  { nk: 'noteCitation', color: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900' },
  { nk: 'noteHuman',    color: 'bg-primary/10 text-primary border-primary/20' },
]

export function ArchitectureSection() {
  const { t } = useI18n()

  return (
    <section className="border-b border-border bg-muted/30 px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {t('home.architecture.heading')}
          </h2>
        </div>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">

          {/* flow */}
          <div className="flex flex-col items-center gap-0">
            {archNodes.map(({ key, accent }, idx, arr) => (
              <div key={key} className="flex w-full max-w-xs flex-col items-center">
                <div className={`w-full rounded-lg border px-4 py-2.5 text-center text-sm font-medium ${
                  accent
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-border bg-card text-foreground'
                }`}>
                  {t(`home.architecture.${key}`)}
                </div>
                {idx < arr.length - 1 && (
                  <ChevronDown className="my-0.5 size-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>

          {/* legend */}
          <div className="flex flex-col gap-3">
            {notes.map(({ nk, color }) => (
              <div key={nk} className={`rounded-lg border px-4 py-3 text-sm font-medium ${color}`}>
                {t(`home.architecture.${nk}`)}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
