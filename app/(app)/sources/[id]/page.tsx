'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, ExternalLink, BookOpen, FileText, Globe, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ResourceData {
  id: string
  title: string
  type: string
  jurisdiction: string
  version?: string
  date?: string
  section?: string
  originalUrl?: string
  relevantPassage: string
  whyCited: string
  relatedSources?: Array<{
    id: string
    title: string
    type: string
  }>
}

const MOCK_RESOURCES: Record<string, ResourceData> = {
  'patents-act-1970-section-3-p': {
    id: 'patents-act-1970-section-3-p',
    title: 'Patents Act, 1970',
    type: 'Primary Legal Source',
    jurisdiction: 'India',
    version: 'Act 47 of 1970',
    date: '1970-09-19',
    section: 'Section 3(p)',
    originalUrl: 'https://legislative.gov.in/sites/default/files/A1970-47.pdf',
    relevantPassage: 'Section 3(p) of the Patents Act, 1970 states that a mere discovery of a new form of a known substance which does not result in the enhancement of the known efficacy of that substance, or the mere discovery of any new property or new use for a known substance, or of the mere use of a known process, machine or apparatus unless such known process results in a new product or employs at least one new reactant, is not considered an invention.',
    whyCited: 'This provision is relevant because it addresses the patentability of traditional knowledge and herbal formulations. It specifically excludes mere discoveries of known substances or their new properties from being patentable unless they result in enhanced efficacy.',
    relatedSources: [
      {
        id: 'tkdl',
        title: 'Traditional Knowledge Digital Library',
        type: 'Traditional Knowledge'
      }
    ]
  },
  'tkdl': {
    id: 'tkdl',
    title: 'Traditional Knowledge Digital Library',
    type: 'Traditional Knowledge Database',
    jurisdiction: 'International',
    version: 'v3.0',
    date: '2001-Present',
    section: 'Ayurveda Formulations',
    originalUrl: 'https://www.tkdl.res.in/',
    relevantPassage: 'The Traditional Knowledge Digital Library (TKDL) is a digital repository of traditional knowledge, particularly about medicinal plants and formulations used in Indian systems of medicine. It contains structured data on traditional formulations in multiple languages including Sanskrit, Hindi, Arabic, Persian, Urdu, and English.',
    whyCited: 'TKDL is cited as it provides documented evidence of traditional knowledge that may overlap with the herbal formulation in question. It serves as a prior art database for patent examiners to assess novelty and non-obviousness of traditional medicine-based inventions.',
    relatedSources: [
      {
        id: 'patents-act-1970-section-3-p',
        title: 'Patents Act, 1970 — Section 3(p)',
        type: 'Primary Legal Source'
      }
    ]
  }
}

const TYPE_ICONS: Record<string, any> = {
  'Primary Legal Source': FileText,
  'Traditional Knowledge': BookOpen,
  'Traditional Knowledge Database': BookOpen,
  'International': Globe,
  'India': Building2,
}

export default function ResourceDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const resourceId = params?.id ?? ''
  
  const resource = MOCK_RESOURCES[resourceId]

  if (!resource) {
    return (
      <main className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground">Resource not found</h1>
          <p className="mt-2 text-muted-foreground">The requested resource could not be found.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.back()}
          >
            Go back
          </Button>
        </div>
      </main>
    )
  }

  const TypeIcon = TYPE_ICONS[resource.type] || FileText
  const JurisdictionIcon = TYPE_ICONS[resource.jurisdiction] || Globe

  return (
    <main className="flex min-h-[calc(100vh-56px)] flex-col bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-sm md:px-6">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back to research chat"
          className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
        </button>
        <span className="text-sm font-semibold text-foreground">Resource Details</span>
      </div>

      {/* Content */}
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8 md:px-6">
        {/* Resource Header */}
        <div className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
              <TypeIcon className="size-3" />
              {resource.type}
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
              <JurisdictionIcon className="size-3" />
              {resource.jurisdiction}
            </span>
            {resource.version && (
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                {resource.version}
              </span>
            )}
            {resource.date && (
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                {resource.date}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-foreground md:text-4xl">
            {resource.title}
          </h1>

          {resource.section && (
            <p className="mt-2 text-lg text-muted-foreground">
              {resource.section}
            </p>
          )}
        </div>

        {/* Relevant Passage */}
        <div className="mb-8 rounded-lg border border-border bg-muted/30 p-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Relevant provision
          </h2>
          <p className="text-sm leading-relaxed text-foreground">
            {resource.relevantPassage}
          </p>
        </div>

        {/* Why Cited */}
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Why this source was used
          </h2>
          <p className="text-sm leading-relaxed text-foreground">
            {resource.whyCited}
          </p>
        </div>

        {/* Original Source Link */}
        {resource.originalUrl && (
          <div className="mb-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Original source
            </h2>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => window.open(resource.originalUrl, '_blank', 'noopener,noreferrer')}
            >
              <ExternalLink className="size-4" />
              Open official source
            </Button>
          </div>
        )}

        {/* Related Sources */}
        {resource.relatedSources && resource.relatedSources.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Related sources
            </h2>
            <div className="space-y-2">
              {resource.relatedSources.map((related) => (
                <button
                  key={related.id}
                  onClick={() => router.push(`/sources/${related.id}`)}
                  className="flex w-full items-center justify-between rounded-lg border border-border/50 bg-muted/30 px-4 py-3 text-left transition-colors hover:bg-muted/50"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {related.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {related.type}
                    </p>
                  </div>
                  <ExternalLink className="size-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-auto pt-8 border-t border-border/40">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="size-4" />
            Back to research chat
          </Button>
        </div>
      </div>
    </main>
  )
}
