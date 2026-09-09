'use client'

import { Fragment } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  FileCheck2,
  FileText,
  FlaskConical,
  Leaf,
  MapPin,
  Mic,
  Paperclip,
  Scale,
  ShieldCheck,
  Sprout,
  Users,
} from 'lucide-react'
import { useI18n } from '@/components/providers/i18n-provider'
import { Button } from '@/components/ui/button'

const DOMAIN_CARDS = [
  { icon: FileText,     tk: 'patents' },
  { icon: Leaf,         tk: 'tk' },
  { icon: FlaskConical, tk: 'formulations' },
  { icon: Sprout,       tk: 'abs' },
  { icon: Scale,        tk: 'laws' },
] as const

const TRUST_ITEMS = [
  { icon: FileCheck2,  pk: 'pillSource',   dk: 'source' },
  { icon: ShieldCheck, pk: 'pillEvidence', dk: 'evidence' },
  { icon: Users,       pk: 'pillReview',   dk: 'review' },
] as const

const DECOR_DOMAINS = ['domain1', 'domain2', 'domain3', 'domain4', 'domain5'] as const
const PANEL_EXAMPLES = ['ex1', 'ex2', 'ex3', 'ex4'] as const
const EVIDENCE_STEPS = ['question', 'research', 'evidence', 'answer'] as const
const STATEMENTS = ['statement1', 'statement2', 'statement3'] as const

