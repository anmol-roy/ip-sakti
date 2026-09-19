'use client'

import {
  FileText,
  Leaf,
  Beaker,
  Shield,
  Scale,
  Globe,
  Search,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useI18n } from '@/components/providers/i18n-provider'

/* ════════════════════════════════════════════════════════════
   SVG ILLUSTRATIONS
   ════════════════════════════════════════════════════════════ */
function PatentDocsSVG() {
  return (
    <svg viewBox="0 0 200 160" className="h-full w-full" fill="none" aria-hidden>
      <g transform="translate(15 10) rotate(-6 80 70)">
        <rect x="0" y="0" width="100" height="130" rx="3" fill="#eef5f1" stroke="#c9ddd4" strokeWidth="0.8" />
        <text x="50" y="24" textAnchor="middle" fontSize="8" fill="#8fb3a4" fontFamily="Georgia, serif" letterSpacing="1">PATENT</text>
        <line x1="14" y1="34" x2="86" y2="34" stroke="#d7e5dd" strokeWidth="0.8" />
        <line x1="14" y1="42" x2="86" y2="42" stroke="#d7e5dd" strokeWidth="0.8" />
        <line x1="14" y1="50" x2="70" y2="50" stroke="#d7e5dd" strokeWidth="0.8" />
        <g transform="translate(38 68)">
          <path d="M0 20 Q14 4 32 8 Q26 28 4 30 Q0 26 0 20 Z" fill="#dcebe3" stroke="#9fbdae" strokeWidth="0.8" />
          <path d="M4 24 Q16 14 30 12" stroke="#9fbdae" strokeWidth="0.6" fill="none" />
        </g>
      </g>
      <g transform="translate(55 22) rotate(5 60 70)">
        <rect x="0" y="0" width="110" height="135" rx="3" fill="#ffffff" stroke="#b9d2c6" strokeWidth="1" />
        <text x="55" y="28" textAnchor="middle" fontSize="9" fill="#7fa593" fontFamily="Georgia, serif" letterSpacing="2">PATENT</text>
        <line x1="18" y1="40" x2="92" y2="40" stroke="#d7e5dd" strokeWidth="0.9" />
        <line x1="18" y1="48" x2="92" y2="48" stroke="#d7e5dd" strokeWidth="0.9" />
        <line x1="18" y1="56" x2="80" y2="56" stroke="#d7e5dd" strokeWidth="0.9" />
        <line x1="18" y1="64" x2="92" y2="64" stroke="#d7e5dd" strokeWidth="0.9" />
        <g transform="translate(40 80)">
          <path d="M0 24 Q18 4 42 10 Q36 36 6 40 Q0 34 0 24 Z" fill="#cfe4d9" stroke="#7fa593" strokeWidth="1" />
          <path d="M6 30 Q20 16 38 14" stroke="#7fa593" strokeWidth="0.7" fill="none" />
          <path d="M10 28 L14 24 M16 24 L20 20 M22 20 L26 18 M28 18 L32 16" stroke="#7fa593" strokeWidth="0.5" />
          <path d="M6 30 L2 34 M14 26 L10 30 M22 22 L18 26 M30 18 L26 22" stroke="#7fa593" strokeWidth="0.5" />
        </g>
      </g>
    </svg>
  )
}