export function HeroSection() {
  const { t } = useI18n()

  return (
    <section className="relative min-h-[640px] overflow-hidden border-b border-border bg-background">

      {/* ── FULL-WIDTH BACKGROUND IMAGE (right half) ───────── */}
      <div aria-hidden className="absolute inset-0 z-0">
        <Image
          src="/image/hero/hero-research-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_center]"
        />
        {/* fade left so copy area is clean */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/10" />
        {/* fade bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
      </div>

      {/* ── MAIN CONTENT ───────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 py-14 md:px-10 md:py-20 xl:px-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[480px_1fr] lg:gap-0 xl:grid-cols-[520px_1fr]">

          {/* ── LEFT: COPY ─────────────────────────────────── */}
          <div className="flex flex-col gap-6 lg:py-4">

            {/* eyebrow */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
                {t('home.hero.eyebrow')}
              </span>
              <span aria-hidden className="h-px w-10 bg-amber-500/70" />
            </div>

            {/* heading */}
            <h1 className="text-4xl font-bold leading-[1.07] tracking-tight text-foreground sm:text-5xl xl:text-[3.5rem]">
              {t('home.hero.titleLine1')}
              <br />
              <em className="not-italic text-primary">{t('home.hero.titleLine2')}</em>
            </h1>

            {/* body */}
            <p className="max-w-[420px] text-base leading-relaxed text-muted-foreground">
              {t('home.hero.body')}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="group h-12 gap-2 rounded-full px-7 text-sm font-semibold">
                <Link href="/ask">
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  {t('home.hero.ctaAsk')}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 gap-2 rounded-full px-7 text-sm font-semibold"
              >
                <a href="#how-it-works">
                  <span className="flex size-5 items-center justify-center rounded-full border border-current">
                    <ChevronDown className="size-3" />
                  </span>
                  {t('home.hero.ctaHow')}
                </a>
              </Button>
            </div>

            {/* trust badges */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              {TRUST_ITEMS.map(({ icon: Icon, pk, dk }) => (
                <div key={pk} className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-background/80 text-primary shadow-sm">
                      <Icon className="size-3.5" aria-hidden />
                    </span>
                    <span className="text-xs font-semibold text-foreground">{t(`home.hero.${pk}`)}</span>
                  </div>
                  <p className="pl-9 text-[11px] leading-snug text-muted-foreground">
                    {t(`home.hero.trustDesc.${dk}`)}
                  </p>
                </div>
              ))}
            </div>

            {/* disclaimer */}
            <p className="flex items-start gap-1.5 text-[11px] text-muted-foreground/60">
              <span aria-hidden className="mt-0.5 flex size-3.5 shrink-0 items-center justify-center rounded-full border border-current">
                <span className="text-[8px]">i</span>
              </span>
              {t('home.hero.disclaimer')}
            </p>
          </div>

          {/* ── RIGHT: FLOATING UI ─────────────────────────── */}
          <div className="relative flex items-start justify-end">

            {/* top-right domain labels (decorative) */}
            <div aria-hidden className="absolute right-0 top-0 hidden flex-col items-end gap-1 lg:flex">
              {DECOR_DOMAINS.map((key, i) => (
                <span
                  key={key}
                  className={`text-[10px] font-medium uppercase tracking-[0.28em] ${
                    i === 4
                      ? 'text-foreground/80 underline decoration-amber-500 decoration-[1.5px] underline-offset-3'
                      : 'text-muted-foreground/50'
                  }`}
                >
                  {t(`home.hero.decor.${key}`)}
                </span>
              ))}
            </div>

            {/* domain cards + panel — tilted & connected */}
            <div className="relative flex w-full max-w-[720px] items-center justify-end pt-8 lg:pt-4">

              {/* domain card column — tilted left */}
              <div
                className="relative z-10 hidden flex-col gap-2.5 md:flex"
                style={{ transform: 'rotate(-3deg) translateX(28px)', transformOrigin: 'top right' }}
              >
                {DOMAIN_CARDS.map(({ icon: Icon, tk }, i) => (
                  <div
                    key={tk}
                    style={{ transform: `translateX(${i % 2 === 0 ? '0px' : '8px'})` }}
                    className="flex w-[188px] items-center gap-3 rounded-2xl border border-border bg-card/95 px-3 py-2.5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md xl:w-[200px]"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border bg-background/80 text-primary">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-tight text-foreground">
                        {t(`home.hero.visual.${tk}.title`)}
                      </p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {t(`home.hero.visual.${tk}.desc`)}
                      </p>
                    </div>
                  </div>
                ))}

                {/* connector SVG from last card into panel */}
                <svg
                  aria-hidden
                  className="absolute -right-7 bottom-10 overflow-visible"
                  width="36" height="60"
                  viewBox="0 0 36 60"
                  fill="none"
                >
                  <path
                    d="M2 0 Q2 30 34 30"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    className="text-primary/40"
                  />
                  <circle cx="34" cy="30" r="3" className="fill-primary/60" />
                </svg>
              </div>

              {/* Sahayak panel — tilted right */}
              <div
                role="img"
                aria-label={t('home.hero.panel.ariaLabel')}
                className="relative z-20 w-full max-w-[360px] rounded-2xl border border-border bg-card/97 shadow-2xl shadow-primary/10 backdrop-blur-md xl:max-w-[380px]"
                style={{ transform: 'rotate(2deg)', transformOrigin: 'top left' }}
              >
                {/* panel header */}
                <div className="flex items-center justify-between rounded-t-2xl border-b border-border bg-card px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                      <ShieldCheck className="size-4" aria-hidden />
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {t('home.hero.panel.title')}
                    </span>
                  </div>
                  <span className="text-[10px] tracking-wide text-muted-foreground">
                    {t('home.hero.panel.tagline')}
                  </span>
                </div>

                {/* textarea */}
                <div className="px-5 pt-4">
                  <p className="min-h-[68px] text-sm leading-relaxed text-muted-foreground/80">
                    {t('home.hero.panel.placeholder')}
                  </p>
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Paperclip className="size-4" aria-hidden />
                      <Mic className="size-4" aria-hidden />
                      <span className="flex items-center gap-1 rounded-full border border-border bg-muted/60 px-2 py-0.5 text-xs font-medium text-foreground">
                        <MapPin className="size-3" aria-hidden />
                        {t('home.hero.panel.region')}
                        <ChevronDown className="size-3 opacity-50" />
                      </span>
                    </div>
                    <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
                      <ArrowRight className="size-4" aria-hidden />
                    </span>
                  </div>
                </div>

                {/* examples */}
                <div className="rounded-b-2xl border-t border-border bg-muted/30 px-5 py-4">
                  <p className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-primary" aria-hidden />
                    {t('home.hero.panel.examplesLabel')}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {PANEL_EXAMPLES.map((key) => (
                      <span
                        key={key}
                        className="flex items-start justify-between gap-1 rounded-xl border border-border bg-card px-2.5 py-2 text-[11px] leading-snug text-foreground/80"
                      >
                        {t(`home.hero.panel.${key}`)}
                        <ArrowUpRight className="mt-0.5 size-3 shrink-0 text-muted-foreground" aria-hidden />
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── BOTTOM: evidence chain + statement ────────────── */}
        <div className="relative z-10 mt-10 flex flex-col items-start gap-4 border-t border-border/40 pt-5 lg:flex-row lg:items-center lg:justify-between">

          {/* evidence steps */}
          <div className="flex flex-wrap items-center gap-2">
            {EVIDENCE_STEPS.map((step, i) => (
              <Fragment key={step}>
                {i > 0 && <span aria-hidden className="h-px w-6 shrink-0 bg-border" />}
                <span className="flex items-center gap-1.5 rounded-full border border-border bg-card/80 py-1 pl-2 pr-3 backdrop-blur-sm">
                  <span
                    aria-hidden
                    style={{ animationDelay: `${i * 0.5}s` }}
                    className="size-1.5 rounded-full bg-primary motion-safe:animate-[hero-pulse-soft_3s_ease-in-out_infinite]"
                  />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {t(`home.hero.evidence.${step}`)}
                  </span>
                </span>
              </Fragment>
            ))}
          </div>

          {/* bottom statement */}
          <div aria-hidden className="flex items-center gap-3">
            {STATEMENTS.map((key, i) => (
              <Fragment key={key}>
                {i > 0 && <span className="h-3 w-px bg-border" />}
                <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
                  {t(`home.hero.decor.${key}`)}
                </span>
              </Fragment>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