function LeafSVG() {
  return (
    <svg viewBox="0 0 140 110" className="h-full w-full" fill="none" aria-hidden>
      <path d="M20 100 Q55 70 90 22" stroke="#7fa593" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      {[{ x: 34, y: 78, r: -40, s: 1.0 }, { x: 48, y: 62, r: -30, s: 1.1 }, { x: 62, y: 48, r: -20, s: 1.2 }, { x: 76, y: 34, r: -10, s: 1.0 }].map((l, i) => (
        <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.r}) scale(${l.s})`}>
          <path d="M0 0 Q-14 -10 -22 -4 Q-20 12 -2 10 Q2 6 0 0 Z" fill="#bfd9cb" stroke="#7fa593" strokeWidth="0.9" />
          <path d="M-2 2 Q-12 -2 -18 0" stroke="#7fa593" strokeWidth="0.5" fill="none" />
        </g>
      ))}
      {[{ x: 42, y: 80, r: 30 }, { x: 58, y: 64, r: 40 }, { x: 74, y: 48, r: 50 }, { x: 88, y: 32, r: 60 }].map((l, i) => (
        <g key={`r${i}`} transform={`translate(${l.x} ${l.y}) rotate(${l.r})`}>
          <path d="M0 0 Q14 -10 22 -4 Q20 12 2 10 Q-2 6 0 0 Z" fill="#d4e6da" stroke="#7fa593" strokeWidth="0.9" />
          <path d="M2 2 Q12 -2 18 0" stroke="#7fa593" strokeWidth="0.5" fill="none" />
        </g>
      ))}
      <g transform="translate(90 22) rotate(-15)">
        <path d="M0 0 Q-12 -12 -8 -26 Q8 -22 6 -6 Q4 0 0 0 Z" fill="#a9c8b8" stroke="#7fa593" strokeWidth="1" />
      </g>
    </svg>
  )
}

function BeakerSVG() {
  return (
    <svg viewBox="0 0 140 110" className="h-full w-full" fill="none" aria-hidden>
      <path d="M50 25 L50 48 L34 82 Q31 92 42 92 L98 92 Q109 92 106 82 L90 48 L90 25 Z" fill="#ffffff" stroke="#9fbdae" strokeWidth="1.4" />
      <path d="M44 66 L96 66 L106 82 Q109 92 98 92 L42 92 Q31 92 34 82 Z" fill="#cfe4d9" />
      <line x1="46" y1="25" x2="94" y2="25" stroke="#7fa593" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="62" cy="78" r="2" fill="#ffffff" opacity="0.6" />
      <circle cx="76" cy="82" r="1.5" fill="#ffffff" opacity="0.5" />
      <circle cx="86" cy="76" r="1.8" fill="#ffffff" opacity="0.6" />
      <g transform="translate(112 62) rotate(-30)"><path d="M0 0 Q-14 -8 -20 -2 Q-14 12 2 8 Q4 4 0 0 Z" fill="#cfe4d9" stroke="#7fa593" strokeWidth="0.9" /></g>
      <g transform="translate(34 60) rotate(30)"><path d="M0 0 Q14 -8 20 -2 Q14 12 -2 8 Q-4 4 0 0 Z" fill="#cfe4d9" stroke="#7fa593" strokeWidth="0.9" /></g>
      <g transform="translate(120 44) rotate(-50)"><path d="M0 0 Q-10 -6 -14 -2 Q-10 8 2 6 Q3 2 0 0 Z" fill="#d4e6da" stroke="#7fa593" strokeWidth="0.8" /></g>
    </svg>
  )
}

function ShieldHandSVG() {
  return (
    <svg viewBox="0 0 140 110" className="h-full w-full" fill="none" aria-hidden>
      <g transform="translate(20 60)">
        <path d="M0 20 Q4 6 20 4 L42 2 Q50 0 52 6 L44 12 L26 16 Z" fill="#eaf2ee" stroke="#9fbdae" strokeWidth="1" />
        <path d="M20 4 Q16 -4 22 -8 M30 2 Q28 -6 34 -10 M38 2 Q38 -6 42 -8" stroke="#9fbdae" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      </g>
      <g transform="translate(38 60)">
        <path d="M0 0 Q-2 -14 6 -22" stroke="#7fa593" strokeWidth="1" fill="none" />
        <path d="M6 -22 Q0 -28 2 -36 Q12 -34 12 -24 Q10 -22 6 -22 Z" fill="#cfe4d9" stroke="#7fa593" strokeWidth="0.9" />
        <path d="M8 -22 Q16 -28 14 -36 Q4 -34 6 -24 Q6 -22 8 -22 Z" fill="#bcd7c7" stroke="#7fa593" strokeWidth="0.9" />
      </g>
      <g transform="translate(72 22)">
        <path d="M24 0 L46 8 L46 34 Q46 56 24 68 Q2 56 2 34 L2 8 Z" fill="#ffffff" stroke="#7fa593" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M14 32 L22 40 L38 22" stroke="#5b8a76" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  )
}

function CourthouseSVG() {
  return (
    <svg viewBox="0 0 160 120" className="h-full w-full" fill="none" aria-hidden>
      <path d="M80 8 Q60 8 56 26 L104 26 Q100 8 80 8 Z" fill="#e6f0ea" stroke="#b9d2c6" strokeWidth="0.9" />
      <circle cx="80" cy="6" r="2.5" fill="#c9ddd4" stroke="#7fa593" strokeWidth="0.7" />
      <line x1="80" y1="0" x2="80" y2="4" stroke="#7fa593" strokeWidth="0.8" />
      <rect x="46" y="26" width="68" height="6" fill="#eef5f1" stroke="#9fbdae" strokeWidth="0.9" />
      <rect x="52" y="34" width="56" height="14" fill="#f4f8f6" stroke="#b9d2c6" strokeWidth="0.8" />
      <circle cx="80" cy="41" r="3" fill="none" stroke="#7fa593" strokeWidth="0.7" />
      {[58, 68, 78, 88, 98].map((x) => (
        <g key={x}>
          <rect x={x - 2} y="50" width="4" height="38" fill="#ffffff" stroke="#9fbdae" strokeWidth="0.8" />
          <rect x={x - 3} y="48" width="6" height="3" fill="#eef5f1" stroke="#9fbdae" strokeWidth="0.7" />
          <rect x={x - 3} y="88" width="6" height="3" fill="#eef5f1" stroke="#9fbdae" strokeWidth="0.7" />
        </g>
      ))}
      <rect x="46" y="92" width="68" height="4" fill="#e6f0ea" stroke="#b9d2c6" strokeWidth="0.7" />
      <rect x="40" y="96" width="80" height="5" fill="#dcebe3" stroke="#b9d2c6" strokeWidth="0.7" />
      <rect x="34" y="101" width="92" height="5" fill="#cfe4d9" stroke="#9fbdae" strokeWidth="0.7" />
      <rect x="28" y="106" width="104" height="6" fill="#bfd9cb" stroke="#7fa593" strokeWidth="0.8" />
    </svg>
  )
}

function LanguageCharsSVG() {
  return (
    <svg viewBox="0 0 160 100" className="h-full w-full" fill="none" aria-hidden>
      <g>
        <ellipse cx="52" cy="44" rx="22" ry="20" fill="#e6f0ea" stroke="#b9d2c6" strokeWidth="1" />
        <path d="M42 62 L38 72 L50 64 Z" fill="#e6f0ea" stroke="#b9d2c6" strokeWidth="1" />
        <text x="52" y="52" textAnchor="middle" fontSize="20" fill="#7fa593" fontFamily="serif">अ</text>
      </g>
      <g>
        <ellipse cx="104" cy="36" rx="16" ry="15" fill="#eef5f1" stroke="#b9d2c6" strokeWidth="1" />
        <path d="M96 50 L92 58 L102 51 Z" fill="#eef5f1" stroke="#b9d2c6" strokeWidth="1" />
        <text x="104" y="43" textAnchor="middle" fontSize="15" fill="#8fb3a4" fontFamily="Georgia, serif" fontWeight="600">A</text>
      </g>
      <g>
        <ellipse cx="128" cy="58" rx="15" ry="14" fill="#dcebe3" stroke="#b9d2c6" strokeWidth="1" />
        <path d="M120 70 L116 78 L126 72 Z" fill="#dcebe3" stroke="#b9d2c6" strokeWidth="1" />
        <text x="128" y="64" textAnchor="middle" fontSize="15" fill="#7fa593" fontFamily="serif">ಕ</text>
      </g>
      <circle cx="24" cy="72" r="1.8" fill="#bfd9cb" />
      <circle cx="30" cy="78" r="1.2" fill="#cfe4d9" />
      <circle cx="20" cy="80" r="1.2" fill="#cfe4d9" />
    </svg>
  )
}

/* ════════════════════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════════════════════ */
const primary = { Icon: FileText, tk: 'patentTitle', bk: 'patentBody' }

// First 4 cards go in 2x2 grid
const supportingGrid: { Icon: LucideIcon; tk: string; bk: string; Svg: () => React.ReactElement }[] = [
  { Icon: Leaf,   tk: 'tkTitle',          bk: 'tkBody',          Svg: LeafSVG },
  { Icon: Beaker, tk: 'formulationTitle', bk: 'formulationBody', Svg: BeakerSVG },
  { Icon: Shield, tk: 'absTitle',         bk: 'absBody',         Svg: ShieldHandSVG },
  { Icon: Scale,  tk: 'lawTitle',         bk: 'lawBody',         Svg: CourthouseSVG },
]

// Last card goes full width
const supportingFull: { Icon: LucideIcon; tk: string; bk: string; Svg: () => React.ReactElement }[] = [
  { Icon: Globe, tk: 'multiTitle', bk: 'multiBody', Svg: LanguageCharsSVG },
]

const workflow = [
  { key: 'yourQuestion', desc: 'yourQuestionDesc', Icon: Search },
  { key: 'patentSearch', desc: 'patentSearchDesc', Icon: Search },
  { key: 'priorArt',     desc: 'priorArtDesc',     Icon: FileText },
  { key: 'evidence',     desc: 'evidenceDesc',     Icon: CheckCircle2 },
]
const primaryChecks = ['checks.patents', 'checks.wipo', 'checks.priorArt', 'checks.evidence']

/* ════════════════════════════════════════════════════════════
   COMPONENT
   ════════════════════════════════════════════════════════════ */
export function CapabilitiesSection() {
  const { t } = useI18n()

  return (
    <section className="relative border-b border-border bg-[#f4f8f6] px-4 py-10 md:px-8 md:py-16">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg className="absolute -right-40 top-0 h-[400px] w-[400px] opacity-20" viewBox="0 0 600 600" fill="none">
          <path d="M100 500 Q300 100 550 200" stroke="#cfe4d9" strokeWidth="1" fill="none" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl">
        
        {/* ── HEADER ── */}
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-[#c9ddd4]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#7fa593]">
              Research Capabilities
            </span>
            <span className="h-px w-8 bg-[#c9ddd4]" />
          </div>
          <h2 className="mb-4 text-3xl font-bold leading-tight text-foreground md:text-4xl">
            One workspace for complex IP research
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-[15px]">
            Bring patents, traditional knowledge, formulations, ABS and IP law research
            into one evidence-focused workspace.
          </p>
        </div>

        {/* ── MAIN GRID ── */}
        <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">

          {/* ══════════ LEFT: PRIMARY CARD (Spans full height) ══════════ */}
          <div className="lg:col-span-5">
            <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#dcebe3] bg-[#f9fcfb] p-6 transition-colors duration-300 hover:border-[#a9c8b8] md:p-7">
              
              {/* Icon */}
              <span className="mb-4 flex size-10 items-center justify-center rounded-lg border border-[#cfe4d9] bg-[#eef5f1] text-[#5b8a76]">
                <FileText className="size-5" aria-hidden strokeWidth={1.5} />
              </span>

              {/* Title */}
              <div className="relative mb-6">
                <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.24em] text-[#8fb3a4]">
                  {t('home.capabilities.primaryLabel')}
                </p>
                <h3 className="mb-2 text-xl font-bold leading-tight text-foreground md:text-2xl">
                  {t(`home.capabilities.${primary.tk}`)}
                </h3>
                <p className="max-w-[80%] text-xs leading-relaxed text-muted-foreground md:text-[13px]">
                  {t(`home.capabilities.${primary.bk}`)}
                </p>

                {/* Illustration */}
                <div className="pointer-events-none absolute -right-4 top-0 hidden h-[120px] w-[150px] lg:block">
                  <PatentDocsSVG />
                </div>
              </div>

              {/* Workflow + Checklist (Side by side) */}
              <div className="mt-auto grid grid-cols-[1fr_auto] gap-3">
                
                {/* Workflow Steps */}
                <div className="rounded-xl border border-[#e6f0ea] bg-white/50 p-4">
                  <ol className="space-y-3">
                    {workflow.map(({ key, desc, Icon }, i) => (
                      <li key={key} className="relative flex gap-2.5">
                        {i < workflow.length - 1 && (
                          <span className="absolute left-[11px] top-6 h-[18px] w-px bg-[#dcebe3]" />
                        )}
                        <span className="relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border border-[#cfe4d9] bg-white text-[#5b8a76]">
                          <Icon className="size-3" aria-hidden strokeWidth={2} />
                        </span>
                        <div className="min-w-0 pt-0.5">
                          <p className="text-[11px] font-semibold leading-tight text-foreground">
                            {t(`home.capabilities.workflow.${key}`)}
                          </p>
                          <p className="text-[10px] leading-snug text-muted-foreground">
                            {t(`home.capabilities.workflow.${desc}`)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Checklist */}
                <ul className="flex flex-col gap-2 self-start rounded-xl border border-[#e6f0ea] bg-[#f4f8f6] px-3.5 py-3">
                  {primaryChecks.map((key) => (
                    <li key={key} className="flex items-center gap-2 whitespace-nowrap">
                      <CheckCircle2 className="size-3.5 shrink-0 text-[#7fa593]" aria-hidden strokeWidth={2} />
                      <span className="text-[10px] font-medium text-foreground/80">
                        {t(`home.capabilities.${key}`)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <a
                href="#"
                className="mt-5 inline-flex items-center justify-center gap-2 self-center rounded-full border border-[#cfe4d9] bg-white px-5 py-2 text-[11px] font-medium text-[#5b8a76] transition-colors hover:bg-[#f9fcfb] hover:border-[#a9c8b8]"
              >
                {t('home.capabilities.primaryCta')}
                <ArrowRight className="size-3" aria-hidden strokeWidth={2} />
              </a>
            </div>
          </div>

          {/* ══════════ RIGHT: 2x2 GRID + FULL WIDTH CARD ══════════ */}
          <div className="lg:col-span-7">
            <div className="flex h-full flex-col gap-4">
              
              {/* 2x2 Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {supportingGrid.map(({ Icon, tk, bk, Svg }) => (
                  <div
                    key={tk}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#dcebe3] bg-[#f9fcfb] p-5 transition-colors duration-300 hover:border-[#a9c8b8] hover:bg-white md:p-6"
                  >
                    {/* Background Illustration */}
                    <div className="pointer-events-none absolute -right-4 top-1/2 h-28 w-32 -translate-y-1/2 opacity-80 transition-opacity duration-300 group-hover:opacity-100">
                      <Svg />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex h-full flex-col">
                      <span className="mb-3 flex size-9 items-center justify-center rounded-lg border border-[#dcebe3] bg-white text-[#5b8a76] transition-colors group-hover:border-[#a9c8b8] group-hover:bg-[#eef5f1]">
                        <Icon className="size-4" aria-hidden strokeWidth={1.5} />
                      </span>

                      <h3 className="mb-2 text-sm font-bold text-foreground md:text-[15px]">
                        {t(`home.capabilities.${tk}`)}
                      </h3>
                      <p className="max-w-[70%] text-[11px] leading-relaxed text-muted-foreground md:text-xs">
                        {t(`home.capabilities.${bk}`)}
                      </p>

                      <a
                        href="#"
                        className="mt-auto pt-4 inline-flex items-center gap-1 text-[11px] font-medium text-[#5b8a76] transition-colors hover:text-[#3d6d5b]"
                      >
                        {t(`home.capabilities.explore.${tk}`)}
                        <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" aria-hidden strokeWidth={2} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Full Width Card (Multilingual Assistance) */}
              {supportingFull.map(({ Icon, tk, bk, Svg }) => (
                <div
                  key={tk}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#dcebe3] bg-[#f9fcfb] p-5 transition-colors duration-300 hover:border-[#a9c8b8] hover:bg-white md:p-6"
                >
                  {/* Background Illustration */}
                  <div className="pointer-events-none absolute -right-6 top-1/2 h-24 w-36 -translate-y-1/2 opacity-80 transition-opacity duration-300 group-hover:opacity-100">
                    <Svg />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex h-full flex-col">
                    <span className="mb-3 flex size-9 items-center justify-center rounded-lg border border-[#dcebe3] bg-white text-[#5b8a76] transition-colors group-hover:border-[#a9c8b8] group-hover:bg-[#eef5f1]">
                      <Icon className="size-4" aria-hidden strokeWidth={1.5} />
                    </span>

                    <h3 className="mb-2 text-sm font-bold text-foreground md:text-[15px]">
                      {t(`home.capabilities.${tk}`)}
                    </h3>
                    <p className="max-w-lg text-[11px] leading-relaxed text-muted-foreground md:text-xs">
                      {t(`home.capabilities.${bk}`)}
                    </p>

                    <a
                      href="#"
                      className="mt-auto pt-4 inline-flex items-center gap-1 text-[11px] font-medium text-[#5b8a76] transition-colors hover:text-[#3d6d5b]"
                    >
                      {t(`home.capabilities.explore.${tk}`)}
                      <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" aria-hidden strokeWidth={2} />
                    </a>
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